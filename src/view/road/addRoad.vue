<template>
  <div style="height: 100%">
    <div class="amap-page-container">
      <div style="position: absolute; z-index: 1; left: 20px; top: 20px; background-color: #ffffff; width: 300px">
        <div style="font-size: 14px;font-weight: bold;padding: 0 10px 0 10px;border-bottom: 1px solid rgb(232, 232, 232);line-height: 40px;">路口数量：{{this.total}}</div>
        <div v-for="(item, index) in roadList" :key="index" @click="setCenter(item.lng, item.lat)" style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #e8e8e8; justify-content: space-between">
          <span style="margin-right: 10px; display: flex; align-items: center">
            <img src="../../assets/images/icon1.png" style="width: 13px; margin-right: 5px">
            <span style="width: 155px; display: inline-block;">{{item.alias}}</span>
          </span>
          <span @click.stop>
            <span style="margin-right: 10px; cursor: pointer" @click="toArray(item)">{{item.select ? '已选' : '选取'}}</span>
            <Button type="primary" @click="toDetail(item)" size="small">详情</Button>
          </span>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 11px 10px 15px; border-bottom: 1px solid #e6e6e6;">
          <div>{{params.page}}/{{maxPage}}页</div>
          <div style="display: flex">
            <Button style="margin-right: 4px" @click="firstPage">首页</Button>
            <ul class="ivu-page">
              <li title="上一页" @click="prevPage" class="ivu-page-prev"><a><i class="ivu-icon ivu-icon-ios-arrow-back"></i></a></li>
              <li title="下一页" @click="nextPage" class="ivu-page-prev"><a><i class="ivu-icon ivu-icon-ios-arrow-forward"></i></a></li>
            </ul>
          </div>
        </div>
      </div>
      <!--<div style="position: absolute; z-index: 1; right: 20px; top: 70px; background-color: #ffffff; width: 300px">-->
        <!--<div style="padding: 10px; border-bottom: 1px solid rgb(232, 232, 232);">已选路口：{{selectList.length}}</div>-->
        <!--<div v-for="(item, index) in selectList" :key="index" style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #e8e8e8; justify-content: space-between">-->
          <!--<span style="margin-right: 10px; display: flex; align-items: center">-->
            <!--<img src="../../assets/images/icon1.png" style="width: 13px; margin-right: 5px">-->
            <!--<span style="width: 155px; display: inline-block;">{{item.alias}}</span>-->
          <!--</span>-->
          <!--<span>-->
            <!--<span style="margin-right: 10px; cursor: pointer" @click="deleteArray(index)">移除</span>-->
            <!--<Button type="primary" size="small">详情</Button>-->
          <!--</span>-->
        <!--</div>-->
        <!--<Button type="primary" style="width: 90%; margin: 10px auto; display: block" @click="taskRoadPanel = true">新增已选任务路口</Button>-->
      <!--</div>-->
      <el-amap
        v-if="this.center.length === 2"
        :amap-manager="amapManager"
        :center="center"
        vid="amapDemo"
        :zoom="zoom"
        class="amap-demo"
        :events="events"
      >
        <el-amap-marker v-for="(marker, index) in markers" :key="index" :extData = "marker.id" vid="chenyiming" :position="marker.position" :content="marker.content" :events="marker.events"></el-amap-marker>
      </el-amap>
      <Cascader :data="areaData" v-model="areaValue" change-on-select style="position: absolute; right: 20px; top: 20px; width: 200px;" @on-change="cascaderChange"></Cascader>
    </div>
    <Modal
      v-model="roadPanel"
      @on-ok="saveRoad"
      title="新增路口">
      <Form ref="formItem1" :model="formItem1" :label-width="120" label-position="left" :rules="ruleValidate" >
        <FormItem label="创建/更新人员姓名">
          {{formItem1.userName}}
        </FormItem>
        <FormItem label="路口别名" prop="alias">
          <Input type="text" v-model="formItem1.alias"></Input>
        </FormItem>
        <FormItem label="省/市/区" prop="area">
          <Cascader :data="areaData" @on-change="areaChange"></Cascader>
        </FormItem>
        <FormItem label="详细地址" prop="specificAddress">
          <Input type="text" v-model="formItem1.specificAddress"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="taskRoadPanel"
      title="新增任务路口"
      @on-ok="saveTaskRoad"
    >
      <Form ref="formItem1" :model="formItem1" :label-width="70" label-position="left" :rules="ruleValidate" >
        <FormItem label="项目">
          <Select v-model="formItem2.businessProjectId" @on-change="projectChange">
            <Option v-for="(item, index) in projectList" :value="item.id" :key="index">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="任务">
          <Select v-model="formItem2.businessTaskId" @on-change="taskChange">
            <Option v-for="(item, index) in taskList" :value="item.id" :key="index">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="起止日期">
          <DatePicker type="daterange" show-week-numbers placement="bottom" @on-change="dateChange" style="width: 200px"></DatePicker>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap'
import { listCrossingAndCount, areaData, addCrossing, listProject, listTask, addTaskCrossing } from '@/api/data'
import { getUserInfo, getUserId } from '@/libs/util'
import road from '../../assets/images/road.png'
import icon1 from '../../assets/images/icon1.png'
let amapManager = new AMapManager()
export default {
  name: 'addRoad',
  data () {
    const self = this
    return {
      params: {
        pageSize: 10,
        page: 1,
        alias: '',
        provinceName: '',
        cityName: '',
        districtName: ''
      },
      maxPage: 0,
      total: 0,
      taskRoadPanel: false,
      formItem2: {
        businessProjectId: '',
        businessTaskId: '',
        userId: '',
        startTime: '',
        completionTime: '',
        addUserId: getUserId()
      },
      formItem1: {
        userName: '',
        alias: '',
        area: '',
        specificAddress: ''
      },
      ruleValidate: {
        alias: [
          { required: true, message: '请填写路口别名', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请填写省/市/区', trigger: 'blur' }
        ],
        specificAddress: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      roadPanel: false,
      road,
      icon1,
      center: [],
      amapManager,
      zoom: 16,
      areaData: [],
      areaValue: [],
      keywords: '',
      searchOptions: {
        city: '全国'
      },
      markers: [],
      markerRefs: [],
      map: null,
      roadList: [],
      selectList: [],
      taskList: [],
      lat: '',
      lng: '',
      projectList: [],
      events: {
        complete () {
          let o = amapManager.getMap()
          let icon1 = self.icon1
          self.menu = new AMap.ContextMenu()
          self.menu.addItem('<img src="' + icon1 + '" style="width: 18px; margin-right: 5px;"><span>新建路口</span>', function () {
            self.addRoad()
          }, 0)
          self.menu.addItem('<span style="padding-left: 25px">取消</span>', function () {
            self.close()
          }, 0)
          o.on('rightclick', (e) => {
            self.lat = e.lnglat.lat
            self.lng = e.lnglat.lng
            self.menu.open(o, e.lnglat)
          })
        }
      }
    }
  },
  methods: {
    firstPage () {
      this.params.page = 1
      this.markers = []
      this.markerRefs = []
      this.map.clearMarkers()
      this.getRoad()
    },
    prevPage () {
      if (this.params.page !== 1) {
        this.params.page--
        this.markers = []
        this.markerRefs = []
        this.map.clearMarkers()
        this.getRoad()
      }
    },
    nextPage () {
      if (this.params.page < this.maxPage) {
        this.params.page++
        this.markers = []
        this.markerRefs = []
        this.map.clearMarkers()
        this.getRoad()
      }
    },
    toDetail (crossingCode) {
      this.$router.push({
        name: 'roadHistory',
        query: {
          crossingCode: crossingCode
        }
      })
    },
    dateChange () {
      this.formItem2.startTime = arguments[0][0]
      this.formItem2.completionTime = arguments[0][1]
    },
    saveTaskRoad () {
      let idLIst = this.selectList.map(item => item.id)
      let params = {
        businessProjectId: this.formItem2.businessProjectId,
        businessTaskId: this.formItem2.businessTaskId,
        businessCrossingId: idLIst.join(','),
        userId: this.formItem2.userId,
        startTime: this.formItem2.startTime,
        completionTime: this.formItem2.completionTime,
        addUserId: getUserId()
      }
      addTaskCrossing(params).then((res) => {
        this.$Message.info(res.data.msg)
      })
    },
    taskChange () {
      this.taskList.forEach((item) => {
        if (item.id === this.formItem2.businessTaskId) {
          this.formItem2.userId = item.taskHoldersId
        }
      })
    },
    projectChange () {
      this.taskList = []
      this.formItem2.businessTaskId = ''
      listTask({
        pageSize: 0,
        page: 0,
        businessProjectId: this.formItem2.businessProjectId,
        type: '',
        name: '',
        taskStatus: '',
        firstPartyScoring: '',
        userId: getUserId(),
        timeStatus: '',
        startTime: '',
        endTime: '',
        provinceName: '',
        cityName: '',
        districtName: ''
      }).then((res) => {
        this.taskList = res.data.data.taskDetailBeans
      })
    },
    saveRoad () {
      let params = {
        userId: getUserId(),
        userName: this.formItem1.userName,
        alias: this.formItem1.alias,
        provinceName: this.formItem1.area[0],
        cityName: this.formItem1.area[1],
        districtName: this.formItem1.area[2],
        specificAddress: this.formItem1.specificAddress,
        lng: this.lng,
        lat: this.lat
      }
      addCrossing(params).then((res) => {
        this.$Message.info(res.data.msg)
        this.markers = []
        this.markerRefs = []
        this.map.clearMarkers()
        this.getRoad()
      })
    },
    areaChange () {
      let value = arguments[1].slice(1, arguments[1].length).map((item) => {
        return item.label
      })
      this.formItem1.area = value
    },
    addRoad () {
      this.roadPanel = true
    },
    setCenter (lng, lat) {
      this.center = [lng, lat]
    },
    compare (id, a1) {
      let idList = a1.map(v => v.id)
      return idList.includes(id)
    },
    stateCheck (a1, a2) {
      let idList = a2.map(v => v.id)
      a1.forEach((item) => {
        if (idList.includes(item.id)) {
          item.select = true
        } else {
          item.select = false
        }
      })
    },
    deleteArray (index) {
      this.selectList.splice(index, 1)
      this.stateCheck(this.roadList, this.selectList)
    },
    toArray (item) {
      if (!this.compare(item.id, this.selectList)) {
        this.selectList.push(item)
      }
      this.stateCheck(this.roadList, this.selectList)
    },
    cascaderChange () {
      let value = arguments[1].slice(1, arguments[1].length).map((item) => {
        return item.label
      })
      this.keywords = value.join()
      this.searchArea()
    },
    searchArea () {
      if (!this.keywords) return false
      let placeSearch = new AMap.PlaceSearch(this.searchOptions)
      placeSearch.search(this.keywords, (status, result) => {
        this.center = [result.poiList.pois[0].location.lng, result.poiList.pois[0].location.lat]
      })
    },
    getAreaData () {
      areaData().then(res => {
        if (res.data.status === '200') {
          this.areaData = res.data.data
        }
      })
    },
    initMark (self, o) {
      self.map = new AMap.MarkerClusterer(o, self.markerRefs, {
        gridSize: 80,
        // renderCluserMarker: self._renderCluserMarker,
        minClusterSize: 2
      })
    },
    getRoad () {
      listCrossingAndCount(this.params).then((res) => {
        let roadList = this.roadList = res.data.data.list
        this.total = res.data.data.count
        if (this.total === '0') {
          this.params.page = 0
        } else {
          if (this.page === 0) {
            this.params.page = 1
          }
        }
        this.maxPage = Math.ceil(this.total / 10)
        this.stateCheck(this.roadList, this.selectList)
        if (roadList.length > 0) {
          this.center = [roadList[0].lng || 116.397428, roadList[0].lat || 39.90923]
        } else {
          this.center = this.center.length === 0 ? [116.397428, 39.90923] : this.center
        }
        let self = this
        roadList.forEach((item) => {
          let status = `<div><img src="${road}" style="width: 40px; height: 40px"></div>`
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
        })
        setTimeout(() => {
          self.initMark(self, amapManager.getMap())
        }, 0)
      })
    }
  },
  mounted () {
    this.getAreaData()
    listProject({
      pageSize: 0,
      page: 0,
      userId: getUserId(),
      projectName: '',
      firstPartyCompanyId: '',
      projectManagerId: '',
      status: '',
      firstPartyScoring: '',
      provinceName: '',
      cityName: '',
      districtName: '',
      timeStatus: '',
      startTime: '',
      endTime: ''
    }).then((res) => {
      this.projectList = res.data.data.projectList
    })
    this.formItem1.userName = JSON.parse(getUserInfo()).name
    lazyAMapApiLoaderInstance.load().then(() => {
      this.getRoad()
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
    /deep/ .amap-menu-outer{
      width: 150px;
      li{
        display: flex;
        align-items: center;
      }
      li:first-child{
        border-bottom: 1px solid #e6e6e6;
      }
    }
  }
</style>
