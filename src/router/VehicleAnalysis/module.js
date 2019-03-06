import asyncComponent from '../asyncComponent'
export default [
  {
    id: 11011011,
    title: '车辆分析',
    name: 'VehicleAnalysis',
    isLocal: true,
    icon: 'VehicleAnalysis',
    url: 'VehicleAnalysis',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/VehicleAnalysis').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/VehicleAnalysis'))
          )
  }
];
