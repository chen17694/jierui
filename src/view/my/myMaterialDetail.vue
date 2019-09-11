<template>
  <div>
    <Card style="margin-bottom: 10px">
      <h3 style="color: #2d8cf0; margin-bottom: 20px">物资基本信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">物资名称：{{detailData.name}}</li>
        <li style="margin-bottom: 5px">物资归属单位：{{detailData.officeName}}</li>
        <li style="margin-bottom: 5px">物资类别：{{detailData.materialCategoryName}}</li>
        <li style="margin-bottom: 5px" v-if="detailData.needReturnStatus === '0'">是否需要归还：需要</li>
        <li style="margin-bottom: 5px" v-if="detailData.needReturnStatus === '1'">是否需要归还：不需要</li>
      </ul>
      <h3 style="color: #2d8cf0; margin: 20px 0">物资申请/归还信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">项目名称：{{detailData.projectNane}}</li>
        <li style="margin-bottom: 5px">任务名称：{{detailData.taskName}}</li>
        <li style="margin-bottom: 5px">申请人员：{{detailData.userName}}</li>
        <li style="margin-bottom: 5px">申请数量：{{detailData.amount}}</li>
        <li style="margin-bottom: 5px">申请时间：{{detailData.startTime}}</li>
        <li style="margin-bottom: 5px">审批项目经理：{{detailData.businessManagerName}}</li>
        <li style="margin-bottom: 5px">归还日期：{{detailData.completionTime}}</li>
        <li style="margin-bottom: 5px">剩余天数：{{detailData.remainderDays}}</li>
        <li style="margin-bottom: 5px">逾期天数：{{detailData.overdueDays}}</li>
      </ul>
    </Card>
    <div class="btns" style="margin-top: 30px">
      <Button type="primary" @click="guihuan">归还</Button>
      <Button @click="back">返回</Button>
    </div>
  </div>
</template>

<script>
import { taskMaterialDetail, materialReturn } from '@/api/data'
import { getUserId } from '@/libs/util'
export default {
  name: 'myMaterialDetail',
  data () {
    return {
      detailData: {}
    }
  },
  methods: {
    getData () {
      taskMaterialDetail({
        id: this.$route.query.id
      }).then((res) => {
        this.detailData = res.data.data
      })
    },
    guihuan () {
      materialReturn({
        userId: getUserId(),
        materialReturnParameterList: [
          {
            taskMaterialId: this.$route.query.id,
            returnNum: this.detailData.amount
          }
        ]
      }).then((res) => {
        this.$Message.info(res.data.msg)
        if (res.data.status === '200') {
          this.$router.push({
            name: 'myMaterial'
          })
        }
      })
    },
    back () {
      this.$router.push({
        name: 'myMaterial'
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
