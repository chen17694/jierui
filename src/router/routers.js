import Main from '@/components/main'
import parentView from '@/components/parent-view'
import addTask from '@/view/project/addTask.vue'
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
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/my',
    name: 'my',
    meta: {
      icon: 'md-menu',
      title: '我的'
    },
    component: Main,
    children: [
      {
        path: 'myProject',
        name: 'myProject',
        meta: {
          icon: 'md-funnel',
          title: '我的项目'
        },
        component: () => import('@/view/my/myProject.vue')
      },
      {
        path: 'myTask',
        name: 'myTask',
        meta: {
          icon: 'md-funnel',
          title: '我的任务'
        },
        component: () => import('@/view/my/myTask.vue')
      },
      {
        path: 'myMaterial',
        name: 'myMaterial',
        meta: {
          icon: 'md-boat',
          title: '我的物资'
        },
        component: () => import('@/view/my/myMaterial.vue')
      },
      {
        path: 'applyMaterial',
        name: 'applyMaterial',
        meta: {
          icon: 'md-funnel',
          title: '物资申请',
          hideInMenu: true
        },
        component: () => import('@/view/my/applyMaterial.vue')
      },
      {
        path: 'myDaily',
        name: 'myDaily',
        meta: {
          icon: 'md-funnel',
          title: '我的日报'
        },
        component: () => import('@/view/my/myDaily.vue')
      },
      {
        path: 'myDailyList',
        name: 'myDailyList',
        meta: {
          icon: 'md-funnel',
          title: '我的日报',
          hideInMenu: true
        },
        component: () => import('@/view/my/myDailyList.vue')
      },
      {
        path: 'myProcessed',
        name: 'myProcessed',
        meta: {
          icon: 'md-funnel',
          title: '我的审核审批'
        },
        component: () => import('@/view/my/myProcessed.vue')
      },
      {
        path: 'myOverdue',
        name: 'myOverdue',
        meta: {
          icon: 'md-funnel',
          title: '逾期信息'
        },
        component: parentView,
        children: [
          {
            path: 'projectOverdue',
            name: 'projectOverdue',
            meta: {
              icon: 'md-funnel',
              title: '项目逾期'
            },
            component: () => import('@/view/my/projectOverdue.vue')
          },
          {
            path: 'taskOverdue',
            name: 'taskOverdue',
            meta: {
              icon: 'md-funnel',
              title: '任务逾期'
            },
            component: () => import('@/view/my/taskOverdue.vue')
          },
          {
            path: 'roadOverdue',
            name: 'roadOverdue',
            meta: {
              icon: 'md-funnel',
              title: '任务路口逾期'
            },
            component: () => import('@/view/my/roadOverdue.vue')
          },
          {
            path: 'returnOverdue',
            name: 'returnOverdue',
            meta: {
              icon: 'md-funnel',
              title: '物资归还逾期'
            },
            component: () => import('@/view/my/returnOverdue.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/project',
    name: 'project',
    meta: {
      icon: 'md-menu',
      title: '项目管理'
    },
    component: Main,
    children: [
      {
        path: 'projectManagement',
        name: 'projectManagement',
        meta: {
          icon: 'md-funnel',
          title: '项目管理'
        },
        component: parentView,
        children: [
          {
            path: 'projectManagementList',
            name: 'projectManagementList',
            meta: {
              icon: 'md-funnel',
              title: '项目管理',
              hideInBread: true
            },
            component: () => import('@/view/project/projectManagement.vue')
          },
          {
            path: 'addProject',
            name: 'addProject',
            meta: {
              icon: 'md-funnel',
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
              icon: 'md-funnel',
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
              icon: 'md-funnel',
              title: '项目提醒',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/project/projectReminder.vue')
          }
        ]
      },
      {
        path: 'taskManagement',
        name: 'taskManagement',
        meta: {
          icon: 'md-funnel',
          title: '任务管理'
        },
        component: parentView,
        children: [
          {
            path: 'taskManagementList',
            name: 'taskManagementList',
            meta: {
              icon: 'md-funnel',
              title: '任务管理',
              hideInBread: true
            },
            component: () => import('@/view/project/taskManagement.vue')
          },
          {
            path: 'addTask',
            name: 'addTask',
            meta: {
              icon: 'md-funnel',
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
              icon: 'md-funnel',
              title: '新建任务',
              hideInMenu: true,
              needInBread: true,
              notCache: true
            },
            component: () => import('@/view/project/addTaskForm.vue')
          },
          {
            path: 'taskReminder',
            name: 'taskReminder',
            meta: {
              icon: 'md-funnel',
              title: '任务提醒',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/project/taskReminder.vue')
          }
        ]
      },
      {
        path: 'taskRoadManagement',
        name: 'taskRoadManagement',
        meta: {
          icon: 'md-funnel',
          title: '任务路口管理'
        },
        component: parentView,
        children: [
          {
            path: 'taskRoadManagementList',
            name: 'taskRoadManagementList',
            meta: {
              icon: 'md-funnel',
              title: '任务路口管理',
              hideInBread: true
            },
            component: () => import('@/view/project/taskRoadManagement.vue')
          },
          {
            path: 'addTaskRoad',
            name: 'addTaskRoad',
            meta: {
              icon: 'md-funnel',
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
              icon: 'md-funnel',
              title: '任务路口提醒',
              hideInMenu: true,
              needInBread: true
            },
            component: () => import('@/view/project/taskRoadReminder.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/statistics',
    name: 'statistics',
    meta: {
      icon: 'md-menu',
      title: '统计分析'
    },
    component: Main,
    children: [
      {
        path: 'projectStatistics',
        name: 'projectStatistics',
        meta: {
          icon: 'md-funnel',
          title: '项目统计'
        },
        component: () => import('@/view/statistics/projectStatistics.vue')
      },
      {
        path: 'tastStatistics',
        name: 'tastStatistics',
        meta: {
          icon: 'md-funnel',
          title: '任务统计'
        },
        component: () => import('@/view/statistics/taskStatistics.vue')
      },
      {
        path: 'taskIntersectionStatistics',
        name: 'taskIntersectionStatistics',
        meta: {
          icon: 'md-funnel',
          title: '任务路口统计'
        },
        component: () => import('@/view/statistics/taskIntersectionStatistics.vue')
      },
      {
        path: 'IntersectionStatistics',
        name: 'IntersectionStatistics',
        meta: {
          icon: 'md-funnel',
          title: '路口统计'
        },
        component: () => import('@/view/statistics/IntersectionStatistics.vue')
      },
      {
        path: 'MaterialStatistics',
        name: 'MaterialStatistics',
        meta: {
          icon: 'md-funnel',
          title: '物资统计'
        },
        component: () => import('@/view/statistics/MaterialStatistics.vue')
      },
      {
        path: 'EmployeeWorkloadStatistics',
        name: 'EmployeeWorkloadStatistics',
        meta: {
          icon: 'md-funnel',
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
      icon: 'md-boat',
      title: '物资管理',
      hideInMenu: false
    },
    component: Main,
    children: [
      {
        path: 'MaterialList',
        name: 'MaterialList',
        meta: {
          icon: 'md-funnel',
          title: '物资列表',
          hideInMenu: false
        },
        component: () => import('@/view/material/Material.vue')
      },
      {
        path: 'MaterialAdd',
        name: 'MaterialAdd',
        meta: {
          icon: 'md-funnel',
          title: '创建物资',
          hideInMenu: false
        },
        component: () => import('@/view/material/MaterialAdd.vue')
      },
      {
        path: 'MaterialDetail',
        name: 'MaterialDetail',
        meta: {
          icon: 'md-funnel',
          title: '物资详情',
          hideInMenu: true
        },
        component: () => import('@/view/material/MaterialDetail.vue')
      }
    ]
  },
  {
    path: '/DailyReview',
    name: 'DailyReview',
    meta: {
      icon: 'md-boat',
      title: '日报审阅'
    },
    component: Main,
    children: [
      {
        path: 'dailyList',
        name: 'dailyList',
        meta: {
          icon: 'md-funnel',
          title: '日报列表',
          hideInMenu: false
        },
        component: () => import('@/view/daily/dailyList.vue')
      },
      {
        path: 'dailyDetail',
        name: 'dailyDetail',
        meta: {
          icon: 'md-funnel',
          title: '日报详情',
          hideInMenu: false
        },
        component: () => import('@/view/daily/dailyDetail.vue')
      }
    ]
  },
  {
    path: '/info',
    name: 'info',
    meta: {
      icon: 'ios-chatboxes',
      title: '消息'
    },
    component: Main,
    children: [
      {
        path: 'infoList',
        name: 'infoList',
        meta: {
          icon: 'md-funnel',
          title: '消息列表',
          hideInMenu: false
        },
        component: () => import('@/view/info/infoList.vue')
      },
      {
        path: 'infoDetail',
        name: 'infoDetail',
        meta: {
          icon: 'md-funnel',
          title: '消息详情',
          hideInMenu: true
        },
        component: () => import('@/view/info/infoDetail.vue')
      },
      {
        path: 'infoPush',
        name: 'infoPush',
        meta: {
          icon: 'md-funnel',
          title: '消息推送',
          hideInMenu: false
        },
        component: () => import('@/view/info/infoPush.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'md-menu',
      title: '系统管理'
    },
    component: Main,
    children: [
      {
        path: 'user',
        name: 'user',
        meta: {
          icon: 'md-funnel',
          title: '用户管理'
        },
        component: parentView,
        children: [
          {
            path: 'userList',
            name: 'userList',
            meta: {
              icon: 'md-funnel',
              title: '用户管理',
              hideInBread: true
            },
            component: () => import('@/view/system/user.vue')
          },
          {
            path: 'addUser',
            name: 'addUser',
            meta: {
              icon: 'md-funnel',
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
              icon: 'md-funnel',
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
          icon: 'md-funnel',
          title: '角色管理'
        },
        component: parentView,
        children: [
          {
            path: 'roleList',
            name: 'roleList',
            meta: {
              icon: 'md-funnel',
              title: '角色管理',
              hideInBread: true
            },
            component: () => import('@/view/system/role.vue')
          },
          {
            path: 'addRole',
            name: 'addRole',
            meta: {
              icon: 'md-funnel',
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
              icon: 'md-funnel',
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
              icon: 'md-funnel',
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
          icon: 'md-funnel',
          title: '行政区域管理'
        },
        component: () => import('@/view/system/region.vue')
      },
      {
        path: 'unit',
        name: 'unit',
        meta: {
          icon: 'md-funnel',
          title: '单位管理'
        },
        component: () => import('@/view/system/unit.vue')
      }
    ]
  }
]
