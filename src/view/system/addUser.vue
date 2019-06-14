<template>
  <div>
    <Card>
      <p class="pageHead">新增用户</p>
      <Form ref="formItem" :model="formItem" :label-width="150" :rules="ruleValidate" >
        <FormItem label="用户名" prop="userName">
          <Row>
            <Col span="11">
              <Input v-model="formItem.userName" placeholder="请输入用户名"/>
            </Col>
            <Col span="11">
              （4-16个字符，只包含英文和数字）
            </Col>
          </Row>
        </FormItem>
        <FormItem label="手机号码" prop="phone">
          <Row>
            <Col span="11">
              <Input v-model="formItem.phone" placeholder="请输入手机号码"/>
            </Col>
            <Col span="11">
              （11位数字）
            </Col>
          </Row>
        </FormItem>
        <FormItem label="邮箱地址" prop="email">
          <Row>
            <Col span="11">
              <Input v-model="formItem.email" placeholder="请输入正确的邮箱地址"/>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Row>
            <Col span="11">
              <Input v-model="formItem.name" placeholder="请输入用户姓名"/>
            </Col>
            <Col span="11">
              （2-6个中文字符）
            </Col>
          </Row>
        </FormItem>
        <FormItem label="初始密码" prop="password">
          <Row>
            <Col span="11">
              <Input v-model="formItem.password" placeholder="请输入初始密码"/>
            </Col>
            <Col span="11">
              （6-20个字符，包含大小写英文、下划线、数字）
            </Col>
          </Row>
        </FormItem>
        <FormItem label="校验密码" prop="confirm">
          <Row>
            <Col span="11">
              <Input v-model="formItem.confirm" placeholder="请再次输入初始密码"/>
            </Col>
            <Col span="11">
              （请再次输入初始密码）
            </Col>
          </Row>
        </FormItem>
        <FormItem label="性别">
          <RadioGroup v-model="formItem.sex">
            <Radio label="1">男</Radio>
            <Radio label="0">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="归属单位" prop="officeId">
          <Row>
            <Col span="11">
              <Select v-model="formItem.officeId">
                <Option v-for="item in unitList" :value="item.id" :key="item.id">{{item.name}}</Option>
              </Select>
            </Col>
            <Col span="11" style="padding-left: 10px">
              <Icon type="ios-alert-outline" size="24" color="#57a3f3"/>
            </Col>
            <Col span="16" style="margin-top: 30px">
              <Alert style="padding: 20px">
                <div style="display: flex;align-items: center;margin-bottom: 10px">
                  <Icon type="ios-alert-outline" size="24" color="#57a3f3" style="margin-right:5px"/>
                  <span style="font-size: 16px; font-weight: bold">帮助提示</span>
                </div>
                <div style="padding-left: 29px">
                  1.根据所选单位类型设置用户角色。<br><br>

                  2.非甲方单位可以将用户角色设置为业务主管、项目主管、一线员工或其他新增的角色。<br><br>

                  3.每个单位中只可以设置一名业务主管。<br><br>

                  4.当单位选择的是总部单位并设置为业务主管时，此业务主管为总公司业务主管。其他下属单位设置的业务主管为分公司业务主管。<br><br>

                  5.甲方单位只可以将用户角色设置为甲方代表。
                </div>
              </Alert>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="角色" prop="role">
          <Row>
            <Col span="11">
              <Select v-model="formItem.role">
                <Option value="beijing">经理</Option>
                <Option value="shanghai">员工</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="是否允许登录APP">
          <RadioGroup v-model="formItem.isApp">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
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
import { insertOrUpdateUser, getUnitList } from '@/api/data'
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      const eEeg = /^[0-9a-zA-Z_]{6,20}$/
      if (!eEeg.test(value)) {
        callback(new Error('密码长度需为6-20个字符,包含大小写英文、下划线、数字'))
      } else {
        if (this.formItem.confirm !== '') {
          this.$refs.formItem.validateField('confirm')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入初始密码'))
      } else if (value !== this.formItem.password) {
        callback(new Error('两次密码输入不一致，请重新输入'))
      } else {
        callback()
      }
    }
    const validateUserName = (rule, value, callback) => {
      const eReg = /^[A-Za-z0-9]+$/
      if (value === '') {
        callback(new Error('请输入4-16个字符的用户名'))
      } else if (value.length < 4 || value.length > 16) {
        callback(new Error('请输入4-16个字符的用户名'))
      } else if (!eReg.test(value)) {
        callback(new Error('包含非法字符'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      const eReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (!eReg.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      const eReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!eReg.test(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      const eReg = /^[\u4e00-\u9fa5]+$/
      if (value.length < 2 || value.length > 6) {
        callback(new Error('请输入2-6个字符的中文字符'))
      } else if (!eReg.test(value)) {
        callback(new Error('请输入2-6个字符的中文字符'))
      } else {
        callback()
      }
    }
    return {
      formItem: {
        userName: '',
        phone: '',
        email: '',
        name: '',
        password: '',
        confirm: '',
        sex: '',
        officeId: '',
        role: '',
        isApp: ''
      },
      ruleValidate: {
        userName: [
          { required: true, validator: validateUserName, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        name: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        confirm: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ],
        officeId: [
          { required: true, message: '请选择用户归属单位', trigger: 'change' }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ]
      },
      unitList: []
    }
  },
  methods: {
    save () {
      insertOrUpdateUser({
        'loginName': this.formItem.userName,
        'phone': this.formItem.phone,
        'photo': '',
        'email': this.formItem.email,
        'name': this.formItem.name,
        'password': this.formItem.password,
        'sex': this.formItem.sex,
        'isLoginApp': this.formItem.isApp,
        'officeId': this.formItem.officeId,
        'roleId': this.formItem.roleId,
        'userId': this.formItem.userId
      }).then()
    }
  },
  mounted () {
    getUnitList({
      'pageSize': 100,
      'page': 1,
      'name': '',
      'areaId': '',
      'type': '',
      'userId': 'd3c6b26c272f4b0c96ec8f7a3062230b'
    }).then(res => {
      if (res.data.status === '200') {
        this.unitList = res.data.data.list
      } else {
        this.$Message.info('操作失败，请重试！')
      }
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
</style>
