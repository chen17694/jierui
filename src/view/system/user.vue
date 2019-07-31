<template>
  <div>
    <Row slot="unitHandle" type="flex" justify="space-between" style="padding: 10px 0">
      <Col span="12">
        <div class="searchInput">
          <div class="search">
            <Input search @on-search="onSearch" placeholder="请输入用户姓名关键字" type="text" enter-button="搜索">
            <span slot="prepend">姓名:</span>
            </Input>
          </div>
          <Button class="search-btn" type="primary" @click="openFilter"><Icon type="search"/>筛选</Button>
        </div>
      </Col>
      <Col span="12">
        <div style="float: right">
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
    <div slot="filterPanel" class="filterPanel" v-if="filterPanel===true">
      <Card :bordered="false">
        <Row>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">归属单位:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.office" @on-change="selectUnit">
                  <Option v-for="item in unitList" :value="item.id" :key="item.id">{{item.name}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">角色:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.role">
                  <Option v-for="item in roleList" :value="item.id" :key="item.id">{{item.name}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <!--<Col span="12" style="margin-bottom: 16px">-->
            <!--<Row>-->
              <!--<Col span="5">-->
                <!--<span class="label">所属地:</span>-->
              <!--</Col>-->
              <!--<Col span="19">-->
                <!--<Cascader :data="areaData" v-model="params.area"></Cascader>-->
              <!--</Col>-->
            <!--</Row>-->
          <!--</Col>-->
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">APP登录:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.isLoginApp">
                  <Option value="1">是</Option>
                  <Option value="0">否</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="24">
            <div class="btns">
              <Button type="primary" @click="filterSubmit">确定</Button>
              <Button @click="filterReset">重置</Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
    <tables ref="tables" search-place="top" v-model="tableData" :columns="columns" @on-edit="onEdit" @on-select="onSelect" @on-selection-change="onSelectionChange"></tables>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getUserList, deleteUser, getUnitList, listRoleByOfficeId, areaData } from '@/api/data'
import { getUserId } from '@/libs/util'
export default{
  name: 'unit_table_page',
  components: { Tables },
  data () {
    return {
      params: {
        'pageSize': 10,
        'page': 1,
        'name': '',
        'office': '',
        'role': '',
        'isLoginApp': ''
      },
      total: 0,
      unitList: [],
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
      filterPanel: false,
      region: '',
      isApp: '',
      role: '',
      unit: '',
      rowId: [],
      deletePanel: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        { title: '用户名', key: 'loginName' },
        { title: '姓名', key: 'name' },
        { title: '邮箱', key: 'email' },
        { title: '手机号码', key: 'phone' },
        { title: '归属单位', key: 'office' },
        { title: '角色', key: 'role' },
        { title: '所属地', key: 'area' },
        { title: 'APP登录', key: 'isLoginApp' },
        {
          title: '操作',
          key: 'handle',
          options: ['edit']
        }
      ],
      tableData: [],
      roleList: [],
      areaData: []
    }
  },
  methods: {
    selectUnit () {
      listRoleByOfficeId({
        id: arguments[0]
      }).then((res) => {
        console.log(res)
        if (res.data.status === '200') {
          this.roleList = res.data.data
        }
      })
    },
    // 批量删除
    dropdownClick (name) {
      if (name === '批量删除') {
        if (this.rowId.length > 0) {
          this.$Modal.confirm({
            title: '是否执行删除操作',
            content: '<p>删除后不能找回，还要继续吗</p>',
            onOk: () => {
              let params = {
                'ids': this.rowId,
                'userId': getUserId()
              }
              deleteUser(params).then((res) => {
                this.$Message.info(res.data.msg)
                this.getData()
              })
            }
          })
        }
      }
    },
    // 新增用户
    addUser () {
      this.$router.push({
        name: 'addUser'
      })
    },
    onEdit () {
      console.log(arguments[0].row)
      this.$router.push({
        name: 'editUser',
        params: {
          row: arguments[0].row
        }
      })
    },
    // 打开筛选
    openFilter () {
      this.filterPanel = !this.filterPanel
    },
    // 单选
    onSelect (row) {
      this.rowId = []
      row.forEach((item) => {
        this.rowId.push(item.id)
      })
      console.log(this.rowId)
    },
    // 全选
    onSelectionChange (row) {
      this.rowId = []
      row.forEach((item) => {
        this.rowId.push(item.id)
      })
      console.log(this.rowId)
    },
    // 搜索
    onSearch (val) {
      this.params.name = val
      this.getData()
    },
    // 筛选提交
    filterSubmit () {
      this.getData()
    },
    // 筛选重置
    filterReset () {
      this.region = ''
      this.isApp = ''
      this.role = ''
      this.unit = ''
    },
    getData () {
      getUserList(this.params).then(res => {
        if (res.data.status === '200') {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
    }
  },
  mounted () {
    this.getData()
    getUnitList({
      'pageSize': 0,
      'page': 0,
      'name': '',
      'areaId': '',
      'type': '',
      'userId': getUserId()
    }).then(res => {
      if (res.data.status === '200') {
        this.unitList = res.data.data.list
      }
    })
    areaData().then(res => {
      if (res.data.status === '200') {
        this.areaData = res.data.data
      }
    })
  }
}
</script>

<style scoped lang="less">
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
      text-align: center;
      .ivu-btn-primary{
        margin-right: 10px;
      }
      .ivu-btn{
        width: 80px;
      }
    }
  }
  .ivu-cascader{
    /deep/ .ivu-select-dropdown{
      width: 100%;
    }
  }
</style>
