<template>
  <div class="MaterialAdd">
    <div class="head-title">新建消息推送</div>
    <Form ref="formInfo" :model="formInfo" :rules="ruleValidate" :label-width="180">
        <FormItem label="消息推送名称" prop="title">
          <Row>
              <Col span="20">
                <Input v-model="formInfo.title" :maxlength="20" placeholder="请输入消息标题"></Input>
              </Col>
              <Col span="4">
                  <div style="text-align:center;color:#808695;">(20字以内)</div>
              </Col>
          </Row>
        </FormItem>
        <FormItem label="推送单位" prop="officeId">
          <Row>
              <Col span="20">
                <Select v-model="formInfo.officeId" placeholder="请选择" label-in-value @on-change="officeCategoryChange" filterable clearable>
                  <Option v-for="(item, key) in officeCategory" :key="key" :value="item.value">{{item.label}}</Option>
                </Select>
              </Col>
          </Row>
        </FormItem>
        <FormItem label="消息推送范围" prop="score">
            <RadioGroup v-model="formInfo.score">
                <Radio label="1">按用户</Radio>
                <Radio label="2">按角色</Radio>
                <Radio label="3">按项目</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem v-if="formInfo.score" label="选择用户" prop="ids">
          <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
              <Checkbox
                  :indeterminate="indeterminate"
                  :value="checkAll"
                  @click.prevent.native="handleCheckAll">全选</Checkbox>
          </div>
          <CheckboxGroup v-model="formInfo.ids" @on-change="checkAllGroupChange">
              <Checkbox v-if="formInfo.score == '1'" v-for="(item, key) in userList" :key="key" :label="item.id">{{item.name}}</Checkbox>
              <Checkbox v-if="formInfo.score == '2'" v-for="(item, key) in roleList" :key="key" :label="item.id">{{item.name}}</Checkbox>
              <Checkbox v-if="formInfo.score == '3'" v-for="(item, key) in projectList" :key="key" :label="item.id">{{item.name}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="推送消息内容" prop="content">
          <Col span="20">
            <Input v-model="formInfo.content" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请填写推送消息内容"></Input>
          </Col>
          <Col span="4">
            <div style="text-align:center;color:#808695;">(300字以内)</div>
          </Col>
          <div style="clear:both"></div>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formInfo')">发送</Button>
            <Button @click="handleReset('formInfo')" style="margin-left: 8px">返回</Button>
        </FormItem>
    </Form>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getUserId, getOffice } from '@/libs/util'
import { listUserRole, listOffice, listRole, createMessage, getUserList, listProject } from '@/api/data'
export default {
  name: 'infoPush',
  components: { Tables },
  data () {
    return {
      projectList: [],
      userList: [],
      roleList: [],
      indeterminate: false,
      checkAll: false,
      checkAllGroup: [],
      categoryWarning: false,
      categoryLoading: true,
      officeCategory: [],
      materialCategory: [],
      materialCategoryName: '',
      formInfo: {
        userId: '',
        title: '',
        officeId: '',
        score: '',
        content: '',
        ids: []
      },
      ruleValidate: {
        title: [
          { required: true, message: '请输入少于20字的消息标题', trigger: 'blur' }
        ],
        score: [
          { required: true, message: ' ', trigger: 'change' }
        ],
        officeId: [
          { required: true, message: '请选择推送的单位', trigger: 'change' }
        ],
        ids: [
          { required: true, type: 'array', min: 1, message: '请至少选择一条数据', trigger: 'change' }
          // { type: 'array', min: 1, message: '请至少选择一条', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写少于300字的推送消息内容', trigger: 'blur' },
          { type: 'string', max: 300, message: '请填写少于300字的推送消息内容', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (getUserId()) {
      this.formInfo.userId = getUserId()
    }
    this.listUserRole()
    this.getUserList()
    this.ListProject()
    this.ListRole()
    this.ListOffice(() => {
      this.formInfo.officeId = getOffice().officeId // 默认设置，当前用户所属单位信息
      this.formInfo.officeName = getOffice().office
    })
  },
  methods: {
    ListProject () {
      let _this = this
      let params = {
        page: 0,
        pageSize: 5000,
        userId: getUserId()
      }
      listProject(params).then((res) => {
        if (res.data.status === '200') {
          _this.projectList = res.data.data.projectList.map((item) => {
            return {
              id: item.id,
              name: item.name
            }
          })
        }
      })
    },
    ListRole () {
      let _this = this
      let params = {
        page: 0,
        pageSize: 5000,
        type: '1'
      }
      listRole(params).then((res) => {
        if (res.data.status === '200') {
          _this.roleList = res.data.data.list
        }
      })
    },
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false

      if (this.checkAll) {
        if (this.formInfo.score === '1') {
          this.formInfo.ids = this.userList.map((item) => { return item.id })
        } else if (this.formInfo.score === '2') {
          this.formInfo.ids = this.roleList.map((item) => { return item.id })
        } else {
          this.formInfo.ids = this.projectList.map((item) => { return item.id })
        }
      } else {
        this.formInfo.ids = []
      }
    },
    checkAllGroupChange (data) {
      let List = []
      if (this.formInfo.score === '1') {
        List = this.userList
      } else if (this.formInfo.score === '2') {
        List = this.roleList
      } else {
        List = this.projectList
      }
      if (data.length === List.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.CreateMessage()
        } else {
          this.$Message.info('请检查填写信息！')
        }
      })
    },
    handleReset (name) {
      this.$router.push('infoList')
    },
    listUserRole () { // 角色
      let _this = this
      let params = {
        page: 0,
        pageSize: 1000,
        id: getUserId()
      }
      listUserRole(params).then((res) => {
        if (res.data.status === '200') {
          _this.officeCategory = res.data.data.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    },
    getUserList () { // 用户
      let params = {
        page: 1,
        pageSize: 5000
      }
      let _this = this
      getUserList(params).then((res) => {
        if (res.data.status) {
          _this.userList = res.data.data.list
        }
      })
    },
    CreateMessage () {
      let _this = this
      createMessage(_this.formInfo).then((res) => {
        if (res.data.status === '200') {
          _this.$Message.info(res.data.msg)
          _this.$router.push('infolist')
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    },
    officeCategoryChange (val) {
      this.formInfo.officeName = val.label
    },
    ListOffice (func) {
      let _this = this
      let params = {
        page: 0,
        pageSize: 1000,
        userId: getUserId()
      }
      listOffice(params).then((res) => {
        if (res.data.status === '200') {
          _this.officeCategory = res.data.data.list.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
          if (func && typeof func === 'function') {
            func()
          }
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .MaterialAdd{
    width: 50%;
  }
  .head-title{
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
</style>
