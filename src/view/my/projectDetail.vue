<template>
  <div>
    <Card>
      <div style="display: flex; justify-content: space-between">
        <h2>{{detailData.name}}</h2>
        <div>
          <Button type="primary" style="margin-right: 10px" @click="sxxiugai" v-if="this.detailData.status !== '4'">修改项目属性</Button>
          <Button @click="back">返回</Button>
        </div>
      </div>
      <dl style="margin-top: 30px">
        <dt style="font-size: 16px; font-weight: bold; margin-bottom: 10px">项目状态信息</dt>
        <dd v-if="detailData.status === '1'">项目状态：未开始</dd>
        <dd v-if="detailData.status === '2'">项目状态：进行中</dd>
        <dd v-if="detailData.status === '3'">项目状态：审核中</dd>
        <dd v-if="detailData.status === '4'">项目状态：已完成</dd>
        <dd v-if="detailData.status === '5'">项目状态：已驳回</dd>
        <dd v-if="detailData.status === '6'">项目状态：已撤销</dd>
        <dd>逾期天数：{{detailData.overdueDays}}</dd>
        <dd>项目进度：{{detailData.progress}}%</dd>
        <dd v-if="detailData.firstPartyScoring === '1'">甲方评分：非常满意</dd>
        <dd v-if="detailData.firstPartyScoring === '2'">甲方评分：满意</dd>
        <dd v-if="detailData.firstPartyScoring === '3'">甲方评分：不满意</dd>
      </dl>
      <div class="btns" v-if="this.detailData.status !== '4'">
        <Button type="primary" v-for="(item, index) in detailData.projectButtonPermissionBeans" style="margin: 0 10px" :key="index" @click="statusChange(item.permissionCode)">{{item.name}}</Button>
      </div>
      <Tabs>
        <TabPane label="基本信息" name="name1">
          <ul style="line-height: 40px">
            <li><span style="font-weight: bold">项目名称</span>：{{detailData.name}}</li>
            <li>
              <span style="margin-right: 20px"><span style="font-weight: bold">甲方公司：</span>{{detailData.firstPartyCompanyName}}</span>
              <span style="margin-right: 20px"><span style="font-weight: bold">甲方负责人：</span>{{detailData.firstPartyUserName}}</span>
              <span style="margin-right: 20px"><span style="font-weight: bold">起止日期：</span>{{detailData.startTime}} - {{detailData.endTime}}</span>
            </li>
            <li>
              <span style="margin-right: 20px"><span style="font-weight: bold">主导单位：</span>{{detailData.officeName}}</span>
              <span style="margin-right: 20px"><span style="font-weight: bold">项目经理：</span>{{detailData.projectManagerName}}</span>
            </li>
            <li><span style="font-weight: bold">项目备注：</span>{{detailData.remarks}}</li>
            <li><span style="font-weight: bold">项目位置：</span>{{detailData.provinceName}}{{detailData.cityName}}{{detailData.districtName}}{{detailData.specificAddress}}</li>
          </ul>
        </TabPane>
        <TabPane label="任务" name="name2">
          <tables ref="tables1" :total="this.total1" :columns="columns1" v-model="tableData1" :taskListBtnVisible="true" @on-edit="onEdit1"/>
        </TabPane>
        <TabPane label="项目物资" name="name3">
          <div style="margin-bottom: 10px" v-if="this.detailData.status !== '4'">
            <div>
              <Button type="primary" @click="materialModel = true">物资加入项目申请</Button>
            </div>
          </div>
          <tables ref="tables2" :total="this.total2" :columns="columns2" v-model="tableData2"/>
        </TabPane>
        <TabPane label="项目团队" name="name4">
          <div style="margin-bottom: 10px" v-if="this.detailData.status !== '4'">
            <div>
              <Button type="primary" style="margin-right: 5px" @click="zdfxmjl">指定副项目经理</Button>
              <Button type="primary" @click="joinModel = true">人员加入项目申请</Button>
            </div>
          </div>
          <tables ref="tables3" :total="this.total3" :columns="columns3" v-model="tableData3"/>
        </TabPane>
      </Tabs>
    </Card>
    <Modal
      v-model="statusModel"
      title="项目状态修改申请">
      <Form ref="formItemStatus" :model="formItemStatus" :rules="ruleCustom" :label-width="130">
        <FormItem label="项目名称：">
          <Row>
            <Col span="11">
              {{detailData.name}}
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
    <Modal
      v-model="materialModel"
      title="物资加入项目申请">
      <Form ref="formItemMaterial" :model="formItemMaterial" :rules="ruleCustom3" :label-width="130">
        <FormItem label="物资归属单位：">
          <Row>
            <Col span="11">
              <Select v-model="formItemMaterial.materOfficeId" placeholder="请选择" label-in-value @on-change="materialChange">
                <Option v-for="(item, key) in unitList" :key="key" :value="item.id">{{item.name}}</Option>
              </Select>
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
        <FormItem label="需求描述及原因：" prop="remark">
          <Row>
            <Col span="20">
              <Input v-model="formItemMaterial.comment" type="textarea" :autosize="{minRows: 3,maxRows: 5}" style="width: 100%"/>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="statusModel = false">取消</Button>
        <Button type="primary" size="large" @click="saveMaterial">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="joinModel"
      title="人员加入项目申请">
      <Form ref="formItemJoin" :model="formItemJoin" :rules="ruleCustom2" :label-width="130">
        <FormItem label="人员归属单位：">
          <Row>
            <Col span="11">
              <Select v-model="formItemJoin.officeId" placeholder="请选择" label-in-value @on-change="joinChange">
                <Option v-for="(item, key) in unitList" :key="key" :value="item.id">{{item.name}}</Option>
              </Select>
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
        <FormItem label="需求描述及原因：" prop="remark">
          <Row>
            <Col span="20">
              <Input v-model="formItemJoin.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" style="width: 100%"/>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="statusModel = false">取消</Button>
        <Button type="primary" size="large" @click="saveJoin">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="allocatePanel"
      width="600"
      title="分配用户"
      @on-ok="save"
    >
      <Select v-model="unit" style="width:200px; margin-bottom: 15px" @on-change="selectUnit">
        <Option v-for="item in unitList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <Transfer
        :data="allocateData"
        :target-keys="targetKeys"
        :render-format="allocateRender"
        :list-style="listStyle"
        @on-change="handleChange"
        :filterable="true"
        :filter-method="filterMethod"
        :titles="transferTitles"
        not-found-text=""></Transfer>
    </Modal>
  </div>
</template>

<script>
import { selectProjectDetail, listTask, listProjectMaterial, listProjectUser, projectFunction, listProjectUserDistribution, getUnitList, addProjectManager, staffJoin, projectMaterialJoin } from '@/api/data'
import { getUserId, getOffice } from '@/libs/util'
import Tables from '_c/tables'
export default {
  name: 'projectDetail',
  components: { Tables },
  data () {
    return {
      formItemMaterial: {
        materOfficeName: '',
        materOfficeId: '',
        comment: ''
      },
      formItemJoin: {
        officeId: '',
        officeName: '',
        remark: ''
      },
      materialModel: false,
      joinModel: false,
      transferTitles: ['未分配', '已分配'],
      allocatePanel: false,
      allocateData: [],
      targetKeys: [],
      listStyle: {
        width: '254px',
        height: '300px'
      },
      unitList: [],
      officeId: '',
      unit: '',
      team: '',
      userName: getOffice().name,
      formItemStatus: {
        content: ''
      },
      ruleCustom: {
        content: [
          { required: true, message: '请输入申请原因', trigger: 'blur' }
        ]
      },
      ruleCustom2: {
        remark: [
          { required: true, message: '请输入申请原因', trigger: 'blur' }
        ]
      },
      ruleCustom3: {
        comment: [
          { required: true, message: '请输入申请原因', trigger: 'blur' }
        ]
      },
      statusModel: false,
      permissionCode: '',
      status: '',
      detailData: {},
      tableData1: [],
      tableData2: [],
      tableData3: [],
      total: 0,
      total1: 0,
      total2: 0,
      total3: 0,
      params: {
        projectId: this.$route.query.projectId,
        userId: getUserId()
      },
      params1: {
        pageSize: 10,
        page: 1,
        userId: getUserId(),
        businessProjectId: this.$route.query.projectId,
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
      params2: {
        pageSize: 10,
        page: 1,
        name: '',
        projectId: this.$route.query.projectId,
        materialCategoryId: '',
        userId: getUserId()
      },
      params3: {
        pageSize: 10,
        page: 1,
        id: this.$route.query.projectId,
        userId: getUserId(),
        officeId: ''
      },
      columns1: [
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
          slot: 'action2'
        }
      ],
      columns2: [
        { title: '物资名称', key: 'name' },
        { title: '物资单位', key: 'officeName' },
        { title: '物资数量', key: 'amount ' },
        { title: '已借数量', key: 'lendAmount' },
        { title: '剩余数量', key: 'surplusAmount' }
      ],
      columns3: [
        { title: '姓名', key: 'name' },
        { title: '所属单位', key: 'office' },
        { title: '项目角色',
          key: 'role',
          render: (h, params) => {
            let text = ''
            if (params.row.role === '0') {
              text = '项目经理'
            } else if (params.row.role === '1') {
              text = '项目副经理'
            } else {
              text = '任务负责人'
            }
            return h('div', { props: {} }, text)
          }
        },
        { title: '手机号码', key: 'phone' },
        { title: '邮箱', key: 'email' }
      ]
    }
  },
  methods: {
    zdfxmjl () {
      this.allocatePanel = !this.allocatePanel
    },
    back () {
      this.$router.back(-1)
    },
    joinChange () {
      console.log(arguments)
      this.formItemJoin.officeId = arguments[0].value
      this.formItemJoin.officeName = arguments[0].label
    },
    materialChange () {
      console.log(arguments)
      this.formItemMaterial.materOfficeId = arguments[0].value
      this.formItemMaterial.materOfficeName = arguments[0].label
    },
    saveMaterial () {
      projectMaterialJoin({
        projectId: this.detailData.id,
        materOfficeName: this.formItemMaterial.materOfficeName,
        materOfficeId: this.formItemMaterial.materOfficeId,
        userId: getUserId(),
        comment: this.formItemMaterial.comment
      }).then((res) => {
        console.log(res)
        this.$Message.info(res.data.msg)
      })
    },
    saveJoin () {
      staffJoin({
        projectId: this.detailData.id,
        userId: getUserId(),
        officeId: this.formItemJoin.officeId,
        office: this.formItemJoin.officeName,
        remark: this.formItemJoin.remark
      }).then((res) => {
        console.log(res)
        this.$Message.info(res.data.msg)
      })
    },
    save () {
      addProjectManager({
        ids: this.targetKeys,
        officeId: this.officeId,
        projectId: this.detailData.id,
        userId: getUserId()
      }).then((res) => {
        this.$Message.info(res.data.msg)
      })
    },
    selectUnit () {
      this.officeId = arguments[0]
      listProjectUserDistribution({
        officeId: this.officeId,
        projectId: this.detailData.id,
        userId: getUserId()
      }).then((res) => {
        console.log(res)
        if (res.data.status === '200') {
          res.data.data.wait.forEach((item, index) => {
            item.key = item.id
          })
          res.data.data.already.forEach((item, index) => {
            item.key = item.id
          })
          this.allocateData = res.data.data.wait.concat(res.data.data.already)
          this.targetKeys = this.getTargetKeys(res.data.data.already)
        }
      })
    },
    getTargetKeys (data) {
      return data.map(item => item.key)
    },
    allocateRender (item) {
      return item.text
    },
    handleChange (newTargetKeys) {
      this.targetKeys = newTargetKeys
      console.log(this.targetKeys)
    },
    filterMethod (data, query) {
      return data.text.indexOf(query) > -1
    },
    saveStatus () {
      this.$refs['formItemStatus'].validate((valid) => {
        if (valid) {
          projectFunction({
            'projectId': this.detailData.id,
            'userId': getUserId(),
            'functionType': this.permissionCode,
            'pauseStatus': this.detailData.pauseStatus === '0' ? '1' : '0'
          }).then((res) => {
            this.$Message.info(res.data.msg)
          })
        } else {
          return false
        }
      })
    },
    statusChange (permissionCode) {
      let txt = ''
      switch (permissionCode) {
        case '1':
          txt = '开始项目'
          break
        case '2':
          txt = '暂停/开始项目'
          break
        case '3':
          txt = '申请暂停/开始项目'
          break
        case '4':
          txt = '撤销项目'
          break
        case '5':
          txt = '申请撤销项目'
          break
        case '6':
          txt = '逾期催办'
          break
        case '7':
          txt = '提交审核'
          break
        case '8':
          txt = '删除项目'
          break
        case '99':
          this.$router.push({
            name: 'addTask'
          })
          break
      }
      this.status = txt
      this.permissionCode = permissionCode
      this.statusModel = true
    },
    sxxiugai () {
      console.log(this.detailData)
      this.$router.push({
        name: 'xmsxxg',
        query: {
          projectId: this.detailData.id,
          lat: this.detailData.lat,
          lng: this.detailData.lng
        }
      })
    },
    getData () {
      selectProjectDetail(this.params).then((res) => {
        console.log(res)
        this.detailData = res.data.data
      })
    },
    getData1 () {
      listTask(this.params1).then((res) => {
        this.tableData1 = res.data.data.taskDetailBeans
        this.total1 = Number(res.data.data.count)
      })
    },
    getData2 () {
      listProjectMaterial(this.params2).then((res) => {
        this.tableData2 = res.data.data.businessProjectMaterialBeanList
        this.total2 = Number(res.data.data.count)
      })
    },
    getData3 () {
      listProjectUser(this.params3).then((res) => {
        this.tableData3 = res.data.data.list
        this.total3 = Number(res.data.data.total)
        console.log(this.tableData3)
      })
    },
    onEdit1 (params, row) {
      if (params.permissionCode === '2') {
        this.$Modal.confirm({
          title: params.permissionCode === '2' ? '确定要' + (row.pauseStatus === '0' ? '暂停' : '开始') + '该任务吗？' : '确定要申请' + (row.pauseStatus === '0' ? '暂停' : '开始') + '该任务吗？',
          onOk: () => {
            taskFunction({
              'taskId': row.id,
              'userId': getUserId(),
              'functionType': params.permissionCode,
              'pauseStatus': row.pauseStatus === '0' ? '1' : '0'
            }).then((res) => {
              this.$Message.info(res.data.msg)
              this.getData()
            })
          }
        })
      } else {
        let str = ''
        switch (params.permissionCode) {
          case '1':
            str = '确定要下达该任务吗？'
            break
          case '3':
            str = '确定要撤销该任务吗？'
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
            taskFunction({
              'taskId': row.id,
              'userId': getUserId(),
              'functionType': params.permissionCode
            }).then((res) => {
              this.$Message.info(res.data.msg)
              this.getData()
            })
          }
        })
      }
    }
  },
  mounted () {
    console.log(getOffice())
    this.getData()
    this.getData1()
    this.getData2()
    this.getData3()
    getUnitList({
      'pageSize': 0,
      'page': 0,
      'name': '',
      'areaId': '',
      'type': '',
      'userId': getUserId()
    }).then(res => {
      if (res.data.status === '200') {
        this.unitList = res.data.data.list
      }
    })
  }
}
</script>

<style scoped lang="less">
  dd{
    display: inline-block;
    margin-right: 20px;
  }
  .btns{
    margin: 20px 0;
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
</style>
