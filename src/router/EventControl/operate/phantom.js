import asyncComponent from '../../asyncComponent';
export default [
  {
    id: '100001000234',
    parentId: '100001010072',
    title: '历史提醒',
    name: 'PhantomAlarms',
    isLocal: false,
    icon: 'icon-Clock_Main',
    isAction: true,
    storeName: [],
    url: 'EventControl/Phantom/PhantomAlarms',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/EventControl/Phantom/PhantomAlarms/index').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/EventControl/Phantom/PhantomAlarms/index')
            )
          )
  },
  {
    id: '100001000187',
    parentId: '100001010072',
    title: '任务管理',
    name: 'PhantomTasks',
    isLocal: false,
    icon: 'icon-News_Main',
    isAction: true,
    storeName: [],
    url: 'EventControl/Phantom/PhantomTasks',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/EventControl/Phantom/PhantomTasks/index').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/EventControl/Phantom/PhantomTasks/index')
            )
          )
  },
  // 以下是魅影布控任务的操作权限
  {
    id: '100001000207',
    title: '魅影布控任务增删改权限',
    parentId: '100001010063',
    name: 'PhantomTasksMessage',
    isLocal: false,
    isAction: true
  },
  // 以下是魅影布控任务的操作权限
  {
    id: '100001000234',
    title: '魅影告警处理权限',
    parentId: '100001010067',
    name: 'PhantomTasksMessage',
    isLocal: false,
    isAction: true
  }
]