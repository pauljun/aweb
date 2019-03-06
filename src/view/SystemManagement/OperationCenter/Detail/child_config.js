export default [
  {
    id: '1',
    title: '运营中心信息',
    component: require('../View/index.jsx').default,
    editComponent: require('../AddEdit/index.jsx').default
  },
  {
    id: '2',
    title: '分配设备',
    component: require('../DeviceList/index.js').default,
    editComponent: require('../DeviceSollot/index.jsx').default
  },
  {
    id: '3',
    title: '分配小区',
    component: require('../Village/index.jsx').default,
    //editComponent: require('../../Village/components/DisCenter/index.js').default
    editComponent: require('../Village/villageEdit.jsx').default
  }
]