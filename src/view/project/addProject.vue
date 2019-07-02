<template>
  <div style="height: 100%">
    <div class="amap-page-container">
      <el-amap ref="map" :center="center" vid="amapDemo" :amap-manager="amapManager" :zoom="zoom" class="amap-demo" :events="events"></el-amap>
      <Cascader :data="areaData" v-model="areaValue" change-on-select style="position: absolute; right: 20px; top: 20px; width: 200px;" @on-change="cascaderChange"></Cascader>
      <Card style="width:350px; position: absolute; left: 20px; top: 20px; border: 0 none">
        <p slot="title">项目位置</p>
        <p>在地图右键点击设置项目位置。</p>
      </Card>
    </div>
  </div>
</template>

<script>
import { AMapManager } from 'vue-amap'
import { areaData } from '@/api/data'
import icon1 from '../../assets/images/icon1.png'
let amapManager = new AMapManager()
export default {
  name: 'addProject',
  data () {
    let self = this
    return {
      icon1,
      amapManager,
      zoom: 16,
      areaValue: [],
      areaData: [],
      keywords: '',
      center: [116.397448, 39.908708],
      searchOptions: {
        city: '全国'
      },
      menu: null,
      events: {
        complete () {
          let o = amapManager.getMap()
          let icon1 = self.icon1
          let content = []
          console.log(self.asdasdasd)
          content.push('<div class="context-menu-content">')
          content.push('<ul class="context_menu">')
          content.push('<li style="border-bottom: 1px solid #e6e6e6;display: flex;align-items: center;"><img src="' + icon1 + '" style="width: 18px; margin-right: 5px">设为项目位置</li>')
          content.push('<li id="closeBtn" style="padding-left: 33px">取消</li>')
          content.push('</ul>')
          content.push('</div>')
          console.log(content.join(''))
          self.menu = new AMap.ContextMenu({
            isCustom: true,
            content: content.join('')
          })
          o.on('rightclick', (e) => {
            self.menu.open(o, e.lnglat)
            setTimeout(() => {
              self.watchbtn()
            }, 500)
          })
        }
      }
    }
  },
  methods: {
    watchbtn () {
      let closeBtn = document.getElementById('closeBtn')
      closeBtn.addEventListener('click', function () {
        console.log(123164798748654)
      })
      console.log(closeBtn)
    },
    asdasdasd () {
      console.log(123123)
      // return this.TrueClose
    },
    // TrueClose () {
    //   console.log('geiwodian')
    // },
    cascaderChange () {
      let value = arguments[1].slice(1, arguments[1].length).map((item) => {
        return item.label
      })
      this.keywords = value.join()
      this.searchArea()
    },
    getAreaData () {
      areaData().then(res => {
        if (res.data.status === '200') {
          this.areaData = res.data.data
        }
      })
    },
    searchArea () {
      if (!this.keywords) return false
      let placeSearch = new AMap.PlaceSearch(this.searchOptions)
      placeSearch.search(this.keywords, (status, result) => {
        this.center = [result.poiList.pois[0].location.lng, result.poiList.pois[0].location.lat]
      })
    }
  },
  mounted () {
    this.getAreaData()
  }
}
</script>

<style scoped lang="less">
  .amap-demo {
    height: 100%;
  }
  .amap-page-container{
    height: 100%;
    position: relative;
    /deep/ .context-menu-content{
      width: 150px;
      background-color: #ffffff;
      .context_menu{
        list-style-type: none;
        li{
          padding: 10px 10px;
          cursor: pointer;
        }
        li:hover{
          background-color: #e6e6e6;
        }
      }
    }
  }
</style>
