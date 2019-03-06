import asyncComponent from '../asyncComponent'
export default [
  {
    id: '100001010052',
    title: '社区管理',
    name: 'CommunityManagement',
    isLocal: false,
    icon: 'icon-_Community',
    url: 'CommunityManagement',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/CommunityManagement').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/CommunityManagement'))
          )
  },{
    id: '100001010073',
    parentId:'100001010052',
    title: '社区总览',
    name: 'commmuityEntry',
    isLocal: false,
    icon: 'icon-_Community',
    url: 'CommunityManagement/commmuityEntry',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/CommunityManagement/view/entry').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/CommunityManagement/view/entry'))
          )
  },
  {
    id: '100001010074',
    parentId:'100001010052',
    title:'常住人口管理',
    name: "CommunityRegistered",
    isLocal: false,
    icon: 'icon-Often_Dark',
    url: 'CommunityManagement/CommunityRegistered',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/CommunityManagement/view/Registered').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/CommunityManagement/view/Registered'))
          )
  },
  {
    id: '100001010075',
    parentId:'100001010052',
    title: '流动人口管理',
    name: "CommunityUnRegistered",
    isLocal: false,
    icon: 'icon-People_Other_Main',
    url: 'CommunityManagement/CommunityUnRegistered',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/CommunityManagement/view/UnRegistered').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/CommunityManagement/view/UnRegistered'))
          )
  }
];
