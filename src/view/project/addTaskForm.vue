<template>
  <div>
    <Card>
      <p class="pageHead">新建任务</p>
      <Form ref="formItem" :model="formItem" :label-width="150" :rules="ruleValidate" >
        <FormItem label="项目" prop="businessProjectId">
          <Row>
            <Col span="11">
              <Select v-model="formItem.businessProjectId" label-in-value @on-change="businessProjectOnChange">
                <Option v-for="(item, index) in businessProject" :value="item.id " :key="index">{{item.name}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="任务名称" prop="name">
          <Row>
            <Col span="11">
              <Input v-model="formItem.name" placeholder="请输入任务名称"/>
            </Col>
            <Col span="11">
              （20字以内）
            </Col>
          </Row>
        </FormItem>
        <FormItem label="任务类型" prop="type">
          <Row>
            <Col span="11">
              <Select v-model="formItem.type" label-in-value>
                <Option value="1">调查任务</Option>
                <Option value="2">优化任务</Option>
                <Option value="3">宣传任务</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="任务负责人" prop="taskHoldersId">
          <Row>
            <Col span="11">
              <Select v-model="formItem.taskHoldersId" label-in-value @on-change="taskHoldersOnChange">
                <Option v-for="(item, index) in taskHold" :value="item.id " :key="index">{{item.name}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="任务起止日期" prop="dates">
          <Row>
            <Col span="11">
              <DatePicker v-model="formItem.dates" type="daterange" placeholder="请选择任务起止日期" @on-change="dateChange" style="width: 200px"></DatePicker>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="任务性质" prop="nature">
          <Row>
            <Col span="11">
              <Select v-model="formItem.nature" label-in-value>
                <Option value="1">单点优化</Option>
                <Option value="2">线优化</Option>
                <Option value="3">区域优化</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="任务位置">
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
        <FormItem label="任务描述" prop="remarks">
          <Row>
            <Col span="11">
              <Input v-model="formItem.remarks" type="textarea" :autosize="{minRows: 7,maxRows: 7}" placeholder="请填写任务描述内容" />
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
import { listProject, addTask, listProjectUser } from '@/api/data'
import { getUserId } from '@/libs/util'
export default {
  name: 'addTaskForm',
  data () {
    const self = this
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
        businessProjectId: this.$route.query.projectId ? this.$route.query.projectId : '',
        businessProjectName: '',
        name: '',
        type: '',
        taskHoldersId: '',
        dates: [],
        nature: '',
        location: '',
        remarks: '',
        provinceName: '',
        cityName: '',
        districtName: '',
        specificAddress: '',
        lng: this.$route.params.lng,
        lat: this.$route.params.lat
      },
      ruleValidate: {
        name: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        businessProjectId: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        taskHoldersId: [
          { required: true, message: '请选择任务负责人', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择任务类型', trigger: 'change' }
        ],
        nature: [
          { required: true, message: '请选择任务性质', trigger: 'change' }
        ],
        dates: [
          { required: true, validator: validateDates, trigger: 'change' }
        ],
        remarks: [
          { required: true, message: '请填写任务描述内容', trigger: 'blur' }
        ]
      },
      businessProject: [],
      taskHold: [],
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
    taskHoldersOnChange () {
      this.formItem.taskHoldersName = arguments[0].label
    },
    businessProjectOnChange () {
      this.formItem.businessProjectName = arguments[0].label
      listProjectUser({
        pageSize: 0,
        page: 0,
        id: arguments[0].value,
        userId: getUserId(),
        officeId: ''
      }).then((res) => {
        console.log(res)
        this.taskHold = res.data.data.list
      })
    },
    dateChange () {
      this.formItem.startTime = arguments[0][0]
      this.formItem.completionTime = arguments[0][1]
    },
    reLocation () {
      this.$router.push({
        name: 'addTask'
      })
    },
    addMarker () {
      let marker = {
        position: [this.$route.params.lng, this.$route.params.lat]
      }
      this.markers.push(marker)
    },
    save () {
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          addTask({
            'name': this.formItem.name,
            'businessProjectId': this.formItem.businessProjectId,
            'businessProjectName': this.formItem.businessProjectName,
            'type': this.formItem.type,
            'completionTime': this.formItem.completionTime,
            'startTime': this.formItem.startTime,
            'taskHoldersId': this.formItem.taskHoldersId,
            'taskHoldersName': this.formItem.taskHoldersName,
            'nature': this.formItem.nature,
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
    }
  },
  mounted () {
    this.addMarker()
    listProject({
      pageSize: 0,
      page: 0,
      userId: getUserId(),
      projectName: '',
      firstPartyCompanyId: '',
      projectManagerId: '',
      status: '',
      firstPartyScoring: '',
      provinceName: '',
      cityName: '',
      districtName: '',
      timeStatus: '',
      startTime: '',
      endTime: ''
    }).then((res) => {
      this.businessProject = res.data.data.projectList
    })
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
