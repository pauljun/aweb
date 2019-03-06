import asyncComponent from '../asyncComponent'
export default [
  {
    id: 666666,
    title: '车辆布控',
    name: 'VehicleControl',
    isLocal: true,
    icon: 'VehicleControl',
    url: 'VehicleControl',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/VehicleControl').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/VehicleControl'))
          )
  }
];
