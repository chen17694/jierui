<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password" style="margin-bottom: 10px">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password" style="margin-bottom: 10px; margin-top: 20px;">
      <Row>
        <Col span="12">
          <Input type="text" v-model="checkCode" placeholder="请输入验证码">
            <span slot="prepend">
              <Icon :size="14" type="ios-key" />
            </span>
          </Input>
        </Col>
        <Col span="12" style="text-align: right">
          <div class="code" @click="refreshCode">
            <vertifyCode :fontSizeMin="30" :identifyCode="identifyCode"></vertifyCode>
          </div>
        </Col>
      </Row>
    </FormItem>
    <FormItem style="margin-bottom: 5px;">
      <div style=" display: flex; justify-content: space-between">
        <Checkbox v-model="autoLogin">自动登录</Checkbox>
        <p style="cursor: pointer">忘记密码</p>
      </div>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import vertifyCode from '../vertifyCode'
export default {
  name: 'LoginForm',
  components: {
    vertifyCode
  },
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      identifyCodes: '1234567890',
      identifyCode: '',
      form: {
        userName: '',
        password: ''
      },
      autoLogin: true,
      checkCode: ''
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  mounted () {
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
  },
  methods: {
    handleSubmit () {
      if (this.checkCode !== this.identifyCode) {
        this.$Message.info('验证码不正确')
        this.refreshCode()
        return false
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            autoLogin: this.autoLogin
          })
        }
      })
    },
    // createCode() {
    //   let code = '';
    //   const codeLength = 4; //验证码的长度
    //   const random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    //     'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //随机数
    //   for (let i = 0; i < codeLength; i++) { //循环操作
    //     let index = Math.floor(Math.random() * 36); //取得随机数的索引（0~35）
    //     code += random[index]; //根据索引取得随机数加到code上
    //   }
    //   this.checkCode = code; //把code值赋给验证码
    //   console.log(code)
    // },
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
      console.log(this.identifyCode)
    }
  }
}
</script>
