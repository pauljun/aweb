import asyncComponent from '../asyncComponent'
export default [
  {
    id: 12121212,
    title: '事件分析',
    name: 'EventAnalysis',
    isLocal: true,
    icon: 'EventAnalysis',
    url: 'EventAnalysis',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/EventAnalysis').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/EventAnalysis'))
          )
  }
];
