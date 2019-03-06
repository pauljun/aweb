import asyncComponent from '../asyncComponent'
export default [
  {
    id: 13131313,
    title: '轨迹分析',
    name: 'TrajectoryAnalysis',
    isLocal: true,
    icon: 'TrajectoryAnalysis',
    url: 'TrajectoryAnalysis',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/TrajectoryAnalysis').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/TrajectoryAnalysis'))
          )
  }
];
