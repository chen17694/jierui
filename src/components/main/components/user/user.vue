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
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import Cropper from '@/components/cropper'
import { uploadImgToAliOssHead } from '@/api/data'
import { getOffice } from '@/libs/util'
export default {
  name: 'User',
  components: {
    Cropper
  },
  data () {
    return {
      head: false,
      userInfo: {
        name: getOffice().name || '',
        office: getOffice().office || '',
        role: getOffice().role || '',
        phone: getOffice().phone || '',
        email: getOffice().email || '',
        photo: getOffice().photo || ''
      },
      exampleImageSrc: '',
      file: ''
    }
  },
  props: {
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    openSetHead () {
      this.head = true
    },
    setHead () {
      uploadImgToAliOssHead(this.file).then(res => {
        console.log(res)
      })
    },
    handleCroped (file) {
      console.log(file)
      this.file = file
    },
    logout () {
      this.handleLogOut().then(() => {
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
