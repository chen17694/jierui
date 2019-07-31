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
          <Button class="search-btn" icon="ios-funnel" type="primary" @click="openFilter"><Icon type="search"/>筛选</Button>
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
          <Button icon="md-add" type="primary" @click="Add">创建物资</Button>
        </div>
      </Col>
    </Row>
    <div slot="filterPanel" class="filterPanel" v-if="filterPanel">
      <Card :bordered="false">
        <Row>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">归属单位:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.officeId" placeholder="请选择" label-in-value>
                  <Option v-for="(item, key) in officeCategory" :value="item.value">{{item.label}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">物资类型:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.materialCategoryId" placeholder="请选择" label-in-value>
                      <Option v-for="(item, key) in materialCategory" :value="item.value">{{item.label}}</Option>
                  </Select>
              </Col>
            </Row>
          </Col>
          <Col span="24">
            <div class="btns">
              <Button type="primary" @click="filterSubmit">确定</Button>
              <Button @click="filterReset">重置</Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
    <tables ref="tableMaterial" :total="total" v-model="tableData" :columns="columns" :onChange="pageChange" :onPageSizeChange="pageSizeChange" @on-select="onSelect"></tables>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { deleteMaterial, materialList, materialCategory, listOffice } from '@/api/data'
import { getUserId } from '@/libs/util'
export default {
  name: 'MaterialList',
  components: { Tables },
  data () {
    return {
      officeCategory: [],
      materialCategory: [],
      filterPanel: false,
      idList: [],
      rowId: [],
      total: 0,
      tableData: [],
      params: {
        pageSize: 10,
        page: 1,
        name: '',
        id: '',
        materialCategoryId: '',
        officeId: ''
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
          key: 'action',
          fixed: 'right',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                nativeOn: {
                  click: () => {
                    this.$router.push({ path: 'materialAdd', query: { id: params.row.id } })
                  }
                }
              }, [<Icon size="16" type="md-create" />]),
              h('Button', {
                style: {
                  marginLeft: '6px'
                },
                props: {
                  type: 'success',
                  size: 'small'
                },
                nativeOn: {
                  click: () => {
                    this.$router.push({ path: 'materialDetail', query: { id: params.row.id } })
                  }
                }
              }, [<Icon size="16" type="md-list-box" />]),
              h('Button', {
                style: {
                  marginLeft: '6px'
                },
                props: {
                  type: 'error',
                  size: 'small'
                },
                nativeOn: {
                  click: () => {
                    this.$Modal.confirm({
                      title: '是否执行删除操作',
                      content: '<p>删除后不能找回，还要继续吗</p>',
                      onOk: () => {
                        this.idList = []
                        this.idList.push(params.row.id)
                        this.DeleteMaterial(this.idList)
                      },
                      onCancel: () => {
                        this.$Message.info('操作已取消！')
                      }
                    })
                  }
                }
              }, [<Icon size="16" type="md-trash" />])
            ])
          }
        }
      ]
    }
  },
  created () {
    if (getUserId()) {
      this.params.id = getUserId()
    }
    this.MaterialCategory()
    this.ListOffice()
  },
  methods: {
    cancelAll () {
      console.log('取消全选')
    },
    ListOffice () {
      let _this = this
      let params = {
        page: 0,
        pageSize: 1000,
        userId: getUserId()
      }
      listOffice(params).then((res) => {
        if (res.data.status === '200') {
          _this.officeCategory = res.data.data.list.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        } else {
          _this.$Message.error(res.data.msg)
        }
      })
    },
    MaterialCategory () {
      let _this = this
      materialCategory().then((res) => {
        if (res.data.status === '200') {
          _this.materialCategory = res.data.data.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        } else {
          _this.$Message.error(res.data.msg)
        }
      })
    },
    // 筛选提交
    filterSubmit () {
      this.filterPanel = false
      this.getData()
    },
    // 筛选重置
    filterReset () {
      this.params.materialCategoryId = ''
      this.params.officeId = ''
    },
    openFilter () {
      this.filterPanel = !this.filterPanel
    },
    pageSizeChange (val) {
      console.log(val)
      this.params.pageSize = val
      this.getData()
    },
    pageChange (val) {
      this.params.page = val
      this.getData()
    },
    onSelect (sel, row) {
      this.idList = sel.map((item) => {
        return item.id
      })
    },
    Add () {
      this.$router.push('materialAdd')
    },
    handleSearch () {
      this.params.name = arguments[0]
      this.getData()
    },
    getData () {
      materialList(this.params).then((res) => {
        console.log(res.data.data)
        if (res.data.status === '200') {
          this.tableData = res.data.data.businessMaterialBeanList
          this.total = parseInt(res.data.data.count)
        }
      })
    },
    DeleteMaterial (ids) {
      deleteMaterial({ idList: ids }).then((res) => {
        if (res.data.status === '200') {
          this.$Message.info('删除成功！')
          this.getData()
        } else {
          this.$Message.info('操作失败，请重试！')
        }
      })
    },
    // 批量删除
    dropdownClick (name) {
      if (name === '批量删除') {
        if (this.idList.length > 0) {
          this.$Modal.confirm({
            title: '是否执行删除操作',
            content: '<p>删除后不能找回，还要继续吗</p>',
            onOk: () => {
              this.DeleteMaterial(this.idList)
            }
          })
        }
      } else {
        this.$refs.tableMaterial.clearAll()
        this.idList = []
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
  .filterPanel{
    clear: both;
    padding: 0 0 10px 0;
    .label{
      display: block;
      text-align: right;
      padding-right: 10px;
      line-height: 32px;
    }
    .btns{
      text-align: center;
      .ivu-btn-primary{
        margin-right: 10px;
      }
      .ivu-btn{
        width: 80px;
      }
    }
  }
</style>