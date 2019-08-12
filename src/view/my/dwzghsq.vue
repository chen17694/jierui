<template>
  <div>
    <Card style="margin-bottom: 10px">
      <Steps :current="stepArr.length - 1 ">
        <Step :title="item.name" :content="item.userName ? item.userName + ' ' + item.action : '' + ' ' + item.action" v-for="(item, index) in stepArr" :key="index"></Step>
      </Steps>
    </Card>
    <Card style="margin-bottom: 10px">
      <h3 style="color: #2d8cf0; margin-bottom: 20px">物资申请信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">项目名称：{{detailData.projectName}}</li>
        <li style="margin-bottom: 5px">任务名称：{{detailData.taskName}}</li>
        <li style="margin-bottom: 5px">申请人员：{{detailData.applyName}}</li>
      </ul>
    </Card>
    <tables ref="tables" v-model="tableData" :columns="columns" :showPage="false"></tables>
    <div class="btns" style="margin-top: 30px">
      <Button type="primary" @click="shenpi">审批</Button>
      <Button @click="back">返回</Button>
    </div>
    <Modal
      v-model="editPanel"
      title='物资归还审批'
      @on-ok="save"
    >
      <Form ref="editParams" :model="editParams">
        <FormItem label="审批结果:">
          <RadioGroup v-model="editParams.opt">
            <Radio label="1">同意</Radio>
            <Radio label="2">拒绝</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="拒绝原因:">
          <Input v-model="editParams.comment" :disabled="editParams.opt === '1'" type="textarea" style="width: 80%" :autosize="{minRows: 5,maxRows: 10}"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { detailMaterialReturnService, opt } from '@/api/data'
import Tables from '_c/tables'
import { getUserId } from '@/libs/util'
export default {
  name: 'dwzghsq',
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
        { title: '已借数量', key: 'borrowedNum' },
        { title: '归还数量', key: 'returnNum ' },
        { title: '申请日期', key: 'applyTime' },
        { title: '预计归还日期', key: 'returnDate' }
      ],
      projectMaterialJoinApproveForm: []
    }
  },
  methods: {
    back () {
      this.$router.push({
        name: 'myApproval'
      })
    },
    shenpi () {
      this.editPanel = true
    },
    save () {
      let arr = this.projectMaterialJoinApproveForm
      let obj = {
        opt: this.editParams.opt,
        taskId: this.$route.params.data.taskId,
        userId: getUserId(),
        comment: this.editParams.comment,
        processType: this.$route.params.data.type,
        projectMaterialJoinApproveForm: {
          list: arr
        }
      }
      console.log(obj)
      opt(obj).then((res) => {
        console.log(res)
        this.$Message.info(res.data.msg)
      })
    },
    getData () {
      detailMaterialReturnService({
        taskId: this.$route.params.data.taskId,
        userId: getUserId(),
        type: '1'
      }).then((res) => {
        console.log(res.data.data)
        this.tableData = this.projectMaterialJoinApproveForm = res.data.data.materialList
        this.stepArr = res.data.data.list
        this.detailData = res.data.data
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
