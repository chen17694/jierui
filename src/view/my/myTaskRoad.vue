<template>
  <div style="height: 100%">
    <div class="amap-page-container">
      <div class="amap-demo" v-if="this.center.length === 0">
        <div class="spin-container">
          <Spin size="large" fix></Spin>
        </div>
      </div>
      <el-amap
        v-if="this.center.length === 2"
        :amap-manager="amapManager"
        :center="center"
        vid="amapDemo"
        :zoom="zoom"
        class="amap-demo"
        :events="events"
        :plugin="plugin"
      >
        <el-amap-marker v-for="(marker, index) in markers" :key="index" :extData = "marker.id" vid="chenyiming" :position="marker.position" :content="marker.content" :events="marker.events"></el-amap-marker>
      </el-amap>
      <Cascader :data="areaData" v-model="areaValue" change-on-select style="position: absolute; right: 20px; top: 20px; width: 200px;" @on-change="cascaderChange"></Cascader>
      <div style="color: #666666; display: flex; width:350px; position: absolute; left: 20px; top: 20px; border: 0 none">
        <div style="background-color: #F2F2F2; padding: 10px 20px; line-height: 20px; cursor: pointer" @click="onChangeNav('myProject')">我的项目</div>
        <div style="background-color: #F2F2F2; padding: 10px 20px; line-height: 20px; cursor: pointer" @click="onChangeNav('myTask')">我的任务</div>
        <div style="background-color: #ffffff; padding: 10px 20px; line-height: 20px; cursor: pointer">我的任务路口</div>
      </div>
      <Card style="width:350px; position: absolute; left: 20px; top: 60px; border: 0 none">
        <div style="display: flex">
          <input type="text" v-model="alias" class="ivu-input ivu-input-default" style="height: 50px; border: 0 none; border-radius: 0; font-size: 15px; color: #999999">
          <img src="../../assets/images/search.png" style=" cursor: pointer" @click="searchProject">
        </div>
      </Card>
      <Card v-if="!isDetail" style="width:350px; position: absolute; left: 20px; top: 120px;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; border-bottom: 1px solid #e6e6e6;">
          <div style="font-size: 16px; font-weight: bold">
            任务路口数量：{{this.total}}
          </div>
          <Select v-model="onStatus" style="width:100px" @on-change="statusChange">
            <span :style="{ backgroundColor: avatar }" style="width: 15px; height: 15px; display: inline-block; border-radius: 50%; vertical-align: middle;" slot="prefix"></span>
            <Option value="1" >未领取</Option>
            <Option value="2" >已拒绝</Option>
            <Option value="3" >未开始</Option>
            <Option value="4" >进行中</Option>
            <Option value="5" >审核中</Option>
            <Option value="6" >已完成</Option>
            <Option value="7" >已驳回</Option>
            <Option value="8" >已撤销</Option>
            <Option value="9" >已暂停</Option>
          </Select>
        </div>
        <div v-for="(item, index) in projectList" :key="index" @click="positioning(item.lng, item.lat)" v-show="panelShow" style="position: relative; padding: 15px; padding-bottom: 10px; border-bottom: 1px solid #e6e6e6;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px">
            <div style="font-size: 16px; display: flex; align-items: center;">
              <img src="../../assets/images/icon1.png" style="width: 18px; margin-right: 5px">{{item.alias}}
            </div>
            <div style="line-height: 20px;">
              <p :style="{ 'font-size': '20px', color: ( item.progress === '100' ? '#15C41B' : '#FB861B' ) }">{{item.progress ? item.progress : 0}}%</p>
              <p style="color: #999999">进度</p>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between">
            <span style="color:#999999;">项目角色：{{item.userTopRoleName}}</span>
            <span style="color:#BC0000;" v-if="item.isOverdue === '1'">已逾期{{item.overdueDays}}天</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 10px" @click.stop>
            <div>
              <span v-for="(i, index) in item.taskCrossingButtonPermissionBeanList" :key="index" >
                <Button v-if="i.permissionCode === '1'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">逾期催办</Button>
                <Button v-if="i.permissionCode === '2'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">提交审核</Button>
                <Button v-if="i.permissionCode === '3'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">删除任务路口</Button>
              </span>
            </div>
            <div>
              <button typeof="button" @click="toTaskDetail(item.id, item.type)" style="border: 1px solid #2E8CEB; width: 58px; height: 41px; background-color: #ffffff; border-radius: 3px; color: #2E8CEB; cursor: pointer">详情</button>
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 11px 10px 15px; border-bottom: 1px solid #e6e6e6;">
          <div>{{page}}/{{maxPage}}页</div>
          <div style="display: flex">
            <Button style="margin-right: 4px" @click="firstPage">首页</Button>
            <ul class="ivu-page">
              <li title="上一页" @click="prevPage" class="ivu-page-prev"><a><i class="ivu-icon ivu-icon-ios-arrow-back"></i></a></li>
              <li title="下一页" @click="nextPage" class="ivu-page-prev"><a><i class="ivu-icon ivu-icon-ios-arrow-forward"></i></a></li>
            </ul>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 15px; color: #2E8CEB;">
          <span @click="allProject" style="cursor: pointer">所有项目</span>
          <span @click="close" style="cursor: pointer">{{this.panelShow ? '收起' : '展开'}}</span>
        </div>
      </Card>
      <Card v-if="isDetail" style="width:350px; height: 550px; overflow-y: scroll; position: absolute; left: 20px; top: 120px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px;border-bottom: 1px solid rgb(230, 230, 230);">
          <span style="color: #2E8CEB; font-size: 15px; font-weight: bold">{{detailData.alias}}</span>
          <img src="../../assets/images/icon1.png" style="width: 22px;">
        </div>
        <div style="padding: 15px; border-bottom: 1px solid rgb(230, 230, 230); position: relative">
          <div style="line-height: 24px"><span class="label">路口状态：</span><span>{{pStatus}}</span></div>
          <div style="line-height: 24px"><span class="label">项目角色：</span><span>{{detailData.userTopRoleName}}</span></div>
          <div style="line-height: 24px"><span class="label">逾期天数：</span><span>{{detailData.overdueDays}}</span></div>
          <div style="line-height: 24px"><span class="label">甲方评分：</span><span>{{detailData.firstPartyScoring}}</span></div>
        </div>
        <div style=" padding: 5px 15px; border-bottom: 1px solid rgb(230, 230, 230);">
          任务路口基本信息
        </div>
        <div style="padding: 15px; ">
          <div style="line-height: 24px"><span class="label">项目名称：</span><span>{{detailData.businessProjectName}}</span></div>
          <div style="line-height: 24px"><span class="label">任务名称：</span><span>{{detailData.businessTaskName}}</span></div>
          <div style="line-height: 24px" v-if="detailData.type === '1'"><span class="label">任务类型：</span><span>巡检任务</span></div>
          <div style="line-height: 24px" v-if="detailData.type === '2'"><span class="label">任务类型：</span><span>优化任务</span></div>
          <div style="line-height: 24px" v-if="detailData.type === '3'"><span class="label">任务类型：</span><span>宣传任务</span></div>
          <div style="line-height: 24px"><span class="label">路口别名：</span><span>{{detailData.alias}}</span></div>
          <div style="line-height: 24px"><span class="label">负责人：</span><span>{{detailData.userName}}</span></div>
          <div style="line-height: 24px"><span class="label">起止时间：</span><span>{{detailData.startTime}} 至 {{detailData.completionTime}}</span></div>
        </div>
      </Card>
      <Button type="primary" v-show="isDetail" @click="toList" style="position: absolute; top: 680px; left: 20px;">返回列表</Button>
    </div>
  </div>
</template>

<script>
import { areaData, taskCrossingFunction, listTaskCrossing, listMapTaskCrossing, selectTaskCrossingDetailBean } from '@/api/data'
import { getUserId } from '@/libs/util'
import trx1 from '../../assets/images/trx1.png'
import trx2 from '../../assets/images/trx2.png'
import trx3 from '../../assets/images/trx3.png'
import trx4 from '../../assets/images/trx4.png'
import trx5 from '../../assets/images/trx5.png'
import trx6 from '../../assets/images/trx6.png'
import trx7 from '../../assets/images/trx7.png'
import trx8 from '../../assets/images/trx8.png'
import trx9 from '../../assets/images/trx9.png'
import trxj1 from '../../assets/images/trxj1.png'
import trxj2 from '../../assets/images/trxj2.png'
import trxj3 from '../../assets/images/trxj3.png'
import trxj4 from '../../assets/images/trxj4.png'
import trxj5 from '../../assets/images/trxj5.png'
import trxj6 from '../../assets/images/trxj6.png'
import trxj7 from '../../assets/images/trxj7.png'
import trxj8 from '../../assets/images/trxj8.png'
import trxj9 from '../../assets/images/trxj9.png'
import try1 from '../../assets/images/try1.png'
import try2 from '../../assets/images/try2.png'
import try3 from '../../assets/images/try3.png'
import try4 from '../../assets/images/try4.png'
import try5 from '../../assets/images/try5.png'
import try6 from '../../assets/images/try6.png'
import try7 from '../../assets/images/try7.png'
import try8 from '../../assets/images/try8.png'
import try9 from '../../assets/images/try9.png'
import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap'
let amapManager = new AMapManager()
export default {
  name: 'myTaskRoad',
  data () {
    let self = this
    return {
      alias: '',
      trx1,
      trx2,
      trx3,
      trx4,
      trx5,
      trx6,
      trx7,
      trx8,
      trx9,
      trxj1,
      trxj2,
      trxj3,
      trxj4,
      trxj5,
      trxj6,
      trxj7,
      trxj8,
      trxj9,
      try1,
      try2,
      try3,
      try4,
      try5,
      try6,
      try7,
      try8,
      try9,
      avatar: '#FF5000',
      onStatus: '1',
      isDetail: false,
      detailData: {},
      minClusterSize: 2,
      panelShow: true,
      zoom: 16,
      amapManager,
      center: [],
      areaData: [],
      areaValue: [],
      keywords: '',
      searchOptions: {
        city: '全国'
      },
      markers: [],
      markerRefs: [],
      map: null,
      plugin: [{
        pName: 'ToolBar',
        position: 'RB',
        events: {
          init (instance) {}
        }
      }],
      events: {
        complete () {
          let o = amapManager.getMap()
          o.on('zoomchange', () => {
            let zoom = o.getZoom()
            if (zoom > 13) {
              self.map.setMinClusterSize(2)
            } else {
              self.map.setMinClusterSize(1)
            }
          })
        }
      },
      projectList: [],
      total: 0,
      page: 1,
      maxPage: 1,
      projectName: ''
    }
  },
  watch: {
    'onStatus': function (val) {
      switch (val) {
        case '1':
          this.avatar = '#FF5000'
          break
        case '2':
          this.avatar = '#E33C00'
          break
        case '3':
          this.avatar = '#2E8CEB'
          break
        case '4':
          this.avatar = '#41BE68'
          break
        case '5':
          this.avatar = '#F79800'
          break
        case '6':
          this.avatar = '#50DAE6'
          break
        case '7':
          this.avatar = '#DC6CBC'
          break
        case '8':
          this.avatar = '#CCCCCC'
          break
        case '9':
          this.avatar = '#FFC44D'
          break
      }
    }
  },
  computed: {
    pStatus () {
      if (this.detailData.status === '1') {
        return '未领取'
      } else if (this.detailData.status === '2') {
        return '已拒绝'
      } else if (this.detailData.status === '3') {
        return '未开始'
      } else if (this.detailData.status === '4') {
        return '进行中'
      } else if (this.detailData.status === '5') {
        return '审核中'
      } else if (this.detailData.status === '6') {
        return '已完成'
      } else if (this.detailData.status === '7') {
        return '已驳回'
      } else if (this.detailData.status === '8') {
        return '已撤销'
      } else if (this.detailData.status === '9') {
        return '已暂停'
      }
    }
  },
  methods: {
    onChangeNav (to) {
      this.$router.push({
        name: to
      })
    },
    onEdit (params, row) {
      console.log(params)
      console.log(row)
      let str = ''
      switch (params.permissionCode) {
        case '1':
          str = '确定要催办该任务路口吗？'
          break
        case '2':
          str = '确定要提交审核吗？'
          break
        case '3':
          str = '确定要删除该任务路口吗？'
          break
      }
      this.$Modal.confirm({
        title: str,
        onOk: () => {
          taskCrossingFunction({
            'taskCrossingId': row.id,
            'userId': getUserId(),
            'functionType': params.permissionCode
          }).then((res) => {
            this.$Message.info(res.data.msg)
            this.markers = []
            this.markerRefs = []
            this.map.clearMarkers()
            this.getMapProject()
            this.getProject()
          })
        }
      })
    },
    searchProject () {
      this.markers = []
      this.markerRefs = []
      this.map.clearMarkers()
      this.getMapProject()
      this.getProject()
    },
    initMark (self, o) {
      self.map = new AMap.MarkerClusterer(o, self.markerRefs, {
        gridSize: 80,
        // renderCluserMarker: self._renderCluserMarker,
        minClusterSize: 2
      })
    },
    statusChange () {
      this.markers = []
      this.markerRefs = []
      this.map.clearMarkers()
      this.getMapProject()
      this.getProject()
    },
    toList () {
      this.isDetail = false
    },
    firstPage () {
      this.page = 1
      this.markers = []
      this.markerRefs = []
      this.map.clearMarkers()
      this.getMapProject()
      this.getProject()
    },
    prevPage () {
      if (this.page !== 1) {
        this.page--
        this.markers = []
        this.markerRefs = []
        this.map.clearMarkers()
        this.getMapProject()
        this.getProject()
      }
    },
    nextPage () {
      if (this.page < this.maxPage) {
        this.page++
        this.markers = []
        this.markerRefs = []
        this.map.clearMarkers()
        this.getMapProject()
        this.getProject()
      }
    },
    allProject () {
      let o = amapManager.getMap()
      o.setFitView(this.markerRefs)
    },
    close () {
      this.panelShow = !this.panelShow
    },
    positioning (lng, lat) {
      this.center = [lng, lat]
    },
    getProject () {
      let obj = {
        pageSize: 3,
        page: this.page,
        projectId: '',
        taskId: '',
        userId: getUserId(),
        alias: this.alias,
        taskCrossingStatus: this.onStatus,
        timeStatus: '',
        startTime: '',
        endTime: '',
        provinceName: this.projectName,
        cityName: '',
        districtName: ''
      }
      listTaskCrossing(obj).then((res) => {
        this.projectList = res.data.data.taskCrossingDetailBeanList
        this.total = res.data.data.count
        if (this.total === '0') {
          this.page = 0
        } else {
          if (this.page === 0) {
            this.page = 1
          }
        }
        this.maxPage = Math.ceil(this.total / 3)
      })
    },
    toTaskDetail (id, type) {
      if (type === '1') {
        this.$router.push({
          name: 'xjDetail',
          query: {
            taskCrossingId: id
          }
        })
      } else if (type === '2') {
        this.$router.push({
          name: 'yhDetail',
          query: {
            taskCrossingId: id
          }
        })
      } else if (type === '3') {
        this.$router.push({
          name: 'xcDetail',
          query: {
            taskCrossingId: id
          }
        })
      }
    },
    getDetail (id) {
      selectTaskCrossingDetailBean({
        taskCrossingId: id,
        userId: getUserId()
      }).then((res) => {
        this.isDetail = true
        this.detailData = res.data.data
      })
    },
    getMapProject () {
      let obj = {
        pageSize: 2,
        page: this.page,
        projectId: '',
        taskId: '',
        userId: getUserId(),
        alias: this.alias,
        taskCrossingStatus: this.onStatus,
        timeStatus: '',
        startTime: '',
        endTime: '',
        provinceName: this.projectName,
        cityName: '',
        districtName: ''
      }
      listMapTaskCrossing(obj).then((res) => {
        let taskCrossingList = res.data.data.taskCrossingList
        if (taskCrossingList.length > 0) {
          this.center = [taskCrossingList[0].lng || 116.397428, taskCrossingList[0].lat || 39.90923]
        } else {
          this.center = this.center.length === 0 ? [116.397428, 39.90923] : this.center
        }
        let self = this
        taskCrossingList.forEach((item) => {
          console.log(123)
          let status = ''
          switch (item.type) {
            case '1' :
              switch (item.status) {
                case '1':
                  status = `<div><img src="${trxj1}" style="width: 40px; height: 40px"></div>`
                  break
                case '2':
                  status = `<div><img src="${trxj2}" style="width: 40px; height: 40px"></div>`
                  break
                case '3':
                  status = `<div><img src="${trxj3}" style="width: 40px; height: 40px"></div>`
                  break
                case '4':
                  status = `<div><img src="${trxj4}" style="width: 40px; height: 40px"></div>`
                  break
                case '5':
                  status = `<div><img src="${trxj5}" style="width: 40px; height: 40px"></div>`
                  break
                case '6':
                  status = `<div><img src="${trxj6}" style="width: 40px; height: 40px"></div>`
                  break
                case '7':
                  status = `<div><img src="${trxj7}" style="width: 40px; height: 40px"></div>`
                  break
                case '8':
                  status = `<div><img src="${trxj8}" style="width: 40px; height: 40px"></div>`
                  break
                case '9':
                  status = `<div><img src="${trxj9}" style="width: 40px; height: 40px"></div>`
                  break
              }
              break
            case '2' :
              switch (item.status) {
                case '1':
                  status = `<div><img src="${try1}" style="width: 40px; height: 40px"></div>`
                  break
                case '2':
                  status = `<div><img src="${try2}" style="width: 40px; height: 40px"></div>`
                  break
                case '3':
                  status = `<div><img src="${try3}" style="width: 40px; height: 40px"></div>`
                  break
                case '4':
                  status = `<div><img src="${try4}" style="width: 40px; height: 40px"></div>`
                  break
                case '5':
                  status = `<div><img src="${try5}" style="width: 40px; height: 40px"></div>`
                  break
                case '6':
                  status = `<div><img src="${try6}" style="width: 40px; height: 40px"></div>`
                  break
                case '7':
                  status = `<div><img src="${try7}" style="width: 40px; height: 40px"></div>`
                  break
                case '8':
                  status = `<div><img src="${try8}" style="width: 40px; height: 40px"></div>`
                  break
                case '9':
                  status = `<div><img src="${try9}" style="width: 40px; height: 40px"></div>`
                  break
              }
              break
            case '3' :
              switch (item.status) {
                case '1':
                  status = `<div><img src="${trx1}" style="width: 40px; height: 40px"></div>`
                  break
                case '2':
                  status = `<div><img src="${trx2}" style="width: 40px; height: 40px"></div>`
                  break
                case '3':
                  status = `<div><img src="${trx3}" style="width: 40px; height: 40px"></div>`
                  break
                case '4':
                  status = `<div><img src="${trx4}" style="width: 40px; height: 40px"></div>`
                  break
                case '5':
                  status = `<div><img src="${trx5}" style="width: 40px; height: 40px"></div>`
                  break
                case '6':
                  status = `<div><img src="${trx6}" style="width: 40px; height: 40px"></div>`
                  break
                case '7':
                  status = `<div><img src="${trx7}" style="width: 40px; height: 40px"></div>`
                  break
                case '8':
                  status = `<div><img src="${trx8}" style="width: 40px; height: 40px"></div>`
                  break
                case '9':
                  status = `<div><img src="${trx9}" style="width: 40px; height: 40px"></div>`
                  break
              }
              break
          }
          console.log(status)
          this.markers.push({
            position: [item.lng, item.lat],
            id: item.id,
            content: status,
            events: {
              init (o) {
                self.markerRefs.push(o)
              },
              click (e) {
                self.getDetail(e.target.get('extData'))
              }
            }
          })
        })
        setTimeout(() => {
          self.initMark(self, amapManager.getMap())
        }, 0)
      })
    },
    getAreaData () {
      areaData().then(res => {
        if (res.data.status === '200') {
          this.areaData = res.data.data
        }
      })
    },
    searchArea () {
      if (!this.keywords) return false
      let placeSearch = new AMap.PlaceSearch(this.searchOptions)
      placeSearch.search(this.keywords, (status, result) => {
        this.center = [result.poiList.pois[0].location.lng, result.poiList.pois[0].location.lat]
      })
    },
    cascaderChange () {
      let value = arguments[1].slice(1, arguments[1].length).map((item) => {
        return item.label
      })
      console.log(value)
      this.keywords = value.join()
      this.searchArea()
    },
    _renderCluserMarker (context) {
      const count = this.markers.length
      let factor = Math.pow(context.count / count, 1 / 18)
      let div = document.createElement('div')
      let Hue = 180 - factor * 180
      let bgColor = 'hsla(' + Hue + ',100%,50%,0.7)'
      let fontColor = 'hsla(' + Hue + ',100%,20%,1)'
      let borderColor = 'hsla(' + Hue + ',100%,40%,1)'
      let shadowColor = 'hsla(' + Hue + ',100%,50%,1)'
      div.style.backgroundColor = bgColor
      let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
      div.style.width = div.style.height = size + 'px'
      div.style.border = 'solid 1px ' + borderColor
      div.style.borderRadius = size / 2 + 'px'
      div.style.boxShadow = '0 0 1px ' + shadowColor
      div.innerHTML = context.count
      div.style.lineHeight = size + 'px'
      div.style.color = fontColor
      div.style.fontSize = '14px'
      div.style.textAlign = 'center'
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
      context.marker.setContent(div)
    }
  },
  mounted () {
    this.getAreaData()
    lazyAMapApiLoaderInstance.load().then(() => {
      this.getMapProject()
      this.getProject()
    })
  }
}
</script>

<style scoped lang="less">
  .amap-page-container{
    height: 100%;
    position: relative;
    /deep/ .ivu-card-body{
      padding: 0;
    }
  }
  .amap-demo {
    height: 100%;
  }
  .spin-container{
    display: inline-block;
    width: 100%;
    height: 100%;
    position: relative;
    border: 1px solid #eee;
  }
  .ivu-card{
    border-radius: 0px;
  }
  .label{
    color: rgb(153, 153, 153);
    width: 84px;
    display: inline-block;
  }
</style>
