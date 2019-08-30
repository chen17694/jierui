<template>
  <div class="user-avatar-dropdown" style="display: flex">
    <Badge :dot="!!messageUnreadCount" style="display: flex; align-items: center;">
      <img src="../../../../assets/images/message.png" style="width: 17px; margin-right: 46px" @click="message">
    </Badge>
    <Dropdown :transfer="true" placement="bottom-end">
      <Avatar :src="userInfo.photo"/>
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
            <ul style="list-style-type: none">
              <li @click="openSetHead">修改头像</li>
              <li @click="openSetPassWord">修改密码</li>
            </ul>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <span @click="logout" style="margin-left: 60px; color: #2E8CEB; font-weight: bold">退出</span>
    <Modal
      v-model="head"
      title="修改头像"
      width="622"
      @on-ok="setHead">
      <div class="cropper-example cropper-first">
        <cropper
          :src="exampleImageSrc"
          crop-button-text="确认提交"
          @on-crop="handleCroped"
        ></cropper>
      </div>
    </Modal>
    <!--<Modal-->
      <!--v-model="passWord"-->
      <!--title="修改密码"-->
      <!--@on-ok="setPassWord">-->
      <!--<div class="cropper-example cropper-first">-->
        <!--<Form ref="formValidate" :model="passWordForm" :label-width="80">-->
          <!--<FormItem label="请输入新密码" prop="password">-->
            <!--<Input v-model="passWordForm.password" placeholder="Enter your name"/>-->
          <!--</FormItem>-->
        <!--</Form>-->
      <!--</div>-->
    <!--</Modal>-->
  </div>
</template>

<script>
import './user.less'
import { mapActions, mapMutations } from 'vuex'
import Cropper from '@/components/cropper'
import { uploadImgToAliOssHead, updateUserInfo } from '@/api/data'
import { getOffice, getUserId } from '@/libs/util'
export default {
  name: 'User',
  components: {
    Cropper
  },
  data () {
    return {
      head: false,
      passWord: false,
      userInfo: {
        name: getOffice().name || '',
        office: getOffice().office || '',
        role: getOffice().role || '',
        phone: getOffice().phone || '',
        email: getOffice().email || '',
        photo: getOffice().photo || ''
      },
      exampleImageSrc: '',
      file: '',
      passWordForm: {
        password: '',
        code: ''
      }
    }
  },
  props: {
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    tagNavList () {
      return this.$store.state.app.tagNavList
    }
  },
  methods: {
    ...mapMutations([
      'setTagNavList'
    ]),
    ...mapActions([
      'handleLogOut'
    ]),
    openSetPassWord () {
      this.passWord = true
    },
    openSetHead () {
      this.head = true
    },
    setHead () {
      uploadImgToAliOssHead(this.file).then(res => {
        updateUserInfo({
          id: getUserId(),
          name: getOffice().name,
          photo: res[0]
        }).then((res) => {
        })
      })
    },
    setPassWord () {

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
  .cropper-example{
    height: 400px;
  }
</style>
