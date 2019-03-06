import asyncComponent from '../asyncComponent'
export default [
  {
    id: 33333,
    title: '人力情报',
    name: 'HumanIntelligence',
    isLocal: true,
    icon: 'HumanIntelligence',
    url: 'HumanIntelligence',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/HumanIntelligence').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/HumanIntelligence'))
          )
  }
];
