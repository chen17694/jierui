<template>
  <div class="lktj">
    <div style="font-size: 26px; text-align:center" >路口统计</div>
    <Card dis-hover style="margin-top: 20px">
      <p slot="title">
        更新版本前20路口
      </p>
      <div slot="extra" style>
        <Button type="text" @click="lastMonthSlot">上月</Button>
        <Button type="text" @click="nowMonthSlot">本月</Button>
        <Button type="text" @click="lastSeasonSlot">上季</Button>
        <Button type="text" @click="nowSeasonSlot">本季</Button>
        <Button type="text" @click="lastYearSlot">去年</Button>
        <Button type="text" @click="nowYearSlot">今年</Button>
        <DatePicker
          :confirm="true"
          type="daterange"
          placement="bottom-end"
          placeholder="请选择起止日期"
          style="width: 200px"
          @on-change="changeTime"
          @on-ok="getData"
        ></DatePicker>
      </div>
      <Row>
          <Col span="24">
            <tables
              style="padding:10px 0px;"
              ref="tabletj"
              v-model="tableData"
              :columns="columns"
              :showPage="false"
              :on-change="pageChange"
              :on-page-size-change="pageSizeChange"
            ></tables>
          </Col>
        </Row>
    </Card>
  </div>
</template>
<script>
import Tables from '_c/tables'
import { getUserId } from '@/libs/util'
import { taskCrossingUpdateStatistics } from '@/api/data'
import { getLastMonthStartDate, getLastMonthEndDate, getMonthStartDate, getMonthEndDate, getQuarterStartDate, getQuarterEndDate, getLastQuarterStartDate, getLastQuarterEndDate, getCurrentYear, getLastYear } from '@/libs/mdate.js'

export default {
  name: 'IntersectionStatistics',
  components: { Tables },
  data () {
    return {
      Search: {
        userId: '',
        startTime: '',
        endTime: '',
        projectId: '',
        page: 1,
        pageSize: 20
      },
      tableData: [],
      columns: [
        {
          type: 'index',
          width: 60,
          title: '排名'
        },
        { title: '路口名称', key: 'alias' },
        { title: '路口位置',
          render: (h, params) => {
            return h('div', {}, params.row.provinceName + params.row.cityName + params.row.districtName)
          }
        },
        { title: '最后修改时间', key: 'createDate', width: 160 }
      ]
    }
  },
  created () {
    this.Search.userId = getUserId()
    this.getData()
  },
  methods: {
    pageChange (page) {
      this.Search.page = page
      this.getData()
    },
    pageSizeChange (size) {
      this.Search.pageSize = size
      this.getData()
    },
    getData () {
      let _this = this
      _this.tableData = []
      taskCrossingUpdateStatistics(_this.Search).then((res) => {
        if (res.data.status === '200') {
          _this.tableData = res.data.data
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    },
    changeTime (val) {
      this.Search.startTime = val[0]
      this.Search.endTime = val[1]
    },
    lastMonthSlot () {
      this.Search.startTime = getLastMonthStartDate()
      this.Search.endTime = getLastMonthEndDate()
      this.getData()
    },
    nowMonthSlot () {
      this.Search.startTime = getMonthStartDate()
      this.Search.endTime = getMonthEndDate()
      this.getData()
    },
    lastSeasonSlot () {
      this.Search.startTime = getLastQuarterStartDate()
      this.Search.endTime = getLastQuarterEndDate()
      this.getData()
    },
    nowSeasonSlot () {
      this.Search.startTime = getQuarterStartDate()
      this.Search.endTime = getQuarterEndDate()
      this.getData()
    },
    lastYearSlot () {
      this.Search.startTime = getLastYear().startTime
      this.Search.endTime = getLastYear().endTime
      this.getData()
    },
    nowYearSlot () {
      this.Search.startTime = getCurrentYear().startTime
      this.Search.endTime = getCurrentYear().endTime
      this.getData()
    }
  }
}
</script>
<style lang="less" scoped>
  body{
    color: #333;
  }
  .lktj {
    padding: 20px;
    background-color: #fff;
  }
</style>
