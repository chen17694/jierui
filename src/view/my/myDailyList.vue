<template>
  <div>
    <Row type="flex" justify="space-between" style="padding: 10px 0">
      <Col span="12">
        <ul class="dateRange">
          <li :class="{active: params.type === '' || params.type === '6'}" @click="dateRange('')">全部</li>
          <li :class="{active: params.type === '1'}" @click="dateRange('1')">本周</li>
          <li :class="{active: params.type === '2'}" @click="dateRange('2')">上周</li>
          <li :class="{active: params.type === '3'}" @click="dateRange('3')">本月</li>
          <li :class="{active: params.type === '4'}" @click="dateRange('4')">上月</li>
        </ul>
        <DatePicker type="date" @on-change="dataDate"/>
        <Button type="primary" @click="openFilter" style="margin-left: 20px">筛选</Button>
      </Col>
      <Col span="12">
        <div style="float: right;">
          <Dropdown @on-click="dropdownClick" style="margin-right: 10px">
            <Button type="primary" ghost>
              选择操作
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem name="批量删除">批量删除</DropdownItem>
              <DropdownItem name="取消">取消</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button type="success" @click="addInit">新增日报</Button>
        </div>
      </Col>
    </Row>
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
    <tables ref="tables" :total="this.total" v-model="tableData" :columns="columns" :on-change="this.pageChange" :on-page-size-change="this.PageSizeChange" @on-edit="onEdit" @on-selection-change="onSelectionChange"></tables>
    <Modal
      v-model="edit"
      @on-ok="saveEdit"
      title="编辑日报">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem prop="userName" label="登记人">
          {{formValidate.userName}}
        </FormItem>
        <FormItem prop="projectName" label="选择项目">
          <Select v-model="formValidate.projectId">
            <Option v-for="(item, index) in projectList" :value="item.id" :labek="item.name" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="taskName" label="选择任务">
          <Select v-model="formValidate.taskId">
            <Option v-for="item in taskList" :value="item.id" :labek="item.name" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="reportDate" label="日报日期">
          <DatePicker type="date" @on-change="changetDate" :value="formValidate.reportDate"></DatePicker>
        </FormItem>
        <FormItem prop="workingHours" label="工作用时">
          <InputNumber :min="1" v-model="formValidate.workingHours"></InputNumber>
        </FormItem>
        <FormItem prop="workingContent" label="工作内容">
          <Input v-model="formValidate.workingContent" />
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="add"
      width="1500px"
      @on-ok="addSave"
      title="新增日报">
      <div class="tableWrapper">
        <tables ref="addTable"  v-model="addTableData" :columns="addColumns" @on-add="addRow" @on-remove="delRow" :showPage="false"></tables>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { dailyList, listProject, listTask, updateDaily, createDaily, deleteDaily } from '@/api/data'

export default {
  name: 'myDailyList',
  components: { Tables },
  data () {
    return {
      rowId: [],
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
      addTableData: [],
      addColumns: [
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
                  console.log(id)
                  console.log(params.index)
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
          key: 'hour',
          width: '100px',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                value: this.addRows[params.index].workingHours,
                min: 1
              },
              on: {
                'on-change': (hour) => {
                  this.addRows[params.index].workingHours = hour
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
      add: false,
      projectId: '',
      taskId: '',
      filter: false,
      params: {
        pageSize: 10,
        page: 1,
        from: '1',
        type: '6',
        projectId: '',
        taskId: '',
        startDate: '',
        endDate: '',
        currentDate: '',
        userId: 'd3c6b26c272f4b0c96ec8f7a3062230b'
      },
      formValidate: {
        id: '',
        projectName: '',
        projectId: '',
        taskName: '',
        taskId: '',
        userName: '',
        workingHours: 0,
        reportDate: '',
        workingContent: ''
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
      taskList: [],
      projectList: [],
      edit: false,
      tableData: [],
      total: 0,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        { title: '日报日期', key: 'reportDate' },
        { title: '项目名称', key: 'projectName' },
        { title: '任务名称', key: 'taskName' },
        { title: '时长', key: 'workingHours' },
        { title: '工作内容', key: 'workingContent' },
        {
          title: '操作',
          key: 'handle',
          options: ['edit']
        }
      ]
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    // 选择
    onSelectionChange (row) {
      this.rowId = []
      row.forEach((item) => {
        this.rowId.push(item.id)
      })
    },
    // 批量删除
    dropdownClick (name) {
      this.rowId = this.rowId.map((item) => {
        return String(item)
      })
      if (name === '批量删除') {
        if (this.rowId.length > 0) {
          this.$Modal.confirm({
            title: '是否执行删除操作',
            content: '<p>删除后不能找回，还要继续吗</p>',
            onOk: () => {
              let params = {
                'ids': this.rowId,
                'userId': 'd3c6b26c272f4b0c96ec8f7a3062230b'
              }
              deleteDaily(params).then((res) => {
                if (res.data.status === '200') {
                  this.$Message.info('删除成功！')
                  this.getData()
                } else {
                  this.$Message.info('操作失败，请重试！')
                }
              })
            }
          })
        }
      }
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
          userId: 'd3c6b26c272f4b0c96ec8f7a3062230b'
        })
      })
      createDaily(params).then((res) => {
        if (res.data.status === '200') {
          this.$Message.info('操作成功！')
          this.getData()
          this.add = false
        } else {
          this.$Message.info('操作失败，请重试！')
        }
      })
    },
    addInit () {
      this.addTableData = [{
        pname: this.addRows[0].projectList,
        tname: this.addRows[0].taskList
      }]
      this.add = true
    },
    delRow () {
      this.addRows.splice(arguments[0].index, 1)
      this.addTableData.splice(arguments[0].index, 1)
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
      this.addTableData.push({
        pname: this.addRows[this.rowIndex].projectList,
        tname: this.addRows[this.rowIndex].taskList
      })
    },
    clearFilter () {
      this.projectId = ''
      this.taskList = []
      this.taskId = ''
    },
    filterSave () {
      this.params.projectId = this.projectId
      this.params.taskId = this.taskId
      this.getData()
    },
    openFilter () {
      this.filter = !this.filter
    },
    changeProject () {
      this.taskId = ''
      this.getListTask(2, arguments[0])
    },
    dataDate () {
      console.log(arguments)
      this.params.startDate = arguments[0]
      this.params.endDate = arguments[0]
      this.params.type = '6'
      this.getData()
    },
    dateRange (type) {
      this.params.type = type
      this.getData()
    },
    saveEdit () {
      updateDaily({
        id: this.formValidate.id,
        projectId: this.formValidate.projectId,
        taskId: this.formValidate.taskId,
        workingHours: this.formValidate.workingHours,
        reportDate: this.formValidate.reportDate,
        workingContent: this.formValidate.workingContent,
        userId: 'd3c6b26c272f4b0c96ec8f7a3062230b'
      }).then((res) => {
        console.log(res)
        if (res.data.status === '200') {
          this.$Message.info('操作成功！')
          this.getData()
          this.edit = false
        } else {
          this.$Message.info('操作失败，请重试！')
        }
      })
    },
    changetDate () {
      this.formValidate.reportDate = arguments[0]
    },
    onEdit () {
      console.log(arguments)
      // arguments[0].row
      this.formValidate = {
        id: arguments[0].row.id,
        projectName: arguments[0].row.projectName,
        projectId: arguments[0].row.projectId,
        taskName: arguments[0].row.taskName,
        taskId: arguments[0].row.taskId,
        userName: arguments[0].row.userName,
        workingHours: arguments[0].row.workingHours,
        reportDate: arguments[0].row.reportDate,
        workingContent: arguments[0].row.workingContent
      }
      this.getListTask(2, arguments[0].row.projectId)
      this.edit = true
    },
    pageChange (page) {
      this.params.page = page
      this.getData()
    },
    PageSizeChange (size) {
      this.params.pageSize = size
      this.getData()
    },
    getData () {
      dailyList(this.params).then((res) => {
        if (res.data.status === '200') {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    getListProject () {
      listProject({
        pageSize: 100,
        page: 1,
        userId: 'd3c6b26c272f4b0c96ec8f7a3062230b',
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
        userId: 'd3c6b26c272f4b0c96ec8f7a3062230b',
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
            this.addTableData[index].tname = this.addRows[index].taskList
            break
          case 2:
            this.taskList = res.data.data.taskDetailBeans
            break
        }
      })
    }
  },
  created () {
  },
  mounted () {
    this.getData()
    this.getListProject()
  }
}
</script>

<style scoped lang="less">
  .dateRange{
    list-style-type: none;
    margin-top: 6px;
    zoom: 1;
    float: left;
    li{
      float: left;
      cursor: pointer;
      margin-right: 20px;
      padding-bottom: 3px;
    }
    li.active{
      border-bottom: 2px solid #2E8CEB;
    }
  }
  .dateRange:after{
    content:"";/*设置内容为空*/
    height:0;/*高度为0*/
    line-height:0;/*行高为0*/
    display:block;/*将文本转为块级元素*/
    visibility:hidden;/*将元素隐藏*/
    clear:both;/*清除浮动*/
  }
  .tableWrapper{
    /deep/ .ivu-table-wrapper{
      overflow: inherit;
    }
  }
</style>
