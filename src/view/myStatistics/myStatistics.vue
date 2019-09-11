<template>
  <div style="background-color: #001529; position: absolute; width: 100%; height: 100%;left: 0; top: 0; z-index: 900;">
    <Row>
      <Col span="12">
        <el-amap
          :amap-manager="amapManager"
          :center="center"
          :zoom="zoom"
          vid="amapDemo"
          :events="events"
          :zoomEnable="false"
          :dragEnable="false"
          class="amap-demo"
          :layers="layers"
        >
        </el-amap>
      </Col>
    </Row>
  </div>
</template>

<script>
import { AMapManager } from 'vue-amap'
let amapManager = new AMapManager()

export default {
  name: 'myStatistics',
  data () {
    let self = this
    return {
      zoom: 4,
      amapManager: amapManager,
      center: [103, 36],
      layers: [],
      events: {
        init () {
          self.disWorld = new AMap.DistrictLayer.World({
            zIndex: 10,
            styles: {
              // 填充
              'fill': function (props) {
                console.log(props)
                if (props.SOC === 'CHN') {
                  return 'rgba(20, 120, 230, 0.3)'
                } else {
                  return 'white'
                }
              }
            }
          })
          self.layers.push(self.disWorld)
        },
        complete () {
          let map = amapManager.getMap()
          new AMap.DistrictSearch({
            extensions: 'all',
            subdistrict: 0
          }).search('中国', function (status, result) {
            // 外多边形坐标数组和内多边形坐标数组
            let outer = [
              new AMap.LngLat(-360, 90, true),
              new AMap.LngLat(-360, -90, true),
              new AMap.LngLat(360, -90, true),
              new AMap.LngLat(360, 90, true)
            ]
            let holes = result.districtList[0].boundaries
            let pathArray = [
              outer
            ]
            pathArray.push.apply(pathArray, holes)
            let polygon = new AMap.Polygon({
              pathL: pathArray,
              strokeColor: '#001529',
              strokeWeight: 1,
              fillColor: '#001529',
              fillOpacity: 1
            })
            polygon.setPath(pathArray)
            map.add(polygon)
          })
        }
      }
    }
  },
  mounted () {

  }
}
</script>

<style scoped lang="less">
  .amap-demo {
    height: 630px;
  }
</style>
