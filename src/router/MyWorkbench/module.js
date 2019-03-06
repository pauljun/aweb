import asyncComponent from '../asyncComponent'
export default [
  {
    id: 1616161616,
    title: '我的工作台',
    name: 'MyWorkbench',
    isLocal: true,
    icon: 'MyWorkbench',
    url: 'MyWorkbench',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/MyWorkbench').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/MyWorkbench'))
          )
  }
];
