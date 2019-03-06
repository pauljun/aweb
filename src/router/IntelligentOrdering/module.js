import asyncComponent from '../asyncComponent'
export default [
  {
    id: 1414141414,
    title: '智能定阅',
    name: 'IntelligentOrdering',
    isLocal: true,
    icon: 'IntelligentOrdering',
    url: 'IntelligentOrdering',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/IntelligentOrdering').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/IntelligentOrdering'))
          )
  }
];
