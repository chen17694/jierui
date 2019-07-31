<template>
  <div>
     <Card style="margin-top: 20px">
      <p slot="title" style="display:inline-block;">逾期任务统计</p>
      <div slot="extra" style>
        <Button type="text" @click="lastMonthSlot(1)">上月</Button>
        <Button type="text" @click="nowMonthSlot(1)">本月</Button>
        <Button type="text" @click="lastSeasonSlot(1)">上季</Button>
        <Button type="text" @click="nowSeasonSlot(1)">本季</Button>
        <Button type="text" @click="lastYearSlot(1)">去年</Button>
        <Button type="text" @click="nowYearSlot(1)">今年</Button>
        <DatePicker
          :confirm="true"
          type="daterange"
          placement="bottom-end"
          placeholder="请选择起止日期"
          style="width: 200px"
          @on-change="changeTimeOne"
          @on-ok="TimeOkOne"
        ></DatePicker>
      </div>
      <Row>
        <Col span="10">
          <div ref="dom1" class="charts chart-pie" style="height: 40vh; position:relative;"></div>
          <div class="dom1-bottom">
            <div class="bottom-item all">
              项目总数量：
              <span>{{oneData.taskCount}}</span>
            </div>
            <div class="bottom-item overdue">
              逾期项目数量：
              <span>{{oneData.overdueTaskCount}}</span>
            </div>
          </div>
        </Col>
        <Col span="14">
          <div class="Title" style="margin-top: 15px">项目经理逾期项目排名（前十）</div>
          <ul class="ranking">
            <li v-for="(item, key) in oneData.overdueTaskHoldersBeanList" :key="key">
              <span class="num" :class="key > 2 ? '': 'bg1'">{{key + 1}}</span>
              <span class="name">{{item.taskHoldersName}}</span>
              <span class="company">{{item.officeName}}</span>
              <span class="count">{{item.count}}</span>
            </li>
          </ul>
        </Col>
      </Row>
    </Card>
    <Card style="margin-top: 20px">
      <p slot="title" style="display:inline-block;">按地区任务量统计</p>
      <div slot="extra" style>
        <Button type="text" @click="lastMonthSlot(2)">上月</Button>
        <Button type="text" @click="nowMonthSlot(2)">本月</Button>
        <Button type="text" @click="lastSeasonSlot(2)">上季</Button>
        <Button type="text" @click="nowSeasonSlot(2)">本季</Button>
        <Button type="text" @click="lastYearSlot(2)">去年</Button>
        <Button type="text" @click="nowYearSlot(2)">今年</Button>
        <DatePicker
          :confirm="true"
          type="daterange"
          placement="bottom-end"
          placeholder="请选择起止日期"
          style="width: 200px"
          @on-change="changeTimeTwo"
          @on-ok="TimeOkTwo"
        ></DatePicker>
      </div>
      <Row>
        <div  style="text-align:right">
            地区类型：
            <Select v-model="twoSearch.type" style="width:200px;text-align:left" @on-change="regionTypeSel">
              <Option value="0" key="s1">省级</Option>
              <Option value="1" key="s2">市级</Option>
            </Select>
          </div>
        <!-- <Col span="24" style="padding: 20px 0;height:auto">

        </Col> -->
        <div ref="dom2" class="charts chart-bar" style="min-height: 30vh;"></div>
        <div style="overflow: hidden"></div>
      </Row>
    </Card>
    <Card style="margin-top: 20px">
      <p slot="title" style="display:inline-block;">按地区任务量统计</p>
      <div slot="extra" style>
        <Button type="text" @click="lastMonthSlot(3)">上月</Button>
        <Button type="text" @click="nowMonthSlot(3)">本月</Button>
        <Button type="text" @click="lastSeasonSlot(3)">上季</Button>
        <Button type="text" @click="nowSeasonSlot(3)">本季</Button>
        <Button type="text" @click="lastYearSlot(3)">去年</Button>
        <Button type="text" @click="nowYearSlot(3)">今年</Button>
        <DatePicker
          :confirm="true"
          type="daterange"
          placement="bottom-end"
          placeholder="请选择起止日期"
          style="width: 200px"
          @on-change="changeTimeThree"
          @on-ok="TimeOkThree"
        ></DatePicker>
      </div>
      <Row>
          <Col span="14">
            <Row>
              <Col span="14">
                <div ref="dom3" class="charts chart-pie" style="height: 45vh; position:relative;"></div>
              </Col>
              <Col span="10">
                <ul
                  style="margin-top: 22%; height: 300px; display: flex; flex-direction: column; justify-content: space-around;"
                >
                  <li style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #3ba0ff"></div>
                    <div class="status">进行中</div>
                    <div
                      class="proportion"
                    >{{threeData.taskOnGoingStatusCount == '0' ? '0%' : Percentage(threeData.taskOnGoingStatusCount, threeData.taskCount)}}</div>
                    <div class="value">数量：{{threeData.taskOnGoingStatusCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #37cbcb"></div>
                    <div class="status">未开始</div>
                    <div
                      class="proportion"
                    >{{threeData.taskNotStartStatusCount == '0' ? '0%' : Percentage(threeData.taskNotStartStatusCount, threeData.taskCount)}}</div>
                    <div class="value">数量：{{threeData.taskNotStartStatusCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #4ecb74"></div>
                    <div class="status">已完成</div>
                    <div
                      class="proportion"
                    >{{threeData.taskOnGoingStatusCount == '0' ? '0%' : Percentage(threeData.taskOnGoingStatusCount, threeData.taskCount)}}</div>
                    <div class="value">数量：{{threeData.taskOnGoingStatusCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #fad337"></div>
                    <div class="status">已暂停</div>
                    <div
                      class="proportion"
                    >{{threeData.taskPauseStatusCount == '0' ? '0%' : Percentage(threeData.taskPauseStatusCount, threeData.taskCount)}}</div>
                    <div class="value">数量：{{threeData.taskPauseStatusCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #ff9933"></div>
                    <div class="status">已撤销</div>
                    <div
                      class="proportion"
                    >{{threeData.taskRevokeStatusCount == '0' ? '0%' : Percentage(threeData.taskRevokeStatusCount, threeData.taskCount)}}</div>
                    <div class="value">数量：{{threeData.taskRevokeStatusCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #f2637b"></div>
                    <div class="status">已驳回</div>
                    <div
                      class="proportion"
                    >{{threeData.taskRejectStatusCount == '0' ? '0%' : Percentage(threeData.taskRejectStatusCount, threeData.taskCount)}}</div>
                    <div class="value">数量：{{threeData.taskRejectStatusCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #975fe4"></div>
                    <div class="status">审核中</div>
                    <div
                      class="proportion"
                    >{{threeData.taskAuditStatusCount == '0' ? '0%' : Percentage(threeData.taskAuditStatusCount, threeData.taskCount)}}</div>
                    <div class="value">数量：{{threeData.taskAuditStatusCount}}</div>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
          <Col span="10">
            <Row>
              <Col span="24">
                <div ref="dom4" class="charts chart-pie" style="height: 28vh; position:relative;"></div>
              </Col>
              <Col span="24">
                <ul
                  style="min-height: 120px; display: flex; flex-direction: column; justify-content: space-around;"
                >
                  <li style="display: flex; align-items: center; justify-content: center;">
                    <div class="dian" style="background-color: #4dcb73"></div>
                    <div class="status">宣传任务</div>
                    <div
                      class="proportion"
                    >{{threeData.publicityTypeCount == '0' ? '0%' : Percentage(threeData.publicityTypeCount, threeData.taskCount)}}</div>
                    <div class="value">数量：{{threeData.publicityTypeCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center; justify-content: center;">
                    <div class="dian" style="background-color: #3aa0ff"></div>
                    <div class="status">巡检任务</div>
                    <div
                      class="proportion"
                    >{{threeData.patrolTypeCount == '0' ? '0%' : Percentage(threeData.patrolTypeCount, threeData.taskCount)}}</div>
                    <div class="value">数量：{{threeData.patrolTypeCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center; justify-content: center;">
                    <div class="dian" style="background-color: #fe7777"></div>
                    <div class="status">优化任务</div>
                    <div
                      class="proportion"
                    >{{threeData.optimizingTypeCount == '0' ? '0%' : Percentage(threeData.optimizingTypeCount, threeData.taskCount)}}</div>
                    <div class="value">数量：{{threeData.optimizingTypeCount}}</div>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
    </Card>
    <Card style="margin-top: 20px">
      <div slot="title" style="display:inline-block;">
        选择项目：<Select v-model="fourSearch.projectId" style="width:200px" @on-change="projectSel">
                      <Option
                        v-for="item in projectList"
                        :value="item.value"
                        size="small"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
      </div>
      <div slot="extra" style>
        <Button type="text" @click="lastMonthSlot(4)">上月</Button>
        <Button type="text" @click="nowMonthSlot(4)">本月</Button>
        <Button type="text" @click="lastSeasonSlot(4)">上季</Button>
        <Button type="text" @click="nowSeasonSlot(4)">本季</Button>
        <Button type="text" @click="lastYearSlot(4)">去年</Button>
        <Button type="text" @click="nowYearSlot(4)">今年</Button>
        <DatePicker
          :confirm="true"
          type="daterange"
          placement="bottom-end"
          placeholder="请选择起止日期"
          style="width: 200px"
          @on-change="changeTimeFour"
          @on-ok="TimeOkFour"
        ></DatePicker>
      </div>
      <Row>
          <Col span="8">
            <Row>
              <Col span="24">
                <div ref="dom5" class="charts chart-pie" style="height: 28vh; position:relative;"></div>
              </Col>
              <Col span="24">
                <ul
                  style="min-height: 120px; display: flex; flex-direction: column; justify-content: space-around;"
                >
                  <li style="display: flex; align-items: center; justify-content: center;">
                    <div class="dian" style="background-color: #4dcb73"></div>
                    <div class="status">非常满意</div>
                    <div
                      class="proportion"
                    >{{fourData.taskVerySatisfiedCount == '0' ? '0%' : Percentage(fourData.taskVerySatisfiedCount, fourData.taskScoringCount)}}</div>
                    <div class="value">数量：{{fourData.taskVerySatisfiedCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center; justify-content: center;">
                    <div class="dian" style="background-color: #3aa0ff"></div>
                    <div class="status">满意</div>
                    <div
                      class="proportion"
                    >{{fourData.taskSatisfiedCount == '0' ? '0%' : Percentage(fourData.taskSatisfiedCount, fourData.taskScoringCount)}}</div>
                    <div class="value">数量：{{fourData.taskSatisfiedCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center; justify-content: center;">
                    <div class="dian" style="background-color: #fe7777"></div>
                    <div class="status">不满意</div>
                    <div
                      class="proportion"
                    >{{fourData.taskNotSatisfiedCount == '0' ? '0%' : Percentage(fourData.taskNotSatisfiedCount, fourData.taskScoringCount)}}</div>
                    <div class="value">数量：{{fourData.taskNotSatisfiedCount}}</div>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
          <Col span="16">
            <div class="Title" style="margin-top:20px">项目下各任务统计</div>
            <tables
              style="padding:10px 0px;"
              ref="tabletj"
              :total="total"
              v-model="tableData"
              :columns="columns"
              :page-size="fourSearch.pageSize"
              :onChange="pageChange"
              :onPageSizeChange="pageSizeChange"
            ></tables>
          </Col>
        </Row>
    </Card>
  </div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import Tables from '_c/tables'
import { getUserId } from '@/libs/util'
import { getLastMonthStartDate, getLastMonthEndDate, getMonthStartDate, getMonthEndDate, getQuarterStartDate, getQuarterEndDate, getLastQuarterStartDate, getLastQuarterEndDate, getCurrentYear, getLastYear } from '@/libs/mdate.js'
import {
  overdueTaskStatistics,
  listProject,
  areaTaskCount,
  taskStatusAndTypeCount,
  taskScoringAndWorkloadBean
} from '@/api/data'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'taskStatistics',
  components: { Tables },
  data () {
    return {
      oneSearch: {
        userId: '',
        startTime: '',
        endTime: ''
      },
      twoSearch: {
        userId: '',
        startTime: '',
        endTime: '',
        type: '0'
      },
      fourSearch: {
        userId: '',
        startTime: '',
        endTime: '',
        projectId: '',
        page: 1,
        pageSize: 5
      },
      threeSearch: {
        userId: '',
        startTime: '',
        endTime: ''
      },
      fourData: {},
      threeData: {},
      TwoData: [],
      oneData: {},
      projectList: [],
      total: 0,
      dom: null,
      dom2: null,
      dom3: null,
      dom4: null,
      tableData: [],
      columns: [
        {
          type: 'index',
          width: 60,
          title: '序号'
        },
        { title: '任务名称', key: 'name' },
        { title: '工作量', key: 'workload', width: 120 },
        { title: '任务路口数量', key: 'taskCrossingCount', width: 120 },
        {
          title: '项目评分',
          width: 120,
          key: 'firstPartyScoring',
          render: (h, params) => {
            return h(
              'div',
              {},
              params.row.firstPartyScoring === '1'
                ? '非常满意'
                : params.row.firstPartyScoring === '2'
                  ? '满意'
                  : params.row.firstPartyScoring === '3'
                    ? '不满意'
                    : '-'
            )
          }
        }
      ]
    }
  },
  computed: {},
  created () {
    this.oneSearch.userId = getUserId()
    this.twoSearch.userId = getUserId()
    this.threeSearch.userId = getUserId()
    this.fourSearch.userId = getUserId()
    this.OverdueTaskStatistics(() => {
      this.setPie1()
    })
    this.AreaTaskCount(() => {
      this.setBar1()
    })
    this.TaskStatusAndTypeCount(() => {
      this.setPie3()
      this.setPie4()
    })
    this.ListProject((res) => {
      this.fourSearch.projectId = res.value
      this.TaskScoringAndWorkloadBean(() => {
        this.setPie5()
      })
    })
  },
  mounted () {},
  methods: {
    OverdueTaskStatistics (func) { // one 逾期任务统计
      let _this = this
      overdueTaskStatistics(_this.oneSearch).then((res) => {
        if (res.data.status === '200') {
          _this.oneData = res.data.data
          if (func && typeof func === 'function') {
            func()
          }
        }
      })
    },
    AreaTaskCount (func) { // two 按地区任务统计
      let _this = this
      areaTaskCount(_this.twoSearch).then((res) => {
        if (res.data.status === '200') {
          _this.TwoData = res.data.data
          if (func && typeof func === 'function') {
            func()
          }
        }
      })
    },
    TaskStatusAndTypeCount (func) { // three 任务和数量百分比
      let _this = this
      taskStatusAndTypeCount(_this.threeSearch).then((res) => {
        if (res.data.status === '200') {
          _this.threeData = res.data.data
          if (func && typeof func === 'function') {
            func()
          }
        }
      })
    },
    TaskScoringAndWorkloadBean (func) { // four 项目下各任务统计 任务满意度百分比
      let _this = this
      taskScoringAndWorkloadBean(_this.fourSearch).then((res) => {
        if (res.data.status === '200') {
          _this.fourData = res.data.data
          _this.tableData = res.data.data.taskWorkloadCountBeanList
          if (func && typeof func === 'function') {
            func()
          }
        }
      })
    },
    changeTimeOne (val) {
      this.oneSearch.startTime = val[0]
      this.oneSearch.endTime = val[1]
    },
    changeTimeTwo (val) {
      this.twoSearch.startTime = val[0]
      this.twoSearch.endTime = val[1]
    },
    changeTimeThree (val) {
      this.threeSearch.startTime = val[0]
      this.threeSearch.endTime = val[1]
    },
    changeTimeFour (val) {
      this.fourSearch.startTime = val[0]
      this.fourSearch.endTime = val[1]
    },
    TimeOkOne () {
      this.OverdueTaskStatistics(() => {
        this.setPie1()
      })
    },
    TimeOkTwo () {
      this.AreaTaskCount(() => {
        this.setBar1()
      })
    },
    TimeOkThree () {
      this.TaskStatusAndTypeCount(() => {
        this.setPie3()
        this.setPie4()
      })
    },
    TimeOkFour () {
      this.TaskScoringAndWorkloadBean(() => {
        this.setPie5()
      })
    },
    Percentage (num1, num2) {
      // 计算百分比
      return (
        Math.round((parseFloat(num1) / parseFloat(num2)) * 10000) / 100.0 + '%'
      )
    },
    regionTypeSel (val) {
      this.oneSearch.type = val
      this.AreaTaskCount(() => {
        this.setBar1()
      })
    },
    ListProject (func) {
      // 项目列表
      let _this = this
      let params = {
        page: 0,
        pageSize: 5000,
        userId: getUserId()
      }
      listProject(params).then(res => {
        if (res.data.status === '200') {
          _this.projectList = res.data.data.projectList.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
          if (func && typeof func === 'function') {
            func(_this.projectList[0])
          }
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    },
    pageChange (val) {
      console.log(val)
      this.fourSearch.page = val
      this.TaskScoringAndWorkloadBean(() => {
        this.setPie5()
      })
    },
    pageSizeChange (val) {
      this.fourSearch.pageSize = val
      this.TaskScoringAndWorkloadBean(() => {
        this.setPie5()
      })
    },
    projectSel (val) {
      this.fourSearch.projectId = val
      this.TaskScoringAndWorkloadBean(() => {
        this.setPie5()
      })
    },
    setPie1 () {
      let option = {
        title: {
          text: '任务逾期数量',
          x: '10%',
          y: '5%',
          textStyle: {
            color: '#333',
            fontSize: 18
          }
        },
        graphic: [
          {
            // 环形图中间添加文字
            type: 'text', // 通过不同top值可以设置上下显示
            left: '34%',
            top: '50%',
            style: {
              text:
                '逾期任务百分比' +
                '\n' +
                '\n' +
                this.Percentage(
                  this.oneData.overdueTaskCount,
                  this.oneData.taskCount
                ),
              textAlign: 'center',
              fill: 'black', // 文字的颜色
              width: 30,
              height: 30,
              fontSize: 16,
              fontFamily: 'Microsoft YaHei'
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['90px', '130px'],
            center: ['42%', '54%'],
            label: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value:
                this.oneData.taskCount - this.oneData.overdueTaskCount,
                name: '未逾任务目数量'
              },
              {
                value: this.oneData.overdueTaskCount,
                name: '逾期任务数量'
              }
            ],
            // data: this.value3,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function (params) {
                  let colorList = [
                    '#cccccc',
                    '#fe7777',
                    '#fe7777',
                    '#fad337',
                    '#ff9933',
                    '#f2637b',
                    '#975fe4'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom1, 'tdTheme')
      this.dom.setOption(option)
    },
    setBar1 () {
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '0',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.TwoData.map(item => {
              return item.areaName
            }),
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '项目个数',
            type: 'bar',
            barWidth: '40%',
            data: this.TwoData.map(item => {
              return item.count
            })
          }
        ]
      }
      this.dom2 = echarts.init(this.$refs.dom2, 'tdTheme')
      this.dom2.setOption(option)
    },
    setPie3 () {
      let option = {
        title: {
          text: '各任务状态',
          x: '10%',
          y: '5%',
          textStyle: {
            color: '#333',
            fontSize: 18
          }
        },
        graphic: [
          {
            // 环形图中间添加文字
            type: 'text', // 通过不同top值可以设置上下显示
            left: 'center',
            top: '50%',
            style: {
              text:
                '项目总数' + '\n' + '\n' + this.threeData.taskCount || 0,
              textAlign: 'center',
              fill: 'black', // 文字的颜色
              width: 30,
              height: 30,
              fontSize: 20,
              fontFamily: 'Microsoft YaHei'
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['100px', '140px'],
            center: ['50%', '54%'],
            label: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.threeData.taskOnGoingStatusCount,
                name: '进行中'
              },
              {
                value: this.threeData.taskNotStartStatusCount,
                name: '未开始'
              },
              {
                value: this.threeData.taskFinishStatusCount,
                name: '已完成'
              },
              {
                value: this.threeData.taskPauseStatusCount,
                name: '已暂停'
              },
              {
                value: this.threeData.taskRevokeStatusCount,
                name: '已撤销'
              },
              {
                value: this.threeData.taskRejectStatusCount,
                name: '已驳回'
              },
              {
                value: this.threeData.taskAuditStatusCount,
                name: '审核中'
              }
              // { value: this.threeData.taskScoringCount, name: '已评分' },
            ],
            // data: this.value,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function (params) {
                  let colorList = [
                    '#3ba0ff',
                    '#37cbcb',
                    '#4ecb74',
                    '#fad337',
                    '#ff9933',
                    '#f2637b',
                    '#975fe4'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      this.dom3 = echarts.init(this.$refs.dom3, 'tdTheme')
      this.dom3.setOption(option)
    },
    setPie4 () {
      let option = {
        title: {
          text: '各类任务类型',
          x: '16%',
          y: '8%',
          textStyle: {
            color: '#333',
            fontSize: 18
          }
        },
        graphic: [
          {
            // 环形图中间添加文字
            type: 'text', // 通过不同top值可以设置上下显示
            left: 'center',
            top: '56%',
            style: {
              text:
                '任务总数' + '\n' + '\n' + this.threeData.taskCount || 0,
              textAlign: 'center',
              fill: 'black', // 文字的颜色
              width: 30,
              height: 30,
              fontSize: 16,
              fontFamily: 'Microsoft YaHei'
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['60px', '80px'],
            center: ['50%', '60%'],
            label: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.threeData.publicityTypeCount,
                name: '宣传任务'
              },
              { value: this.threeData.patrolTypeCount, name: '巡检任务' },
              {
                value: this.threeData.optimizingTypeCount,
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
                    '#fe7777',
                    '#fad337',
                    '#ff9933',
                    '#f2637b',
                    '#975fe4'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      this.dom4 = echarts.init(this.$refs.dom4, 'tdTheme')
      this.dom4.setOption(option)
    },
    setPie5 () {
      let option = {
        title: {
          text: '任务满意度百分比',
          x: '16%',
          y: '8%',
          textStyle: {
            color: '#333',
            fontSize: 18
          }
        },
        graphic: [
          {
            // 环形图中间添加文字
            type: 'text', // 通过不同top值可以设置上下显示
            left: 'center',
            top: '56%',
            style: {
              text:
                '已评分任务' + '\n' + '\n' + this.fourData.taskScoringCount || 0,
              textAlign: 'center',
              fill: 'black', // 文字的颜色
              width: 30,
              height: 30,
              fontSize: 16,
              fontFamily: 'Microsoft YaHei'
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['60px', '80px'],
            center: ['50%', '60%'],
            label: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.fourData.taskVerySatisfiedCount,
                name: '非常满意'
              },
              { value: this.fourData.taskSatisfiedCount, name: '满意　　' },
              {
                value: this.fourData.taskNotSatisfiedCount,
                name: '不满意　'
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
                    '#fe7777',
                    '#fad337',
                    '#ff9933',
                    '#f2637b',
                    '#975fe4'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      this.dom5 = echarts.init(this.$refs.dom5, 'tdTheme')
      this.dom5.setOption(option)
    },
    lastMonthSlot (ind) {
      if (ind === 1) {
        this.oneSearch.startTime = getLastMonthStartDate()
        this.oneSearch.endTime = getLastMonthEndDate()
        this.OverdueTaskStatistics(() => {
          this.setPie1()
        })
      } else if (ind === 2) {
        this.twoSearch.startTime = getLastMonthStartDate()
        this.twoSearch.endTime = getLastMonthEndDate()
        this.AreaTaskCount(() => {
          this.setBar1()
        })
      } else if (ind === 3) {
        this.threeSearch.startTime = getLastMonthStartDate()
        this.threeSearch.endTime = getLastMonthEndDate()
        this.TaskStatusAndTypeCount(() => {
          this.setPie3()
          this.setPie4()
        })
      } else if (ind === 4) {
        this.fourSearch.startTime = getLastMonthStartDate()
        this.fourSearch.endTime = getLastMonthEndDate()
        // this.ListProject((res) => {
        //   this.fourSearch.projectId = res.value
        //     this.TaskScoringAndWorkloadBean(() => {
        //       this.setPie5()
        //     })
        //   })
        this.TaskScoringAndWorkloadBean(() => {
          this.setPie5()
        })
      }
    },
    nowMonthSlot (ind) {
      if (ind === 1) {
        this.oneSearch.startTime = getMonthStartDate()
        this.oneSearch.endTime = getMonthEndDate()
        this.OverdueTaskStatistics(() => {
          this.setPie1()
        })
      } else if (ind === 2) {
        this.twoSearch.startTime = getMonthStartDate()
        this.twoSearch.endTime = getMonthEndDate()
        this.AreaTaskCount(() => {
          this.setBar1()
        })
      } else if (ind === 3) {
        this.threeSearch.startTime = getMonthStartDate()
        this.threeSearch.endTime = getMonthEndDate()
        this.TaskStatusAndTypeCount(() => {
          this.setPie3()
          this.setPie4()
        })
      } else if (ind === 4) {
        this.fourSearch.startTime = getMonthStartDate()
        this.fourSearch.endTime = getMonthEndDate()
        this.TaskScoringAndWorkloadBean(() => {
          this.setPie5()
        })
      }
    },
    lastSeasonSlot (ind) {
      if (ind === 1) {
        this.oneSearch.startTime = getLastQuarterStartDate()
        this.oneSearch.endTime = getLastQuarterEndDate()
        this.OverdueTaskStatistics(() => {
          this.setPie1()
        })
      } else if (ind === 2) {
        this.twoSearch.startTime = getLastQuarterStartDate()
        this.twoSearch.endTime = getLastQuarterEndDate()
        this.AreaTaskCount(() => {
          this.setBar1()
        })
      } else if (ind === 3) {
        this.threeSearch.startTime = getLastQuarterStartDate()
        this.threeSearch.endTime = getLastQuarterEndDate()
        this.TaskStatusAndTypeCount(() => {
          this.setPie3()
          this.setPie4()
        })
      } else if (ind === 4) {
        this.fourSearch.startTime = getLastQuarterStartDate()
        this.fourSearch.endTime = getLastQuarterEndDate()
        this.TaskScoringAndWorkloadBean(() => {
          this.setPie5()
        })
      }
    },
    nowSeasonSlot (ind) {
      if (ind === 1) {
        this.oneSearch.startTime = getQuarterStartDate()
        this.oneSearch.endTime = getQuarterEndDate()
        this.OverdueTaskStatistics(() => {
          this.setPie1()
        })
      } else if (ind === 2) {
        this.twoSearch.startTime = getQuarterStartDate()
        this.twoSearch.endTime = getQuarterEndDate()
        this.AreaTaskCount(() => {
          this.setBar1()
        })
      } else if (ind === 3) {
        this.threeSearch.startTime = getQuarterStartDate()
        this.threeSearch.endTime = getQuarterEndDate()
        this.TaskStatusAndTypeCount(() => {
          this.setPie3()
          this.setPie4()
        })
      } else if (ind === 4) {
        this.fourSearch.startTime = getQuarterStartDate()
        this.fourSearch.endTime = getQuarterEndDate()
        this.TaskScoringAndWorkloadBean(() => {
          this.setPie5()
        })
      }
    },
    lastYearSlot (ind) {
      if (ind === 1) {
        this.oneSearch.startTime = getLastYear().startTime
        this.oneSearch.endTime = getLastYear().endTime
        this.OverdueTaskStatistics(() => {
          this.setPie1()
        })
      } else if (ind === 2) {
        this.twoSearch.startTime = getLastYear().startTime
        this.twoSearch.endTime = getLastYear().endTime
        this.AreaTaskCount(() => {
          this.setBar1()
        })
      } else if (ind === 3) {
        this.threeSearch.startTime = getLastYear().startTime
        this.threeSearch.endTime = getLastYear().endTime
        this.TaskStatusAndTypeCount(() => {
          this.setPie3()
          this.setPie4()
        })
      } else if (ind === 4) {
        this.fourSearch.startTime = getLastYear().startTime
        this.fourSearch.endTime = getLastYear().endTime
        this.TaskScoringAndWorkloadBean(() => {
          this.setPie5()
        })
      }
    },
    nowYearSlot (ind) {
      if (ind === 1) {
        this.oneSearch.startTime = getCurrentYear().startTime
        this.oneSearch.endTime = getCurrentYear().endTime
        this.OverdueTaskStatistics(() => {
          this.setPie1()
        })
      } else if (ind === 2) {
        this.twoSearch.startTime = getCurrentYear().startTime
        this.twoSearch.endTime = getCurrentYear().endTime
        this.AreaTaskCount(() => {
          this.setBar1()
        })
      } else if (ind === 3) {
        this.threeSearch.startTime = getCurrentYear().startTime
        this.threeSearch.endTime = getCurrentYear().endTime
        this.TaskStatusAndTypeCount(() => {
          this.setPie3()
          this.setPie4()
        })
      } else if (ind === 4) {
        this.fourSearch.startTime = getCurrentYear().startTime
        this.fourSearch.endTime = getCurrentYear().endTime
        this.TaskScoringAndWorkloadBean(() => {
          this.setPie5()
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
  .bg1 {
    background-color: #314659 !important;
    color: #fff;
  }
  .bg2 {
    background-color: #4ecb74 !important;
    color: #fff;
  }
  .bg3 {
    background-color: #169bd5 !important;
    color: #fff;
  }
  ul{
    list-style-type: none;
  }
  .ranking {
  margin-top: 20px;
  list-style: none;
  li {
    display: flex;
    margin-bottom: 10px;
    .num {
      display: inline-block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      background-color: #f0f2f5;
      text-align: center;
      font-size: 12px;
      line-height: 18px;
    }
    .name {
      width: 20%;
      margin-left: 20px;
    }
    .company {
      padding-left: 20px;
      flex: 1;
    }
    .count {
      width: 15%;
    }
    .company {
      padding-left: 40px;
      flex: 1;
    }
    .count3 {
      width: 22%;
    }
  }
}
.Title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
.dom1-bottom {
  display: flex;
  padding: 10px 40px;
}
.bottom-item {
  flex: 1;
  font-size: 14px;
}
.all {
  color: #666;
}
.overdue {
  color: #fe7777;
}
.bottom-item span {
  font-weight: bold;
}
</style>
