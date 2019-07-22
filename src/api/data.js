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
export const addTask = (params) => {
  return axios.request({
    url: '/task/addTask',
    data: params,
    method: 'post'
  })
}
export const listProjectUser = (params) => {
  return axios.request({
    url: '/project/listProjectUser',
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
export const listMyNotAcceptedTask = (params) => {
  return axios.request({
    url: '/task/listMyNotAcceptedTask',
    data: params,
    method: 'post'
  })
}

export const selectTaskDetail = (params) => {
  return axios.request({
    url: '/task/selectTaskDetail',
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

export const deleteMaterial = (params) => {
  return axios.request({
    url: '/materia/deleteMaterial',
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
export const listMapTask = (params) => {
  return axios.request({
    url: '/task/listMapTask',
    data: params,
    method: 'post'
  })
}
