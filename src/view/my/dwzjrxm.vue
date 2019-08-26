<template>
  <div>
    <Card style="margin-bottom: 10px">
      <Steps :current="stepArr.length - 1 ">
        <Step :title="item.name" :content="item.userName ? item.userName + ' ' + item.action : '' + ' ' + item.action" v-for="(item, index) in stepArr" :key="index"></Step>
      </Steps>
    </Card>
    <Card style="margin-bottom: 10px">
      <h3 style="color: #2d8cf0; margin-bottom: 20px">物资加入项目申请信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">项目名称：{{detailData.projectName}}</li>
        <li style="margin-bottom: 5px">申请人员：{{detailData.applyName}}</li>
        <li style="margin-bottom: 5px">归属单位：{{detailData.office}}</li>
        <li style="margin-bottom: 5px">申请时间：{{detailData.createTime}}</li>
        <li style="margin-bottom: 5px">需求描述及原因：{{detailData.applyReason}}</li>
      </ul>
    </Card>
    <div class="btns" style="margin-top: 30px">
      <Button type="primary" @click="shenpi">审批</Button>
      <Button @click="back">返回</Button>
    </div>
    <Modal
      v-model="editPanel"
      title='物资申请审批'
      @on-ok="save"
      width="1200px"
    >
      <Form ref="editParams" :model="editParams">
        <FormItem label="审批结果:">
          <RadioGroup v-model="editParams.opt">
            <Radio label="1">同意</Radio>
            <Radio label="2">拒绝</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="拒绝原因:">
          <Input v-model="editParams.comment" :disabled="editParams.opt === '1'" type="textarea" style="width: 80%" :autosize="{minRows: 5,maxRows: 10}"></Input>
        </FormItem>
      </Form>
      <div class="tableWrapper" v-if="detailData.needForm === '1'">
        <tables ref="tables"  v-model="tableData" :columns="columns" @on-add="addRow" @on-remove="delRow" :showPage="false"></tables>
      </div>
    </Modal>
  </div>
</template>

<script>
import { detailProjectMaterialJoin, materialCategory, materialList, opt } from '@/api/data'
import { getUserId } from '@/libs/util'
import Tables from '_c/tables'
export default {
  name: 'dwzjrxm',
  components: { Tables },
  data () {
    return {
      projectId: '',
      editParams: {
        comment: '',
        opt: '1'
      },
      detailData: {},
      stepArr: [],
      editPanel: false,
      add: false,
      tables: [],
      columns: [
        { title: '物资类型',
          key: 'pname',
          width: '250px',
          render: (h, params) => {
            return h('Select', {
              props: {
                value: this.addRows[params.index].materialCategoryId
              },
              on: {
                'on-change': (id) => {
                  this.addRows[params.index].materialCategoryId = id
                  this.addRows[params.index].materialList = []
                  this.addRows[params.index].materialId = ''
                  this.addRows[params.index].materialCategoryList.forEach((item) => {
                    if (item.id === id) {
                      this.addRows[params.index].materialCategoryName = item.name
                    }
                  })
                  this.getMaterialList(id, params.index)
                }
              }
            }, params.row.pname.map((item) => {
              return h('Option', {
                props: {
                  value: item.id
                }
              }, item.name)
            }))
          }
        },
        { title: '物资名称',
          key: 'tname',
          width: '250px',
          render: (h, params) => {
            return h('Select', {
              props: {
                value: this.addRows[params.index].materialId
              },
              on: {
                'on-change': (id) => {
                  this.addRows[params.index].materialId = id
                  this.addRows[params.index].materialList.forEach((item) => {
                    if (item.id === id) {
                      this.addRows[params.index].materialName = item.name
                      this.addRows[params.index].surplusNum = item.surplusAmount
                      this.addRows[params.index].materialName = item.name
                    }
                  })
                }
              }
            }, params.row.tname.map((item) => {
              return h('Option', {
                props: {
                  value: item.id
                }
              }, item.name)
            }))
          }
        },
        { title: '数量',
          key: 'applyNum',
          width: '100px',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                value: this.addRows[params.index].applyNum,
                min: 1
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
                value: this.addRows[params.index].returnDate
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
      tableData: [],
      addRows: [
        {
          materialCategoryList: [],
          materialList: [],
          materialCategoryId: '',
          materialId: '',
          applyNum: 0,
          surplusNum: 0,
          returnDate: '',
          materialCategoryName: '',
          materialName: ''
        }
      ]
    }
  },
  methods: {
    getMaterialCategory () {
      materialCategory().then((res) => {
        this.addRows[this.rowIndex].materialCategoryList = res.data.data
      })
    },
    back () {
      this.$router.push({
        name: 'myApproval'
      })
    },
    getMaterialList (id, index) {
      if (!id) return false
      materialList({
        pageSize: 0,
        page: 0,
        name: '',
        materialCategoryId: id,
        officeId: ''
      }).then((res) => {
        this.addRows[index].materialList = res.data.data.businessMaterialBeanList
        this.tableData[index].tname = this.addRows[index].materialList
      })
    },
    delRow () {
      this.addRows.splice(arguments[0].index, 1)
      this.tableData.splice(arguments[0].index, 1)
      this.rowIndex = arguments[0].index - 1
    },
    addRow () {
      this.rowIndex = arguments[0].index + 1
      this.addRows.push({
        materialList: [],
        materialCategoryList: this.addRows[0].materialCategoryList,
        materialCategoryId: '',
        materialId: '',
        applyNum: 0,
        surplusNum: 0,
        returnDate: '',
        materialCategoryName: '',
        materialName: ''
      })
      this.tableData.push({
        pname: this.addRows[this.rowIndex].materialCategoryList,
        tname: this.addRows[this.rowIndex].materialList
      })
    },
    shenpi () {
      this.tableData = [{
        pname: this.addRows[0].materialCategoryList,
        tname: this.addRows[0].materialList
      }]
      this.editPanel = true
    },
    save () {
      let obj = {}
      let projectMaterialJoinApproveForm = []
      if (this.detailData.needForm === '1') {
        this.addRows.forEach((item) => {
          projectMaterialJoinApproveForm.push({
            materialTypeId: item.materialCategoryId,
            materialTypeName: item.materialCategoryName,
            materialId: item.materialId,
            materialName: item.materialName,
            returnDate: item.returnDate,
            applyNum: item.applyNum
          })
        })
        obj = {
          opt: this.editParams.opt,
          taskId: this.$route.query.taskId,
          userId: getUserId(),
          comment: this.editParams.comment,
          processType: this.$route.query.type,
          projectMaterialJoinApproveForm: {
            list: projectMaterialJoinApproveForm
          }
        }
      } else {
        obj = {
          opt: this.editParams.opt,
          taskId: this.$route.query.taskId,
          userId: getUserId(),
          comment: this.editParams.comment,
          processType: this.$route.query.type
        }
      }
      opt(obj).then((res) => {
        if (res.data.status === '200') {
          this.$router.push({
            name: 'myApproval'
          })
        }
        this.$Message.info(res.data.msg)
      })
    },
    getData () {
      detailProjectMaterialJoin({
        taskId: this.$route.query.taskId,
        userId: getUserId(),
        type: '1'
      }).then((res) => {
        this.stepArr = res.data.data.list
        this.projectId = res.data.data.projectId
        this.detailData = res.data.data
      })
    }
  },
  mounted () {
    this.getData()
    this.getMaterialCategory()
  }
}
</script>

<style scoped lang="less">
  .btns{
    text-align: center;
    .ivu-btn-primary{
      margin-right: 10px;
    }
    .ivu-btn{
      width: 80px;
    }
  }
  .tableWrapper{
    /deep/ .ivu-table-wrapper{
      overflow: inherit;
    }
  }
</style>
