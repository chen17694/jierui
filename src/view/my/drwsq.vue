<template>
  <div>
    <Card style="margin-bottom: 10px">
      <Steps :current="stepArr.length - 1 ">
        <Step :title="item.name" :content="item.userName ? item.userName + ' ' + item.action : '' + ' ' + item.action" v-for="(item, index) in stepArr" :key="index"></Step>
      </Steps>
    </Card>
    <Card style="margin-bottom: 10px">
      <h3 style="color: #2d8cf0; margin-bottom: 20px">任务状态信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px" v-if="detailData.status === '1'">任务状态：审核中</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '2'">任务状态：已完成</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '3'">任务状态：已驳回</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '4'">任务状态：已撤销</li>
        <li style="margin-bottom: 5px">逾期天数：{{detailData.days}}</li>
        <li style="margin-bottom: 5px">甲方评分：{{detailData.score}}</li>
      </ul>
      <h3 style="color: #2d8cf0; margin-bottom: 20px">任务基本信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">项目名称：{{detailData.projectName}}</li>
        <li style="margin-bottom: 5px">任务名称：{{detailData.taskName}}</li>
        <li style="margin-bottom: 5px" v-if="detailData.type === '1'">任务类型：巡检任务</li>
        <li style="margin-bottom: 5px" v-if="detailData.type === '2'">任务类型：优化任务</li>
        <li style="margin-bottom: 5px" v-if="detailData.type === '3'">任务类型：宣传任务</li>
        <li style="margin-bottom: 5px">任务负责人：{{detailData.taskHoldersName}}</li>
        <li style="margin-bottom: 5px">起止日期：{{detailData.startTime}} - {{detailData.endTime}}</li>
        <li style="margin-bottom: 5px" v-if="detailData.nature === '1'">任务性质：单点优化</li>
        <li style="margin-bottom: 5px" v-if="detailData.nature === '2'">任务性质：线优化</li>
        <li style="margin-bottom: 5px" v-if="detailData.nature === '3'">任务性质：区域优化</li>
        <li style="margin-bottom: 5px">任务描述：{{detailData.remarks}}</li>
        <li style="margin-bottom: 5px">任务位置：{{detailData.address}}</li>
      </ul>
    </Card>
    <div class="btns" style="margin-top: 30px">
      <Button type="primary" @click="shenpi">审批</Button>
      <Button @click="back">返回</Button>
    </div>
    <Modal
      v-model="editPanel"
      title='任务审批'
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
        <FormItem label="甲方审批:" v-if="detailData.needForm === '1'">
          <RadioGroup v-model="editParams.needPartA">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { detailTaskApproval, opt } from '@/api/data'
import Tables from '_c/tables'
import { getUserId } from '@/libs/util'
export default {
  name: 'drwsq',
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
    back () {
      this.$router.push({
        name: 'myApproval'
      })
    },
    shenpi () {
      this.editPanel = true
    },
    save () {
      let obj = {
        opt: this.editParams.opt,
        taskId: this.$route.params.data.taskId,
        userId: getUserId(),
        comment: this.editParams.comment,
        processType: this.$route.params.data.type,
        taskForm: {
          needPartA: this.editParams.needPartA
        }
      }
      console.log(obj)
      opt(obj).then((res) => {
        console.log(res)
        this.$Message.info(res.data.msg)
      })
    },
    getData () {
      detailTaskApproval({
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
