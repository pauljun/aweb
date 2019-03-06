import asyncComponent from '../../asyncComponent';
export default [
  {
    id: '100001000225',
    title: '小区管理',
    parentId: '100001010008',
    icon: 'icon-_Community__Main',
    name: 'VillageList',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/Village/VillageList',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Village/view/list.js').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Village/view/list.js')
            )
          )
  },{
    id: '100001000225',
    title: '小区详情',
    parentId: '100001010008',
    icon: 'icon-_Community__Main',
    name: 'VillageDetail',
    isLocal: false,
    isAction: true,
    storeName:['VillageList'],
    url: 'SystemManagement/Village/VillageDetail',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Village/view/detail.js').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Village/view/detail.js')
            )
          )
  }
  // {
  //   id: '100001000222',
  //   title: '编辑小区',
  //   parentId: '100001010008',
  //   name: 'VillageEdit',
  //   isLocal: false,
  //   isAction: true,
  //   storeName:['VillageList'],
  //   url: 'SystemManagement/Village/VillageEdit',
  //   component:
  //     process.env.NODE_ENV !== 'production'
  //       ? require('../../../view/SystemManagement/Village/view/edit.js').default
  //       : asyncComponent(() =>
  //           require.ensure([], require =>
  //             require('../../../view/SystemManagement/Village/view/edit.js')
  //           )
  //         )
  // }
];
