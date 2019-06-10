<template>
  <Tabs value="system" :animated="false">
    <TabPane label="系统角色" name="system">
      <tables ref="tables" :total="this.total" v-model="tableData" :columns="columns" @on-edit="editRole" @on-roles="toRoleUserList"></tables>
    </TabPane>
    <TabPane label="项目角色" name="project">项目角色</TabPane>
    <div class="handle" slot="extra">
      <Dropdown style="margin-right: 10px">
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
import { listRole } from '@/api/data'
export default{
  name: 'role',
  components: { Tables },
  data () {
    return {
      params: {
        'pageSize': 10,
        'page': 1,
        'type': '1'
      },
      total: 0,
      type: '1',
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
    addRole () {
      this.$router.push({
        name: 'addRole'
      })
    },
    editRole () {
      console.log(arguments)
      this.$router.push({
        name: 'editRole',
        params: {
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
      listRole(this.params).then(res => {
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
    this.getData()
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
