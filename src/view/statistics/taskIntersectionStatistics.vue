<template>
  <div class="tasklktj">
    <div style="font-size: 26px; text-align:center" >任务路口统计</div>
    <Card style="margin-top: 20px;min-height:30vh;">
      <p slot="title"></p>
      <div slot="extra" >
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
          @on-change="changeTime"
          @on-ok="toSearch"
        ></DatePicker>
      </div>
      <Row>
        <Col span="8" style="text-align:center">
          <div class="Title" style="margin-left: 10%;">任务路口总量</div>
          <CountTo v-if="threeData.taskCrossingCount" :end="parseInt(threeData.taskCrossingCount)" count-class="count-style"/>
          <div>任务路口总量</div>
        </Col>
        <Col span="2">&nbsp;</Col>
        <Col span="14">
          <Row>
            <div>
              <div class="Title" style="display:inline-block;">单路口执行的各类任务</div>
              <div style="float:right">
                路口别名：<Select v-model="Search.crossingCode" style="width:200px" @on-change="aliasSel">
                        <Option
                          v-for="item in crossList"
                          :value="item.value"
                          size="small"
                          :key="item.value"
                        >{{ item.label }}</Option>
                      </Select>
              </div>
            </div>
              <Col span="10">
                <div ref="dom1" class="charts chart-pie" style="height: 30vh; position:relative;"></div>
              </Col>
              <Col span="12">
                <ul
                  style=" height: 30vh; display: flex; flex-direction: column; justify-content: center;text-align:left;">
                  <li style="display: flex; align-items: center; justify-content: flex-start;margin-bottom:20px">
                    <div class="dian" style="background-color: #4dcb73"></div>
                    <div class="status">宣传任务</div>
                    <div
                      class="proportion"
                    >{{oneData.publicityTypeCount == '0' ? '0%' : Percentage(oneData.publicityTypeCount, oneData.taskCount)}}</div>
                    <div class="value">执行任务数量：&nbsp;&nbsp;&nbsp;&nbsp;{{oneData.publicityTypeCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center; justify-content: flex-start;margin-bottom:20px">
                    <div class="dian" style="background-color: #3aa0ff"></div>
                    <div class="status">巡检任务</div>
                    <div
                      class="proportion"
                    >{{oneData.patrolTypeCount == '0' ? '0%' : Percentage(oneData.patrolTypeCount, oneData.taskCount)}}</div>
                    <div class="value">执行任务数量：&nbsp;&nbsp;&nbsp;&nbsp;{{oneData.patrolTypeCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center; justify-content: flex-start;margin-bottom:20px">
                    <div class="dian" style="background-color: #fe7777"></div>
                    <div class="status">优化任务</div>
                    <div
                      class="proportion"
                    >{{oneData.optimizingTypeCount == '0' ? '0%' : Percentage(oneData.optimizingTypeCount, oneData.taskCount)}}</div>
                    <div class="value">执行任务数量：&nbsp;&nbsp;&nbsp;&nbsp;{{oneData.optimizingTypeCount}}</div>
                  </li>
                </ul>
              </Col>
            </Row>
        </Col>
        </Row>
    </Card>
    <Card style="margin-top: 20px">
      <Row>
        <div class="Title" style="display:inline-block; margin: 10px;">地区完成审核任务路口数量</div>
        <div  style="float:right;display:inline-block;">
            地区类型：
            <Select v-model="Search.type" style="width:200px;text-align:left" @on-change="regionTypeSel">
              <Option value="0" key="s1">省级</Option>
              <Option value="1" key="s2">市级</Option>
            </Select>
          </div>
          <div style="overflow:hidden"></div>
        <div ref="dom2" class="charts chart-bar" style="min-height: 30vh;"></div>
        <div style="overflow: hidden"></div>
      </Row>
    </Card>
     <Card class="threecard" dis-hover style="margin-top: 20px;min-height:30vh;">
      <Row>
        <Col span="6" style="text-align:center">
          <div class="Title" style="margin-left: 10%">任务路口满意度百分比</div>
          <CountTo v-if="threeData.taskCrossingScoringCount" :end="parseInt(threeData.taskCrossingScoringCount)" count-class="count-style"/>
          <div>已评分任务路口总数</div>
        </Col>
        <Col span="1">&nbsp;</Col>
        <Col span="11">
          <Row>
              <Col span="8">
                <div ref="dom3" class="charts chart-pie" style="height: 30vh; position:relative;"></div>
              </Col>
              <!-- <Col span="1">&NBSP;</Col> -->
              <Col span="14">
                <ul
                  style="margin-top:6%; height: 30vh; display: flex; flex-direction: column; justify-content: center;text-align:left;">
                  <li style="display: flex; align-items: center; justify-content: flex-start;margin-bottom:20px">
                    <div class="dian" style="background-color: #4dcb73"></div>
                    <div class="status">非常满意</div>
                    <div
                      class="proportion"
                    >{{oneData.taskCrossingVerySatisfiedCount == '0' ? '0%' : Percentage(threeData.taskCrossingVerySatisfiedCount, threeData.taskCrossingCount)}}</div>
                    <div class="value">数量：&nbsp;&nbsp;&nbsp;&nbsp;{{threeData.taskCrossingVerySatisfiedCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center; justify-content: flex-start;margin-bottom:20px">
                    <div class="dian" style="background-color: #3aa0ff"></div>
                    <div class="status">　　满意</div>
                    <div
                      class="proportion"
                    >{{threeData.taskCrossingSatisfiedCount == '0' ? '0%' : Percentage(threeData.taskCrossingSatisfiedCount, threeData.taskCrossingCount)}}</div>
                    <div class="value">数量：&nbsp;&nbsp;&nbsp;&nbsp;{{threeData.taskCrossingSatisfiedCount}}</div>
                  </li>
                  <li style="display: flex; align-items: center; justify-content: flex-start;margin-bottom:20px">
                    <div class="dian" style="background-color: #fe7777"></div>
                    <div class="status">　不满意</div>
                    <div
                      class="proportion"
                    >{{threeData.taskCrossingNotSatisfiedCount == '0' ? '0%' : Percentage(threeData.taskCrossingNotSatisfiedCount, threeData.taskCrossingCount)}}</div>
                    <div class="value">数量：&nbsp;&nbsp;&nbsp;&nbsp;{{threeData.taskCrossingNotSatisfiedCount}}</div>
                  </li>
                </ul>
              </Col>
            </Row>
        </Col>
        <Col span="6" style="text-align:center">
          <div class="Title" style="margin-left: 10%">总工作量</div>
          <CountTo v-if="threeData.allWorkloadCount" :end="parseInt(threeData.allWorkloadCount)" count-class="count-style"/>
          <div>工作时长</div>
        </Col>
        </Row>
    </Card>
  </div>
</template>
<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import CountTo from '_c/count-to'
import Tables from '_c/tables'
import { getUserId } from '@/libs/util'
import { taskCountStatisticsByTpye, taskCrossingAreaCount, taskCrossingStatistics, listCrossing } from '@/api/data'
import { getLastMonthStartDate, getLastMonthEndDate, getMonthStartDate, getMonthEndDate, getQuarterStartDate, getQuarterEndDate, getLastQuarterStartDate, getLastQuarterEndDate, getCurrentYear, getLastYear } from '@/libs/mdate.js'

echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'taskIntersectionStatistics',
  components: { Tables, CountTo },
  data () {
    return {
      Search: {
        userId: '',
        startTime: '',
        endTime: '',
        crossingCode: '',
        type: '0'
      },
      dom1: null,
      dom2: null,
      dom3: null,
      oneData: {},
      twoData: {},
      threeData: {},
      crossList: []
    }
  },
  created () {
    this.ListCrossing()
    this.renderData()
  },
  methods: {
    toSearch () {
      this.renderData()
    },
    oneInterface (func) { // one 单路口执行的各类任务
      let _this = this
      taskCountStatisticsByTpye(_this.Search).then((res) => {
        if (res.data.status == '200') {
          _this.oneData = res.data.data
          if (func && typeof func === 'function') {
            func()
          }
        }
      })
    },
    twoInterface (func) { // two 按地区统计任务路口
      let _this = this
      taskCrossingAreaCount(_this.Search).then((res) => {
        if (res.data.status == '200') {
          if (res.data.data && res.data.data.length > 0) {
            _this.twoData = res.data.data
            if (func && typeof func === 'function') {
              func()
            }
          } else {
            _this.$Message.warning('地区完成审核任务路口数量, 未获取到数据！')
          }
        }
      })
    },
    threeInterface (func) { // three 任务路口数据查询
      let _this = this
      taskCrossingStatistics(_this.Search).then((res) => {
        if (res.data.status == '200') {
          _this.threeData = res.data.data
          if (func && typeof func === 'function') {
            func()
          }
        } else {
          _this.$Message.error(res.data.msg)
        }
      })
    },
    ListCrossing () {
      let _this = this
      let params = {
        page: 1,
        pageSize: 50000
      }
      listCrossing(params).then((res) => {
        if (res.data.status == '200') {
          _this.crossList = res.data.data.map((item) => {
            return { value: item.id, label: item.alias }
          })
        }
      })
    },
    aliasSel (val) {
      this.Search.crossingCode = val
      this.oneInterface(() => {
        this.setPie1()
      })
    },
    Percentage (num1, num2) {
      // 计算百分比
      return (
        Math.round((parseFloat(num1) / parseFloat(num2)) * 10000) / 100.0 + '%'
      )
    },
    regionTypeSel (val) {
      this.Search.type = val
      this.twoInterface(() => {
        this.setBar1()
      })
    },
    changeTime (val) {
      this.Search.startTime = val[0]
      this.Search.endTime = val[1]
    },
    setPie1 () {
      let option = {
        title: {
          text: '',
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
            left: '20%',
            top: '44%',
            style: {
              text:
                  '任务总数量' + '\n' + '\n' + this.oneData.taskCount || 0,
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
            radius: ['70px', '100px'],
            center: ['30%', '50%'],
            label: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.oneData.publicityTypeCount,
                name: '宣传任务'
              },
              { value: this.oneData.patrolTypeCount, name: '巡检任务' },
              {
                value: this.oneData.optimizingTypeCount,
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
      this.dom1 = echarts.init(this.$refs.dom1, 'tdTheme')
      this.dom1.setOption(option)
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
            data: this.twoData.map(item => {
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
            data: this.twoData.map(item => {
              return item.count
            })
          }
        ]
      }
      this.dom2 = echarts.init(this.$refs.dom2, 'tdTheme')
      this.dom2.setOption(option)
    },
    setPie2 () {
      let option = {
        title: {
          text: '',
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
            left: '23%',
            top: '52%',
            style: {
              text: this.Percentage(this.threeData.taskCrossingVerySatisfiedCount, this.threeData.taskCrossingScoringCount) || 0,
              textAlign: 'center',
              fill: 'black', // 文字的颜色
              width: 30,
              height: 30,
              fontSize: 18,
              fontFamily: 'Microsoft YaHei'
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '满意度<br>{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['50px', '70px'],
            center: ['30%', '54%'],
            label: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.threeData.taskCrossingVerySatisfiedCount,
                name: '非常满意'
              },
              {
                value: this.threeData.taskCrossingSatisfiedCount,
                name: '满意'
              },
              {
                value: this.threeData.taskCrossingNotSatisfiedCount,
                name: '不满意'
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
      this.dom3 = echarts.init(this.$refs.dom3, 'tdTheme')
      this.dom3.setOption(option)
    },
    renderData () {
      this.Search.userId = getUserId()
      this.threeInterface()
      this.oneInterface(() => {
        this.setPie1()
      })
      this.twoInterface(() => {
        this.setBar1()
      })
      this.threeInterface(() => {
        this.setPie2()
      })
    },
    lastMonthSlot () {
      this.Search.startTime = getLastMonthStartDate()
      this.Search.endTime = getLastMonthEndDate()
      this.renderData()
    },
    nowMonthSlot () {
      this.Search.startTime = getMonthStartDate()
      this.Search.endTime = getMonthEndDate()
      this.renderData()
    },
    lastSeasonSlot () {
      this.Search.startTime = getLastQuarterStartDate()
      this.Search.endTime = getLastQuarterEndDate()
      this.renderData()
    },
    nowSeasonSlot () {
      this.Search.startTime = getQuarterStartDate()
      this.Search.endTime = getQuarterEndDate()
      this.renderData()
    },
    lastYearSlot () {
      this.Search.startTime = getLastYear().startTime
      this.Search.endTime = getLastYear().endTime
      this.renderData()
    },
    nowYearSlot () {
      this.Search.startTime = getCurrentYear().startTime
      this.Search.endTime = getCurrentYear().endTime
      this.renderData()
    }
  }
}
</script>
<style lang="less">
  .tasklktj {
    padding: 20px;
    background-color: #fff;
    .count-to-wrapper{
      margin-top: 80px;
    }
    .threecard {
      .count-to-wrapper{
        margin-top: 50px;
      }
      .Title{
        margin-top: 15px;
      }
    }
    .count-style{
      font-size: 70px;
      font-weight: bold;
      color: #78beff;
    }
    .Title{
      text-align: left;
      font-size: 16px;
      font-weight: bold;
      color: #17233d;
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
  }
</style>
