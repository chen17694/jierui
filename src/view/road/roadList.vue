<template>
  <div>
    <Row style="padding: 10px 0;">
      <Col span="12">
        <Row>
          <Col span="5">
            <Cascader :data="areaData" v-model="areaValue" @on-change="cascaderChange"></Cascader>
          </Col>
          <Col span="10">
            <div class="searchInput" style="padding-left: 10px">
              <div class="search">
                <Input search @on-search="handleSearch" placeholder="输入关键字搜索" type="text" enter-button="搜索" style="width: 300px"/>
              </div>
            </div>
          </Col>
        </Row>
      </Col>
      <Col span="12">
        <div style="float: right">
          <Button type="primary" @click="onAdd" style="margin-right: 10px">地图模式</Button>
          <Button type="success" @click="onAdd">新建路口</Button>
        </div>
      </Col>
    </Row>
    <tables ref="tables" :total="this.total" :on-change="this.pageChange" :on-page-size-change="this.PageSizeChange" v-model="tableData" :columns="columns"></tables>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { listCrossing, areaData } from '@/api/data'
export default {
  name: 'roadList',
  components: { Tables },
  data () {
    return {
      total: 0,
      tableData: [],
      areaData: [],
      areaValue: [],
      columns: [
        { title: '路口别名', key: 'alias' },
        { title: '路口位置', key: 'specificAddress' },
        { title: '版本数量', key: 'version' },
        { title: '最后修改时间', key: 'createDate' }
      ],
      params: {
        pageSize: 10,
        page: 1,
        alias: '',
        provinceName: '',
        cityName: '',
        districtName: ''
      }
    }
  },
  methods: {
    onAdd () {
      this.$router.push({
        name: 'addRoad'
      })
    },
    cascaderChange () {
      let value = arguments[1].slice(1, arguments[1].length).map((item) => {
        return item.label
      })
      this.params.provinceName = value[0]
      this.params.cityName = value[1]
      this.params.districtName = value[2]
      console.log(value)
      this.getData()
    },
    getAreaData () {
      areaData().then(res => {
        if (res.data.status === '200') {
          this.areaData = res.data.data
        }
      })
    },
    handleSearch () {
      console.log(arguments)
      this.params.alias = arguments[0]
      this.getData()
    },
    pageChange (page) {
      this.listParams.page = page
      this.getData()
    },
    PageSizeChange (size) {
      this.listParams.pageSize = size
      this.getData()
    },
    getData () {
      listCrossing(this.params).then((res) => {
        this.tableData = res.data.data
      })
    }
  },
  mounted () {
    this.getData()
    this.getAreaData()
  }
}
</script>

<style scoped lang="less">

</style>
