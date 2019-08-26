<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { setToken, getAutoLogin } from '@/libs/util'
export default {
  name: 'App',
  mounted () {
    window.onbeforeunload = function (e) {
      if (getAutoLogin() === 'false') {
        setToken('')
      }
    }
  }
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
