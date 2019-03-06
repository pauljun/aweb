import asyncComponent from '../../asyncComponent';

export default [
  {
    id: '100001000164',
    title: '单兵管理',
    parentId: '100001010038',
    icon: 'icon-_Alarm__Main1',
    name: 'SoldierView',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/Soldier/SoldierView',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Soldier/view/index').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Soldier/view/index')
            )
          )
  },
  {
    id: '100001000203',
    title: '新增单兵',
    parentId: '100001010038',
    name: 'SoldierAdd',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/Soldier/SoldierAdd',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Soldier/components/SearchView')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Soldier/components/SearchView')
            )
          )
  },
  {
    id: '100001000203',
    title: '编辑单兵',
    parentId: '100001010038',
    name: 'SoldierEdit',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/Soldier/SoldierEdit',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Soldier/components/SearchView')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Soldier/components/SearchView')
            )
          )
  },
  {
    id: '100001000203',
    title: '分配单兵',
    parentId: '100001010038',
    name: 'SoldierAssigned',
    isLocal: false,
    isAction: true
  }
];
