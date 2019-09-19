<template>
  <div style="height: 100%;margin: -18px;">
    <div class="amap-page-container">
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
      <Cascader :data="areaData" v-model="areaValue" style="position: absolute; right: 20px; top: 30px; width: 200px;" @on-change="cascaderChange"></Cascader>
      <div style="color: #666666; display: flex; width:380px; position: absolute; left: 20px; top: 30px; border: 0 none">
        <div style="background-color: #F2F2F2; padding: 10px 20px; line-height: 20px; cursor: pointer" @click="onChangeNav('myProject')">我的项目</div>
        <div style="background-color: #ffffff; padding: 10px 20px; line-height: 20px; cursor: pointer">我的任务</div>
        <div style="background-color: #F2F2F2; padding: 10px 20px; line-height: 20px; cursor: pointer" @click="onChangeNav('myTaskRoad')">我的任务路口</div>
      </div>
      <Card style="width:380px; position: absolute; left: 20px; top: 70px; border: 0 none">
        <div style="display: flex">
          <input type="text" v-model="taskName" placeholder="请输入查找的任务名称" class="ivu-input ivu-input-default" style="height: 45px; border: 0 none; border-radius: 0; font-size: 15px; color: #999999">
          <img src="../../assets/images/search.png" style=" cursor: pointer; height: 45px" @click="searchProject">
        </div>
      </Card>
      <div style="opacity:0.8; width:380px; position: absolute; left: 20px; top: 130px; background-color: #ffffff">
        <div v-if="tab === 'tab2'" style="padding: 10px">
          <Form :label-width="82">
            <FormItem label="项目选择：">
              <Select v-model="businessProjectId" @on-change="changeProject" filterable>
                <Option value="">全部</Option>
                <Option v-for="(item, index) in projectList" :value="item.id " :key="index">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
        <Tabs :animated="false" v-model="tab">
          <TabPane name="tab1" label="已接受" >
            <Card v-if="!isDetail">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; border-bottom: 1px solid #e6e6e6;">
                <div style="font-size: 16px; font-weight: bold">
                  任务数量：{{this.total}}
                </div>
                <Select v-model="onStatus" style="width:100px" @on-change="statusChange" clearable>
                  <span :style="{ backgroundColor: avatar }" style="width: 15px; height: 15px; display: inline-block; border-radius: 50%; vertical-align: middle;" slot="prefix"></span>
                  <!--<Option value="1" >未领取</Option>-->
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
              <div v-for="(item, index) in taskList" :key="index" @click="positioning(item.lng, item.lat)" v-show="panelShow" style="position: relative; padding: 15px; border-bottom: 1px solid #e6e6e6;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
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
                <div style="display: flex; justify-content: space-between;" @click.stop>
                  <div>
                    <span v-for="(i, index) in item.taskButtonPermissionBeans" :key="index" >
                      <span v-if="i.permissionCode === '1'" @click="onEdit(i, item)">
                        <img src="../../assets/images/t1.png"  title="下达任务" class="btn" style="margin: 0 3px" >
                        下达任务
                      </span>
                      <span v-if="i.permissionCode === '2' && item.pauseStatus === '1'" @click="onEdit(i, item)">
                        <img src="../../assets/images/t2.png" style="margin: 0 3px" title="开始任务" class="btn">
                        开始任务
                      </span>
                      <span  v-if="i.permissionCode === '2' && item.pauseStatus === '0'" @click="onEdit(i, item)">
                        <img src="../../assets/images/t2.png" style="margin: 0 3px" title="暂停任务" class="btn">
                        暂停任务
                      </span>
                      <span v-if="i.permissionCode === '3'" @click="onEdit(i, item)">
                        <img src="../../assets/images/t3.png" title="撤销任务" class="btn" style="margin: 0 3px">
                        撤销任务
                      </span>
                      <span v-if="i.permissionCode === '4'" @click="onEdit(i, item)">
                        <img src="../../assets/images/t4.png" title="催办任务" class="btn" style="margin: 0 3px">
                        催办任务
                      </span>
                      <span v-if="i.permissionCode === '5'" @click="onEdit(i, item)">
                        <img src="../../assets/images/t5.png" title="提交审核" class="btn" style="margin: 0 3px">
                        提交审核
                      </span>
                      <span v-if="i.permissionCode === '6'" @click="onEdit(i, item)">
                        <img src="../../assets/images/p8.png" title="删除任务" class="btn" style="margin: 0 3px">
                        删除任务
                      </span>
                      <span v-if="i.permissionCode === '99'" @click="onEdit(i, item)">
                        <img src="../../assets/images/p9.png" title="新增任务路口" class="btn" style="margin: 0 3px">
                        新增任务路口
                      </span>
                    </span>
                  </div>
                  <div>
                    <button typeof="button" @click="toTaskDetail(item.id, item.lat, item.lng)" style="border: 1px solid #2E8CEB; width: 58px; height: 41px; background-color: #ffffff; border-radius: 3px; color: #2E8CEB; cursor: pointer">详情</button>
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
                <span @click="allProject" style="cursor: pointer">所有任务</span>
                <span @click="close" style="cursor: pointer">{{this.panelShow ? '收起' : '展开'}}</span>
              </div>
            </Card>
            <Card v-if="isDetail" style="height: 550px; overflow-y: scroll;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px;border-bottom: 1px solid rgb(230, 230, 230);">
                <span style="color: #2E8CEB; font-size: 15px; font-weight: bold">{{detailData.name}}</span>
                <img src="../../assets/images/icon1.png" style="width: 22px;">
              </div>
              <div style="padding: 15px; border-bottom: 1px solid rgb(230, 230, 230); position: relative">
                <div style="position: absolute; right: 15px; top: 5px; text-align: right;">
                  <p :style="{ 'font-size': '30px', color: ( detailData.progress === '100' ? '#15C41B' : '#FB861B' ) }">{{detailData.progress ? detailData.progress : 0}}%</p>
                  <p>项目进度</p>
                </div>
                <div style="line-height: 24px"><span class="label">任务状态：</span><span>{{pStatus}}</span></div>
                <div style="line-height: 24px"><span class="label">项目角色：</span><span>{{detailData.userTopRoleName}}</span></div>
                <div style="line-height: 24px"><span class="label">逾期天数：</span><span>{{detailData.overdueDays}}</span></div>
                <div style="line-height: 24px">
                  <span class="label">甲方评分：</span>
                  <span v-if="detailData.firstPartyScoring === '1'">非常满意</span>
                  <span v-if="detailData.firstPartyScoring === '2'">满意</span>
                  <span v-if="detailData.firstPartyScoring === '3'">不满意</span>
                </div>
                <div style="display: flex; justify-content: space-between;" @click.stop>
                  <div>
                    <span v-for="(i, index) in detailData.taskButtonPermissionBeans" :key="index" >
                      <span v-if="i.permissionCode === '1'" @click="onEdit(i, detailData)">
                        <img src="../../assets/images/t1.png"  title="下达任务" class="btn" style="margin: 0 3px" >
                        下达任务
                      </span>
                      <span v-if="i.permissionCode === '2' && detailData.pauseStatus === '1'" @click="onEdit(i, detailData)">
                        <img src="../../assets/images/t2.png" style="margin: 0 3px" title="开始任务" class="btn">
                        开始任务
                      </span>
                      <span  v-if="i.permissionCode === '2' && detailData.pauseStatus === '0'" @click="onEdit(i, detailData)">
                        <img src="../../assets/images/t2.png" style="margin: 0 3px" title="暂停任务" class="btn">
                        暂停任务
                      </span>
                      <span v-if="i.permissionCode === '3'" @click="onEdit(i, detailData)">
                        <img src="../../assets/images/t3.png" title="撤销任务" class="btn" style="margin: 0 3px">
                        撤销任务
                      </span>
                      <span v-if="i.permissionCode === '4'" @click="onEdit(i, detailData)">
                        <img src="../../assets/images/t4.png" title="催办任务" class="btn" style="margin: 0 3px">
                        催办任务
                      </span>
                      <span v-if="i.permissionCode === '5'" @click="onEdit(i, detailData)">
                        <img src="../../assets/images/t5.png" title="提交审核" class="btn" style="margin: 0 3px">
                        提交审核
                      </span>
                      <span v-if="i.permissionCode === '6'" @click="onEdit(i, detailData)">
                        <img src="../../assets/images/p8.png" title="删除任务" class="btn" style="margin: 0 3px">
                        删除任务
                      </span>
                      <span v-if="i.permissionCode === '99'" @click="onEdit(i, detailData)">
                        <img src="../../assets/images/p9.png" title="新增任务路口" class="btn" style="margin: 0 3px">
                        新增任务路口
                      </span>
                    </span>
                  </div>
                  <div>
                    <button typeof="button" @click="toTaskDetail(detailData.id, detailData.lat, detailData.lng)" style="border: 1px solid #2E8CEB; width: 58px; height: 41px; background-color: #ffffff; border-radius: 3px; color: #2E8CEB; cursor: pointer">详情</button>
                  </div>
                </div>
              </div>
              <div style=" padding: 5px 15px; border-bottom: 1px solid rgb(230, 230, 230);">
                项目基本信息
              </div>
              <div style="padding: 15px; ">
                <div style="line-height: 24px"><span class="label">项目名称：</span><span>{{detailData.businessProjectName}}</span></div>
                <div style="line-height: 24px"><span class="label">任务名称：</span><span>{{detailData.name}}</span></div>
                <div style="line-height: 24px">
                  <span class="label">任务类型：</span>
                  <span v-if="detailData.type === '1'">调查任务</span>
                  <span v-if="detailData.type === '2'">优化任务</span>
                  <span v-if="detailData.type === '3'">宣传任务</span>
                </div>
                <div style="line-height: 24px"><span class="label">负责人：</span><span>{{detailData.taskHoldersName}}</span></div>
                <div style="line-height: 24px"><span class="label">起止日期：</span><span>{{detailData.startTime}} 至 {{detailData.completionTime}}</span></div>
                <div style="line-height: 24px">
                  <span class="label">任务性质：</span>
                  <span v-if="detailData.nature === '1'">单点优化</span>
                  <span v-if="detailData.nature === '2'">线优化</span>
                  <span v-if="detailData.nature === '3'">区域优化</span>
                </div>
                <div style="line-height: 24px"><span class="label">任务描述：</span><span>{{detailData.remarks}}</span></div>
              </div>
            </Card>
            <Button type="primary" v-show="isDetail" @click="toList" style="position: absolute; top: 600px; left: 0px;">返回列表</Button>
          </TabPane>
          <TabPane name="tab2" label="新任务">
            <Card v-if="!isDetail">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; border-bottom: 1px solid #e6e6e6;">
                <div style="font-size: 16px; font-weight: bold">
                  任务数量：{{this.total}}
                </div>
                <Select v-model="onType" style="width:120px" @on-change="typeChange" clearable>
                  <Avatar :src="avatar2" slot="prefix" size="small" />
                  <Option value="1" >巡检任务</Option>
                  <Option value="2" >优化任务</Option>
                  <Option value="3" >宣传任务</Option>
                </Select>
              </div>
              <div v-for="(item, index) in taskListNew" :key="index" @click="positioning(item.lng, item.lat)" v-show="panelShow" style="position: relative; padding: 15px; border-bottom: 1px solid #e6e6e6;">
                <Collapse simple accordion value="1">
                  <Panel :hide-arrow="true" name="1">
                    <div style="display: flex;width: 100%;justify-content: space-between;margin-bottom: 10px">
                      <div style="padding-right: 10px; line-height: 24px">
                        <div>任务名称: {{item.name}}</div>
                        <div v-if="item.taskStatus === 1" style="font-size: 12px"><p style="margin-right: 5px">任务类型: 巡检任务</p><p>路口数量: {{item.crossingList.length}}</p></div>
                        <div v-if="item.taskStatus === 2" style="font-size: 12px"><p style="margin-right: 5px">任务类型: 优化任务</p><p>路口数量: {{item.crossingList.length}}</p></div>
                        <div v-if="item.taskStatus === 3" style="font-size: 12px"><p style="margin-right: 5px">任务类型: 宣传任务</p><p>路口数量: {{item.crossingList.length}}</p></div>
                      </div>
                      <div style="text-align: right">
                        <Button type="success" @click="handleTask(item, '1')" style="margin-bottom: 10px; display: block">接受</Button>
                        <Button type="error" @click="handleTask(item, '2')">拒绝</Button>
                      </div>
                    </div>
                    <div slot="content" style="padding: 0">
                      <ul style="list-style-type: none; line-height: 30px">
                        <li v-for="(rItem, rIndex) in item.crossingList" :key="rIndex" style="border-bottom: 1px solid #e6e6e6; font-size: 12px">任务路口: {{rItem.alias}}</li>
                      </ul>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { listTask, areaData, listMapTask, selectTaskDetail, listMyNotAcceptedTask, listMapProject, acceptOrRefuseTask, taskFunction } from '@/api/data'
import { getUserId } from '@/libs/util'
import tx1 from '../../assets/images/tx1.png'
import tx2 from '../../assets/images/tx2.png'
import tx3 from '../../assets/images/tx3.png'
import tx4 from '../../assets/images/tx4.png'
import tx5 from '../../assets/images/tx5.png'
import tx6 from '../../assets/images/tx6.png'
import tx7 from '../../assets/images/tx7.png'
import tx8 from '../../assets/images/tx8.png'
import tx9 from '../../assets/images/tx9.png'
import txj1 from '../../assets/images/txj1.png'
import txj2 from '../../assets/images/txj2.png'
import txj3 from '../../assets/images/txj3.png'
import txj4 from '../../assets/images/txj4.png'
import txj5 from '../../assets/images/txj5.png'
import txj6 from '../../assets/images/txj6.png'
import txj7 from '../../assets/images/txj7.png'
import txj8 from '../../assets/images/txj8.png'
import txj9 from '../../assets/images/txj9.png'
import ty1 from '../../assets/images/ty1.png'
import ty2 from '../../assets/images/ty2.png'
import ty3 from '../../assets/images/ty3.png'
import ty4 from '../../assets/images/ty4.png'
import ty5 from '../../assets/images/ty5.png'
import ty6 from '../../assets/images/ty6.png'
import ty7 from '../../assets/images/ty7.png'
import ty8 from '../../assets/images/ty8.png'
import ty9 from '../../assets/images/ty9.png'
import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap'
let amapManager = new AMapManager()
export default {
  name: 'myTask',
  data () {
    let self = this
    return {
      projectList: [],
      businessProjectId: '',
      tab: 'tab1',
      tx1,
      tx2,
      tx3,
      tx4,
      tx5,
      tx6,
      tx7,
      tx8,
      tx9,
      txj1,
      txj2,
      txj3,
      txj4,
      txj5,
      txj6,
      txj7,
      txj8,
      txj9,
      ty1,
      ty2,
      ty3,
      ty4,
      ty5,
      ty6,
      ty7,
      ty8,
      ty9,
      avatar: '#FF5000',
      avatar2: tx1,
      onStatus: '4',
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
      taskList: [],
      taskListNew: [],
      total: 0,
      page: 1,
      maxPage: 1,
      onType: '1',
      taskName: ''
    }
  },
  watch: {
    'tab': function (val) {
      this.isDetail = false
      this.markers = []
      this.markerRefs = []
      this.map.clearMarkers()
      if (val === 'tab1') {
        this.getTask()
        this.getMapTask()
      } else {
        this.getMapTaskNew()
      }
    },
    'onStatus': function (val) {
      switch (val) {
        case undefined:
          this.onStatus = ''
          break
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
      if (this.detailData.taskStatus === '1') {
        return '未领取'
      } else if (this.detailData.taskStatus === '2') {
        return '已拒绝'
      } else if (this.detailData.taskStatus === '3') {
        return '未开始'
      } else if (this.detailData.taskStatus === '4') {
        return '进行中'
      } else if (this.detailData.taskStatus === '5') {
        return '审核中'
      } else if (this.detailData.taskStatus === '6') {
        return '已完成'
      } else if (this.detailData.taskStatus === '7') {
        return '已驳回'
      } else if (this.detailData.taskStatus === '8') {
        return '已撤销'
      } else if (this.detailData.status === '9') {
        return '已暂停'
      }
    }
  },
  methods: {
    toTaskDetail (id, lat, lng) {
      this.$router.push({
        name: 'taskDetail',
        query: {
          taskId: id,
          lat,
          lng
        }
      })
    },
    handleTask (item, type) {
      acceptOrRefuseTask({
        taskId: item.id,
        userId: getUserId(),
        functionType: type,
        reason: ''
      }).then((res) => {
        this.$Message.info(res.data.msg)
        this.markers = []
        this.markerRefs = []
        this.map.clearMarkers()
        this.tab = 'tab1'
      })
    },
    changeProject () {
      this.getMapTaskNew()
    },
    onChangeNav (to) {
      this.$router.push({
        name: to
      })
    },
    initMark (self, o) {
      self.map = new AMap.MarkerClusterer(o, self.markerRefs, {
        gridSize: 80,
        minClusterSize: 2
      })
    },
    statusChange () {
      this.getTask()
      this.markers = []
      this.markerRefs = []
      this.map.clearMarkers()
      this.getMapTask().then(() => {
        if (this.onStatus === '') {
          let o = amapManager.getMap()
          o.setFitView(this.markerRefs)
        }
      })
    },
    toList () {
      this.isDetail = false
    },
    firstPage () {
      this.page = 1
      this.getTask()
    },
    prevPage () {
      if (this.page !== 1) {
        this.page--
        this.getTask()
      }
    },
    nextPage () {
      if (this.page < this.maxPage) {
        this.page++
        this.getTask()
      }
    },
    allProject () {
      this.onStatus = ''
    },
    close () {
      this.panelShow = !this.panelShow
    },
    positioning (lng, lat) {
      this.zoom = 16
      this.center = [lng, lat]
    },
    searchProject () {
      this.page = 1
      this.getTask()
    },
    onEdit (params, row) {
      if (params.permissionCode === '2') {
        this.$Modal.confirm({
          title: params.permissionCode === '2' ? '确定要' + (row.pauseStatus === '0' ? '暂停' : '开始') + '该任务吗？' : '确定要申请' + (row.pauseStatus === '0' ? '暂停' : '开始') + '该任务吗？',
          onOk: () => {
            taskFunction({
              'taskId': row.id,
              'userId': getUserId(),
              'functionType': params.permissionCode,
              'pauseStatus': row.pauseStatus === '0' ? '1' : '0'
            }).then((res) => {
              this.$Message.info(res.data.msg)
              this.markers = []
              this.markerRefs = []
              this.map.clearMarkers()
              this.getMapTask()
              this.getTask()
              this.toList()
            })
          }
        })
      } else if (params.permissionCode === '99') {
        this.$router.push({
          name: 'addTaskRoad'
        })
      } else {
        let str = ''
        switch (params.permissionCode) {
          case '1':
            str = '确定要下达该任务吗？'
            break
          case '3':
            str = '确定要撤销该任务吗？'
            break
          case '4':
            str = '确定要催办该任务吗？'
            break
          case '5':
            str = '确定要提交审核吗？'
            break
          case '6':
            str = '确定要删除该任务吗？'
            break
        }
        this.$Modal.confirm({
          title: str,
          onOk: () => {
            taskFunction({
              'taskId': row.id,
              'userId': getUserId(),
              'functionType': params.permissionCode
            }).then((res) => {
              this.$Message.info(res.data.msg)
              this.markers = []
              this.markerRefs = []
              this.map.clearMarkers()
              this.getMapTask()
              this.getTask()
              this.toList()
            })
          }
        })
      }
    },
    getTask () {
      listTask({
        pageSize: 3,
        page: this.page,
        userId: getUserId(),
        businessProjectId: '',
        type: '',
        name: this.taskName,
        taskStatus: this.onStatus ? this.onStatus : '',
        firstPartyScoring: '',
        provinceName: '',
        cityName: '',
        districtName: '',
        timeStatus: '',
        startTime: '',
        endTime: ''
      }).then((res) => {
        this.taskList = res.data.data.taskDetailBeans
        if (this.taskList.length > 0) {
          this.center = [this.taskList[0].lng, this.taskList[0].lat]
        } else {
          this.center = this.center.length === 0 ? [116.397428, 39.90923] : this.center
        }
        this.total = res.data.data.count
        if (Number(this.total) < 3 && Number(this.total) > 0) {
          this.maxPage = 1
        } else if (Number(this.total) === 0) {
          this.maxPage = 1
          this.page = 1
        } else {
          this.maxPage = Math.ceil(Number(this.total) / 3)
        }
      })
    },
    getProjectDetail (id) {
      selectTaskDetail({
        taskId: id,
        userId: getUserId()
      }).then((res) => {
        this.isDetail = true
        this.detailData = res.data.data
      })
    },
    getMapTask () {
      return listMapTask({
        pageSize: 0,
        page: 0,
        userId: getUserId(),
        businessProjectId: '',
        type: '',
        name: this.taskName,
        taskStatus: this.onStatus,
        firstPartyScoring: '',
        provinceName: '',
        cityName: '',
        districtName: '',
        timeStatus: '',
        startTime: '',
        endTime: ''
      }).then((res) => {
        let taskList = res.data.data.taskList
        let self = this
        taskList.forEach((item) => {
          let status = ''
          if (item.pauseStatus === '1') {
            switch (item.type) {
              case '1' :
                status = `<div><img src="${txj9}" style="width: 30px; height: 30px"></div>`
                break
              case '2' :
                status = `<div><img src="${ty9}" style="width: 30px; height: 30px"></div>`
                break
              case '3' :
                status = `<div><img src="${tx9}" style="width: 30px; height: 30px"></div>`
                break
            }
          } else {
            switch (item.type) {
              case '1' :
                switch (item.taskStatus) {
                  case '1':
                    status = `<div><img src="${txj1}" style="width: 30px; height: 30px"></div>`
                    break
                  case '2':
                    status = `<div><img src="${txj2}" style="width: 30px; height: 30px"></div>`
                    break
                  case '3':
                    status = `<div><img src="${txj3}" style="width: 30px; height: 30px"></div>`
                    break
                  case '4':
                    status = `<div><img src="${txj4}" style="width: 30px; height: 30px"></div>`
                    break
                  case '5':
                    status = `<div><img src="${txj5}" style="width: 30px; height: 30px"></div>`
                    break
                  case '6':
                    status = `<div><img src="${txj6}" style="width: 30px; height: 30px"></div>`
                    break
                  case '7':
                    status = `<div><img src="${txj7}" style="width: 30px; height: 30px"></div>`
                    break
                  case '8':
                    status = `<div><img src="${txj8}" style="width: 30px; height: 30px"></div>`
                    break
                }
                break
              case '2' :
                switch (item.taskStatus) {
                  case '1':
                    status = `<div><img src="${ty1}" style="width: 30px; height: 30px"></div>`
                    break
                  case '2':
                    status = `<div><img src="${ty2}" style="width: 30px; height: 30px"></div>`
                    break
                  case '3':
                    status = `<div><img src="${ty3}" style="width: 30px; height: 30px"></div>`
                    break
                  case '4':
                    status = `<div><img src="${ty4}" style="width: 30px; height: 30px"></div>`
                    break
                  case '5':
                    status = `<div><img src="${ty5}" style="width: 30px; height: 30px"></div>`
                    break
                  case '6':
                    status = `<div><img src="${ty6}" style="width: 30px; height: 30px"></div>`
                    break
                  case '7':
                    status = `<div><img src="${ty7}" style="width: 30px; height: 30px"></div>`
                    break
                  case '8':
                    status = `<div><img src="${ty8}" style="width: 30px; height: 30px"></div>`
                    break
                }
                break
              case '3' :
                switch (item.taskStatus) {
                  case '1':
                    status = `<div><img src="${tx1}" style="width: 30px; height: 30px"></div>`
                    break
                  case '2':
                    status = `<div><img src="${tx2}" style="width: 30px; height: 30px"></div>`
                    break
                  case '3':
                    status = `<div><img src="${tx3}" style="width: 30px; height: 30px"></div>`
                    break
                  case '4':
                    status = `<div><img src="${tx4}" style="width: 30px; height: 30px"></div>`
                    break
                  case '5':
                    status = `<div><img src="${tx5}" style="width: 30px; height: 30px"></div>`
                    break
                  case '6':
                    status = `<div><img src="${tx6}" style="width: 30px; height: 30px"></div>`
                    break
                  case '7':
                    status = `<div><img src="${tx7}" style="width: 30px; height: 30px"></div>`
                    break
                  case '8':
                    status = `<div><img src="${tx8}" style="width: 30px; height: 30px"></div>`
                    break
                }
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
        })
        setTimeout(() => {
          self.initMark(self, amapManager.getMap())
        }, 0)
      })
    },
    getMapTaskNew () {
      listMyNotAcceptedTask({
        'businessProjectId': this.businessProjectId,
        'type': this.onType,
        'name': '',
        'provinceName': '',
        'cityName': '',
        'districtName': '',
        'userId': getUserId()
      }).then((res) => {
        let taskList = this.taskListNew = res.data.data = res.data.data
        this.total = res.data.data.length
        if (taskList.length > 0) {
          this.center = [taskList[0].lng || 116.397428, taskList[0].lat || 39.90923]
        } else {
          this.center = this.center.length === 0 ? [116.397428, 39.90923] : this.center
        }
        let self = this
        taskList.forEach((item) => {
          let status = ''
          switch (item.type) {
            case '1' :
              status = `<div><img src="${txj1}" style="width: 30px; height: 30px"></div>`
              break
            case '2' :
              status = `<div><img src="${ty1}" style="width: 30px; height: 30px"></div>`
              break
            case '3' :
              status = `<div><img src="${tx1}" style="width: 30px; height: 30px"></div>`
              break
          }
          if (item.lng && item.lat) {
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
          }
        })
        setTimeout(() => {
          self.initMark(self, amapManager.getMap())
        }, 0)
      })
    },
    typeChange () {
      this.markers = []
      this.markerRefs = []
      this.map.clearMarkers()
      this.getMapTaskNew()
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
      this.zoom = 16
      this.searchArea()
    }
  },
  mounted () {
    this.getAreaData()
    listMapProject({
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
    lazyAMapApiLoaderInstance.load().then(() => {
      this.getTask()
      this.getMapTask()
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
  .ivu-tabs {
    overflow: inherit;
    /deep/ .ivu-tabs-bar{
      margin: 0;
    }
  }
  .ivu-collapse{
    border: 0 none;
  }
  .ivu-collapse-item{
    /deep/ .ivu-collapse-header{
      display: flex;
      align-items: center;
      height: auto;
      line-height: normal;
      padding-left: 0;
      .ivu-icon-ios-arrow-forward{
        margin-right: 5px;
      }
    }
  }
  .ivu-form-item{
    margin-bottom: 0;
  }
  .ivu-collapse-item-active{
    /deep/ .ivu-collapse-content-box{
      padding: 0;
    }
    /deep/ .ivu-collapse-content{
      padding: 0;
    }
  }
  .btn{
    position: relative;
    top: 5px;
  }
</style>
