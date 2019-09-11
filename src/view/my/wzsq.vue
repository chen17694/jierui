<template>
  <div>
    <Card style="margin-bottom: 10px">
      <Steps :current="stepArr.length - 1 ">
        <Step :title="item.name" :content="item.userName ? item.userName + ' ' + item.action : '' + ' ' + item.action" v-for="(item, index) in stepArr" :key="index"></Step>
      </Steps>
    </Card>
    <Card style="margin-bottom: 10px">
      <div v-if="detailData.status === '3'" style="margin-bottom: 10px">
        拒绝原因：{{detailData.rejectReason }}
      </div>
      <h3 style="color: #2d8cf0; margin-bottom: 20px">物资申请信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">项目名称：{{detailData.projectName}}</li>
        <li style="margin-bottom: 5px">任务名称：{{detailData.taskName}}</li>
        <li style="margin-bottom: 5px">申请人员：{{detailData.applyName}}</li>
      </ul>
    </Card>
    <tables ref="tables" v-model="tableData" :columns="columns" :showPage="false"></tables>
    <div class="btns" style="margin-top: 30px">
      <Button type="primary" @click="chexiao" v-if="detailData.isCancel === '1'">撤销</Button>
      <Button @click="back">返回</Button>
    </div>
  </div>
</template>

<script>
import { detailMaterialApplication, opt } from '@/api/data'
import Tables from '_c/tables'
import { getUserId } from '@/libs/util'
export default {
  name: 'wzsq',
  components: { Tables },
  data () {
    return {
      detailData: {},
      editParams: {
        comment: '',
        opt: '1'
      },
      tableData: [],
      stepArr: [],
      editPanel: false,
      columns: [
        { title: '物资类型', key: 'materialTypeName' },
        { title: '物资名称', key: 'materialName' },
        { title: '剩余数量', key: 'surplusNum' },
        { title: '申请数量', key: 'applyNum' },
        { title: '归还日期', key: 'returnDate' }
      ],
      projectMaterialJoinApproveForm: []
    }
  },
  methods: {
    chexiao () {
      this.$Modal.confirm({
        title: '确定要撤销申请吗？',
        onOk: () => {
          let obj = {
            opt: '3',
            taskId: this.$route.query.taskId,
            userId: getUserId(),
            processType: this.$route.query.type
          }
          opt(obj).then((res) => {
            if (res.data.status === '200') {
              this.$router.push({
                name: 'myApproval'
              })
            }
            this.$Message.info(res.data.msg)
          })
        }
      })
    },
    getData () {
      detailMaterialApplication({
        taskId: this.$route.query.taskId,
        userId: getUserId(),
        type: '2'
      }).then((res) => {
        this.tableData = this.projectMaterialJoinApproveForm = res.data.data.materialList
        this.stepArr = res.data.data.list
        this.detailData = res.data.data
      })
    },
    back () {
      this.$router.push({
        name: 'myApproval'
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped lang="less">
  .btns{
    text-align: center;
    .ivu-btn-primary{
      margin-right: 10px;
    }
    .ivu-btn{
      width: 80px;
    }
  }
</style>
