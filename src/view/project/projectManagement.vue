<template>
  <div>
    <Row type="flex" justify="space-between" style="padding: 10px 0 20px">
      <Col span="12">
        <div class="searchInput">
          <div class="search">
            <Input search @on-search="handleSearch" placeholder="输入关键字搜索" type="text" enter-button="搜索">
            <span slot="prepend">项目名称:</span>
            </Input>
          </div>
          <Button class="search-btn" icon="ios-funnel-outline" @click="openFilter"><Icon type="search"/>筛选</Button>
        </div>
      </Col>
      <Col span="12">
        <div style="float: right">
          <Button type="warning" style="margin-right: 10px" @click="reminder" v-if="branchBusinessManager === '1'">项目提醒</Button>
          <Button type="success" @click="toAdd" v-if="creatProjectPermission === '0'">新建项目</Button>
        </div>
      </Col>
    </Row>
    <div class="filterPanel" v-if="filter===true">
      <Card :bordered="false">
        <Row>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">甲方公司:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.firstPartyCompanyId" filterable clearable>
                  <Option v-for="(item, index) in firstPartyCompany" :value="item.id " :key="index">{{item.name}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">项目经理:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.projectManagerId" filterable clearable>
                  <Option v-for="(item, index) in projectManager" :value="item.id " :key="index">{{item.name}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">项目状态:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.status" clearable>
                  <Option value="1">未开始</Option>
                  <Option value="2">进行中</Option>
                  <Option value="3">审核中</Option>
                  <Option value="4">已完成</Option>
                  <Option value="5">已驳回</Option>
                  <Option value="6">已撤销</Option>
                  <Option value="7">已暂停</Option>
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
                <Select v-model="params.firstPartyScoring" clearable>
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
    <tables ref="tables" :total="this.total" @on-row-dblclick="onRowClick" :columns="columns" v-model="tableData" :projectListBtnVisible="true" @on-edit="onEdit" :on-change="pageChange" :on-page-size-change="pageSizeChange"/>
    <Modal
      v-model="statusModel"
      title="项目状态修改申请">
      <Form ref="formItemStatus" :model="formItemStatus" :rules="ruleCustom" :label-width="130">
        <FormItem label="项目名称：">
          <Row>
            <Col span="11">
              {{projectName}}
            </Col>
          </Row>
        </FormItem>
        <FormItem label="项目状态修改为：">
          <Row>
            <Col span="11">
              {{this.status}}
            </Col>
          </Row>
        </FormItem>
        <FormItem label="申请人员：">
          <Row>
            <Col span="11">
              {{userName}}
            </Col>
          </Row>
        </FormItem>
        <FormItem label="申请原因：" prop="content">
          <Row>
            <Col span="20">
              <Input v-model="formItemStatus.content" type="textarea" :autosize="{minRows: 3,maxRows: 5}" style="width: 100%"/>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="statusModel = false">取消</Button>
        <Button type="primary" size="large" @click="saveStatus">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { listProject, projectFunction, getUnitList, getUserList, getUserCount } from '@/api/data'
import { getUserId, getUserInfo, getOffice, setCache } from '@/libs/util'
import Tables from '_c/tables'
export default {
  name: 'projectManagement',
  components: { Tables },
  data () {
    return {
      branchBusinessManager: '1',
      creatProjectPermission: '0',
      params: {
        pageSize: 10,
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
      },
      columns: [
        { title: '项目名称', key: 'name' },
        { title: '甲方公司', key: 'firstPartyCompanyName' },
        { title: '甲方负责人', key: 'firstPartyUserName' },
        { title: '起始日期', key: 'startTime' },
        { title: '截止日期', key: 'completionTime' },
        { title: '主导单位', key: 'officeName' },
        { title: '项目经理', key: 'projectManagerName' },
        { title: '项目状态',
          key: 'status',
          render: (h, params) => {
            let text = ''
            if (params.row.pauseStatus === '0') {
              if (params.row.status === '1') {
                text = '未开始'
              } else if (params.row.status === '2') {
                text = '进行中'
              } else if (params.row.status === '3') {
                text = '审核中'
              } else if (params.row.status === '4') {
                text = '已完成'
              } else if (params.row.status === '5') {
                text = '已驳回'
              } else if (params.row.status === '6') {
                text = '已撤销'
              }
            } else {
              text = '已暂停'
            }
            return h('div', { props: {} }, text)
          }
        },
        { title: '逾期天数', key: 'overdueDays' },
        { title: '甲方评分', key: 'firstPartyScoring' },
        {
          title: '操作',
          slot: 'action1'
        }
      ],
      tableData: [],
      total: 0,
      filter: false,
      firstPartyCompany: [],
      projectManager: [],
      statusModel: false,
      status: '',
      permissionCode: '',
      projectId: '',
      pauseStatus: '',
      projectName: '',
      userName: getOffice().name,
      formItemStatus: {
        content: ''
      },
      ruleCustom: {
        content: [
          { required: true, message: '请输入申请原因', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onRowClick () {
      this.$router.push({
        name: 'projectDetail',
        query: {
          projectId: arguments[0].id,
          lat: arguments[0].lat,
          lng: arguments[0].lng
        }
      })
    },
    reminder () {
      this.$router.push({
        name: 'projectReminder'
      })
    },
    pageChange (page) {
      this.params.page = page
      this.getData()
    },
    pageSizeChange (size) {
      this.params.pageSize = size
      this.getData()
    },
    getUserCount () {
      getUserCount({
        id: getUserId()
      }).then((res) => {
        this.branchBusinessManager = res.data.data.isShowRemind
      })
    },
    getData () {
      listProject(this.params).then((res) => {
        this.creatProjectPermission = res.data.data.creatProjectPermission
        this.tableData = res.data.data.projectList
        this.total = Number(res.data.data.count)
      })
    },
    filterReset () {
      this.params.firstPartyScoring = ''
      this.params.status = ''
      this.params.firstPartyCompanyId = ''
      this.params.projectManagerId = ''
    },
    getProjectManager () {
      getUserList({
        'pageSize': 0,
        'page': 0,
        'name': '',
        'office': JSON.parse(getUserInfo()).officeId,
        'role': '',
        'isLoginApp': ''
      }).then((res) => {
        if (res.data.status === '200') {
          this.projectManager = res.data.data.list
        }
      })
    },
    getFirstPartyCompany () {
      getUnitList({
        'pageSize': 0,
        'page': 0,
        'name': '',
        'areaId': '',
        'type': '3',
        'userId': getUserId()
      }).then(res => {
        if (res.data.status === '200') {
          this.firstPartyCompany = res.data.data.list
        }
      })
    },
    openFilter () {
      this.filter = !this.filter
    },
    handleSearch (val) {
      this.params.projectName = val
      this.getData()
    },
    toAdd () {
      setCache('')
      this.$router.push({
        name: 'addProject'
      })
    },
    saveStatus () {
      this.$refs['formItemStatus'].validate((valid) => {
        if (valid) {
          let obj = {}
          if (this.permissionCode === '3') {
            obj = {
              'projectId': this.projectId,
              'userId': getUserId(),
              'functionType': this.permissionCode,
              'pauseStatus': this.pauseStatus === '0' ? '1' : '0',
              'reason': this.formItemStatus.content
            }
          } else {
            obj = {
              'projectId': this.projectId,
              'userId': getUserId(),
              'functionType': this.permissionCode,
              'reason': this.formItemStatus.content
            }
          }
          projectFunction(obj).then((res) => {
            this.$Message.info(res.data.msg)
            this.getData()
            this.statusModel = false
          })
        } else {
          return false
        }
      })
    },
    onEdit (params, row) {
      let permissionCode = params.permissionCode
      this.projectId = row.id
      this.pauseStatus = row.pauseStatus
      this.projectName = row.name
      if (permissionCode === '3') {
        this.status = '申请暂停/开始项目'
        this.permissionCode = permissionCode
        this.statusModel = true
      } else if (permissionCode === '5') {
        this.status = '申请撤销项目'
        this.permissionCode = permissionCode
        this.statusModel = true
      } else if (permissionCode === '99') {
        setCache('')
        this.$router.push({
          name: 'addTask'
        })
      } else {
        let obj = {}
        let str = ''
        switch (permissionCode) {
          case '1':
            str = '确定要开始该项目吗？'
            break
          case '2':
            str = '确定要' + (this.pauseStatus === '0' ? '暂停' : '开始') + '该项目吗？'
            break
          case '4':
            str = '确定要撤销该项目吗？'
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
        }
        if (permissionCode === '2') {
          obj = {
            'projectId': row.id,
            'userId': getUserId(),
            'functionType': permissionCode,
            'pauseStatus': row.pauseStatus === '0' ? '1' : '0'
          }
        } else {
          obj = {
            'projectId': row.id,
            'userId': getUserId(),
            'functionType': permissionCode
          }
        }
        this.$Modal.confirm({
          title: str,
          onOk: () => {
            projectFunction(obj).then((res) => {
              this.$Message.info(res.data.msg)
              this.getData()
            })
          }
        })
      }
      // if (params.permissionCode === '2' || params.permissionCode === '3') {
      //   this.$Modal.confirm({
      //     title: params.permissionCode === '2' ? '确定要' + (row.pauseStatus === '0' ? '暂停' : '开始') + '该项目吗？' : '确定要申请' + (row.pauseStatus === '0' ? '暂停' : '开始') + '该项目吗？',
      //     onOk: () => {
      //       projectFunction({
      //         'projectId': row.id,
      //         'userId': getUserId(),
      //         'functionType': params.permissionCode,
      //         'pauseStatus': row.pauseStatus === '0' ? '1' : '0'
      //       }).then((res) => {
      //         this.$Message.info(res.data.msg)
      //         this.getData()
      //       })
      //     }
      //   })
      // } else if (params.permissionCode === '99') {
      //   this.$router.push({
      //     name: 'addTask',
      //     query: {
      //       projectId: row.id
      //     }
      //   })
      // } else {
      //   let str = ''
      //   switch (params.permissionCode) {
      //     case '1':
      //       str = '确定要开始该项目吗？'
      //       break
      //     case '4':
      //       str = '确定要撤销该项目吗？'
      //       break
      //     case '5':
      //       str = '确定要申请撤销该项目吗？'
      //       break
      //     case '6':
      //       str = '确定要催办该项目吗？'
      //       break
      //     case '7':
      //       str = '确定要将该项目提交审核吗？'
      //       break
      //     case '8':
      //       str = '确定要删除该项目吗？'
      //       break
      //   }
      //   this.$Modal.confirm({
      //     title: str,
      //     onOk: () => {
      //       projectFunction({
      //         'projectId': row.id,
      //         'userId': getUserId(),
      //         'functionType': params.permissionCode
      //       }).then((res) => {
      //         this.$Message.info(res.data.msg)
      //         this.getData()
      //       })
      //     }
      //   })
      // }
    }
  },
  mounted () {
    this.getData()
    this.getFirstPartyCompany()
    this.getProjectManager()
    this.getUserCount()
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
