import Main from '@/components/main'
import parentView from '@/components/parent-view'
import addTask from '@/view/project/addTask.vue'
import home from '@/assets/images/home.png'
import i1 from '@/assets/images/i1.png'
import i2 from '@/assets/images/i2.png'
import i3 from '@/assets/images/i3.png'
import i4 from '@/assets/images/i4.png'
import i5 from '@/assets/images/i5.png'
import i6 from '@/assets/images/i6.png'
import i7 from '@/assets/images/i7.png'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: home
        },
        component: () => import('@/view/my/myProject.vue')
      }
    ]
  },
  {
    path: '/my',
    name: 'my',
    meta: {
      icon: i1,
      title: '我的'
    },
    component: Main,
    children: [
      {
        path: 'myProject',
        name: 'myProject',
        meta: {
          title: '我的项目'
        },
        component: () => import('@/view/my/myProject.vue')
      },
      {
        path: 'userInfo',
        name: 'userInfo',
        meta: {
          title: '我的信息',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/my/userInfo.vue')
      },
      {
        path: 'projectDetail',
        name: 'projectDetail',
        meta: {
          title: '项目详情',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/my/projectDetail.vue')
      },
      {
        path: 'taskDetail',
        name: 'taskDetail',
        meta: {
          title: '任务详情',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/my/taskDetail.vue')
      },
      {
        path: 'xjDetail',
        name: 'xjDetail',
        meta: {
          title: '任务路口详情',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/my/xjDetail.vue')
      },
      {
        path: 'yhDetail',
        name: 'yhDetail',
        meta: {
          title: '任务路口详情',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/my/yhDetail.vue')
      },
      {
        path: 'xcDetail',
        name: 'xcDetail',
        meta: {
          title: '任务路口详情',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/my/xcDetail.vue')
      },
      {
        path: 'roadHistory',
        name: 'roadHistory',
        meta: {
          title: '路口历史版本',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/my/roadHistory.vue')
      },
      {
        path: 'map',
        name: 'map',
        meta: {
          title: '地图定位',
          hideInMenu: true
        },
        component: () => import('@/view/my/map.vue')
      },
      {
        path: 'map2',
        name: 'map2',
        meta: {
          title: '地图定位',
          hideInMenu: true
        },
        component: () => import('@/view/my/map2.vue')
      },
      {
        path: 'xmsxxg',
        name: 'xmsxxg',
        meta: {
          title: '项目属性修改',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/my/xmsxxg.vue')
      },
      {
        path: 'myTask',
        name: 'myTask',
        meta: {
          title: '我的任务',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/my/myTask.vue')
      },
      {
        path: 'myTaskRoad',
        name: 'myTaskRoad',
        meta: {
          title: '我的任务路口',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/my/myTaskRoad.vue')
      },
      {
        path: 'myMaterial',
        name: 'myMaterial',
        meta: {
          title: '我的物资'
        },
        component: () => import('@/view/my/myMaterial.vue')
      },
      {
        path: 'myMaterialDetail',
        name: 'myMaterialDetail',
        meta: {
          title: '物资详情',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/my/myMaterialDetail.vue')
      },
      {
        path: 'applyMaterial',
        name: 'applyMaterial',
        meta: {
          title: '物资申请',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/my/applyMaterial.vue')
      },
      {
        path: 'myDaily',
        name: 'myDaily',
        meta: {
          title: '我的日报'
        },
        component: () => import('@/view/my/myDaily.vue')
      },
      {
        path: 'myDailyList',
        name: 'myDailyList',
        meta: {
          title: '我的日报',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/my/myDailyList.vue')
      },
      {
        path: 'myProcessed',
        name: 'myProcessed',
        meta: {
          title: '我的审核审批'
        },
        component: parentView,
        children: [
          {
            path: 'myApproval',
            name: 'myApproval',
            meta: {
              title: '我的审核审批',
              hideInBread: true
            },
            component: () => import('@/view/my/myProcessed.vue')
          },
          {
            path: 'dxmsq',
            name: 'dxmsq',
            meta: {
              title: '项目审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/dxmsq.vue')
          },
          {
            path: 'dwzsq',
            name: 'dwzsq',
            meta: {
              title: '物资申请审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/dwzsq.vue')
          },
          {
            path: 'dwzghsq',
            name: 'dwzghsq',
            meta: {
              title: '物资归还审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/dwzghsq.vue')
          },
          {
            path: 'dxmsxxgsq',
            name: 'dxmsxxgsq',
            meta: {
              title: '项目属性修改审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/dxmsxxgsq.vue')
          },
          {
            path: 'dxmztxgsq',
            name: 'dxmztxgsq',
            meta: {
              title: '项目状态修改审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/dxmztxgsq.vue')
          },
          {
            path: 'drwsq',
            name: 'drwsq',
            meta: {
              title: '任务审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/drwsq.vue')
          },
          {
            path: 'drwlksq',
            name: 'drwlksq',
            meta: {
              title: '任务路口审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/drwlksq.vue')
          },
          {
            path: 'dwzjrxm',
            name: 'dwzjrxm',
            meta: {
              title: '物资加入项目申请审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/dwzjrxm.vue')
          },
          {
            path: 'dryjrxmsq',
            name: 'dryjrxmsq',
            meta: {
              title: '人员加入项目申请审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/dryjrxmsq.vue')
          },
          // -------------------------
          {
            path: 'xmsq',
            name: 'xmsq',
            meta: {
              title: '我的项目审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/xmsq.vue')
          },
          {
            path: 'wzsq',
            name: 'wzsq',
            meta: {
              title: '我的物资审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/wzsq.vue')
          },
          {
            path: 'wzghsq',
            name: 'wzghsq',
            meta: {
              title: '我的物资归还审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/wzghsq.vue')
          },
          {
            path: 'xmsxxgsq',
            name: 'xmsxxgsq',
            meta: {
              title: '我的项目属性修改审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/xmsxxgsq.vue')
          },
          {
            path: 'xmztxgsq',
            name: 'xmztxgsq',
            meta: {
              title: '我的项目状态修改审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/xmztxgsq.vue')
          },
          {
            path: 'rwsq',
            name: 'rwsq',
            meta: {
              title: '我的任务审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/rwsq.vue')
          },
          {
            path: 'rwlksq',
            name: 'rwlksq',
            meta: {
              title: '我的任务路口审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/rwlksq.vue')
          },
          {
            path: 'wzjrxm',
            name: 'wzjrxm',
            meta: {
              title: '我的物资加入项目申请审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/wzjrxm.vue')
          },
          {
            path: 'ryjrxmsq',
            name: 'ryjrxmsq',
            meta: {
              title: '我的人员加入项目申请审批',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/my/ryjrxmsq.vue')
          }
        ]
      },
      {
        path: 'myOverdue',
        name: 'myOverdue',
        meta: {
          title: '逾期信息'
        },
        component: parentView,
        children: [
          {
            path: 'projectOverdue',
            name: 'projectOverdue',
            meta: {
              title: '项目逾期'
            },
            component: () => import('@/view/my/projectOverdue.vue')
          },
          {
            path: 'taskOverdue',
            name: 'taskOverdue',
            meta: {
              title: '任务逾期'
            },
            component: () => import('@/view/my/taskOverdue.vue')
          },
          {
            path: 'roadOverdue',
            name: 'roadOverdue',
            meta: {
              title: '任务路口逾期'
            },
            component: () => import('@/view/my/roadOverdue.vue')
          },
          {
            path: 'returnOverdue',
            name: 'returnOverdue',
            meta: {
              title: '物资归还逾期'
            },
            component: () => import('@/view/my/returnOverdue.vue')
          }
        ]
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
    component: Main,
    children: [
      {
        path: 'roadList',
        name: 'roadList',
        meta: {
          icon: i3,
          title: '路口列表'
        },
        component: () => import('@/view/road/roadList.vue')
      },
      {
        path: 'addRoad',
        name: 'addRoad',
        meta: {
          title: '新建路口',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/road/addRoad.vue')
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
    component: Main,
    children: [
      {
        path: 'projectManagementList',
        name: 'projectManagementList',
        meta: {
          title: '项目管理',
          hideInBread: true
        },
        component: () => import('@/view/project/projectManagement.vue')
      },
      {
        path: 'addProject',
        name: 'addProject',
        meta: {
          title: '新建项目',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/project/addProject.vue')
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
        component: () => import('@/view/project/addProjectForm.vue')
      },
      {
        path: 'projectReminder',
        name: 'projectReminder',
        meta: {
          title: '项目提醒',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/project/projectReminder.vue')
      },
      {
        path: 'taskManagementList',
        name: 'taskManagementList',
        meta: {
          title: '任务管理',
          hideInBread: true
        },
        component: () => import('@/view/project/taskManagement.vue')
      },
      {
        path: 'addTask',
        name: 'addTask',
        meta: {
          title: '新建任务',
          hideInMenu: true,
          needInBread: true
        },
        component: addTask
      },
      {
        path: 'addTaskForm',
        name: 'addTaskForm',
        meta: {
          title: '新建任务',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/project/addTaskForm.vue')
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
        component: () => import('@/view/project/editTaskForm.vue')
      },
      {
        path: 'taskReminder',
        name: 'taskReminder',
        meta: {
          title: '任务提醒',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/project/taskReminder.vue')
      },
      {
        path: 'taskRoadManagementList',
        name: 'taskRoadManagementList',
        meta: {
          title: '任务路口管理',
          hideInBread: true
        },
        component: () => import('@/view/project/taskRoadManagement.vue')
      },
      {
        path: 'addTaskRoad',
        name: 'addTaskRoad',
        meta: {
          title: '新建任务路口',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/project/addTaskRoad.vue')
      },
      {
        path: 'taskRoadReminder',
        name: 'taskRoadReminder',
        meta: {
          title: '任务路口提醒',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/project/taskRoadReminder.vue')
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
    component: Main,
    children: [
      {
        path: 'projectStatistics',
        name: 'projectStatistics',
        meta: {
          title: '项目统计'
        },
        component: () => import('@/view/statistics/projectStatistics.vue')
      },
      {
        path: 'tastStatistics',
        name: 'tastStatistics',
        meta: {
          title: '任务统计'
        },
        component: () => import('@/view/statistics/taskStatistics.vue')
      },
      {
        path: 'taskIntersectionStatistics',
        name: 'taskIntersectionStatistics',
        meta: {
          title: '任务路口统计'
        },
        component: () => import('@/view/statistics/taskIntersectionStatistics.vue')
      },
      {
        path: 'IntersectionStatistics',
        name: 'IntersectionStatistics',
        meta: {
          title: '路口统计'
        },
        component: () => import('@/view/statistics/IntersectionStatistics.vue')
      },
      {
        path: 'MaterialStatistics',
        name: 'MaterialStatistics',
        meta: {
          title: '物资统计'
        },
        component: () => import('@/view/statistics/MaterialStatistics.vue')
      },
      {
        path: 'EmployeeWorkloadStatistics',
        name: 'EmployeeWorkloadStatistics',
        meta: {
          title: '员工工作量统计'
        },
        component: () => import('@/view/statistics/EmployeeWorkloadStatistics.vue')
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
    component: Main,
    children: [
      {
        path: 'MaterialList',
        name: 'MaterialList',
        meta: {
          title: '物资列表',
          hideInMenu: false
        },
        component: () => import('@/view/material/Material.vue')
      },
      {
        path: 'MaterialAdd',
        name: 'MaterialAdd',
        meta: {
          title: '创建物资',
          hideInMenu: false
        },
        component: () => import('@/view/material/MaterialAdd.vue')
      },
      {
        path: 'MaterialDetail',
        name: 'MaterialDetail',
        meta: {
          title: '物资详情',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/material/MaterialDetail.vue')
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
    component: Main,
    children: [
      {
        path: 'dailyList',
        name: 'dailyList',
        meta: {
          icon: i5,
          title: '日报列表',
          hideInMenu: false
        },
        component: () => import('@/view/daily/dailyList.vue')
      },
      {
        path: 'dailyDetail',
        name: 'dailyDetail',
        meta: {
          title: '日报详情',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/daily/dailyDetail.vue')
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
    component: Main,
    children: [
      {
        path: 'infoList',
        name: 'infoList',
        meta: {
          title: '消息列表'
        },
        component: () => import('@/view/info/infoList.vue')
      },
      {
        path: 'infoDetail',
        name: 'infoDetail',
        meta: {
          title: '消息详情',
          hideInMenu: true,
          needInBread: true
        },
        component: () => import('@/view/info/infoDetail.vue')
      },
      {
        path: 'infoPush',
        name: 'infoPush',
        meta: {
          title: '消息推送'
        },
        component: () => import('@/view/info/infoPush.vue')
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
    component: Main,
    children: [
      {
        path: 'user',
        name: 'user',
        meta: {
          title: '用户管理'
        },
        component: parentView,
        children: [
          {
            path: 'userList',
            name: 'userList',
            meta: {
              title: '用户管理',
              hideInBread: true
            },
            component: () => import('@/view/system/user.vue')
          },
          {
            path: 'addUser',
            name: 'addUser',
            meta: {
              title: '新增用户',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/system/addUser.vue')
          },
          {
            path: 'editUser',
            name: 'editUser',
            meta: {
              title: '编辑用户',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/system/editUser.vue')
          }
        ]
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          title: '角色管理'
        },
        component: parentView,
        children: [
          {
            path: 'roleList',
            name: 'roleList',
            meta: {
              title: '角色管理',
              hideInBread: true
            },
            component: () => import('@/view/system/role.vue')
          },
          {
            path: 'addRole',
            name: 'addRole',
            meta: {
              title: '新增角色',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/system/addRole.vue')
          },
          {
            path: 'editRole',
            name: 'editRole',
            meta: {
              title: '编辑角色',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/system/editRole.vue')
          },
          {
            path: 'roleUserList',
            name: 'roleUserList',
            meta: {
              title: '角色用户管理',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/system/roleUserList.vue')
          }
        ]
      },
      {
        path: 'region',
        name: 'region',
        meta: {
          title: '行政区域管理'
        },
        component: () => import('@/view/system/region.vue')
      },
      {
        path: 'unit',
        name: 'unit',
        meta: {
          title: '单位管理'
        },
        component: () => import('@/view/system/unit.vue')
      }
    ]
  }
]
