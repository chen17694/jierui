<template>
  <div>
    <Card style="margin-bottom: 10px">
      <Steps :current="stepArr.length - 1 ">
        <Step :title="item.name" :content="item.userName ? item.userName + ' ' + item.action : '' + ' ' + item.action" v-for="(item, index) in stepArr" :key="index"></Step>
      </Steps>
    </Card>
    <Card style="margin-bottom: 10px">
      <h3 style="color: #2d8cf0; margin-bottom: 20px">当前属性</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">项目名称：{{detailData.projectName}}</li>
        <li style="margin-bottom: 5px">甲方公司：{{detailData.partAOffice}}</li>
        <li style="margin-bottom: 5px">甲方负责人：{{detailData.oldPartAName}}</li>
        <li style="margin-bottom: 5px">起止日期：{{detailData.oldStartTime.split(' ')[0]}} - {{detailData.oldEndTime.split(' ')[0]}}</li>
        <li style="margin-bottom: 5px">主导单位：{{detailData.officeName}}</li>
        <li style="margin-bottom: 5px">项目经理：{{detailData.oldProjectManagerName}}</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '1'">项目状态：审核中</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '2'">项目状态：已完成</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '3'">项目状态：已驳回</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '4'">项目状态：已撤销</li>
        <li style="margin-bottom: 5px">项目备注：{{detailData.oldRemark}}</li>
        <!--<li style="margin-bottom: 5px">项目位置：{{detailData.score}}</li>-->
      </ul>
      <h3 style="color: #2d8cf0; margin-bottom: 20px">变更属性</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">甲方负责人修改为：{{detailData.newPartAName}}</li>
        <li style="margin-bottom: 5px">项目修改日期修改为：{{detailData.newStartTime}} - {{detailData.newEndTime}}</li>
        <li style="margin-bottom: 5px">项目备注修改为：{{detailData.newRemark}}</li>
        <!--<li style="margin-bottom: 5px">项目位置修改为：{{detailData.taskHoldersName}}</li>-->
      </ul>
      <h3 style="color: #2d8cf0; margin-bottom: 20px">申请信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">申请人员：{{detailData.applyName}}</li>
        <li style="margin-bottom: 5px">申请时间：{{detailData.createTime}}</li>
        <li style="margin-bottom: 5px">申请原因：{{detailData.applyReason}}</li>
      </ul>
    </Card>
    <div class="btns" style="margin-top: 30px">
      <Button type="primary" @click="shenpi">审批</Button>
      <Button @click="back">返回</Button>
    </div>
    <Modal
      v-model="editPanel"
      title='项目属性修改审批'
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
    </Modal>
  </div>
</template>

<script>
import { detailProjectAttributeModify, opt } from '@/api/data'
import Tables from '_c/tables'
import { getUserId } from '@/libs/util'
export default {
  name: 'dxmsxxgsq',
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
        taskId: this.$route.query.taskId,
        userId: getUserId(),
        comment: this.editParams.comment,
        processType: this.$route.query.type
      }
      opt(obj).then((res) => {
        if (res.data.status === '200') {
          this.$router.push({
            name: 'myApproval'
          })
        }
        this.$Message.info(res.data.msg)
      })
    },
    getData () {
      detailProjectAttributeModify({
        taskId: this.$route.query.taskId,
        userId: getUserId(),
        type: '1'
      }).then((res) => {
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
