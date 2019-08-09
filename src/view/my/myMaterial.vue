<template>
  <div>
    <Row type="flex" justify="space-between" style="padding: 10px 0">
      <Col span="12">
        <div class="searchInput">
          <div class="search">
            <Input search @on-search="handleSearch" type="text" enter-button="搜索">
            <span slot="prepend">物资名称:</span>
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
              <DropdownItem name="批量归还">批量归还</DropdownItem>
              <DropdownItem name="取消">取消</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button type="success" @click="apply">物资申请</Button>
        </div>
      </Col>
    </Row>
    <div class="filterPanel" v-if="filter===true">
      <Card :bordered="false">
        <Row>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">项目:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.projectId" @on-change="projectChange">
                  <Option v-for="(item, index) in businessProject" :value="item.id " :key="index">{{item.name}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">任务:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.taskId">
                  <Option v-for="(item, index) in taskList" :key="index" :value="item.id">{{item.name}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="24">
            <div class="btns">
              <Button type="primary" @click="getData()">确定</Button>
              <Button @click="filterReset">重置</Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
    <tables ref="tables" @on-row-click="onRowClick" :total="this.total" v-model="tableData" :columns="columns" @on-back="onBack" @on-selection-change="onSelectionChange"></tables>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { listMyMaterial, listProject, listTask, materialReturn } from '@/api/data'
import { getUserId } from '@/libs/util'
export default {
  name: 'myMaterial',
  components: { Tables },
  data () {
    return {
      filter: false,
      rowId: [],
      total: 0,
      tableData: [],
      params: {
        pageSize: 10,
        page: 1,
        id: 'dea2ebe067494cb782c3b123e5740989',
        name: '',
        projectId: '',
        taskId: ''
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        { title: '物资名称', key: 'name' },
        { title: '物资总数', key: 'amount' },
        { title: '剩余数量', key: 'surplusAmount' },
        { title: '出借数量', key: 'lendAmount' },
        { title: '所属单位', key: 'officeName' },
        { title: '物资类型', key: 'materialCategoryName' },
        {
          title: '操作',
          key: 'handle',
          options: ['back']
        }
      ],
      businessProject: [],
      taskList: []
    }
  },
  methods: {
    handleSearch () {
      this.params.name = arguments[0]
      this.getData()
    },
    openFilter () {
      this.filter = !this.filter
    },
    onSelectionChange (row) {
      this.rowId = []
      row.forEach((item) => {
        this.rowId.push({
          materialId: item.materialId,
          amount: item.amount
        })
      })
    },
    onRowClick () {
      this.$router.push({
        name: 'myMaterialDetail',
        query: {
          id: arguments[0].id
        }
      })
    },
    getData () {
      listMyMaterial(this.params).then((res) => {
        console.log(res.data.data)
        if (res.data.status === '200') {
          this.tableData = res.data.data.businessTaskMaterialBeanList
          this.total = Number(res.data.data.count)
        }
      })
    },
    apply () {
      this.$router.push({
        name: 'applyMaterial'
      })
    },
    onBack () {
      let materialReturnParameterList = [{
        taskMaterialId: arguments[0].row.materialId,
        returnNum: arguments[0].row.amount
      }]
      materialReturn({
        userId: getUserId(),
        materialReturnParameterList
      }).then((res) => {
        this.$Message.info(res.data.msg)
      })
    },
    filterReset () {
      this.params.projectId = ''
      this.params.taskId = ''
    },
    projectChange () {
      this.taskList = []
      this.params.taskId = ''
      listTask({
        pageSize: 0,
        page: 0,
        businessProjectId: arguments[0],
        type: '',
        name: '',
        taskStatus: '',
        firstPartyScoring: '',
        userId: getUserId(),
        timeStatus: '',
        startTime: '',
        endTime: '',
        provinceName: '',
        cityName: '',
        districtName: ''
      }).then((res) => {
        console.log(res)
        this.taskList = res.data.data.taskDetailBeans
      })
    },
    getProject () {
      listProject({
        pageSize: 0,
        page: 0,
        userId: getUserId(),
        projectName: '',
        firstPartyCompanyId: '',
        projectManagerId: '',
        status: '',
        firstPartyScoring: '',
        provinceName: '',
        cityName: '',
        districtName: '',
        timeStatus: '',
        startTime: '',
        endTime: ''
      }).then((res) => {
        this.businessProject = res.data.data.projectList
      })
    },
    // 批量删除
    dropdownClick (name) {
      if (name === '批量归还') {
        if (this.rowId.length > 0) {
          this.$Modal.confirm({
            title: '确定要批量归还吗？',
            onOk: () => {
              let materialReturnParameterList = []
              this.rowId.forEach((item) => {
                materialReturnParameterList.push({
                  taskMaterialId: item.materialId,
                  returnNum: item.amount
                })
              })
              console.log(materialReturnParameterList)
              materialReturn({
                userId: getUserId(),
                materialReturnParameterList
              }).then((res) => {
                this.$Message.info(res.data.msg)
              })
            }
          })
        }
      }
    }
  },
  mounted () {
    this.getData()
    this.getProject()
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
</style>
