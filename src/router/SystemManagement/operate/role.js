import asyncComponent from '../../asyncComponent';

export default [
  {
    id: '100001000108',
    title: '角色管理',
    parentId: '100001010014',
    name: 'RoleList',
    isLocal: false,
    isAction: true,
    icon: 'icon-Control_White_Main',
    url: 'SystemManagement/Role/RoleList',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Role/view/index.js').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Role/view/index.js')
            )
          )
  },{
    id: '100001000108',
    title: '查看角色',
    parentId: '100001010014',
    name: 'RoleView',
    isLocal: false,
    isAction: true,
    icon: 'icon-Control_White_Main',
    url: 'SystemManagement/Role/RoleView',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Role/view/addOrEdit').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Role/view/addOrEdit')
            )
          )
  },
  {
    id: '100001000204',
    title: '新增角色',
    parentId: '100001010014',
    name: 'RoleAdd',
    isLocal: false,
    isAction: true,
    storeName: ['RoleManagementStore'],
    icon: 'icon-Control_White_Main',
    url: 'SystemManagement/Role/RoleAdd',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Role/view/addOrEdit').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Role/view/addOrEdit')
            )
          )
  },
  {
    id: '100001000204',
    title: '编辑角色',
    parentId: '100001010014',
    name: 'RoleEdit',
    icon: 'icon-Control_White_Main',
    isLocal: false,
    isAction: true,
    storeName: ['RoleManagementStore'],
    url: 'SystemManagement/Role/RoleEdit',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Role/view/addOrEdit').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Role/view/addOrEdit')
            )
          )
  },
  {
    id: '100001000204',
    title: '删除角色',
    parentId: '100001010014',
    name: 'RoleDelete',
    isLocal: false,
    isAction: true
  }
];
