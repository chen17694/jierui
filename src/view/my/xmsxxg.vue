<template>
  <div>
    <Card>
      <p class="pageHead">项目属性修改</p>
      <Form ref="formItem" :model="formItem" :label-width="150" :rules="ruleValidate" >
        <FormItem label="项目名称">
          <Row>
            <Col span="11">
              <span>{{formItem.name}}</span>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="甲方负责人">
          <Row>
            <Col span="11">
              <Select v-model="formItem.firstPartyUserId" label-in-value @on-change="partAChange" filterable clearable>
                <Option v-for="(item, index) in firstPartyUser" :value="item.id " :key="index">{{item.name}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="项目起止日期">
          <Row>
            <Col span="11">
              <DatePicker
                type="daterange"
                placement="bottom-start"
                placeholder="请选择起止日期"
                style="width: 200px"
                :value="formItem.seTime"
                @on-change="deteChange"
              ></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="项目经理">
          <Row>
            <Col span="11">
              <Select v-model="formItem.projectManagerId" label-in-value @on-change="projectManagerChange" filterable clearable>
                <Option v-for="(item, index) in projectManager" :value="item.id " :key="index">{{item.name}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="项目备注">
          <Row>
            <Col span="11">
              <Input v-model="formItem.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
            </Col>
          </Row>
        </FormItem>
        <FormItem label="项目位置">
          <Row>
            <Col span="6">
              <Input v-model="formItem.position"/>
            </Col>
            <Col span="6">
              <Button type="primary" @click="toMap" v-if="formItem.lat && formItem.lng" style="margin-left: 10px">重新定位</Button>
              <Button type="primary" @click="toMap" v-else>重新定位</Button>
            </Col>
            <Col span="22" style="margin-top: 30px" v-if="formItem.lat && formItem.lng">
              <el-amap ref="map" :center="center" vid="amapDemo" :zoom="zoom" class="amap-demo" :events="events">
                <el-amap-marker v-for="(marker, index) in markers" :position="marker.position" :key="index" :vid="index"/>
              </el-amap>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="申请人员">
          <Row>
            <Col span="6">
              <span>{{sqry}}</span>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="申请原因">
          <Row>
            <Col span="6">
              <Input v-model="formItem.comment" type="textarea" :autosize="{minRows: 5,maxRows: 5}"/>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div class="btns">
        <Button type="primary" @click="save">提交</Button>
        <Button @click="back">返回</Button>
      </div>
    </Card>
  </div>
</template>

<script>
import { getUserList, projectAttributeModify, selectProjectDetail, listProjectUser } from '@/api/data'
import { getUserId, getOffice } from '@/libs/util'
export default {
  name: 'xmsxxg',
  data () {
    let self = this
    return {
      sqry: getOffice().name,
      markers: [],
      center: [this.$route.query.lng, this.$route.query.lat],
      zoom: 14,
      firstPartyUser: [],
      projectManager: [],
      detailData: {},
      formItem: {},
      ruleValidate: {
      },
      events: {
        init () {
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })
          geocoder.getAddress([self.formItem.lng, self.formItem.lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.formItem.position = result.regeocode.formattedAddress
              }
            }
          })
        }
      }
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    projectManagerChange () {
      this.formItem.projectManagerName = arguments[0].label
      this.formItem.projectManagerId = arguments[0].value
    },
    partAChange () {
      this.formItem.firstPartyUserName = arguments[0].label
      this.formItem.firstPartyUserId = arguments[0].value
    },
    addMarker () {
      let marker = {
        position: [this.$route.query.lng, this.$route.query.lat]
      }
      this.markers.push(marker)
    },
    save () {
      if ((this.detailData.firstPartyUserId === this.formItem.firstPartyUserId) && (this.detailData.startTime === this.formItem.startTime) && (this.detailData.completionTime === this.formItem.endTime) && (this.detailData.projectManagerId === this.formItem.projectManagerId) && (this.detailData.remarks === this.formItem.remarks) && (this.detailData.lat === this.formItem.lat) && (this.detailData.lng === this.formItem.lng)) {
        this.$Message.info('未做任何更改，无需提交')
      } else {
        let obj = {
          projectName: this.formItem.name,
          partAId: this.formItem.firstPartyUserId,
          partAName: this.formItem.firstPartyUserName,
          startTime: this.formItem.startTime,
          endTime: this.formItem.endTime,
          projectManagerId: this.formItem.projectManagerId,
          projectManagerName: this.formItem.projectManagerName,
          lng: this.formItem.lng,
          lat: this.formItem.lat,
          userId: getUserId(),
          comment: this.formItem.comment,
          projectId: this.detailData.id,
          remarks: this.formItem.remarks,
          address: this.formItem.position
        }
        projectAttributeModify(obj).then((res) => {
          this.$Message.info(res.data.msg)
        })
      }
    },
    getData () {
      selectProjectDetail({
        projectId: this.$route.query.projectId,
        userId: getUserId()
      }).then((res) => {
        this.detailData = res.data.data
        this.formItem = {
          lng: this.$route.query.lng,
          lat: this.$route.query.lat,
          comment: '',
          name: this.detailData.name,
          firstPartyUserId: this.detailData.firstPartyUserId,
          firstPartyUserName: this.detailData.firstPartyUserName,
          projectManagerId: this.detailData.projectManagerId,
          projectManagerName: this.detailData.projectManagerName,
          remarks: this.detailData.remarks,
          startTime: this.detailData.startTime,
          endTime: this.detailData.completionTime,
          seTime: [this.detailData.startTime, this.detailData.completionTime],
          position: this.detailData.provinceName + this.detailData.cityName + this.detailData.districtName + this.detailData.specificAddress
        }
        this.getUser()
        this.getProjectManager()
      })
    },
    deteChange () {
      this.formItem.startTime = arguments[0][0]
      this.formItem.endTime = arguments[0][1]
    },
    getUser () {
      getUserList({
        'pageSize': 0,
        'page': 0,
        'name': '',
        'office': this.detailData.firstPartyCompanyId,
        'role': '',
        'isLoginApp': ''
      }).then((res) => {
        if (res.data.status === '200') {
          this.firstPartyUser = res.data.data.list
        }
      })
    },
    getProjectManager () {
      let obj = {
        'pageSize': 0,
        'page': 0,
        'id': this.detailData.id,
        'officeId': this.detailData.officeId,
        'userId': getUserId(),
        'name': ''
      }
      listProjectUser(obj).then((res) => {
        if (res.data.status === '200') {
          this.projectManager = res.data.data.list
        }
      })
    },
    toMap () {
      this.$router.push({
        name: 'map',
        query: {
          name: 'xmsxxg',
          projectId: this.$route.query.projectId
        }
      })
    }
  },
  mounted () {
    this.getData()
    this.addMarker()
  }
}
</script>

<style scoped lang="less">
  .amap-demo{
    width: 100%;
    height: 300px;
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
</style>
