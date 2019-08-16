<template>
  <div class="user-avatar-dropdown">
    <Badge :dot="!!messageUnreadCount">
      <Icon type="ios-mail-outline" @click="message" style="font-size: 40px; margin: 0 10px"/>
    </Badge>
    <Dropdown :transfer="true" @on-click="handleClick" placement="bottom-end">
      <Avatar :src="userAvatar || userInfo.photo"/>
      <span style="margin: 0 10px">{{userInfo.name}}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list" @on-click="handleClick" >
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
    <span @click="logout" style="margin-left: 10px">退出</span>
    <Modal
      v-model="head"
      title="Common Modal dialog box title"
      @on-ok="setHead">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { getOffice } from '@/libs/util'
export default {
  name: 'User',
  data () {
    return {
      head: false,
      userName: getOffice().name,
      userAvatar: getOffice().photo,
      userInfo: getOffice()
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

    },
    setHead () {

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
  },
  mounted () {
    console.log(getOffice())
  }
}
</script>

<style scoped lang="less">
  .ivu-badge{
    /deep/ .ivu-badge-dot{
    top: 20px;
    right: 8px;
    }
  }
</style>
