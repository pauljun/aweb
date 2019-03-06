import asyncComponent from '../../asyncComponent';
export default [
  {
    id: '100001000224',
    title: '小区管理',
    parentId: '100001010007',
    name:'CenterVillageList',
    icon: 'icon-Community_Dark',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/CenterVillage/CenterVillageList',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/CenterVillage/view/list.js').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/CenterVillage/view/list.js')
            )
          )
  },{
    id: '100001000225',
    title: '小区详情',
    parentId: '100001000224',
    icon: 'icon-_Community__Main',
    name: 'CenterVillageDetail',
    isLocal: true,
    isAction: true,
    storeName:['VillageList'],
    url: 'SystemManagement/CenterVillage/CenterVillageDetail',
    component:
    process.env.NODE_ENV !== 'production'
      ? require('../../../view/SystemManagement/Village/view/detail.js').default
      : asyncComponent(() =>
          require.ensure([], require =>
            require('../../../view/SystemManagement/Village/view/detail.js')
          )
        )
  },{
    id: '100001000222',
    title: '小区管理',
    parentId: '100001000224',
    icon: 'icon-_Community__Main',
    name: 'CenterVillageEdit',
    isLocal: true,
    isAction: true,
    storeName:['VillageList'],
    url: 'SystemManagement/CenterVillage/CenterVillageDetail',
    component:null
  },
];
