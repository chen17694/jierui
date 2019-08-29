<template>
  <Tabs v-model="tab" :animated="false">
    <TabPane label="系统角色" name="system">
      <tables :total="this.total" :on-change="pageChange" :on-page-size-change="pageSizeChange" v-model="tableData" :columns="columns1" @on-edit="editRole" @on-roles="toRoleUserList"  @on-selection-change="onSelectionChange"></tables>
    </TabPane>
    <TabPane label="项目角色" name="project">
      <tables :total="this.total" :on-change="pageChange" :on-page-size-change="pageSizeChange" v-model="tableData" :columns="columns2"></tables>
    </TabPane>
    <div class="handle" slot="extra" v-show="tab==='system'">
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
      <Button type="success" @click="addRole">新增角色</Button>
    </div>
  </Tabs>
</template>

<script>
import Tables from '_c/tables'
import { listRole, deleteRole } from '@/api/data'
import { getUserId } from '@/libs/util'
export default{
  name: 'role',
  components: { Tables },
  data () {
    return {
      tab: 'system',
      params: {
        'pageSize': 10,
        'page': 1
      },
      total: 0,
      type: '1',
      columns1: [
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
      columns2: [
        { title: '角色', key: 'name' }
      ],
      tableData: [],
      rowId: []
    }
  },
  watch: {
    tab: function () {
      this.params.pageSize = 10
      this.params.page = 1
      this.getData()
    }
  },
  methods: {
    pageChange (page) {
      this.params.page = page
      this.getData()
    },
    pageSizeChange (size) {
      this.params.pageSize = size
      this.getData()
    },
    // 选择
    onSelectionChange (row) {
      this.rowId = []
      row.forEach((item) => {
        this.rowId.push(item.id)
      })
    },
    dropdownClick (name) {
      this.rowId = this.rowId.map((item) => {
        return String(item)
      })
      if (name === '批量删除') {
        if (this.rowId.length > 0) {
          this.$Modal.confirm({
            title: '是否执行删除操作',
            content: '<p>删除后不能找回，还要继续吗</p>',
            onOk: () => {
              let params = {
                'ids': this.rowId,
                'userId': getUserId()
              }
              deleteRole(params).then((res) => {
                this.$Message.info(res.data.msg)
                this.getData()
              })
            }
          })
        }
      }
    },
    addRole () {
      this.$router.push({
        name: 'addRole'
      })
    },
    editRole () {
      this.$router.push({
        name: 'editRole',
        query: {
          id: arguments[0].row.id,
          role: arguments[0].row.name
        }
      })
    },
    toRoleUserList () {
      this.$router.push({
        name: 'roleUserList',
        params: {
          id: arguments[0].row.id,
          role: arguments[0].row.name
        }
      })
    },
    getData () {
      this.params.type = this.tab === 'system' ? '1' : '2'
      listRole(this.params).then(res => {
        if (res.data.status === '200') {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped  lang="less">
  .ivu-tabs{
    overflow: initial;
    /deep/ .ivu-tabs-bar{
      border: 0 none;
    }
  }
  .ivu-table-cell{
    margin-left: 10px;
  }
</style>
