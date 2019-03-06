import asyncComponent from '../asyncComponent'
export default [
  {
    id: '100001010005',
    title: '事件布控',
    name: 'EventControl',
    isLocal: false,
    icon: 'icon-_ThingsAlarm',
    url: 'EventControl',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/EventControl').default
        : asyncComponent(() =>
            require.ensure([], require => require('../../view/EventControl'))
          )
  },
  {
    id: '100001010067',
    parentId: '100001010005',
    title: '事件提醒',
    name: 'PhantomCurrentAlarm',
    isLocal: false,
    icon: 'icon-Alarm_Main',
    url: 'EventControl/PhantomCurrentAlarm',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/EventControl/PhantomCurrentAlarm/').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/EventControl/PhantomCurrentAlarm/')
            )
          )
  },
  {
    id: '100001010072',
    parentId: '100001010005',
    title: '魅影布防',
    name: 'Phantom',
    isLocal: false,
    icon: 'icon-People_All_Main',
    url: 'EventControl/Phantom',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/EventControl/Phantom/').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/EventControl/Phantom/')
            )
          )
  },
  // 以下是实时事件提醒查看处理权限
  {
    id: '100001000211',
    title: '实时事件提醒查看处理权限',
    parentId: '100001010067',
    name: 'PhantomCurrentAlarmViewHandle',
    isLocal: false,
    isAction: true
  },
];
