<template>
  <div class="dailycontent" style="height: calc(100vh - 100px);">
    <Row type="flex" justify="space-between" style="padding: 10px 0">
      <Col span="24">
       <div class="baseInfo">日报详情</div>
      </Col>
      <Col span="24">
       <div class="infoItem">项目名称：{{detailData.projectName || '-'}}</div>
      </Col>
      <Col span="24">
       <div class="infoItem">任务名称：{{detailData.projectName || '-'}}</div>
      </Col>
      <Col span="8">
       <div class="infoItem">登记人员：{{detailData.userName || '-'}}</div>
      </Col>
      <Col span="8">
       <div class="infoItem">日报日期：{{detailData.reportDate || '-'}}</div>
      </Col>
      <Col span="8">
       <div class="infoItem">工作时长：{{detailData.workingHours || '-'}}</div>
      </Col>
      <Col span="24">
       <div class="infoItem">工作内容：{{detailData.workingContent || '-'}}</div>
      </Col>
    </Row>
    <Button type="primary" style="width:100px" class="returnBtn" @click="returnBack">返回</Button>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getUserId } from '@/libs/util'
import { dailyFind } from '@/api/data'
export default {
  name: 'MaterialDetail',
  components: { Tables },
  data () {
    return {
      detailData: {},
      params: {
        userId: '',
        id: ''
      }
    }
  },
  created () {
    this.params.userId = getUserId()
    this.params.id = this.$route.query.id
    this.getData()
  },
  methods: {
    returnBack () {
      this.$router.push('dailyList')
    },
    getData () {
      let _this = this
      dailyFind(_this.params).then((res) => {
        if (res.data.status === '200') {
          this.detailData = res.data.data
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.dailycontent{
  background: #fff;
  padding: 0 20px;
  height: calc(100vh - 100px);
  .returnBtn{
    position: absolute;
    bottom: 40px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
}
.baseInfo{
    margin-top: 40px;
    margin-bottom: 20px;
    font-size: 18px;
  }
  .infoItem{
    font-size: 14px;
    margin-bottom: 10px;
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
</style>
