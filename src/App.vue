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
.ivu-modal-header-inner{
  font-size: 18px !important;
  font-weight: bold !important;
  color: #515A6E !important;
}
.ivu-modal-footer{
  .ivu-btn-text{
    margin-right: 60px !important;
    width: 140px !important;
    height: 40px !important;
    color: #3483F3 !important;
    background-color: #F8F8F9 !important;
    border: 1px solid #E8EAEC !important;
  }
  .ivu-btn-default{
    margin-right: 60px !important;
    width: 140px !important;
    height: 40px !important;
    color: #3483F3 !important;
    background-color: #F8F8F9 !important;
    border: 1px solid #E8EAEC !important;
  }
  .ivu-btn-primary{
    width: 140px !important;
    height: 40px !important;
  }
}
.ivu-input-group-prepend, .ivu-input-group-append {
  border-radius: 0 !important;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
#app {
  .size;
}
.amap-logo{
  display: none !important;//去掉高德地图logo
}
.amap-copyright {
  opacity:0 !important;//去掉高德的版本号
}
.ivu-select-dropdown{
  padding: 0 !important;
}
</style>
