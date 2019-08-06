<template>
  <div>
    <Card>
      <div>
        <Menu mode="horizontal" active-name="1" @on-select="menuChange">
          <MenuItem name="1">
            按状态统计
          </MenuItem>
          <MenuItem name="2">
            按项目统计
          </MenuItem>
          <MenuItem name="3">
            按地区统计
          </MenuItem>
          <div style="display:inline-block;float: right">
            <Button type="text" @click="lastMonthSlot">上月</Button>
            <Button type="text" @click="nowMonthSlot">本月</Button>
            <Button type="text" @click="lastSeasonSlot">上季</Button>
            <Button type="text" @click="nowSeasonSlot">本季</Button>
            <Button type="text" @click="lastYearSlot">去年</Button>
            <Button type="text" @click="nowYearSlot">今年</Button>
            <DatePicker
              :confirm="true"
              type="daterange"
              placement="bottom-end"
              placeholder="请选择起止日期"
              style="width: 200px"
              @on-change="changeTimeOne"
              @on-ok="menuChange"
            ></DatePicker>
          </div>
        </Menu>
        <Row v-if="activeName == '1'">
          <Col span="14">
            <Row>
              <Col span="14">
                <div ref="dom" class="charts chart-pie" style="height: 45vh; position:relative;"></div>
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
                    >{{projectData.projectOnGoingStatusCount == '0' ? '0%' : Percentage(projectData.projectOnGoingStatusCount, projectData.projectCount)}}</div>
                    <div class="value">数量：{{projectData.projectOnGoingStatusCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #37cbcb"></div>
                    <div class="status">未开始</div>
                    <div
                      class="proportion"
                    >{{projectData.projectNotStartStatusCount == '0' ? '0%' : Percentage(projectData.projectNotStartStatusCount, projectData.projectCount)}}</div>
                    <div class="value">数量：{{projectData.projectNotStartStatusCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #4ecb74"></div>
                    <div class="status">已完成</div>
                    <div
                      class="proportion"
                    >{{projectData.projectOnGoingStatusCount == '0' ? '0%' : Percentage(projectData.projectOnGoingStatusCount, projectData.projectCount)}}</div>
                    <div class="value">数量：{{projectData.projectOnGoingStatusCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #fad337"></div>
                    <div class="status">已暂停</div>
                    <div
                      class="proportion"
                    >{{projectData.projectPauseStatusCount == '0' ? '0%' : Percentage(projectData.projectPauseStatusCount, projectData.projectCount)}}</div>
                    <div class="value">数量：{{projectData.projectPauseStatusCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #ff9933"></div>
                    <div class="status">已撤销</div>
                    <div
                      class="proportion"
                    >{{projectData.projectRevokeStatusCount == '0' ? '0%' : Percentage(projectData.projectRevokeStatusCount, projectData.projectCount)}}</div>
                    <div class="value">数量：{{projectData.projectRevokeStatusCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #f2637b"></div>
                    <div class="status">已驳回</div>
                    <div
                      class="proportion"
                    >{{projectData.projectRejectStatusCount == '0' ? '0%' : Percentage(projectData.projectRejectStatusCount, projectData.projectCount)}}</div>
                    <div class="value">数量：{{projectData.projectRejectStatusCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #975fe4"></div>
                    <div class="status">审核中</div>
                    <div
                      class="proportion"
                    >{{projectData.projectAuditStatusCount == '0' ? '0%' : Percentage(projectData.projectAuditStatusCount, projectData.projectCount)}}</div>
                    <div class="value">数量：{{projectData.projectAuditStatusCount}}</div>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
          <Col span="10">
            <Row>
              <Col span="24">
                <div ref="dom2" class="charts chart-pie" style="height: 28vh; position:relative;"></div>
              </Col>
              <Col span="24">
                <ul
                  style="min-height: 120px; display: flex; flex-direction: column; justify-content: space-around;"
                >
                  <li style="display: flex; align-items: center; justify-content: center;">
                    <div class="dian" style="background-color: #4dcb73"></div>
                    <div class="status">非常满意&nbsp;</div>
                    <div
                      class="proportion"
                    >{{projectData.projectVerySatisfiedCount == '0' ? '0%' : Percentage(projectData.projectOnGoingStatusCount, projectData.projectCount)}}</div>
                    <div class="value">数量：{{projectData.projectVerySatisfiedCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center; justify-content: center;">
                    <div class="dian" style="background-color: #3aa0ff"></div>
                    <div class="status">满意&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    <div
                      class="proportion"
                    >{{projectData.projectSatisfiedCount == '0' ? '0%' : Percentage(projectData.projectNotStartStatusCount, projectData.projectCount)}}</div>
                    <div class="value">数量：{{projectData.projectSatisfiedCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center; justify-content: center;">
                    <div class="dian" style="background-color: #fe7777"></div>
                    <div class="status">不满意&nbsp;&nbsp;&nbsp;&nbsp;</div>
                    <div
                      class="proportion"
                    >{{projectData.projectNotSatisfiedCount == '0' ? '0%' : Percentage(projectData.projectOnGoingStatusCount, projectData.projectCount)}}</div>
                    <div class="value">数量：{{projectData.projectNotSatisfiedCount}}</div>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row v-if="activeName == '2'">
          <Col span="16">
            <div class="Title" style="margin-top:20px">各项指标数量统计</div>
            <tables
              style="padding:10px 0px;"
              ref="tabletj"
              :total="total"
              v-model="tableData"
              :columns="columns"
              :page-size="oneSearch.pageSize"
              :onChange="pageChange"
              :onPageSizeChange="pageSizeChange"
            ></tables>
          </Col>
          <Col span="2">&nbsp;</Col>
          <Col span="6">
            <div style="padding: 10px;">
              <Row>
                <Col span="24">
                  <div class="Title" style="margin-top:10px;">选定任务下任务完成百分比</div>
                  <div style="margin: 10px 0">
                    选择项目：
                    <Select v-model="oneSearch.projectId" style="width:200px" @on-change="proSel">
                      <Option
                        v-for="item in projectList"
                        :value="item.value"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
                  </div>
                  <div v-if="finishProjectTaskData.finisheTaskCount">
                    完成任务数量：
                    <span style="font-weight:bold;">{{finishProjectTaskData.finisheTaskCount}}</span>
                  </div>
                </Col>
                <Col span="24">
                  <div ref="dom4" class="charts chart-pie" style="height: 28vh;"></div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row v-if="activeName == '3'">
            <div style="padding: 20px 0">
              <div class="Title" style="display:inline-block">地区项目个数统计</div>
              <div style="float:right">
                地区类型：
                <Select v-model="oneSearch.type" style="width:200px;text-align:left" @on-change="regionTypeSel">
                  <Option value="0">省级</Option>
                  <Option value="1">市级</Option>
                </Select>
              </div>
            </div>
          <div ref="dom5" class="charts chart-bar" style="min-height: 30vh;"></div>
          <div style="overflow: hidden"></div>
        </Row>
      </div>
    </Card>
    <Card style="margin-top: 20px">
      <p slot="title" style="display:inline-block;">项目逾期统计</p>
      <div slot="extra" style>
        <Button type="text" @click="lastYearSlotTwo">去年</Button>
        <Button type="text" @click="nowYearSlotTwo">今年</Button>
        <DatePicker
          :confirm="true"
          type="daterange"
          placement="bottom-end"
          placeholder="请选择起止日期"
          style="width: 200px"
          @on-change="changeTimeTwo"
          @on-ok="TimeTwoOk"
        ></DatePicker>
      </div>
      <Row>
        <Col span="10">
          <div ref="dom3" class="charts chart-pie" style="height: 40vh; position:relative;"></div>
          <div class="dom3-bottom">
            <div class="bottom-item all">
              项目总数量：
              <span>{{overdueData.projectCount}}</span>
            </div>
            <div class="bottom-item overdue">
              逾期项目数量：
              <span>{{overdueData.overdueProjectCount}}</span>
            </div>
          </div>
        </Col>
        <Col span="14">
          <div class="Title" style="margin-top: 15px">项目经理逾期项目排名（前十）</div>
          <ul class="ranking">
            <li v-for="(item, key) in overdueData.overdueProjectManagerBeanList" :key="key">
              <span class="num" :class="key > 2 ? '': 'bg1'">{{key + 1}}</span>
              <span class="name">{{item.projectManagerName}}</span>
              <span class="company">{{item.officeName}}</span>
              <span class="count">{{item.count}}</span>
            </li>
          </ul>
        </Col>
      </Row>
    </Card>
    <Card style="margin-top: 20px">
      <p slot="title" style="display:inline-block;">项目完成审核的任务路口与关注路口</p>
      <div slot="extra" style>
        <div style>
          选择项目：
          <Select v-model="threeSearch.projectId" style="width:200px" @on-change="proSelthree">
            <Option
              v-for="item in projectList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
          <DatePicker
            :confirm="true"
            type="daterange"
            placement="bottom-end"
            placeholder="请选择起止日期"
            style="width: 200px;margin-left: 10px"
            @on-change="changeTimeThree"
            @on-ok="TimeThreeOk"
          ></DatePicker>
        </div>
      </div>
      <Row style="padding: 20px 0">
        <Col span="1">&nbsp;</Col>
        <Col span="9">
          <div class="Title">完成审核的任务路口数量排行</div>
          <ul class="ranking">
            <li v-for="(item, key) in threeData.taskTaskCrossingCountBean" :key="key">
              <span class="num" :class="key > 2 ? '': 'bg2'">{{key + 1}}</span>
              <span class="company">{{item.name}}</span>
              <span class="count3">{{item.taskCrossingCount}}</span>
            </li>
          </ul>
        </Col>
        <Col span="4">&nbsp;</Col>
        <Col span="10">
          <div class="Title">推荐关注路口</div>
          <ul class="ranking">
            <li v-for="(item, key) in threeData.mostVersionCrossingBeans" :key="key">
              <span class="num" :class="key > 2 ? '': 'bg3'">{{key + 1}}</span>
              <span class="company">{{item.alias}}</span>
              <span class="count3">{{item.count}}</span>
            </li>
          </ul>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import echarts from 'echarts'
import tdTheme from './theme.json'
import { getUserId } from '@/libs/util'
import {
  projectStatusCount,
  overdueProjectStatistics,
  projectWorkloadCount,
  finishProjectTaskCount,
  listProject,
  areaProjectCount,
  completeAndFollowTaskBean
} from '@/api/data'
import { getLastMonthStartDate, getLastMonthEndDate, getMonthStartDate, getMonthEndDate, getQuarterStartDate, getQuarterEndDate, getLastQuarterStartDate, getLastQuarterEndDate, getCurrentYear, getLastYear } from '@/libs/mdate.js'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'projectStatistics',
  components: { Tables },
  data () {
    return {
      oneSearch: {
        userId: '',
        type: '0', // 区域类型
        page: 1,
        pageSize: 5,
        startTime: '',
        endTime: '',
        projectId: ''
      },
      twoSearch: {
        userId: '',
        startTime: '',
        endTime: ''
      },
      threeSearch: {
        userId: '',
        startTime: '',
        endTime: '',
        projectId: ''
      },
      threeData: {},
      total: 0,
      tableData: [],
      projectList: [],
      areaTaskData: {},
      finishProjectTaskData: {},
      dom: null,
      activeName: '1',
      projectData: {},
      overdueData: {},
      columns: [
        {
          type: 'index',
          width: 60,
          title: '序号'
        },
        { title: '项目名称', key: 'name' },
        { title: '工作量', key: 'workload', width: 120 },
        { title: '任务数量', key: 'taskCount', width: 120 },
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
    this.ListProject(res => {
      this.oneSearch.projectId = res.value // 设置默认项目ID
      this.threeSearch.projectId = res.value // 设置默认项目ID
      this.threeInterface()
    })
  },
  mounted () {
    // one
    this.ProjectStatusCount(() => {
      this.setPie()
      this.setPie2()
    })
    // two
    this.OverdueProjectStatistics(() => {
      this.setPie3()
    })
  },
  methods: {
    menuChange (val) {
      // 模块一 切换tab or 时间筛选
      if (val) {
        this.activeName = val
      }
      if (this.activeName === '1') {
        this.ProjectStatusCount(() => {
          this.setPie()
          this.setPie2()
        })
      } else if (this.activeName === '2') {
        this.ProjectWorkloadCount()
        this.FinishProjectTaskCount(() => {
          this.setPie4()
        })
      } else if (this.activeName === '3') {
        this.AreaTaskCount(() => {
          this.setBar1()
        })
      }
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
    TimeTwoOk () {
      this.OverdueProjectStatistics(() => {
        this.setPie3()
      })
    },
    TimeThreeOk () {
      this.threeInterface()
    },
    AreaTaskCount (func) {
      // one-3-1 地区项目个数统计
      let _this = this
      areaProjectCount(_this.oneSearch).then(res => {
        if (res.data.status === '200') {
          _this.areaTaskData = res.data.data
          if (func && typeof func === 'function') {
            func()
          }
        }
      })
    },
    proSel (val) {
      this.oneSearch.projectId = val
      this.FinishProjectTaskCount(() => {
        this.setPie4()
      })
    },
    proSelthree (val) {
      this.threeSearch.projectId = val
      this.threeInterface()
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
    threeInterface () {
      // 项目完成审核的任务路口与关注路口
      let _this = this
      _this.threeSearch.userId = getUserId()
      completeAndFollowTaskBean(_this.threeSearch).then(res => {
        if (res.data.status === '200') {
          _this.threeData = res.data.data
        }
      })
    },
    FinishProjectTaskCount (func) {
      // one-2-2项目任务完成百分比
      let _this = this
      finishProjectTaskCount(_this.oneSearch).then(res => {
        if (res.data.status === '200') {
          _this.finishProjectTaskData = res.data.data
          console.log(res.data.data)
          if (func && typeof func === 'function') {
            func()
          }
        }
      })
    },
    OverdueProjectStatistics (func) {
      // two-1 项目逾期统计
      let _this = this
      overdueProjectStatistics(_this.twoSearch).then(res => {
        if (res.data.status === '200') {
          _this.overdueData = res.data.data
          if (func && typeof func === 'function') {
            func()
          }
        }
      })
    },
    ProjectWorkloadCount () {
      // one-2-1 各项指标数量统计
      let _this = this
      projectWorkloadCount(_this.oneSearch).then(res => {
        if (res.data.status === '200') {
          _this.tableData = res.data.data.list
          _this.total = parseInt(res.data.data.total)
        }
      })
    },
    Percentage (num1, num2) {
      // 计算百分比
      return (
        Math.round((parseFloat(num1) / parseFloat(num2)) * 10000) / 100.0 + '%'
      )
    },
    ProjectStatusCount (func) {
      // one-1 按状态统计
      let _this = this
      projectStatusCount(_this.oneSearch).then(res => {
        if (res.data.status === '200') {
          _this.projectData = res.data.data
          if (func && typeof func === 'function') {
            func()
          }
        }
      })
    },
    setPie () {
      let option = {
        title: {
          text: '项目总数与各项目状态',
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
                '项目总数' + '\n' + '\n' + this.projectData.projectCount || 0,
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
                value: this.projectData.projectOnGoingStatusCount,
                name: '进行中'
              },
              {
                value: this.projectData.projectNotStartStatusCount,
                name: '未开始'
              },
              {
                value: this.projectData.projectFinishStatusCount,
                name: '已完成'
              },
              {
                value: this.projectData.projectPauseStatusCount,
                name: '已暂停'
              },
              {
                value: this.projectData.projectRevokeStatusCount,
                name: '已撤销'
              },
              {
                value: this.projectData.projectRejectStatusCount,
                name: '已驳回'
              },
              {
                value: this.projectData.projectAuditStatusCount,
                name: '审核中'
              }
              // { value: this.projectData.projectScoringCount, name: '已评分' },
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
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
    },
    setPie2 () {
      let option = {
        title: {
          text: '项目评分结果占比',
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
                '已评分项目' + '\n' + '\n' + this.projectData.projectCount || 0,
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
                value: this.projectData.projectVerySatisfiedCount,
                name: '非常满意'
              },
              { value: this.projectData.projectSatisfiedCount, name: '满意' },
              {
                value: this.projectData.projectNotSatisfiedCount,
                name: '不满意'
              }
            ],
            // data: this.value2,
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
      this.dom = echarts.init(this.$refs.dom2, 'tdTheme')
      this.dom.setOption(option)
    },
    setPie3 () {
      let option = {
        title: {
          text: '项目逾期数量',
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
                '逾期项目百分比' +
                '\n' +
                '\n' +
                this.Percentage(
                  this.overdueData.overdueProjectCount,
                  this.overdueData.projectCount
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
                  this.overdueData.projectCount -
                  this.overdueData.overdueProjectCount,
                name: '未逾期项目数量'
              },
              {
                value: this.overdueData.overdueProjectCount,
                name: '逾期项目数量'
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
      this.dom = echarts.init(this.$refs.dom3, 'tdTheme')
      this.dom.setOption(option)
    },
    setPie4 () {
      let option = {
        graphic: [
          {
            // 环形图中间添加文字
            type: 'text', // 通过不同top值可以设置上下显示
            left: 'center',
            top: '56%',
            style: {
              text:
                '任务完成百分比' +
                '\n' +
                '\n' +
                this.Percentage(
                  this.finishProjectTaskData.projectVerySatisfiedCount,
                  this.finishProjectTaskData.projectSatisfiedCount
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
            radius: ['70px', '90px'],
            center: ['50%', '56%'],
            label: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.finishProjectTaskData.finisheTaskCount,
                name: '已完成'
              },
              {
                value:
                  this.finishProjectTaskData.taskCount -
                  this.finishProjectTaskData.finisheTaskCount,
                name: '剩余'
              }
            ],
            // data: this.value2,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function (params) {
                  let colorList = [
                    '#3aa0ff',
                    '#ccc',
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
      this.dom = echarts.init(this.$refs.dom4, 'tdTheme')
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
            data: this.areaTaskData.map(item => {
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
            data: this.areaTaskData.map(item => {
              return item.count
            })
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom5, 'tdTheme')
      this.dom.setOption(option)
    },
    pageChange (val) {
      console.log(val)
      this.ProjectWorkloadCountSearch.page = val
      this.ProjectWorkloadCount()
    },
    pageSizeChange (val) {
      this.ProjectWorkloadCountSearch.pageSize = val
      this.ProjectWorkloadCount()
    },
    lastMonthSlot () {
      this.oneSearch.startTime = getLastMonthStartDate()
      this.oneSearch.endTime = getLastMonthEndDate()
      if (this.activeName === '1') {
        this.ProjectStatusCount(() => {
          this.setPie()
          this.setPie2()
        })
      } else if (this.activeName === '2') {
        this.ProjectWorkloadCount()
        this.FinishProjectTaskCount(() => {
          this.setPie4()
        })
      } else if (this.activeName === '3') {
        this.AreaTaskCount(() => {
          this.setBar1()
        })
      }
    },
    nowMonthSlot () {
      this.oneSearch.startTime = getMonthStartDate()
      this.oneSearch.endTime = getMonthEndDate()
      if (this.activeName === '1') {
        this.ProjectStatusCount(() => {
          this.setPie()
          this.setPie2()
        })
      } else if (this.activeName === '2') {
        this.ProjectWorkloadCount()
        this.FinishProjectTaskCount(() => {
          this.setPie4()
        })
      } else if (this.activeName === '3') {
        this.AreaTaskCount(() => {
          this.setBar1()
        })
      }
    },
    lastSeasonSlot () {
      this.oneSearch.startTime = getLastQuarterStartDate()
      this.oneSearch.endTime = getLastQuarterEndDate()
      if (this.activeName === '1') {
        this.ProjectStatusCount(() => {
          this.setPie()
          this.setPie2()
        })
      } else if (this.activeName === '2') {
        this.ProjectWorkloadCount()
        this.FinishProjectTaskCount(() => {
          this.setPie4()
        })
      } else if (this.activeName === '3') {
        this.AreaTaskCount(() => {
          this.setBar1()
        })
      }
    },
    nowSeasonSlot () {
      this.oneSearch.startTime = getQuarterStartDate()
      this.oneSearch.endTime = getQuarterEndDate()
      if (this.activeName === '1') {
        this.ProjectStatusCount(() => {
          this.setPie()
          this.setPie2()
        })
      } else if (this.activeName === '2') {
        this.ProjectWorkloadCount()
        this.FinishProjectTaskCount(() => {
          this.setPie4()
        })
      } else if (this.activeName === '3') {
        this.AreaTaskCount(() => {
          this.setBar1()
        })
      }
    },
    lastYearSlot () {
      this.oneSearch.startTime = getLastYear().startTime
      this.oneSearch.endTime = getLastYear().endTime
      if (this.activeName === '1') {
        this.ProjectStatusCount(() => {
          this.setPie()
          this.setPie2()
        })
      } else if (this.activeName === '2') {
        this.ProjectWorkloadCount()
        this.FinishProjectTaskCount(() => {
          this.setPie4()
        })
      } else if (this.activeName === '3') {
        this.AreaTaskCount(() => {
          this.setBar1()
        })
      }
    },
    nowYearSlot () {
      this.oneSearch.startTime = getCurrentYear().startTime
      this.oneSearch.endTime = getCurrentYear().endTime
      if (this.activeName === '1') {
        this.ProjectStatusCount(() => {
          this.setPie()
          this.setPie2()
        })
      } else if (this.activeName === '2') {
        this.ProjectWorkloadCount()
        this.FinishProjectTaskCount(() => {
          this.setPie4()
        })
      } else if (this.activeName === '3') {
        this.AreaTaskCount(() => {
          this.setBar1()
        })
      }
    },
    lastYearSlotTwo () {
      this.twoSearch.startTime = getLastYear().startTime
      this.twoSearch.endTime = getLastYear().endTime
      this.OverdueProjectStatistics(() => {
        this.setPie3()
      })
    },
    nowYearSlotTwo () {
      this.twoSearch.startTime = getCurrentYear().startTime
      this.twoSearch.endTime = getCurrentYear().endTime
      this.OverdueProjectStatistics(() => {
        this.setPie3()
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
.showPannel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
ul {
  list-style-type: none;
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
.dom3-bottom {
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
