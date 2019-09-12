<template>
  <div style="background-color: #001529; position: absolute; width: 100%; height: 100%;left: 0; top: 0; z-index: 900; overflow-x: scroll; padding: 0 15px">
    <div style=" border-bottom: 5px solid #04304c; margin-bottom: 20px; height: 140px">
      <div style="display: inline-block;line-height: 80px;border-top: 5px solid rgb(4, 48, 76);width: 670px;position: absolute;margin-top: 55px;left: 15px;z-index: 1;">
        <Button type="text" style="font-size: 18px; color: #ffffff" @click="lastMonthSlot">上月</Button>
        <Button type="text" style="font-size: 18px; color: #ffffff" @click="nowMonthSlot">本月</Button>
        <Button type="text" style="font-size: 18px; color: #ffffff" @click="lastSeasonSlot">上季</Button>
        <Button type="text" style="font-size: 18px; color: #ffffff" @click="nowSeasonSlot">本季</Button>
        <Button type="text" style="font-size: 18px; color: #ffffff" @click="lastYearSlot">去年</Button>
        <Button type="text" style="font-size: 18px; color: #ffffff" @click="nowYearSlot">今年</Button>
      </div>
      <div style="display: inline-block;width: 100%;padding: 0 685px;position: absolute;left: 0;text-align: center;height: 140px;">
        <h1 style="display: block; color: #ffffff; font-size: 36px; margin-bottom: 10px">杰瑞配时管理平台</h1>
        <DatePicker type="daterange" placement="bottom-end" placeholder="请选择日期范围" style="background: none;border: 1px solid #04304c; width: 400px" @on-change="selectDate" ></DatePicker>
      </div>
      <div style="display: inline-block;line-height: 80px;border-top: 5px solid rgb(4, 48, 76);width: 670px;position: absolute;text-align: right;margin-top: 55px;right: 15px;z-index: 1;">
        <Button type="primary" @click="search" style="width: 140px; height: 45px">搜索</Button>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between">
      <div style="width: 30%">
        <div @click="listRowClick('1')" >
          <Row class="listRow" :style="{'background': (listRowType==='1'? '#04304c':'none') }" style="border: 1px solid #00284d; margin-bottom: 15px" type="flex" align="middle" justify="space-around">
            <Col span="12" style="height: 210px; padding: 20px 0">
              <p style="font-size: 18px; color: #ffffff; font-weight: bold;">项目统计</p>
              <p style="margin: 20px 0; color: #33ccff; font-size: 18px; font-weight: bold">总数: {{data1.total ? data1.total :''}}</p>
              <ul style="list-style-type: none">
                <li style="margin-bottom: 25px; color: #ffffff; display: flex;align-items: center;">
                  <span style="width: 5px; height: 5px; display: inline-block; background-color: #75dbdb; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 8px; margin-right: 8px">进行中的数量</span>{{data1.ongoingCount ? data1.ongoingCount : ''}}
                </li>
                <li style="color: #ffffff; display: flex;align-items: center;">
                  <span style="width: 5px; height: 5px; display: inline-block; background-color: #d85457; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 8px; margin-right: 8px">逾期的数量</span>{{data1.overdueCount ? data1.overdueCount : ''}}
                </li>
              </ul>
            </Col>
            <Col span="12" style="width:210px; height: 210px;">
              <div ref="dom1" style="height: 210px;" class="charts chart-pie"></div>
            </Col>
          </Row>
        </div>
        <div @click="listRowClick('2')" >
          <Row class="listRow" :style="{'background': (listRowType==='2'? '#04304c':'none') }" style="border: 1px solid #00284d; margin-bottom: 15px" type="flex" align="middle" justify="space-around">
            <Col span="12" style="height: 210px; padding: 20px 0">
              <p style="font-size: 18px; color: #ffffff; font-weight: bold;">任务统计</p>
              <p style="margin: 20px 0; color: #33ccff; font-size: 18px; font-weight: bold">总数: {{data2.total ? data2.total :''}}</p>
              <ul style="list-style-type: none">
                <li style="margin-bottom: 25px; color: #ffffff; display: flex;align-items: center;">
                  <span style="width: 5px; height: 5px; display: inline-block; background-color: #75dbdb; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 8px; margin-right: 8px">进行中的数量</span>{{data2.ongoingCount ? data2.ongoingCount : ''}}
                </li>
                <li style="color: #ffffff; display: flex;align-items: center;">
                  <span style="width: 5px; height: 5px; display: inline-block; background-color: #d85457; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 8px; margin-right: 8px">逾期的数量</span>{{data2.overdueCount ? data2.overdueCount : ''}}
                </li>
              </ul>
            </Col>
            <Col span="12" style="width:210px; height: 210px;">
              <div ref="dom2" style="height: 210px;" class="charts chart-pie"></div>
            </Col>
          </Row>
        </div>
        <div @click="listRowClick('3')" >
          <Row class="listRow" :style="{'background': (listRowType==='3'? '#04304c':'none') }" style="border: 1px solid #00284d;" type="flex" align="middle" justify="space-around">
            <Col span="12" style="height: 210px; padding: 20px 0">
              <p style="font-size: 18px; color: #ffffff; font-weight: bold;">任务路口统计</p>
              <p style="margin: 20px 0; color: #33ccff; font-size: 18px; font-weight: bold">总数: {{data3.total ? data3.total :''}}</p>
              <ul style="list-style-type: none">
                <li style="margin-bottom: 25px; color: #ffffff; display: flex;align-items: center;">
                  <span style="width: 5px; height: 5px; display: inline-block; background-color: #75dbdb; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 8px; margin-right: 8px">进行中的数量</span>{{data3.ongoingCount ? data3.ongoingCount : ''}}
                </li>
                <li style="color: #ffffff; display: flex;align-items: center;">
                  <span style="width: 5px; height: 5px; display: inline-block; background-color: #d85457; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 8px; margin-right: 8px">逾期的数量</span>{{data3.overdueCount ? data3.overdueCount : ''}}
                </li>
              </ul>
            </Col>
            <Col span="12" style="width:210px; height: 210px;">
              <div ref="dom3" style="height: 210px;" class="charts chart-pie"></div>
            </Col>
          </Row>
        </div>
      </div>
      <div style="border: 1px solid #00284d; width: 69%">
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
    <div style="margin-top: 20px; border: 1px solid #00284d;">
      <p slot="title" style="padding: 15px; color: #ffffff;font-size: 18px; font-weight: bold; border-bottom: 1px solid #00284d;">项目下任务数量</p>
      <ul class="mlist">
        <li v-for="(item, key) in tableData1" :key="key">
          <div class="table-left" style="color: #ffffff"><span class="index">{{key + 1}}</span> | {{item.name}}</div>
          <div class="table-right" style="color: #ffffff">
            | <span class="progress" >
              <span class="showNum" :style="{width: (320/(320/item.taskCount)) + 'px'}"></span>
            </span>
            | &nbsp;任务数量：<span class="num">{{item.taskCount}}</span>
          </div>
        </li>
      </ul>
      <div class="page" style="padding: 15px; color: #ffffff; border-top: 1px solid #00284d;">
        <div>共 <span style="font-weight: bold">{{tableData1Total}}</span> 条</div>
        <Page
          :total="tableData1Total"
          show-sizer
          show-elevator
          @on-change="pageChange"
          @on-page-size-change="pageSizeChange" />
      </div>
    </div>
    <div style="margin-top: 20px; border: 1px solid #00284d;">
      <p slot="title" style="padding: 15px; color: #ffffff;font-size: 18px; font-weight: bold; border-bottom: 1px solid #00284d;">任务与任务路口完成情况</p>
      <div style="padding: 15px; color: #ffffff; border-bottom: 1px solid #00284d;">
        <Row>
          <Col span="12">
            <Row type="flex" align="middle">
              <Col span="2">
                <span class="label">选择项目:</span>
              </Col>
              <Col span="19">
                <Select v-model="projectList2Id" placeholder="请选择项目" filterable clearable style="width: 300px" @on-change="getTaskDateCount">
                  <Option v-for="(item, key) in projectList2" :key="key" :value="item.id">{{item.name}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="24">
            <div ref="dom4" style="height: 300px;"></div>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Row type="flex" align="middle">
              <Col span="2">
                <span class="label">选择任务:</span>
              </Col>
              <Col span="19">
                <Select v-model="taskListId" placeholder="请选择任务" filterable clearable style="width: 300px" @on-change="getTaskCrossingDateCount">
                  <Option v-for="(item, key) in taskList" :key="key" :value="item.id">{{item.name}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="24">
            <div ref="dom5" style="height: 300px;"></div>
          </Col>
        </Row>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <div style="display: flex; justify-content: space-between">
        <div style="width: 49.5%; border: 1px solid #00284d; height: 300px; position: relative; overflow: hidden; padding: 15px">
          <div style="width: 100%; height: 60px; user-select: none;">
            <img src="../../assets/images/left.png" class="btn-con left-btn" @click="handleScroll(240)">
            <div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
              <div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
                <transition-group name="taglist-moving-animation">
                  <Tag
                    type="dot"
                    v-for="(item, index) in projectList2"
                    :style="{'background': item.id === projectList3Id ? '#04304c !important' : 'none !important'}"
                    :key="`tag-nav-${index}`"
                    :name="item.name"
                    @click.native="handleClick1(item)"
                  >{{item.name}}</Tag>
                </transition-group>
              </div>
            </div>
            <img src="../../assets/images/right.png" class="btn-con right-btn" @click="handleScroll(-240)">
          </div>
          <div style=" margin-top: 20px; padding: 0 50px; display: flex">
            <div style="width: 50%">
              <div v-for="(item, index) in userWorkingHours" :key="index" v-if="index<4"  style="color: #ffffff; line-height: 30px; margin-bottom: 10px">
                <span style="margin-right: 10px">{{index + 1}}</span>
                <span style="padding: 0 15px; border-left: 1px solid #fff; border-right: 1px solid #fff; margin-right: 10px;">{{item.userName}}</span>
                <span style="color: #3aa0ff">工时：{{item.workingHours}}</span>
              </div>
            </div>
            <div style="width: 50%">
              <div v-for="(item, index) in userWorkingHours" :key="index" v-if="index>4" style="color: #ffffff; line-height: 30px; margin-bottom: 10px">
                <span style="margin-right: 10px">{{index + 1}}</span>
                <span style="padding: 0 15px; border-left: 1px solid #fff; border-right: 1px solid #fff; margin-right: 10px;">{{item.userName}}</span>
                <span style="color: #3aa0ff">工时：{{item.workingHours}}</span>
              </div>
            </div>
          </div>
        </div>
        <div style="width: 49.5%; border: 1px solid #00284d; height: 300px; position: relative; overflow: hidden; padding: 15px">
          <div style="width: 100%; height: 60px; user-select: none;">
            <img src="../../assets/images/left.png" class="btn-con left-btn" @click="handleScroll2(240)">
            <div class="scroll-outer" ref="scrollOuter2" @DOMMouseScroll="handlescroll2" @mousewheel="handlescroll2">
              <div ref="scrollBody2" class="scroll-body" :style="{left: tagBodyLeft2 + 'px'}">
                <transition-group name="taglist-moving-animation">
                  <Tag
                    type="dot"
                    v-for="(item, index) in taskCrossingList2"
                    :style="{'background': item.crossingCode === taskCrossingListId ? '#04304c !important' : 'none !important'}"
                    :key="`tag-nav-${index}`"
                    :name="item.alias"
                    @click.native="handleClick2(item)"
                  >{{item.alias}}</Tag>
                </transition-group>
              </div>
            </div>
            <img src="../../assets/images/right.png" class="btn-con right-btn" @click="handleScroll2(-240)">
          </div>
          <div style="margin-top: 20px">
            <Row>
              <Col span="10" style="width:210px; height: 210px;">
                <div ref="dom6" class="charts chart-pie" style="height: 210px; position:relative;"></div>
              </Col>
              <Col span="12" style="position: relative;top: 30px;left: 100px;">
                <ul
                  style=" height: 30vh; display: flex; flex-direction: column; justify-content: center;text-align:left;">
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
</template>

<script>
import { AMapManager } from 'vue-amap'
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
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
      zoom: 4,
      amapManager: amapManager,
      center: [103, 36],
      events: {
        init () {
          let map = amapManager.getMap()
          new AMap.DistrictSearch({
            extensions: 'all',
            subdistrict: 0
          }).search('中国', function (status, result) {
            // 外多边形坐标数组和内多边形坐标数组
            let outer = [
              new AMap.LngLat(-360, 90, true),
              new AMap.LngLat(-360, -90, true),
              new AMap.LngLat(360, -90, true),
              new AMap.LngLat(360, 90, true)
            ]
            let holes = result.districtList[0].boundaries
            let pathArray = [
              outer
            ]
            pathArray.push.apply(pathArray, holes)
            let polygon = new AMap.Polygon({
              pathL: pathArray,
              strokeColor: '#001529',
              strokeWeight: 1,
              fillColor: '#001529',
              fillOpacity: 1
            })
            polygon.setPath(pathArray)
            map.add(polygon)
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
      endTime: this.endTime
    }
  },
  methods: {
    selectDate () {
      this.startTime = arguments[0]
      this.endTime = arguments[1]
    },
    renderData () {
      this.getMapCoordinateStatistics('1')
      this.getTask()
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
      this.getTaskParams.startTime = this.startTime = getLastMonthStartDate()
      this.getTaskParams.endTime = this.endTime = getLastMonthEndDate()
      this.renderData()
    },
    nowMonthSlot () {
      this.getTaskParams.startTime = this.startTime = getMonthStartDate()
      this.getTaskParams.endTime = this.endTime = getMonthEndDate()
      this.renderData()
    },
    lastSeasonSlot () {
      this.getTaskParams.startTime = this.startTime = getLastQuarterStartDate()
      this.getTaskParams.endTime = this.endTime = getLastQuarterEndDate()
      this.renderData()
    },
    nowSeasonSlot () {
      this.getTaskParams.startTime = this.startTime = getQuarterStartDate()
      this.getTaskParams.endTime = this.endTime = getQuarterEndDate()
      this.renderData()
    },
    lastYearSlot () {
      this.getTaskParams.startTime = this.startTime = getLastYear().startTime
      this.getTaskParams.endTime = this.endTime = getLastYear().endTime
      this.renderData()
    },
    nowYearSlot () {
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
            left: '21%',
            top: '44%',
            style: {
              text:
              '任务总数量' + '\n' + '\n' + this.pie6Data.taskCount || 0,
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
            center: ['40%', '50%'],
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
              { value: this.pie6Data.patrolTypeCount, name: '巡检任务' },
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
      on(window, 'resize', this.resizeP6)
    },
    resizeP6 () {
      this.dom6.resize()
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
      this.handleScroll(delta)
    },
    handleScroll (offset) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth
      const bodyWidth = this.$refs.scrollBody.offsetWidth
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
      const outerWidth = this.$refs.scrollOuter2.offsetWidth
      const bodyWidth = this.$refs.scrollBody2.offsetWidth
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
    resize () {
      this.dom.resize()
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
            radius: ['42%', '70%'],
            avoidLabelOverlap: false,
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
      on(window, 'resize', this.resize)
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
      on(window, 'resize', this.resize)
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
      on(window, 'resize', this.resize)
    },
    setLine1 () {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          top: '50px',
          left: '50px',
          right: '15px',
          bottom: '50px'
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              show: true,
              // x轴线样式
              lineStyle: {
                color: '#17273B',
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
                color: '#17273B',
                width: 1,
                type: 'dashd'
              }
            }
          }
        ],
        series: [
          {
            name: '呼入量',
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
            name: '呼出量',
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
      on(window, 'resize', this.resize)
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
                color: '#17273B',
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
                color: '#17273B',
                width: 1,
                type: 'dashd'
              }
            }
          }
        ],
        grid: {
          top: '50px',
          left: '50px',
          right: '15px',
          bottom: '50px'
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
      on(window, 'resize', this.resize)
    }
  },
  mounted () {
    this.getMapCoordinateStatistics('1')
    this.getMapCoordinateStatistics('2')
    this.getMapCoordinateStatistics('3')
    this.getTask()
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
      startTime: this.startTime,
      endTime: this.endTime
    }).then((res) => {
      console.log(res)
      this.projectList2 = res.data.data.projectList
      this.projectList2Id = res.data.data.projectList[0].id
      this.projectList3Id = res.data.data.projectList[0].id
      this.getTaskDateCount()
      userProjectWorkingHours({
        startTime: this.startTime,
        endTime: this.endTime,
        projectId: res.data.data.projectList[0].id
      }).then((res) => {
        console.log(res)
        this.userWorkingHours = res.data.data
      })
      console.log(res.data.data.projectList[0].id)
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
      this.taskListId = res.data.data.taskDetailBeans[0].id
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
      this.handleClick2(this.taskCrossingList2[0])
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>

<style scoped lang="less">
  .amap-demo {
    height: 630px;
  }
  .listRow{
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
      margin-bottom: 10px;
      padding: 10px;
    }
    .table-left{
      .index{
        display: inline-block;
        width: 50px;
        padding-left: 15px;
      }
    }
    .table-right{
      display: flex;
      flex-direction: row;
      align-items: center;
      text-align: left;
      width: 32%;
      .progress {
        position: relative;
        height: 20px;
        display: inline-block;
        width: 320px;
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
    left: 55px;
    right: 55px;
    top: 15px;
    bottom: 15px;
    box-shadow: 0px 0 3px 2px rgba(100,100,100,.1) inset;
    height: 60px;
    overflow: hidden;
    .scroll-body{
      height: 100%;
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
        width: 185px;
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
  .btn-con{
    position: absolute;
    top: 30px;
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
