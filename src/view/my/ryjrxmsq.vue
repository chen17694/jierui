<template>
  <div>
    <Card style="margin-bottom: 10px">
      <Steps :current="1">
        <Step :title="item.name" :content="item.userName ? item.userName : '' + ' ' +item.action" v-for="(item, index) in stepArr" :key="index"></Step>
      </Steps>
    </Card>
    <Card style="margin-bottom: 10px">
      <div v-if="detailData.status === '3'" style="margin-bottom: 10px">
        拒绝原因：{{detailData.rejectReason}}
      </div>
      <h3 style="color: #2d8cf0; margin-bottom: 20px">人员加入项目申请信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">项目名称：{{detailData.projectName}}</li>
        <li style="margin-bottom: 5px">申请人员：{{detailData.applyName}}</li>
        <li style="margin-bottom: 5px">申请时间：{{detailData.createTime}}</li>
        <li style="margin-bottom: 5px">需求描述及原因：{{detailData.applyReason}}</li>
      </ul>
    </Card>
    <div class="btns" style="margin-top: 30px">
      <Button type="primary" @click="chexiao" v-if="detailData.isCancel === '1'">撤销</Button>
      <Button @click="back">返回</Button>
    </div>
  </div>
</template>

<script>
import { detailProjectStaffJoin, opt, getUserList } from '@/api/data'
import Tables from '_c/tables'
import { getUserId, getOffice } from '@/libs/util'
export default {
  name: 'ryjrxmsq',
  components: { Tables },
  data () {
    return {
      editParams: {
        comment: '',
        opt: '1',
        needPartA: ''
      },
      detailData: {},
      tableData: [],
      columns: [
        { title: '人员名称',
          key: 'pname',
          width: '250px',
          render: (h, params) => {
            return h('Select', {
              props: {
                value: this.addRows[params.index].id
              },
              on: {
                'on-change': (id) => {
                  this.addRows[params.index].id = id
                }
              }
            }, params.row.pname.map((item) => {
              return h('Option', {
                props: {
                  value: item.id
                }
              }, item.name)
            }))
          }
        },
        {
          title: '操作',
          key: 'handle',
          options: ['add', 'remove']
        }
      ],
      stepArr: [],
      editPanel: false,
      addRows: [
        {
          userList: []
        }
      ],
      rowIndex: 0
    }
  },
  methods: {
    back () {
      this.$router.push({
        name: 'projectOverdue'
      })
    },
    chexiao () {
      this.$Modal.confirm({
        title: '确定要撤销吗？',
        onOk: () => {
          let obj = {
            opt: '3',
            taskId: this.$route.params.data.taskId,
            userId: getUserId(),
            processType: this.$route.params.data.type
          }
          opt(obj).then((res) => {
            console.log(res)
            this.$Message.info(res.data.msg)
          })
        }
      })
    },
    getData () {
      detailProjectStaffJoin({
        taskId: this.$route.params.data.taskId,
        userId: getUserId(),
        type: '2'
      }).then((res) => {
        console.log(res.data.data)
        this.detailData = res.data.data
        this.stepArr = res.data.data.list
      })
    },
    delRow () {
      this.addRows.splice(arguments[0].index, 1)
      this.tableData.splice(arguments[0].index, 1)
      this.rowIndex = arguments[0].index - 1
    },
    addRow () {
      this.rowIndex = arguments[0].index + 1
      this.addRows.push({
        userList: this.addRows[0].userList
      })
      this.tableData.push({
        pname: this.addRows[this.rowIndex].userList
      })
    }
  },
  mounted: function () {
    this.getData()
    getUserList({
      'pageSize': 0,
      'page': 0,
      'name': '',
      'office': getOffice().officeId,
      'role': '',
      'isLoginApp': ''
    }).then((res) => {
      this.addRows[this.rowIndex].userList = res.data.data.list
    })
  }
}
</script>

<style scoped lang="less">
  .btns{
    text-align: center;
    .ivu-btn-primary{
      margin-right: 10px;
    }
    .ivu-btn{
      width: 80px;
    }
  }
  .tableWrapper{
    /deep/ .ivu-table-wrapper{
      overflow: inherit;
    }
  }
</style>
