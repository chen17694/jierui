import axios from '@/libs/api.request'
let OSS = require('ali-oss')
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
export const projectAttributeModify = (params) => {
  return axios.request({
    url: '/project/projectAttributeModify',
    data: params,
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
export const getRoute = (params) => {
  return axios.request({
    url: '/user/getRoute',
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
export const listProjectUserDistribution = (params) => {
  return axios.request({
    url: '/project/listProjectUserDistribution',
    data: params,
    method: 'post'
  })
}
export const staffJoin = (params) => {
  return axios.request({
    url: '/project/staffJoin',
    data: params,
    method: 'post'
  })
}
export const addProjectManager = (params) => {
  return axios.request({
    url: '/project/addProjectManager',
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
export const addCrossing = (params) => {
  return axios.request({
    url: '/CrossingAPI/addCrossing',
    data: params,
    method: 'post'
  })
}
export const addTaskCrossing = (params) => {
  return axios.request({
    url: '/taskCrossingRelation/addTaskCrossing',
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
export const acceptOrRefuseTask = (params) => {
  return axios.request({
    url: '/task/acceptOrRefuseTask',
    data: params,
    method: 'post'
  })
}
export const opt = (params) => {
  return axios.request({
    url: '/process/opt',
    data: params,
    method: 'post'
  })
}
export const detailTaskApproval = (params) => {
  return axios.request({
    url: '/process/detailTaskApproval',
    data: params,
    method: 'post'
  })
}
export const detailMaterialReturnService = (params) => {
  return axios.request({
    url: '/process/detailMaterialReturnService',
    data: params,
    method: 'post'
  })
}
export const detailProjectAttributeModify = (params) => {
  return axios.request({
    url: '/process/detailProjectAttributeModify',
    data: params,
    method: 'post'
  })
}
export const detailProjectStateModify = (params) => {
  return axios.request({
    url: '/process/detailProjectStateModify',
    data: params,
    method: 'post'
  })
}
export const selectTaskCrossingDetailBean = (params) => {
  return axios.request({
    url: '/taskCrossingRelation/selectTaskCrossingDetailBean',
    data: params,
    method: 'post'
  })
}
export const detailMaterialApplication = (params) => {
  return axios.request({
    url: '/process/detailMaterialApplication',
    data: params,
    method: 'post'
  })
}
export const listMapTaskCrossing = (params) => {
  return axios.request({
    url: '/taskCrossingRelation/listMapTaskCrossing',
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
export const listTaskCrossing = (params) => {
  return axios.request({
    url: '/taskCrossingRelation/listTaskCrossing',
    data: params,
    method: 'post'
  })
}
export const listCrossingAndCount = (params) => {
  return axios.request({
    url: '/CrossingAPI/listCrossingAndCount',
    data: params,
    method: 'post'
  })
}
export const listCrossing = (params) => {
  return axios.request({
    url: '/CrossingAPI/listCrossing',
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
export const detailTaskCrossingApproval = (params) => {
  return axios.request({
    url: '/process/detailTaskCrossingApproval',
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
export const materialReturn = (params) => {
  return axios.request({
    url: '/materia/materialReturn',
    data: params,
    method: 'post'
  })
}
export const listMaterialCategory = (params) => {
  return axios.request({
    url: '/materia/listMaterialCategory',
    data: params,
    method: 'post'
  })
}
export const listMaterial = (params) => {
  return axios.request({
    url: '/materia/listMaterial',
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
export const getHeadOffice = (params) => {
  return axios.request({
    url: '/office/getHeadOffice',
    data: params,
    method: 'post'
  })
}
export const materialApplication = (params) => {
  return axios.request({
    url: '/materia/materialApplication',
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
export const listCrossingByCode = (params) => {
  return axios.request({
    url: '/CrossingAPI/listCrossingByCode',
    data: params,
    method: 'post'
  })
}

export const projectMaterialJoin = (params) => {
  return axios.request({
    url: '/materia/projectMaterialJoin',
    data: params,
    method: 'post'
  })
}
export const detailProjectStaffJoin = (params) => {
  return axios.request({
    url: '/process/detailProjectStaffJoin',
    data: params,
    method: 'post'
  })
}

export const detailProjectApproval = (params) => {
  return axios.request({
    url: '/process/detailProjectApproval',
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
export const deleteProjectAnnex = (params) => {
  return axios.request({
    url: '/project/deleteProjectAnnex',
    data: params,
    method: 'post'
  })
}
export const deleteTasktAnnex = (params) => {
  return axios.request({
    url: '/task/deleteTasktAnnex',
    data: params,
    method: 'post'
  })
}
export const deleteTaskCrossingAnnex = (params) => {
  return axios.request({
    url: '/taskCrossingRelation/deleteTaskCrossingAnnex',
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

export const detailProjectMaterialJoin = (params) => {
  return axios.request({
    url: '/process/detailProjectMaterialJoin',
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
export const getUserCount = (params) => {
  return axios.request({
    url: '/user/getUserCount',
    data: params,
    method: 'post'
  })
}
export const listTaskSimple = (params) => {
  return axios.request({
    url: '/task/listTaskSimple',
    data: params,
    method: 'post'
  })
}
export const uploadChannelizationMap = (params) => {
  return axios.request({
    url: '/taskCrossingRelation/uploadChannelizationMap',
    data: params,
    method: 'post'
  })
}
export const listTaskCrossingAnnex = (params) => {
  return axios.request({
    url: '/taskCrossingRelation/listTaskCrossingAnnex',
    data: params,
    method: 'post'
  })
}
export const listTaskAnnex = (params) => {
  return axios.request({
    url: '/task/listTaskAnnex',
    data: params,
    method: 'post'
  })
}
export const taskAnnexBeanListByProjectId = (params) => {
  return axios.request({
    url: '/project/taskAnnexBeanListByProjectId',
    data: params,
    method: 'post'
  })
}
export const addProjectAnnex = (params) => {
  return axios.request({
    url: '/project/addProjectAnnex',
    data: params,
    method: 'post'
  })
}
export const listProjectAnnex = (params) => {
  return axios.request({
    url: '/project/listProjectAnnex',
    data: params,
    method: 'post'
  })
}
export const updateUserInfo = (params) => {
  return axios.request({
    url: '/user/updateUserInfo',
    data: params,
    method: 'post'
  })
}
export const selectCrossing = (params) => {
  return axios.request({
    url: '/CrossingAPI/selectCrossing',
    data: params,
    method: 'post'
  })
}
export const listBusinessCrossingAnnex = (params) => {
  return axios.request({
    url: '/CrossingAPI/listBusinessCrossingAnnex',
    data: params,
    method: 'post'
  })
}

export const addTaskAnnex = (params) => {
  return axios.request({
    url: '/task/addTaskAnnex',
    data: params,
    method: 'post'
  })
}
export const sendCodeGeneral = (params) => {
  return axios.request({
    url: '/user/sendCodeGeneral',
    data: params,
    method: 'post'
  })
}
export const sendCode = (params) => {
  return axios.request({
    url: '/user/sendCode',
    data: params,
    method: 'post'
  })
}
export const resetGeneral = (params) => {
  return axios.request({
    url: '/user/resetGeneral',
    data: params,
    method: 'post'
  })
}

export const addTaskCrossingAnnex = (params) => {
  return axios.request({
    url: '/taskCrossingRelation/addTaskCrossingAnnex',
    data: params,
    method: 'post'
  })
}
export const selectResponseDissatisfiedTaskCrossingBean = (params) => {
  return axios.request({
    url: '/taskCrossingRelation/selectResponseDissatisfiedTaskCrossingBean',
    data: params,
    method: 'post'
  })
}

export const taskMaterialDetail = (params) => {
  return axios.request({
    url: '/materia/taskMaterialDetail',
    data: params,
    method: 'post'
  })
}
export const mapCoordinateStatistics = (params) => {
  return axios.request({
    url: '/statistics/mapCoordinateStatistics',
    data: params,
    method: 'post'
  })
}
export const uploadTaskCrossingInspect = (params) => {
  return axios.request({
    url: '/taskCrossingRelation/uploadTaskCrossingInspect',
    data: params,
    method: 'post'
  })
}
export const getStsToken = (params) => { // 获取oss Token
  return axios.request({
    url: '/oss/getStsToken',
    data: params,
    method: 'post'
  })
}

export const uploadImgToAliOss = (e) => {
  return new Promise((resolve, reject) => {
    getStsToken().then(res => {
      if (res.data.status === '200') {
        upOss(e, res).then(ress => {
          resolve(ress)
        })
      }
    })
  })
}

const upOss = (e, res) => {
  let client = new OSS({
    endpoint: res.data.data.endpoint,
    accessKeyId: res.data.data.accessKeyId,
    stsToken: res.data.data.securityToken,
    accessKeySecret: res.data.data.accessKeySecret,
    bucket: res.data.data.bucketName
  })
  return new Promise((resolve, reject) => {
    client.multipartUpload(e.target.files[0].name, e.target.files[0]).then(result => {
      let src = result.res.requestUrls[0].split('?')
      let arr = [src[0], result.name]
      resolve(arr)
    })
  })
}
export const uploadImgToAliOssHead = (e) => {
  return new Promise((resolve, reject) => {
    getStsToken().then(res => {
      if (res.data.status === '200') {
        upOssHead(e, res).then(ress => {
          resolve(ress)
        })
      }
    })
  })
}
const upOssHead = (e, res) => {
  let client = new OSS({
    endpoint: res.data.data.endpoint,
    accessKeyId: res.data.data.accessKeyId,
    stsToken: res.data.data.securityToken,
    accessKeySecret: res.data.data.accessKeySecret,
    bucket: res.data.data.bucketName
  })
  return new Promise((resolve, reject) => {
    let chars = 'abcdefhijkmnprstwxyz'
    let maxPos = chars.length
    let pwd = ''
    for (let i = 0; i < 3; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    client.multipartUpload(pwd, e).then(result => {
      let src = result.res.requestUrls[0].split('?')
      let arr = [src[0], result.name]
      resolve(arr)
    })
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
export const dailyFind = (params) => { return axios.request({ url: '/dailyReport/find', data: params, method: 'post' }) } // 日报详情
export const listMapTask = (params) => { return axios.request({ url: '/task/listMapTask', data: params, method: 'post' }) }
