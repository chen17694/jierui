<template>
  <div>
    <Card>
      <Tabs>
        <TabPane label="基本信息" name="name1">
          <ul style="line-height: 40px">
            <li><span style="font-weight: bold">姓名</span>：{{info.name}}</li>
            <li><span style="font-weight: bold">所属公司：</span>{{info.office}}</li>
            <li><span style="font-weight: bold">角色：</span>{{info.role}}</li>
            <li><span style="font-weight: bold">联系方式：</span>{{info.phone}}</li>
          </ul>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import { getOffice } from '@/libs/util'
export default {
  name: 'userInfo',
  data () {
    return {
      info: getOffice()
    }
  },
  mounted () {
    console.log(getOffice())
  }
}
</script>

<style scoped>

</style>
