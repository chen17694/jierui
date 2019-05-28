<template>
  <div>
    <Row slot="unitHandle" type="flex" justify="space-between" style="padding: 10px 0">
      <Col span="12">
        <div class="searchInput">
          <div class="search">
            <Input search @on-search="handleSearch" placeholder="请输入用户姓名关键字" type="text" enter-button="搜索">
            <span slot="prepend">姓名:</span>
            </Input>
          </div>
          <Button class="search-btn" type="primary" @click="open('筛选')"><Icon type="search"/>筛选</Button>
        </div>
      </Col>
      <Col span="12">
        <div class="handle">
          <Dropdown @on-click="dropdownClick" style="margin-right: 10px">
            <Button type="primary" ghost>
              选择操作
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem name="批量删除">批量删除</DropdownItem>
              <DropdownItem name="取消">取消</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button type="success" @click="addUser">新增用户</Button>
        </div>
      </Col>
    </Row>
    <div slot="filterPanel" class="filterPanel" v-if="panel===true">
      <Card :bordered="false">
        <Row>
          <Col span="12">
            <Row>
              <Col span="5">
                <span class="label">所属地:</span>
              </Col>
              <Col span="19">
                <Select v-model="region">
                  <Option v-for="item in regionData" :value="item.value" :key="item.id">{{ item.value }}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12">
            <Row>
              <Col span="5">
                <span class="label">单位类型:</span>
              </Col>
              <Col span="19">
                <Select v-model="unitType">
                  <Option v-for="item in typeData" :value="item.value" :key="item.id">{{ item.value }}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="24">
            <div class="btns">
              <Button type="primary" @click="filter">确定</Button>
              <Button @click="reset">重置</Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
    <tables ref="tables" search-place="top" v-model="tableData" :columns="columns" @on-edit="onEdit" @on-select="onSelect" @on-selection-change="onSelectionChange"></tables>
    <Modal
      v-model="deletePanel"
      width="300"
      title=""
    >
      <div>
        <p>删除后不能找回，还要继续吗？</p>
      </div>
      <div slot="footer">
        <Button type="text" size="large">取消</Button>
        <Button type="primary" size="large">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="newUnitPanel"
      @on-cancel="close('单位编辑')"
      :title="modalType === 0 ? '新增单位' : '编辑单位'">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <FormItem label="单位名称" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入单位名称"></Input>
        </FormItem>
        <FormItem label="所属地" prop="region">
          <Select v-model="formValidate.region" placeholder="请选择">
            <Option value="北京">北京</Option>
            <Option value="沈阳">沈阳</Option>
          </Select>
        </FormItem>
        <FormItem label="是否设为甲方单位" prop="partyA">
          <RadioGroup v-model="formValidate.partyA">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="close('单位编辑')">取消</Button>
        <Button type="primary" size="large" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getUnitTableData, getUnitRegion, getUnitType } from '@/api/data'
export default{
  name: 'unit_table_page',
  components: { Tables },
  data () {
    return {
      formValidate: {
        name: '',
        region: '',
        partyA: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择所属地', trigger: 'change' }
        ],
        partyA: [
          { required: true, message: '请选择是否设为甲方单位', trigger: 'change' }
        ]
      },
      panel: false,
      region: '',
      unitType: '',
      newUnitPanel: false,
      modalType: 0,
      rowId: [],
      deletePanel: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        { title: 'ID', key: 'id' },
        { title: '用户名', key: 'nickName' },
        { title: '姓名', key: 'name' },
        { title: '邮箱', key: 'email' },
        { title: '手机号码', key: 'phoneNumber' },
        { title: '归属单位', key: 'unit' },
        { title: '角色', key: 'role' },
        { title: '所属地', key: 'region' },
        { title: 'APP登录', key: 'app' },
        {
          title: '操作',
          key: 'handle',
          options: ['edit']
        }
      ],
      tableData: []
    }
  },
  methods: {
    dropdownClick (name) {
      if (name === '批量删除') {
        if (this.rowId.length > 0) {
          this.$Modal.confirm({
            title: '是否执行删除操作',
            content: '<p>删除后不能找回，还要继续吗</p>',
            onOk: () => {
              this.$Message.info('删除成功！')
            }
          })
        }
      }
    },
    addUser () {
      this.$router.push({
        name: 'addUser'
      })
    },
    open (a) {
      switch (a) {
        case '新增单位' :
          this.modalType = 0
          this.newUnitPanel = true
          break
        case '筛选' :
          this.panel = !this.panel
          break
        default:
          return false
      }
    },
    close (a) {
      switch (a) {
        case '单位编辑' :
          this.newUnitPanel = false
          this.$refs['formValidate'].resetFields()
          break
        default:
          return false
      }
    },
    onEdit () {
      this.modalType = 1
      this.formValidate = {
        name: arguments[0].row.unit,
        region: arguments[0].row.region,
        partyA: arguments[0].row.partyA
      }
      this.newUnitPanel = true
    },
    onSelect (row) {
      this.rowId = []
      row.forEach((item) => {
        this.rowId.push(item.id)
      })
      console.log(this.rowId)
    },
    onSelectionChange (row) {
      this.rowId = []
      row.forEach((item) => {
        this.rowId.push(item.id)
      })
      console.log(this.rowId)
    },
    handleSubmit () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.$Message.success('操作成功!')
          this.newUnitPanel = false
          this.$refs['formValidate'].resetFields()
        } else {
          this.newUnitPanel = true
        }
      })
    },
    handleSearch (val) {
      console.log(val)
    },
    filter () {
      console.log(this.region ? this.region : '')
      console.log(this.unitType ? this.unitType : '')
    },
    reset () {
      this.region = ''
      this.unitType = ''
    }
  },
  mounted () {
    getUnitTableData().then(res => {
      console.log(res)
      this.tableData = res.data
    })
    getUnitRegion().then(res => {
      this.regionData = res.data
    })
    getUnitType().then(res => {
      this.typeData = res.data
    })
  }
}
</script>

<style scoped lang="less">
  .handle{
    float: right;
  }
  .searchInput{
    float: left;
    /deep/ .search-btn{
      height: 32px;
    }
  }
  .search{
    float: left;
    margin-right: 10px;
    /deep/ .ivu-input-group-prepend{
      background: none;
      border: 0 none;
    }
    /deep/ .ivu-input-search{
      border: 0 none;
    }
    /deep/ .ivu-input-search:before{
      content: none
    }
    .search-btn{
      float: right;
    }
  }
  .filterPanel{
    clear: both;
    padding: 0 0 10px 0;
    .label{
      display: block;
      text-align: right;
      padding-right: 10px;
      line-height: 32px;
    }
    .btns{
      margin-top: 16px;
      text-align: center;
      .ivu-btn-primary{
        margin-right: 10px;
      }
      .ivu-btn{
        width: 80px;
      }
    }
  }
</style>
