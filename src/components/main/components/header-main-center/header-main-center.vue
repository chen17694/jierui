<template>
  <div class="header-main-center" >
      <Menu mode="horizontal" @on-select="onSelect">
        <MenuItem name="1">
            <!-- <Icon type="ios-archive" /> -->
            <img :src="wza" style="width: 20px;height: 16px" alt="">
            我的物资
        </MenuItem>
        <MenuItem name="2">
            <!-- <Icon type="ios-people" /> -->
            <img :src="yqxx"  style="width: 18px;height: 18px" alt="">
            逾期信息
        </MenuItem>
        <MenuItem name="3">
          <!-- <Icon type="md-stats" /> -->
          <img :src="tjxx" style="width: 17px;height: 17px" alt="">
          统计信息
        </MenuItem>
        <MenuItem name="4">
            <!-- <Icon type="ios-create" /> -->
            <img :src="wdrb" style="width: 16px;height: 17px" alt="">
            我的日报
        </MenuItem>
        <MenuItem name="5">
          <!-- <Icon type="md-checkbox-outline" /> -->
          <img :src="shsp" style="width: 17px;height: 19px" alt="">
          <Badge :count="Count">
            审核审批
          </Badge>
        </MenuItem>
    </Menu>
  </div>
</template>

<script>
import { listWait } from '@/api/data'
import { getUserId } from '@/libs/util'
import { setTimeout } from 'timers'
import wza from '@/assets/images/wza.png'
import yqxx from '@/assets/images/yqxx.png'
import tjxx from '@/assets/images/tjxx.png'
import wdrb from '@/assets/images/wdrb.png'
import shsp from '@/assets/images/shsp.png'
export default {
  name: 'hearMainCenter',
  computed: {
    
  },
  data () {
    return {
      Count: 0,
      wza: wza,
      yqxx: yqxx,
      tjxx: tjxx,
      wdrb: wdrb,
      shsp: shsp
    }
  },
  props: {
    
  },
  created () {
    // this.getCount()
  },
  methods: {
    onSelect (val) {
      switch (val) {
        case '1':
          this.$router.push('/my/myMaterial')
          break;
        case '2':
          this.$router.push('/my/myOverdue/projectOverdue')
          break;
        case '3':
          this.$router.push('/statistics/projectStatistics')
          break;
        case '4':
          this.$router.push('/DailyReview/dailyList')
          break;
        case '5':
          this.$router.push('/my/myProcessed')
          break;
        default:
          break;

      }
    },
    getCount () {
      let obj = {
        page: 1,
        pageSize: 5000,
        id: getUserId()
      }
      listWait(obj).then(res => {
        if (res.status === '200') {
          this.Count = res.data.data.total
        }
      })
    }
  },
  mounted () {
    this.getCount()
  }
}
</script>

<style lang="less" scoped>
.header-main-center {
  position:absolute;
  left: 50%;
  transform: translateX(-50%);
  .ivu-menu-horizontal.ivu-menu-light:after{
    background-color: transparent;
  }
  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active,
  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active,
  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover,
  .ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover{
      border: none;
  }
  .ivu-menu-item img {
    // width: 16px;
    margin-right: 8px;
    vertical-align: middle;
  }
  .ivu-menu-item > i {
    margin-right: 0px!important;
    font-size: 20px;
  }
  /deep/  .ivu-badge-count{
      top: 14px;
      right: -11px;
    }
  }
</style>
