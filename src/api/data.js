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

// 单位列表
export const getUnitList = (params) => {
  return axios.request({
    url: '/office/listOffice',
    data: params,
    method: 'post'
  })
}
// 新增+修改单位
export const addOffice = (params) => {
  return axios.request({
    url: '/office/insertOrUpdateOffice',
    data: params,
    method: 'post'
  })
}
// 删除单位
export const delOffice = (params) => {
  return axios.request({
    url: '/office/deleteOffice',
    data: params,
    method: 'post'
  })
}
// 行政区域列表
export const getRegionList = () => {
  return axios.request({
    url: '/area/listArea',
    method: 'post'
  })
}
// 新增+修改行政区域
export const insertOrUpdateOffice = (params) => {
  return axios.request({
    url: '/area/insertOrUpdateOffice',
    data: params,
    method: 'post'
  })
}
// 删除行政区域
export const deleteArea = (params) => {
  return axios.request({
    url: '/area/deleteArea',
    data: params,
    method: 'post'
  })
}
// 角色列表
export const listRole = (params) => {
  return axios.request({
    url: '/role/listRole',
    data: params,
    method: 'post'
  })
}
// 角色权限
export const ListAllMenu = (params) => {
  return axios.request({
    url: '/role/listAllMenu',
    data: params,
    method: 'post'
  })
}
// 保存角色权限
export const insertOrUpdateRole = (params) => {
  return axios.request({
    url: '/role/insertOrUpdateRole',
    data: params,
    method: 'post'
  })
}
// 角色用户列表
export const listUserRole = (params) => {
  return axios.request({
    url: '/role/listUserRole',
    data: params,
    method: 'post'
  })
}
// 删除角色
export const deleteRole = (params) => {
  return axios.request({
    url: '/role/deleteRole',
    data: params,
    method: 'post'
  })
}
// 所属地
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
