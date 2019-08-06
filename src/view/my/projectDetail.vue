<template>
  <div>
    <Card>
      <h2>三牌楼小区内路口配时项目</h2>
      <dl style="margin-top: 30px">
        <dt style="font-size: 16px; font-weight: bold; margin-bottom: 10px">项目状态信息</dt>
        <dd>项目状态：未开始</dd>
        <dd>逾期天数：0</dd>
        <dd>项目进度：0%</dd>
        <dd>甲方评分：0</dd>
      </dl>
      <Tabs style="margin-top: 20px">
        <TabPane label="基本信息" name="name1">
          <ul style="line-height: 40px">
            <li><span style="font-weight: bold">项目名称</span>：三牌楼小区内路口配时项目</li>
            <li>
              <span style="margin-right: 20px"><span style="font-weight: bold">甲方公司：</span>三牌楼小区内路口配时项目</span>
              <span style="margin-right: 20px"><span style="font-weight: bold">甲方负责人：</span>三牌楼小区内路口配时项目</span>
              <span style="margin-right: 20px"><span style="font-weight: bold">起止日期：</span>三牌楼小区内路口配时项目</span>
            </li>
            <li>
              <span style="margin-right: 20px"><span style="font-weight: bold">主导单位：</span>三牌楼小区内路口配时项目</span>
              <span style="margin-right: 20px"><span style="font-weight: bold">项目经理：</span>三牌楼小区内路口配时项目</span>
            </li>
            <li><span style="font-weight: bold">项目备注：</span>三牌楼小区内路口配时项目</li>
            <li><span style="font-weight: bold">项目位置：</span>辽宁省沈阳皇姑区陵北街</li>
          </ul>
        </TabPane>
        <TabPane label="任务" name="name2">
          <tables ref="tables1" :total="this.total1" :columns="columns1" v-model="tableData1" :taskListBtnVisible="true" @on-edit="onEdit1"/>
        </TabPane>
        <TabPane label="项目物资" name="name3">
          <tables ref="tables2" :total="this.total2" :columns="columns2" v-model="tableData2"/>
        </TabPane>
        <TabPane label="项目团队" name="name3">
          <tables ref="tables3" :total="this.total3" :columns="columns3" v-model="tableData3"/>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import { listTask, listProjectMaterial, listProjectUser } from '@/api/data'
import { getUserId } from '@/libs/util'
import Tables from '_c/tables'
export default {
  name: 'projectDetail',
  components: { Tables },
  data () {
    return {
      tableData1: [],
      tableData2: [],
      tableData3: [],
      total1: 0,
      total2: 0,
      total3: 0,
      params1: {
        pageSize: 10,
        page: 1,
        userId: getUserId(),
        businessProjectId: this.$route.params.projectId,
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
        projectId: this.$route.params.projectId,
        materialCategoryId: '',
        userId: getUserId()
      },
      params3: {
        pageSize: 10,
        page: 1,
        id: this.$route.params.projectId,
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
        { title: '项目角色', key: 'role ' },
        { title: '手机号码', key: 'phone' }
      ]
    }
  },
  methods: {
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
    this.getData1()
    this.getData2()
    this.getData3()
  }
}
</script>

<style scoped lang="less">
  dd{
    display: inline-block;
    margin-right: 20px;
  }
</style>
