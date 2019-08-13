<template>
  <div class="user-avatar-dropdown">
    <Dropdown :transfer="true" @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Avatar :src="userAvatar || userInfo.photo"/>
      </Badge>
      <span style="margin: 0 10px" @click="info">{{userInfo.name}}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list" @on-click="handleClick" >
        <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
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
        case 'logout': this.logout()
          break
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
