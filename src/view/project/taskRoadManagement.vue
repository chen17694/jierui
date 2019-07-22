<template>
  <div>
    <Row type="flex" justify="space-between" style="padding: 10px 0">
      <Col span="12">
        <div class="searchInput">
          <div class="search">
            <Input search @on-search="handleSearch" placeholder="输入关键字搜索" type="text" enter-button="搜索">
            <span slot="prepend">任务名称:</span>
            </Input>
          </div>
          <Button class="search-btn" type="primary" @click="openFilter"><Icon type="search"/>筛选</Button>
        </div>
      </Col>
      <Col span="12">
        <div style="float: right">
          <Button type="warning" style="margin-right: 10px" @click="reminder">任务提醒</Button>
          <Button type="success" @click="toAdd">新建任务</Button>
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
                <Select v-model="params.businessProjectId">
                  <Option v-for="(item, index) in businessProject" :value="item.id " :key="index">{{item.name}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">任务类型:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.type">
                  <Option value="1">调查任务</Option>
                  <Option value="2">优化任务</Option>
                  <Option value="3">宣传任务</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">任务状态:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.taskStatus">
                  <Option value="1">未领取</Option>
                  <Option value="2">已拒绝</Option>
                  <Option value="3">未开始</Option>
                  <Option value="4">进行中</Option>
                  <Option value="5">审核中</Option>
                  <Option value="6">已完成</Option>
                  <Option value="7">已驳回</Option>
                  <Option value="8">已撤销</Option>
                  <Option value="9">已暂停</Option>
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
    <tables ref="tables" :total="this.total" :columns="columns" v-model="tableData" :projectListBtnVisible="true" @on-edit="onEdit"/>
  </div>
</template>

<script>
import { listTask, projectFunction, listProject } from '@/api/data'
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
        userId: getUserId(),
        businessProjectId: '',
        type: '',
        name: '',
        taskStatus: '',
        firstPartyScoring: '',
        timeStatus: '',
        startTime: '',
        endTime: '',
        provinceName: '',
        cityName: '',
        districtName: ''
      },
      columns: [
        { title: '项目名称', key: 'businessProjectName' },
        { title: '任务名称', key: 'name' },
        { title: '任务类型', key: 'type' },
        { title: '任务负责人', key: 'taskHoldersName' },
        { title: '起始日期', key: 'startTime' },
        { title: '截止日期', key: 'completionTime' },
        { title: '任务性质', key: 'nature' },
        { title: '任务状态', key: 'taskStatus' },
        { title: '逾期天数', key: 'overdueDays' },
        { title: '甲方评分', key: 'firstPartyScoring' },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      tableData: [],
      total: 0,
      filter: false,
      businessProject: []
    }
  },
  methods: {
    reminder () {
      this.$router.push({
        name: 'taskReminder'
      })
    },
    getData () {
      listTask(this.params).then((res) => {
        console.log(res.data.data)
        this.tableData = res.data.data.taskDetailBeans
        this.total = Number(res.data.data.count)
      })
    },
    filterReset () {
      this.params.firstPartyScoring = ''
      this.params.businessProjectId = ''
      this.params.type = ''
      this.params.taskStatus = ''
    },
    openFilter () {
      this.filter = !this.filter
    },
    handleSearch (val) {
      this.params.name = val
      this.getData()
    },
    toAdd () {
      this.$router.push({
        name: 'addTask'
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
      if (params.permissionCode === '2' || params.permissionCode === '3') {
        this.$Modal.confirm({
          title: params.permissionCode === '2' ? '确定要' + (row.pauseStatus === '0' ? '暂停' : '开始') + '该项目吗？' : '确定要申请' + (row.pauseStatus === '0' ? '暂停' : '开始') + '该项目吗？',
          onOk: () => {
            projectFunction({
              'projectId': row.id,
              'userId': getUserId(),
              'functionType': params.permissionCode,
              'pauseStatus': row.pauseStatus === '0' ? '1' : '0'
            }).then((res) => {
              if (res.data.status === '200') {
                this.$Message.info('操作成功！')
                this.getData()
              } else {
                this.$Message.info('操作失败，请重试！')
              }
            })
          }
        })
      } else {
        let str = ''
        switch (params.permissionCode) {
          case '1':
            str = '确定要开始该项目吗？'
            break
          case '4':
            str = '确定要撤销该项目吗？'
            break
          case '5':
            str = '确定要申请撤销该项目吗？'
            break
          case '6':
            str = '确定要催办该项目吗？'
            break
          case '7':
            str = '确定要将该项目提交审核吗？'
            break
          case '8':
            str = '确定要删除该项目吗？'
            break
          case '9':
            str = '确定要为该项目创建新的任务吗？'
            break
        }
        this.$Modal.confirm({
          title: str,
          onOk: () => {
            projectFunction({
              'projectId': row.id,
              'userId': getUserId(),
              'functionType': params.permissionCode
            }).then((res) => {
              console.log(res)
              if (res.data.status === '200') {
                this.$Message.info('操作成功！')
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
