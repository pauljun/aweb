import asyncComponent from '../asyncComponent'

export default [
  {
    id: '100001010016',
    title: '视图资源库',
    name: 'baselib',
    isLocal: false,
    icon: 'icon-_Image',
    url: 'baselib',
    component: 
      process.env.NODE_ENV !== 'production'
        ? require('../../view/Baselib').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/Baselib'))
          )
  },
  // {
  //   id: 8888884,
  //   parentId: 888888,
  //   title: '云搜',
  //   name: 'cloudSearch',
  //   isLocal: false,
  //   storeName: ['cloudSearchStore'],
  //   icon: 'mapview',
  //   url: 'baselib/cloudSearch',
  //   component: 
  //     process.env.NODE_ENV !== 'production'
  //       ? require('../../view/Baselib/cloudSearch').default
  //       : asyncComponent(() =>
  //           require.ensure([], require => require('../../view/Baselib/cloudSearch'))
  //         )
  // },
  {
    id: '100001010020',
    parentId: '100001010016',
    title: '人脸图库',
    name: 'faceLibrary',
    isLocal: false,
    storeName: ['faceStore'],
    icon: 'icon-Face_Main',
    url: 'baselib/faceLibrary',
    component: 
      process.env.NODE_ENV !== 'production'
        ? require('../../view/Baselib/faceLibrary').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/Baselib/faceLibrary'))
          )
  },
  {
    id: '100001010021',
    parentId: '100001010016',
    title: '人体图库',
    name: 'bodyLibrary',
    isLocal: false,
    storeName: ['bodyStore'],
    icon: 'icon-Body_Main',
    url: 'baselib/bodyLibrary',
    component: 
      process.env.NODE_ENV !== 'production'
        ? require('../../view/Baselib/bodyLibrary').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/Baselib/bodyLibrary'))
          )
  },
  {
    id: '100001010054',
    parentId: '100001010016',
    title: '车辆图库',
    name: 'vehicleLibrary',
    isLocal: false,
    storeName: ['vehicleStore'],
    icon: 'icon-_CarAlarm',
    url: 'baselib/vehicleLibrary',
    component: require('../../view/Baselib/vehicleLibrary').default
  },
  {
    id: '100001010086',
    parentId: '100001010016',
    title: 'wifi资源库',
    name: 'wifiLibrary',
    isLocal: false,
    storeName: ['wifiStore'],
    icon: 'icon-_Wifi__Green_Dark',
    url: 'baselib/wifiLibrary',
    component: require('../../view/Baselib/wifiLibrary').default
  },
  {
    id: '100001010002',
    parentId: '100001010016',
    title: '以图搜图',
    name: 'imgSearch',
    isLocal: false,
    storeName: ['imgSearchStore'],
    icon: 'icon-ImageSearch_Light',
    url: 'baselib/imgSearch',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/Baselib/imgSearch').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/Baselib/imgSearch'))
          ) 
  }
];
