<template>
  <div>
    <Row type="flex" justify="space-between" style="padding: 10px 0 20px">
      <Col span="12">
        <p style="font-size: 18px; font-weight: bold">{{this.$route.params.role}}</p>
      </Col>
      <Col span="12" style="text-align: right;">
        <div class="handle">
          <Button type="success" @click="allocate" style="margin-right: 10px">分配用户</Button>
          <Button @click="backPage">返回</Button>
        </div>
      </Col>
    </Row>
    <tables ref="tables" :total="this.total" v-model="tableData" :on-change="pageChange" :on-page-size-change="pageSizeChange" :columns="columns" @on-delete="onDelete"></tables>
    <Modal
      v-model="allocatePanel"
      width="602"
      title="分配用户"
      @on-ok="save"
    >
      <Select v-model="unit" style="width:200px; margin-bottom: 15px" @on-change="selectUnit" filterable clearable>
        <Option v-for="item in unitList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <Transfer
        :data="allocateData"
        :target-keys="targetKeys"
        :render-format="allocateRender"
        :list-style="listStyle"
        @on-change="handleChange"
        :filterable="true"
        :filter-method="filterMethod"
        :titles="transferTitles"
        not-found-text=""></Transfer>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getUserId } from '@/libs/util'
import { listUserRole, getUnitList, listUserRoleDistribution, insertUserRole, deleteUserRole } from '@/api/data'
export default{
  name: 'role',
  components: { Tables },
  data () {
    return {
      transferTitles: ['其他角色人员', '已分配'],
      params: {
        'pageSize': 10,
        'page': 1,
        'id': this.$route.params.id
      },
      unit: '',
      allocatePanel: false,
      allocateData: [],
      targetKeys: [],
      listStyle: {
        width: '254px',
        height: '300px'
      },
      total: 0,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        { title: '姓名', key: 'name', width: '100' },
        { title: '归属单位', key: 'office' },
        {
          title: '操作',
          key: 'handle',
          width: 150,
          options: ['delete']
        }
      ],
      tableData: [],
      unitList: [],
      officeId: ''
    }
  },
  methods: {
    backPage () {
      this.$router.push({
        name: 'role'
      })
    },
    pageChange (page) {
      this.params.page = page
      this.getData()
    },
    pageSizeChange (size) {
      this.params.pageSize = size
      this.getData()
    },
    onDelete () {
      this.$Modal.confirm({
        title: '是否执行删除操作',
        onOk: () => {
          deleteUserRole({
            id: arguments[0].row.id
          }).then((res) => {
            this.$Message.info(res.data.msg)
            this.getData()
          })
        }
      })
    },
    save () {
      insertUserRole({
        'ids': this.targetKeys,
        'officeId': this.officeId,
        'roleId': this.$route.params.id
      }).then((res) => {
        this.$Message.info(res.data.msg)
        this.getData()
      })
    },
    selectUnit () {
      this.officeId = arguments[0]
      listUserRoleDistribution({
        'officeId': this.officeId,
        'roleId': this.$route.params.id
      }).then((res) => {
        if (res.data.status === '200') {
          res.data.data.wait.forEach((item, index) => {
            item.key = item.id
          })
          res.data.data.already.forEach((item, index) => {
            item.key = item.id
          })
          this.allocateData = res.data.data.wait.concat(res.data.data.already)
          this.targetKeys = this.getTargetKeys(res.data.data.already)
        }
      })
    },
    getTargetKeys (data) {
      return data.map(item => item.key)
    },
    filterMethod (data, query) {
      return data.text.indexOf(query) > -1
    },
    handleChange (newTargetKeys) {
      this.targetKeys = newTargetKeys
    },
    allocateRender (item) {
      return item.text
    },
    allocate () {
      this.allocatePanel = !this.allocatePanel
    },
    getData () {
      listUserRole(this.params).then(res => {
        if (res.data.status === '200') {
          this.tableData = res.data.data
          this.total = res.data.data.total
        }
      })
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.getData()
      getUnitList({
        'pageSize': 0,
        'page': 0,
        'name': '',
        'areaId': '',
        'type': '',
        'userId': getUserId()
      }).then(res => {
        if (res.data.status === '200') {
          this.unitList = res.data.data.list
        }
      })
    } else {
      this.backPage()
    }
  }
}
</script>

<style scoped  lang="less">
  .ivu-tabs{
    /deep/ .ivu-tabs-bar{
      border: 0 none;
    }
  }
  .ivu-table-cell{
    margin-left: 10px;
  }
</style>
