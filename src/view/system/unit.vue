<template>
  <div>
    <Card>
      <Row style="display: flex; align-items: center">
        <Col span="6">
          <span style="font-size: 16px; font-weight: bold;">{{companyName}}</span>
        </Col>
        <Col span="6">
          <span>所属地：{{companyArea}}</span>
        </Col>
        <Col span="6">
          <span>人数：{{numbers}}</span>
        </Col>
        <Col span="6" style="text-align: right">
          <Button type="primary" @click="companyEdit">编辑</Button>
        </Col>
      </Row>
    </Card>
    <Row type="flex" justify="space-between" style="padding: 10px 0 20px">
      <Col span="12">
        <div class="searchInput">
          <div class="search">
            <Input search @on-search="handleSearch" placeholder="输入关键字搜索" type="text" enter-button="搜索">
            <span slot="prepend">单位名称:</span>
            </Input>
          </div>
          <Button class="search-btn" icon="ios-funnel-outline" @click="openFilter"><Icon type="search"/>筛选</Button>
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
          <Button type="success" @click="onAdd">新增单位</Button>
        </div>
      </Col>
    </Row>
    <div class="filterPanel" v-if="filter===true">
      <Card :bordered="false">
        <Row>
          <Col span="12">
            <Row>
              <Col span="5">
                <span class="label">所属地:</span>
              </Col>
              <Col span="19">
                <Cascader :data="areaData" v-model="area1" @on-change="filterAreaChange"></Cascader>
              </Col>
            </Row>
          </Col>
          <Col span="12">
            <Row>
              <Col span="5">
                <span class="label">单位类型:</span>
              </Col>
              <Col span="19">
                <Select v-model="listParams.type" clearable>
                  <Option value="1">主营单位</Option>
                  <Option value="2">下属单位</Option>
                  <Option value="3">甲方单位</Option>
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
    <tables ref="tables" :total="this.total" :on-change="pageChange" :on-page-size-change="pageSizeChange" v-model="tableData" :columns="columns" @on-edit="onEdit" @on-selection-change="onSelectionChange"></tables>
    <Modal
      v-model="editPanel"
      @on-cancel="closeEdit"
      width="600"
      :title="editType === 0 ? '新增单位' : '编辑单位'">
      <Form ref="editParams" :model="editParams" :rules="ruleValidate" :label-width="120">
        <FormItem label="单位名称" prop="name">
          <Input v-model="editParams.name" placeholder="请输入单位名称"/>
        </FormItem>
        <FormItem label="所属地" prop="provinceId">
          <Cascader :data="areaData" v-model="area2" @on-change="editAreaChange"></Cascader>
        </FormItem>
        <FormItem label="是否设为甲方单位" prop="isFirstParty" v-if="this.editType===0">
          <RadioGroup v-model="editParams.isFirstParty">
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
import { getUnitList, addOffice, delOffice, areaData, getHeadOffice } from '@/api/data'
import { getUserId } from '@/libs/util'
export default{
  name: 'unit_table_page',
  components: { Tables },
  data () {
    return {
      companyData: null,
      companyName: '',
      companyArea: '',
      numbers: 0,
      listParams: {
        'pageSize': 10,
        'page': 1,
        'name': '',
        'type': '',
        'provinceId': '',
        'cityId': '',
        'districtId': '',
        'userId': getUserId()
      },
      total: 0,
      tableData: [],
      areaData: [],
      area1: [],
      area2: [],
      editParams: {
        name: '',
        isFirstParty: '',
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        districtId: '',
        districtName: '',
        userId: getUserId()
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        provinceId: [
          { required: true, message: '请选择所属地' }
        ],
        isFirstParty: [
          { required: true, message: '请选择是否设为甲方单位', trigger: 'change' }
        ]
      },
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
      filter: false,
      editPanel: false,
      editType: 0,
      rowId: [],
      deletePanel: false
    }
  },
  watch: {
    listParams: {
      handler (val) {
        console.log(val)
        if (val.type === undefined) {
          this.listParams.type = ''
        }
      },
      deep: true
    }
  },
  methods: {
    companyEdit () {
      this.editType = 1
      this.area2 = ['1', this.companyData.provinceId, this.companyData.cityId, this.companyData.districtId]
      this.editParams = {
        id: this.companyData.id,
        name: this.companyData.name,
        provinceId: this.companyData.provinceId,
        provinceName: this.companyData.provinceName,
        cityId: this.companyData.cityId,
        cityName: this.companyData.cityName,
        districtId: this.companyData.districtId,
        districtName: this.companyData.districtName,
        userId: getUserId()
      }
      this.editPanel = true
    },
    filterAreaChange () {
      let value = arguments[1].slice(1, arguments[1].length).map((item) => {
        return item.value
      })
      this.listParams.provinceId = value[0]
      this.listParams.cityId = value[1]
      this.listParams.districtId = value[2]
    },
    editAreaChange () {
      let value = arguments[1].slice(1, arguments[1].length).map((item) => {
        return item.value
      })
      let label = arguments[1].slice(1, arguments[1].length).map((item) => {
        return item.label
      })
      this.editParams.provinceId = value[0]
      this.editParams.cityId = value[1]
      this.editParams.districtId = value[2]
      this.editParams.provinceName = label[0]
      this.editParams.cityName = label[1]
      this.editParams.districtName = label[2]
    },
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
                'userId': getUserId()
              }
              delOffice(params).then((res) => {
                this.$Message.info(res.data.msg)
                this.getData()
              })
            }
          })
        }
      }
    },
    // 打开筛选
    openFilter () {
      this.filter = !this.filter
    },
    onAdd () {
      this.editType = 0
      this.editParams = {
        name: '',
        isFirstParty: '',
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        districtId: '',
        districtName: '',
        userId: getUserId()
      }
      this.editPanel = true
    },
    // 编辑
    onEdit () {
      this.editType = 1
      this.area2 = ['1', arguments[0].row.provinceId, arguments[0].row.cityId, arguments[0].row.districtId]
      this.editParams = {
        id: arguments[0].row.id,
        name: arguments[0].row.name,
        provinceId: arguments[0].row.provinceId,
        provinceName: arguments[0].row.provinceName,
        cityId: arguments[0].row.cityId,
        cityName: arguments[0].row.cityName,
        districtId: arguments[0].row.districtId,
        districtName: arguments[0].row.districtName,
        userId: getUserId()
      }
      this.editPanel = true
    },
    // 关闭编辑面板
    closeEdit () {
      this.editPanel = false
      this.area2 = []
      if (this.editType === 1) {
        this.editParams = {
          id: '',
          name: '',
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          districtId: '',
          districtName: '',
          userId: getUserId()
        }
      }
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
      this.$refs['editParams'].validate((valid) => {
        if (valid) {
          addOffice(this.editParams).then(res => {
            if (res.data.status === '200') {
              this.$Message.success(res.data.msg)
              this.editPanel = false
              this.$refs['editParams'].resetFields()
              this.getData()
            } else {
              this.$Message.info(res.data.msg)
            }
          })
        } else {
          this.editPanel = true
        }
      })
    },
    pageChange (page) {
      this.listParams.page = page
      this.getData()
    },
    pageSizeChange (size) {
      this.listParams.pageSize = size
      this.getData()
    },
    getData () {
      getUnitList(this.listParams).then(res => {
        if (res.data.status === '200') {
          res.data.data.list.forEach((item) => {
            item.area = (item.provinceName || '') + (item.cityName || '') + (item.districtName || '')
          })
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
      getHeadOffice().then((res) => {
        this.companyData = res.data.data
        this.companyName = res.data.data.name
        this.companyArea = (res.data.data.provinceName ? res.data.data.provinceName : '') + (res.data.data.cityName ? res.data.data.cityName : '') + (res.data.data.districtName ? res.data.data.districtName : '')
        this.numbers = res.data.data.num
      })
    },
    // 搜索
    handleSearch (val) {
      this.listParams.name = val
      this.getData()
    },
    // 筛选提交
    filterSubmit () {
      this.getData()
    },
    // 筛选重置
    filterReset () {
      this.listParams.type = ''
      this.listParams.provinceId = ''
      this.listParams.cityId = ''
      this.listParams.districtId = ''
      this.area1 = []
    }
  },
  mounted () {
    this.getData()
    getHeadOffice().then((res) => {
      this.companyData = res.data.data
      this.companyName = res.data.data.name
      this.companyArea = (res.data.data.provinceName ? res.data.data.provinceName : '') + (res.data.data.cityName ? res.data.data.cityName : '') + (res.data.data.districtName ? res.data.data.districtName : '')
      this.numbers = res.data.data.num
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
  .ivu-select{
    margin-bottom: 10px;
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
      margin-top: 6px;
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
