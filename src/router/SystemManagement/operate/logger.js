import asyncComponent from '../../asyncComponent';
export default [
  {
    id: '100001000118',
    title: '日志导出',
    parentId: '100001010015',
    name: 'LoggerExport',
    isLocal: false,
    isAction: true
  },
  {
    id: '100001000117',
    title: '平台日志管理',
    parentId: '100001010015',
    name: 'PlatformLogger',
    icon: 'icon-News_Main',
    isLocal: false,
    isAction: true,
    storeName: ['LogManagementStore'],
    url: 'SystemManagement/Logger/PlatformLogger',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Logger/platformLogger')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Logger/platformLogger')
            )
          )
  }
];
