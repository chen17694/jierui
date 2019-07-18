import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return axios.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}

export const getUserList = (params) => {
  return axios.request({
    url: '/user/listUser',
    data: params,
    method: 'post'
  })
}
export const insertOrUpdateUser = (params) => {
  return axios.request({
    url: '/user/insertOrUpdateUser',
    data: params,
    method: 'post'
  })
}

export const getUnitList = (params) => {
  return axios.request({
    url: '/office/listOffice',
    data: params,
    method: 'post'
  })
}
export const addOffice = (params) => {
  return axios.request({
    url: '/office/insertOrUpdateOffice',
    data: params,
    method: 'post'
  })
}
export const delOffice = (params) => {
  return axios.request({
    url: '/office/deleteOffice',
    data: params,
    method: 'post'
  })
}
export const getRegionList = () => {
  return axios.request({
    url: '/area/listArea',
    method: 'post'
  })
}
export const insertOrUpdateOffice = (params) => {
  return axios.request({
    url: '/area/insertOrUpdateOffice',
    data: params,
    method: 'post'
  })
}
export const deleteArea = (params) => {
  return axios.request({
    url: '/area/deleteArea',
    data: params,
    method: 'post'
  })
}
export const listRole = (params) => {
  return axios.request({
    url: '/role/listRole',
    data: params,
    method: 'post'
  })
}
export const ListAllMenu = (params) => {
  return axios.request({
    url: '/role/listAllMenu',
    data: params,
    method: 'post'
  })
}
export const insertOrUpdateRole = (params) => {
  return axios.request({
    url: '/role/insertOrUpdateRole',
    data: params,
    method: 'post'
  })
}
export const listUserRole = (params) => {
  return axios.request({
    url: '/role/listUserRole',
    data: params,
    method: 'post'
  })
}
export const deleteRole = (params) => {
  return axios.request({
    url: '/role/deleteRole',
    data: params,
    method: 'post'
  })
}
export const listAreaByType = (params) => {
  return axios.request({
    url: '/area/listAreaByType',
    data: params,
    method: 'post'
  })
}

export const listUserRoleDistribution = (params) => {
  return axios.request({
    url: '/role/listUserRoleDistribution',
    data: params,
    method: 'post'
  })
}
export const insertUserRole = (params) => {
  return axios.request({
    url: '/role/insertUserRole',
    data: params,
    method: 'post'
  })
}
export const deleteUserRole = (params) => {
  return axios.request({
    url: '/role/deleteUserRole',
    data: params,
    method: 'post'
  })
}
export const listRoleByOfficeId = (params) => {
  return axios.request({
    url: '/role/listRoleByOfficeId',
    data: params,
    method: 'post'
  })
}
export const dailyList = (params) => {
  return axios.request({
    url: '/dailyReport/list',
    data: params,
    method: 'post'
  })
}
export const listProject = (params) => {
  return axios.request({
    url: '/project/listProject',
    data: params,
    method: 'post'
  })
}
export const listMapProject = (params) => {
  return axios.request({
    url: '/project/listMapProject',
    data: params,
    method: 'post'
  })
}
export const selectProjectDetail = (params) => {
  return axios.request({
    url: '/project/selectProjectDetail',
    data: params,
    method: 'post'
  })
}

export const listTask = (params) => {
  return axios.request({
    url: '/task/listTask',
    data: params,
    method: 'post'
  })
}
export const createDaily = (params) => {
  return axios.request({
    url: '/dailyReport/createList',
    data: params,
    method: 'post'
  })
}
export const deleteDaily = (params) => {
  return axios.request({
    url: '/dailyReport/delete',
    data: params,
    method: 'post'
  })
}
export const updateDaily = (params) => {
  return axios.request({
    url: '/dailyReport/update',
    data: params,
    method: 'post'
  })
}
export const getRemindSet = (params) => {
  return axios.request({
    url: '/project/getRemindSet',
    data: params,
    method: 'post'
  })
}
export const listHistory = (params) => {
  return axios.request({
    url: '/process/listHistory',
    data: params,
    method: 'post'
  })
}
export const listWait = (params) => {
  return axios.request({
    url: '/process/listWait',
    data: params,
    method: 'post'
  })
}
export const listOverdueProject = (params) => {
  return axios.request({
    url: '/overdue/listOverdueProject',
    data: params,
    method: 'post'
  })
}
export const projectFunction = (params) => {
  return axios.request({
    url: '/project/projectFunction',
    data: params,
    method: 'post'
  })
}
export const remindSet = (params) => {
  return axios.request({
    url: '/project/remindSet',
    data: params,
    method: 'post'
  })
}
export const listOverdueTask = (params) => {
  return axios.request({
    url: '/overdue/listOverdueTask',
    data: params,
    method: 'post'
  })
}
export const taskFunction = (params) => {
  return axios.request({
    url: '/task/taskFunction',
    data: params,
    method: 'post'
  })
}
export const listProjectSimple = (params) => {
  return axios.request({
    url: '/project/listProjectSimple',
    data: params,
    method: 'post'
  })
}
export const listOverdueTaskCrossing = (params) => {
  return axios.request({
    url: '/overdue/listOverdueTaskCrossing',
    data: params,
    method: 'post'
  })
}
export const taskCrossingFunction = (params) => {
  return axios.request({
    url: '/taskCrossingRelation/taskCrossingFunction',
    data: params,
    method: 'post'
  })
}

export const listOverdueMaterial = (params) => {
  return axios.request({
    url: '/overdue/listOverdueMaterial',
    data: params,
    method: 'post'
  })
}

export const deleteUser = (params) => {
  return axios.request({
    url: '/user/deleteUser',
    data: params,
    method: 'post'
  })
}
export const listMyMaterial = (params) => {
  return axios.request({
    url: '/materia/listMyMaterial',
    data: params,
    method: 'post'
  })
}
export const areaData = (params) => {
  return axios.request({
    url: '/area/listAreaRename',
    data: params,
    method: 'post'
  })
}
export const addProject = (params) => {
  return axios.request({
    url: '/project/addProject',
    data: params,
    method: 'post'
  })
}
// 物资管理
export const materialList = (params) => { return axios.request({ url: '/materia/listMaterial', data: params, method: 'post' }) } // 物资列表
export const materialCategory = (params) => { return axios.request({ url: '/materia/listMaterialCategory', data: params, method: 'post' }) } // 物资类别
export const listOffice = (params) => { return axios.request({ url: '/office/listOffice', data: params, method: 'post' }) } // 单位列表
export const addMaterial = (params) => { return axios.request({ url: '/materia/addMaterial', data: params, method: 'post' }) } // 创建物料
export const addMaterialCategory = (params) => { return axios.request({ url: '/materia/addMaterialCategory', data: params, method: 'post' }) } // 添加物资类别
export const materialDetail = (params) => { return axios.request({ url: '/materia/MaterialDetail', data: params, method: 'post' }) } // 物资详情
export const deleteMaterial = (params) => { return axios.request({ url: '/materia/deleteMaterial', data: params, method: 'post' }) } // 批量删除物资
export const updateMaterial = (params) => { return axios.request({ url: '/materia/updateMaterial', data: params, method: 'post' }) } // 编辑物资
export const overdueRush = (params) => { return axios.request({ url: '/materia/overdueRush', data: params, method: 'post' }) } // 物资催办
export const listMessage = (params) => { return axios.request({ url: '/index/listMessage', data: params, method: 'post' }) } // 消息列表
export const messageDetail = (params) => { return axios.request({ url: '/index/getMessageDetail', data: params, method: 'post' }) } // 消息详情
export const createMessage = (params) => { return axios.request({ url: '/index/createMessage', data: params, method: 'post' }) } // 创建推送消息
export const delMessage = (params) => { return axios.request({ url: '/index/delMessage', data: params, method: 'post' }) } // 消息删除
export const optMessage = (params) => { return axios.request({ url: '/index/optMessage', data: params, method: 'post' }) } // 设为已读
export const projectStatusCount = (params) => { return axios.request({ url: '/statistics/projectStatusCount', data: params, method: 'post' }) } // 项目总数与各项目状态，项目评分结果占比
export const overdueProjectStatistics = (params) => { return axios.request({ url: '/statistics/overdueProjectStatistics', data: params, method: 'post' }) } // 逾期项目统计
export const projectWorkloadCount = (params) => { return axios.request({ url: '/statistics/projectWorkloadCount', data: params, method: 'post' }) } // 各项指标数量统计
export const finishProjectTaskCount = (params) => { return axios.request({ url: '/statistics/finishProjectTaskCount', data: params, method: 'post' }) } // 项目任务完成百分比
export const areaProjectCount = (params) => { return axios.request({ url: '/statistics/areaProjectCount', data: params, method: 'post' }) } // 按地区统计项目
export const areaTaskCount = (params) => { return axios.request({ url: '/statistics/areaTaskCount', data: params, method: 'post' }) } // 按地区统计任务
export const completeAndFollowTaskBean = (params) => { return axios.request({ url: '/statistics/completeAndFollowTaskBean', data: params, method: 'post' }) } // 项目完成审核的任务路口与关注路口
export const overdueTaskStatistics = (params) => { return axios.request({ url: '/statistics/overdueTaskStatistics', data: params, method: 'post' }) } // 逾期任务统计
export const taskStatusAndTypeCount = (params) => { return axios.request({ url: '/statistics/taskStatusAndTypeCount', data: params, method: 'post' }) } // 任务数量和百分比
export const taskScoringAndWorkloadBean = (params) => { return axios.request({ url: '/statistics/taskScoringAndWorkloadBean', data: params, method: 'post' }) } // 项目下各任务统计及项目满意度百分比
export const taskCrossingUpdateStatistics = (params) => { return axios.request({ url: '/statistics/taskCrossingUpdateStatistics', data: params, method: 'post' }) } // 更新版本前20路口
export const taskCrossingStatistics = (params) => { return axios.request({ url: '/statistics/taskCrossingStatistics', data: params, method: 'post' }) } // 任务路口统计数据查询(显示总数)
export const taskCrossingAreaCount = (params) => { return axios.request({ url: '/statistics/taskCrossingAreaCount', data: params, method: 'post' }) } // 按地区统计任务路口
export const taskCountStatisticsByTpye = (params) => { return axios.request({ url: '/statistics/taskCountStatisticsByTpye', data: params, method: 'post' }) } // 单路口执行的各类任务
export const userWorkingHours = (params) => { return axios.request({ url: '/statistics/userWorkingHours', data: params, method: 'post' }) } // 员工工作量统计
export const consumablesMargin = (params) => { return axios.request({ url: '/statistics/consumablesMargin', data: params, method: 'post' }) } // 消耗品余量查询
export const projectMaterialCount = (params) => { return axios.request({ url: '/statistics/projectMaterialCount', data: params, method: 'post' }) } // 各项目物资使用量
export const materialOccupy = (params) => { return axios.request({ url: '/statistics/materialOccupy', data: params, method: 'post' }) } // 物资占用一览表
export const materialCategoryLend = (params) => { return axios.request({ url: '/statistics/materialCategoryLend', data: params, method: 'post' }) } // 各类物资支出与百分比查询
export const listProjectMaterial = (params) => { return axios.request({ url: '/materia/listProjectMaterial', data: params, method: 'post' }) } // 项目物资列表
export const listCrossing = (params) => { return axios.request({ url: '/CrossingAPI/listCrossing', data: params, method: 'post' }) } // 路口列表
export const dailyFind = (params) => { return axios.request({ url: '/dailyReport/find', data: params, method: 'post' }) } // 日报详情
