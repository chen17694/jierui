<template>
  <div>
    <div class="filterPanel">
      <Card :bordered="false">
        <Row>
          <Col span="5">
            <Row>
              <Col span="6">
                <span class="label">选择项目:</span>
              </Col>
              <Col span="17">
                <Select v-model="params.projectId" @on-change="projectChange" label-in-value>
                  <Option v-for="(item, index) in businessProject" :value="item.id " :key="index">{{item.name}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span="5">
            <Row>
              <Col span="6">
                <span class="label">选择任务:</span>
              </Col>
              <Col span="17">
                <Select v-model="params.taskId" @on-change="taskChange" label-in-value>
                  <Option v-for="(item, index) in taskList" :key="index" :value="item.id">{{item.name}}</Option>
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
    <div>
      <div class="tableWrapper">
        <tables ref="tables"  v-model="tableData" :columns="columns" @on-add="addRow" @on-remove="delRow" :showPage="false"></tables>
      </div>
      <Row>
        <Col span="24">
          <div class="btns">
            <Button type="primary" :disabled="save" @click="addSave">确定</Button>
            <Button @click="clear">重置</Button>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { listProject, listTask, listProjectMaterial, materialApplication, materialCategory } from '@/api/data'
import { getUserId } from '@/libs/util'
import Tables from '_c/tables'
export default {
  name: 'applyMaterial',
  components: { Tables },
  data () {
    return {
      params: {
        projectId: '',
        projectName: '',
        taskId: '',
        taskName: ''
      },
      businessProject: [],
      taskList: [],
      tables: [],
      addRows: [
        {
          categoryId: '',
          categoryList: [],
          materialList: [],
          materialId: '',
          surplusNum: 0,
          applyNum: '',
          returnDate: '',
          materialName: '',
          materialTypeName: '',
          projectMaterialId: ''
        }
      ],
      columns: [
        { title: '物资类型',
          key: 'cname',
          width: '250px',
          render: (h, params) => {
            return h('Select', {
              props: {
                value: this.addRows[params.index].categoryId
              },
              on: {
                'on-change': (id) => {
                  this.addRows[params.index].categoryId = id
                  this.addRows[params.index].materialList = []
                  this.addRows[params.index].materialId = ''
                  this.changeCategory(id, params.index)
                  this.addRows[params.index].categoryList.forEach((item) => {
                    if (item.id === id) {
                      this.addRows[params.index].materialTypeName = item.name
                    }
                  })
                }
              }
            }, params.row.cname.map((item) => {
              return h('Option', {
                props: {
                  value: item.id
                }
              }, item.name)
            }))
          }
        },
        { title: '物资名称',
          key: 'mname',
          width: '250px',
          render: (h, params) => {
            let materialId = this.addRows[params.index].materialId
            console.log(materialId)
            console.log(params)
            return h('Select', {
              props: {
                value: this.addRows[params.index].projectMaterialId
              },
              on: {
                'on-change': (id) => {
                  this.addRows[params.index].projectMaterialId = id
                  this.addRows[params.index].materialList.forEach((item) => {
                    if (item.id === id) {
                      this.addRows[params.index].surplusNum = item.surplusAmount
                      this.addRows[params.index].materialName = item.name
                      this.addRows[params.index].materialId = item.materialId
                    }
                  })
                  console.log(this.addRows)
                }
              }
            }, params.row.mname.map((item) => {
              return h('Option', {
                props: {
                  value: item.id
                }
              }, item.name)
            }))
          }
        },
        { title: '库房数量',
          key: 'amount ',
          width: '100px',
          render: (h, params) => {
            return h('span', {}, this.addRows[params.index].surplusNum)
          }
        },
        { title: '申请数量',
          key: 'applyNum',
          width: '100px',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                value: Number(this.addRows[params.index].applyNum),
                min: 0,
                max: Number(this.addRows[params.index].surplusNum)
              },
              on: {
                'on-change': (applyNum) => {
                  this.addRows[params.index].applyNum = applyNum
                }
              }
            })
          }
        },
        { title: '归还日期',
          key: 'returnDate',
          width: '200px',
          render: (h, params) => {
            return h('DatePicker', {
              props: {
                value: this.addRows[params.index].returnDate,
                options: this.options
              },
              on: {
                'on-change': (date) => {
                  this.addRows[params.index].returnDate = date
                }
              }
            })
          }
        },
        {
          title: '操作',
          key: 'handle',
          options: ['add', 'remove']
        }
      ],
      rowIndex: 0,
      tableData: []
    }
  },
  computed: {
    save () {
      if (this.params.projectId && this.params.taskId) {
        return false
      }
      return true
    }
  },
  methods: {
    addSave () {
      console.log(this.addRows)
      let materialList = []
      console.log(this.addRows)
      this.addRows.forEach((item) => {
        materialList.push({
          projectMaterialId: item.projectMaterialId,
          materialTypeId: item.categoryId,
          materialTypeName: item.materialTypeName,
          materialId: item.materialId,
          materialName: item.materialName,
          returnDate: item.returnDate,
          surplusNum: item.surplusNum,
          applyNum: item.applyNum
        })
      })
      let obj = {
        projectId: this.params.projectId,
        projectName: this.params.projectName,
        taskId: this.params.taskId,
        taskName: this.params.taskName,
        userId: getUserId(),
        materialList: materialList
      }
      console.log(obj)
      materialApplication(obj).then((res) => {
        this.$Message.info(res.data.msg)
      }).catch((err) => {
        console.log(err)
      })
    },
    clear () {
      this.rowIndex = 0
      this.addRows = [
        {
          categoryId: '',
          categoryList: [],
          materialList: [],
          materialId: '',
          surplusNum: 0,
          applyNum: '',
          returnDate: '',
          materialName: '',
          materialTypeName: '',
          projectMaterialId: ''
        }
      ]
      materialCategory().then((res) => {
        console.log(res)
        this.addRows[this.rowIndex].categoryList = res.data.data
        this.addInit()
      })
      this.tableData = [{
        cname: this.addRows[0].categoryList,
        mname: this.addRows[0].materialList
      }]
      this.params.projectId = ''
      this.taskList = []
      this.params.taskId = ''
    },
    delRow () {
      console.log(arguments[0])
      console.log(this.addRows)
      this.addRows.splice(arguments[0].index, 1)
      this.tableData.splice(arguments[0].index, 1)
      this.rowIndex = arguments[0].index - 1
      console.log(this.addRows)
    },
    addRow () {
      this.rowIndex = arguments[0].index + 1
      this.addRows.push({
        categoryId: '',
        categoryList: this.addRows[0].categoryList,
        materialList: [],
        materialId: '',
        surplusNum: 0,
        applyNum: '',
        returnDate: '',
        materialName: '',
        materialTypeName: '',
        projectMaterialId: ''
      })
      this.tableData.push({
        cname: this.addRows[this.rowIndex].categoryList,
        mname: this.addRows[this.rowIndex].materialList
      })
    },
    getProject () {
      listProject({
        pageSize: 0,
        page: 0,
        userId: getUserId(),
        projectName: '',
        firstPartyCompanyId: '',
        projectManagerId: '',
        status: '',
        firstPartyScoring: '',
        provinceName: '',
        cityName: '',
        districtName: '',
        timeStatus: '',
        startTime: '',
        endTime: ''
      }).then((res) => {
        this.businessProject = res.data.data.projectList
      })
    },
    addInit () {
      this.tableData = [{
        cname: this.addRows[0].categoryList,
        mname: this.addRows[0].materialList
      }]
    },
    changeCategory (id, index) {
      if (!id) return false
      this.addRows[index].materialId = ''
      listProjectMaterial({
        pageSize: 0,
        page: 0,
        name: '',
        projectId: this.params.projectId,
        materialCategoryId: id,
        userId: getUserId()
      }).then((res) => {
        console.log(res)
        if (res.data.status === '200') {
          this.addRows[index].materialList = res.data.data.businessProjectMaterialBeanList
          this.tableData[index].mname = this.addRows[index].materialList
        } else {
          this.$Message.info('请选择项目')
        }
      })
    },
    taskChange () {
      this.params.taskName = arguments[0] ? arguments[0].label : ''
    },
    projectChange () {
      console.log(arguments)
      this.params.projectName = arguments[0] ? arguments[0].label : ''
      this.taskList = []
      this.params.taskId = ''
      listTask({
        pageSize: 0,
        page: 0,
        businessProjectId: arguments[0] ? arguments[0].value : '',
        type: '',
        name: '',
        taskStatus: '',
        firstPartyScoring: '',
        userId: getUserId(),
        timeStatus: '',
        startTime: '',
        endTime: '',
        provinceName: '',
        cityName: '',
        districtName: ''
      }).then((res) => {
        this.taskList = res.data.data.taskDetailBeans
      })
    }
  },
  mounted () {
    this.getProject()
    materialCategory().then((res) => {
      console.log(res)
      this.addRows[this.rowIndex].categoryList = res.data.data
      this.addInit()
    })
  }
}
</script>

<style scoped lang="less">
  .filterPanel{
    clear: both;
    padding: 0 0 10px 0;
    .label{
      display: block;
      padding-right: 10px;
      line-height: 32px;
    }
  }
  .tableWrapper{
    /deep/ .ivu-table-wrapper{
      overflow: inherit;
    }
  }
  .btns{
    margin-top: 20px;
    text-align: center;
    .ivu-btn-primary{
      margin-right: 10px;
    }
    .ivu-btn{
      width: 80px;
    }
  }
</style>
