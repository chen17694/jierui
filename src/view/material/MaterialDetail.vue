<template>
  <div>
    <Row type="flex" justify="space-between" style="padding: 10px 0 20px">
      <Col span="12">
       <div class="materialName">激光测距仪</div>
      </Col>
      <Col span="12">
        <div style="float: right">
          <Button type="primary" style="margin-left: 20px;width:100px" @click="edit">编辑</Button>
          <Button type="success" style="margin-left: 20px;width:100px" @click="returnBack">返回</Button>
        </div>
      </Col>
      <Col span="24">
       <div class="baseInfo">物资基本信息</div>
      </Col>
      <Col span="8">
       <div class="infoItem">物资名称：{{info.name}}</div>
      </Col>
      <Col span="8">
       <div class="infoItem">物资所属单位：{{info.officeName}}</div>
      </Col>
      <Col span="8">
       <div class="infoItem">物资类别：{{info.materialCategoryName}}</div>
      </Col>
      <Col span="8">
       <div class="infoItem">是否需要单位负责人审批：{{info.approvalStatus == '0' ? '否' : '是'}}</div>
      </Col>
      <Col span="8">
       <div class="infoItem">是否需要归还：{{info.needReturnStatus == '0' ? '否' : '是'}}</div>
      </Col>
      <Col span="8">
       <div class="infoItem">物资总数：{{info.amount}}</div>
      </Col>
      <Col span="8">
       <div class="infoItem">剩余数量：{{info.surplusAmount}}</div>
      </Col>
      <Col span="8">
       <div class="infoItem">出借数量：{{info.lendAmount}}</div>
      </Col>
    </Row>
    <div class="alreadyLend">已借出物资</div>
    <tables ref="tableLend" :total="total" v-model="tableData" :columns="columns" :on-change="pageChange" :on-page-sizeChange="pageSizeChange"></tables>

  </div>
</template>

<script>
import Tables from '_c/tables'
import { materialDetail, overdueRush } from '@/api/data'
import { getUserId } from '@/libs/util'
export default {
  name: 'MaterialDetail',
  components: { Tables },
  data () {
    return {
      info: {},
      total: 0,
      tableData: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80,
          align: 'center'
        },
        { title: '项目名称', key: 'name' },
        { title: '任务名称', key: 'projectNane' },
        { title: '出借数量', key: 'taskName' },
        { title: '申请人员', key: 'amount' },
        { title: '申请时间', key: 'completionTime' },
        { title: '截止日期', key: 'remainderDays' },
        { title: '逾期天数', key: 'remainderDays' },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 170,
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
              }, '逾期催办')
            ])
          }
        }
      ]
    }
  },
  created () {
    if (this.$route.query.id) {
      this.MaterialDetail()
    }
  },
  methods: {
    edit () {
      this.$router.push({ path: 'materialAdd', query: { id: this.$route.query.id } })
    },
    returnBack () {
      this.$router.push('materialList')
    },
    pageSizeChange (val) {
      this.params.pageSize = val
      this.getData()
    },
    pageChange (val) {
      this.params.page = val
      this.getData()
    },
    MaterialDetail () {
      let _this = this
      materialDetail({ id: _this.$route.query.id }).then((res) => {
        if (res.data.status === '200') {
          _this.info = res.data.data
          _this.tableData = res.data.data.taskMaterialBeanList
        }
      })
    },
    OverdueRush (id) { // 物资催办
      let _this = this
      let params = {
        userId: getUserId(),
        taskMaterialId: id
      }
      _this.$Modal.confirm({
        title: '提示',
        content: '<p>确认催办此物资？</p>',
        onOk: () => {
          overdueRush(params).then((res) => {
            _this.$Message.info(res.data.msg)
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
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
  .materialName{
    font-size: 24px;
  }
  .baseInfo{
    margin-top: 40px;
    margin-bottom: 20px;
    font-size: 18px;
  }
  .infoItem{
    font-size: 14px;
    margin-bottom: 10px;
  }
  .alreadyLend{
    margin: 10px auto 20px;
    font-size: 18px;
  }
</style>
