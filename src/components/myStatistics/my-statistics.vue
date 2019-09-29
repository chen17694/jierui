<template>
  <div style="background-color: #001529; position: absolute; width: 100%; height: 100%;left: 0; top: 0; z-index: 900; overflow:hidden; padding: 0 15px;">
    <div style="color: rgb(255, 255, 255);position: absolute;right: 15px;top: 15px; z-index: 22; display: flex" @click="close">
      <Icon size="36" color="red" type="md-close" />
      <span style="font-size: 16px; line-height: 36px">关闭</span>
    </div>
    <div style=" padding: 10px 0; height: 15%;">
      <div style="display: inline-block;line-height: 80px;border-top: 5px solid rgb(4, 48, 76);width: 630px;position: absolute;margin-top: 55px;left: 15px;z-index: 1;">
        <Button type="text" style="font-size: 16px; color: #ffffff" :style="{'color': (dateSelect==='1'? '#33CCFF':'#ffffff') }"  @click="lastMonthSlot">上月</Button>
        <Button type="text" style="font-size: 16px; color: #ffffff" :style="{'color': (dateSelect==='2'? '#33CCFF':'#ffffff') }" @click="nowMonthSlot">本月</Button>
        <Button type="text" style="font-size: 16px; color: #ffffff" :style="{'color': (dateSelect==='3'? '#33CCFF':'#ffffff') }" @click="lastSeasonSlot">上季</Button>
        <Button type="text" style="font-size: 16px; color: #ffffff" :style="{'color': (dateSelect==='4'? '#33CCFF':'#ffffff') }" @click="nowSeasonSlot">本季</Button>
        <Button type="text" style="font-size: 16px; color: #ffffff" :style="{'color': (dateSelect==='5'? '#33CCFF':'#ffffff') }" @click="lastYearSlot">去年</Button>
        <Button type="text" style="font-size: 16px; color: #ffffff" :style="{'color': (dateSelect==='6'? '#33CCFF':'#ffffff') }" @click="nowYearSlot">今年</Button>
      </div>
      <div style="display: inline-block;width: 100%;padding: 0;position: absolute;left: 0;text-align: center;height: 140px;">
        <h1 style="display: block; color: #ffffff; font-size: 36px; margin-bottom: 20px">杰瑞配时管理平台</h1>
        <!--<DatePicker type="daterange" placement="bottom-end" placeholder="请选择日期范围" style="background: none;border: 1px solid #04304c; width: 400px" @on-change="selectDate" ></DatePicker>-->
        <DatePicker
          :open="openStart"
          @on-change="selectDateStart"
          type="date">
          <div @click="openStartDate" style="border: 1px solid rgb(58, 160, 255);padding: 10px;border-radius: 5px;color: #ffffff; font-size: 16px; width: 250px; text-align: left; line-height: 20px">
            <Icon type="ios-calendar-outline" style="margin-right: 10px" color="#ffffff"></Icon>
            <span v-if="!startTime">请选择开始日期</span>
            <span>{{startTime}}</span>
          </div>
        </DatePicker>
        <span style="margin: 0 10px; font-size: 16px; color: #ffffff">至</span>
        <DatePicker
          placeholder="请选择结束日期"
          :open="openEnd"
          @on-change="selectDateEnd"
          type="date">
          <div @click="openEndDate" style="border: 1px solid rgb(58, 160, 255);padding: 10px;border-radius: 5px;color: #ffffff; font-size: 16px; width: 250px; text-align: left; line-height: 20px">
            <Icon type="ios-calendar-outline" style="margin-right: 10px" color="#ffffff"></Icon>
            <span v-if="!endTime">请选择结束日期</span>
            <span>{{endTime}}</span>
          </div>
        </DatePicker>
      </div>
      <div style="display: inline-block; line-height: 80px;border-top: 5px solid rgb(4, 48, 76);width: 630px;position: absolute;text-align: right;margin-top: 55px;right: 15px;z-index: 1;">
        <Button type="primary"  @click="search" style="">搜索</Button>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between;height:40%">
      <div style="width: 60%; display: flex; justify-content: space-between">
        <div style="width: 38%">
          <div style="height:33.3333333%" @click="listRowClick('1')" >
            <Row class="listRow" :style="{'background': (listRowType==='1'? '#04304c':'none') }" style="border: 1px solid #00284d; margin-bottom: 15px" type="flex" align="middle" justify="space-around">
              <Col span="12" style="height: 100%; padding: 10px">
                <p style="font-size: 14px; color: #ffffff; font-weight: bold;">项目统计</p>
                <div style="padding-left: 5px">
                  <p style="margin: 6px 0; color: #33ccff; font-size: 14px; font-weight: bold">总数: {{data1.total ? data1.total : 0}}</p>
                  <ul style="list-style-type: none">
                    <li style="margin-bottom: 6px; color: #ffffff; display: flex;align-items: center;">
                      <span style="width: 5px; height: 5px; display: inline-block; background-color: #75dbdb; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 6px; margin-right: 6px">进行中的数量</span>{{data1.ongoingCount ? data1.ongoingCount : ''}}
                    </li>
                    <li style="color: #ffffff; display: flex;align-items: center;">
                      <span style="width: 5px; height: 5px; display: inline-block; background-color: #d85457; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 6px; margin-right: 6px">逾期的数量</span>{{data1.overdueCount ? data1.overdueCount : ''}}
                    </li>
                  </ul>
                </div>
              </Col>
              <Col span="12" style="width: 50%; height: 100%;">
                <div ref="dom1" style="height: 100%;" class="charts chart-pie"></div>
                <p style="color: #ffffff; position: absolute;bottom: 0px;right: 4%;">{{dom1Str}}</p>
              </Col>
            </Row>
          </div>
          <div  style="height:33.3333333%" @click="listRowClick('2')" >
            <Row class="listRow" :style="{'background': (listRowType==='2'? '#04304c':'none') }" style="border: 1px solid #00284d; margin-bottom: 15px" type="flex" align="middle" justify="space-around">
              <Col span="12" style="height: 100%; padding: 10px">
                <p style="font-size: 14px; color: #ffffff; font-weight: bold;">任务统计</p>
                <div style="padding-left: 5px">
                  <p style="margin: 6px 0; color: #33ccff; font-size: 14px; font-weight: bold">总数: {{data2.total ? data2.total : 0}}</p>
                  <ul style="list-style-type: none">
                    <li style="margin-bottom: 6px; color: #ffffff; display: flex;align-items: center;">
                      <span style="width: 5px; height: 5px; display: inline-block; background-color: #75dbdb; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 6px; margin-right: 6px">进行中的数量</span>{{data2.ongoingCount ? data2.ongoingCount : ''}}
                    </li>
                    <li style="color: #ffffff; display: flex;align-items: center;">
                      <span style="width: 5px; height: 5px; display: inline-block; background-color: #d85457; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 6px; margin-right: 6px">逾期的数量</span>{{data2.overdueCount ? data2.overdueCount : ''}}
                    </li>
                  </ul>
                </div>
              </Col>
              <Col span="12" style="height: 100%;">
                <div ref="dom2" style="height: 100%;" class="charts chart-pie"></div>
                <p style="color: #ffffff; position: absolute;bottom: 0px;right: 4%;">{{dom2Str}}</p>
              </Col>
            </Row>
          </div>
          <div  style="height:33.3333333%" @click="listRowClick('3')" >
            <Row class="listRow" :style="{'background': (listRowType==='3'? '#04304c':'none') }" style="border: 1px solid #00284d;" type="flex" align="middle" justify="space-around">
              <Col span="12" style="height: 100%; padding: 10px">
                <p style="font-size: 14px; color: #ffffff; font-weight: bold;">任务路口统计</p>
                <div style="padding-left: 5px">
                  <p style="margin: 6px 0; color: #33ccff; font-size: 14px; font-weight: bold">总数: {{data3.total ? data3.total : 0}}</p>
                  <ul style="list-style-type: none">
                    <li style="margin-bottom: 6px; color: #ffffff; display: flex;align-items: center;">
                      <span style="width: 5px; height: 5px; display: inline-block; background-color: #75dbdb; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 6px; margin-right: 6px">进行中的数量</span>{{data3.ongoingCount ? data3.ongoingCount : ''}}
                    </li>
                    <li style="color: #ffffff; display: flex;align-items: center;">
                      <span style="width: 5px; height: 5px; display: inline-block; background-color: #d85457; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 6px; margin-right: 6px">逾期的数量</span>{{data3.overdueCount ? data3.overdueCount : ''}}
                    </li>
                  </ul>
                </div>
              </Col>
              <Col span="12" style="height: 100%;">
                <div ref="dom3" style="height: 100%;" class="charts chart-pie"></div>
                <p style="color: #ffffff; position: absolute;bottom: 0px;right: 4%;">{{dom3Str}}</p>
              </Col>
            </Row>
          </div>
        </div>
        <div style="border: 1px solid #00284d; width: 60%; position: relative;height:100%;height: 100%;overflow:hidden;" v-show="mapReady">
          <p v-if="listRowType === '1'" style="position: absolute; z-index: 1; top: 15px; left: 15px; font-size: 16px; font-weight: bold; color: #ffffff;">项目总数：{{data1.total ? data1.total : 0}}</p>
          <p v-if="listRowType === '2'" style="position: absolute; z-index: 1; top: 15px; left: 15px; font-size: 16px; font-weight: bold; color: #ffffff;">任务总数：{{data2.total ? data2.total : 0}}</p>
          <p v-if="listRowType === '3'" style="position: absolute; z-index: 1; top: 15px; left: 15px; font-size: 16px; font-weight: bold; color: #ffffff;">任务路口总数：{{data3.total ? data3.total : 0}}</p>
          <el-amap
            :amap-manager="amapManager"
            :center="center"
            :zoom="zoom"
            vid="amapDemo"
            :events="events"
            :zoomEnable="false"
            :dragEnable="false"
            class="amap-demo"
          >
            <el-amap-marker v-for="(marker, index) in markers" :key="index" :extData = "marker.id" vid="chenyiming" :position="marker.position" :content="marker.content" :events="marker.events"></el-amap-marker>
          </el-amap>
        </div>
      </div>
      <div style="width: 39%; border: 1px solid #00284d;">
        <p slot="title" style="padding: 10px; color: #ffffff;font-size: 16px; font-weight: bold; border-bottom: 1px solid #00284d;">项目下任务数量</p>
        <ul class="mlist" style="padding:2px;">
          <li v-for="(item, key) in tableData1" :key="key">
            <div class="table-left" style="color: #ffffff; display: flex; align-items: center">
              <span class="index">{{key + 1}}</span>
              <span style="margin-right: 25px; display: inline-block; height: 24px; background-color: #fff; width: 1px"></span>
              <span :title="item.name" style="word-break:keep-all; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width: 150px; display: inline-block">{{item.name}}</span>
            </div>
            <div class="table-right" style="color: #ffffff">
              | <span class="progress" >
              <span class="showNum" :style="{width: (320/(320/item.taskCount)) + 'px'}"></span>
            </span>
              | &nbsp;任务数量：<span class="num">{{item.taskCount}}</span>
            </div>
          </li>
        </ul>
        <div class="page" style="padding: 2px 15px; color: #ffffff; border-top: 1px solid #00284d;">
          <div>共 <span style="font-weight: bold; font-size: 16px">{{tableData1Total}}</span> 条</div>
          <Page
            :total="tableData1Total"
            show-sizer
            show-elevator
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange" />
        </div>
      </div>
    </div>
    <div style="heigth:45%; overflow:hidden;margin-top: 20px; margin-bottom: 30px; display: flex; justify-content: space-between">
      <div style="width: 60%;height:calc(45vh - 30px); border: 1px solid #00284d;">
        <div style="display: flex; justify-content: space-between; padding: 15px 15px 0 15px;">
          <p style="color: #ffffff;font-size: 18px; font-weight: bold;">任务与任务路口完成情况</p>
          <div>
            <span class="label" style="margin-right: 5px; color: #ffffff">选择项目:</span>
            <Select v-model="projectList2Id" placeholder="请选择项目" filterable clearable style="width: 300px" @on-change="getTaskDateCount">
              <Option v-for="(item, key) in projectList2" :key="key" :value="item.id">{{item.name}}</Option>
            </Select>
          </div>
        </div>
        <div style="height:calc(45vh - 57px); padding:0 15px 15px 15px; color: #ffffff; border-bottom: 1px solid #00284d;">
          <Row style="height: 50%;">
            <Col span="24">
              <div ref="dom4" style="height: 100%;min-height:200px;"></div>
            </Col>
          </Row>
          <Row style="height: 50%;">
            <Col span="24" style="text-align: right">
              <span class="label" style="margin-right: 5px;">选择任务:</span>
              <Select v-model="taskListId" placeholder="请选择任务" filterable clearable style="width: 300px" @on-change="getTaskCrossingDateCount">
                <Option v-for="(item, key) in taskList" :key="key" :value="item.id">{{item.name}}</Option>
              </Select>
            </Col>
            <Col span="24">
              <div ref="dom5" style="height:calc(100% - 32px);min-height:158px;"></div>
            </Col>
          </Row>
        </div>
      </div>
      <div style="width: 39%; height:calc(45vh - 30px); overflow: hidden">
        <div style=" height: 100%;display: flex; justify-content: space-between">
          <div style="height: 100%; width: 48.6%; border: 1px solid #00284d; position: relative; overflow: hidden; padding: 10px 10px">
            <p style="color: #ffffff;font-size: 18px; font-weight: bold">项目下人员已支出工作量排名</p>
            <div style="width: 100%; height: 60px; user-select: none;">
              <div class="scroll-outer" style="overflow-y: scroll;" ref="scrollOuter">
                <div ref="scrollBody" class="scroll-body" :style="{top: tagBodyLeft + 'px'}">
                  <div v-for="(item, index) in projectList2" :key="index" @click="handleClick1(item)" style="padding: 1px 0" :style="{'color': item.id === projectList3Id ? '#ffffff' : '#999999'}">
                    <Icon type="md-arrow-dropright" color="#33ccff" v-if="item.id === projectList3Id" />
                    <span v-else style="width: 15px; display: inline-block"></span>
                    {{item.name}}
                  </div>
                </div>
              </div>
            </div>
            <div style=" height:calc(100% - 110px); overflow:auto; margin-top: 50px">
              <div style="width: 100%;height:100%">
                <div v-for="(item, index) in userWorkingHours" :key="index" v-if="index<5"  style="width:100% ;color: #ffffff; line-height: 28px; margin-bottom: 2px">
                  <span style="margin-right: 10px;  width: 16px; display: inline-block">{{index + 1}}</span>
                  <span style="padding: 0 15px; border-left: 1px solid #fff; border-right: 1px solid #fff; margin-right: 10px; width: 228px; display: inline-block">{{item.userName}}</span>
                  <span style="color: #3aa0ff">工时：{{item.workingHours}}</span>
                </div>
              </div>
              <div style="width: 50%">
                <div v-for="(item, index) in userWorkingHours" :key="index" v-if="index>4" style="color: #ffffff; line-height: 30px; margin-bottom: 10px">
                  <span style="margin-right: 10px; width: 16px; display: inline-block">{{index + 1}}</span>
                  <span style="padding: 0 15px; border-left: 1px solid #fff; border-right: 1px solid #fff; margin-right: 10px;">{{item.userName}}</span>
                  <span style="color: #3aa0ff">工时：{{item.workingHours}}</span>
                </div>
              </div>
            </div>
          </div>
          <div style="height: 100%; width: 48.6%; border: 1px solid #00284d; position: relative; overflow: hidden; padding: 15px">
            <p style="color: #ffffff;font-size: 18px; font-weight: bold">单路口执行各类任务排名</p>
            <div style="width: 100%; height: 60px; user-select: none;">
              <div class="scroll-outer" style="overflow-y: scroll;" ref="scrollOuter2" >
                <div ref="scrollBody2" class="scroll-body" :style="{top: tagBodyLeft2 + 'px'}">
                  <div v-for="(item, index) in taskCrossingList2" :key="index" @click="handleClick2(item)" style="padding: 5px 0" :style="{'color': item.crossingCode === taskCrossingListId ? '#ffffff' : '#999999'}">
                    <Icon type="md-arrow-dropright" color="#33ccff" v-if="item.crossingCode === taskCrossingListId" />
                    <span v-else style="width: 15px; display: inline-block"></span>
                    {{item.alias}}
                  </div>
                </div>
              </div>
            </div>
            <div style="margin-top: 30px">
              <Row>
                <Col span="24">
                  <div ref="dom6" class="charts chart-pie" style="height: 200px; position:relative;"></div>
                </Col>
                <Col span="24">
                  <ul style=" display: flex; flex-direction: column; justify-content: center;text-align:left;">
                    <li style="display: flex; align-items: center; justify-content: flex-start;margin-bottom:20px; color: #ffffff">
                      <div class="dian" style="background-color: #4dcb73"></div>
                      <div class="status">宣传任务</div>
                      <div
                        class="proportion"
                      >{{pie6Data.publicityTypeCount == '0' ? '0%' : Percentage(pie6Data.publicityTypeCount, pie6Data.taskCount)}}</div>
                      <div class="value">执行任务数量：&nbsp;&nbsp;&nbsp;&nbsp;{{pie6Data.publicityTypeCount}}</div>
                    </li>
                    <li style="display: flex; align-items: center; justify-content: flex-start;margin-bottom:20px; color: #ffffff">
                      <div class="dian" style="background-color: #3aa0ff"></div>
                      <div class="status">巡检任务</div>
                      <div
                        class="proportion"
                      >{{pie6Data.patrolTypeCount == '0' ? '0%' : Percentage(pie6Data.patrolTypeCount, pie6Data.taskCount)}}</div>
                      <div class="value">执行任务数量：&nbsp;&nbsp;&nbsp;&nbsp;{{pie6Data.patrolTypeCount}}</div>
                    </li>
                    <li style="display: flex; align-items: center; justify-content: flex-start;margin-bottom:20px;  color: #ffffff">
                      <div class="dian" style="background-color: #37cbcb"></div>
                      <div class="status">优化任务</div>
                      <div
                        class="proportion"
                      >{{pie6Data.optimizingTypeCount == '0' ? '0%' : Percentage(pie6Data.optimizingTypeCount, pie6Data.taskCount)}}</div>
                      <div class="value">执行任务数量：&nbsp;&nbsp;&nbsp;&nbsp;{{pie6Data.optimizingTypeCount}}</div>
                    </li>
                  </ul>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap'
import echarts from 'echarts'
import tdTheme from './theme.json'
import { getLastMonthStartDate, getLastMonthEndDate, getMonthStartDate, getMonthEndDate, getQuarterStartDate, getQuarterEndDate, getLastQuarterStartDate, getLastQuarterEndDate, getCurrentYear, getLastYear } from '@/libs/mdate.js'
import {
  mapCoordinateStatistics,
  listMapProject,
  listMapTask,
  listMapTaskCrossing,
  projectTaskCount,
  taskDateCount,
  listProject,
  listTask,
  taskCrossingDateCount,
  userProjectWorkingHours,
  listTaskCrossing,
  taskCountStatisticsByTpye
} from '@/api/data'
import { getUserId } from '@/libs/util'
let amapManager = new AMapManager()

echarts.registerTheme('tdTheme', tdTheme)
let color1 = ['#3aa0ff', '#d9585d']
let color2 = ['#75dbdb', '#d9585d']
let color3 = ['#85db9f', '#d9585d']
export default {
  name: 'myStatistics',
  data () {
    let self = this
    return {
      dom1Str: '逾期占比',
      dom2Str: '逾期占比',
      dom3Str: '逾期占比',
      mapReady: false,
      listRowType: '1',
      taskCrossingListId: '',
      taskCrossingList2: [],
      tagBodyLeft: 0,
      tagBodyLeft2: 0,
      xData: [],
      yData1: [],
      yData2: [],
      seriesDatas: [],
      projectMonth: [],
      projectList2: [],
      projectList2Id: '',
      projectList3Id: '',
      tableData1: [],
      tableData1Total: 0,
      getTaskParams: {
        pageSize: 10,
        page: 1,
        startTime: this.startTime,
        endTime: this.endTime
      },
      markers: [],
      markerRefs: [],
      pieData1: [],
      pieData2: [],
      pieData3: [],
      dom1: null,
      dom2: null,
      dom3: null,
      dom4: null,
      dom5: null,
      dom6: null,
      projectList: [],
      taskList: [],
      taskListId: '',
      taskCrossingList: [],
      zoom: 3.5,
      amapManager: amapManager,
      center: [104, 40],
      events: {
        init () {
          let map = amapManager.getMap()
          new AMap.DistrictSearch({
            extensions: 'all',
            subdistrict: 0
          }).search('中国', function (status, result) {
            console.log(status)
            console.log(result)
            // 外多边形坐标数组和内多边形坐标数组
            let outer = [
              new AMap.LngLat(-360, 90, true),
              new AMap.LngLat(-360, -90, true),
              new AMap.LngLat(360, -90, true),
              new AMap.LngLat(360, 90, true)
            ]
            let outer2 = [
              new AMap.LngLat(360, 90, true),
              new AMap.LngLat(360, -90, true),
              new AMap.LngLat(360, -90, true),
              new AMap.LngLat(360, 90, true)
            ]
            let holes = result.districtList[0].boundaries
            let pathArray = [
              outer
            ]
            let pathArray2 = [
              outer2
            ]
            pathArray.push.apply(pathArray, holes)
            pathArray2.push.apply(pathArray2, holes)
            let polygon = new AMap.Polygon({
              pathL: pathArray,
              strokeColor: '#001529',
              strokeWeight: 1,
              fillColor: '#001529',
              fillOpacity: 1
            })
            let polygon2 = new AMap.Polygon({
              pathL: pathArray2,
              strokeColor: '#073d5c',
              strokeWeight: 1,
              fillColor: '#073d5c',
              fillOpacity: 1
            })
            polygon.setPath(pathArray)
            polygon2.setPath(pathArray2)
            map.add(polygon)
            map.add(polygon2)
            self.mapReady = true
          })
          self.listRowClick('1')
        }
      },
      data1: {},
      data2: {},
      data3: {},
      map: null,
      userWorkingHours: [],
      pie6Data: {},
      startTime: this.startTime,
      endTime: this.endTime,
      openStart: false,
      openEnd: false,
      dateSelect: '6'
    }
  },
  methods: {
    openStartDate () {
      this.openStart = !this.openStart
    },
    openEndDate () {
      this.openEnd = !this.openEnd
    },
    selectDate () {
      console.log(arguments)
      this.getTaskParams.startTime = this.startTime = arguments[0][0]
      this.getTaskParams.endTime = this.endTime = arguments[0][1]
    },
    renderData () {
      this.getMapCoordinateStatistics('1')
      this.getMapCoordinateStatistics('2')
      this.getMapCoordinateStatistics('3')
      this.getTask()
      this.getTaskCrossingDateCount()
      this.getTaskDateCount()
      console.log(213)
      userProjectWorkingHours({
        startTime: this.startTime,
        endTime: this.endTime,
        projectId: this.projectList3Id
      }).then((res) => {
        console.log(res)
        this.userWorkingHours = res.data.data
      })
      taskCountStatisticsByTpye({
        startTime: this.startTime,
        endTime: this.endTime,
        userId: getUserId(),
        crossingCode: this.taskCrossingListId
      }).then((res) => {
        if (res.data.status === '200') {
          this.pie6Data = res.data.data
          this.setPie6()
        }
      })
    },
    lastMonthSlot () {
      this.dateSelect = '1'
      this.getTaskParams.startTime = this.startTime = getLastMonthStartDate()
      this.getTaskParams.endTime = this.endTime = getLastMonthEndDate()
      this.renderData()
    },
    nowMonthSlot () {
      this.dateSelect = '2'
      this.getTaskParams.startTime = this.startTime = getMonthStartDate()
      this.getTaskParams.endTime = this.endTime = getMonthEndDate()
      this.renderData()
    },
    lastSeasonSlot () {
      this.dateSelect = '3'
      this.getTaskParams.startTime = this.startTime = getLastQuarterStartDate()
      this.getTaskParams.endTime = this.endTime = getLastQuarterEndDate()
      this.renderData()
    },
    nowSeasonSlot () {
      this.dateSelect = '4'
      this.getTaskParams.startTime = this.startTime = getQuarterStartDate()
      this.getTaskParams.endTime = this.endTime = getQuarterEndDate()
      this.renderData()
    },
    lastYearSlot () {
      this.dateSelect = '5'
      this.getTaskParams.startTime = this.startTime = getLastYear().startTime
      this.getTaskParams.endTime = this.endTime = getLastYear().endTime
      this.renderData()
    },
    nowYearSlot () {
      this.dateSelect = '6'
      this.getTaskParams.startTime = this.startTime = getCurrentYear().startTime
      this.getTaskParams.endTime = this.endTime = getCurrentYear().endTime
      this.renderData()
    },
    Percentage (num1, num2) {
      // 计算百分比
      return (
        isNaN(Math.round((parseFloat(num1) / parseFloat(num2)) * 10000) / 100.0) ? '0%' : Math.round((parseFloat(num1) / parseFloat(num2)) * 10000) / 100.0 + '%'
      )
    },
    // getTaskCountStatisticsByTpye () {
    //   let _this = this
    //   taskCountStatisticsByTpye({
    //     startTime: this.startTime,
    //     endTime: this.endTime,
    //     userId: getUserId(),
    //     crossingCode: ''
    //   }).then((res) => {
    //     if (res.data.status === '200') {
    //       _this.pie6Data = res.data.data
    //       this.setPie6()
    //     }
    //   })
    // },
    setPie6 () {
      let option = {
        label: {
          normal: {
            show: false,
            position: 'center',
            formatter: '{b} \n \n {d}%'
          },
          emphasis: {
            show: true,
            textStyle: {
              color: '#ffffff',
              fontSize: '14',
              fontWeight: 'bold'
            }
          }
        },
        graphic: [
          {
            // 环形图中间添加文字
            type: 'text', // 通过不同top值可以设置上下显示
            left: '38%',
            top: '42%',
            style: {
              text: '任务总数量' + '\n' + '\n' + this.pie6Data.taskCount || 0,
              textAlign: 'center',
              fill: '#ffffff', // 文字的颜色
              fontSize: 16,
              fontFamily: 'Microsoft YaHei'
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '数量占比 <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['50%', '50%'],
            label: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.pie6Data.publicityTypeCount,
                name: '宣传任务'
              },
              {
                value: this.pie6Data.patrolTypeCount,
                name: '巡检任务' },
              {
                value: this.pie6Data.optimizingTypeCount,
                name: '优化任务'
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function (params) {
                  let colorList = [
                    '#4dcb73',
                    '#3aa0ff',
                    '#37cbcb'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      this.dom6 = echarts.init(this.$refs.dom6, 'tdTheme')
      this.dom6.setOption(option)
    },
    close () {
      this.$emit('statisticsShow')
    },
    handleClick1 (item) {
      this.projectList3Id = item.id
      userProjectWorkingHours({
        startTime: this.startTime,
        endTime: this.endTime,
        projectId: item.id
      }).then((res) => {
        console.log(res)
        this.userWorkingHours = res.data.data
      })
    },
    handlescroll (e) {
      var type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
      }
      this.handleScroll(delta)
    },
    handleClick2 (item) {
      this.taskCrossingListId = item.crossingCode
      taskCountStatisticsByTpye({
        startTime: this.startTime,
        endTime: this.endTime,
        userId: getUserId(),
        crossingCode: item.crossingCode
      }).then((res) => {
        if (res.data.status === '200') {
          this.pie6Data = res.data.data
          this.setPie6()
        }
      })
    },
    handlescroll2 (e) {
      var type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
      }
      this.handleScroll2(delta)
    },
    handleScroll (offset) {
      console.log(offset)
      const outerWidth = this.$refs.scrollOuter.offsetHeight
      const bodyWidth = this.$refs.scrollBody.offsetHeight
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
            this.tagBodyLeft = this.tagBodyLeft
          } else {
            this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
          }
        } else {
          this.tagBodyLeft = 0
        }
      }
    },
    handleScroll2 (offset) {
      console.log(offset)
      const outerWidth = this.$refs.scrollOuter2.offsetHeight
      const bodyWidth = this.$refs.scrollBody2.offsetHeight
      if (offset > 0) {
        this.tagBodyLeft2 = Math.min(0, this.tagBodyLeft2 + offset)
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft2 < -(bodyWidth - outerWidth)) {
            this.tagBodyLeft2 = this.tagBodyLeft2
          } else {
            this.tagBodyLeft2 = Math.max(this.tagBodyLeft2 + offset, outerWidth - bodyWidth)
          }
        } else {
          this.tagBodyLeft2 = 0
        }
      }
    },
    getTaskCrossingDateCount () {
      taskCrossingDateCount({
        startTime: this.startTime,
        endTime: this.endTime,
        taskId: this.taskListId
      }).then((res) => {
        console.log(res)
        let data = res.data.data
        let a = []
        let b = []
        let c = []
        data.forEach((item) => {
          a.push(item.finishCount)
          b.push(item.notFinishCount)
          c.push(item.month + '月')
        })
        this.yData1 = a
        this.yData2 = b
        this.xData = c
        this.setLine1()
      })
    },
    getTaskDateCount () {
      taskDateCount({
        startTime: this.startTime,
        endTime: this.endTime,
        projectId: this.projectList2Id
      }).then((res) => {
        console.log(res)
        let data = res.data.data
        let a = []
        let b = []
        let c = []
        data.forEach((item) => {
          a.push(item.finishCount)
          b.push(item.notFinishCount)
          c.push(item.month + '月')
        })
        this.seriesDatas = [a, b]
        this.projectMonth = c
        console.log(this.seriesDatas)
        console.log(this.projectMonth)
        this.setBar1()
      })
    },
    pageChange (val) {
      this.getTaskParams.page = val
      this.getTask()
    },
    pageSizeChange (val) {
      this.getTaskParams.pageSize = val
      this.getTask()
    },
    getTask (func) { // one 单路口执行的各类任务
      let _this = this
      projectTaskCount(this.getTaskParams).then((res) => {
        if (res.data.status === '200') {
          console.log(res)
          _this.tableData1Total = Number(res.data.data.count)
          _this.oneData = res.data.data.list
          _this.tableData1 = res.data.data.list
          console.log(this.tableData1)
          // if (func && typeof func === 'function') {
          //   func()
          // }
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
    listRowClick (type) {
      this.listRowType = type
      if (this.map) {
        this.markers = []
        this.markerRefs = []
        this.map.clearMarkers()
      }
      if (type === '1') {
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
          startTime: this.startTime,
          endTime: this.endTime
        }).then((res) => {
          this.projectList = res.data.data.projectList
          let self = this
          this.projectList.forEach((item) => {
            this.markers.push({
              position: [item.lng, item.lat],
              id: item.id,
              events: {
                init (o) {
                  self.markerRefs.push(o)
                }
              }
            })
          })
          setTimeout(() => {
            self.initMark(self, amapManager.getMap())
          }, 0)
        })
      } else if (type === '2') {
        listMapTask({
          pageSize: 0,
          page: 0,
          userId: getUserId(),
          businessProjectId: '',
          type: '',
          name: '',
          taskStatus: '',
          firstPartyScoring: '',
          provinceName: '',
          cityName: '',
          districtName: '',
          timeStatus: '',
          startTime: this.startTime,
          endTime: this.endTime
        }).then((res) => {
          this.taskList = res.data.data.taskList
          let self = this
          this.taskList.forEach((item) => {
            this.markers.push({
              position: [item.lng, item.lat],
              id: item.id,
              events: {
                init (o) {
                  self.markerRefs.push(o)
                }
              }
            })
          })
          setTimeout(() => {
            self.initMark(self, amapManager.getMap())
          }, 0)
        })
      } else if (type === '3') {
        listMapTaskCrossing({
          pageSize: 0,
          page: 0,
          projectId: '',
          taskId: '',
          userId: getUserId(),
          alias: '',
          taskCrossingStatus: '',
          timeStatus: '',
          startTime: this.startTime,
          endTime: this.endTime,
          provinceName: '',
          cityName: '',
          districtName: ''
        }).then((res) => {
          this.taskCrossingList = res.data.data.taskCrossingList
          let self = this
          this.taskCrossingList.forEach((item) => {
            this.markers.push({
              position: [item.lng, item.lat],
              id: item.id,
              events: {
                init (o) {
                  self.markerRefs.push(o)
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
    search () {
      this.renderData()
    },
    getMapCoordinateStatistics (type) {
      console.log(type)
      mapCoordinateStatistics({
        startTime: this.startTime,
        endTime: this.endTime,
        type: type
      }).then((res) => {
        console.log(res)
        if (type === '1') {
          this.data1 = res.data.data
          this.pieData1 = [{ value: res.data.data.ongoingCount, name: '进行中占比' }, { value: res.data.data.overdueCount, name: '逾期占比' }]
          this.setPie1()
        } else if (type === '2') {
          this.data2 = res.data.data
          this.pieData2 = [{ value: res.data.data.ongoingCount, name: '进行中占比' }, { value: res.data.data.overdueCount, name: '逾期占比' }]
          this.setPie2()
        } else if (type === '3') {
          this.data3 = res.data.data
          this.pieData3 = [{ value: res.data.data.ongoingCount, name: '进行中占比' }, { value: res.data.data.overdueCount, name: '逾期占比' }]
          this.setPie3()
        }
      })
    },
    setPie1 () {
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: '#ffffff',
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              }
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  return color1[params.dataIndex]
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.pieData1
          }
        ]
      }
      console.log(this.pieData1)
      this.dom1 = echarts.init(this.$refs.dom1, 'tdTheme')
      this.dom1.setOption(option)
      this.dom1.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 1
      })
      let _this = this
      this.dom1.on('mouseover', function (e) {
        console.log(_this)
        console.log(e)
        _this.dom1.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: 1
        })
        console.log(e.dataIndex)
        _this.dom1Str = e.name
        _this.dom1.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: e.dataIndex
        })
      })
      this.dom1.on('mouseout', function (e) {
        console.log(123123)
        _this.dom1.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 1
        })
      })
    },
    setPie2 () {
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '状态 <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['42%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: '#ffffff',
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              }
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  return color2[params.dataIndex]
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.pieData2
          }
        ]
      }
      this.dom2 = echarts.init(this.$refs.dom2, 'tdTheme')
      this.dom2.setOption(option)
      this.dom2.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 1
      })
      let _this = this
      this.dom2.on('mouseover', function (e) {
        console.log(_this)
        console.log(e)
        _this.dom2.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: 1
        })
        _this.dom2Str = e.name
        _this.dom2.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: e.dataIndex
        })
      })
      this.dom2.on('mouseout', function (e) {
        console.log(123123)
        _this.dom2.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 1
        })
      })
    },
    setPie3 () {
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '状态 <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['42%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: '#ffffff',
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              }
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  return color3[params.dataIndex]
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.pieData3
          }
        ]
      }
      this.dom3 = echarts.init(this.$refs.dom3, 'tdTheme')
      this.dom3.setOption(option)
      this.dom3.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 1
      })
      let _this = this
      this.dom3.on('mouseover', function (e) {
        console.log(_this)
        console.log(e)
        _this.dom3.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: 1
        })
        _this.dom3Str = e.name
        console.log(e.dataIndex)
        _this.dom3.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: e.dataIndex
        })
      })
      this.dom3.on('mouseout', function (e) {
        console.log(123123)
        _this.dom3.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 1
        })
      })
    },
    setLine1 () {
      let option = {
        grid: {
          top: '10px',
          left: '50px',
          right: '15px',
          bottom: '20px'
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              show: true,
              // x轴线样式
              lineStyle: {
                color: '#ffffff',
                width: 1,
                type: 'solid'
              }
            },
            // x轴字体设置
            axisLabel: {
              show: true,
              fontSize: 12,
              color: 'white'
            },
            data: this.xData
          }
        ],
        yAxis: [
          {
            type: 'value',
            max: 20,
            min: 0,
            splitNumber: 5,
            // y轴字体设置
            axisLabel: {
              show: true,
              color: 'white',
              fontSize: 12,
              formatter: function (value) {
                return value
              }
            },
            // y轴线设置不显示
            axisLine: {
              show: false
            },
            // 与x轴平行的线样式
            splitLine: {
              show: true,
              lineStyle: {
                color: '#ffffff',
                width: 1,
                type: 'dotted'
              }
            }
          }
        ],
        series: [
          {
            type: 'line',
            yAxisIndex: 0,
            symbolSize: 12,
            itemStyle: {
              normal: {
                color: '#108ee9'
              }
            },
            data: this.yData1
          },
          {
            type: 'line',
            yAxisIndex: 0,
            symbolSize: 12,
            itemStyle: {
              normal: {
                color: '#ff9933'
              }
            },
            data: this.yData2
          }
        ]
      }
      this.dom5 = echarts.init(this.$refs.dom5, 'tdTheme')
      this.dom5.setOption(option)
    },
    setBar1 () {
      let option = {
        xAxis: [
          {
            type: 'category',
            axisLine: {
              show: true,
              // x轴线样式
              lineStyle: {
                color: '#ffffff',
                width: 1,
                type: 'solid'
              }
            },
            // x轴字体设置
            axisLabel: {
              show: true,
              fontSize: 12,
              color: 'white'
            },
            data: this.projectMonth
          }
        ],
        yAxis: [
          {
            type: 'value',
            max: 20,
            min: 0,
            splitNumber: 5,
            // y轴字体设置
            axisLabel: {
              show: true,
              color: 'white',
              fontSize: 12,
              formatter: function (value) {
                return value
              }
            },
            // y轴线设置不显示
            axisLine: {
              show: false
            },
            // 与x轴平行的线样式
            splitLine: {
              show: true,
              lineStyle: {
                color: '#ffffff',
                width: 1,
                type: 'dashd'
              }
            }
          }
        ],
        grid: {
          top: '20px',
          left: '50px',
          right: '15px',
          bottom: '30px'
        },
        series: [
          {
            name: '5A',
            type: 'bar',
            // 柱子宽度
            barWidth: 20,
            // 柱状图样式
            itemStyle: {
              color: '#108ee9'
            },
            data: this.seriesDatas[0]
          }, {
            name: '4A',
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              color: '#ff9933'
            },
            data: this.seriesDatas[1]
          }
        ]
      }
      this.dom4 = echarts.init(this.$refs.dom4, 'tdTheme')
      this.dom4.setOption(option)
    },
    selectDateStart () {
      console.log(arguments)
      this.startTime = arguments[0]
      this.openStart = false
    },
    selectDateEnd () {
      console.log(arguments)
      this.endTime = arguments[0]
      this.openEnd = false
    }
  },
  mounted () {
    lazyAMapApiLoaderInstance.load().then(() => {
      this.getMapCoordinateStatistics('1')
      this.getMapCoordinateStatistics('2')
      this.getMapCoordinateStatistics('3')
      this.getTask()
      listProject({
        pageSize: 10,
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
        startTime: this.startTime,
        endTime: this.endTime
      }).then((res) => {
        console.log(res)
        this.projectList2 = res.data.data.projectList
        this.projectList2Id = res.data.data.projectList[0] ? res.data.data.projectList[0].id : ''
        this.projectList3Id = res.data.data.projectList[0] ? res.data.data.projectList[0].id : ''
        this.getTaskDateCount()
        userProjectWorkingHours({
          startTime: this.startTime,
          endTime: this.endTime,
          projectId: res.data.data.projectList[0] ? res.data.data.projectList[0].id : ''
        }).then((res) => {
          console.log(res)
          this.userWorkingHours = res.data.data
        })
      })
      listTask({
        pageSize: 0,
        page: 0,
        businessProjectId: '',
        type: '',
        name: '',
        taskStatus: '',
        firstPartyScoring: '',
        userId: getUserId(),
        timeStatus: '',
        startTime: this.startTime,
        endTime: this.endTime,
        provinceName: '',
        cityName: '',
        districtName: ''
      }).then((res) => {
        this.taskList = res.data.data.taskDetailBeans
        this.taskListId = res.data.data.taskDetailBeans[0] ? res.data.data.taskDetailBeans[0].id : ''
        this.getTaskCrossingDateCount()
      })
      listTaskCrossing({
        pageSize: 0,
        page: 0,
        projectId: '',
        taskId: '',
        userId: getUserId(),
        alias: '',
        taskCrossingStatus: '',
        timeStatus: '',
        startTime: this.startTime,
        endTime: this.endTime,
        provinceName: '',
        cityName: '',
        districtName: ''
      }).then((res) => {
        this.taskCrossingList2 = res.data.data.taskCrossingDetailBeanList
        if (this.taskCrossingList2[0]) {
          this.handleClick2(this.taskCrossingList2[0])
        }
      })
    })
  }
}
</script>

<style scoped lang="less">
  .amap-demo {
    height: 36vh;
    width: 100%;
  }
  .listRow{
    height: 100%;
    cursor: pointer;
  }
  .listRow:hover{
    background-color: #04304c;
  }
  .mlist{
    li{
      list-style: none;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
      padding: 4px 10px;
    }
    .table-left{
      .index{
        display: inline-block;
        width: 50px;
        padding-left: 15px;
      }
    }
    .table-left{
      width: 40%;
    }
    .table-right{
      display: flex;
      flex-direction: row;
      align-items: center;
      text-align: left;
      width: 60%;
      .progress {
        position: relative;
        height: 20px;
        display: inline-block;
        width: 270px;
        margin: 0 10px;
        .showNum{
          position: absolute;
          left: 0;
          top: 0;
          height: 20px;
          background-color: #2d8cf0;
        }
      }
      .num{
        display: inline-block;
        margin-left: 24px;
      }
    }
  }
  .page{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 15px;
    color: #ffffff;
    align-items: center;
    font-size: 14px;
  }
  .ivu-page{
    /deep/ .ivu-page-item-active{
      background: #2d8cf0 !important;
      a{
        color: #ffffff;
      }
    }
    /deep/ .ivu-page-item{
      min-width: 22px;
      height: 22px;
      line-height: 22px;
      background: none;
      border: 0 none;
      a{
        color: #ffffff;
      }
    }
    /deep/ .ivu-page-prev {
      min-width: 22px;
      height: 22px;
      line-height: 22px;
    }
    /deep/ .ivu-page-next {
      min-width: 22px;
      height: 22px;
      line-height: 20px;
    }
    /deep/ .ivu-select-single .ivu-select-selection{
      height: 24px;
    }
    /deep/ .ivu-select-selected-value{
      height: 24px;
      line-height: 24px;
    }
    /deep/ .ivu-page-options-elevator input{
      height: 24px;
      line-height: 24px;
    }
  }
  .scroll-outer{
    position: absolute;
    left: 10px;
    right: 10px;
    top: 55px;
    bottom: 15px;
    height: 90px;
    overflow: hidden;
    background: #04304c;
    .scroll-body{
      display: inline-block;
      position: absolute;
      overflow: visible;
      white-space: nowrap;
      transition: left .3s ease;
      .ivu-tag-dot-inner{
        transition: background .2s ease;
      }
      .ivu-tag-dot{
        height: 60px;
        line-height: 58px;
        margin: 0;
        padding: 0 10px;
        min-width: 185px;
        margin-right: 10px;
        color: #ffffff !important;
        border: 1px solid #04304c !important;
        /deep/ .ivu-tag-dot-inner{
          display: none;
        }
        /deep/ .ivu-tag-text{
          color: #ffffff;
        }
      }
    }
  }
  .scroll-outer::-webkit-scrollbar {
    display: none;
  }
  .btn-con{
    position: absolute;
    top: 67px;
    padding-top: 3px;
    z-index: 10;
    width: 30px;
    height: 30px;
    cursor: pointer;
    &.left-btn{
      left: 15px;
    }
    &.right-btn{
      right: 15px;
    }
  }
  .Title{
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
  }
  .dian {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #3ba0ff;
    margin-right: 15px;
  }
  .status {
    padding-right: 40px;
  }
  .proportion {
    padding: 0 25px 0 10px;
    width: 80px;
    border-right: 1px solid #c3c3c3;
    border-left: 1px solid #c3c3c3;
  }
  .value {
    padding-left: 10px;
  }
  .ivu-date-picker {
    /deep/ .ivu-input{
      background: none;
      border: 1px solid #00284d;
    }
  }
  .ivu-btn-text:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
</style>
