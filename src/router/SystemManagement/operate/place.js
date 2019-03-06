import asyncComponent from '../../asyncComponent';
export default [
  {
    id: '10000100009115',
    title: '场所设备管理',
    parentId: '100001010041001',
    icon: 'icon-List_Tree_Main',
    name: 'PlaceManagementView',
    isLocal: true,
    isAction: true,
    url: 'SystemManagement/PlaceManagement/PlaceManagementView',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/PlaceManagement/view/index').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/PlaceManagement/view/index')
            )
          )
  }
];
