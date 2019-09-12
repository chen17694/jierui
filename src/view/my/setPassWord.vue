<template>
  <div>
    <div style="display: flex;align-items: center;background-color: rgb(0, 24, 46);padding: 0 150px;justify-content: space-between">
      <div style="display: flex; align-items: center; font-size: 20px; color: #ffffff; font-weight: bold">
        <img src="../../assets/images/logo.png" style="width: 60px; margin-right: 10px">
        杰瑞配时管理平台
      </div>
      <div>
        <p style="cursor: pointer; font-size: 16px; color: #ffffff" @click="back">登录平台</p>
      </div>
    </div>
    <div style="padding: 0 150px;">
      <div style="background-color: rgb(255, 255, 255);padding: 150px 0px; min-width: 552px; max-width: 582px;margin: 0 auto;">
        <Form ref="formValidate" :rules="ruleValidate" :model="passWordForm" :label-width="150">
          <FormItem label="输入您的账号" prop="id">
            <Input v-model="passWordForm.id" style="width:280px"/>
            <Button type="primary" style="margin-left: 20px" :disabled="codeStatus" @click="sendCode('1')">{{codeText}}</Button>
          </FormItem>
          <FormItem label="收到的验证码" prop="code">
            <Input v-model="passWordForm.code" style="width:280px"/>
          </FormItem>
          <FormItem label="请输入新密码" prop="password">
            <Input v-model="passWordForm.password" style="width:280px"/>
          </FormItem>
          <FormItem label="请再次输入密码" prop="password2">
            <Input v-model="passWordForm.password2" style="width:280px"/>
          </FormItem>
        </Form>
        <div style="text-align: center">
          <Button type="primary" style="margin-right: 30px" @click="save">确认</Button>
          <Button @click="back">返回</Button>
        </div>
      </div>
    </div>
    </div>

</template>

<script>

import { sendCode, resetPassword } from '@/api/data'
export default {
  name: 'setPassWord',
  data () {
    const validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      const eEeg = /^[0-9a-zA-Z_]{6,20}$/
      if (!eEeg.test(value)) {
        callback(new Error('密码长度需为6-20个字符,包含大小写英文、下划线、数字'))
      } else {
        if (this.passWordForm.password2 !== '') {
          this.$refs.formValidate.validateField('password2')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passWordForm.password) {
        callback(new Error('两次密码输入不一致，请重新输入'))
      } else {
        callback()
      }
    }
    return {
      userId: '',
      codeStatus: false,
      codeText: '发送验证码',
      code: '',
      time: 90,
      ruleValidate: {
        id: [
          { required: true, message: '请输入您的账号', trigger: 'blur' }
        ],
        code: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        password2: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ]
      },
      passWordForm: {
        password: '',
        password2: '',
        code: '',
        id: ''
      }
    }
  },
  methods: {
    save () {
      resetPassword({
        id: this.userId,
        code: this.passWordForm.code,
        password: this.passWordForm.password
      }).then((res) => {
        console.log(res)
        this.$Message.info(res.data.msg)
        if (res.data.status === '200') {
          this.back()
        }
      })
    },
    back () {
      this.$router.push({
        name: 'login'
      })
    },
    sendCode (type) {
      sendCode({
        'loginName': this.passWordForm.id
      }).then((res) => {
        console.log(res)
        if (res.data.status === '200') {
          this.userId = res.data.data.id
          this.codeStatus = true
          let codeInterval = setInterval(() => {
            this.codeText = (this.time--) + '秒后重新发送'
            if (this.time === 0) {
              clearInterval(codeInterval)
              this.time = 90
              this.codeText = '发送验证码'
              this.codeStatus = false
            }
          }, 1000)
          this.$Message.info(res.data.msg)
        } else {
          this.$Message.info(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
  body {
    background-color: #e4e4e4;
  }
</style>
