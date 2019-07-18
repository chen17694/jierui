<template>
  <div>
    <Row type="flex" justify="space-between" style="padding: 10px 0">
      <Col span="12">
        <div class="searchInput">
          <div class="search">
            <Input search @on-search="handleSearch" placeholder="请输入物资名称关键字" type="text" enter-button="搜索">
            <span slot="prepend">物资名称:</span>
            </Input>
          </div>
          <Button class="search-btn" type="primary" @click="openFilter"><Icon type="search"/>筛选</Button>
        </div>
      </Col>
      <Col span="12">
        <div style="float: right">
          <Dropdown @on-click="dropdownClick" style="margin-right: 10px">
            <Button type="primary" ghost>
              选择操作
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem name="批量删除">批量删除</DropdownItem>
              <DropdownItem name="取消">取消</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button type="success">新增用户</Button>
        </div>
      </Col>
    </Row>
    <tables ref="tables" :total="this.total" v-model="tableData" :columns="columns"></tables>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { deleteMaterial, listMyMaterial } from '@/api/data'
export default {
  name: 'myMaterial',
  components: { Tables },
  data () {
    return {
      filter: false,
      rowId: [],
      total: 0,
      tableData: [],
      params: {
        pageSize: 10,
        page: 1,
        name: ''
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        { title: '物资名称', key: 'name' },
        { title: '物资总数', key: 'amount' },
        { title: '剩余数量', key: 'surplusAmount' },
        { title: '出借数量', key: 'lendAmount' },
        { title: '所属单位', key: 'officeName' },
        { title: '物资类型', key: 'materialCategoryName' },
        {
          title: '操作',
          key: 'handle',
          options: ['edit']
        }
      ]
    }
  },
  methods: {
    handleSearch () {
      this.params.name = arguments[0]
      this.getData()
    },
    openFilter () {
      this.filter = !this.filter
    },
    getData () {
      listMyMaterial(this.params).then((res) => {
        console.log(res.data.data)
        if (res.data.status === '200') {
          this.tableData = res.data.data
        }
      })
    },
    // 批量删除
    dropdownClick (name) {
      if (name === '批量删除') {
        if (this.rowId.length > 0) {
          this.$Modal.confirm({
            title: '是否执行删除操作',
            content: '<p>删除后不能找回，还要继续吗</p>',
            onOk: () => {
              let params = {
                'ids': this.rowId,
                'userId': 'd3c6b26c272f4b0c96ec8f7a3062230b'
              }
              deleteMaterial(params).then((res) => {
                if (res.data.status === '200') {
                  this.$Message.info('删除成功！')
                  this.getData()
                } else {
                  this.$Message.info('操作失败，请重试！')
                }
              })
            }
          })
        }
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped lang="less">
  .searchInput{
    float: left;
    /deep/ .search-btn{
      height: 32px;
    }
  }
  .search{
    float: left;
    margin-right: 10px;
    /deep/ .ivu-input-group-prepend{
      background: none;
      border: 0 none;
    }
    /deep/ .ivu-input-search{
      border: 0 none;
    }
    /deep/ .ivu-input-search:before{
      content: none
    }
    .search-btn{
      float: right;
    }
  }
</style>
