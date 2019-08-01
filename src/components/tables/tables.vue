<template>
  <div>
    <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top">
      <!--<Select v-model="searchKey" class="search-col">-->
        <!--<Option v-for="item in columns" v-if="item.key !== 'handle'" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>-->
      <!--</Select>-->
    </div>
    <Table
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
      @on-current-change="onCurrentChange"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-selection-change="onSelectionChange"
      @on-sort-change="onSortChange"
      @on-filter-change="onFilterChange"
      @on-row-click="onRowClick"
      @on-row-dblclick="onRowDblclick"
      @on-expand="onExpand"
    >
      <slot name="header" slot="header"></slot>
      <slot name="footer" slot="footer"></slot>
      <slot name="loading" slot="loading"></slot>
      <template slot-scope="{ row, index }" slot="action" v-if="projectListBtnVisible">
        <div style="display: flex">
          <div v-for="(item, index) in row.projectButtonPermissionBeans" :key="index" style="height: 30px">
            <img src="../../assets/images/p1.png" v-if="item.permissionCode === '1'" title="开始项目" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/p1.png" v-if="item.permissionCode === '2' && row.pauseStatus === '1' " title="开始项目" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/p2.png" v-if="item.permissionCode === '2' && row.pauseStatus === '0' " title="暂停项目" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/p3.png" v-if="item.permissionCode === '3'" title="申请暂停项目" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/p4.png" v-if="item.permissionCode === '4'" title="撤销项目" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/p5.png" v-if="item.permissionCode === '5'" title="申请撤销项目" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/p6.png" v-if="item.permissionCode === '6'" title="逾期催办项目" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/p7.png" v-if="item.permissionCode === '7'" title="提交审核项目" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/p8.png" v-if="item.permissionCode === '8'" title="删除项目" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/p9.png" v-if="item.permissionCode === '99'" title="创建任务" class="btn" @click="onEdit(item, row)">
          </div>
        </div>
      </template>
      <template slot-scope="{ row, index }" slot="action" v-if="taskListBtnVisible">
        <div style="display: flex">
          <div v-for="(item, index) in row.taskButtonPermissionBeans" :key="index" style="height: 30px">
            <img src="../../assets/images/t1.png" v-if="item.permissionCode === '1'" title="下达任务" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/t2.png" v-if="item.permissionCode === '2' && row.pauseStatus === '1' " title="开始项目" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/t2.png" v-if="item.permissionCode === '2' && row.pauseStatus === '0' " title="暂停项目" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/t3.png" v-if="item.permissionCode === '3'" title="撤销任务" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/t4.png" v-if="item.permissionCode === '4'" title="撤销项目" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/t5.png" v-if="item.permissionCode === '5'" title="新增任务路口" class="btn" @click="onEdit(item, row)">
            <img src="../../assets/images/t6.png" v-if="item.permissionCode === '6'" title="删除任务" class="btn" @click="onEdit(item, row)">
          </div>
        </div>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden" v-show="this.showPage">
      <div style="float: right;">
        <Page :total="this.total" :current="1" @on-change="onChange" @on-page-size-change="onPageSizeChange" show-sizer show-elevator :page-size="PageSize"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import TablesEdit from './edit.vue'
import handleBtns from './handle-btns'
import './index.less'
export default {
  name: 'Tables',
  props: {
    PageSize: {
      type: Number,
      default: 10
    },
    projectListBtnVisible: {
      type: Boolean,
      default: false
    },
    taskListBtnVisible: {
      type: Boolean,
      default: false
    },
    showPage: {
      type: Boolean,
      default: true
    },
    onChange: {
      type: Function,
      default () {
        return null
      }
    },
    onPageSizeChange: {
      type: Function,
      default () {
        return null
      }
    },
    total: {
      type: Number,
      default () {
        return 0
      }
    },
    value: {
      type: Array,
      default () {
        return []
      }
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default () {
        return ''
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    searchPlace: {
      type: String,
      default: 'top'
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data () {
    return {
      insideColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: '',
      searchKey: ''
    }
  },
  methods: {
    suportEdit (item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            'input': val => {
              this.edittingText = val
            },
            'on-start-edit': (params) => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`
              this.$emit('on-start-edit', params)
            },
            'on-cancel-edit': (params) => {
              this.edittingCellId = ''
              this.$emit('on-cancel-edit', params)
            },
            'on-save-edit': (params) => {
              this.value[params.row.initRowIndex][params.column.key] = this.edittingText
              this.$emit('input', this.value)
              this.$emit('on-save-edit', Object.assign(params, { value: this.edittingText }))
              this.edittingCellId = ''
            }
          }
        })
      }
      return item
    },
    surportHandle (item) {
      let options = item.options || []
      let insideBtns = []
      options.forEach(item => {
        if (handleBtns[item]) insideBtns.push(handleBtns[item])
      })
      let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns
      item.render = (h, params) => {
        params.tableData = this.value
        return h('div', btns.map(item => item(h, params, this)))
      }
      console.log(item)
      return item
    },
    handleColumns (columns
    ) {
      this.insideColumns = columns.map((item, index) => {
        let res = item
        console.log(res)
        if (res.editable) res = this.suportEdit(res, index)
        if (res.key === 'handle') res = this.surportHandle(res)
        return res
      })
    },
    setDefaultSearchKey () {
      this.searchKey = this.columns[0].key !== 'handle' ? this.columns[0].key : (this.columns.length > 1 ? this.columns[1].key : '')
    },
    handleClear (e) {
      if (e.target.value === '') this.insideTableData = this.value
    },
    handleTableData () {
      this.insideTableData = this.value.map((item, index) => {
        let res = item
        res.initRowIndex = index
        return res
      })
    },
    exportCsv (params) {
      this.$refs.tablesMain.exportCsv(params)
    },
    clearAll () {
      // this.$refs.talbesMain.selectAll(false)
    },
    clearCurrentRow () {
      this.$refs.talbesMain.clearCurrentRow()
    },
    onCurrentChange (currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onEdit (params, row) {
      this.$emit('on-edit', params, row)
    },
    onSelect (selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel (selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll (selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange (selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange (column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange (row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick (row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick (row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand (row, status) {
      this.$emit('on-expand', row, status)
    }
  },
  watch: {
    columns (columns) {
      this.handleColumns(columns)
      this.setDefaultSearchKey()
    },
    value (val) {
      this.handleTableData()
    }
  },
  mounted () {
    this.handleColumns(this.columns)
    this.setDefaultSearchKey()
    this.handleTableData()
  }
}
</script>
<style>
  .btn{
    width: 30px;
    cursor: pointer;
  }
</style>
