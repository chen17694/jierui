<template>
  <div>
    <Row type="flex" justify="space-between" style="padding: 10px 0 20px">
      <Col span="12">
        <div class="searchInput">
          <div class="search">
            <Input search @on-search="handleSearch" placeholder="请输入关键字" type="text" enter-button="搜索">
            <span slot="prepend">消息名称:</span>
            </Input>
          </div>
          <Button class="search-btn" icon="ios-funnel-outline" @click="openFilter"><Icon type="search"/>筛选</Button>
          <div class="showInfo">消息数量：<span class="infonum">{{total}}</span></div>
        </div>
      </Col>
      <!-- <Col span="6"><div class="showInfo">消息数量：<span class="infonum">800</span></div></Col> -->
      <Col span="12">
        <div style="float: right">
          <Dropdown @on-click="dropdownClick" style="margin-right: 10px">
            <Button type="primary" ghost>
              选择操作
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem name="批量删除">批量删除</DropdownItem>
              <DropdownItem name="设为已读">设为已读</DropdownItem>
              <DropdownItem name="取消">取消</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button icon="md-add" type="primary" @click="Add">消息推送</Button>
        </div>
      </Col>
    </Row>
    <div slot="filterPanel" class="filterPanel" v-if="filterPanel">
      <Card :bordered="false">
        <Row>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">消息类型:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.type" placeholder="请选择" label-in-value clearable>
                    <Option value="1">审核审批</Option>
                    <Option value="2">提醒</Option>
                    <Option value="3">催办</Option>
                    <Option value="4">推送</Option>
                    <Option value="5">新任务通知</Option>
                    <Option value="6">任务路口被拒绝</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="12" style="margin-bottom: 16px">
            <Row>
              <Col span="5">
                <span class="label">消息状态:</span>
              </Col>
              <Col span="19">
                <Select v-model="params.isRead" placeholder="请选择" label-in-value clearable>
                    <Option value="0">未读</Option>
                    <Option value="1">已读</Option>
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
    <tables ref="tableMaterial" @on-row-dblclick="onRowClick" :total="total" v-model="tableData" :columns="columns" :on-change="pageChange" :on-page-size-change="pageSizeChange" @on-select="onSelect" @on-select-all="onSelect"></tables>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { listMessage, delMessage, optMessage } from '@/api/data'
import { getUserId } from '@/libs/util'
import { mapMutations } from 'vuex'
export default {
  name: 'infoList',
  components: { Tables },
  data () {
    return {
      officeCategory: [],
      materialCategory: [],
      filterPanel: false,
      ids: [],
      rowId: [],
      total: 0,
      tableData: [],
      params: {
        pageSize: 10,
        page: 1,
        name: '',
        id: '',
        type: '',
        isRead: ''
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        { title: '消息名称',
          render: (h, params) => {
            return h('div', {}, params.row.title)
          }
        },
        { title: '消息类型',
          key: 'type',
          render: (h, params) => {
            let arr = ['', '审核审批', '提醒', '催办', '推送', '通知', '任务路口被拒绝']
            return h('div', {}, arr[params.row.type])
          }
        },
        { title: '发送日期', key: 'createDate' },
        { title: '消息状态',
          key: 'isRead',
          render: (h, params) => {
            return h('div', {
              style: {
                color: params.row.isRead === '0' ? 'red' : 'gray'
              }
            }, params.row.isRead === '0' ? '未读' : '已读')
          }
        }
      ]
    }
  },
  created () {
    if (getUserId()) {
      this.params.id = getUserId()
    }
  },
  methods: {
    ...mapMutations([
      'setMessageCount'
    ]),
    onRowClick () {
      optMessage({ ids: [arguments[0].id], userId: getUserId() }).then((res) => {
        this.setMessageCount(this.$store.state.user.unreadCount - 1)
        this.$router.push(
          {
            path: 'infoDetail',
            query: { id: arguments[0].id, type: arguments[0].type }
          }
        )
      })
    },
    cancelAll () {
    },
    // 筛选提交
    filterSubmit () {
      this.filterPanel = false
      this.getData()
    },
    // 筛选重置
    filterReset () {
      this.params.type = ''
      this.params.isRead = ''
    },
    openFilter () {
      this.filterPanel = !this.filterPanel
    },
    pageSizeChange (val) {
      this.params.pageSize = val
      this.getData()
    },
    pageChange (val) {
      this.params.page = val
      this.getData()
    },
    onSelect (sel, row) {
      this.ids = sel.map((item) => {
        return item.id
      })
    },
    Add () {
      this.$router.push('infoPush')
    },
    handleSearch () {
      this.params.name = arguments[0]
      this.getData()
    },
    getData () {
      listMessage(this.params).then((res) => {
        if (res.data.status === '200') {
          this.tableData = res.data.data.list
          this.total = parseInt(res.data.data.total)
        }
      })
    },
    OptMessage (ids) {
      optMessage({ ids: ids, userId: getUserId() }).then((res) => {
        this.$Message.info(res.data.msg)
        this.setMessageCount(this.$store.state.user.unreadCount - ids.length)
        this.getData()
      })
    },
    DelMessage (ids) {
      // let a = [0,0,0,1, 1,0,0,0, 0,1,1,1, 1,1,1,0]
      // 0000,1010,0010,0011,1000,1001,1110,1101,0110,0111
      // 0001,1100,1011,0101,0100,1111
      delMessage({ ids: ids, userId: getUserId() }).then((res) => {
        this.$Message.info(res.data.msg)
        this.getData()
      })
    },
    // 批量删除
    dropdownClick (name) {
      if (this.ids.length > 0) {
        if (name === '批量删除') {
          if (this.ids.length > 0) {
            this.$Modal.confirm({
              title: '是否删除此条消息？',
              content: '<p>删除后消息不能找回，还要继续吗？</p>',
              onOk: () => {
                this.DelMessage(this.ids)
              }
            })
          }
        } else if (name === '设为已读') {
          this.$Modal.confirm({
            title: '是否进行设为已读操作？',
            content: '<p>状态修改后不能恢复，还要继续吗？</p>',
            onOk: () => {
              this.OptMessage(this.ids)
            }
          })
        } else {
          this.$refs.tableMaterial.clearAll()
          this.ids = []
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
  .showInfo{
    display: inline-block;
    margin-left: 20px;
    .infonum{
      font-size: 14px;
      font-weight: bold;
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
