<template>
  <div>
    <Input search @on-search="handleSearch" placeholder="输入关键字搜索" type="text" enter-button="搜索" style="width: 300px; float: left"  />
    <Button type="primary" @click="openFilter" style="margin-left: 10px">筛选</Button>
    <Card v-show="filter === true" style="margin: 20px 0 10px 0">
      <div class="filter" style="display: flex; justify-content: space-between;">
        <div>
          项目：
          <Select v-model="params.projectId" style="width:200px">
            <Option v-for="(item, index) in projectList" :value="item.id" :label="item.name" :key="index">{{ item.name }}</Option>
          </Select>
        </div>
        <div>
          <Button type="primary" @click="filterSave" style="margin-right: 10px">确定</Button>
          <Button @click="clearFilter">重置</Button>
        </div>
      </div>
    </Card>
    <p style="font-weight: bold; font-size: 15px; margin: 15px 0">任务逾期数量:{{this.total}}</p>
    <tables ref="tables" :total="this.total" @on-row-dblclick="onRowClick" v-model="tableData" :columns="columns" @on-urge="urge" :on-change="pageChange" :on-page-size-change="pageSizeChange"></tables>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { listOverdueTask, taskFunction, listProject } from '@/api/data'
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
        taskId: ''
      },
      total: 0,
      tableData: [],
      columns: [
        { title: '项目名称', key: 'projectName' },
        { title: '任务名称', key: 'taskName' },
        {
          title: '任务类型',
          key: 'taskType',
          render: (h, params) => {
            let text = ''
            if (params.row.taskType === '1') {
              text = '巡检任务'
            } else if (params.row.taskType === '2') {
              text = '优化任务'
            } else if (params.row.taskType === '3') {
              text = '宣传任务'
            }
            return h('div', { props: {} }, text)
          }
        },
        { title: '截止日期', key: 'endTime' },
        { title: '逾期天数', key: 'days' },
        {
          title: '催办',
          key: 'handle',
          options: ['urge']
        }
      ],
      filter: false,
      projectList: []
    }
  },
  methods: {
    onRowClick () {
      this.$router.push({
        name: 'taskDetail',
        query: {
          taskId: arguments[0].id
        }
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
    clearFilter () {
      this.params.projectId = ''
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
    urge () {
      taskFunction({
        taskId: arguments[0].row.id,
        userId: getUserId(),
        functionType: '4'
      }).then((res) => {
        this.$Message.info(res.data.msg)
      })
    },
    getData () {
      listOverdueTask(this.params).then((res) => {
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
