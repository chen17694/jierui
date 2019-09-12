<template>
  <div class="header-main-center" >
      <Menu mode="horizontal" @on-select="onSelect">
        <!-- <MenuItem name="1">
            <img :src="Name === '1' ? wza : wz" alt="">
            我的物资
        </MenuItem>
        <MenuItem name="2">
            <img :src="Name === '2' ? yqxxa : yqxx" alt="">
            逾期信息
        </MenuItem>
        <MenuItem name="3">
          <img :src="Name === '3' ? tjxxa : tjxx" alt="">
          统计信息
        </MenuItem>
        <MenuItem name="4">
            <img :src="Name === '4' ? wdrba : wdrb" alt="">
            我的日报
        </MenuItem>
        <MenuItem name="5">
          <img :src="Name === '5' ? shspa : shsp" alt="">
          <Badge :count="Count">
            审核审批
          </Badge>
        </MenuItem> -->
    </Menu>
  </div>
</template>

<script>
import { listWait } from '@/api/data'
import { getUserId } from '@/libs/util'
import wza from '@/assets/images/wza.png'
import wz from '@/assets/images/wz.png'
import yqxx from '@/assets/images/yqxx.png'
import tjxx from '@/assets/images/tjxx.png'
import wdrb from '@/assets/images/wdrb.png'
import shsp from '@/assets/images/shsp.png'
import yqxxa from '@/assets/images/yqxxa.png'
import tjxxa from '@/assets/images/tjxxa.png'
import wdrba from '@/assets/images/wdrba.png'
import shspa from '@/assets/images/shspa.png'
export default {
  name: 'hearMainCenter',
  computed: {},
  data () {
    return {
      Name: null,
      Count: 0,
      wz: wz,
      yqxx: yqxx,
      tjxx: tjxx,
      wdrb: wdrb,
      shsp: shsp,
      wza: wza,
      yqxxa: yqxxa,
      tjxxa: tjxxa,
      wdrba: wdrba,
      shspa: shspa
    }
  },
  props: {},
  created () {},
  methods: {
    onSelect (val) {
      this.Name = val
      switch (val) {
        case '1':
          this.$router.push('/my/myMaterial')
          break
        case '2':
          this.$router.push('/my/myOverdue/projectOverdue')
          break
        case '3':
          this.$router.push('/statistics/projectStatistics')
          break
        case '4':
          this.$router.push('/DailyReview/dailyList')
          break
        case '5':
          this.$router.push('/my/myProcessed')
          break
        default:
          break
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
    width: 20px;
    height: 20px;
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
