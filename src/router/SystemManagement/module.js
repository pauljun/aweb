import asyncComponent from '../asyncComponent';
export default [
  {
    id: '100001010031',
    title: '系统管理',
    name: 'SystemManagement',
    isLocal: false,
    icon: 'icon-_Setting',
    url: 'SystemManagement',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/SystemManagement').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/SystemManagement')
            )
          )
  },
  {
    id: '100001010022',
    title: '组织管理',
    parentId: '100001010031',
    name: 'Organization',
    isLocal: false,
    icon: 'icon-List_Tree_Main',
    url: 'SystemManagement/Organization',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/SystemManagement/Organization').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/SystemManagement/Organization')
            )
          )
  },
  {
    id: '100001010023',
    title: '用户管理',
    parentId: '100001010031',
    // storeName: ['UserManagementStore','RoleManagementStore'],
    name: 'User',
    isLocal: false,
    icon: 'icon-TreeIcon_People_Main',
    url: 'SystemManagement/User',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/SystemManagement/User').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/SystemManagement/User')
            )
          )
  },
  {
    id: '100001010038',
    title: '单兵管理',
    parentId: '100001010031',
    name: 'Soldier',
    isLocal: false,
    icon: 'icon-_Alarm__Main1',
    url: 'SystemManagement/Soldier',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/SystemManagement/Soldier').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/SystemManagement/Soldier')
            )
          )
  },
  {
    id: '100001010014',
    title: '角色管理',
    parentId: '100001010031',
    name: 'Role',
    isLocal: false,
    icon: 'icon-Control_White_Main',
    url: 'SystemManagement/Role',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/SystemManagement/Role').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/SystemManagement/Role')
            )
          )
  },
  {
    id: '100001010024',
    title: '设备管理',
    parentId: '100001010031',
    name: 'Device',
    isLocal: false,
    icon: 'icon-_Camera__Main2',
    url: 'SystemManagement/Device',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/SystemManagement/Device').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/SystemManagement/Device')
            )
          )
  },
  //运营中心管理人员
  {
    id: '100001010008',
    title: '小区管理',
    parentId: '100001010031',
    name: 'Village',
    isLocal: false,
    icon: 'icon-_Community__Main',
    url: 'SystemManagement/Village',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/SystemManagement/Village/index.js').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/SystemManagement/Village/index.js')
            )
          )
  },

  {
    id: '100001010015',
    title: '日志管理',
    parentId: '100001010031',
    name: 'Logger',
    isLocal: false,
    icon: 'icon-News_Main',
    url: 'SystemManagement/Logger',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/SystemManagement/Logger').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/SystemManagement/Logger')
            )
          )
  },
  //平台统计分析
  {
    id: '100001010036',
    title: '统计分析',
    parentId: '100001010031',
    name: 'Statistical',
    isLocal: false,
    icon: 'icon-Community_Dark',
    url: 'SystemManagement/Statistical',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/SystemManagement/Statistical/index.js').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/SystemManagement/Statistical/index.js')
            )
          )
  },
  //平台管理人员
  {
    id: '100001010007',
    title: '小区管理',
    parentId: '100001010031',
    name: 'CenterVillage',
    isLocal: false,
    icon: 'icon-Community_Dark',
    url: 'SystemManagement/CenterVillage',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/SystemManagement/CenterVillage/index.js').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/SystemManagement/CenterVillage/index.js')
            )
          )
  },
  {
    id: '100001010085',
    title: '信息录入',
    parentId: '100001010031',
    name: 'PeopleEntry',
    isLocal: false,
    icon: 'icon-Community_Dark',
    url: 'SystemManagement/PeopleEntry',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/SystemManagement/PeopleEntry/index.js').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/SystemManagement/PeopleEntry/index.js')
            )
          )
  },
  {
    id: '100001010041',
    title: '运营中心管理',
    parentId: '100001010031',
    name: 'OperationCenter',
    isLocal: false,
    icon: 'icon-TreeIcon_index_Dark',
    url: 'SystemManagement/OperationCenter',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/SystemManagement/OperationCenter/index.js')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/SystemManagement/OperationCenter/index.js')
            )
          )
  },
  {
    id: '100001010041001',
    title: '场所设备管理',
    parentId: '100001010031',
    name: 'PlaceManagement',
    isLocal: false,
    icon: 'icon-TreeIcon_index_Dark',
    url: 'SystemManagement/PlaceManagement',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/SystemManagement/PlaceManagement/index.js')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/SystemManagement/PlaceManagement/index.js')
            )
          )
  },
];
