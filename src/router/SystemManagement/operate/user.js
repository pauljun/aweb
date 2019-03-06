import asyncComponent from '../../asyncComponent';
export default [
  {
    id: '100001000101',
    title: '用户管理',
    parentId: '100001010023',
    name: 'UserView',
    icon: 'icon-TreeIcon_People_Main',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/User/UserView',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/User/view/index.js').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/User/view/index.js')
            )
          )
  },
  {
    id: '100001000205',
    title: '新建用户',
    parentId: '100001010023',
    name: 'UserAdd',
    isLocal: false,
    isAction: true,
    icon: 'icon-TreeIcon_People_Main',
    url: 'SystemManagement/User/UserAdd',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/User/view/addOrEdit').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/User/view/addOrEdit')
            )
          )
  },
  {
    id: '100001000205',
    title: '编辑用户',
    parentId: '100001010023',
    icon: 'icon-TreeIcon_People_Main',
    name: 'UserEdit',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/User/UserEdit',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/User/view/addOrEdit').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/User/view/addOrEdit')
            )
          )
  },
  {
    id: '100001000101',
    title: '查看用户',
    parentId: '100001010023',
    name: 'UserCheck',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/User/UserCheck',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/User/view/addOrEdit').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/User/view/addOrEdit')
            )
          )
  },
  {
    id: '100001000205',
    title: '其他操作权限',
    parentId: '100001010023',
    name: 'UserOperata',
    isLocal: false,
    isAction: true
  }
];
