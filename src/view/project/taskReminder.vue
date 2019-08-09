<template>
  <div>
    <Card>
      <p class="pageHead">任务提醒规则</p>
      <Form :model="formItem" :label-width="120">
        <FormItem label="任务逾期提醒">
          <i-switch v-model="formItem.remindStatus">
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
        </FormItem>
        <FormItem label="任务预定时间百分比">
          <div style="display: flex">
            <Slider v-model="formItem.remindPercentage" style="width: 280px"></Slider>
            <InputNumber :max="100" :min="0" v-model="formItem.remindPercentage" style="margin-left: 15px; width: 70px"></InputNumber>
          </div>
        </FormItem>
      </Form>
      <div class="btns">
        <Button type="primary" @click="save">保存</Button>
        <Button @click="back">返回</Button>
      </div>
    </Card>
  </div>
</template>

<script>
import { remindSet, getRemindSet } from '@/api/data'
import { getUserId } from '@/libs/util'
export default {
  name: 'projectReminder',
  data () {
    return {
      formItem: {
        remindStatus: false,
        remindPercentage: 0
      }
    }
  },
  methods: {
    save () {
      remindSet({
        remindStatus: this.formItem.remindStatus ? '0' : '1',
        remindPercentage: String(this.formItem.remindPercentage),
        type: '2',
        userId: getUserId()
      }).then((res) => {
        this.$Message.info(res.data.msg)
      })
    },
    getRemindSet () {
      getRemindSet({
        type: '2',
        userId: getUserId()
      }).then((res) => {
        console.log(res)
        if (res.data.status === '200') {
          console.log(res.data.remindPercentage)
          this.formItem.remindPercentage = Number(res.data.data.remindPercentage)
          this.formItem.remindStatus = res.data.data.remindStatus === '0'
        }
      })
    },
    back () {
      this.$router.push({
        name: 'taskManagementList'
      })
    }
  },
  created () {
    this.getRemindSet()
  }
}
</script>

<style scoped  lang="less">
  .pageHead{
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .btns{
    text-align: center;
    .ivu-btn-primary{
      margin-right: 10px;
    }
    .ivu-btn{
      width: 80px;
    }
  }
</style>
