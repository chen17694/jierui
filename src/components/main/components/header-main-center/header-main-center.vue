<template>
  <div class="header-main-center" >
      <Menu mode="horizontal" @on-select="onSelect">
        <MenuItem name="1">
            <img :src="Name === '1' ? wza : wz" alt="">
            我的物资
        </MenuItem>
        <MenuItem name="2">
            <img :src="Name === '2' ? yqxxa : yqxx" alt="">
            逾期信息
            <div class="list-container">
                <div class="list-view">
                <div class="view-box" @click.stop="tapRouteLink('projectOverdue')">
                  <h5>{{ProjectTotal}}</h5>
                  <p>项目逾期</p>
                </div>
                <div class="view-box" @click.stop="tapRouteLink('taskOverdue')">
                  <h5>{{TaskTotal}}</h5>
                  <p>任务逾期</p>
                </div>
                <div class="view-box" @click.stop="tapRouteLink('roadOverdue')">
                  <h5>{{TaskCrossingTotal}}</h5>
                  <p>任务路口逾期</p>
                </div>
                <div class="view-box" @click.stop="tapRouteLink('returnOverdue')">
                  <h5>{{MaterialTotal}}</h5>
                  <p>物资归还逾期</p>
                </div>
              </div>
            </div>
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
        </MenuItem>
    </Menu>
  </div>
</template>

<script>
import { listWait, listOverdueProject, listOverdueTask, listOverdueTaskCrossing, listOverdueMaterial } from '@/api/data'
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
      shspa: shspa,
      params: {
        pageSize: 10,
        page: 1,
        name: '',
        userId: getUserId(),
        status: '',
        projectId: '',
        taskId: ''
      },
      ProjectTotal: '0',
      TaskTotal: '0',
      TaskCrossingTotal: '0',
      MaterialTotal: '0'
    }
  },
  props: {

  },
  created () {
    // this.getCount()
  },
  methods: {
    tapRouteLink (link) {
      this.$router.push(link)
    },
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
          this.$router.push('/my/myDaily')
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
        id: getUserId(),
        noLoading: '1'
      }
      listWait(obj).then(res => {
        if (res.data.status === '200') {
          this.Count = res.data.data.total
        }
      })
      listOverdueProject(this.params).then((res) => {
        if (res.data.status === '200') {
          this.ProjectTotal = res.data.data.num
        }
      })
      listOverdueTask(this.params).then((res) => {
        if (res.data.status === '200') {
          this.TaskTotal = res.data.data.num
        }
      })
      listOverdueTaskCrossing(this.params).then((res) => {
        if (res.data.status === '200') {
          this.TaskCrossingTotal = res.data.data.num
        }
      })
      listOverdueMaterial(this.params).then((res) => {
        if (res.data.status === '200') {
          this.MaterialTotal = res.data.data.num
        }
      })
    }
  },
  mounted () {
    this.getCount()
    setInterval(this.getCount, 5000)
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
  .ivu-menu-item{
    position: relative;
    &:nth-child(2){
      &:hover{
        .list-container{
          display: block;
        }
      }
    }
    .list-container{
      display: none;
      .list-view{
        line-height: 20px;
        width: 440px;
        position: absolute;
        top: 58px;
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
        border-radius: 3px;
        color: #333;
        box-shadow: 0px 0px 3px #c5c5c5;
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &::before{
          content: '';
          position: absolute;
          top: -21px;
          left: 50%;
          transform: translateX(-50%);
          border-top: 10px transparent dashed;
          border-left: 10px transparent dashed;
          border-bottom: 10px #eaeaea solid;
          border-right: 10px transparent dashed;
        }
        .view-box{
          text-align: center;
          padding: 5px 0px;
          flex: 1;
          &:hover{
            background-color: #eee;
          }
          h5{
            font-size: 18px;
            margin-bottom: 2px;
            color: #fb5d20;
          }
        }
      }
    }
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
