<template>
  <div>
    <Row type="flex" justify="space-between" style="padding: 10px 0">
      <Col span="12">
        <p style="font-size: 18px; font-weight: bold">{{this.$route.params.role}}</p>
      </Col>
      <Col span="12" style="text-align: right;">
        <div class="handle">
          <Button type="success" @click="allocate" style="margin-right: 10px">分配用户</Button>
          <Button>返回</Button>
        </div>
      </Col>
    </Row>
    <tables ref="tables" :total="this.total" v-model="tableData" :columns="columns"></tables>
    <Modal
      v-model="allocatePanel"
      width="600"
      title="分配用户"
    >
      <Transfer
        :data="allocateData"
        :target-keys="targetKeys1"
        :render-format="allocateRender"
        :list-style="listStyle"
        @on-change="handleChange1"
        :filterable="true"
        not-found-text=""></Transfer>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { listUserRole } from '@/api/data'
export default{
  name: 'role',
  components: { Tables },
  data () {
    return {
      params: {
        'pageSize': 10,
        'page': 1,
        'id': this.$route.params.id
      },
      allocatePanel: false,
      allocateData: this.getMockData(),
      targetKeys1: this.getTargetKeys(),
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
        { title: '角色', key: 'name' },
        {
          title: '操作',
          key: 'handle',
          width: 150,
          options: ['edit', 'roles']
        }
      ],
      tableData: []
    }
  },
  methods: {
    getMockData () {
      let mockData = []
      for (let i = 1; i <= 20; i++) {
        mockData.push({
          key: i.toString(),
          label: 'Content ' + i,
          description: 'The desc of content  ' + i,
          disabled: Math.random() * 3 < 1
        })
      }
      return mockData
    },
    getTargetKeys () {
      return this.getMockData()
        .filter(() => Math.random() * 2 > 1).map(item => item.key)
    },
    handleChange1 (newTargetKeys, direction, moveKeys) {
      console.log(newTargetKeys)
      console.log(direction)
      console.log(moveKeys)
      this.targetKeys1 = newTargetKeys
    },
    allocateRender (item) {
      return item.label
    },
    back () {
      this.$router.push({
        name: 'roleList'
      })
    },
    allocate () {
      this.allocatePanel = !this.allocatePanel
    },
    getData () {
      listUserRole(this.params).then(res => {
        if (res.data.status === '200') {
          this.tableData = res.data.data
          this.total = res.data.data.total
        } else {
          this.$Message.info('操作失败，请重试！')
        }
      })
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.getData()
    } else {
      this.back()
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
