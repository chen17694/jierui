<template>
  <div>
    <Card>
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
        <h2>{{detailData.alias}}</h2>
      </div>
      <div style="width: 100%; overflow-x: scroll;">
        <div style="white-space: nowrap; padding: 10px 0">
          <ul class="list">
            <li v-for="(item, i) in banbenList" :key="i" @click="selectBanben(i)" style="cursor: pointer; margin-right: 10px">
              <div :style="{ backgroundColor:(i ===index ? '#2d8cf0' : '#ffffff'), color:(i ===index ? '#ffffff' : '#000000') ,borderColor:(i ===index ? '#2d8cf0' : '#c3c3c3')}" style=" border-radius: 5px; border: 1px solid #c3c3c3; padding: 10px 15px">
                <p>版本号：{{item.version}}</p>
                <p>创建时间：{{item.createDate}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <dl style="margin: 30px 0">
        <dt style="font-size: 16px; font-weight: bold; margin-bottom: 10px">路口基本信息</dt>
        <dd>路口别名：{{detailData.alias}}</dd>
        <dd>路口位置：{{detailData.provinceName}}{{detailData.cityName}}{{detailData.districtName}}{{detailData.specificAddress}}</dd>
      </dl>
      <div style="margin: 30px 0">
        <p style="font-weight: bold; margin-bottom: 10px">渠化图</p>
        <img src="../../assets/images/default_pic.png" v-if="!photo" style="margin: 15px 15px 0 0">
        <img :src="photo" v-if="photo" style="margin: 15px 15px 0 0; cursor:zoom-in;">
      </div>
      <div style="margin: 30px 0">
        <p style="font-weight: bold; margin-bottom: 10px">方案附件</p>
        <ul style="list-style-type: none; display: flex">
          <li v-for="(item ,index) in annexBeans" :key="index" style="cursor: pointer;border: 1px solid #dcdee2;border-radius: 5px; padding-top: 10px; width: 120px; margin-right: 10px">
            <div style="background-color: #ffffff; display: flex; align-items: center; justify-content: center;">
              <img src="../../assets/images/file.png" style="width: 60px;">
            </div>
            <p style="word-wrap: break-word; text-align: center; margin-bottom: 5px; padding: 0 5px;">{{item.annexName}}</p>
            <div style="text-align: center" @click.stop>
              <img src="../../assets/images/delete.png" style="width: 20px;" @click="deleteFile(item.id)">
            </div>
          </li>
        </ul>
      </div>
      <dl style="margin: 30px 0">
        <dt style="font-size: 16px; font-weight: bold; margin-bottom: 10px">更新信息</dt>
        <dd>更新单位：{{detailData.companyName}}</dd>
        <dd>更新项目：{{detailData.projectName}}</dd>
        <dd>更新任务：{{detailData.taskName}}</dd>
        <dd>更新人员：{{detailData.userName}}</dd>
      </dl>
    </Card>
  </div>
</template>

<script>
import { listCrossingByCode, listBusinessCrossingAnnex, selectCrossing } from '@/api/data'
import { getUserId } from '@/libs/util'
export default {
  name: 'roadHistory',
  data () {
    return {
      banbenList: [],
      detailData: {},
      annexBeans: [],
      photo: '',
      index: 0
    }
  },
  methods: {
    selectBanben (index) {
      this.index = index
      listCrossingByCode({
        startTime: '',
        endTime: '',
        userId: getUserId(),
        crossingCode: this.$route.query.crossingCode
      }).then((res) => {
        this.banbenList = res.data.data
        this.detailData = this.banbenList[this.index]
      })
    }
  },
  mounted () {
    this.selectBanben(this.index)
    selectCrossing({
      id: this.$route.query.crossingId
    }).then((res) => {
      this.photo = res.data.data.channelizationMapUrl
    })
    listBusinessCrossingAnnex({
      crossingId: this.$route.query.crossingId,
      userId: getUserId()
    }).then((res) => {
      this.annexBeans = res.data.data.annexBeans
    })
  }
}
</script>

<style scoped lang="less">
  .list{
    list-style-type: none;
    li{
      display: inline-block;
    }
  }
</style>
