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
      <h3 style="color: #2d8cf0; margin-bottom: 20px">任务路口状态信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px" v-if="detailData.status === '1'">任务状态：审核中</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '2'">任务状态：已完成</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '3'">任务状态：已驳回</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '4'">任务状态：已撤销</li>
        <li style="margin-bottom: 5px">逾期天数：{{detailData.days}}</li>
        <li style="margin-bottom: 5px">甲方评分：{{detailData.score}}</li>
      </ul>
      <h3 style="color: #2d8cf0; margin-bottom: 20px">路口基本信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">项目名称：{{detailData.projectName}}</li>
        <li style="margin-bottom: 5px">任务名称：{{detailData.taskName}}</li>
        <li style="margin-bottom: 5px">路口别名：{{detailData.alias}}</li>
        <li style="margin-bottom: 5px">任务负责人：{{detailData.taskHoldersName}}</li>
        <li style="margin-bottom: 5px">起止日期：{{detailData.startTime}} - {{detailData.endTime}}</li>
        <li style="margin-bottom: 5px">路口位置：{{detailData.address}}</li>
      </ul>
    </Card>
    <div class="btns" style="margin-top: 30px">
      <Button type="primary" @click="chexiao" v-if="detailData.status === '1'">撤销</Button>
      <Button>返回</Button>
    </div>
  </div>
</template>

<script>
import { detailTaskCrossingApproval, opt } from '@/api/data'
import Tables from '_c/tables'
import { getUserId } from '@/libs/util'
export default {
  name: 'rwlksq',
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
      stepArr: [],
      editPanel: false
    }
  },
  methods: {
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
      detailTaskCrossingApproval({
        taskId: this.$route.params.data.taskId,
        userId: getUserId(),
        type: '1'
      }).then((res) => {
        console.log(res.data.data)
        this.detailData = res.data.data
        this.stepArr = res.data.data.list
      })
    }
  },
  mounted () {
    this.getData()
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
