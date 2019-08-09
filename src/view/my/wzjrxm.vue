<template>
  <div>
    <Card style="margin-bottom: 10px">
      <Steps :current="1">
        <Step :title="item.name" :content="item.userName ? item.userName : '' + ' ' +item.action" v-for="(item, index) in stepArr" :key="index"></Step>
      </Steps>
    </Card>
    <Card style="margin-bottom: 10px">
      <div v-if="detailData.status === '3'" style="margin-bottom: 10px">
        拒绝原因：{{detailData.rejectReason}}
      </div>
      <h3 style="color: #2d8cf0; margin-bottom: 20px">物资加入项目申请信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">项目名称：{{detailData.projectName}}</li>
        <li style="margin-bottom: 5px">申请人员：{{detailData.applyName}}</li>
        <li style="margin-bottom: 5px">申请时间：{{detailData.createTime}}</li>
        <li style="margin-bottom: 5px">需求描述及原因：{{detailData.applyReason}}</li>
      </ul>
    </Card>
    <div class="btns" style="margin-top: 30px">
      <Button type="primary" @click="chexiao" v-if="detailData.isCancel === '1'">撤销</Button>
      <Button @click="back">返回</Button>
    </div>
  </div>
</template>

<script>
import { detailProjectMaterialJoin, materialCategory, materialList, opt } from '@/api/data'
import { getUserId } from '@/libs/util'
import Tables from '_c/tables'
export default {
  name: 'wzjrxm',
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
            console.log(this.addRows[params.index])
            return h('InputNumber', {
              props: {
                value: this.addRows[params.index].applyNum
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
    back () {
      this.$router.push({
        name: 'projectOverdue'
      })
    },
    getMaterialCategory () {
      materialCategory().then((res) => {
        console.log(res)
        this.addRows[this.rowIndex].materialCategoryList = res.data.data
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
        console.log(res)
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
    chexiao () {
      this.$Modal.confirm({
        title: '确定要撤销吗？',
        onOk: () => {
          let obj = {
            opt: '3',
            taskId: this.$route.params.data.taskId,
            userId: getUserId(),
            processType: this.$route.params.data.type
          }
          opt(obj).then((res) => {
            console.log(res)
            this.$Message.info(res.data.msg)
          })
        }
      })
    },
    getData () {
      console.log(this.$route.params)
      detailProjectMaterialJoin({
        taskId: this.$route.params.data.taskId,
        userId: getUserId(),
        type: '2'
      }).then((res) => {
        console.log(res.data.data)
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
