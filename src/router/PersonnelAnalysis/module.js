import asyncComponent from '../asyncComponent'
export default [
  {
    id: 10101010,
    title: '人员分析',
    name: 'PersonnelAnalysis',
    isLocal: true,
    icon: 'PersonnelAnalysis',
    url: 'PersonnelAnalysis',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/PersonnelAnalysis').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/PersonnelAnalysis'))
          )
  }
];
