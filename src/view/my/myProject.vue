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
        <div style="background-color: #ffffff; padding: 10px 20px; line-height: 20px; cursor: pointer">我的项目</div>
        <div style="background-color: #F2F2F2; padding: 10px 20px; line-height: 20px; cursor: pointer">我的任务</div>
        <div style="background-color: #F2F2F2; padding: 10px 20px; line-height: 20px; cursor: pointer">我的任务路口</div>
      </div>
      <Card style="width:350px; position: absolute; left: 20px; top: 60px; border: 0 none">
        <div style="display: flex">
          <input type="text" placeholder="Enter something..." class="ivu-input ivu-input-default" style="height: 50px; border: 0 none; border-radius: 0; font-size: 15px; color: #999999">
          <img src="../../assets/images/search.png" style=" cursor: pointer">
        </div>
      </Card>
      <Card v-if="!isDetail" style="width:350px; position: absolute; left: 20px; top: 120px;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; border-bottom: 1px solid #e6e6e6;">
          <div style="font-size: 16px; font-weight: bold">
            项目数量：{{this.total}}
          </div>
          <Select v-model="onStatus" style="width:100px" @on-change="statusChange">
            <Avatar :src="avatar" slot="prefix" size="small" />
            <Option value="1" >未开始</Option>
            <Option value="2" >进行中</Option>
            <Option value="3" >审核中</Option>
            <Option value="4" >已完成</Option>
            <Option value="5" >已驳回</Option>
            <Option value="6" >已撤销</Option>
            <Option value="7" >已暂停</Option>
          </Select>
        </div>
        <div v-for="(item, index) in projectList" :key="index" @click="positioning(item.lng, item.lat)" v-show="panelShow" style="position: relative; padding: 15px; border-bottom: 1px solid #e6e6e6;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px">
            <div style="font-size: 16px; display: flex; align-items: center;">
              <img src="../../assets/images/icon1.png" style="width: 18px; margin-right: 5px">{{item.name}}
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
          <div style="display: flex; justify-content: space-between; margin-top: 10px">
            <div>
              <span v-for="(i, index) in item.projectButtonPermissionBeans" :key="index" style="margin-right: 19px; float: left">{{i.name}}</span>
            </div>
            <div>
              <button typeof="button" style="border: 1px solid #2E8CEB; width: 58px; height: 41px; background-color: #ffffff; border-radius: 3px; color: #2E8CEB; cursor: pointer">详情</button>
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
          <span @click="close" style="cursor: pointer">收起</span>
        </div>
      </Card>
      <Card v-if="isDetail" style="width:350px; position: absolute; left: 20px; top: 120px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px;border-bottom: 1px solid rgb(230, 230, 230);">
          <span style="color: #2E8CEB; font-size: 15px; font-weight: bold">{{detailData.name}}</span>
          <img src="../../assets/images/icon1.png" style="width: 22px;">
        </div>
        <div style="padding: 15px; border-bottom: 1px solid rgb(230, 230, 230); position: relative">
          <div style="position: absolute; right: 15px; top: 5px; text-align: right;">
            <p :style="{ 'font-size': '30px', color: ( detailData.progress === '100' ? '#15C41B' : '#FB861B' ) }">{{detailData.progress ? detailData.progress : 0}}%</p>
            <p>项目进度</p>
          </div>
          <div style="line-height: 24px"><span class="label">项目状态：</span><span>{{pStatus}}</span></div>
          <div style="line-height: 24px"><span class="label">项目角色：</span><span>{{detailData.userTopRoleName}}</span></div>
          <div style="line-height: 24px"><span class="label">逾期天数：</span><span>{{detailData.overdueDays}}</span></div>
          <div style="line-height: 24px"><span class="label">甲方评分：</span><span>{{detailData.firstPartyScoring}}</span></div>
        </div>
        <div style=" padding: 5px 15px; border-bottom: 1px solid rgb(230, 230, 230);">
          项目基本信息
        </div>
        <div style="padding: 15px; border-bottom: 1px solid rgb(230, 230, 230);">
          <div style="line-height: 24px"><span class="label">项目名称：</span><span>{{detailData.name}}</span></div>
          <div style="line-height: 24px"><span class="label">甲方单位：</span><span>{{detailData.firstPartyCompanyName}}</span></div>
          <div style="line-height: 24px"><span class="label">甲方负责人：</span><span>{{detailData.firstPartyUserName}}</span></div>
          <div style="line-height: 24px"><span class="label">项目位置：</span><span>{{detailData.specificAddress}}</span></div>
          <div style="line-height: 24px"><span class="label">起止日期：</span><span>{{detailData.startTime}} 至 {{detailData.completionTime}}</span></div>
          <div style="line-height: 24px"><span class="label">主导单位：</span><span>{{detailData.officeName}}</span></div>
          <div style="line-height: 24px"><span class="label">项目经理：</span><span>{{detailData.projectManagerName}}</span></div>
          <div style="line-height: 24px"><span class="label">项目备注：</span><span>{{detailData.remarks}}</span></div>
        </div>
      </Card>
      <Button type="primary" v-show="isDetail" @click="toList" style="position: absolute; top: 560px; left: 20px;">返回列表</Button>
    </div>
  </div>
</template>

<script>
import { listProject, areaData, listMapProject, selectProjectDetail } from '@/api/data'
import p_pause from '../../assets/images/p_pause.png'
import p_noStarted from '../../assets/images/p_noStarted.png'
import p_start from '../../assets/images/p_start.png'
import p_review from '../../assets/images/p_review.png'
import p_completed from '../../assets/images/p_completed.png'
import p_reject from '../../assets/images/p_reject.png'
import p_revoke from '../../assets/images/p_revoke.png'
import { AMapManager } from 'vue-amap'
let amapManager = new AMapManager()
export default {
  name: 'my',
  data () {
    let self = this
    return {
      p_pause,
      p_noStarted,
      p_start,
      p_review,
      p_completed,
      p_reject,
      p_revoke,
      avatar: p_start,
      onStatus: '2',
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
          init (instance) {
            console.log(instance)
          }
        }
      }],
      events: {
        init (o) {
          setTimeout(() => {
            self.map = new AMap.MarkerClusterer(o, self.markerRefs, {
              gridSize: 80,
              renderCluserMarker: self._renderCluserMarker,
              minClusterSize: 2
            })
          }, 0)
        },
        complete () {
          let o = amapManager.getMap()
          o.on('zoomchange', () => {
            console.log(123)
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
      maxPage: 1
    }
  },
  watch: {
    'onStatus': function (val) {
      switch (val) {
        case '1':
          this.avatar = p_noStarted
          break
        case '2':
          this.avatar = p_start
          break
        case '3':
          this.avatar = p_review
          break
        case '4':
          this.avatar = p_completed
          break
        case '5':
          this.avatar = p_reject
          break
        case '6':
          this.avatar = p_revoke
          break
        case '7':
          this.avatar = p_pause
          break
      }
    }
  },
  computed: {
    pStatus () {
      if (this.detailData.status === '1') {
        return '未开始'
      } else if (this.detailData.status === '2') {
        return '进行中'
      } else if (this.detailData.status === '3') {
        return '审核中'
      } else if (this.detailData.status === '4') {
        return '已完成'
      } else if (this.detailData.status === '5') {
        return '已驳回'
      } else if (this.detailData.status === '6') {
        return '已撤销'
      }
    }
  },
  methods: {
    statusChange () {
      this.getMapProject()
      this.getProject()
    },
    toList () {
      this.isDetail = false
    },
    firstPage () {
      this.page = 1
    },
    prevPage () {
      if (this.page !== 1) {
        this.page--
        this.getProject()
      }
    },
    nextPage () {
      if (this.page < this.maxPage) {
        this.page++
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
      console.log(this.center)
    },
    getProject () {
      listProject({
        pageSize: 20,
        page: this.page,
        userId: 'dea2ebe067494cb782c3b123e5740989',
        projectName: '',
        firstPartyCompanyId: '',
        projectManagerId: '',
        status: this.onStatus,
        firstPartyScoring: '',
        provinceName: '',
        cityName: '',
        districtName: '',
        timeStatus: '',
        startTime: '',
        endTime: ''
      }).then((res) => {
        console.log(res)
        this.projectList = res.data.data.projectList
        this.total = res.data.data.count
        this.maxPage = Math.ceil(this.total / 20)
      })
    },
    getProjectDetail (id) {
      selectProjectDetail({
        projectId: id,
        userId: 'dea2ebe067494cb782c3b123e5740989'
      }).then((res) => {
        this.isDetail = true
        this.detailData = res.data.data
        console.log(res.data.data)
      })
    },
    getMapProject () {
      listMapProject({
        pageSize: 0,
        page: 1,
        userId: 'dea2ebe067494cb782c3b123e5740989',
        projectName: '',
        firstPartyCompanyId: '',
        projectManagerId: '',
        status: this.onStatus,
        firstPartyScoring: '',
        provinceName: '',
        cityName: '',
        districtName: '',
        timeStatus: '',
        startTime: '',
        endTime: ''
      }).then((res) => {
        let projectList = res.data.data.projectList
        console.log(projectList)
        if (projectList.length > 0) {
          this.center = [projectList[0].lng, projectList[0].lat]
        } else {
          this.center = this.center.length === 0 ? [116.397428, 39.90923] : this.center
        }
        let self = this
        this.markers = []
        projectList.forEach((item) => {
          let status = ''
          if (item.pauseStatus === '1') {
            status = `<div><img src="${p_pause}" style="width: 40px; height: 40px"></div>`
          } else {
            switch (item.status) {
              case '1':
                status = `<div><img src="${p_noStarted}" style="width: 40px; height: 40px"></div>`
                break
              case '2':
                status = `<div><img src="${p_start}" style="width: 40px; height: 40px"></div>`
                break
              case '3':
                status = `<div><img src="${p_review}" style="width: 40px; height: 40px"></div>`
                break
              case '4':
                status = `<div><img src="${p_completed}" style="width: 40px; height: 40px"></div>`
                break
              case '5':
                status = `<div><img src="${p_reject}" style="width: 40px; height: 40px"></div>`
                break
              case '6':
                status = `<div><img src="${p_revoke}" style="width: 40px; height: 40px"></div>`
                break
            }
          }
          this.markers.push({
            position: [item.lng, item.lat],
            id: item.id,
            content: status,
            events: {
              init (o) {
                self.markerRefs.push(o)
              },
              click (e) {
                self.getProjectDetail(e.target.get('extData'))
              }
            }
          })
          console.log(this.markers)
        })
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
    this.getMapProject()
    this.getProject()
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
