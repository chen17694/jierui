import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
import orgData from './data/org-data'
import { treeData } from './data/tree-select'
const Random = Mock.Random

export const getTableData = req => {
  let tableData = []
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      name: '@name',
      email: '@email',
      createTime: '@date'
    }))
  })
  return tableData
}

export const getDragList = req => {
  let dragList = []
  doCustomTimes(5, () => {
    dragList.push(Mock.mock({
      name: Random.csentence(10, 13),
      id: Random.increment(10)
    }))
  })
  return dragList
}

export const uploadImage = req => {
  return Promise.resolve()
}

export const getOrgData = req => {
  return orgData
}

export const getTreeSelectData = req => {
  return treeData
}
export const getRegionTableData = req => {
  let data = []
  doCustomTimes(1, () => {
    data.push(Mock.mock({
      region: '中国',
      type: '国家',
      children: [
        {
          region: '辽宁',
          type: '省份',
          parent: '中国',
          children: [
            {
              region: '沈阳',
              type: '市',
              parent: '辽宁',
              children: [
                {
                  region: '皇姑区',
                  type: '区',
                  parent: '沈阳'
                },
                {
                  region: '沈河区',
                  type: '区',
                  parent: '沈阳'
                }
              ]
            },
            {
              region: '大连',
              type: '市',
              parent: '辽宁'
            }
          ]
        },
        {
          region: '吉林',
          type: '省份',
          parent: '中国',
          children: [
            {
              region: '长春',
              type: '市',
              parent: '吉林'
            },
            {
              region: '吉林',
              type: '市',
              parent: '吉林'
            }
          ]
        },
        {
          region: '黑龙江',
          type: '省份',
          parent: '中国'
        }
      ]
    }))
  })
  return data
}
export const getUserList = req => {
  let data = []
  doCustomTimes(20, () => {
    data.push(Mock.mock({
      nickName: Random.first(),
      name: Random.cname(),
      email: '@email',
      phoneNumber: /^1[385][1-9]\d{8}/,
      unit: '沈阳稻田',
      role: '员工',
      region: '沈阳',
      id: String(Random.integer(0, 10000)),
      app: Random.boolean(),
      partyA: String(Random.integer(0, 1))
    }))
  })
  return data
}

export const getRegion = req => {
  let data = []
  doCustomTimes(5, () => {
    data.push(Mock.mock({
      value: '@city(false)',
      id: Random.zip()
    }))
  })
  return data
}

export const getUnit = req => {
  let data = []
  doCustomTimes(5, () => {
    data.push(Mock.mock({
      value: Random.cname(),
      id: Random.zip()
    }))
  })
  return data
}
