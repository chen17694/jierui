<template>
  <div>
    <Card>
      <div style="display: flex; justify-content: space-between">
        <h2>{{detailData.name}}</h2>
        <div>
          <Button type="primary" style="margin-right: 10px" @click="sxxiugai" v-if="this.detailData.updateTsakPermission === '0'">修改任务属性</Button>
          <Button @click="back">返回</Button>
        </div>
      </div>
      <dl style="margin-top: 30px">
        <dt style="font-size: 16px; font-weight: bold; margin-bottom: 10px">任务状态信息</dt>
        <dd v-if="detailData.taskStatus === '1'">任务状态：未领取</dd>
        <dd v-if="detailData.taskStatus === '2'">任务状态：已拒绝</dd>
        <dd v-if="detailData.taskStatus === '3'">任务状态：未开始</dd>
        <dd v-if="detailData.taskStatus === '4'">任务状态：进行中</dd>
        <dd v-if="detailData.taskStatus === '5'">任务状态：审核中</dd>
        <dd v-if="detailData.taskStatus === '6'">任务状态：已完成</dd>
        <dd v-if="detailData.taskStatus === '7'">任务状态：已驳回</dd>
        <dd v-if="detailData.taskStatus === '8'">任务状态：已撤销</dd>
        <dd v-if="detailData.pauseStatus === '1'">任务状态：已暂停</dd>
        <dd>逾期天数：{{detailData.overdueDays}}</dd>
        <dd>项目进度：{{detailData.progress}}%</dd>
        <dd v-if="detailData.firstPartyScoring === '1'">甲方评分：非常满意</dd>
        <dd v-if="detailData.firstPartyScoring === '2'">甲方评分：满意</dd>
        <dd v-if="detailData.firstPartyScoring === '3'">甲方评分：不满意</dd>
        <dd v-if="detailData.firstPartyScoring === '3'" style="display: block;margin-top: 20px;color: red;">
          不满意原因：{{detailData.dissatisfiedReason}}
        </dd>
      </dl>
      <div class="btns" v-if="this.detailData.status !== '6'  && (detailData.taskButtonPermissionBeans && detailData.taskButtonPermissionBeans.length > 0)">
        <Button type="primary" v-for="(item, index) in detailData.taskButtonPermissionBeans" style="margin: 0 10px" :key="index" @click="statusChange(item.permissionCode)">{{item.name}}</Button>
      </div>
      <Tabs style="margin-top: 20px">
        <TabPane label="基本信息" name="name1">
          <ul style="line-height: 40px; list-style-type: none">
            <li><span style="font-weight: bold">项目名称</span>：{{detailData.businessProjectName}}</li>
            <li><span style="font-weight: bold">任务名称：</span>{{detailData.name}}</li>
            <li>
              <span style="margin-right: 20px" v-if="detailData.type === '1'"><span style="font-weight: bold">任务类型：</span>巡检任务</span>
              <span style="margin-right: 20px" v-if="detailData.type === '2'"><span style="font-weight: bold">任务类型：</span>优化任务</span>
              <span style="margin-right: 20px" v-if="detailData.type === '3'"><span style="font-weight: bold">任务类型：</span>宣传任务</span>
              <span style="margin-right: 20px"><span style="font-weight: bold">任务负责人：</span>{{detailData.taskHoldersName}}</span>
              <span style="margin-right: 20px" v-if="detailData.taskStatus === '6'"><span style="font-weight: bold">起止日期：</span>{{detailData.startTime}} - {{detailData.endTime}}</span>
              <span style="margin-right: 20px" v-if="detailData.taskStatus !== '6'"><span style="font-weight: bold">起止日期：</span>{{detailData.startTime}} - {{detailData.completionTime}}</span>
            </li>
            <li v-if="detailData.nature === '1'"><span style="font-weight: bold">任务性质：</span>单点优化</li>
            <li v-if="detailData.nature === '2'"><span style="font-weight: bold">任务性质：</span>线优化</li>
            <li v-if="detailData.nature === '3'"><span style="font-weight: bold">任务性质：</span>区域优化</li>
            <li><span style="font-weight: bold">任务描述：</span>{{detailData.remarks}}</li>
            <li><span style="font-weight: bold">任务位置：</span>{{detailData.provinceName}}{{detailData.cityName}}{{detailData.districtName}}{{detailData.specificAddress}}</li>
            <li style="margin-top: 10px">
              <el-amap ref="map" :center="center" vid="amapDemo" :zoom="zoom" class="amap-demo">
                <el-amap-marker v-for="(marker, index) in markers" :position="marker.position" :key="index" :vid="index"/>
              </el-amap>
            </li>
          </ul>
        </TabPane>
        <TabPane label="任务路口" name="name2">
          <tables ref="tables" :total="this.total" :on-change="pageChange" :on-page-size-change="pageSizeChange" :columns="columns" v-model="tableData" :taskRoadListBtnVisible="true" @on-edit="onEdit"/>
        </TabPane>
        <TabPane label="附件" name="name5">
          <ul style="list-style-type: none; display: flex">
            <li v-for="(item ,index) in annexBeans" @click="download(item)" :key="index" style="cursor: pointer;border: 1px solid #dcdee2;border-radius: 5px; padding-top: 10px; width: 120px; margin-right: 10px">
              <div style="background-color: #ffffff; display: flex; align-items: center; justify-content: center;">
                <img src="../../assets/images/file.png" style="width: 60px;">
              </div>
              <p style="word-wrap: break-word; text-align: center; margin-bottom: 5px; padding: 0 5px;">{{item.annexName}}</p>
              <div style="text-align: center" @click.stop>
                <img src="../../assets/images/delete.png" style="width: 20px;" @click="deleteFile(item.id)">
              </div>
            </li>
          </ul>
          <div v-if="addPermission === '0'">
            <div style="text-align: center">
              <input type="file" @change="uploadFile($event)" style=" position: absolute; width: 80px; opacity: 0;">
              <Button type="primary">上传附件</Button>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import { selectTaskDetail, taskFunction, taskCrossingFunction, listTaskCrossing, listTaskAnnex, uploadImgToAliOss, addTaskAnnex, deleteTasktAnnex } from '@/api/data'
import Tables from '_c/tables'
import { getUserId, getOffice } from '@/libs/util'
export default {
  name: 'taskDetail',
  components: { Tables },
  data () {
    return {
      center: [this.$route.query.lng, this.$route.query.lat],
      zoom: 14,
      markers: [],
      annexBeans: [],
      addPermission: '0',
      params: {
        pageSize: 10,
        page: 1,
        projectId: '',
        taskId: this.$route.query.taskId,
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
      total: 0,
      tableData: [],
      columns: [
        { title: '项目名称', key: 'businessProjectName' },
        { title: '任务名称', key: 'businessTaskName' },
        { title: '路口别名', key: 'alias' },
        { title: '任务负责人', key: 'userName' },
        { title: '起始日期', key: 'startTime' },
        { title: '截止日期', key: 'completionTime' },
        { title: '路口状态',
          key: 'status',
          render: (h, params) => {
            let text = ''
            if (params.row.status === '1') {
              text = '未领取'
            } else if (params.row.status === '2') {
              text = '已拒绝'
            } else if (params.row.status === '3') {
              text = '未开始'
            } else if (params.row.status === '3') {
              text = '未开始'
            } else if (params.row.status === '4') {
              text = '进行中'
            } else if (params.row.status === '5') {
              text = '审核中'
            } else if (params.row.status === '6') {
              text = '已完成'
            } else if (params.row.status === '7') {
              text = '已驳回'
            } else if (params.row.status === '8') {
              text = '已撤销'
            } else if (params.row.status === '9') {
              text = '已暂停'
            }
            return h('div', { props: {} }, text)
          }
        },
        { title: '逾期天数', key: 'overdueDays' },
        { title: '甲方评分', key: 'firstPartyScoring' },
        {
          title: '操作',
          slot: 'action3'
        }
      ],
      userName: getOffice().name,
      detailData: {}
    }
  },
  methods: {
    addMarker () {
      let marker = {
        position: [this.$route.query.lng, this.$route.query.lat]
      }
      this.markers.push(marker)
    },
    deleteFile (id) {
      this.$Modal.confirm({
        title: '是否执行删除操作',
        content: '<p>删除后不能找回，还要继续吗</p>',
        onOk: () => {
          deleteTasktAnnex({
            id: id,
            userId: getUserId()
          }).then((res) => {
            listTaskAnnex({
              taskId: this.$route.query.taskId,
              userId: getUserId()
            }).then((res) => {
              this.annexBeans = res.data.data.annexBeans
              this.addPermission = res.data.data.addPermission
            })
          })
        }
      })
    },
    download (item) {
      window.open(item.annexUrl)
    },
    uploadFile (e) {
      uploadImgToAliOss(e).then(res => {
        let name = res[1]
        this.file = res[0]
        addTaskAnnex({
          userId: getUserId(),
          annexUrl: this.file,
          annexName: name,
          id: this.$route.query.taskId
        }).then((res) => {
          this.$Message.info(res.data.msg)
          listTaskAnnex({
            taskId: this.$route.query.taskId,
            userId: getUserId()
          }).then((res) => {
            this.annexBeans = res.data.data.annexBeans
            this.addPermission = res.data.data.addPermission
          })
        })
      })
    },
    sxxiugai () {
      this.$router.push({
        name: 'editTaskForm',
        query: {
          taskId: this.detailData.id
        },
        params: {
          lat: this.detailData.lat,
          lng: this.detailData.lng
        }
      })
    },
    back () {
      this.$router.back(-1)
    },
    pageChange (page) {
      this.params.page = page
      this.getData()
    },
    pageSizeChange (size) {
      this.params.pageSize = size
      this.getData()
    },
    onEdit (params, row) {
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
            this.toList()
          })
        }
      })
    },
    getData () {
      selectTaskDetail({
        taskId: this.$route.query.taskId,
        userId: getUserId()
      }).then((res) => {
        this.detailData = res.data.data
      })
    },
    statusChange (permissionCode) {
      if (permissionCode === '99') {
        this.$router.push({
          name: 'addTaskRoad'
        })
      } else {
        let str = ''
        switch (permissionCode) {
          case '1':
            str = '确定要下达任务吗？'
            break
          case '2':
            str = '确定要' + (this.detailData.pauseStatus === '0' ? '暂停' : '开始') + '该项目吗？'
            break
          case '3':
            str = '确定要撤销任务吗？'
            break
          case '4':
            str = '确定要催办该任务吗？'
            break
          case '5':
            str = '确定要提交审核吗？'
            break
          case '6':
            str = '确定要删除该任务吗？'
            break
        }
        this.$Modal.confirm({
          title: str,
          onOk: () => {
            let obj = {}
            if (permissionCode === '2') {
              obj = {
                'taskId': this.detailData.id,
                'userId': getUserId(),
                'functionType': permissionCode,
                'pauseStatus': this.detailData.pauseStatus === '0' ? '1' : '0'
              }
            } else {
              obj = {
                'taskId': this.detailData.id,
                'userId': getUserId(),
                'functionType': permissionCode
              }
            }
            taskFunction(obj).then((res) => {
              this.$Message.info(res.data.msg)
              if (permissionCode === '6') {
                this.$router.push({
                  name: 'taskManagementList'
                })
              } else {
                this.init()
              }
            })
          }
        })
      }
    },
    init () {
      this.getData()
      listTaskCrossing(this.params).then((res) => {
        this.tableData = res.data.data.taskCrossingDetailBeanList
        this.total = Number(res.data.data.count)
      })
      listTaskAnnex({
        taskId: this.$route.query.taskId,
        userId: getUserId()
      }).then((res) => {
        this.annexBeans = res.data.data.annexBeans
        this.addPermission = res.data.data.addPermission
      })
    }
  },
  mounted () {
    this.init()
    this.addMarker()
  }
}
</script>

<style scoped lang="less">
  dd{
    display: inline-block;
    margin-right: 20px;
  }
  .btns{
    margin: 20px 0 0 0;
    display: flex;
    justify-content: center;
    background-color: rgba(45, 140, 240, 0.2);
    border: 1px solid #2d8cf0;
    padding: 10px 0;
  }
  .ivu-form-item{
    margin-bottom: 0;
    /deep/ .ivu-form-item-error-tip{
      position: static;
    }
  }
  .ivu-tabs{
    overflow: initial;
  }
  .amap-demo{
    width: 700px;
    height: 300px;
  }
</style>
