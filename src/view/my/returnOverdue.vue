<template>
  <div>
    <Input search @on-search="handleSearch" placeholder="输入关键字搜索" type="text" enter-button="搜索" style="width: 300px; float: left"  />
    <Button @click="openFilter" icon="ios-funnel-outline" style="margin-left: 10px"><Icon type="search"/>筛选</Button>
    <Card v-show="filter === true" style="margin: 20px 0 10px 0">
      <div class="filter" style="display: flex; justify-content: space-between;">
        <div>
          <span style="margin-right: 10px">
            项目：
            <Select v-model="params.projectId" style="width:200px" @on-change="changeProject" filterable clearable>
              <Option v-for="(item, index) in projectList" :value="item.id" :label="item.name" :key="index">{{ item.name }}</Option>
            </Select>
          </span>
          <span>
            任务：
              <Select v-model="params.taskId" style="width:200px" filterable clearable>
                <Option v-for="item in taskList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
          </span>
        </div>
        <div>
          <Button type="primary" @click="filterSave" style="margin-right: 10px">确定</Button>
          <Button @click="clearFilter">重置</Button>
        </div>
      </div>
    </Card>
    <p style="font-weight: bold; font-size: 15px; margin: 15px 0">物资归还逾期数量:{{this.total}}</p>
    <tables ref="tables" :total="this.total" @on-row-dblclick="onRowClick" v-model="tableData" :columns="columns" @on-urge="urge" :on-change="pageChange" :on-page-size-change="pageSizeChange"></tables>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { listOverdueMaterial, overdueRush, listProject, listTask } from '@/api/data'
import { getUserId } from '@/libs/util'
export default{
  name: 'unit_table_page',
  components: { Tables },
  data () {
    return {
      params: {
        pageSize: 10,
        page: 1,
        name: '',
        userId: getUserId(),
        status: '',
        projectId: '',
        taskId: '',
        materialCategoryId: ''
      },
      total: 0,
      tableData: [],
      columns: [
        { title: '项目名称', key: 'projectName' },
        { title: '任务名称', key: 'taskName' },
        { title: '物资名称', key: 'materialName' },
        { title: '物资数量', key: 'materialNum' },
        { title: '归还日期', key: 'endTime' },
        { title: '逾期天数', key: 'days' },
        {
          title: '催办',
          key: 'handle',
          options: ['urge']
        }
      ],
      filter: false,
      projectList: [],
      taskList: []
    }
  },
  methods: {
    onRowClick () {
      this.$router.push({
        name: 'myMaterialDetail',
        query: {
          id: arguments[0].id
        }
      })
    },
    getListProject () {
      listProject({
        pageSize: 100,
        page: 1,
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
        this.projectList = res.data.data.projectList
      })
    },
    pageChange (page) {
      this.params.page = page
      this.getData()
    },
    pageSizeChange (size) {
      this.params.pageSize = size
      this.getData()
    },
    clearFilter () {
      this.params.projectId = ''
      this.params.taskId = ''
      this.taskList = []
    },
    filterSave () {
      this.getData()
    },
    openFilter () {
      this.filter = !this.filter
    },
    handleSearch () {
      this.params.name = arguments[0]
      this.getData()
    },
    changeProject () {
      this.params.taskId = ''
      this.getListTask(arguments[0])
    },
    getListTask (id) {
      if (!id) return false
      listTask({
        pageSize: 100,
        page: 1,
        businessProjectId: id,
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
        this.taskList = res.data.data.taskDetailBeans
      })
    },
    urge () {
      overdueRush({
        taskMaterialId: arguments[0].row.id,
        userId: getUserId()
      }).then((res) => {
        this.$Message.info(res.data.msg)
      })
    },
    getData () {
      listOverdueMaterial(this.params).then((res) => {
        if (res.data.status === '200') {
          this.tableData = res.data.data.list
          this.total = res.data.data.num
        }
      })
    }
  },
  mounted () {
    this.getData()
    this.getListProject()
  }
}
</script>

<style scoped lang="less">
</style>
