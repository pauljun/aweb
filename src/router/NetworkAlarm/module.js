import asyncComponent from '../asyncComponent'
export default [
  {
    id: 4444,
    title: '联网报警',
    name: 'NetworkAlarm',
    isLocal: true,
    icon: 'NetworkAlarm',
    url: 'NetworkAlarm',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/NetworkAlarm').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/NetworkAlarm'))
          )
  }
];
