<template>
  <div>
    <Card style="margin-bottom: 10px">
      <Steps :current="stepArr.length - 1 ">
        <Step :title="item.name" :content="item.userName ? item.userName + ' ' + item.action : '' + ' ' + item.action" v-for="(item, index) in stepArr" :key="index"></Step>
      </Steps>
    </Card>
    <Card style="margin-bottom: 10px">
      <h3 style="color: #2d8cf0; margin-bottom: 20px">任务路口状态信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px" v-if="detailData.status === '1'">任务状态：审核中</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '2'">任务状态：已完成</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '3'">任务状态：已驳回</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '4'">任务状态：已撤销</li>
        <li style="margin-bottom: 5px">逾期天数：{{detailData.days}}</li>
        <li style="margin-bottom: 5px">甲方评分：{{detailData.score}}</li>
      </ul>
      <h3 style="color: #2d8cf0; margin-bottom: 20px">路口基本信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">项目名称：{{detailData.projectName}}</li>
        <li style="margin-bottom: 5px">任务名称：{{detailData.taskName}}</li>
        <li style="margin-bottom: 5px">路口别名：{{detailData.alias}}</li>
        <li style="margin-bottom: 5px">任务负责人：{{detailData.taskHoldersName}}</li>
        <li style="margin-bottom: 5px">起止日期：{{detailData.startTime}} - {{detailData.endTime}}</li>
        <li style="margin-bottom: 20px">路口位置：{{detailData.address}}</li>
        <li>
          <el-amap ref="map" :center="center" vid="amapDemo" :zoom="zoom" class="amap-demo">
            <el-amap-marker v-for="(marker, index) in markers" :position="marker.position" :key="index" :vid="index"/>
          </el-amap>
        </li>
      </ul>
    </Card>
    <div class="btns" style="margin-top: 30px">
      <Button type="primary" @click="shenpi">审批</Button>
      <Button @click="back">返回</Button>
    </div>
    <Modal
      v-model="editPanel"
      title='任务路口审批'
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
        <FormItem label="甲方审批:" v-if="detailData.needForm === '1'">
          <RadioGroup v-model="editParams.needPartA">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { detailTaskCrossingApproval, opt } from '@/api/data'
import Tables from '_c/tables'
import { getUserId } from '@/libs/util'
export default {
  name: 'drwlksq',
  components: { Tables },
  data () {
    return {
      center: [116.397448, 39.908708],
      zoom: 14,
      markers: [],
      editParams: {
        comment: '',
        opt: '1',
        needPartA: '1'
      },
      detailData: {},
      tableData: [],
      stepArr: [],
      editPanel: false
    }
  },
  methods: {
    shenpi () {
      this.editPanel = true
    },
    addMarker () {
      let marker = {
        position: [this.detailData.lng, this.detailData.lat]
      }
      this.markers.push(marker)
    },
    save () {
      let obj = {
        opt: this.editParams.opt,
        taskId: this.$route.query.taskId,
        userId: getUserId(),
        comment: this.editParams.comment,
        processType: this.$route.query.type,
        taskForm: {
          needPartA: this.editParams.needPartA
        }
      }
      opt(obj).then((res) => {
        if (res.data.status === '200') {
          this.$router.push({
            name: 'myProcessed'
          })
        }
        this.$Message.info(res.data.msg)
      })
    },
    getData () {
      detailTaskCrossingApproval({
        taskId: this.$route.query.taskId,
        userId: getUserId(),
        type: '1'
      }).then((res) => {
        this.detailData = res.data.data
        this.addMarker()
        this.center = [this.detailData.lng, this.detailData.lat]
        this.stepArr = res.data.data.list
      })
    },
    back () {
      this.$router.push({
        name: 'myProcessed'
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
  .amap-demo{
    width: 700px;
    height: 300px;
  }
</style>
