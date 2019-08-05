<template>
  <div>
    <Card style="margin-bottom: 10px">
      <Steps :current="1">
        <Step title="已完成" content="这里是该步骤的描述信息"></Step>
        <Step title="进行中" content="这里是该步骤的描述信息"></Step>
        <Step title="待进行" content="这里是该步骤的描述信息"></Step>
        <Step title="待进行" content="这里是该步骤的描述信息"></Step>
      </Steps>
    </Card>
    <Card style="margin-bottom: 10px">
      <h3 style="color: #2d8cf0; margin-bottom: 20px">物资申请信息</h3>
      <ul style="list-style-type: none">
        <li style="margin-bottom: 5px">项目名称：54564564654</li>
        <li style="margin-bottom: 5px">任务名称：787f8w9e7f98</li>
        <li style="margin-bottom: 5px">申请人员：啊啊啊</li>
      </ul>
    </Card>
    <tables ref="tables" v-model="tableData" :columns="columns" :showPage="false"></tables>
  </div>
</template>

<script>
import { detailMaterialApplication } from '@/api/data'
import Tables from '_c/tables'
export default {
  name: 'dwzsq',
  components: { Tables },
  data () {
    return {
      tableData: [],
      columns: [
        { title: '物资类型', key: 'materialTypeName' },
        { title: '物资名称', key: 'materialName' },
        { title: '剩余数量', key: 'surplusNum' },
        { title: '申请数量', key: 'applyNum' },
        { title: '归还日期', key: 'returnDate' }
      ]
    }
  },
  methods: {
    getData () {
      detailMaterialApplication({
        taskId: '195085',
        userId: '27275ab6e7644f05b9921193295e2c7b',
        type: '2'
      }).then((res) => {
        console.log(res.data.data)
        this.tableData = res.data.data.materialList
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped lang="less">

</style>
