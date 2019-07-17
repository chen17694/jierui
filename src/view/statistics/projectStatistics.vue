<template>
  <div>
    <Card>
      <div>
        <Row>
          <Col span="15">
            <Row>
              <Col span="10">
                <div ref="dom" class="charts chart-pie" style="height: 350px"></div>
              </Col>
              <Col span="12">
                <ul style="margin-top: 25px; height: 300px; display: flex; flex-direction: column; justify-content: space-around;">
                  <li v-for="(item, index) in value" :key="index" style="display: flex; align-items: center;">
                    <div class="dian" style="background-color: #3ba0ff" v-if="item.name==='进行中'"></div>
                    <div class="dian" style="background-color: #37cbcb" v-if="item.name==='未开始'"></div>
                    <div class="dian" style="background-color: #4ecb74" v-if="item.name==='已完成'"></div>
                    <div class="dian" style="background-color: #fad337" v-if="item.name==='已暂停'"></div>
                    <div class="dian" style="background-color: #ff9933" v-if="item.name==='已撤销'"></div>
                    <div class="dian" style="background-color: #f2637b" v-if="item.name==='已驳回'"></div>
                    <div class="dian" style="background-color: #975fe4" v-if="item.name==='审核中'"></div>
                    <div class="status">{{item.name}}</div>
                    <div class="proportion">{{calculated(index)}}%</div>
                    <div class="value">数量：{{item.value}}</div>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Card>

  </div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'projectStatistics',
  data () {
    return {
      dom: null,
      value: [
        { value: 875, name: '进行中' },
        { value: 321, name: '未开始' },
        { value: 125, name: '已完成' },
        { value: 125, name: '已暂停' },
        { value: 125, name: '已撤销' },
        { value: 125, name: '已驳回' },
        { value: 125, name: '审核中' }
      ],
      data: [875, 321, 125, 125, 125, 125, 125]
    }
  },
  computed: {
    calculated () {
      return function (index) {
        return this.getPercentWithPrecision(this.data, index, 2)
      }
    }
  },
  methods: {
    getPercentWithPrecision (valueList, idx, precision) {
      if (!valueList[idx]) {
        return 0
      }
      let sum = valueList.reduce(function (acc, val) {
        return acc + (isNaN(val) ? 0 : val)
      }, 0)
      if (sum === 0) {
        return 0
      }
      let digits = Math.pow(10, precision)
      let votesPerQuota = valueList.map(function (val) {
        return (isNaN(val) ? 0 : val) / sum * digits * 100
      })
      let targetSeats = digits * 100
      let seats = votesPerQuota.map(function (votes) {
        return Math.floor(votes)
      })
      let currentSum = seats.reduce(function (acc, val) {
        return acc + val
      }, 0)
      let remainder = votesPerQuota.map(function (votes, idx) {
        return votes - seats[idx]
      })
      while (currentSum < targetSeats) {
        let max = Number.NEGATIVE_INFINITY
        let maxId = null
        for (let i = 0, len = remainder.length; i < len; ++i) {
          if (remainder[i] > max) {
            max = remainder[i]
            maxId = i
          }
        }
        ++seats[maxId]
        remainder[maxId] = 0
        ++currentSum
      }
      return seats[idx] / digits
    }
  },
  mounted () {
    this.$nextTick(() => {
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        // legend: {
        //   orient: 'vertical',
        //   right: '0',
        //   data: ['进行中', '未开始', '已完成', '已暂停', '已撤销', '已驳回', '审核中'],
        //   icon: 'circle',
        //   itemWidth: 8,
        //   textStyle: {
        //     color: '#cddafd',
        //     fontSize: 14,
        //     width: 207,
        //     height: 20
        //   },
        //   padding: [30, 0, 30, 0],
        //   formatter: function (name) {
        //     let data = self.value
        //     let p = ''
        //     let tarValue = ''
        //     for (let i = 0, l = data.length; i < l; i++) {
        //       if (data[i].name === name) {
        //         p = self.getPercentWithPrecision(self.data, i, 2)
        //         tarValue = data[i]
        //       }
        //     }
        //     return name + p + tarValue
        //   }
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['110px', '150px'],
            center: ['50%', '50%'],
            label: {
              normal: {
                show: false
              }
            },
            data: this.value,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function (params) {
                  let colorList = [
                    '#3ba0ff', '#37cbcb', '#4ecb74', '#fad337', '#ff9933', '#f2637b', '#975fe4'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
    })
  }
}
</script>

<style scoped>
  ul{
    list-style-type: none;
  }
  .dian{
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #3ba0ff;
    margin-right: 15px;
  }
  .status{
    padding-right: 20px;
  }
  .proportion{
    padding: 0 25px 0 10px;
    width: 80px;
    border-right: 1px solid #c3c3c3;
    border-left: 1px solid #c3c3c3;
  }
  .value{
    padding-left: 10px;
  }
</style>
