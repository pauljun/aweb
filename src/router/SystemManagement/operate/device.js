import asyncComponent from '../../asyncComponent';

export default [
  {
    id: '100001000113',
    title: '设备管理',
    parentId: '100001010024',
    name: 'DeviceView',
    icon: 'icon-_Camera__Main2',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/Device/DeviceView',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Device/view/list').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Device/view/list')
            )
          )
  },
  {
    id: '100001000113',
    title: '查看设备',
    parentId: '100001010024',
    name: 'DeviceDetailView',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/Device/DeviceDetailView',
    storeName:['DeviceEditStore'],
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Device/view/edit').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Device/view/edit')
            )
          )
  },
  {
    id: '100001000114',
    title: '编辑设备',
    parentId: '100001010024',
    name: 'DeviceEdit',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/Device/DeviceEdit',
    storeName:['DeviceEditStore'],
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Device/view/edit').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Device/view/edit')
            )
          )
  },
  {
    id: '100001000115',
    title: '分配设备',
    parentId: '100001010024',
    name: 'DeviceAssigned',
    isLocal: false,
    isAction: true
  },
  {
    id: '100001000166',
    title: '地图标注',
    parentId: '100001010024',
    name: 'MapLabel',
    isLocal: false,
    isAction: true
  }
];
