import asyncComponent from '../asyncComponent'
export default [
  {
    id: 151515,
    title: '智能研判',
    name: 'IntelligentJudgment',
    isLocal: true,
    icon: 'IntelligentJudgment',
    url: 'IntelligentJudgment',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/IntelligentJudgment').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/IntelligentJudgment'))
          )
  }
];
