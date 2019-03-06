import asyncComponent from '../../asyncComponent';

export default [
  {
    id: '100001000099',
    title: '运营中心管理',
    parentId: '100001010041',
    name: 'CenterView',
    icon: 'icon-TreeIcon_index_Dark',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/OperationCenter/CenterView',
    storeName: ['OperationCenterStore'],
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/OperationCenter/Index/index.js')
          .default
        : asyncComponent(() =>
          require.ensure([], require =>
            require('../../../view/SystemManagement/OperationCenter/Index/index.js')
          )
        )
  },
  {
    id: '100001000099',
    title: '运营中心详情',
    parentId: '100001010041',
    name: 'CenterDetail',
    icon: 'icon-Edit_Main',
    isLocal: false,
    isAction: true,
    storeName: ['OperationCenterDeviceListStore'],
    url: 'SystemManagement/OperationCenter/CenterDetail',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/OperationCenter/Detail')
          .default
        : asyncComponent(() =>
          require.ensure([], require =>
            require('../../../view/SystemManagement/OperationCenter/Detail')
          )
        )
  },
  {
    id: '100001000099',
    title: '新建运营中心',
    parentId: '100001010041',
    name: 'CenterAdd',
    icon: 'icon-Edit_Main',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/OperationCenter/CenterAdd',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/OperationCenter/AddEdit')
          .default
        : asyncComponent(() =>
          require.ensure([], require =>
            require('../../../view/SystemManagement/OperationCenter/AddEdit')
          )
        )
  },
  // {
  //   id: '100001000099',
  //   title: '编辑运营中心',
  //   parentId: '100001010041',
  //   name: 'CenterEdit',
  //   icon:'icon-Edit_Main',
  //   isLocal: false,
  //   isAction: true,
  //   url: 'SystemManagement/OperationCenter/CenterEdit',
  //   component:
  //     process.env.NODE_ENV !== 'production'
  //       ? require('../../../view/SystemManagement/OperationCenter/AddEdit')
  //           .default
  //       : asyncComponent(() =>
  //           require.ensure([], require =>
  //             require('../../../view/SystemManagement/OperationCenter/AddEdit')
  //           )
  //         )
  // },
  // {
  //   id: '100001000099',
  //   title: '运营中心详情',
  //   parentId: '100001010041',
  //   name: 'CenterDetail',
  //   icon:'icon-Task_Dark',
  //   isLocal: false,
  //   isAction: true,
  //   url: 'SystemManagement/OperationCenter/CenterDetail',
  //   component:
  //     process.env.NODE_ENV !== 'production'
  //       ? require('../../../view/SystemManagement/OperationCenter/View').default
  //       : asyncComponent(() =>
  //           require.ensure([], require =>
  //             require('../../../view/SystemManagement/OperationCenter/View')
  //           )
  //         )
  // },
  // {
  //   id: '100001000099',
  //   title: '已分配设备',
  //   parentId: '100001010041',
  //   name: 'CenterDeviceList',
  //   icon:'icon-Camera_Main2',
  //   isLocal: false,
  //   isAction: true,
  //   url: 'SystemManagement/OperationCenter/CenterDeviceList',
  //   storeName: ['OperationCenterDeviceListStore'],
  //   component:
  //     process.env.NODE_ENV !== 'production'
  //       ? require('../../../view/SystemManagement/OperationCenter/DeviceList')
  //           .default
  //       : asyncComponent(() =>
  //           require.ensure([], require =>
  //             require('../../../view/SystemManagement/OperationCenter/DeviceList')
  //           )
  //         )
  // },
  // {
  //   id: '100001000099',
  //   title: '分配设备',
  //   parentId: '100001010041',
  //   name: 'CenterAssignedDevice',
  //   icon:'icon-TreeIcon_Group_Main2',
  //   isLocal: false,
  //   isAction: true,
  //   storeName: ['OperationCenterDeviceSollotStore'],
  //   url: 'SystemManagement/OperationCenter/CenterAssignedDevice',
  //   component:
  //     process.env.NODE_ENV !== 'production'
  //       ? require('../../../view/SystemManagement/OperationCenter/DeviceSollot')
  //           .default
  //       : asyncComponent(() =>
  //           require.ensure([], require =>
  //             require('../../../view/SystemManagement/OperationCenter/DeviceSollot')
  //           )
  //         )
  // }
];
