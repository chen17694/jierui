<template>
  <div class="user-avatar-dropdown" style="display: flex">
    <Badge :dot="!!messageUnreadCount" style="display: flex; align-items: center;">
      <img src="../../../../assets/images/message.png" style="width: 17px; margin-right: 46px" @click="message">
    </Badge>
    <Dropdown :transfer="true" placement="bottom-end">
      <Avatar :src="photo"/>
      <span style="margin: 0 10px; color: #cccccc">{{userInfo.name}}</span>
      <Icon type="ios-arrow-down" style="color: #cccccc"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="message">
          <div style="width: 200px">
            <ul style="list-style-type: none; line-height: 30px">
              <li>
                <span style="font-weight: bold">单位：</span>
                <span>{{userInfo.office}}</span>
              </li>
              <li>
                <span style="font-weight: bold">角色：</span>
                <span>{{userInfo.role}}</span>
              </li>
              <li>
                <span style="font-weight: bold">手机：</span>
                <span>{{userInfo.phone}}</span>
              </li>
              <li>
                <span style="font-weight: bold">邮箱：</span>
                <span>{{userInfo.email}}</span>
              </li>
            </ul>
            <ul style="list-style-type: none; display: flex">
              <li @click="openSetHead" style="margin-right: 10px">修改头像</li>
              <li @click="openSetPassWord" style="margin-right: 10px">修改密码</li>
            </ul>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <span @click="logout" style="margin-left: 60px; color: #2E8CEB; font-weight: bold">退出</span>
    <Modal
      v-model="head"
      title="修改头像"
      class="head"
      width="870">
      <div class="cropper-example cropper-first">
        <cropper
          v-if="head"
          ref="cropper"
          :src="exampleImageSrc"
          crop-button-text="确认提交"
          @on-crop="handleCroped"
          style="padding: 44px"
        ></cropper>
      </div>
      <div slot="footer">
        <Button @click="closeSetHead">取消</Button>
        <Button type="primary" style="width: 140px; height: 40px" @click="setHead">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="passWord"
      title="修改密码"
      class="passWord"
      width="712">
      <div style="padding: 44px">
        <p style="font-weight: bold; font-size: 26px; text-align: center;margin-bottom: 10px">密码修改</p>
        <p style="text-align: center;" v-show="sendDone">“杰瑞配时手机验证码”已发送至您的手机</p>
        <p style="font-weight: bold; font-size: 36px; text-align: center; margin-bottom: 20px">{{phone}}</p>
        <Form ref="formValidate" :rules="ruleValidate" :model="passWordForm" :label-width="130">
          <FormItem label="收到的验证码" prop="code">
            <Input v-model="passWordForm.code" style="width:280px"/>
            <Button type="primary" style="margin-left: 20px" :disabled="codeStatus" @click="sendCode">{{codeText}}</Button>
          </FormItem>
          <FormItem label="请输入新密码" prop="password">
            <Input v-model="passWordForm.password" style="width:280px"/>
          </FormItem>
          <FormItem label="请再次输入密码" prop="password2">
            <Input v-model="passWordForm.password2" style="width:280px"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text">取消</Button>
        <Button type="primary" @click="savePassWord">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions, mapMutations } from 'vuex'
import Cropper from '@/components/cropper'
import { uploadImgToAliOssHead, updateUserInfo, sendCodeGeneral, resetGeneral } from '@/api/data'
import { getOffice, getUserId } from '@/libs/util'
export default {
  name: 'User',
  components: {
    Cropper
  },
  data () {
    const validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        if (value === this.code) {
          callback()
        } else {
          callback(new Error('请输入正确的验证码'))
        }
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
      codeText: '发送验证码',
      time: 90,
      head: false,
      passWord: false,
      sendDone: false,
      codeStatus: false,
      code: '',
      phone: getOffice().phone,
      userInfo: {
        name: getOffice().name || '',
        office: getOffice().office || '',
        role: getOffice().role || '',
        phone: getOffice().phone || '',
        email: getOffice().email || ''
      },
      exampleImageSrc: '',
      file: '',
      passWordForm: {
        password: '',
        password2: '',
        code: ''
      },
      ruleValidate: {
        code: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        password2: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    messageUnreadCount: {
      type: Number,
      default: 0
    },
    userAvatar: {
      type: String,
      default: ''
    }
  },
  computed: {
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    photo: function () {
      return this.userAvatar
    }
  },
  watch: {
    file (val) {
      uploadImgToAliOssHead(val).then(res => {
        console.log(res)
        updateUserInfo({
          id: getUserId(),
          name: getOffice().name,
          photo: res[0]
        }).then((res) => {
          console.log(res)
          this.getUserInfo().then((res) => {
            this.$emit('get-user-avatar', res.data.photo)
            this.head = false
          })
        })
      })
    }
  },
  methods: {
    ...mapMutations([
      'setTagNavList'
    ]),
    ...mapActions([
      'handleLogOut',
      'getUserInfo'
    ]),
    sendCode () {
      sendCodeGeneral({
        'value': this.phone,
        'type': '1'
      }).then((res) => {
        console.log(res)
        if (res.data.status === '200') {
          this.code = res.data.data
          this.codeStatus = true
          let codeInterval = setInterval(() => {
            this.codeText = (this.time--) + '秒后从新发送'
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
          this.code = ''
        }
      })
    },
    savePassWord () {
      console.log(123)
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          resetGeneral({
            'value': this.passWordForm.password,
            'type': '1',
            'code': this.passWordForm.code
          }).then((res) => {
            this.$Message.info(res.data.msg)
            this.passWord = false
          })
        } else {
          return false
        }
      })
    },
    openSetPassWord () {
      this.passWord = true
    },
    openSetHead () {
      this.head = true
    },
    closeSetHead () {
      this.head = false
    },
    setHead () {
      this.$refs.cropper.crop()
    },
    handleCroped (file) {
      this.file = file
    },
    logout () {
      this.handleLogOut().then(() => {
        let res = this.tagNavList.filter(item => item.name === this.$config.homeName)
        this.setTagNavList(res)
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'infoList'
      })
    },
    info () {
      this.$router.push({
        name: 'userInfo'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'message': this.message()
          break
      }
    }
  }
}
</script>

<style scoped lang="less">
  .ivu-badge{
    /deep/ .ivu-badge-dot{
      top: 20px;
      right: 40px;
      background-color: #BC0000;
    }
  }
  .head {
    /deep/ .ivu-modal-footer{
      padding: 0 18px 60px 18px;
    }
  }
  .passWord {
    /deep/ .ivu-modal-footer{
      padding: 0 18px 60px 18px;
    }
  }
</style>
