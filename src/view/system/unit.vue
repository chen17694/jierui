<template>
  <div>
    <Row type="flex" justify="space-between" style="padding: 10px 0">
      <Col span="12">
        <div class="searchInput">
          <div class="search">
            <Input search @on-search="handleSearch" placeholder="输入关键字搜索" type="text" enter-button="搜索">
            <span slot="prepend">单位名称:</span>
            </Input>
          </div>
          <Button class="search-btn" type="primary" @click="openFilter"><Icon type="search"/>筛选</Button>
        </div>
      </Col>
      <Col span="12">
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
          <Button type="success" @click="onAdd">新增单位</Button>
        </div>
      </Col>
    </Row>
    <div slot="filterPanel" class="filterPanel" v-if="filter===true">
      <Card :bordered="false">
        <Row>
          <Col span="12">
            <Row>
              <Col span="5">
                <span class="label">所属地:</span>
              </Col>
              <Col span="19">
                <AreaSelect
                  name="area1"
                  :province="areaParams1.province"
                  :city="areaParams1.city"
                  :district="areaParams1.district"
                  :obj="areaParams1"
                  :getProvince="getProvince"
                  :getCity="getCity"
                  :getDistrict="getDistrict"
                  :provinceId="listParams.provinceId"
                  :cityId="listParams.cityId"
                  :districtId="listParams.districtId"
                  @getId="getId"
                />
              </Col>
            </Row>
          </Col>
          <Col span="12">
            <Row>
              <Col span="5">
                <span class="label">单位类型:</span>
              </Col>
              <Col span="19">
                <Select v-model="listParams.type">
                  <Option value="1">主营单位</Option>
                  <Option value="2">下属单位</Option>
                  <Option value="3">甲方单位</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="24">
            <div class="btns">
              <Button type="primary" @click="filterSubmit ">确定</Button>
              <Button @click="filterReset">重置</Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
    <tables ref="tables" :total="this.total" :on-change="this.pageChange" :on-page-size-change="this.PageSizeChange" v-model="tableData" :columns="columns" @on-edit="onEdit" @on-selection-change="onSelectionChange"></tables>
    <Modal
      v-model="deletePanel"
      width="300"
      title=""
    >
      <div>
        <p>删除后不能找回，还要继续吗？</p>
      </div>
      <div slot="footer">
        <Button type="text" size="large">取消</Button>
        <Button type="primary" size="large">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="editPanel"
      @on-cancel="closeEdit"
      :title="editType === 0 ? '新增单位' : '编辑单位'">
      <Form ref="editParams" :model="editParams" :rules="ruleValidate" :label-width="120">
        <FormItem label="单位名称" prop="name">
          <Input v-model="editParams.name" placeholder="请输入单位名称"></Input>
        </FormItem>
        <FormItem label="所属地">
          <AreaSelect
            name="area2"
            :province="areaParams2.province"
            :city="areaParams2.city"
            :district="areaParams2.district"
            :obj="areaParams2"
            :getProvince="getProvince"
            :getCity="getCity"
            :getDistrict="getDistrict"
            :provinceId="editParams.provinceId"
            :cityId="editParams.cityId"
            :districtId="editParams.districtId"
            @getId="getId"
          />
        </FormItem>
        <FormItem label="是否设为甲方单位" prop="isFirstParty" v-if="this.editType===0">
          <RadioGroup v-model="editParams.isFirstParty">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="closeEdit">取消</Button>
        <Button type="primary" size="large" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import AreaSelect from './area'
import { getUnitList, addOffice, delOffice, listAreaByType } from '@/api/data'
export default{
  name: 'unit_table_page',
  components: { Tables, AreaSelect },
  data () {
    return {
      listParams: {
        'pageSize': 10,
        'page': 1,
        'name': '',
        'type': '',
        'provinceId': '',
        'cityId': '',
        'districtId': '',
        'userId': 'd3c6b26c272f4b0c96ec8f7a3062230b'
      },
      total: 0,
      tableData: [],
      editParams: {
        name: '',
        isFirstParty: '',
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        districtId: '',
        districtName: '',
        userId: 'd3c6b26c272f4b0c96ec8f7a3062230b'
      },
      areaParams1: {
        province: [],
        city: [],
        district: []
      },
      areaParams2: {
        province: [],
        city: [],
        district: []
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        isFirstParty: [
          { required: true, message: '请选择是否设为甲方单位', trigger: 'change' }
        ]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        { title: '单位名称', key: 'name' },
        { title: '所属地', key: 'area' },
        { title: '单位人数', key: 'num' },
        { title: '单位类型',
          key: 'type',
          render: (h, params) => {
            console.log(params)
            let text = ''
            if (params.row.type === '1') {
              text = '主管单位'
            } else if (params.row.type === '2') {
              text = '下属单位'
            } else {
              text = '甲方单位'
            }
            return h('div', { props: {} }, text)
          }
        },
        {
          title: '操作',
          key: 'handle',
          options: ['edit']
        }
      ],
      filter: false,
      editPanel: false,
      editType: 0,
      rowId: [],
      deletePanel: false
    }
  },
  methods: {
    getId (val, name, type) {
      if (name === 'area1') {
        switch (type) {
          case 1:
            this.listParams.provinceId = val
            break
          case 2:
            this.listParams.cityId = val
            break
          case 3:
            this.listParams.districtId = val
            break
        }
      } else if (name === 'area2') {
        switch (type) {
          case 1:
            if (!val) {
              this.editParams.provinceId = ''
              this.editParams.provinceName = ''
            } else {
              this.editParams.provinceId = val
              for (let i = 0; i < this.areaParams2.province.length; i++) {
                if (this.areaParams2.province[i].id === val) {
                  this.editParams.provinceName = this.areaParams2.province[i].name
                  break
                }
              }
            }
            break
          case 2:
            if (!val) {
              this.editParams.cityId = ''
              this.editParams.cityName = ''
            } else {
              this.editParams.cityId = val
              for (let i = 0; i < this.areaParams2.city.length; i++) {
                if (this.areaParams2.city[i].id === val) {
                  this.editParams.cityName = this.areaParams2.city[i].name
                  break
                }
              }
            }
            break
          case 3:
            if (!val) {
              this.editParams.districtId = ''
              this.editParams.districtName = ''
            } else {
              this.editParams.districtId = val
              for (let i = 0; i < this.areaParams2.district.length; i++) {
                if (this.areaParams2.district[i].id === val) {
                  this.editParams.districtName = this.areaParams2.district[i].name
                  break
                }
              }
            }
            break
        }
      }
    },
    getProvince (obj) {
      obj.city = []
      obj.district = []
      return new Promise((resolve) => {
        listAreaByType({
          'parentId': '1',
          'type': '2'
        }).then(res => {
          if (res.data.status === '200') {
            obj.province = res.data.data
            resolve()
          }
        })
      })
    },
    getCity (id, obj) {
      console.log(id)
      obj.district = []
      return new Promise((resolve) => {
        listAreaByType({
          'parentId': id,
          'type': '3'
        }).then(res => {
          if (res.data.status === '200') {
            obj.city = res.data.data
            resolve()
          }
        })
      })
    },
    getDistrict (id, obj) {
      return new Promise((resolve) => {
        listAreaByType({
          'parentId': id,
          'type': '4'
        }).then(res => {
          if (res.data.status === '200') {
            obj.district = res.data.data
            resolve()
          }
        })
      })
    },
    // 批量删除
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
                'userId': 'd3c6b26c272f4b0c96ec8f7a3062230b'
              }
              delOffice(params).then((res) => {
                if (res.data.status === '200') {
                  this.$Message.info('删除成功！')
                  this.getData()
                } else {
                  this.$Message.info('操作失败，请重试！')
                }
              })
            }
          })
        }
      }
    },
    // 打开筛选
    openFilter () {
      this.filter = !this.filter
    },
    onAdd () {
      this.editType = 0
      this.getProvince(this.areaParams2)
      this.editPanel = true
    },
    // 关闭编辑面板
    closeEdit () {
      this.editPanel = false
      this.areaParams2.province = []
      this.areaParams2.city = []
      this.areaParams2.district = []
      this.editParams.provinceId = ''
      this.editParams.provinceName = ''
      this.editParams.cityId = ''
      this.editParams.cityName = ''
      this.editParams.districtId = ''
      this.editParams.districtName = ''
      this.$refs['editParams'].resetFields()
    },
    // 编辑
    onEdit () {
      this.editType = 1
      let provinceId = arguments[0].row.provinceId
      let cityId = arguments[0].row.cityId
      let districtId = arguments[0].row.districtId
      this.editParams.id = arguments[0].row.id
      this.editParams.name = arguments[0].row.name
      this.editParams.provinceName = arguments[0].row.provinceName
      this.editParams.cityName = arguments[0].row.cityName
      this.editParams.districtName = arguments[0].row.districtName
      this.getArea(provinceId, cityId, districtId)
      this.editPanel = true
    },
    getArea (provinceId, cityId, districtId) {
      this.getProvince(this.areaParams2).then(() => {
        this.editParams.provinceId = provinceId
        return provinceId
      }).then((res) => {
        this.getCity(res, this.areaParams2).then(() => {
          this.editParams.cityId = cityId
          return cityId
        }).then((res) => {
          this.getDistrict(res, this.areaParams2).then(() => {
            this.editParams.districtId = districtId
          })
        })
      })
    },
    // 选择
    onSelectionChange (row) {
      this.rowId = []
      row.forEach((item) => {
        this.rowId.push(item.id)
      })
    },
    // 新建&编辑提交
    handleSubmit () {
      this.$refs['editParams'].validate((valid) => {
        console.log(valid)
        if (valid) {
          let params = {}
          if (this.editType === 1) {
            params = {
              'id': this.editParams.id,
              'name': this.editParams.name,
              'provinceId': this.editParams.provinceId,
              'provinceName': this.editParams.provinceName,
              'cityId': this.editParams.cityId,
              'cityName': this.editParams.cityName,
              'districtId': this.editParams.districtId,
              'districtName': this.editParams.districtName,
              'userId': this.editParams.userId
            }
          } else {
            params = {
              'name': this.editParams.name,
              'isFirstParty': this.editParams.isFirstParty,
              'provinceId': this.editParams.provinceId,
              'provinceName': this.editParams.provinceName,
              'cityId': this.editParams.cityId,
              'cityName': this.editParams.cityName,
              'districtId': this.editParams.districtId,
              'districtName': this.editParams.districtName,
              'userId': this.editParams.userId
            }
          }
          addOffice(params).then(res => {
            if (res.data.status === '200') {
              this.$Message.success('操作成功!')
              this.editPanel = false
              this.$refs['editParams'].resetFields()
              this.getData()
            } else {
              this.$Message.info('操作失败，请重试！')
            }
          })
        } else {
          this.editPanel = true
        }
      })
    },
    pageChange (page) {
      this.listParams.page = page
      this.getData()
    },
    PageSizeChange (size) {
      this.listParams.pageSize = size
      this.getData()
    },
    getData () {
      getUnitList(this.listParams).then(res => {
        if (res.data.status === '200') {
          res.data.data.list.forEach((item) => {
            item.area = (item.provinceName || '') + (item.cityName || '') + (item.districtName || '')
          })
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$Message.info('操作失败，请重试！')
        }
      })
    },
    // 搜索
    handleSearch (val) {
      this.listParams.name = val
      this.getData()
    },
    // 筛选提交
    filterSubmit () {
      this.getData()
    },
    // 筛选重置
    filterReset () {
      this.areaParams1.province = []
      this.areaParams1.city = []
      this.areaParams1.district = []
      this.listParams.type = ''
      this.listParams.provinceId = ''
      this.listParams.cityId = ''
      this.listParams.districtId = ''
      this.getProvince(this.areaParams1)
    }
  },
  mounted () {
    this.getData()
    this.getProvince(this.areaParams1)
  }
}
</script>

<style scoped lang="less">
  .ivu-select{
    margin-bottom: 10px;
  }
  .handle{
    float: right;
  }
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
      margin-top: 6px;
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
