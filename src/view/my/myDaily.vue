<template>
  <div>
    <div class="pageHeader">
      <Button type="primary" @click="openFilter">筛选</Button>
      <div class="switchMonth">
        <img src="../../assets/images/leftBtn.png" @click="prevMonth">
        <div>{{title}}</div>
        <img src="../../assets/images/rightBtn.png" @click="nextMonth">
      </div>
      <div>
        <Button type="primary" @click="toList" style="margin-right: 10px">全部99+</Button>
        <Button @click="addInit">新增日报</Button>
      </div>
    </div>
    <Card v-show="filter === true" style="margin-bottom: 10px">
      <div class="filter" style="display: flex; justify-content: space-between;">
        <div>
          <span style="margin-right: 60px">
            项目：
            <Select v-model="projectId" style="width:200px" @on-change="changeProject">
              <Option v-for="(item, index) in projectList" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
          </span>
          <span>
            任务：
            <Select v-model="taskId" style="width:200px">
              <Option v-for="item in taskList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </span>
        </div>
        <div>
          <Button type="primary" @click="filterSave" style="margin-right: 10px">确定</Button>
          <Button @click="clearFilter">重置</Button>
        </div>
      </div>
    </Card>
    <Card>
      <div class="calendar">
        <div class="e-calendar-week">
          <span class="e-calendar-week-day">周一</span>
          <span class="e-calendar-week-day">周二</span>
          <span class="e-calendar-week-day">周三</span>
          <span class="e-calendar-week-day">周四</span>
          <span class="e-calendar-week-day">周五</span>
          <span class="e-calendar-week-day">周六</span>
          <span class="e-calendar-week-day">周日</span>
        </div>
        <div class="e-calendar-monthday">
          <div class="e-calendar-monthday-wrapper">
            <div class="e-calendar-monthday-row" v-for="(row, index) in rows" :key="index" >
                <span v-for="(day,index) in row" :key="index" class="e-calendar-monthday-row-day" :class="{'active': day.selected, 'disabled': day.disabled, 'pointer': day.value !== ''}">
                  <span v-text="day.value" class="e-calendar-monthday-row-day-value"></span>
                  <div style="text-align: left">
                    <div v-for="(d,i) in day.daily" :key="d.id" v-if="i<2" @click="openDetail(d)" style="background-color: #e6e6e6; margin-bottom: 6px; padding: 2px 7px;cursor: pointer">
                      <span style="margin-right: 5px; color: #2E8CEB">{{d.workingHours}}h</span>
                      <span>{{d.workingContent.length > 8 ? d.workingContent.slice(0,9) +  '...' : d.workingContent}}</span>
                    </div>
                    <div v-else-if="i===2" style="text-align: right;">
                      <Button size="small" type="primary" @click="more(day.daily)">更多...</Button>
                    </div>
                  </div>
                </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
    <Modal
      v-model="add"
      width="1500px"
      @on-ok="addSave"
      title="新增日报">
      <div class="tableWrapper">
        <tables ref="tables"  v-model="tableData" :columns="columns" @on-add="addRow" @on-remove="delRow" :showPage="false"></tables>
      </div>
    </Modal>
    <Modal
      v-model="moreList"
      title="我的日报">
      <div v-for="d in dailyArr" :key="d.id" @click="openDetail(d)" style="background-color: #e6e6e6; margin-bottom: 6px; padding: 2px 7px;cursor: pointer">
        <span style="margin-right: 5px; color: #2E8CEB">{{d.workingHours}}h</span>
        <span>{{d.workingContent.length > 8 ? d.workingContent.slice(0,9) +  '...' : d.workingContent}}</span>
      </div>
    </Modal>
    <Modal
      v-model="edit"
      @on-ok="saveEdit"
      title="编辑日报">
      <Form ref="formValidate" :model="detailData" :rules="ruleValidate" :label-width="80">
        <FormItem prop="userName" label="登记人">
          {{detailData.userName}}
        </FormItem>
        <FormItem prop="projectName" label="选择项目">
          <Select v-model="detailData.projectId" @on-change="getListTask(2, detailData.projectId)">
            <Option v-for="(item, index) in projectList" :value="item.id" :labek="item.name" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="taskName" label="选择任务">
          <Select v-model="detailData.taskId">
            <Option v-for="item in taskList" :value="item.id" :labek="item.name" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="reportDate" label="日报日期">
          <DatePicker type="date" @on-change="changetDate" :value="detailData.reportDate"></DatePicker>
        </FormItem>
        <FormItem prop="workingHours" label="工作用时">
          <InputNumber :min="1" v-model="detailData.workingHours"></InputNumber>
        </FormItem>
        <FormItem prop="workingContent" label="工作内容">
          <Input v-model="detailData.workingContent" />
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="detail"
      title="日报详情">
      <p style="font-weight: bold; margin-bottom: 10px">日报详情</p>
      <div style="margin-left: 10px; line-height: 30px">
        <p>
          <span style="color: #000">项目名称:</span>
          {{detailData.projectName}}
        </p>
        <p>
          <span style="color: #000">任务名称: </span>
          {{detailData.taskName}}
        </p>
        <p>
          <span style="color: #000">登记人员: </span>
          {{detailData.userName}}
        </p>
        <p style=" display: flex;">
          <span style="flex: 1">
            <span style="color: #000">工作时长: </span>
            {{detailData.workingHours}}
          </span>
          <span style="flex: 1">
            <span style="color: #000">日报日期: </span>
            {{detailData.reportDate}}
          </span>
        </p>
        <p>
          <span style="color: #000">工作内容: </span>
          {{detailData.workingContent}}
        </p>
      </div>
      <div slot="footer">
        <Button type="error" @click="delDaily(detailData.id)">删除</Button>
        <Button type="primary" @click="editDaily">编辑</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { listProject, listTask, createDaily, dailyList, deleteDaily, updateDaily } from '@/api/data'
import { getUserId } from '@/libs/util'
const monthJson = {
  1: '一月',
  2: '二月',
  3: '三月',
  4: '四月',
  5: '五月',
  6: '六月',
  7: '七月',
  8: '八月',
  9: '九月',
  10: '十月',
  11: '十一月',
  12: '十二月'
}
export default {
  name: 'myDaily',
  components: { Tables },
  data () {
    return {
      filter: false,
      edit: false,
      moreList: false,
      detail: false,
      detailData: {},
      dailyArr: [],
      dailyList: {},
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      ruleValidate: {
        projectName: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        taskName: [
          { required: true, message: '请选择任务', trigger: 'change' }
        ],
        reportDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        workingHours: [
          { required: true, type: 'number', message: '请设置工时', trigger: 'blur' }
        ],
        workingContent: [
          { required: true, message: '请填写工作内容', trigger: 'blur' }
        ]
      },
      myName: 'chen',
      projectId: '',
      taskId: '',
      workingHours: 0,
      reportDate: '',
      workingContent: '',
      taskList: [],
      projectList: [],
      rowIndex: 0,
      addRows: [
        {
          taskList: [],
          projectList: [],
          projectId: '',
          taskId: '',
          workingHours: 0,
          reportDate: '',
          workingContent: ''
        }
      ],
      add: false,
      tableData: [],
      today: '',
      columns: [
        { title: '项目名称',
          key: 'pname',
          width: '250px',
          render: (h, params) => {
            return h('Select', {
              props: {
                value: this.addRows[params.index].projectId
              },
              on: {
                'on-change': (id) => {
                  this.addRows[params.index].projectId = id
                  this.addRows[params.index].taskList = []
                  this.addRows[params.index].taskId = ''
                  this.getListTask(1, id, params.index)
                }
              }
            }, params.row.pname.map((item) => {
              return h('Option', {
                props: {
                  value: item.id
                }
              }, item.name)
            }))
          }
        },
        { title: '任务名称',
          key: 'tname',
          width: '250px',
          render: (h, params) => {
            return h('Select', {
              props: {
                value: this.addRows[params.index].taskId
              },
              on: {
                'on-change': (id) => {
                  this.addRows[params.index].taskId = id
                }
              }
            }, params.row.tname.map((item) => {
              return h('Option', {
                props: {
                  value: item.id
                }
              }, item.name)
            }))
          }
        },
        { title: '工时',
          key: 'num',
          width: '100px',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                value: this.addRows[params.index].workingHours,
                min: 1
              },
              on: {
                'on-change': (num) => {
                  this.addRows[params.index].workingHours = num
                }
              }
            })
          }
        },
        { title: '日期',
          key: 'date',
          width: '200px',
          render: (h, params) => {
            return h('DatePicker', {
              props: {
                value: this.addRows[params.index].reportDate,
                options: this.options
              },
              on: {
                'on-change': (date) => {
                  this.addRows[params.index].reportDate = date
                }
              }
            })
          }
        },
        { title: '工作内容',
          key: 'job',
          width: '500px',
          render: (h, params) => {
            return h('Input', {
              props: {
                value: this.addRows[params.index].workingContent
              },
              on: {
                'on-change': (e) => {
                  this.addRows[params.index].workingContent = e.target.value
                }
              }
            })
          }
        },
        {
          title: '操作',
          key: 'handle',
          options: ['add', 'remove']
        }
      ],
      showDate: {
        year: '',
        month: '',
        day: '',
        week: '',
        date: '',
        monthStr: ''
      },
      selectDate: {
        year: '',
        month: '',
        day: '',
        week: '',
        date: '',
        monthStr: ''
      },
      copyMinDate: {
        year: '',
        month: '',
        day: ''
      },
      copyMaxDate: {
        year: '',
        month: '',
        day: ''
      },
      timestamp: new Date().getTime()
    }
  },
  computed: {
    title () {
      return this.showDate.year + '年' + (this.showDate.month > 9 ? this.showDate.month + '月' : '0' + this.showDate.month + '月')
    },
    rows () {
      const timestamp = this.timestamp
      const { year, month } = this.showDate
      const months = (new Date(year, month, 0)).getDate()
      const result = []
      let row = []
      let arrs = [year, month, '01']
      var weeks = new Date(arrs[0], parseInt(arrs[1] - 1), arrs[2])
      let week = weeks.getDay()
      let day = 0
      for (let i = 1; i <= 42; i += 1) {
        if (i < week) {
          this.addRowEmptyValue(row)
        } else {
          if (day === months) {
            this.addRowEmptyValue(row)
          } else {
            this.addRowDayValue(row, ++day)
          }
        }
        if (i % 7 === 0) {
          result.push(row)
          row = []
        }
      }
      console.log(timestamp)
      return result
    }
  },
  watch: {
    showDate: {
      handler (val) {
        this.getDailyList(val.year, val.month)
      },
      deep: true
    },
    detailData: {
      handler (val) {
        console.log(val)
      },
      deep: true
    }
  },
  methods: {
    toList () {
      this.$router.push({
        name: 'myDailyList'
      })
    },
    clearFilter () {
      this.projectId = ''
      this.taskList = []
      this.taskId = ''
    },
    filterSave () {
      this.getDailyList(this.showDate.year, this.showDate.month)
    },
    changeProject () {
      this.taskId = ''
      this.getListTask(2, arguments[0])
    },
    openFilter () {
      this.filter = !this.filter
    },
    changetDate () {
      this.detailData.reportDate = arguments[0]
    },
    saveEdit () {
      updateDaily({
        id: this.detailData.id,
        projectId: this.detailData.projectId,
        taskId: this.detailData.taskId,
        workingHours: this.detailData.workingHours,
        reportDate: this.detailData.reportDate,
        workingContent: this.detailData.workingContent,
        userId: getUserId()
      }).then((res) => {
        if (res.data.status === '200') {
          this.$Message.info(res.data.msg)
          this.getDailyList(this.showDate.year, this.showDate.month)
          this.edit = false
        } else {
          this.$Message.info(res.data.msg)
        }
      })
    },
    editDaily () {
      this.getListTask(2, this.detailData.projectId)
      this.edit = true
    },
    delDaily () {
      deleteDaily({
        ids: [this.detailData.id],
        userId: getUserId()
      }).then((res) => {
        if (res.data.status === '200') {
          this.$Message.info(res.data.msg)
          this.getDailyList(this.showDate.year, this.showDate.month)
          this.detail = false
        } else {
          this.$Message.info(res.data.msg)
        }
      })
    },
    more (arr) {
      this.dailyArr = arr
      this.moreList = true
    },
    openDetail (d) {
      console.log(d)
      console.log(typeof d.reportDate)
      this.detailData = {
        id: d.id,
        projectName: d.projectName,
        projectId: d.projectId,
        taskName: d.taskName,
        taskId: d.taskId,
        userName: d.userName,
        workingHours: d.workingHours,
        reportDate: d.reportDate,
        workingContent: d.workingContent
      }
      console.log(this.detailData)
      this.detail = true
    },
    addSave () {
      let params = []
      this.addRows.forEach((item) => {
        params.push({
          projectId: item.projectId,
          taskId: item.taskId,
          workingHours: item.workingHours,
          reportDate: item.reportDate,
          workingContent: item.workingContent,
          userId: getUserId()
        })
      })
      createDaily(params).then((res) => {
        if (res.data.status === '200') {
          this.$Message.info(res.data.msg)
          this.getDailyList(this.showDate.year, this.showDate.month)
          this.add = false
        } else {
          this.$Message.info(res.data.msg)
        }
      })
    },
    delRow () {
      this.addRows.splice(arguments[0].index, 1)
      this.tableData.splice(arguments[0].index, 1)
      this.rowIndex = arguments[0].index - 1
    },
    addRow () {
      this.rowIndex = arguments[0].index + 1
      this.addRows.push({
        taskList: [],
        projectList: this.addRows[0].projectList,
        projectId: '',
        taskId: '',
        workingHours: 0,
        reportDate: '',
        workingContent: ''
      })
      this.tableData.push({
        pname: this.addRows[this.rowIndex].projectList,
        tname: this.addRows[this.rowIndex].taskList
      })
    },
    addInit () {
      this.tableData = [{
        pname: this.addRows[0].projectList,
        tname: this.addRows[0].taskList
      }]
      this.add = true
    },
    getListTask (type, id, index) {
      if (!id) return false
      listTask({
        pageSize: 100,
        page: 1,
        businessProjectId: id,
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
        switch (type) {
          case 1:
            this.addRows[index].taskList = res.data.data.taskDetailBeans
            this.tableData[index].tname = this.addRows[index].taskList
            break
          case 2:
            this.taskList = res.data.data.taskDetailBeans
            break
        }
      })
    },
    // getTask () {
    //   listTask({
    //     pageSize: 100,
    //     page: 1,
    //     businessProjectId: this.detailData.projectId,
    //     type: '',
    //     name: '',
    //     taskStatus: '',
    //     firstPartyScoring: '',
    //     userId: getUserId(),
    //     timeStatus: '',
    //     startTime: '',
    //     endTime: '',
    //     provinceName: '',
    //     cityName: '',
    //     districtName: ''
    //   }).then((res) => {
    //     this.taskList = res.data.data.taskDetailBeans
    //   })
    // },
    getListProject () {
      listProject({
        pageSize: 100,
        page: 1,
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
        this.addRows[this.rowIndex].projectList = res.data.data.projectList
        this.projectList = res.data.data.projectList
      })
    },
    // getProject () {
    //   listProject({
    //     pageSize: 100,
    //     page: 1,
    //     userId: getUserId(),
    //     projectName: '',
    //     firstPartyCompanyId: '',
    //     projectManagerId: '',
    //     status: '',
    //     firstPartyScoring: '',
    //     provinceName: '',
    //     cityName: '',
    //     districtName: '',
    //     timeStatus: '',
    //     startTime: '',
    //     endTime: ''
    //   }).then((res) => {
    //     this.projectList = res.data.data.projectList
    //   })
    // },
    prevMonth () {
      if (this.showDate.year === 1900 && this.showDate.month === 1) {
        return false
      }
      if (this.showDate.month === 1) {
        this.showDate.year--
        this.showDate.month = 12
      } else {
        this.showDate.month--
      }
    },
    nextMonth () {
      if (this.showDate.year === 2900 && this.showDate.month === 12) {
        return false
      }
      if (this.showDate.month === 12) {
        this.showDate.year++
        this.showDate.month = 1
      } else {
        this.showDate.month++
      }
    },
    initDatePicker () {
      this.showDate = { ...this.splitDate(this.today, true) }
      this.copyMinDate = { ...this.splitDate('1900-01-01') }
      this.copyMaxDate = { ...this.splitDate('2900-01-01') }
      this.selectDate = { ...this.showDate }
    },
    splitDate (date, addStr) {
      let result = {}
      const splitValue = date.split('-')
      try {
        if (!splitValue || splitValue.length < 3) {
          throw new Error('时间格式不正确')
        }
        result = {
          year: Number(splitValue[0]),
          month: Number(splitValue[1]),
          day: Number(splitValue[2])
        }
        if (addStr) {
          let arrs = [result.year, result.month, result.day]
          var weeks = new Date(arrs[0], parseInt(arrs[1] - 1), arrs[2])
          result.week = weeks.getDay()
          result.monthStr = monthJson[result.month]
        }
      } catch (error) {
        console.error(error)
      }
      return result
    },
    addRowEmptyValue (row) {
      row.push({
        value: ''
      })
    },
    addRowDayValue (row, i) {
      if (i < 10) {
        i = '0' + i
      }
      let value = {}
      if (this.dailyList[i]) {
        value = { value: i, daily: this.dailyList[i].data }
      } else {
        value = { value: i }
      }
      const { day, month, year } = this.selectDate
      const showDate = this.showDate
      // 判断已经选择的
      if (year === showDate.year && month === showDate.month && day === i) {
        value.selected = true
      }
      // 当日期在最小值之外，禁止点击
      if (this.isMinLimitMonth() && i < this.copyMinDate.day) {
        value.disabled = true
      }
      // 当日期在最大值之外，禁止点击
      if (this.isMaxLimitMonth() && i > this.copyMinDate.day) {
        value.disabled = true
      }
      row.push(value)
    },
    isMinLimitMonth () {
      return this.showDate.year <= this.copyMinDate.year && this.showDate.month <= this.copyMinDate.month
    },
    isMaxLimitMonth () {
      return this.showDate.year >= this.copyMaxDate.year && this.showDate.month >= this.copyMaxDate.month
    },
    getDailyList (year, month) {
      let startDate = (year + '-') + ((month > 10 ? month : '0' + month) + '-01')
      let endDate = (year + '-') + ((month > 10 ? month : '0' + month) + '-') + ('' + (new Date(year, month, 0)).getDate())
      this.dailyList = {}
      dailyList({
        pageSize: 300,
        page: 1,
        from: '1',
        type: '6',
        projectId: this.projectId,
        taskId: this.taskId,
        startDate: startDate,
        endDate: endDate,
        currentDate: '',
        userId: getUserId()
      }).then((res) => {
        let obj = {}
        if (res.data.data.list.length > 0) {
          console.log(res.data.data.list)
          res.data.data.list.reverse().forEach((item) => {
            if (!obj[item.reportDate]) {
              this.dailyList[item.reportDate.split('-')[2]] = {
                reportDate: item.reportDate.split('-')[2],
                data: [item]
              }
              obj[item.reportDate] = item
            } else {
              for (let i in this.dailyList) {
                if (this.dailyList[i].reportDate === item.reportDate.split('-')[2]) {
                  this.dailyList[i].data.push(item)
                  break
                }
              }
            }
          })
        } else {
          this.dailyList = {}
        }
        this.timestamp = new Date().getTime()
        console.log(this.dailyList)
      })
    }
  },
  created () {
    let d = new Date()
    this.today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    this.initDatePicker()
  },
  mounted () {
    this.getListProject()
  }
}
</script>

<style scoped lang="less">
  .tableWrapper{
    /deep/ .ivu-table-wrapper{
      overflow: inherit;
    }
  }
  .pageHeader{
    display: flex;
    justify-content: space-between;
    align-items: self-start;
    .switchMonth{
      display: flex;
      justify-content: center;
      margin-bottom: 15px;
      img{
        width: 40px;
        height: 40px;
      }
      img:hover{
        cursor: pointer;
      }
      div{
        width: 198px;
        height: 40px;
        font-size: 20px;
        font-weight: bold;
        color: #333333;
        line-height: 40px;
        text-align: center;
      }
    }
  }
  .calendar{
    width: 100%;
    .e-calendar-week{
      width: 100%;
      font-size: 12px;
      color: rgba(0,0,0,.87);
      opacity: .5;
      display: flex;
      justify-content: center;
      align-items: center;
      .e-calendar-week-day{
        flex: 1;
        text-align: right;
        padding: 20px;
      }
    }
    .e-calendar-monthday{
      font-size: 14px;
      position: relative;
      width: 100%;
      height: 780px;
      overflow: hidden;
      .e-calendar-monthday-wrapper{
        position: absolute;
        width: 100%;
        height: 100%;
        border-right: 1px solid #c3c3c3;
      }
      .e-calendar-monthday-row{
        display: flex;
        justify-content: center;
        align-items: center;
        .e-calendar-monthday-row-day{
          flex: 1;
          position: relative;
          border: 1px solid #c3c3c3;
          margin-right: -1px;
          margin-bottom: -1px;
          height: 130px;
          padding: 7px 20px;
          text-align: right;
          .e-calendar-monthday-row-day.pointer{
            cursor: pointer;
          }
          .e-calendar-monthday-row-day-value{
            position: relative;
            z-index: 1;
            margin-bottom: 3px;
            display: block;
          }
          .e-calendar-monthday-row-day.active{
            color: #ffffff;
          }
          .e-calendar-monthday-row-day.disabled{
            opacity: .4;
            cursor: not-allowed;
          }
        }
      }
    }
  }
</style>
