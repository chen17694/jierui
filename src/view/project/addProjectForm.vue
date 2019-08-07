<template>
  <div>
    <Card>
      <p class="pageHead">新建项目</p>
      <Form ref="formItem" :model="formItem" :label-width="150" :rules="ruleValidate" >
        <FormItem label="项目名称" prop="name">
          <Row>
            <Col span="11">
              <Input v-model="formItem.name" placeholder="请输入项目名称"/>
            </Col>
            <Col span="11">
              （20字以内）
            </Col>
          </Row>
        </FormItem>
        <FormItem label="甲方公司" prop="firstPartyCompanyId">
          <Row>
            <Col span="11">
              <Select v-model="formItem.firstPartyCompanyId" label-in-value @on-change="firstPartyCompanyOnChange">
                <Option v-for="(item, index) in firstPartyCompany" :value="item.id " :key="index">{{item.name}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="甲方负责人" prop="firstPartyUserId">
          <Row>
            <Col span="11">
              <Select v-model="formItem.firstPartyUserId" label-in-value @on-change="firstPartyUserOnChange">
                <Option v-for="(item, index) in firstPartyUser" :value="item.id " :key="index">{{item.name}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="项目起止日期" prop="dates">
          <Row>
            <Col span="11">
              <DatePicker v-model="formItem.dates" type="daterange" placeholder="请选择项目起止日期" @on-change="dateChange" style="width: 200px"></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="项目主导单位">
          <Row>
            <Col span="11">
              {{this.formItem.officeName}}
            </Col>
          </Row>
        </FormItem>
        <FormItem label="项目经理" prop="projectManagerId">
          <Row>
            <Col span="11">
              <Select v-model="formItem.projectManagerId" label-in-value @on-change="projectManagerOnChange">
                <Option v-for="(item, index) in projectManager" :value="item.id " :key="index">{{item.name}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="项目位置">
          <Row>
            <Col span="11">
              {{formItem.location}}
              <Button type="primary" @click="reLocation" v-if="formItem.lat && formItem.lng" style="margin-left: 10px">重新定位</Button>
              <Button type="primary" @click="reLocation" v-else>重新定位</Button>
            </Col>
            <Col span="14" style="margin-top: 30px" v-if="formItem.lat && formItem.lng">
              <el-amap ref="map" :center="center" vid="amapDemo" :zoom="zoom" class="amap-demo" :events="events">
                <el-amap-marker v-for="(marker, index) in markers" :position="marker.position" :key="index" :vid="index"/>
              </el-amap>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="项目备注" prop="remarks">
          <Row>
            <Col span="11">
              <Input v-model="formItem.remarks" type="textarea" :autosize="{minRows: 7,maxRows: 7}" placeholder="请填写项目备注内容" />
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div class="btns">
        <Button type="primary" @click="this.save">保存</Button>
        <Button>返回</Button>
      </div>
    </Card>
  </div>
</template>

<script>
import { getUnitList, getUserList, addProject } from '@/api/data'
import { getUserId, getOffice } from '@/libs/util'
export default {
  name: 'addProjectForm',
  data () {
    let self = this
    const validateName = (rule, value, callback) => {
      if (value === '' || value.length > 20) {
        callback(new Error('请输入项目名称(20字以内)'))
      } else {
        callback()
      }
    }
    const validateDates = (rule, value, callback) => {
      if (value.some((item) => {
        return item === ''
      })) {
        callback(new Error('请选择起止日期'))
      } else {
        callback()
      }
    }
    return {
      center: [this.$route.params.lng, this.$route.params.lat],
      zoom: 14,
      formItem: {
        name: '',
        firstPartyCompanyId: '',
        firstPartyCompanyName: '',
        firstPartyUserId: '',
        firstPartyUserName: '',
        startTime: '',
        completionTime: '',
        officeName: getOffice().office,
        officeId: getOffice().officeId,
        projectManagerId: '',
        projectManagerName: '',
        location: '',
        lng: this.$route.params.lng,
        lat: this.$route.params.lat,
        remarks: '',
        dates: []
      },
      ruleValidate: {
        name: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        firstPartyCompanyId: [
          { required: true, message: '请选择甲方公司', trigger: 'change' }
        ],
        firstPartyUserId: [
          { required: true, message: '请选择甲方负责人', trigger: 'change' }
        ],
        dates: [
          { required: true, validator: validateDates, trigger: 'change' }
        ],
        projectManagerId: [
          { required: true, message: '请选择项目经理', trigger: 'change' }
        ],
        remarks: [
          { required: true, message: '请填写项目备注内容', trigger: 'blur' }
        ]
      },
      firstPartyCompany: [],
      firstPartyUser: [],
      projectManager: [],
      markers: [],
      events: {
        init () {
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })
          geocoder.getAddress([self.formItem.lng, self.formItem.lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              console.log(result)
              if (result && result.regeocode) {
                self.formItem.location = result.regeocode.formattedAddress
                self.formItem.provinceName = result.regeocode.addressComponent.province
                self.formItem.districtName = result.regeocode.addressComponent.district
                self.formItem.specificAddress = result.regeocode.addressComponent.township + result.regeocode.addressComponent.street + result.regeocode.addressComponent.streetNumber
                switch (result.regeocode.addressComponent.citycode) {
                  case ('010') :
                    self.formItem.cityName = '北京'
                    break
                  case ('022') :
                    self.formItem.cityName = '天津'
                    break
                  case ('021') :
                    self.formItem.cityName = '上海'
                    break
                  case ('023') :
                    self.formItem.cityName = '重庆'
                    break
                  default :
                    self.formItem.cityName = result.regeocode.addressComponent.city
                }
              }
            }
          })
        }
      }
    }
  },
  methods: {
    reLocation () {
      this.$router.push({
        name: 'addProject'
      })
    },
    projectManagerOnChange () {
      this.formItem.projectManagerName = arguments[0].label
    },
    save () {
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          addProject({
            'name': this.formItem.name,
            'firstPartyCompanyId': this.formItem.firstPartyCompanyId,
            'firstPartyCompanyName': this.formItem.firstPartyCompanyName,
            'firstPartyUserId': this.formItem.firstPartyUserId,
            'firstPartyUserName': this.formItem.firstPartyUserName,
            'startTime': this.formItem.startTime,
            'completionTime': this.formItem.completionTime,
            'projectManagerId': this.formItem.projectManagerId,
            'projectManagerName': this.formItem.projectManagerName,
            'officeId': this.formItem.officeId,
            'officeName': this.formItem.officeName,
            'lng': this.formItem.lng,
            'lat': this.formItem.lat,
            'remarks': this.formItem.remarks,
            'provinceName': this.formItem.provinceName,
            'cityName': this.formItem.cityName,
            'districtName': this.formItem.districtName,
            'specificAddress': this.formItem.specificAddress,
            'userId': getUserId()
          }).then((res) => {
            this.$Message.info(res.data.msg)
          })
        }
      })
    },
    addMarker () {
      let marker = {
        position: [this.$route.params.lng, this.$route.params.lat]
      }
      this.markers.push(marker)
    },
    dateChange () {
      this.formItem.startTime = arguments[0][0]
      this.formItem.completionTime = arguments[0][1]
    },
    firstPartyUserOnChange () {
      this.formItem.firstPartyUserName = arguments[0].label
    },
    firstPartyCompanyOnChange () {
      this.formItem.firstPartyCompanyName = arguments[0].label
      getUserList({
        'pageSize': 0,
        'page': 0,
        'name': '',
        'office': arguments[0].value,
        'role': '',
        'isLoginApp': ''
      }).then((res) => {
        if (res.data.status === '200') {
          this.firstPartyUser = res.data.data.list
        }
      })
    },
    getProjectManager () {
      getUserList({
        'pageSize': 0,
        'page': 0,
        'name': '',
        'office': this.formItem.officeId,
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
    }
  },
  mounted () {
    console.log(getOffice())
    this.getFirstPartyCompany()
    this.getProjectManager()
    this.addMarker()
  }
}
</script>

<style scoped  lang="less">
  .pageHead{
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .btns{
    text-align: center;
    margin-top: 50px;
    .ivu-btn{
      margin: 0 10px;
    }
  }
  .amap-demo{
    width: 100%;
    height: 300px;
  }
</style>
