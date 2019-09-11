<template>
  <Tabs v-model="tab" :animated="false">
    <TabPane label="我的审核审批进度" name="myAudit">
      <Row type="flex" justify="space-between" style="padding: 10px 0 20px">
        <Col span="12">
          <div class="searchInput">
            <div class="search">
              <Input search @on-search="handleSearch" placeholder="输入关键字搜索" type="text" enter-button="搜索">
              <span slot="prepend">审核审批名称:</span>
              </Input>
            </div>
            <Button class="search-btn" type="primary" @click="openFilter"><Icon type="search"/>筛选</Button>
          </div>
        </Col>
      </Row>
      <tables :total="this.total" ref="tableData" v-model="tableData" @on-row-dblclick="onRowClick" :columns="columns1" :on-change="pageChange" :on-page-size-change="pageSizeChange"></tables>
    </TabPane>
    <TabPane label="待我审批" name="waiting">
      <tables :total="this.total" v-model="tableData" @on-row-dblclick="onRowClick" :columns="columns2" :on-change="pageChange" :on-page-size-change="pageSizeChange"></tables>
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
    handleSearch () {

    },
    openFilter () {

    },
    pageChange (page) {
      this.params.page = page
      this.getData()
    },
    pageSizeChange (size) {
      this.params.pageSize = size
      this.getData()
    },
    onRowClick () {
      if (this.tab === 'waiting') {
        switch (arguments[0].type) {
          case ('1'):
            // 待审批 项目审批
            this.$router.push({
              name: 'dxmsq',
              query: {
                type: arguments[0].type,
                taskId: arguments[0].taskId
              }
            })
            break
          case ('2'):
            // 待审批 任务审批
            this.$router.push({
              name: 'drwsq',
              query: {
                type: arguments[0].type,
                taskId: arguments[0].taskId
              }
            })
            break
          case ('3'):
            // 待审批 任务路口审批
            this.$router.push({
              name: 'drwlksq',
              query: {
                type: arguments[0].type,
                taskId: arguments[0].taskId
              }
            })
            break
          case ('4'):
            // 待审批 物资申请审批
            this.$router.push({
              name: 'dwzsq',
              query: {
                type: arguments[0].type,
                taskId: arguments[0].taskId
              }
            })
            break
          case ('5'):
            // 待审批 物资归还审批
            this.$router.push({
              name: 'dwzghsq',
              query: {
                type: arguments[0].type,
                taskId: arguments[0].taskId
              }
            })
            break
          case ('6'):
            // 待审批 项目属性修改审批
            this.$router.push({
              name: 'dxmsxxgsq',
              query: {
                type: arguments[0].type,
                taskId: arguments[0].taskId
              }
            })
            break
          case ('7'):
            // 待审批 项目状态修改审批
            this.$router.push({
              name: 'dxmztxgsq',
              query: {
                type: arguments[0].type,
                taskId: arguments[0].taskId
              }
            })
            break
          case ('8'):
            this.$router.push({
              name: 'dwzjrxm',
              query: {
                type: arguments[0].type,
                taskId: arguments[0].taskId
              }
            })
            break
          case ('9'):
            this.$router.push({
              name: 'dryjrxmsq',
              query: {
                type: arguments[0].type,
                taskId: arguments[0].taskId
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
              query: {
                taskId: arguments[0].taskId,
                type: arguments[0].type
              }
            })
            break
          case ('4'):
            // 我的审批 物资申请审批
            this.$router.push({
              name: 'wzsq',
              params: {
                taskId: arguments[0].taskId,
                type: arguments[0].type
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
              query: {
                type: arguments[0].type,
                taskId: arguments[0].taskId
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
    window.onresize = event => {
      console.log(123)
      this.$refs.tableData.handleResize()
    }
  }
}
</script>

<style scoped lang="less">
  .ivu-tabs{
    overflow: initial;
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
</style>
