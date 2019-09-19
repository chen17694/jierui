<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions, mapMutations } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    ...mapMutations([
      'closeStatistics'
    ]),
    handleSubmit ({ userName, password, autoLogin }) {
      this.handleLogin({ userName, password, autoLogin }).then((res) => {
        // this.getUserInfo().then(res => {
        //   this.$router.push({
        //     name: this.$config.homeName
        //   })
        // }))
        this.closeStatistics(false)
        this.$router.push({
          name: this.$config.homeName
        })
      }).catch((err) => {
        this.$Message.info(err)
      })
    }
  }
}
</script>

<style>

</style>
