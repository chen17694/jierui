<template>
  <div style="background-color: #001529; position: absolute; width: 100%; height: 100%;left: 0; top: 0; z-index: 900;">
    <div style="display: flex; justify-content: space-between">
      <div style="width: 30%">
        <Row @clicl="listRowClick('1')" class="listRow" style="border: 1px solid #00284d; margin-bottom: 15px" type="flex" align="middle" justify="space-around">
          <Col span="12" style="height: 210px; padding: 20px 0">
            <p style="font-size: 18px; color: #ffffff; font-weight: bold;">项目统计</p>
            <p style="margin: 20px 0; color: #33ccff; font-size: 18px; font-weight: bold">总数: {{data1.total ? data1.total :''}}</p>
            <ul style="list-style-type: none">
              <li style="margin-bottom: 25px; color: #ffffff; display: flex;align-items: center;">
                <span style="width: 5px; height: 5px; display: inline-block; background-color: #75dbdb; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 8px; margin-right: 8px">进行中的数量</span>{{data1.ongoingCount ? data1.ongoingCount : ''}}
              </li>
              <li style="color: #ffffff; display: flex;align-items: center;">
                <span style="width: 5px; height: 5px; display: inline-block; background-color: #d85457; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 8px; margin-right: 8px">逾期的数量</span>{{data1.overdueCount ? data1.overdueCount : ''}}
              </li>
            </ul>
          </Col>
          <Col span="12" style="width:210px; height: 210px;">
            <div ref="dom1" style="height: 210px;" class="charts chart-pie"></div>
          </Col>
        </Row>
        <Row @clicl="listRowClick('2')" class="listRow" style="border: 1px solid #00284d; margin-bottom: 15px" type="flex" align="middle" justify="space-around">
          <Col span="12" style="height: 210px; padding: 20px 0">
            <p style="font-size: 18px; color: #ffffff; font-weight: bold;">任务统计</p>
            <p style="margin: 20px 0; color: #33ccff; font-size: 18px; font-weight: bold">总数: {{data2.total ? data2.total :''}}</p>
            <ul style="list-style-type: none">
              <li style="margin-bottom: 25px; color: #ffffff; display: flex;align-items: center;">
                <span style="width: 5px; height: 5px; display: inline-block; background-color: #75dbdb; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 8px; margin-right: 8px">进行中的数量</span>{{data2.ongoingCount ? data2.ongoingCount : ''}}
              </li>
              <li style="color: #ffffff; display: flex;align-items: center;">
                <span style="width: 5px; height: 5px; display: inline-block; background-color: #d85457; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 8px; margin-right: 8px">逾期的数量</span>{{data2.overdueCount ? data2.overdueCount : ''}}
              </li>
            </ul>
          </Col>
          <Col span="12" style="width:210px; height: 210px;">
            <div ref="dom2" style="height: 210px;" class="charts chart-pie"></div>
          </Col>
        </Row>
        <Row @clicl="listRowClick('3')" class="listRow" style="border: 1px solid #00284d;" type="flex" align="middle" justify="space-around">
          <Col span="12" style="height: 210px; padding: 20px 0">
            <p style="font-size: 18px; color: #ffffff; font-weight: bold;">任务路口统计</p>
            <p style="margin: 20px 0; color: #33ccff; font-size: 18px; font-weight: bold">总数: {{data3.total ? data3.total :''}}</p>
            <ul style="list-style-type: none">
              <li style="margin-bottom: 25px; color: #ffffff; display: flex;align-items: center;">
                <span style="width: 5px; height: 5px; display: inline-block; background-color: #75dbdb; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 8px; margin-right: 8px">进行中的数量</span>{{data3.ongoingCount ? data3.ongoingCount : ''}}
              </li>
              <li style="color: #ffffff; display: flex;align-items: center;">
                <span style="width: 5px; height: 5px; display: inline-block; background-color: #d85457; border-radius: 50%; margin-right: 8px"></span><span style="border-right: 1px solid #ffffff; padding-right: 8px; margin-right: 8px">逾期的数量</span>{{data3.overdueCount ? data3.overdueCount : ''}}
              </li>
            </ul>
          </Col>
          <Col span="12" style="width:210px; height: 210px;">
            <div ref="dom3" style="height: 210px;" class="charts chart-pie"></div>
          </Col>
        </Row>
      </div>
      <div style="border: 1px solid #00284d; width: 69%">
        <el-amap
          :amap-manager="amapManager"
          :center="center"
          :zoom="zoom"
          vid="amapDemo"
          :events="events"
          :zoomEnable="false"
          :dragEnable="false"
          class="amap-demo"
        >
        </el-amap>
      </div>
    </div>
  </div>
</template>

<script>
import { AMapManager } from 'vue-amap'
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
import {
  mapCoordinateStatistics,
  listMapProject
} from '@/api/data'
import { getUserId } from '@/libs/util'
let amapManager = new AMapManager()
echarts.registerTheme('tdTheme', tdTheme)
let color1 = ['#3aa0ff', '#d9585d']
let color2 = ['#75dbdb', '#d9585d']
let color3 = ['#85db9f', '#d9585d']
export default {
  name: 'myStatistics',
  data () {
    return {
      markers: [],
      markerRefs: [],
      pieData1: [],
      pieData2: [],
      pieData3: [],
      dom1: null,
      dom2: null,
      dom3: null,
      projectList: [],
      zoom: 4,
      amapManager: amapManager,
      center: [103, 36],
      events: {
        init () {
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
      },
      data1: {},
      data2: {},
      data3: {}
    }
  },
  methods: {
    listRowClick (type) {
      if (type === '1') {
        listMapProject({
          pageSize: 0,
          page: 0,
          userId: getUserId(),
          projectName: '',
          firstPartyCompanyId: '',
          projectManagerId: '',
          status: '',
          firstPartyScoring: '',
          provinceName: '',
          cityName: '',
          districtName: '',
          timeStatus: '',
          startTime: '',
          endTime: ''
        }).then((res) => {
          this.projectList = res.data.data.projectList
          let self = this
          this.projectList.forEach((item) => {
            this.markers.push({
              position: [item.lng, item.lat],
              id: item.id,
              events: {
                init (o) {
                  self.markerRefs.push(o)
                }
              }
            })
          })
          setTimeout(() => {
            self.initMark(self, amapManager.getMap())
          }, 0)
        })
      }
    },
    getMapCoordinateStatistics (type) {
      console.log(type)
      mapCoordinateStatistics({
        startTime: '',
        endTime: '',
        type: type
      }).then((res) => {
        console.log(res)
        if (type === '1') {
          this.data1 = res.data.data
          this.pieData1 = [{ value: res.data.data.ongoingCount, name: '进行中占比' }, { value: res.data.data.overdueCount, name: '逾期占比' }]
          this.setPie1()
        } else if (type === '2') {
          this.data2 = res.data.data
          this.pieData2 = [{ value: res.data.data.ongoingCount, name: '进行中占比' }, { value: res.data.data.overdueCount, name: '逾期占比' }]
          this.setPie2()
        } else if (type === '3') {
          this.data3 = res.data.data
          this.pieData3 = [{ value: res.data.data.ongoingCount, name: '进行中占比' }, { value: res.data.data.overdueCount, name: '逾期占比' }]
          this.setPie3()
        }
      })
    },
    resize () {
      this.dom.resize()
    },
    setPie1 () {
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['42%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{b} \n \n {d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: '#ffffff',
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              }
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  return color1[params.dataIndex]
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.pieData1
          }
        ]
      }
      console.log(this.pieData1)
      this.dom1 = echarts.init(this.$refs.dom1, 'tdTheme')
      this.dom1.setOption(option)
      on(window, 'resize', this.resize)
    },
    setPie2 () {
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '状态 <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['42%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{b} \n \n {d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: '#ffffff',
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              }
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  return color2[params.dataIndex]
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.pieData2
          }
        ]
      }
      this.dom2 = echarts.init(this.$refs.dom2, 'tdTheme')
      this.dom2.setOption(option)
      on(window, 'resize', this.resize)
    },
    setPie3 () {
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '状态 <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['42%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{b} \n \n {d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: '#ffffff',
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              }
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  return color3[params.dataIndex]
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.pieData3
          }
        ]
      }
      this.dom3 = echarts.init(this.$refs.dom3, 'tdTheme')
      this.dom3.setOption(option)
      on(window, 'resize', this.resize)
    }
  },
  mounted () {
    this.getMapCoordinateStatistics('1')
    this.getMapCoordinateStatistics('2')
    this.getMapCoordinateStatistics('3')
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>

<style scoped lang="less">
  .amap-demo {
    height: 630px;
  }
  .listRow{
    cursor: pointer;
  }
  .listRow:hover{
    background-color: #04304c;
  }
</style>
