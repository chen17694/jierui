<template>
  <div>
    <Row type="flex" justify="end" style="padding: 10px 0">
      <Col span="24">
        <div class="handle">
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
    <tree-table ref="child1" expand-key="region" searchable :expand-type="false" :selectable="true" :columns="columns" :data="tableData" @checkbox-click="onSelect">
      <template slot="likes" slot-scope="scope">
        <Button style="margin-right: 10px"  @click="open('新增行政区划')">
          <Icon type="md-add"  size="14"/>
        </Button>
        <Button @click="onEdit(scope)">
          <Icon type="md-settings" size="14"/>
        </Button>
      </template>
    </tree-table>
    <Modal
      v-model="newRegionPanel"
      @on-cancel="close('区划编辑')"
      :title="modalType === 0 ? '新增行政区划' : '编辑行政区划'">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <FormItem label="上级行政区划" prop="parentRegion">
          <Select v-model="formValidate.parentRegion" placeholder="请选择上级行政区划">
            <Option value="中国">中国</Option>
            <Option value="辽宁">辽宁</Option>
            <Option value="沈阳">沈阳</Option>
            <Option value="吉林">吉林</Option>
            <Option value="黑龙江">黑龙江</Option>
          </Select>
        </FormItem>
        <FormItem label="行政区划名称" prop="region">
          <Input v-model="formValidate.region" placeholder="请输入行政区划名称"></Input>
        </FormItem>
        <FormItem label="行政区划类型" prop="regionType">
          <Select v-model="formValidate.regionType" placeholder="请选择行政区划类型">
            <Option value="国家">国家</Option>
            <Option value="省份">省份</Option>
            <Option value="市">市</Option>
            <Option value="区">区</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="close('区划编辑')">取消</Button>
        <Button type="primary" size="large">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getRegionTableData } from '@/api/data'
export default {
  name: 'unit_table_page',
  data () {
    return {
      columns: [
        { title: '行政区划',
          key: 'region'
        },
        { title: '区划类型', key: 'type', width: '200px' },
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
      formValidate: {
        region: '',
        parentRegion: '',
        regionType: ''
      },
      ruleValidate: {
        region: [
          { required: true, message: '请输入行政区划名称', trigger: 'blur' }
        ],
        parentRegion: [
          { required: true, message: '请选择上级行政区划', trigger: 'change' }
        ],
        regionType: [
          { required: true, message: '请选择行政区划类型', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    onSelect (row) {
      this.rowId = this.$refs.child1.getCheckedProp('region')
    },
    dropdownClick (name) {
      if (name === '批量删除') {
        if (this.rowId.length > 0) {
          this.$Modal.confirm({
            title: '是否执行删除操作',
            content: '<p>删除后不能找回，还要继续吗</p>',
            onOk: () => {
              this.$Message.info('删除成功！')
            }
          })
        }
      }
    },
    open (a) {
      console.log(a)
      switch (a) {
        case '新增行政区划' :
          this.modalType = 0
          this.newRegionPanel = true
          break
        default:
          return false
      }
    },
    onEdit () {
      console.log(arguments)
      this.modalType = 1
      this.formValidate = {
        regionType: arguments[0].row.type,
        region: arguments[0].row.region,
        parentRegion: arguments[0].row.parent
      }
      this.newRegionPanel = true
    },
    close (a) {
      switch (a) {
        case '区划编辑' :
          this.newRegionPanel = false
          this.$refs['formValidate'].resetFields()
          break
        default:
          return false
      }
    }
  },
  mounted () {
    getRegionTableData().then(res => {
      this.tableData = res.data
    })
  }
}
</script>

<style scoped>
  .handle{
    float: right;
  }
</style>
