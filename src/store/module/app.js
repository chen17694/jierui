import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead,
  backendMenusToRouters
} from '@/libs/util'
// import { listUserMenus } from '@/api/data'
import router from '@/router'
// import routers from '@/router/routers'
import i1 from '@/assets/images/i1.png'
import i2 from '@/assets/images/i2.png'
import i3 from '@/assets/images/i3.png'
import i4 from '@/assets/images/i4.png'
import i5 from '@/assets/images/i5.png'
import i6 from '@/assets/images/i6.png'
import i7 from '@/assets/images/i7.png'
import config from '@/config'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false,
    routers: [],
    hasGetRouter: false
  },
  getters: {
    // menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access),
    // menuList: (state) => (state, getters, rootState) => getMenuByRouter(state.routers, rootState.user.access),
    menuList: (state, getters, rootState) => getMenuByRouter(state.routers, rootState.user.access),
    errorCount: state => state.errorList.length
  },
  mutations: {
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError (state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status
    },
    setRouters (state, routers) {
      state.routers = routers
    },
    setHasGetRouter (state, status) {
      state.hasGetRouter = status
    }
  },
  actions: {
    addErrorLog ({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      // const { user: { token, userId, userName } } = rootState
      // let data = {
      //   ...info,
      //   time: Date.parse(new Date()),
      //   token,
      //   userId,
      //   userName
      // }
      // saveErrorLogger(info).then(() => {
      //   commit('addError', data)
      // })
    },
    getRouters ({ commit }) {
      return new Promise((resolve, reject) => {
        let routers = backendMenusToRouters([
          {
            path: '/my',
            name: 'my',
            meta: {
              icon: i1,
              title: '我的'
            },
            component: 'components/main',
            children: [
              {
                path: 'myProject',
                name: 'myProject',
                meta: {
                  title: '我的项目'
                },
                component: 'view/my/myProject.vue'
              },
              {
                path: 'userInfo',
                name: 'userInfo',
                meta: {
                  title: '我的信息',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/userInfo.vue'
              },
              {
                path: 'projectDetail',
                name: 'projectDetail',
                meta: {
                  title: '项目详情',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/projectDetail.vue'
              },
              {
                path: 'taskDetail',
                name: 'taskDetail',
                meta: {
                  title: '任务详情',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/taskDetail.vue'
              },
              {
                path: 'xjDetail',
                name: 'xjDetail',
                meta: {
                  title: '任务路口详情',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/xjDetail.vue'
              },
              {
                path: 'yhDetail',
                name: 'yhDetail',
                meta: {
                  title: '任务路口详情',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/yhDetail.vue'
              },
              {
                path: 'xcDetail',
                name: 'xcDetail',
                meta: {
                  title: '任务路口详情',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/xcDetail.vue'
              },
              {
                path: 'roadHistory',
                name: 'roadHistory',
                meta: {
                  title: '路口历史版本',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/roadHistory.vue'
              },
              {
                path: 'taskRoadHistory',
                name: 'taskRoadHistory',
                meta: {
                  title: '路口历史版本',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/taskRoadHistory.vue'
              },
              {
                path: 'map',
                name: 'map',
                meta: {
                  title: '地图定位',
                  hideInMenu: true
                },
                component: 'view/my/map.vue'
              },
              {
                path: 'map2',
                name: 'map2',
                meta: {
                  title: '地图定位',
                  hideInMenu: true
                },
                component: 'view/my/map2.vue'
              },
              {
                path: 'xmsxxg',
                name: 'xmsxxg',
                meta: {
                  title: '项目属性修改',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/xmsxxg.vue'
              },
              {
                path: 'myTask',
                name: 'myTask',
                meta: {
                  title: '我的任务',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/myTask.vue'
              },
              {
                path: 'myTaskRoad',
                name: 'myTaskRoad',
                meta: {
                  title: '我的任务路口',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/myTaskRoad.vue'
              },
              {
                path: 'myMaterial',
                name: 'myMaterial',
                meta: {
                  title: '我的物资'
                },
                component: 'view/my/myMaterial.vue'
              },
              {
                path: 'myMaterialDetail',
                name: 'myMaterialDetail',
                meta: {
                  title: '物资详情',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/myMaterialDetail.vue'
              },
              {
                path: 'applyMaterial',
                name: 'applyMaterial',
                meta: {
                  title: '物资申请',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/applyMaterial.vue'
              },
              {
                path: 'myDaily',
                name: 'myDaily',
                meta: {
                  title: '我的日报'
                },
                component: 'view/my/myDaily.vue'
              },
              {
                path: 'myDailyList',
                name: 'myDailyList',
                meta: {
                  title: '我的日报',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/my/myDailyList.vue'
              },
              {
                path: 'myProcessed',
                name: 'myProcessed',
                meta: {
                  title: '我的审核审批'
                },
                component: 'components/parent-view',
                children: [
                  {
                    path: 'myApproval',
                    name: 'myApproval',
                    meta: {
                      title: '我的审核审批',
                      hideInBread: true
                    },
                    component: 'view/my/myProcessed.vue'
                  },
                  {
                    path: 'dxmsq',
                    name: 'dxmsq',
                    meta: {
                      title: '项目审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/dxmsq.vue'
                  },
                  {
                    path: 'dwzsq',
                    name: 'dwzsq',
                    meta: {
                      title: '物资申请审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/dwzsq.vue'
                  },
                  {
                    path: 'dwzghsq',
                    name: 'dwzghsq',
                    meta: {
                      title: '物资归还审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/dwzghsq.vue'
                  },
                  {
                    path: 'dxmsxxgsq',
                    name: 'dxmsxxgsq',
                    meta: {
                      title: '项目属性修改审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/dxmsxxgsq.vue'
                  },
                  {
                    path: 'dxmztxgsq',
                    name: 'dxmztxgsq',
                    meta: {
                      title: '项目状态修改审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/dxmztxgsq.vue'
                  },
                  {
                    path: 'drwsq',
                    name: 'drwsq',
                    meta: {
                      title: '任务审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/drwsq.vue'
                  },
                  {
                    path: 'drwlksq',
                    name: 'drwlksq',
                    meta: {
                      title: '任务路口审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/drwlksq.vue'
                  },
                  {
                    path: 'dwzjrxm',
                    name: 'dwzjrxm',
                    meta: {
                      title: '物资加入项目申请审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/dwzjrxm.vue'
                  },
                  {
                    path: 'dryjrxmsq',
                    name: 'dryjrxmsq',
                    meta: {
                      title: '人员加入项目申请审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/dryjrxmsq.vue'
                  },
                  {
                    path: 'xmsq',
                    name: 'xmsq',
                    meta: {
                      title: '我的项目审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/xmsq.vue'
                  },
                  {
                    path: 'wzsq',
                    name: 'wzsq',
                    meta: {
                      title: '我的物资审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/wzsq.vue'
                  },
                  {
                    path: 'wzghsq',
                    name: 'wzghsq',
                    meta: {
                      title: '我的物资归还审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/wzghsq.vue'
                  },
                  {
                    path: 'xmsxxgsq',
                    name: 'xmsxxgsq',
                    meta: {
                      title: '我的项目属性修改审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/xmsxxgsq.vue'
                  },
                  {
                    path: 'xmztxgsq',
                    name: 'xmztxgsq',
                    meta: {
                      title: '我的项目状态修改审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/xmztxgsq.vue'
                  },
                  {
                    path: 'rwsq',
                    name: 'rwsq',
                    meta: {
                      title: '我的任务审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/rwsq.vue'
                  },
                  {
                    path: 'rwlksq',
                    name: 'rwlksq',
                    meta: {
                      title: '我的任务路口审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/rwlksq.vue'
                  },
                  {
                    path: 'wzjrxm',
                    name: 'wzjrxm',
                    meta: {
                      title: '我的物资加入项目申请审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/wzjrxm.vue'
                  },
                  {
                    path: 'ryjrxmsq',
                    name: 'ryjrxmsq',
                    meta: {
                      title: '我的人员加入项目申请审批',
                      hideInMenu: true,
                      needInBread: true
                    },
                    component: 'view/my/ryjrxmsq.vue'
                  }
                ]
              },
              {
                path: 'myOverdue',
                name: 'myOverdue',
                meta: {
                  title: '逾期信息'
                },
                component: 'components/parent-view',
                children: [
                  {
                    path: 'projectOverdue',
                    name: 'projectOverdue',
                    meta: {
                      title: '项目逾期'
                    },
                    component: 'view/my/projectOverdue.vue'
                  },
                  {
                    path: 'taskOverdue',
                    name: 'taskOverdue',
                    meta: {
                      title: '任务逾期'
                    },
                    component: 'view/my/taskOverdue.vue'
                  },
                  {
                    path: 'roadOverdue',
                    name: 'roadOverdue',
                    meta: {
                      title: '任务路口逾期'
                    },
                    component: 'view/my/roadOverdue.vue'
                  },
                  {
                    path: 'returnOverdue',
                    name: 'returnOverdue',
                    meta: {
                      title: '物资归还逾期'
                    },
                    component: 'view/my/returnOverdue.vue'
                  }
                ]
              }
            ]
          },
          {
            path: '/project',
            name: 'project',
            meta: {
              icon: i2,
              title: '项目管理'
            },
            component: 'components/main',
            children: [
              {
                path: 'projectManagementList',
                name: 'projectManagementList',
                meta: {
                  title: '项目管理',
                  hideInBread: true
                },
                component: 'view/project/projectManagement.vue'
              },
              {
                path: 'addProject',
                name: 'addProject',
                meta: {
                  title: '新建项目',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/project/addProject.vue'
              },
              {
                path: 'addProjectForm',
                name: 'addProjectForm',
                meta: {
                  title: '新建项目',
                  hideInMenu: true,
                  needInBread: true,
                  notCache: true
                },
                component: 'view/project/addProjectForm.vue'
              },
              {
                path: 'projectReminder',
                name: 'projectReminder',
                meta: {
                  title: '项目提醒',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/project/projectReminder.vue'
              },
              {
                path: 'taskManagementList',
                name: 'taskManagementList',
                meta: {
                  title: '任务管理',
                  hideInBread: true
                },
                component: 'view/project/taskManagement.vue'
              },
              {
                path: 'addTask',
                name: 'addTask',
                meta: {
                  title: '新建任务',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/project/addTask.vue'
              },
              {
                path: 'addTaskForm',
                name: 'addTaskForm',
                meta: {
                  title: '新建任务',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/project/addTaskForm.vue'
              },
              {
                path: 'editTaskForm',
                name: 'editTaskForm',
                meta: {
                  title: '修改任务属性',
                  hideInMenu: true,
                  needInBread: true,
                  notCache: true
                },
                component: 'view/project/editTaskForm.vue'
              },
              {
                path: 'taskReminder',
                name: 'taskReminder',
                meta: {
                  title: '任务提醒',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/project/taskReminder.vue'
              },
              {
                path: 'taskRoadManagementList',
                name: 'taskRoadManagementList',
                meta: {
                  title: '任务路口管理',
                  hideInBread: true
                },
                component: 'view/project/taskRoadManagement.vue'
              },
              {
                path: 'addTaskRoad',
                name: 'addTaskRoad',
                meta: {
                  title: '新建任务路口',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/project/addTaskRoad.vue'
              },
              {
                path: 'taskRoadReminder',
                name: 'taskRoadReminder',
                meta: {
                  title: '任务路口提醒',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/project/taskRoadReminder.vue'
              }
            ]
          },
          {
            path: '/road',
            name: 'road',
            meta: {
              icon: i3,
              title: '路口管理'
            },
            component: 'components/main',
            children: [
              {
                path: 'roadList',
                name: 'roadList',
                meta: {
                  icon: i3,
                  title: '路口列表'
                },
                component: 'view/road/roadList.vue'
              },
              {
                path: 'addRoad',
                name: 'addRoad',
                meta: {
                  title: '新建路口',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/road/addRoad.vue'
              }
            ]
          },
          {
            path: '/statistics',
            name: 'statistics',
            meta: {
              icon: i6,
              title: '统计分析'
            },
            component: 'components/main',
            children: [
              {
                path: 'projectStatistics',
                name: 'projectStatistics',
                meta: {
                  title: '项目统计'
                },
                component: 'view/statistics/projectStatistics.vue'
              },
              {
                path: 'tastStatistics',
                name: 'tastStatistics',
                meta: {
                  title: '任务统计'
                },
                component: 'view/statistics/taskStatistics.vue'
              },
              {
                path: 'taskIntersectionStatistics',
                name: 'taskIntersectionStatistics',
                meta: {
                  title: '任务路口统计'
                },
                component: 'view/statistics/taskIntersectionStatistics.vue'
              },
              {
                path: 'IntersectionStatistics',
                name: 'IntersectionStatistics',
                meta: {
                  title: '路口统计'
                },
                component: 'view/statistics/IntersectionStatistics.vue'
              },
              {
                path: 'MaterialStatistics',
                name: 'MaterialStatistics',
                meta: {
                  title: '物资统计'
                },
                component: 'view/statistics/MaterialStatistics.vue'
              },
              {
                path: 'EmployeeWorkloadStatistics',
                name: 'EmployeeWorkloadStatistics',
                meta: {
                  title: '员工工作量统计'
                },
                component: 'view/statistics/EmployeeWorkloadStatistics.vue'
              }
            ]
          },
          {
            path: '/MaterialManager',
            name: 'MaterialManager',
            meta: {
              icon: i4,
              title: '物资管理',
              hideInMenu: false
            },
            component: 'components/main',
            children: [
              {
                path: 'MaterialList',
                name: 'MaterialList',
                meta: {
                  title: '物资列表',
                  icon: i4,
                  hideInMenu: false
                },
                component: 'view/material/Material.vue'
              },
              {
                path: 'MaterialAdd',
                name: 'MaterialAdd',
                meta: {
                  title: '创建物资',
                  hideInMenu: true
                },
                component: 'view/material/MaterialAdd.vue'
              },
              {
                path: 'MaterialEdit',
                name: 'MaterialEdit',
                meta: {
                  title: '编辑物资',
                  hideInMenu: true
                },
                component: 'view/material/MaterialEdit.vue'
              },
              {
                path: 'MaterialDetail',
                name: 'MaterialDetail',
                meta: {
                  title: '物资详情',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/material/MaterialDetail.vue'
              }
            ]
          },
          {
            path: '/DailyReview',
            name: 'DailyReview',
            meta: {
              icon: i5,
              title: '日报审阅'
            },
            component: 'components/main',
            children: [
              {
                path: 'dailyList',
                name: 'dailyList',
                meta: {
                  icon: i5,
                  title: '日报列表',
                  hideInMenu: false
                },
                component: 'view/daily/dailyList.vue'
              },
              {
                path: 'dailyDetail',
                name: 'dailyDetail',
                meta: {
                  title: '日报详情',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/daily/dailyDetail.vue'
              }
            ]
          },
          {
            path: '/info',
            name: 'info',
            meta: {
              title: '消息',
              hideInMenu: true
            },
            component: 'components/main',
            children: [
              {
                path: 'infoList',
                name: 'infoList',
                meta: {
                  title: '消息列表'
                },
                component: 'view/info/infoList.vue'
              },
              {
                path: 'infoDetail',
                name: 'infoDetail',
                meta: {
                  title: '消息详情',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/info/infoDetail.vue'
              },
              {
                path: 'infoPush',
                name: 'infoPush',
                meta: {
                  title: '消息推送'
                },
                component: 'view/info/infoPush.vue'
              }
            ]
          },
          {
            path: '/system',
            name: 'system',
            meta: {
              icon: i7,
              title: '系统管理'
            },
            component: 'components/main',
            children: [
              {
                path: 'user',
                name: 'user',
                meta: {
                  title: '用户管理'
                },
                component: 'view/system/user.vue'
              },
              {
                path: 'addUser',
                name: 'addUser',
                meta: {
                  title: '新增用户',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/system/addUser.vue'
              },
              {
                path: 'editUser',
                name: 'editUser',
                meta: {
                  title: '编辑用户',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/system/editUser.vue'
              },
              {
                path: 'role',
                name: 'role',
                meta: {
                  title: '角色管理'
                },
                component: 'view/system/role.vue'
              },
              {
                path: 'addRole',
                name: 'addRole',
                meta: {
                  title: '新增角色',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/system/addRole.vue'
              },
              {
                path: 'addProjectRole',
                name: 'addProjectRole',
                meta: {
                  title: '新增项目角色',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/system/addProjectRole.vue'
              },
              {
                path: 'editRole',
                name: 'editRole',
                meta: {
                  title: '编辑角色',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/system/editRole.vue'
              },
              {
                path: 'editProjectRole',
                name: 'editProjectRole',
                meta: {
                  title: '编辑项目角色',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/system/editProjectRole.vue'
              },
              {
                path: 'roleUserList',
                name: 'roleUserList',
                meta: {
                  title: '角色用户管理',
                  hideInMenu: true,
                  needInBread: true
                },
                component: 'view/system/roleUserList.vue'
              },
              {
                path: 'region',
                name: 'region',
                meta: {
                  title: '行政区域管理'
                },
                component: 'view/system/region.vue'
              },
              {
                path: 'unit',
                name: 'unit',
                meta: {
                  title: '单位管理'
                },
                component: 'view/system/unit.vue'
              }
            ]
          }
        ])
        commit('setRouters', routers)
        commit('setHasGetRouter', true)
        resolve(routers)
      })
    }
  }
}
