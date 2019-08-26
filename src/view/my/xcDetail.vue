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
        <dd v-if="detailData.firstPartyScoring === '3'" style="display: block;margin-top: 20px;color: red;">
          不满意原因：{{detailData.dissatisfiedReason}}
        </dd>
      </dl>
      <div class="btns" v-if="this.detailData.status !== '6'">
        <Button type="primary" v-for="(item, index) in detailData.taskCrossingButtonPermissionBeanList"  @click="statusChange(item.permissionCode)" style="margin: 0 10px" :key="index">{{item.name}}</Button>
      </div>
      <Tabs style="margin-top: 20px">
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
          <div style="margin: 30px 0">
            <p style="font-weight: bold; margin-bottom: 10px">渠化图</p>
            <img src="../../assets/images/default_pic.png" v-if="!photo" style="margin: 15px 15px 0 0">
            <img :src="photo" v-if="photo" style="margin: 15px 15px 0 0; cursor:zoom-in;" @click="download(photo)">
            <div class="ivu-upload ivu-upload-drag" style="display: inline-block; width: 58px;position: relative;">
              <input type="file" @change="uploadPhoto($event)">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </div>
          </div>
          <div style="margin: 30px 0">
            <p style="font-weight: bold; margin-bottom: 10px; position: relative">附件
              <span style="position: absolute; opacity: 0; right: 0;"><input type="file" @change="uploadFile($event)" v-if="addPermission === '0'"></span>
              <Button type="primary" style="float: right" v-if="addPermission === '0'">上传附件</Button>
            </p>
            <ul style="list-style-type: none; display: flex">
              <li v-for="(item ,index) in annexBeans" @click="download(item)" :key="index" style="cursor: pointer;border: 1px solid #dcdee2;border-radius: 5px; padding-top: 10px; width: 120px; margin-right: 10px">
                <div style="background-color: #ffffff; display: flex; align-items: center; justify-content: center;">
                  <img src="../../assets/images/file.png" style="width: 60px;">
                </div>
                <p style="word-wrap: break-word; text-align: center; margin-bottom: 5px; padding: 0 5px;">{{item.annexName}}</p>
                <div style="text-align: center" @click.stop>
                  <img src="../../assets/images/delete.png" style="width: 20px;" @click="deleteFile(item.id)">
                </div>
              </li>
            </ul>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import { selectTaskCrossingDetailBean, uploadImgToAliOss, addTaskCrossingAnnex, uploadChannelizationMap, listTaskCrossingAnnex, deleteTaskCrossingAnnex, taskCrossingFunction } from '@/api/data'
import { getUserId } from '@/libs/util'
export default {
  name: 'xjDetail',
  data () {
    return {
      addPermission: '0',
      annexBeans: [],
      photo: '',
      file: '',
      detailData: {}
    }
  },
  methods: {
    deleteFile (id) {
      this.$Modal.confirm({
        title: '是否执行删除操作',
        content: '<p>删除后不能找回，还要继续吗</p>',
        onOk: () => {
          deleteTaskCrossingAnnex({
            id: id,
            userId: getUserId()
          }).then((res) => {
            listTaskCrossingAnnex({
              taskCrossingId: this.$route.query.taskCrossingId,
              userId: getUserId()
            }).then((res) => {
              this.addPermission = res.data.data.addPermission
              this.annexBeans = res.data.data.annexBeans
            })
          })
        }
      })
    },
    download (item) {
      window.open(item.annexUrl)
    },
    uploadPhoto (e) {
      uploadImgToAliOss(e).then(res => {
        this.photo = res[0]
        uploadChannelizationMap({
          id: this.$route.query.taskCrossingId,
          channelizationMapUrl: this.photo
        }).then((res) => {
          this.$Message.info(res.data.msg)
        })
      })
    },
    uploadFile (e) {
      uploadImgToAliOss(e).then(res => {
        let name = res[1]
        this.file = res[0]
        addTaskCrossingAnnex({
          userId: getUserId(),
          annexUrl: this.file,
          annexName: name,
          id: this.$route.query.taskCrossingId
        }).then((res) => {
          this.$Message.info(res.data.msg)
          listTaskCrossingAnnex({
            taskCrossingId: this.$route.query.taskCrossingId,
            userId: getUserId()
          }).then((res) => {
            this.addPermission = res.data.data.addPermission
            this.annexBeans = res.data.data.annexBeans
          })
        })
      })
    },
    toHistory () {
      this.$router.push({
        name: 'roadHistory',
        query: {
          crossingCode: this.detailData.crossingCode,
          taskCrossingId: this.$route.query.taskCrossingId
        }
      })
    },
    getData () {
      selectTaskCrossingDetailBean({
        taskCrossingId: this.$route.query.taskCrossingId,
        userId: getUserId()
      }).then((res) => {
        this.detailData = res.data.data
        this.photo = res.data.data.channelizationMapUrl
      })
    },
    back () {
      this.$router.back(-1)
    },
    statusChange (permissionCode) {
      let str = ''
      switch (permissionCode) {
        case '1':
          str = '确定要催办该任务路口吗？'
          break
        case '2':
          str = '确定要提交审核吗？'
          break
        case '3':
          str = '确定要删除任务路口吗？'
          break
      }
      this.$Modal.confirm({
        title: str,
        onOk: () => {
          taskCrossingFunction({
            'taskCrossingId': this.$route.query.taskCrossingId,
            'userId': getUserId(),
            'functionType': permissionCode
          }).then((res) => {
            this.$Message.info(res.data.msg)
            if (permissionCode === '3') {
              this.$router.push({
                name: 'taskRoadManagementList'
              })
            } else {
              this.init()
            }
          })
        }
      })
    },
    init () {
      this.getData()
      listTaskCrossingAnnex({
        taskCrossingId: this.$route.query.taskCrossingId,
        userId: getUserId()
      }).then((res) => {
        this.addPermission = res.data.data.addPermission
        this.annexBeans = res.data.data.annexBeans
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped lang="less">
  dd{
    display: inline-block;
    margin-right: 20px;
  }
  .btns{
    margin: 20px 0 0 0;
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
  .ivu-upload input[type="file"] {
    display: block;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 58px;
    width: 100%;
  }
  .ivu-avatar-large {
    width: 50px;
    height: 50px;
    line-height: 50px;
    border-radius: 50%;
  }
</style>
