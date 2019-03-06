import asyncComponent from '../../asyncComponent';
export default [
  {
    id: '100001000095',
    title: '组织管理',
    parentId: '100001010022',
    icon: 'icon-List_Tree_Main',
    name: 'OrganizationView',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/Organization/OrganizationView',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Organization/view/index').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Organization/view/index')
            )
          )
  },
  {
    id: '100001000206',
    title: '组织操作权限',
    parentId: '100001010022',
    name: 'OrganizationOperata',
    isLocal: false,
    isAction: true
  }
];
