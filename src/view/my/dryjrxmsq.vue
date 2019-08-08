<template>
  <div>
    <Card style="margin-bottom: 10px">
      <Steps :current="1">
        <Step :title="item.name" :content="item.userName + ' ' +item.action" v-for="(item, index) in stepArr" :key="index"></Step>
      </Steps>
    </Card>
    <Card style="margin-bottom: 10px">
      <h3 style="color: #2d8cf0; margin-bottom: 20px">人员加入项目申请信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">项目名称：{{detailData.days}}</li>
        <li style="margin-bottom: 5px">申请人员：{{detailData.score}}</li>
        <li style="margin-bottom: 5px">申请时间：{{detailData.score}}</li>
        <li style="margin-bottom: 5px">需求描述及原因：{{detailData.days}}</li>
      </ul>
    </Card>
    <div class="btns" style="margin-top: 30px">
      <Button type="primary" @click="shenpi">审批</Button>
      <Button>返回</Button>
    </div>
    <Modal
      v-model="editPanel"
      title='物资申请审批'
      @on-ok="save"
    >
      <Form ref="editParams" :model="editParams">
        <FormItem label="审批结果:">
          <RadioGroup v-model="editParams.opt">
            <Radio label="1">同意</Radio>
            <Radio label="2">拒绝</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="拒绝原因:">
          <Input v-model="editParams.comment" :disabled="editParams.opt === '1'" type="textarea" style="width: 80%" :autosize="{minRows: 5,maxRows: 10}"></Input>
        </FormItem>
      </Form>
      <tables ref="tables"  v-model="tableData" :columns="columns" @on-add="addRow" @on-remove="delRow" :showPage="false"></tables>
    </Modal>
  </div>
</template>

<script>
import { detailProjectStateModify, opt, getUserList } from '@/api/data'
import Tables from '_c/tables'
import { getUserId, getOffice } from '@/libs/util'
export default {
  name: 'drwlksq',
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
                value: this.addRows[params.index].projectId
              },
              on: {
                'on-change': (id) => {
                  this.addRows[params.index].projectId = id
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
    shenpi () {
      this.editPanel = true
    },
    save () {
      let obj = {
        opt: this.editParams.opt,
        taskId: this.$route.params.data.taskId,
        userId: getUserId(),
        comment: this.editParams.comment,
        processType: this.$route.params.data.type
      }
      console.log(obj)
      opt(obj).then((res) => {
        console.log(res)
        this.$Message.info(res.data.msg)
      })
    },
    getData () {
      detailProjectStateModify({
        taskId: this.$route.params.data.taskId,
        userId: getUserId(),
        type: '1'
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
    },
    addInit () {
      this.tableData = [{
        pname: this.addRows[0].userList
      }]
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
</style>
