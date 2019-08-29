<template>
  <div>
    <Row type="flex" justify="space-between" style="padding: 0; background: #fff; margin-bottom:20px;">
      <Col >
        <Menu mode="horizontal" theme="light" :active-name="activeTime" @on-select="selMenu">
            <MenuItem name="0">全部</MenuItem>
            <MenuItem name="1">本周</MenuItem>
            <MenuItem name="2">上周</MenuItem>
            <MenuItem name="3">本月</MenuItem>
            <MenuItem name="4">上月</MenuItem>
            <MenuItem name="6">自定义</MenuItem>
        </Menu>
      </Col>
      <Col span="15">
        <div v-if="activeTime == '6'" style="display:inline-block;">
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
          <Button type="primary" style="margin-left:10px;" class="search-btn" icon="ios-funnel" @click="openFilter"><Icon type="search"/>筛选</Button>
      </Col>
    </Row>
    <div slot="filterPanel" class="filterPanel" v-if="filterPanel">
      <Card :bordered="false">
        <Row>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">项目:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.projectId" placeholder="请选择" label-in-value>
                      <Option v-for="(item, key) in projectList" :key="key" :value="item.value">{{item.label}}</Option>
                  </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">任务:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.taskId" placeholder="请选择" label-in-value>
                      <Option v-for="(item, key) in listTask" :key="key" :value="item.value">{{item.label}}</Option>
                  </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">登记人员:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.userId" placeholder="请选择" label-in-value>
                      <Option v-for="(item, key) in userList" :key="key" :value="item.value">{{item.label}}</Option>
                  </Select>
              </Col>
            </Row>
          </Col>
          <Col span="24">
            <div class="btns">
              <Button type="primary" @click="filterSubmit">确定</Button>
              <Button @click="filterReset">重置</Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
    <tables ref="tableDaily" :loading="tableLoading"  @on-row-dblclick="onRowClick" :total="total" v-model="tableData" :columns="columns" :on-change="pageChange" :on-page-size-change="pageSizeChange" @on-select="onSelect"></tables>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getLastWeekStartDate, getLastWeekEndDate, getWeekStartDate, getWeekEndDate, getLastMonthStartDate, getLastMonthEndDate, getMonthStartDate, getMonthEndDate } from '@/libs/mdate.js'
import { dailyList, listProject, listTask, getUserList } from '@/api/data'
import { getUserId } from '@/libs/util'
export default {
  name: 'dailyList',
  components: { Tables },
  data () {
    return {
      tableLoading: false,
      myDate: '',
      activeTime: '0',
      projectList: [],
      listTask: [],
      userList: [],
      filterPanel: false,
      idList: [],
      rowId: [],
      total: 0,
      tableData: [],
      params: {
        pageSize: 10,
        page: 1,
        from: '2', // 日报审阅
        userId: '',
        type: '',
        startDate: '',
        endDate: '',
        currentDate: '',
        projectId: '',
        taskId: ''
      },
      columns: [
        {
          type: 'index',
          width: 80,
          title: '序号'
        },
        { title: '日期', key: 'reportDate', width: 120 },
        { title: '项目名称', key: 'projectName' },
        { title: '任务名称', key: 'taskName' },
        { title: '登记人员', key: 'userName', width: 120 },
        { title: '时长', key: 'workingHours', width: 120 },
        { title: '工作内容', key: 'workingContent' }
      ]
    }
  },
  created () {
    if (getUserId()) {
      this.params.userId = getUserId()
    }
    this.getData()
    this.ListProject()
    this.ListTask()
    this.GetUserList()
  },
  methods: {
    onRowClick () {
      console.log(arguments)
      this.$router.push(
        {
          path: 'dailyDetail',
          query: { id: arguments[0].id }
        })
    },
    curTime (val) {
      this.params.currentDate = val
    },
    changeTime (val) {
      this.params.startDate = val[0]
      this.params.endData = val[1]
    },
    selTimeTwo () {
      this.getData()
    },
    selMenu (val) {
      this.activeTime = val
      this.params.type = val
      if (val !== 6) { // 非自定义时间
        this.getData()
      }
    },
    pageSizeChange (val) {
      this.params.pageSize = val
      this.getData()
    },
    GetUserList (func) {
      let _this = this
      let params = {
        page: 1,
        pageSize: 5000
      }
      getUserList(params).then((res) => {
        if (res.data.status === '200') {
          _this.userList = res.data.data.list.map((item) => {
            return { value: item.id, label: item.name }
          })
          if (func && typeof func === 'function') {
            func()
          }
        }
      })
    },
    getData () { // 列表
      let _this = this
      _this.tableLoading = true
      dailyList(_this.params).then((res) => {
        _this.tableLoading = false
        if (res.data.status === '200') {
          _this.tableData = res.data.data.list
          _this.total = res.data.data.total
        }
      })
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
    // 筛选提交
    filterSubmit () {
      if (this.params.userId) {
        this.filterPanel = false
        this.getData()
      } else {
        this.$Message.warning('请选择登记人员！')
      }
    },
    // 筛选重置
    filterReset () {
      this.params.projectId = ''
      this.params.userId = ''
      this.params.taskId = ''
    },
    openFilter () {
      this.filterPanel = !this.filterPanel
    },
    pageChange (val) {
      this.params.page = val
      this.getData()
    },
    onSelect (sel, row) {
      this.idList = sel.map((item) => {
        return item.id
      })
    },
    Add () {
      this.$router.push('materialAdd')
    },
    handleSearch () {
      this.getData()
    },
    lastMonthSlot () {
      this.params.startDate = getLastMonthStartDate()
      this.params.endData = getLastMonthEndDate()
      this.getData()
    },
    nowMonthSlot () {
      this.params.startDate = getMonthStartDate()
      this.params.endData = getMonthEndDate()
      this.getData()
    },
    lastWeekSlot () {
      this.params.startDate = getLastWeekStartDate()
      this.params.endData = getLastWeekEndDate()
      this.getData()
    },
    nowWeekSlot () {
      this.params.startDate = getWeekStartDate()
      this.params.endData = getWeekEndDate()
      this.getData()
    }
  }
}
</script>

<style scoped lang="less">
  .searchInput{
    float: left;
    /deep/ .search-btn{
      height: 32px;
    }
  }
  .search{
    float: left;
    margin-right: 10px;
    /deep/ .ivu-input-group-prepend{
      background: none;
      border: 0 none;
    }
    /deep/ .ivu-input-search{
      border: 0 none;
    }
    /deep/ .ivu-input-search:before{
      content: none
    }
    .search-btn{
      float: right;
    }
  }
  .filterPanel{
    clear: both;
    padding: 0 0 10px 0;
    .label{
      display: block;
      text-align: right;
      padding-right: 10px;
      line-height: 32px;
    }
    .btns{
      text-align: center;
      .ivu-btn-primary{
        margin-right: 10px;
      }
      .ivu-btn{
        width: 80px;
      }
    }
  }
  .ivu-row-flex-space-between{
    align-items: center;
  }
</style>
