<template>
  <div>
    <Card>
      <div style="display: flex; justify-content: space-between">
        <h2>{{detailData.alias}}</h2>
        <div>
          <Button type="primary" style="margin-right: 10px" @click="toHistory">查看历史版本</Button>
          <Button @click="back">返回</Button>
        </div>
      </div>
      <dl style="margin: 30px 0">
        <dt style="font-size: 16px; font-weight: bold; margin-bottom: 10px">任务路口状态信息</dt>
        <dd v-if="detailData.status === '1'">任务路口状态：未领取</dd>
        <dd v-if="detailData.status === '2'">任务路口状态：已拒绝</dd>
        <dd v-if="detailData.status === '3'">任务路口状态：未开始</dd>
        <dd v-if="detailData.status === '4'">任务路口状态：进行中</dd>
        <dd v-if="detailData.status === '5'">任务路口状态：审核中</dd>
        <dd v-if="detailData.status === '6'">任务路口状态：已完成</dd>
        <dd v-if="detailData.status === '7'">任务路口状态：已驳回</dd>
        <dd v-if="detailData.status === '8'">任务路口状态：已撤销</dd>
        <dd v-if="detailData.status === '9'">任务路口状态：已暂停</dd>
        <dd>逾期天数：{{detailData.overdueDays}}</dd>
        <dd v-if="detailData.firstPartyScoring === '1'">甲方评分：非常满意</dd>
        <dd v-if="detailData.firstPartyScoring === '2'">甲方评分：满意</dd>
        <dd v-if="detailData.firstPartyScoring === '3'">甲方评分：不满意</dd>
      </dl>
      <div class="btns" v-if="this.detailData.status !== '6'">
        <Button type="primary" v-for="(item, index) in detailData.taskCrossingButtonPermissionBeanList" style="margin: 0 10px" :key="index">{{item.name}}</Button>
      </div>
      <Tabs>
        <TabPane label="基本信息" name="name1">
          <ul style="line-height: 40px">
            <li><span style="font-weight: bold">项目名称</span>：{{detailData.businessProjectName}}</li>
            <li><span style="font-weight: bold">任务名称：</span>{{detailData.businessTaskName}}</li>
            <li>
              <span style="margin-right: 20px" v-if="detailData.type === '1'"><span style="font-weight: bold">任务类型：</span>巡检任务</span>
              <span style="margin-right: 20px" v-if="detailData.type === '2'"><span style="font-weight: bold">任务类型：</span>优化任务</span>
              <span style="margin-right: 20px" v-if="detailData.type === '3'"><span style="font-weight: bold">任务类型：</span>宣传任务</span>
              <span style="margin-right: 20px"><span style="font-weight: bold">任务负责人：</span>{{detailData.userName}}</span>
              <span style="margin-right: 20px" v-if="detailData.status === '6' || detailData.status ==='8'"><span style="font-weight: bold">起止日期：</span>{{detailData.startTime}} - {{detailData.endTime}}</span>
              <span style="margin-right: 20px" v-if="detailData.status !== '6' && detailData.status !=='8'"><span style="font-weight: bold">起止日期：</span>{{detailData.startTime}} - {{detailData.completionTime}}</span>
            </li>
            <li><span style="font-weight: bold">路口别名：</span>单点优化</li>
            <li><span style="font-weight: bold">路口位置：</span>{{detailData.provinceName}}{{detailData.cityName}}{{detailData.districtName}}{{detailData.specificAddress}}</li>
          </ul>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import { selectTaskCrossingDetailBean, uploadTaskCrossingInspect } from '@/api/data'
import { getUserId } from '@/libs/util'
export default {
  name: 'xjDetail',
  data () {
    return {
      detailData: {},
      ycfl: '',
      editModel: false,
      formItemStatus: {
        status: '',
        exceptionType: [],
        exceptionDescription: ''
      },
      ruleCustom: {},
      exceptionTypeDisabled: true,
      exceptionDescriptionDisabled: true
    }
  },
  methods: {
    toHistory () {
      this.$router.push({
        name: 'roadHistory',
        query: {
          crossingCode: this.detailData.crossingCode
        }
      })
    },
    getData () {
      selectTaskCrossingDetailBean({
        taskCrossingId: this.$route.query.taskCrossingId,
        userId: getUserId()
      }).then((res) => {
        console.log(res)
        this.detailData = res.data.data
      })
    },
    back () {
      this.$router.back(-1)
    },
    statusChange () {
      console.log(arguments)
      if (arguments[0] === '0') {
        this.formItemStatus = {
          status: '0',
          exceptionType: [],
          exceptionDescription: ''
        }
        this.exceptionTypeDisabled = true
        this.exceptionDescriptionDisabled = true
      } else {
        this.formItemStatus = {
          status: '1',
          exceptionType: [],
          exceptionDescription: ''
        }
        this.exceptionTypeDisabled = false
        this.exceptionDescriptionDisabled = false
      }
    },
    saveStatus () {
      console.log(this.formItemStatus)
      uploadTaskCrossingInspect({
        businessTaskCrossingId: this.$route.query.taskCrossingId,
        status: this.formItemStatus.status,
        exceptionType: this.formItemStatus.exceptionType.join(','),
        exceptionDescription: this.formItemStatus.exceptionDescription
      }).then((res) => {
        console.log(res)
        this.$Message.info(res.data.msg)
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped lang="less">
  dd{
    display: inline-block;
    margin-right: 20px;
  }
  .btns{
    margin: 20px 0;
    display: flex;
    justify-content: center;
    background-color: rgba(45, 140, 240, 0.2);
    border: 1px solid #2d8cf0;
    padding: 10px 0;
  }
  .ivu-form-item{
    margin-bottom: 0;
    /deep/ .ivu-form-item-error-tip{
      position: static;
    }
  }
  .btns2{
    margin-top: 6px;
    text-align: center;
    .ivu-btn-primary{
      margin-right: 10px;
    }
    .ivu-btn{
      width: 80px;
    }
  }
</style>
