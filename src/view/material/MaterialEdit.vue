<template>
  <div class="MaterialAdd">
    <div class="head-title">创建物资</div>
    <Form ref="formMaterial" :model="formMaterial" :rules="ruleValidate" :label-width="180">
        <FormItem label="物资名称" prop="name">
          <Row>
              <Col span="20">
                <Input v-model="formMaterial.name" :maxlength="20" placeholder="请输入物资名称"></Input>
              </Col>
              <Col span="4">
                  <div style="text-align:center;color:#808695;">(20字以内)</div>
              </Col>
          </Row>
        </FormItem>
        <FormItem label="物资数量" prop="amount">
          <Row>
              <Col span="20">
                <InputNumber v-model="formMaterial.amount" :min="1"></InputNumber>
              </Col>
          </Row>
        </FormItem>
        <FormItem label="是否需要单位负责人审批" prop="approvalStatus">
            <RadioGroup v-model="formMaterial.approvalStatus">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="所属单位" prop="officeId">
          <Row>
              <Col span="20">
                <Select clearable v-model="formMaterial.officeId" placeholder="请选择" label-in-value @on-change="officeCategoryChange" filterable>
                  <Option v-for="(item, key) in officeCategory" :key="key" :value="item.value">{{item.label}}</Option>
                </Select>
              </Col>
          </Row>
        </FormItem>
        <FormItem label="物资类别" prop="materialCategoryName">
          <Row>
                <Col span="20">
                   <Select clearable v-model="formMaterial.materialCategoryId" placeholder="请选择" label-in-value @on-change="materialCategoryChange" filterable>
                      <Option v-for="(item, key) in materialCategory" :key="key" :value="item.value">{{item.label}}</Option>
                  </Select>
                </Col>
                <Col span="4">
                  <Button type="text" style="color:#2d8cf0;" @click="categoryModal = true">新增</Button>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="是否需要归还" prop="needReturnStatus">
            <RadioGroup v-model="formMaterial.needReturnStatus">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formMaterial')">保存</Button>
            <Button @click="handleReset('formMaterial')" style="margin-left: 8px">返回</Button>
        </FormItem>
    </Form>
    <Modal
        v-model="categoryModal"
        title="新增物资类别"
        @on-ok="categoryOk"
        :loading="categoryLoading"
        @on-cancel="categoryCancel">
        <Alert v-if="categoryWarning" type="error" closable>请输入物资类别/物资类别已存在</Alert>
        <Form :model="formModal" :rules="modalValidate" :label-width="80">
          <FormItem label="物资类别
          " prop="materialCategoryName">
            <Row>
                <Col span="20">
                  <Input v-model="formModal.materialCategoryName" :maxlength="20" placeholder="请输入物资名称"></Input>
                </Col>
                <Col span="4">
                    <div style="text-align:center;color:#808695;">(20字以内)</div>
                </Col>
            </Row>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getUserId, getOffice } from '@/libs/util'
import { materialCategory, listOffice, addMaterial, addMaterialCategory, materialDetail, updateMaterial } from '@/api/data'
export default {
  name: 'MaterialEdit',
  components: { Tables },
  data () {
    return {
      formModal: {
        materialCategoryName: ''
      },
      modalValidate: {
        materialCategoryName: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      categoryWarning: false,
      categoryLoading: true,
      categoryModal: false,
      officeCategory: [],
      materialCategory: [],
      materialCategoryName: '',
      formMaterial: {
        id: '',
        name: '',
        approvalStatus: null,
        amount: 0,
        materialCategoryName: '',
        materialCategoryId: '',
        officeId: '',
        officeName: '',
        needReturnStatus: ''
      },
      ruleValidate: {
        needReturnStatus: [
          { required: true, message: '请选择是否需要归还', trigger: 'blur' }
        ],
        approvalStatus: [
          { required: true, message: '请选择是否需要单位负责人审批', trigger: 'blur' }
        ],
        materialCategoryName: [{ required: true, message: '请选择物资类别', trigger: 'blur' }],
        name: [
          { required: true, message: '请输入少于20字的物资名称/物资名称已重复', trigger: 'blur' }
        ],
        amount: [
          { required: true, type: 'number', message: '请输入物资的数量', trigger: 'blur' }
        ],
        officeId: [
          { required: true, message: '请选择物资所属单位', trigger: 'change' }
        ],
        materialCategoryId: [
          { required: true, message: '请选择物资类别', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.MaterialCategory()
    this.ListOffice(() => {
      this.formMaterial.officeId = getOffice().officeId // 默认设置，当前用户所属单位信息
      this.formMaterial.officeName = getOffice().office
    })
    if (this.$route.query.id) {
      this.MaterialDetail(this.$route.query.id)
    }
  },
  methods: {
    MaterialDetail (id) {
      materialDetail({ id: id }).then((res) => {
        if (res.data.status === '200') {
          let gdata = res.data.data
          this.formMaterial.id = gdata.id
          this.formMaterial.name = gdata.name
          this.formMaterial.amount = Number(gdata.amount)
          this.formMaterial.approvalStatus = gdata.approvalStatus
          this.formMaterial.materialCategoryName = gdata.materialCategoryName
          this.formMaterial.materialCategoryId = gdata.materialCategoryId
          this.formMaterial.officeId = gdata.officeId
          this.formMaterial.officeName = gdata.officeName
          this.formMaterial.needReturnStatus = gdata.needReturnStatus
        } else {}
      })
    },
    AddMaterialCategory () {
      let _this = this
      addMaterialCategory({ name: _this.formModal.materialCategoryName }).then((res) => {
        _this.categoryLoading = false
        if (res.data.status === '200') {
          _this.$Message.info(res.data.msg)
          _this.categoryModal = false
          _this.MaterialCategory()
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    },
    UpdateMaterial () {
      let _this = this
      updateMaterial(_this.formMaterial).then((res) => {
        if (res.data.status === '200') {
          _this.$Message.info(res.data.msg)
          _this.$router.push('materialList')
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    },
    categoryCancel () {
      this.formModal.materialCategoryName = ''
      this.categoryWarning = false
    },
    categoryOk () {
      if (this.formModal.materialCategoryName) {
        this.categoryLoading = true
        this.AddMaterialCategory()
      } else {
        this.categoryWarning = true
        this.categoryLoading = false
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.$route.query.id) {
            this.UpdateMaterial()
          } else {
            this.AddMaterial()
          }
        }
      })
    },
    handleReset (name) {
      this.$router.push('materialList')
    },
    AddMaterial () {
      let _this = this
      addMaterial(_this.formMaterial).then((res) => {
        if (res.data.status === '200') {
          _this.$Message.info(res.data.msg)
          _this.$router.push('materialList')
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    },
    materialCategoryChange (val) {
      this.formMaterial.materialCategoryName = val.label
    },
    officeCategoryChange (val) {
      this.formMaterial.officeName = val.label
    },
    ListOffice (func) {
      let _this = this
      let params = {
        page: 0,
        pageSize: 1000,
        userId: getUserId()
      }
      listOffice(params).then((res) => {
        if (res.data.status === '200') {
          _this.officeCategory = res.data.data.list.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
          if (func && typeof func === 'function') {
            func()
          }
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    },
    MaterialCategory () {
      let _this = this
      materialCategory().then((res) => {
        if (res.data.status === '200') {
          _this.materialCategory = res.data.data.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        } else {
          _this.$Message.info(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .MaterialAdd{
    width: 50%;
  }
  .head-title{
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
</style>
