<template>
  <div class="MaterialStatistics">
    <div style="font-size: 26px; text-align:center" >物资统计</div>
    <Card dis-hover style="margin-top: 20px">
      <p class="Title">各类物资支出与百分比</p>
      <div class="m-slider">
        <div class="slider-con">
          <div v-for="(item, index) in PieData" :key="index" class="con-item" :class="index == active ? 'borBot' : ''" @click="selType(item.id, index)">
            <div class="item-l">
              <div class="title">{{item.name}}</div>
              <div class="pay">支出数<br><span class="num">{{item.lendCount}}</span></div>
            </div>
            <div class="item-r">
              <div ref="dom" class="charts chart-pie" style="height: 100%; position:relative;"></div>
            </div>
          </div>
        </div>
      </div>
      <p slot="title">物资分配</p>
      <div slot="extra" style>
        选择项目：<Select v-model="pieSearch.projectId" style="width:200px" @on-change="projectSel">
                      <Option
                        v-for="item in projectList"
                        :value="item.value"
                        size="small"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
        选择任务：<Select v-model="pieSearch.taskId" style="width:200px" @on-change="taskSel">
                      <Option
                        v-for="item in listTask"
                        :value="item.value"
                        size="small"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
      </div>
      <p class="Title">物资占用一览表</p>
      <Row>
          <Col span="24">
            <tables
              style="padding:10px 0px;"
              ref="tabletj"
              v-model="tableData1"
              :columns="columns1"
              :showPage="true"
              :onChange="pageChange1"
              :onPageSizeChange="pageSizeChange1"
            ></tables>
          </Col>
        </Row>
    </Card>
    <Card dis-hover style="margin-top: 20px">
      <p slot="title">各项目物资使用量</p>
      <div slot="extra" style>
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
          @on-ok="selTimeTwo"
        ></DatePicker>
      </div>
        物资类型：<Select v-model="pieSearch.projectId" style="width:200px" @on-change="materialCategorySel">
                      <Option
                        v-for="item in materialCategory"
                        :value="item.value"
                        size="small"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
        选择物资：<Select v-model="pieSearch.taskId" style="width:200px" @on-change="ProjectMaterialSel">
                      <Option
                        v-for="item in listProjectMaterial"
                        :value="item.value"
                        size="small"
                        :key="item.value"
                      >{{ item.label }}</Option>
                    </Select>
      <Row>
          <Col span="24">
            <tables
              style="padding:10px 0px;"
              ref="tabletj"
              v-model="tableData2"
              :columns="columns2"
              :showPage="true"
              :onChange="pageChange2"
              :onPageSizeChange="pageSizeChange2"
            ></tables>
          </Col>
        </Row>
    </Card>
    <Card dis-hover style="margin-top: 20px">
      <p slot="title">消耗品余量提示</p>
      <Row>
          <Col span="24">
            <tables
              style="padding:10px 0px;"
              ref="tabletj"
              v-model="tableData3"
              :columns="columns3"
              :showPage="true"
              :onChange="pageChange3"
              :onPageSizeChange="pageSizeChange3"
            ></tables>
          </Col>
        </Row>
    </Card>
  </div>
</template>
<script>
import Tables from '_c/tables'
import { getUserId } from '@/libs/util'
import { getLastWeekStartDate, getLastWeekEndDate, getWeekStartDate, getWeekEndDate, getLastMonthStartDate, getLastMonthEndDate, getMonthStartDate, getMonthEndDate, getQuarterStartDate, getQuarterEndDate, getLastQuarterStartDate, getLastQuarterEndDate, getCurrentYear, getLastYear } from '@/libs/mdate.js'
import echarts from 'echarts'
import tdTheme from './theme.json'
import { materialCategoryLend, consumablesMargin, materialOccupy, projectMaterialCount, listProject, listTask, materialCategory, materialList } from '@/api/data'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'MaterialStatistics',
  components: { Tables },
  data () {
    return {
      dom: null,
      active: 0,
      pieSearch: {
        projectId: '',
        taskId: ''
      },
      oneSearch: {
        page: 0,
        pageSize: 10,
        projectId: '',
        taskId: '',
        materialCategoryId: ''
      },
      twoSearch: {
        userId: '',
        startTime: '',
        endTime: '',
        page: 0,
        pageSize: 10,
        materialId: '',
        materialCategoryId: ''
      },
      threeSearch: {
        userId: '',
        page: 0,
        pageSize: 10
      },
      tableData1: [],
      tableData2: [],
      tableData3: [],
      PieData: [],
      listTask: [],
      projectList: [],
      listProjectMaterial: [],
      materialCategory: [],
      columns1: [
        {
          type: 'index',
          width: 60,
          title: '序号'
        },
        { title: '项目名称', key: 'projectName' },
        { title: '任务名称', key: 'taskName' },
        { title: '物资名称', key: 'name' },
        { title: '占用数量', key: 'count' }
      ],
      columns2: [
        {
          type: 'index',
          width: 60,
          title: '序号'
        },
        { title: '项目名称', key: 'name' },
        { title: '使用量', key: 'taskUsingCount' },
        { title: '剩余量', key: 'projectSurplusCount' }
      ],
      columns3: [
        {
          type: 'index',
          width: 60,
          title: '序号'
        },
        { title: '消耗品名称', key: 'name' },
        { title: '剩余数量', key: 'surplusAmount' },
        { title: '保有余量', key: 'retainedMargin' }
      ]
    }
  },
  created () {
    this.twoSearch.userId = getUserId()
    this.threeSearch.userId = getUserId()
    this.MaterialCategory()
    this.ListProject()
    this.ListTask()
    this.PieInterface()
    this.oneInterface()
    this.twoInterface()
    this.threeInterface()
  },
  mounted () {
    this.PieInterface(() => {
      this.PieData.forEach((item, index) => {
        this.setPie(item, index)
      })
    })
  },
  methods: {
    lastMonthSlot () {
      this.twoSearch.startTime = getLastMonthStartDate()
      this.twoSearch.endTime = getLastMonthEndDate()
      this.twoInterface()
    },
    nowMonthSlot () {
      this.twoSearch.startTime = getMonthStartDate()
      this.twoSearch.endTime = getMonthEndDate()
      this.twoInterface()
    },
    lastSeasonSlot () {
      this.twoSearch.startTime = getLastQuarterStartDate()
      this.twoSearch.endTime = getLastQuarterEndDate()
      this.twoInterface()
    },
    nowSeasonSlot () {
      this.twoSearch.startTime = getQuarterStartDate()
      this.twoSearch.endTime = getQuarterEndDate()
      this.twoInterface()
    },
    lastYearSlot () {
      this.twoSearch.startTime = getLastYear().startTime
      this.twoSearch.endTime = getLastYear().endTime
      this.twoInterface()
    },
    nowYearSlot () {
      this.twoSearch.startTime = getCurrentYear().startTime
      this.twoSearch.endTime = getCurrentYear().endTime
      this.twoInterface()
    },
    lastWeekSlot () {
      this.twoSearch.startTime = getLastWeekStartDate()
      this.twoSearch.endTime = getLastWeekEndDate()
      this.twoInterface()
    },
    nowWeekSlot () {
      this.twoSearch.startTime = getWeekStartDate()
      this.twoSearch.endTime = getWeekEndDate()
      this.twoInterface()
    },
    PieInterface (func) {
      let _this = this
      materialCategoryLend(_this.pieSearch).then((res) => {
        if (res.data.status === '200') {
          _this.PieData = res.data.data
          if (func && typeof func === 'function') {
            func()
          }
        }
      })
    },
    oneInterface () {
      let _this = this
      _this.tableData1 = []
      materialOccupy(_this.oneSearch).then((res) => {
        if (res.data.status === '200') {
          _this.tableData1 = res.data.data
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    },
    twoInterface () {
      let _this = this
      _this.tableData2 = []
      projectMaterialCount(_this.twoSearch).then((res) => {
        if (res.data.status === '200') {
          _this.tableData2 = res.data.data
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    },
    threeInterface () {
      let _this = this
      consumablesMargin(_this.threeSearch).then((res) => {
        if (res.data.status === '200') {
          _this.tableData3 = res.data.data
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    },
    selTimeTwo () {},
    changeTime (val) {
      this.Search.startTime = val[0]
      this.Search.endTime = val[1]
    },
    pageChange1 (val) {
      this.oneSearch.page = val
      this.oneInterface()
    },
    pageSizeChange1 (val) {
      this.oneSearch.pageSize = val
      this.oneInterface()
    },
    pageChange2 (val) {
      this.twoSearch.page = val
      this.twoInterface()
    },
    pageSizeChange2 (val) {
      this.twoSearch.pageSize = val
      this.twoInterface()
    },
    pageChange3 (val) {
      this.threeSearch.page = val
      this.threeInterface()
    },
    pageSizeChange3 (val) {
      this.threeSearch.pageSize = val
      this.threeInterface()
    },
    ListProject () {
      let _this = this
      let params = {
        page: 0,
        pageSize: 5000,
        userId: getUserId()
      }
      listProject(params).then((res) => {
        if (res.data.status === '200') {
          _this.projectList = res.data.data.projectList.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    },
    ListTask () {
      let _this = this
      let params = {
        page: 0,
        pageSize: 5000,
        userId: getUserId()
      }
      _this.listTask = []
      listTask(params).then((res) => {
        if (res.data.status === '200') {
          _this.listTask = res.data.data.taskDetailBeans.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    },
    projectSel (val) {
      this.PieInterface()
    },
    taskSel (val) {
      this.PieInterface()
    },
    Percentage (num1, num2) {
      // 计算百分比
      return (
        isNaN(Math.round((parseFloat(num1) / parseFloat(num2)) * 10000) / 100.0) ? '0%' : Math.round((parseFloat(num1) / parseFloat(num2)) * 10000) / 100.0 === Infinity ? '100%' : Math.round((parseFloat(num1) / parseFloat(num2)) * 10000) / 100.0 + '%'
      )
    },
    selType (id, ind) {
      this.active = ind
      this.oneSearch.materialCategoryId = id
      this.twoSearch.materialCategoryId = id
      this.oneInterface()
      this.twoInterface()
    },
    setPie (data, index) {
      let option = {
        graphic: [
          {
            // 环形图中间添加文字
            type: 'text', // 通过不同top值可以设置上下显示
            left: '30%',
            top: '50%',
            style: {
              text: this.Percentage(data.lendCount, data.lendCountAll),
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
          formatter: '<br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['40px', '60px'],
            center: ['42%', '54%'],
            label: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: data.lendCountAll - data.lendCount,
                name: '未支出数'
              },
              {
                value: data.lendCount,
                name: '占有支出数'
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
                    '#cccccc',
                    '#975fe4'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom[index], 'tdTheme')
      this.dom.setOption(option)
    },
    MaterialCategory () {
      let _this = this
      _this.materialCategory = []
      materialCategory().then((res) => {
        if (res.data.status === '200') {
          _this.materialCategory = res.data.data.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
      })
    },
    ListProjectMaterial (id) {
      let _this = this
      let params = {
        userId: getUserId(),
        page: 0,
        pageSize: 5000,
        materialCategoryId: id
      }
      _this.listProjectMaterial = []
      materialList(params).then((res) => {
        if (res.data.status === '200') {
          _this.listProjectMaterial = res.data.data.businessMaterialBeanList.map((ele) => {
            return {
              value: ele.id,
              label: ele.name
            }
          })
        }
      })
    },
    materialCategorySel (val) {
      this.ListProjectMaterial(val)
    },
    ProjectMaterialSel (val) {
      this.twoSearch.materialId = val
      this.twoInterface()
    }
  }
}
</script>
<style lang="less" scoped>
  .borBot{
    border-bottom: 2px solid #2d8cf0;
  }
  .ivu-menu-horizontal{
    height: auto;
    line-height: auto;
  }
  body{
    color: #333;
  }
  .MaterialStatistics {
    padding: 20px;
    background-color: #fff;
  }
  .m-slider{
    box-sizing: border-box;
    width: 100%;
    height: 200px;
    padding: 15px;
    // &::-webkit-scrollbar { width:0; height:0; display: none; }
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    background-color: #fff8f8;
    .slider-con{
      background-color: #fff8f8;
    }
    .con-item{
      margin-left: 1.2%;
      padding: 10px;
      background-color: #fff;
      display: inline-block;
      width: 24%;
      min-width: 200px;
      height: 170px;
      &:first-child{
        margin-left: 0.4%;
      }
      .item-l{
        padding: 10px;
        width: 40%;
        height: 100%;
        float: left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title{
          color: #000;
          font-size: 16px;
        }
        .pay{
          margin-top: 20px;
          font-size: 12px;
          color: #ccc;
          .num{
            font-size: 34px;
            font-weight: bold;
            color: #333;
          }
        }
      }
      .item-r{
         width: 60%;
         height: 100%;
        float: left;
      }
    }
  }
  .Title{
    font-size: 16px;
    font-weight: bold;
    color: #000;
    padding: 10px;
  }
</style>
