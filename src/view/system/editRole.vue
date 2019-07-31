<template>
  <div>
    <Card>
      <p class="pageHead">新增系统角色</p>
      <Form ref="formItem" :model="formItem" :label-width="150" :rules="ruleValidate" >
        <FormItem label="用户名" prop="userName">
          <Row>
            <Col span="11">
              <Input v-model="formItem.userName" placeholder="请输入用户名"/>
            </Col>
            <Col span="11">
              （1-10个字符）
            </Col>
          </Row>
        </FormItem>
      </Form>
      <p class="pageHead">系统角色权限设置</p>
      <Table border :columns="columns" :data="menuData" :show-header="false">
        <template slot-scope="{ row }" slot="items">
          <CheckboxGroup v-model="menu">
            <Checkbox v-for="item in row.child" :label="item.id" :key="item.id" style="margin-right: 30px">{{item.name}}</Checkbox>
          </CheckboxGroup>
        </template>
      </Table>
      <div class="btns">
        <Button type="primary" @click="this.save">保存</Button>
        <Button @click="back">返回</Button>
      </div>
    </Card>
  </div>
</template>

<script>
import { ListAllMenu, insertOrUpdateRole } from '@/api/data'
export default {
  data () {
    const validateUserName = (rule, value, callback) => {
      const eReg = /^.{1,10}$/
      if (value === '') {
        callback(new Error('请输入1-10个字符的用户名'))
      } else if (value.length < 1 || value.length > 10) {
        callback(new Error('请输入1-10个字符的用户名'))
      } else if (!eReg.test(value)) {
        callback(new Error('包含非法字符'))
      } else {
        callback()
      }
    }
    return {
      formItem: {
        userName: this.$route.params.role
      },
      ruleValidate: {
        userName: [
          { required: true, validator: validateUserName, trigger: 'blur' }
        ]
      },
      columns: [
        {
          key: 'name',
          width: 130
        },
        {
          slot: 'items'
        }
      ],
      menuData: [],
      menu: []
    }
  },
  methods: {
    back () {
      this.$router.push({
        name: 'roleList'
      })
    },
    save () {
      let params = {
        'name': this.formItem.userName,
        'type': '1',
        'menu': this.menu,
        'userId': 'd3c6b26c272f4b0c96ec8f7a3062230b'
      }
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          insertOrUpdateRole(params).then((res) => {
            this.$Message.info(res.data.msg)
          })
        }
      })
    }
  },
  mounted () {
    if (this.$route.params.id) {
      ListAllMenu({ type: '1', roleId: this.$route.params.id }).then(res => {
        this.menuData = res.data.data
        this.menuData.forEach((item) => {
          if (item.child.length > 0) {
            item.child.forEach((item) => {
              if (item.isCheck === '1') {
                this.menu.push(item.id)
              }
            })
          }
        })
      })
    } else {
      this.back()
    }
  }
}
</script>

<style scoped lang="less">
.pageHead{
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 20px;
}
.ivu-table-wrapper{
  line-height: 45px;
}
.btns{
  text-align: center;
  margin-top: 50px;
  .ivu-btn{
    margin: 0 10px;
  }
}
</style>
