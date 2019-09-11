<template>
  <div style="height: 100%;margin: -18px;">
    <div class="amap-page-container">
      <el-amap
        v-if="this.center.length === 2"
        :amap-manager="amapManager"
        :center="center"
        vid="amapDemo"
        :zoom="zoom"
        class="amap-demo"
        :events="events"
        :plugin="plugin"
      >
        <el-amap-marker v-for="(marker, index) in markers" :key="index" :extData = "marker.id" vid="chenyiming" :position="marker.position" :content="marker.content" :events="marker.events"></el-amap-marker>
      </el-amap>
      <Cascader :data="areaData" v-model="areaValue" style="position: absolute; right: 20px; top: 20px; width: 200px;" @on-change="cascaderChange"></Cascader>
      <div style="color: #666666; display: flex; width:350px; position: absolute; left: 20px; top: 20px; border: 0 none">
        <div style="background-color: #ffffff; padding: 10px 20px; line-height: 20px; cursor: pointer">我的项目</div>
        <div style="background-color: #F2F2F2; padding: 10px 20px; line-height: 20px; cursor: pointer" @click="onChangeNav('myTask')">我的任务</div>
        <div style="background-color: #F2F2F2; padding: 10px 20px; line-height: 20px; cursor: pointer" @click="onChangeNav('myTaskRoad')">我的任务路口</div>
      </div>
      <Card style="width:350px; position: absolute; left: 20px; top: 60px; border: 0 none">
        <div style="display: flex">
          <input type="text" v-model="projectName" class="ivu-input ivu-input-default" style="height: 50px; border: 0 none; border-radius: 0; font-size: 15px; color: #999999">
          <img src="../../assets/images/search.png" style=" cursor: pointer" @click="searchProject">
        </div>
      </Card>
      <Card v-if="!isDetail" style="width:350px; position: absolute; left: 20px; top: 120px;">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; border-bottom: 1px solid #e6e6e6;">
          <div style="font-size: 16px; font-weight: bold">
            项目数量：{{this.total}}
          </div>
          <Select v-model="onStatus" style="width:100px" @on-change="statusChange" clearable>
            <Avatar :src="avatar" slot="prefix" size="small" />
            <Option value="1" >未开始</Option>
            <Option value="2" >进行中</Option>
            <Option value="3" >审核中</Option>
            <Option value="4" >已完成</Option>
            <Option value="5" >已驳回</Option>
            <Option value="6" >已撤销</Option>
            <Option value="7" >已暂停</Option>
          </Select>
        </div>
        <div v-for="(item, index) in projectList" @contextmenu.prevent="handleContextmenu(item.id, $event)" :key="index" @click="positioning(item.lng, item.lat)" v-show="panelShow" style="position: relative; padding: 15px; padding-bottom: 10px; border-bottom: 1px solid #e6e6e6;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px">
            <div style="font-size: 16px; display: flex; align-items: center;" @click.stop>
              <img src="../../assets/images/icon1.png" style="width: 18px; margin-right: 5px">{{item.name}}
            </div>
            <div style="line-height: 20px;">
              <p :style="{ 'font-size': '20px', color: ( item.progress === '100' ? '#15C41B' : '#FB861B' ) }">{{item.progress ? item.progress : 0}}%</p>
              <p style="color: #999999">进度</p>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between">
            <span style="color:#999999;">项目角色：{{item.userTopRoleName}}</span>
            <span style="color:#BC0000;" v-if="item.isOverdue === '1'">已逾期{{item.overdueDays}}天</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 10px" @click.stop>
            <div>
              <span v-for="(i, index) in item.projectButtonPermissionBeans" :key="index" >
                <Button v-if="i.permissionCode === '1'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">开始项目</Button>
                <Button v-if="i.permissionCode === '2' && item.pauseStatus === '1'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">开始项目</Button>
                <Button v-if="i.permissionCode === '2' && item.pauseStatus === '0'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">暂停项目</Button>
                <Button v-if="i.permissionCode === '3' && item.pauseStatus === '1'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">申请开始项目</Button>
                <Button v-if="i.permissionCode === '3' && item.pauseStatus === '0'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">申请暂停项目</Button>
                <Button v-if="i.permissionCode === '4'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">撤销项目</Button>
                <Button v-if="i.permissionCode === '5'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">申请撤销项目</Button>
                <Button v-if="i.permissionCode === '6'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">逾期催办项目</Button>
                <Button v-if="i.permissionCode === '7'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">提交审核项目</Button>
                <Button v-if="i.permissionCode === '8'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">删除项目</Button>
                <Button v-if="i.permissionCode === '9'" @click="onEdit(i, item)" size="small" style="margin-right: 5px; margin-bottom: 10px; float: left">创建任务</Button>
              </span>
            </div>
            <div>
              <button typeof="button" @click="toProjectDetail(item.id)" style="border: 1px solid #2E8CEB; width: 58px; height: 41px; background-color: #ffffff; border-radius: 3px; color: #2E8CEB; cursor: pointer">详情</button>
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 11px 10px 15px; border-bottom: 1px solid #e6e6e6;">
          <div>{{page}}/{{maxPage}}页</div>
          <div style="display: flex">
            <Button style="margin-right: 4px" @click="firstPage">首页</Button>
            <ul class="ivu-page">
              <li title="上一页" @click="prevPage" class="ivu-page-prev"><a><i class="ivu-icon ivu-icon-ios-arrow-back"></i></a></li>
              <li title="下一页" @click="nextPage" class="ivu-page-prev"><a><i class="ivu-icon ivu-icon-ios-arrow-forward"></i></a></li>
            </ul>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 10px 15px; color: #2E8CEB;">
          <span @click="allProject" style="cursor: pointer">所有项目</span>
          <span @click="close" style="cursor: pointer">{{this.panelShow ? '收起' : '展开'}}</span>
        </div>
      </Card>
      <Card v-if="isDetail" style="width:350px; height: 550px; overflow-y: scroll; position: absolute; left: 20px; top: 120px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px;border-bottom: 1px solid rgb(230, 230, 230);">
          <span style="color: #2E8CEB; font-size: 15px; font-weight: bold">{{detailData.name}}</span>
          <img src="../../assets/images/icon1.png" style="width: 22px;">
        </div>
        <div style="padding: 15px; border-bottom: 1px solid rgb(230, 230, 230); position: relative">
          <div style="position: absolute; right: 15px; top: 5px; text-align: right;">
            <p :style="{ 'font-size': '30px', color: ( detailData.progress === '100' ? '#15C41B' : '#FB861B' ) }">{{detailData.progress ? detailData.progress : 0}}%</p>
            <p>项目进度</p>
          </div>
          <div style="line-height: 24px"><span class="label">项目状态：</span><span>{{pStatus}}</span></div>
          <div style="line-height: 24px"><span class="label">项目角色：</span><span>{{detailData.userTopRoleName}}</span></div>
          <div style="line-height: 24px"><span class="label">逾期天数：</span><span>{{detailData.overdueDays}}</span></div>
          <div style="line-height: 24px"><span class="label">甲方评分：</span><span>{{detailData.firstPartyScoring}}</span></div>
        </div>
        <div style=" padding: 5px 15px; border-bottom: 1px solid rgb(230, 230, 230);">
          项目基本信息
        </div>
        <div style="padding: 15px; ">
          <div style="line-height: 24px"><span class="label">项目名称：</span><span>{{detailData.name}}</span></div>
          <div style="line-height: 24px"><span class="label">甲方单位：</span><span>{{detailData.firstPartyCompanyName}}</span></div>
          <div style="line-height: 24px"><span class="label">甲方负责人：</span><span>{{detailData.firstPartyUserName}}</span></div>
          <div style="line-height: 24px"><span class="label">项目位置：</span><span>{{detailData.specificAddress}}</span></div>
          <div style="line-height: 24px"><span class="label">起止日期：</span><span>{{detailData.startTime}} 至 {{detailData.completionTime}}</span></div>
          <div style="line-height: 24px"><span class="label">主导单位：</span><span>{{detailData.officeName}}</span></div>
          <div style="line-height: 24px"><span class="label">项目经理：</span><span>{{detailData.projectManagerName}}</span></div>
          <div style="line-height: 24px"><span class="label">项目备注：</span><span>{{detailData.remarks}}</span></div>
        </div>
      </Card>
      <Button type="primary" v-show="isDetail" @click="toList" style="position: absolute; top: 680px; left: 20px;">返回列表</Button>
    </div>
    <Modal
      v-model="statusModel"
      title="项目状态修改申请">
      <Form ref="formItemStatus" :model="formItemStatus" :rules="ruleCustom" :label-width="130">
        <FormItem label="项目名称：">
          <Row>
            <Col span="11">
              {{pName}}
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
    <Dropdown
      placement="right-start"
      trigger="custom"
      ref="contextMenu"
      :visible="currentVisible"
      @on-clickoutside="handleCancel"
    >
      <DropdownMenu slot="list">
        <Dropdown v-for="(t, index) in task" :key="index" placement="right-start" @on-visible-change="hoverTask($event,t)">
          <DropdownItem>
            {{t.name}}
            <Icon type="ios-arrow-forward"></Icon>
          </DropdownItem>
          <DropdownMenu slot="list" v-show="taskRoad.length > 0">
            <DropdownItem  v-for="(tr, index) in taskRoad" :key="index">{{tr.alias}}</DropdownItem>
            <DropdownItem>
              <div style="display: flex; align-items: center" @click.stop>
                <img src="../../assets/images/prev.png" style="width: 20px" @click="taskRoadPrev">
                <span style="margin:0 24px">{{taskRoadPage}}/{{maxTaskRoadPage}}</span>
                <img src="../../assets/images/next.png" style="width: 20px" @click="taskRoadNext">
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <DropdownItem>
          <div style="display: flex; align-items: center">
            <img src="../../assets/images/prev.png" style="width: 20px" @click="taskPrev">
            <span style="margin:0 24px">{{taskPage}}/{{maxTaskPage}}</span>
            <img src="../../assets/images/next.png" style="width: 20px" @click="taskNext">
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import { listProject, areaData, listMapProject, selectProjectDetail, projectFunction, listTask, listTaskCrossing } from '@/api/data'
import { getUserId, getOffice } from '@/libs/util'
import p_pause from '../../assets/images/p_pause.png'
import p_noStarted from '../../assets/images/p_noStarted.png'
import p_start from '../../assets/images/p_start.png'
import p_review from '../../assets/images/p_review.png'
import p_completed from '../../assets/images/p_completed.png'
import p_reject from '../../assets/images/p_reject.png'
import p_revoke from '../../assets/images/p_revoke.png'
import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap'
let amapManager = new AMapManager()
export default {
  name: 'myProject',
  data () {
    let self = this
    return {
      taskListId: '',
      taskRoadPage: 1,
      taskRoadTotal: 0,
      maxTaskRoadPage: 1,
      projectListId: '',
      taskPage: 1,
      taskTotal: 0,
      maxTaskPage: 1,
      task: [],
      taskRoad: [],
      posX: 0,
      posY: 0,
      currentVisible: false,
      locator: null,
      p_pause,
      p_noStarted,
      p_start,
      p_review,
      p_completed,
      p_reject,
      p_revoke,
      avatar: p_start,
      onStatus: '1',
      isDetail: false,
      detailData: {},
      minClusterSize: 2,
      panelShow: true,
      zoom: 16,
      amapManager,
      center: [],
      areaData: [],
      areaValue: [],
      keywords: '',
      searchOptions: {
        city: '全国'
      },
      markers: [],
      markerRefs: [],
      map: null,
      plugin: [{
        pName: 'ToolBar',
        position: 'RB',
        events: {
          init (instance) {}
        }
      }],
      events: {
        complete () {
          let o = amapManager.getMap()
          o.on('zoomchange', () => {
            let zoom = o.getZoom()
            if (zoom > 13) {
              self.map.setMinClusterSize(2)
            } else {
              self.map.setMinClusterSize(1)
            }
          })
        }
      },
      projectList: [],
      total: 0,
      page: 1,
      maxPage: 1,
      projectName: '',
      statusModel: false,
      status: '',
      permissionCode: '',
      projectId: '',
      pauseStatus: '',
      pName: '',
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
  watch: {
    'onStatus': function (val) {
      switch (val) {
        case undefined:
          this.onStatus = ''
          break
        case '1':
          this.avatar = p_noStarted
          break
        case '2':
          this.avatar = p_start
          break
        case '3':
          this.avatar = p_review
          break
        case '4':
          this.avatar = p_completed
          break
        case '5':
          this.avatar = p_reject
          break
        case '6':
          this.avatar = p_revoke
          break
        case '7':
          this.avatar = p_pause
          break
      }
    }
  },
  computed: {
    pStatus () {
      if (this.detailData.status === '1') {
        return '未开始'
      } else if (this.detailData.status === '2') {
        return '进行中'
      } else if (this.detailData.status === '3') {
        return '审核中'
      } else if (this.detailData.status === '4') {
        return '已完成'
      } else if (this.detailData.status === '5') {
        return '已驳回'
      } else if (this.detailData.status === '6') {
        return '已撤销'
      } else if (this.detailData.status === '7') {
        return '已暂停'
      }
    }
  },
  methods: {
    createLocator () {
      // 获取Dropdown
      const contextmenu = this.$refs.contextMenu
      // 创建locator
      const locator = document.createElement('div')
      locator.style.cssText = `position:fixed;left:${this.posX}px;top:${this.posY}px`
      document.body.appendChild(locator)
      // 将locator绑定到Dropdown的reference上
      contextmenu.$refs.reference = locator
      this.locator = locator
    },
    removeLocator () {
      if (this.locator) document.body.removeChild(this.locator)
      this.locator = null
    },
    hoverTask (visible, task) {
      if (visible) {
        this.taskListId = task.id
        listTaskCrossing({
          pageSize: 10,
          page: this.taskRoadPage,
          projectId: '',
          taskId: task.id,
          userId: getUserId(),
          alias: '',
          taskCrossingStatus: '',
          timeStatus: '',
          startTime: '',
          endTime: '',
          provinceName: '',
          cityName: '',
          districtName: '',
          noLoading: '1'
        }).then((res) => {
          console.log(res.data.data.count)
          this.taskRoad = res.data.data.taskCrossingDetailBeanList
          this.taskRoadTotal = res.data.data.count
          if (Number(this.taskRoadTotal) < 10 && Number(this.taskRoadTotal) > 0) {
            this.maxTaskRoadPage = 1
          } else if (Number(this.taskRoadTotal) === 0) {
            this.maxTaskRoadPage = 1
            this.taskRoadPage = 1
          } else {
            this.maxTaskRoadPage = Math.ceil(Number(this.taskRoadTotal) / 10)
          }
        })
      }
    },
    handleContextmenu (id, { button, clientX, clientY }) {
      if (this.currentVisible) {
        this.currentVisible = false
      }
      this.projectListId = id
      listTask({
        pageSize: 10,
        page: this.taskPage,
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
        districtName: '',
        noLoading: '1'
      }).then((res) => {
        this.task = res.data.data.taskDetailBeans
        this.taskTotal = res.data.data.count
        if (Number(this.taskTotal) < 10 && Number(this.taskTotal) > 0) {
          this.maxTaskPage = 1
        } else if (Number(this.taskTotal) === 0) {
          this.maxTaskPage = 1
          this.taskPage = 1
        } else {
          this.maxTaskPage = Math.ceil(Number(this.taskTotal) / 10)
        }
        if (this.task.length > 0) {
          if (button === 2) {
            if (this.posX !== clientX) this.posX = clientX
            if (this.posY !== clientY) this.posY = clientY
            if (this.trigger !== 'custom') {
              this.createLocator()
              this.currentVisible = true
            }
          }
        }
      })
    },
    getTaskRoad () {
      listTaskCrossing({
        pageSize: 10,
        page: this.taskRoadPage,
        projectId: '',
        taskId: this.taskListId,
        userId: getUserId(),
        alias: '',
        taskCrossingStatus: '',
        timeStatus: '',
        startTime: '',
        endTime: '',
        provinceName: '',
        cityName: '',
        districtName: '',
        noLoading: '1'
      }).then((res) => {
        this.taskRoad = res.data.data.taskCrossingDetailBeanList
        this.taskRoadTotal = res.data.data.count
        if (Number(this.taskRoadTotal) < 10 && Number(this.taskRoadTotal) > 0) {
          this.maxTaskRoadPage = 1
        } else if (Number(this.taskRoadTotal) === 0) {
          this.maxTaskRoadPage = 1
          this.taskRoadPage = 1
        } else {
          this.maxTaskRoadPage = Math.ceil(Number(this.taskRoadTotal) / 10)
        }
      })
    },
    getTask () {
      listTask({
        pageSize: 10,
        page: this.taskPage,
        businessProjectId: this.projectListId,
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
        districtName: '',
        noLoading: '1'
      }).then((res) => {
        this.task = res.data.data.taskDetailBeans
        this.taskTotal = res.data.data.count
        if (Number(this.taskTotal) < 10 && Number(this.taskTotal) > 0) {
          this.maxTaskPage = 1
        } else if (Number(this.taskTotal) === 0) {
          this.maxTaskPage = 1
          this.taskPage = 1
        } else {
          this.maxTaskPage = Math.ceil(Number(this.taskTotal) / 10)
        }
      })
    },
    handleCancel () {
      this.currentVisible = false
      this.removeLocator()
    },
    onChangeNav (to) {
      this.$router.push({
        name: to
      })
    },
    toProjectDetail (id) {
      this.$router.push({
        name: 'projectDetail',
        query: {
          projectId: id
        }
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
      this.pName = row.name
      if (permissionCode === '3') {
        this.status = '申请暂停/开始项目'
        this.permissionCode = permissionCode
        this.statusModel = true
      } else if (permissionCode === '5') {
        this.status = '申请撤销项目'
        this.permissionCode = permissionCode
        this.statusModel = true
      } else if (permissionCode === '99') {
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
      //         this.markers = []
      //         this.markerRefs = []
      //         this.map.clearMarkers()
      //         this.getMapProject()
      //         this.getProject()
      //       })
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
      //     case '99':
      //       str = '确定要为该项目创建新的任务吗？'
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
      //         this.markers = []
      //         this.markerRefs = []
      //         this.map.clearMarkers()
      //         this.getMapProject()
      //         this.getProject()
      //       })
      //     }
      //   })
      // }
    },
    searchProject () {
      this.page = 1
      this.getProject()
    },
    initMark (self, o) {
      self.map = new AMap.MarkerClusterer(o, self.markerRefs, {
        gridSize: 80,
        // renderCluserMarker: self._renderCluserMarker,
        minClusterSize: 2
      })
    },
    statusChange () {
      this.getProject()
      this.markers = []
      this.markerRefs = []
      this.map.clearMarkers()
      this.getMapProject().then(() => {
        if (this.onStatus === '') {
          let o = amapManager.getMap()
          o.setFitView(this.markerRefs)
        }
      })
    },
    toList () {
      this.isDetail = false
    },
    firstPage () {
      this.page = 1
      this.getProject()
    },
    prevPage () {
      if (this.page !== 1) {
        this.page--
        this.getProject()
      }
    },
    taskRoadPrev () {
      if (this.taskRoadPage !== 1) {
        this.taskRoadPage--
        this.getTaskRoad()
      }
    },
    taskRoadNext () {
      if (this.taskRoadPage < this.maxTaskRoadPage) {
        this.taskRoadPage++
        this.getTaskRoad()
      }
    },
    taskPrev () {
      if (this.taskPage !== 1) {
        this.taskPage--
        this.getTask()
      }
    },
    taskNext () {
      if (this.taskPage < this.maxTaskPage) {
        this.taskPage++
        this.getTask()
      }
    },
    nextPage () {
      if (this.page < this.maxPage) {
        this.page++
        this.getProject()
      }
    },
    allProject () {
      this.onStatus = ''
    },
    close () {
      this.panelShow = !this.panelShow
    },
    positioning (lng, lat) {
      this.center = [lng, lat]
    },
    getProject () {
      console.log(this)
      listProject({
        pageSize: 3,
        page: this.page,
        userId: getUserId(),
        projectName: this.projectName,
        firstPartyCompanyId: '',
        projectManagerId: '',
        status: this.onStatus,
        firstPartyScoring: '',
        provinceName: '',
        cityName: '',
        districtName: '',
        timeStatus: '',
        startTime: '',
        endTime: ''
      }).then((res) => {
        this.projectList = res.data.data.projectList
        if (this.projectList.length > 0) {
          this.center = [this.projectList[0].lng || 116.397428, this.projectList[0].lat || 39.90923]
        } else {
          this.center = this.center.length === 0 ? [116.397428, 39.90923] : this.center
        }
        this.total = res.data.data.count
        if (Number(this.total) < 3 && Number(this.total) > 0) {
          this.maxPage = 1
        } else if (Number(this.total) === 0) {
          this.maxPage = 1
          this.page = 1
        } else {
          this.maxPage = Math.ceil(Number(this.total) / 3)
        }
      })
    },
    getProjectDetail (id) {
      selectProjectDetail({
        projectId: id,
        userId: getUserId()
      }).then((res) => {
        this.isDetail = true
        this.detailData = res.data.data
      })
    },
    getMapProject () {
      return listMapProject({
        pageSize: 0,
        page: 0,
        userId: getUserId(),
        projectName: this.projectName,
        firstPartyCompanyId: '',
        projectManagerId: '',
        status: this.onStatus,
        firstPartyScoring: '',
        provinceName: '',
        cityName: '',
        districtName: '',
        timeStatus: '',
        startTime: '',
        endTime: ''
      }).then((res) => {
        let projectList = res.data.data.projectList
        let self = this
        projectList.forEach((item) => {
          let status = ''
          if (item.pauseStatus === '1') {
            status = `<div><img src="${p_pause}" style="width: 30px; height: 30px"></div>`
          } else {
            switch (item.status) {
              case '1':
                status = `<div><img src="${p_noStarted}" style="width: 30px; height: 30px"></div>`
                break
              case '2':
                status = `<div><img src="${p_start}" style="width: 30px; height: 30px"></div>`
                break
              case '3':
                status = `<div><img src="${p_review}" style="width: 30px; height: 30px"></div>`
                break
              case '4':
                status = `<div><img src="${p_completed}" style="width: 30px; height: 30px"></div>`
                break
              case '5':
                status = `<div><img src="${p_reject}" style="width: 30px; height: 30px"></div>`
                break
              case '6':
                status = `<div><img src="${p_revoke}" style="width: 30px; height: 30px"></div>`
                break
              case '7':
                status = `<div><img src="${p_pause}" style="width: 30px; height: 30px"></div>`
                break
            }
          }
          this.markers.push({
            position: [item.lng, item.lat],
            id: item.id,
            content: status,
            events: {
              init (o) {
                self.markerRefs.push(o)
              },
              click (e) {
                self.getProjectDetail(e.target.get('extData'))
              }
            }
          })
        })
        setTimeout(() => {
          self.initMark(self, amapManager.getMap())
        }, 0)
      })
    },
    getAreaData () {
      areaData().then(res => {
        if (res.data.status === '200') {
          this.areaData = res.data.data
        }
      })
    },
    searchArea () {
      if (!this.keywords) return false
      let placeSearch = new AMap.PlaceSearch(this.searchOptions)
      placeSearch.search(this.keywords, (status, result) => {
        this.center = [result.poiList.pois[0].location.lng, result.poiList.pois[0].location.lat]
      })
    },
    cascaderChange () {
      let value = arguments[1].slice(1, arguments[1].length).map((item) => {
        return item.label
      })
      this.keywords = value.join()
      this.zoom = 16
      this.searchArea()
    },
    _renderCluserMarker (context) {
      const count = this.markers.length
      let factor = Math.pow(context.count / count, 1 / 18)
      let div = document.createElement('div')
      let Hue = 180 - factor * 180
      let bgColor = 'hsla(' + Hue + ',100%,50%,0.7)'
      let fontColor = 'hsla(' + Hue + ',100%,20%,1)'
      let borderColor = 'hsla(' + Hue + ',100%,40%,1)'
      let shadowColor = 'hsla(' + Hue + ',100%,50%,1)'
      div.style.backgroundColor = bgColor
      let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
      div.style.width = div.style.height = size + 'px'
      div.style.border = 'solid 1px ' + borderColor
      div.style.borderRadius = size / 2 + 'px'
      div.style.boxShadow = '0 0 1px ' + shadowColor
      div.innerHTML = context.count
      div.style.lineHeight = size + 'px'
      div.style.color = fontColor
      div.style.fontSize = '14px'
      div.style.textAlign = 'center'
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
      context.marker.setContent(div)
    }
  },
  mounted () {
    this.getAreaData()
    lazyAMapApiLoaderInstance.load().then(() => {
      this.getMapProject()
      this.getProject()
    })
  }
}
</script>

<style scoped lang="less">
  .amap-page-container{
    height: 100%;
    position: relative;
    /deep/ .ivu-card-body{
      padding: 0;
    }
  }
  .amap-demo {
    height: 100%;
  }
  .spin-container{
    display: inline-block;
    width: 100%;
    height: 100%;
    position: relative;
    border: 1px solid #eee;
  }
  .ivu-card{
    border-radius: 0px;
  }
  .label{
    color: rgb(153, 153, 153);
    width: 84px;
    display: inline-block;
  }
  .ivu-dropdown{
    display: block;
    /deep/ .ivu-select-dropdown{
      width: auto;
    }
  }
</style>
