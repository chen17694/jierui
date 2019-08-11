<template>
  <div>
    <Card>
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
        <h2>{{detailData.alias}}</h2>
      </div>
      <div style="width: 100%; overflow-x: scroll;">
        <div style="white-space: nowrap; padding: 10px 0">
          <ul class="list">
            <li v-for="(item, index) in banbenList" :key="index" @click="selectBanben(index)" style="cursor: pointer; margin-right: 10px">
              <div :style="{ backgroundColor:(index ===0 ? '#2d8cf0' : '#ffffff'), color:(index ===0 ? '#ffffff' : '#000000') ,borderColor:(index ===0 ? '#2d8cf0' : '#c3c3c3')}" style=" border-radius: 5px; border: 1px solid #c3c3c3; padding: 10px 15px">
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
import { listCrossingByCode } from '@/api/data'
export default {
  name: 'roadHistory',
  data () {
    return {
      banbenList: [],
      detailData: {}
    }
  },
  methods: {
    selectBanben (index) {
      this.detailData = this.banbenList[index]
    }
  },
  mounted () {
    listCrossingByCode({
      startTime: '',
      endTime: '',
      userId: '',
      crossingCode: this.$route.query.crossingCode
    }).then((res) => {
      console.log(res)
      this.banbenList = res.data.data
      this.detailData = this.banbenList[0]
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
