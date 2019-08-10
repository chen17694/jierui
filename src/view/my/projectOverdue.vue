<template>
  <div>
    <Input search @on-search="handleSearch" placeholder="输入关键字搜索" type="text" enter-button="搜索" style="width: 300px" />
    <p style="font-weight: bold; font-size: 15px; margin: 15px 0">项目逾期数量:{{this.total}}</p>
    <tables ref="tables" :total="this.total" v-model="tableData" :columns="columns" @on-urge="urge" :on-change="pageChange" :on-page-size-change="pageSizeChange"></tables>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { listOverdueProject, projectFunction } from '@/api/data'
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
        { title: '截止日期', key: 'endTime' },
        { title: '逾期天数', key: 'days' },
        {
          title: '催办',
          key: 'handle',
          options: ['urge']
        }
      ],
      projectId: ''
    }
  },
  methods: {
    handleSearch () {
      this.params.name = arguments[0]
      this.getData()
    },
    urge () {
      console.log(arguments[0].row)
      projectFunction({
        projectId: arguments[0].row.id,
        userId: getUserId(),
        functionType: '6'
      }).then((res) => {
        this.$Message.info(res.data.msg)
      })
    },
    pageSizeChange (val) {
      console.log(val)
      this.params.pageSize = val
      this.getData()
    },
    pageChange (val) {
      console.log(val)
      this.params.page = val
      this.getData()
    },
    getData () {
      listOverdueProject(this.params).then((res) => {
        if (res.data.status === '200') {
          this.tableData = res.data.data.list
          this.total = res.data.data.num
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped lang="less">
</style>
