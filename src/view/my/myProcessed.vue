<template>
  <Tabs v-model="tab" :animated="false">
    <TabPane label="我的审核审批进度" name="myAudit">
      <tables :total="this.total"  v-model="tableData" @on-row-click="onRowClick" :columns="columns1" :on-change="this.pageChange" :on-page-size-change="this.PageSizeChange"></tables>
    </TabPane>
    <TabPane label="待我审批" name="waiting">
      <tables :total="this.total" v-model="tableData" @on-row-click="onRowClick" :columns="columns2" :on-change="this.pageChange" :on-page-size-change="this.PageSizeChange"></tables>
    </TabPane>
  </Tabs>
</template>

<script>
import Tables from '_c/tables'
import { listHistory, listWait } from '@/api/data'
import { getUserId } from '@/libs/util'
export default {
  name: 'myAudit',
  components: { Tables },
  data () {
    return {
      tab: 'myAudit',
      params: {
        pageSize: 10,
        page: 1,
        id: getUserId()
      },
      total: 0,
      tableData: [],
      columns1: [
        { title: '审核审批名称', key: 'name' },
        { title: '审核审批类型',
          key: 'type',
          render: (h, params) => {
            console.log(params)
            let text = ''
            if (params.row.type === '1') {
              text = '项目审核'
            } else if (params.row.type === '2') {
              text = '任务审核'
            } else if (params.row.type === '3') {
              text = '任务路口审核'
            } else if (params.row.type === '4') {
              text = '物资申请审批'
            } else if (params.row.type === '5') {
              text = '物资归还审批'
            } else if (params.row.type === '6') {
              text = '项目属性修改审批'
            } else if (params.row.type === '7') {
              text = '项目状态修改审批'
            } else if (params.row.type === '8') {
              text = '物资加入项目审批'
            } else if (params.row.type === '9') {
              text = '人员加入项目审批'
            }
            return h('div', { props: {} }, text)
          }
        },
        { title: '审批状态',
          key: 'approvalStatus',
          render: (h, params) => {
            console.log(params)
            let text = ''
            if (params.row.approvalStatus === '1') {
              text = '审核中'
            } else if (params.row.approvalStatus === '2') {
              text = '已完成'
            } else if (params.row.approvalStatus === '3') {
              text = '已驳回'
            } else if (params.row.approvalStatus === '4') {
              text = '已撤销'
            }
            return h('div', { props: {} }, text)
          }
        },
        { title: '审批人员', key: 'approverName' },
        { title: '手机号码', key: 'phone' }
      ],
      columns2: [
        { title: '审核审批名称', key: 'name' },
        { title: '审核审批类型',
          key: 'type',
          render: (h, params) => {
            console.log(params)
            let text = ''
            if (params.row.type === '1') {
              text = '项目审核'
            } else if (params.row.type === '2') {
              text = '任务审核'
            } else if (params.row.type === '3') {
              text = '任务路口审核'
            } else if (params.row.type === '4') {
              text = '物资申请审批'
            } else if (params.row.type === '5') {
              text = '物资归还审批'
            } else if (params.row.type === '6') {
              text = '项目属性修改审批'
            } else if (params.row.type === '7') {
              text = '项目状态修改审批'
            } else if (params.row.type === '8') {
              text = '物资加入项目审批'
            } else if (params.row.type === '9') {
              text = '人员加入项目审批'
            }
            return h('div', { props: {} }, text)
          }
        },
        { title: '申请人员', key: 'applicantName' },
        { title: '审批人员', key: 'approverName' },
        { title: '手机号码', key: 'phone' }
      ]
    }
  },
  watch: {
    tab: function () {
      this.params.pageSize = 10
      this.params.page = 1
      this.getData()
    }
  },
  methods: {
    pageChange (page) {
      this.params.page = page
      this.getData()
    },
    PageSizeChange (size) {
      this.params.pageSize = size
      this.getData()
    },
    onRowClick () {
      console.log(arguments[0])
      if (this.tab === 'waiting') {
        switch (arguments[0].type) {
          case ('1'):
            // 待审批 项目审批
            this.$router.push({
              name: 'dxmsq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('2'):
            // 待审批 任务审批
            this.$router.push({
              name: 'drwsq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('3'):
            // 待审批 任务路口审批
            this.$router.push({
              name: 'drwlksq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('4'):
            // 待审批 物资申请审批
            this.$router.push({
              name: 'dwzsq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('5'):
            // 待审批 物资归还审批
            this.$router.push({
              name: 'dwzghsq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('6'):
            // 待审批 项目属性修改审批
            this.$router.push({
              name: 'dxmsxxgsq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('7'):
            // 待审批 项目状态修改审批
            this.$router.push({
              name: 'dxmztxgsq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('8'):
            this.$router.push({
              name: 'dwzjrxm',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('9'):
            this.$router.push({
              name: 'dryjrxmsq',
              params: {
                data: arguments[0]
              }
            })
            break
        }
      } else {
        switch (arguments[0].type) {
          case ('1'):
            // 我的审批 项目审批
            this.$router.push({
              name: 'xmsq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('2'):
            // 我的审批 任务审批
            this.$router.push({
              name: 'rwsq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('3'):
            // 我的审批 任务路口审批
            this.$router.push({
              name: 'rwlksq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('4'):
            // 我的审批 物资申请审批
            this.$router.push({
              name: 'wzsq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('5'):
            // 我的审批 物资归还审批
            this.$router.push({
              name: 'wzghsq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('6'):
            // 我的审批 项目属性修改审批
            this.$router.push({
              name: 'xmsxxgsq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('7'):
            // 我的审批 项目状态修改审批
            this.$router.push({
              name: 'xmztxgsq',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('8'):
            this.$router.push({
              name: 'wzjrxm',
              params: {
                data: arguments[0]
              }
            })
            break
          case ('9'):
            this.$router.push({
              name: 'ryjrxmsq',
              params: {
                data: arguments[0]
              }
            })
            break
        }
      }
    },
    getData () {
      if (this.tab === 'myAudit') {
        listHistory(this.params).then((res) => {
          if (res.data.status === '200') {
            this.tableData = res.data.data.list
            this.total = res.data.data.total
          }
        })
      } else {
        listWait(this.params).then((res) => {
          if (res.data.status === '200') {
            this.tableData = res.data.data.list
            this.total = res.data.data.total
          }
        })
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>

</style>
