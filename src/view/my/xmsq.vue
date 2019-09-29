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
      <h3 style="color: #2d8cf0; margin-bottom: 20px">项目状态信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px" v-if="detailData.status === '1'">任务状态：审核中</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '2'">任务状态：已完成</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '3'">任务状态：已驳回</li>
        <li style="margin-bottom: 5px" v-if="detailData.status === '4'">任务状态：已撤销</li>
        <li style="margin-bottom: 5px">逾期天数：{{detailData.days}}</li>
        <li style="margin-bottom: 5px">甲方评分：{{detailData.score}}</li>
      </ul>
      <h3 style="color: #2d8cf0; margin-bottom: 20px">项目基本信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">项目名称：{{detailData.projectName}}</li>
        <li style="margin-bottom: 5px">甲方公司：{{detailData.firstPartyCompanyName}}</li>
        <li style="margin-bottom: 5px">甲方负责人：{{detailData.firstPartyUserName}}</li>
        <li style="margin-bottom: 5px">起止日期：{{detailData.startTime}} - {{detailData.endTime}}</li>
        <li style="margin-bottom: 5px">主导单位：{{detailData.officeName}}</li>
        <li style="margin-bottom: 5px">项目经理：{{detailData.projectManagerName}}</li>
        <li style="margin-bottom: 5px">项目备注：{{detailData.remarks}}</li>
        <li style="margin-bottom: 20px">项目位置：{{detailData.address}}</li>
        <li>
          <el-amap ref="map" :center="center" vid="amapDemo" :zoom="zoom" class="amap-demo">
            <el-amap-marker v-for="(marker, index) in markers" :position="marker.position" :key="index" :vid="index"/>
          </el-amap>
        </li>
      </ul>
      <!--<h3 style="color: #2d8cf0; margin-bottom: 20px">附件</h3>-->
      <!--<Collapse accordion v-model="collapse1">-->
        <!--<Panel name="1">-->
          <!--史蒂夫·乔布斯-->
          <!--<div slot="content">-->
            <!--史蒂夫·乔布斯（Steve Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。-->
            <!--<Collapse accordion v-model="value4">-->
              <!--<Panel name="1-1">-->
                <!--iPhone-->
                <!--<p slot="content">iPhone，是美国苹果公司研发的智能手机，它搭载iOS操作系统。第一代iPhone于2007年1月9日由苹果公司前首席执行官史蒂夫·乔布斯发布，并在2007年6月29日正式发售。</p>-->
              <!--</Panel>-->
              <!--<Panel name="1-2">-->
                <!--iPad-->
                <!--<p slot="content">iPad是由苹果公司于2010年开始发布的平板电脑系列，定位介于苹果的智能手机iPhone和笔记本电脑产品之间，（屏幕中有4个虚拟程序固定栏）与iPhone布局一样，提供浏览网站、收发电子邮件、观看电子书、播放音频或视频、玩游戏等功能。由英国出生的设计主管乔纳森·伊夫（Jonathan Ive）（有些翻译为 乔纳森·艾维）领导的团队设计的，这个圆滑、超薄的产品反映出了伊夫对德国天才设计师Dieter Rams的崇敬之情。</p>-->
              <!--</Panel>-->
            <!--</Collapse>-->
          <!--</div>-->
        <!--</Panel>-->
        <!--<Panel name="2">-->
          <!--斯蒂夫·盖瑞·沃兹尼亚克-->
          <!--<p slot="content">斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。</p>-->
        <!--</Panel>-->
        <!--<Panel name="3">-->
          <!--乔纳森·伊夫-->
          <!--<p slot="content">乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。</p>-->
        <!--</Panel>-->
      <!--</Collapse>-->
    </Card>
    <div class="btns" style="margin-top: 30px">
      <Button type="primary" @click="chexiao" v-if="detailData.isCancel === '1'">撤销</Button>
      <Button @click="back">返回</Button>
    </div>
  </div>
</template>

<script>
import { detailProjectApproval, opt } from '@/api/data'
import Tables from '_c/tables'
import { getUserId } from '@/libs/util'
export default {
  name: 'xmsq',
  components: { Tables },
  data () {
    return {
      center: [116.397448, 39.908708],
      zoom: 14,
      markers: [],
      editParams: {
        comment: '',
        opt: '1'
      },
      detailData: {},
      tableData: [],
      stepArr: [],
      editPanel: false
    }
  },
  methods: {
    back () {
      this.$router.push({
        name: 'myProcessed'
      })
    },
    addMarker () {
      let marker = {
        position: [this.detailData.lng, this.detailData.lat]
      }
      this.markers.push(marker)
    },
    chexiao () {
      this.$Modal.confirm({
        title: '确定要撤销申请吗？',
        onOk: () => {
          let obj = {
            opt: '3',
            taskId: this.$route.params.data.taskId,
            userId: getUserId(),
            processType: this.$route.params.data.type
          }
          opt(obj).then((res) => {
            if (res.data.status === '200') {
              this.$router.push({
                name: 'myProcessed'
              })
            }
            this.$Message.info(res.data.msg)
          })
        }
      })
    },
    getData () {
      detailProjectApproval({
        taskId: this.$route.params.data.taskId,
        userId: getUserId(),
        type: '2'
      }).then((res) => {
        this.detailData = res.data.data
        this.addMarker()
        this.center = [this.detailData.lng, this.detailData.lat]
        this.stepArr = res.data.data.list
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
