<template>
  <div>
    <Row type="flex" justify="space-between" style="padding: 10px 0">
      <Col span="12">
        <div class="searchInput">
          <div class="search">
            <Input search @on-search="handleSearch" placeholder="输入关键字搜索" type="text" enter-button="搜索">
            <span slot="prepend">路口别名:</span>
            </Input>
          </div>
          <Button class="search-btn" type="primary" @click="openFilter"><Icon type="search"/>筛选</Button>
        </div>
      </Col>
      <Col span="12">
        <div style="float: right">
          <Button type="warning" style="margin-right: 10px" @click="reminder">任务路口提醒</Button>
          <Button type="success" @click="toAdd">新建任务路口</Button>
        </div>
      </Col>
    </Row>
    <div class="filterPanel" v-if="filter===true">
      <Card :bordered="false">
        <Row>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">项目:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.projectId" @on-change="projectChange">
                  <Option v-for="(item, index) in businessProject" :value="item.id " :key="index">{{item.name}}</Option>
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
                <Select v-model="params.taskId">
                  <Option v-for="(item, index) in taskList" :key="index" :value="item.id">{{item.name}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">任务路口状态:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.taskCrossingStatus">
                  <Option value="1">未领取</Option>
                  <Option value="2">已拒绝</Option>
                  <Option value="3">未开始</Option>
                  <Option value="4">进行中</Option>
                  <Option value="5">审核中</Option>
                  <Option value="6">已完成</Option>
                  <Option value="7">已驳回</Option>
                  <Option value="8">已撤销</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">甲方评分:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.firstPartyScoring">
                  <Option value="1">非常满意</Option>
                  <Option value="2">满意</Option>
                  <Option value="3">不满意</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="24">
            <div class="btns">
              <Button type="primary" @click="getData()">确定</Button>
              <Button @click="filterReset">重置</Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
    <tables ref="tables" :total="this.total" :columns="columns" v-model="tableData" :taskRoadListBtnVisible="true" @on-edit="onEdit"/>
  </div>
</template>

<script>
import { taskCrossingFunction, listProject, listTaskCrossing, listTask } from '@/api/data'
import { getUserId } from '@/libs/util'
import Tables from '_c/tables'
export default {
  name: 'projectManagement',
  components: { Tables },
  data () {
    return {
      params: {
        pageSize: 10,
        page: 1,
        projectId: '',
        taskId: '',
        userId: getUserId(),
        alias: '',
        taskCrossingStatus: '',
        timeStatus: '',
        startTime: '',
        endTime: '',
        provinceName: '',
        cityName: '',
        districtName: ''
      },
      columns: [
        { title: '项目名称', key: 'businessProjectName' },
        { title: '任务名称', key: 'businessTaskName' },
        { title: '路口别名', key: 'alias' },
        { title: '任务负责人', key: 'userName' },
        { title: '起始日期', key: 'startTime' },
        { title: '截止日期', key: 'completionTime' },
        { title: '路口状态', key: 'status' },
        { title: '逾期天数', key: 'overdueDays' },
        { title: '甲方评分', key: 'firstPartyScoring' },
        {
          title: '操作',
          slot: 'action3'
        }
      ],
      tableData: [],
      total: 0,
      filter: false,
      businessProject: [],
      taskList: []
    }
  },
  methods: {
    reminder () {
      this.$router.push({
        name: 'taskRoadReminder'
      })
    },
    getData () {
      listTaskCrossing(this.params).then((res) => {
        console.log(res.data.data)
        this.tableData = res.data.data.taskCrossingDetailBeanList
        this.total = Number(res.data.data.count)
      })
    },
    projectChange () {
      this.taskList = []
      this.params.taskId = ''
      listTask({
        pageSize: 0,
        page: 0,
        businessProjectId: arguments[0],
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
        console.log(res)
        this.taskList = res.data.data.taskDetailBeans
      })
    },
    filterReset () {
      this.params.firstPartyScoring = ''
      this.params.projectId = ''
      this.params.taskId = ''
      this.params.taskCrossingStatus = ''
    },
    openFilter () {
      this.filter = !this.filter
    },
    handleSearch (val) {
      this.params.alias = val
      this.getData()
    },
    toAdd () {
      this.$router.push({
        name: 'addTaskRoad'
      })
    },
    getProject () {
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
        startTime: '',
        endTime: ''
      }).then((res) => {
        this.businessProject = res.data.data.projectList
      })
    },
    onEdit (params, row) {
      console.log(arguments)
      let str = ''
      switch (params.permissionCode) {
        case '1':
          str = '确定要催办该任务路口吗？'
          break
        case '2':
          str = '确定提交审核吗？'
          break
        case '3':
          str = '确定删除该任务路口吗？'
          break
      }
      this.$Modal.confirm({
        title: str,
        onOk: () => {
          taskCrossingFunction({
            'taskCrossingId': row.id,
            'userId': getUserId(),
            'functionType': params.permissionCode
          }).then((res) => {
            this.$Message.info(res.data.msg)
            this.getData()
          })
        }
      })
    }
  },
  mounted () {
    this.getData()
    this.getProject()
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
</style>
