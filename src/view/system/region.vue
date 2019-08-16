<template>
  <div>
    <Row type="flex" justify="end" style="padding: 10px 0">
      <Col span="24">
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
        </div>
      </Col>
    </Row>
    <tree-table ref="child1" expand-key="name" searchable :expand-type="false" children-prop="child" :selectable="true" :columns="columns" :data="tableData" @checkbox-click="onSelect">
      <template slot="type" slot-scope="scope">
        <div>{{renderType(scope)}}</div>
      </template>
      <template slot="likes" slot-scope="scope">
        <Button style="margin-right: 10px"  @click="onAdd(scope)">
          <Icon type="md-add"  size="14"/>
        </Button>
        <Button @click="onEdit(scope)" v-if="renderType(scope) !== '国家'">
          <Icon type="md-settings" size="14"/>
        </Button>
      </template>
    </tree-table>
    <Modal
      v-model="newRegionPanel"
      @on-cancel="closeEdit"
      :title="modalType === 0 ? '新增行政区划' : '编辑行政区划'">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <FormItem label="上级行政区划">
          {{this.parentName}}
        </FormItem>
        <FormItem label="行政区划名称" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入行政区划名称"></Input>
        </FormItem>
        <FormItem label="行政区划类型" prop="type">
          <Select v-model="formValidate.type" placeholder="请选择行政区划类型">
            <Option value="0">根节点</Option>
            <Option value="1">国家</Option>
            <Option value="2">省</Option>
            <Option value="3">市</Option>
            <Option value="4">区</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="closeEdit">取消</Button>
        <Button type="primary" size="large" @click="addArea">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getRegionList, insertOrUpdateOffice, deleteArea } from '@/api/data'
import { getUserId } from '@/libs/util'
export default {
  name: 'unit_table_page',
  data () {
    return {
      columns: [
        { title: '行政区划',
          key: 'name'
        },
        { title: '区划类型',
          key: 'type',
          width: '200px',
          type: 'template',
          template: 'type'
        },
        {
          title: '操作',
          key: 'likes',
          width: '150px',
          type: 'template',
          template: 'likes'
        }
      ],
      tableData: [],
      rowId: [],
      modalType: 0,
      newRegionPanel: false,
      parentName: '',
      formValidate: {
        name: '',
        parentId: '',
        type: '',
        id: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入行政区划名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择行政区划类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    renderType () {
      return function () {
        if (arguments[0].row.type === '1') {
          return '国家'
        } else if (arguments[0].row.type === '2') {
          return '省'
        } else if (arguments[0].row.type === '3') {
          return '市'
        } else {
          return '区'
        }
      }
    }
  },
  methods: {
    // 单选
    onSelect (row) {
      this.rowId = this.$refs.child1.getCheckedProp('id')
      console.log(this.rowId)
    },
    // 全选
    onSelectionChange (row) {
      this.rowId = []
      row.forEach((item) => {
        this.rowId.push(item.id)
      })
      console.log(this.rowId)
    },
    // 批量删除
    dropdownClick (name) {
      this.rowId = this.rowId.map((item) => {
        return String(item)
      })
      console.log(this.rowId)
      if (name === '批量删除') {
        let params = {
          'ids': this.rowId,
          'userId': getUserId()
        }
        if (this.rowId.length > 0) {
          this.$Modal.confirm({
            title: '是否执行删除操作',
            content: '<p>删除后不能找回，还要继续吗</p>',
            onOk: () => {
              deleteArea(params).then((res) => {
                this.$Message.info(res.data.msg)
                this.getData()
              })
            }
          })
        }
      }
    },
    // 新增
    onAdd () {
      this.modalType = 0
      this.formValidate.parentId = arguments[0].row.id
      this.parentName = arguments[0].row.name
      this.newRegionPanel = true
    },
    // 编辑
    onEdit () {
      console.log(arguments)
      this.modalType = 1
      this.formValidate.parentId = arguments[0].row.parentId
      this.formValidate.id = arguments[0].row.id
      this.formValidate.name = arguments[0].row.name
      this.formValidate.type = arguments[0].row.type
      this.parentName = arguments[0].row.name
      this.newRegionPanel = true
    },
    addArea () {
      let params = {}
      if (this.modalType === 1) {
        params = {
          'id': this.formValidate.id,
          'name': this.formValidate.name,
          'parentId': this.formValidate.parentId,
          'type': this.formValidate.type,
          'userId': getUserId()
        }
      } else {
        params = {
          'name': this.formValidate.name,
          'parentId': this.formValidate.parentId,
          'type': this.formValidate.type,
          'userId': getUserId()
        }
      }
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          insertOrUpdateOffice(params).then(res => {
            this.$Message.info(res.data.msg)
            this.getData()
            this.newRegionPanel = false
            this.$refs['formValidate'].resetFields()
          })
        }
      })
    },
    // 关闭编辑
    closeEdit () {
      this.newRegionPanel = false
      this.$refs['formValidate'].resetFields()
    },
    getData () {
      getRegionList().then(res => {
        if (res.data.status === '200') {
          console.log(res)
          this.tableData = res.data.data
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
</style>
