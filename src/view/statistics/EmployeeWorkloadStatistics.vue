<template>
  <div class="gzlCount">
    <div style="font-size: 26px; text-align:center" >员工工作量统计</div>
    <Divider />
    <div style="display:inline-block;">
      选择人员:
      <Select v-model="Search.userId" style="width:200px;text-align:left" @on-change="userSel">
          <Option v-for="(item, key) in userList" :key="key" :value="item.value">{{item.label}}</Option>
        </Select>
    </div>
    <div style="display:inline-block;float:right">
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
    <div style="clear:both;margin-bottom:20px;"></div>
      <Row>
        <Col span="18" style="padding-right: 15px;">
          <Card class="card1">
            <p slot="title">路口满意度百分比</p>
            <Row>
            <Col span="6" style="text-align:center">
              <CountTo v-if="oneData.taskCrossingScoringCount" :end="parseInt(oneData.taskCrossingScoringCount)" count-class="count-style"/>
              <div>已评分任务路口总数</div>
            </Col>
            <Col span="2">&nbsp;</Col>
            <Col span="16">
              <Row>
                  <Col span="8">
                    <div ref="dom1" class="charts chart-pie" style="height: 20vh; position:relative;"></div>
                  </Col>
                  <Col span="14">
                    <ul
                      style="margin-top:0%; height: 24vh; display: flex; flex-direction: column; justify-content: center;text-align:left;">
                      <li style="display: flex; align-items: center; justify-content: flex-start;margin-bottom:20px">
                        <div class="dian" style="background-color: #4dcb73"></div>
                        <div class="status">非常满意&nbsp;</div>
                        <div
                          class="proportion"
                        >{{oneData.taskCrossingVerySatisfiedCount == '0' ? '0%' : Percentage(oneData.taskCrossingVerySatisfiedCount, oneData.taskCrossingScoringCount)}}</div>
                        <div class="value">数量：&nbsp;&nbsp;&nbsp;&nbsp;{{oneData.taskCrossingVerySatisfiedCount}}</div>
                      </li>
                      <li style="display: flex; align-items: center; justify-content: flex-start;margin-bottom:20px">
                        <div class="dian" style="background-color: #3aa0ff"></div>
                        <div class="status">满意&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                        <div
                          class="proportion"
                        >{{oneData.taskCrossingSatisfiedCount == '0' ? '0%' : Percentage(oneData.taskCrossingSatisfiedCount, oneData.taskCrossingScoringCount)}}</div>
                        <div class="value">数量：&nbsp;&nbsp;&nbsp;&nbsp;{{oneData.taskCrossingSatisfiedCount}}</div>
                      </li>
                      <li style="display: flex; align-items: center; justify-content: flex-start;margin-bottom:20px">
                        <div class="dian" style="background-color: #fe7777"></div>
                        <div class="status">不满意&nbsp;&nbsp;&nbsp;&nbsp;</div>
                        <div
                          class="proportion"
                        >{{oneData.taskCrossingNotSatisfiedCount == '0' ? '0%' : Percentage(oneData.taskCrossingNotSatisfiedCount, oneData.taskCrossingScoringCount)}}</div>
                        <div class="value">数量：&nbsp;&nbsp;&nbsp;&nbsp;{{oneData.taskCrossingNotSatisfiedCount}}</div>
                      </li>
                    </ul>
                  </Col>
                </Row>
            </Col>
            </Row>
          </Card>
        </Col>
        <Col span="6"  style="padding-left: 15px;">
          <Card class="card2">
            <p slot="title">总工作量</p>
            <div style="text-align:center">
              <CountTo v-if="oneData.workingHours" :end="parseInt(oneData.workingHours)" count-class="count-style"/>
              <div>工作时长</div>
            </div>
          </Card>
        </Col>
      </Row>
    <Card style="margin-top: 20px">
      <p slot="title">各任务下的工作量</p>
      <ul class="mlist">
        <li v-for="(item, key) in tableData" :key="key">
          <div class="table-left"><span class="index">{{key + 1}}</span> | {{item.taskName}}</div>
          <div class="table-right">
            | <span class="progress" >
              <span class="showNum" :style="{width: (320*parseFloat(item.workingHours) / parseFloat(oneData.workingHours)) + 'px'}"></span>
            </span>
             | &nbsp;工时：<span class="num">{{item.workingHours*100}}</span>
          </div>
        </li>
      </ul>
      <Divider />
      <div class="page">
        <div>共 <span style="font-weight:bold">{{tableData.length}}</span> 条</div>
        <Page
         :total="tableData.length"
         show-sizer
         @on-change="pageChange"
         @on-page-size-change="pageSizeChange" />
      </div>
    </Card>
  </div>
</template>
<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import CountTo from '_c/count-to'
import Tables from '_c/tables'
import { userWorkingHours, getUserList } from '@/api/data'
import { ChartPie, ChartBar } from '_c/charts'
import { on, off } from '@/libs/tools'
import { getLastMonthStartDate, getLastMonthEndDate, getMonthStartDate, getMonthEndDate, getQuarterStartDate, getQuarterEndDate, getLastQuarterStartDate, getLastQuarterEndDate, getCurrentYear, getLastYear } from '@/libs/mdate.js'

echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'EmployeeWorkloadStatistics',
  components: { Tables, CountTo, ChartPie, ChartBar },
  data () {
    return {
      Search: {
        userId: '',
        startTime: '',
        endTime: '',
        type: '0',
        page: '1',
        pageSize: '10'
      },
      userList: [],
      tableData: [],
      dom1: null,
      oneData: {}
    }
  },
  created () {
    this.GetUserList()
    this.oneInterface(() => {
      this.setPie1()
    })
  },
  methods: {
    userSel (val) {
      this.oneInterface(() => {
        this.setPie1()
      })
    },
    pageChange (val) {
      this.Search.page = val
      this.oneInterface()
    },
    pageSizeChange (val) {
      this.Search.pageSize = val
      this.oneInterface()
    },
    toSearch (val) {
      this.oneInterface(() => {
        this.setPie1()
      })
    },
    GetUserList () {
      let _this = this
      let params = {
        pageSize: 5000,
        page: 1
      }
      getUserList(params).then((res) => {
        if (res.data.status === '200') {
          _this.userList = res.data.data.list.map((item) => {
            return { value: item.id, label: item.name }
          })
        }
      })
    },
    oneInterface (func) { // one 单路口执行的各类任务
      let _this = this
      userWorkingHours(_this.Search).then((res) => {
        if (res.data.status === '200') {
          _this.oneData = res.data.data
          _this.tableData = res.data.data.taskWorkingHoursBeanList
          if (func && typeof func === 'function') {
            func()
          }
        }
      })
    },
    twoInterface (func) { // two 按地区统计任务路口
      let _this = this
      taskCrossingAreaCount(_this.Search).then((res) => {
        if (res.data.status === '200') {
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
    Percentage (num1, num2) {
      // 计算百分比
      return (
        isNaN(Math.round((parseFloat(num1) / parseFloat(num2)) * 10000) / 100.0) ? '0%' : Math.round((parseFloat(num1) / parseFloat(num2)) * 10000) / 100.0 + '%'
      )
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
            left: '30%',
            top: '44%',
            style: {
              text: '满意度' + '\n' + '\n' + this.Percentage(this.oneData.taskCrossingScoringCount - this.oneData.taskCrossingSatisfiedCount, this.oneData.taskCrossingScoringCount) || 0,
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
          formatter: '满意度<br>{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '75%'],
            center: ['40%', '54%'],
            label: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: this.oneData.taskCrossingVerySatisfiedCount,
                name: '非常满意'
              },
              {
                value: this.oneData.taskCrossingSatisfiedCount,
                name: '满意'
              },
              {
                value: this.oneData.taskCrossingNotSatisfiedCount,
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
      this.dom1 = echarts.init(this.$refs.dom1, 'tdTheme')
      this.dom1.setOption(option)
      on(window, 'resize', this.resizeP1)
    },
    resizeP1 () {
      this.dom1.resize()
    },
    lastMonthSlot () {
      this.Search.startTime = getLastMonthStartDate()
      this.Search.endTime = getLastMonthEndDate()
      this.oneInterface(() => {
        this.setPie1()
      })
    },
    nowMonthSlot () {
      this.Search.startTime = getMonthStartDate()
      this.Search.endTime = getMonthEndDate()
      this.oneInterface(() => {
        this.setPie1()
      })
    },
    lastSeasonSlot () {
      this.Search.startTime = getLastQuarterStartDate()
      this.Search.endTime = getLastQuarterEndDate()
      this.oneInterface(() => {
        this.setPie1()
      })
    },
    nowSeasonSlot () {
      this.Search.startTime = getQuarterStartDate()
      this.Search.endTime = getQuarterEndDate()
      this.oneInterface(() => {
        this.setPie1()
      })
    },
    lastYearSlot () {
      this.Search.startTime = getLastYear().startTime
      this.Search.endTime = getLastYear().endTime
      this.oneInterface(() => {
        this.setPie1()
      })
    },
    nowYearSlot () {
      this.Search.startTime = getCurrentYear().startTime
      this.Search.endTime = getCurrentYear().endTime
      this.oneInterface(() => {
        this.setPie1()
      })
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resizeP1)
  }
}
</script>
<style lang="less">
  .gzlCount {
    padding: 20px;
    background-color: #fff;
    .page{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-left: 15px;
    }
    .mlist{
      background-color: #f5f7f9;
      li{
        list-style: none;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
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
        color: #999;
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
            color: #333;
          }
      }
    }
    .card1{
      height: 30vh;
      .count-to-wrapper{
        margin-top: 20px;
      }
    }
    .card2{
      height: 30vh;
      .count-to-wrapper{
        margin-top: 10%;
      }
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
