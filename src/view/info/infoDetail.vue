<template>
  <div class="dailycontent" style="height: calc(100vh - 100px);">
    <Row type="flex" justify="space-between" style="padding: 10px 0 20px">
      <Col span="24">
       <div class="baseInfo">消息详情</div>
      </Col>
      <div v-if="Type == '1' || Type == '2'">
        <Col span="24">
        <div class="infoItem">消息名称：{{info.title}}</div>
        <!-- <div class="infoItem">消息名称：{{info.projectName}}{{info.days ? '还有' + days + '天将逾期' : '已逾期'}}</div> -->
        </Col>
        <Col span="24">
        <div class="infoItem">提醒时间：{{info.createDate}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">提醒内容：{{info.content}}</div>
        </Col>
        <!--<Col span="24">-->
        <!--<div class="infoItem">起止日期：{{info.startTime}} 至 {{info.endTime}}</div>-->
        <!--</Col>-->
      </div>
      <div v-if="Type == '3'">
        <Col span="24">
        <div class="infoItem">消息名称：{{info.title}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">催办人员：{{info.userName}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">催办时间：{{info.createDate}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">催办内容：{{info.content}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">逾期天数：{{info.days}}天</div>
        </Col>
      </div>
      <div v-if="Type == '4'">
        <Col span="24">
        <div class="infoItem">消息名称：{{info.title}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">推送人员：{{info.fromUserName}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">推送时间：{{info.createDate}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">推送内容：{{info.content}}</div>
        </Col>
      </div>
      <div v-if="Type == '6'">
        <Col span="24">
        <!-- <div class="infoItem">消息名称：{{info.projectName}}中的{{info.taskName}}{{info.days}}个任务路口被{{info.userName}}拒绝</div> -->
        <div class="infoItem">消息名称：{{info.title}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">项目名称：{{info.projectName}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">任务名称：{{info.taskName}}</div>
        </Col>
        <Col span="8">
        <div class="infoItem">
          <Row style="align-items:center">
            <Col span="8" style="line-height: 30px;">任务路口列表：</Col>
            <Col span="16">
              <Select placeholder="查看任务路口列表" filterable clearable>
                <Option v-for="(item, key) in crossList" :key="key" :value="item.value">{{item.label}}</Option>
              </Select>
            </Col>
          </Row>
        </div>
        </Col>
        <Col span="24">
        <div class="infoItem">拒绝人员：{{info.userName}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">拒绝时间：{{info.createDate}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">拒绝理由：{{info.content}}</div>
        </Col>
      </div>
      <div v-if="Type == '5'">
        <Col span="24">
        <div class="infoItem">消息名称：{{info.title}}</div>
        <!-- <div class="infoItem">消息名称：您接到一个新项目{{info.title}}</div> -->
        </Col>
        <Col span="24">
        <div class="infoItem">发送时间：{{info.createDate}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">项目名称：{{info.projectName}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">起止日期：{{info.startTime}} 至 {{info.endTime}}</div>
        </Col>
        <Col span="24">
        <div class="infoItem">描述：{{info.remark}}</div>
        </Col>
      </div>
    </Row>
    <div class="returnBtn">
      <Button type="primary" style="width:100px" @click="lookDetail(info)">查看详情</Button>
      <Button style="width:100px; margin-left: 20px;" @click="returnBack">返回</Button>
    </div>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { messageDetail, listTaskCrossing } from '@/api/data'
import { getUserId } from '@/libs/util'
export default {
  name: 'infoDetail',
  components: { Tables },
  data () {
    return {
      info: {},
      Type: '',
      crossList: []
    }
  },
  computed: {
    // Type () {
    //   return this.$route.query.type
    // }
  },
  methods: {
    returnBack () {
      this.$router.push('infoList')
    },
    lookDetail (info) {
      let type = info.type
      if (type === '1') { // 审核审批
        this.$router.push({
          name: 'myProcessed'
        })``
      } else if (type === '2') { // 提醒
        this.$router.push({
          name: 'infoList'
        })
      } else if (type === '3') { // 催办
        this.$router.push({
          name: 'infoList'
        })
      } else if (type === '4') { // 推送 消息
        this.$router.push({ name: 'infoDetail', query: { id: info.resourceId } })
      } else if (type === '5') { // 新项目通知
        if (this.info.title.indexOf('项目') !== -1) {
          this.$router.push({ name: 'projectDetail', query: { projectId: info.resourceId } })
        }
        if (this.info.title.indexOf('任务') !== -1) {
          this.$router.push({ name: 'taskDetail', query: { taskId: info.resourceId } })
        }
      } else if (type === '6') { // 任务拒绝
        this.$router.push({ name: 'taskDetail', query: { taskId: info.resourceId } })
      }
    },
    MessageDetail (id) {
      let _this = this
      messageDetail({ id: id }).then((res) => {
        if (res.data.status === '200') {
          _this.info = res.data.data
          _this.Type = res.data.data.type
          if (res.data.data.type === '6') {
            // 获取任务路口列表
            _this.ListTaskCrossing()
          }
        }
      })
    },
    ListTaskCrossing () {
      let obj = {
        pageSize: 5000,
        page: 0,
        projectId: '',
        taskId: this.info.resourceId,
        userId: getUserId(),
        alias: '',
        taskCrossingStatus: 1,
        timeStatus: '',
        startTime: '',
        endTime: '',
        provinceName: '',
        cityName: '',
        districtName: ''
      }
      let _this = this
      listTaskCrossing(obj).then((res) => {
        let arr = res.data.data.taskCrossingDetailBeanList
        if (arr.length > 0) {
          _this.crossList = arr.map(ele => {
            return { value: ele.id, label: ele.alias }
          })
          // // 去重
          // _this.crossList = _this.crossList.reduce((cur, next) => {
          //   obj[next.id] ? '' : obj[next.id] = true && cur.push(next)
          //   return cur
          // }, [])
        } else {
          _this.crossList = []
        }
      })
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.MessageDetail(this.$route.query.id)
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
    text-align: center;
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
