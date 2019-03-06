import asyncComponent from '../../asyncComponent';
export default [
  {
    id: '100001000165',
    title: '系统分析',
    parentId: '100001010036',
    name: 'StatisticView',
    icon:'icon-News_Dark',
    isLocal: false,
    isAction: true,
    url: 'SystemManagement/Statistical/StatisticView',
    storeName: ['StatisticStore'],
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/SystemManagement/Statistical/view/index.js')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/SystemManagement/Statistical/view/index.js')
            )
          )
  },
];
