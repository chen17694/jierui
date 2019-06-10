<template>
  <div>
    <Row type="flex" justify="space-between" style="padding: 10px 0">
      <Col span="12">
        <div class="searchInput">
          <div class="search">
            <Input search @on-search="handleSearch" placeholder="输入关键字搜索" type="text" enter-button="搜索">
            <span slot="prepend">单位名称:</span>
            </Input>
          </div>
          <Button class="search-btn" type="primary" @click="openFilter"><Icon type="search"/>筛选</Button>
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
          <Button type="success" @click="onAdd">新增单位</Button>
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
                <Select v-model="areaId">
                  <Option v-for="item in regionData" :value="item.areaId" :key="item.areaId">{{ item.value }}</Option>
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
                <Select v-model="type">
                  <Option value="1">主营单位</Option>
                  <Option value="2">下属单位</Option>
                  <Option value="3">甲方单位</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="24">
            <div class="btns">
              <Button type="primary" @click="filterSubmit ">确定</Button>
              <Button @click="filterReset">重置</Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
    <tables ref="tables" :total="this.total" :on-change="this.pageChange" :on-page-size-change="this.PageSizeChange" v-model="tableData" :columns="columns" @on-edit="onEdit" @on-selection-change="onSelectionChange"></tables>
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
      @on-cancel="closeEdit"
      :title="modalType === 0 ? '新增单位' : '编辑单位'">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <FormItem label="单位名称" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入单位名称"></Input>
        </FormItem>
        <FormItem label="所属地" prop="areaId ">
          <Select v-model="formValidate.areaId " placeholder="请选择">
            <Option value="北京">北京</Option>
            <Option value="沈阳">沈阳</Option>
          </Select>
        </FormItem>
        <FormItem label="是否设为甲方单位" prop="isFirstParty">
          <RadioGroup v-model="formValidate.isFirstParty">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="closeEdit">取消</Button>
        <Button type="primary" size="large" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getUnitList, getRegion, addOffice, delOffice } from '@/api/data'
export default{
  name: 'unit_table_page',
  components: { Tables },
  data () {
    return {
      params: {
        'pageSize': 10,
        'page': 1,
        'name': '',
        'areaId': '',
        'type': '',
        'userId': 'd3c6b26c272f4b0c96ec8f7a3062230b'
      },
      formValidate: {
        name: '',
        areaId: '',
        isFirstParty: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请选择所属地', trigger: 'change' }
        ],
        isFirstParty: [
          { required: true, message: '请选择是否设为甲方单位', trigger: 'change' }
        ]
      },
      panel: false,
      region: '',
      type: '',
      areaId: '',
      newUnitPanel: false,
      modalType: 0,
      rowId: [],
      deletePanel: false,
      total: 0,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        { title: '单位名称', key: 'name' },
        { title: '所属地', key: 'area' },
        { title: '单位人数', key: 'num' },
        { title: '单位类型',
          key: 'type',
          render: (h, params) => {
            console.log(params)
            let text = ''
            if (params.row.type === '1') {
              text = '主管单位'
            } else if (params.row.type === '2') {
              text = '下属单位'
            } else {
              text = '甲方单位'
            }
            return h('div', { props: {} }, text)
          }
        },
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
    // 批量删除
    dropdownClick (name) {
      this.rowId = this.rowId.map((item) => {
        return String(item)
      })
      if (name === '批量删除') {
        if (this.rowId.length > 0) {
          this.$Modal.confirm({
            title: '是否执行删除操作',
            content: '<p>删除后不能找回，还要继续吗</p>',
            onOk: () => {
              let params = {
                'ids': this.rowId,
                'userId': 'd3c6b26c272f4b0c96ec8f7a3062230b'
              }
              delOffice(params).then((res) => {
                if (res.data.status === '200') {
                  this.$Message.info('删除成功！')
                  this.getData()
                } else {
                  this.$Message.info('操作失败，请重试！')
                }
              })
            }
          })
        }
      }
    },
    // 打开筛选
    openFilter () {
      this.panel = !this.panel
    },
    onAdd () {
      this.modalType = 0
      this.newUnitPanel = true
    },
    // 关闭编辑面板
    closeEdit () {
      this.newUnitPanel = false
      this.$refs['formValidate'].resetFields()
    },
    // 编辑
    onEdit () {
      this.modalType = 1
      this.formValidate = {
        id: arguments[0].row.id,
        name: arguments[0].row.name,
        area: arguments[0].row.area,
        isFirstParty: arguments[0].row.type === '3' ? '1' : '0'
      }
      this.newUnitPanel = true
    },
    // 选择
    onSelectionChange (row) {
      this.rowId = []
      row.forEach((item) => {
        this.rowId.push(item.id)
      })
    },
    // 新建&编辑提交
    handleSubmit () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          let params = {}
          if (this.modalType === 1) {
            params = {
              'id': this.formValidate.id,
              'name': this.formValidate.name,
              'areaId': this.formValidate.areaId,
              'isFirstParty': this.formValidate.isFirstParty,
              'userId': 'd3c6b26c272f4b0c96ec8f7a3062230b'
            }
          } else {
            params = {
              'name': this.formValidate.name,
              'areaId': this.formValidate.areaId,
              'isFirstParty': this.formValidate.isFirstParty,
              'userId': 'd3c6b26c272f4b0c96ec8f7a3062230b'
            }
          }
          addOffice(params).then(res => {
            if (res.data.status === '200') {
              this.$Message.success('操作成功!')
              this.newUnitPanel = false
              this.$refs['formValidate'].resetFields()
              this.getData()
            } else {
              this.$Message.info('操作失败，请重试！')
            }
          })
        } else {
          this.newUnitPanel = true
        }
      })
    },
    pageChange (page) {
      this.params.page = page
      this.getData()
    },
    PageSizeChange (size) {
      this.params.pageSize = size
      this.getData()
    },
    getData () {
      getUnitList(this.params).then(res => {
        if (res.data.status === '200') {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$Message.info('操作失败，请重试！')
        }
      })
    },
    // 搜索
    handleSearch (val) {
      this.params.name = val
      this.getData()
    },
    // 筛选提交
    filterSubmit () {
      this.params.areaId = this.areaId
      this.params.type = this.type
      this.getData()
    },
    // 筛选重置
    filterReset () {
      this.region = ''
      this.type = ''
    }
  },
  mounted () {
    this.getData()
    getRegion().then(res => {
      console.log(res)
      this.regionData = res.data
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
