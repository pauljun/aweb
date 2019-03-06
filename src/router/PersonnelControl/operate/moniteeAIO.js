import asyncComponent from '../../asyncComponent';
export default [
  {
    id: '100001000215',
    parentId: '100001010071',
    title: '历史告警',
    name: 'AIOAlarms',
    isLocal: false,
    isAction: true,
    icon: 'icon-Clock_Main',
    url: 'PersonnelControl/MoniteeAIO/AIOAlarms',
    storeName: [],
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/PersonnelControl/MoniteeAIO/AIOAlarm/index')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/PersonnelControl/MoniteeAIO/AIOAlarm/index')
            )
          )
  },
  {
    id: '100001000193',
    parentId: '100001010071',
    title: '任务管理',
    name: 'AIOTasks',
    isLocal: false,
    isAction: true,
    icon: 'icon-News_Main',
    url: 'PersonnelControl/MoniteeAIO/AIOTasks',
    storeName: [],
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/PersonnelControl/MoniteeAIO/AIOTasks/index')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/PersonnelControl/MoniteeAIO/AIOTasks/index')
            )
          )
  },
  {
    id: '100001000196',
    parentId: '100001010071',
    title: '专网库管理',
    name: 'AIOLibs',
    isLocal: false,
    isAction: true,
    icon: 'icon-Layer_Main',
    url: 'PersonnelControl/MoniteeAIO/AIOLibs',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/PersonnelControl/MoniteeAIO/AIOLibs/index')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/PersonnelControl/MoniteeAIO/AIOLibs/index')
            )
          )
  },
  {
    id:'100001000196',
    parentId: '100001010071',
    title: '一体机-布控库查看',
    name: 'AIOLibsView',
    isLocal: true,
    isAction: true,
    icon: 'PersonnelControl',
    url: 'PersonnelControl/MoniteeAIO/AIOLibs/AIOLibsView',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/PersonnelControl/Components/libs/LibListContainer')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/PersonnelControl/Components/libs/LibListContainer')
            )
          )
  },
  {
    id: '100001000197',
    parentId: '100001010071',
    title: '一体机-布控库添加',
    name: 'AIOLibsAdd',
    isLocal: false,
    isAction: true,
    icon: 'PersonnelControl',
    url: 'PersonnelControl/MoniteeAIO/AIOLibs/AIOLibsAdd',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/PersonnelControl/Components/libs/LibAddContainer')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/PersonnelControl/Components/libs/LibAddContainer')
            )
          )
  },
  // 以下是一体机布控任务的操作权限
  {
    id: '100001000194',
    title: '一体机布控任务增删改权限',
    parentId: '100001010071',
    name: 'AIOTasksMessage',
    isLocal: false,
    isAction: true
  },
  // 以下是一体机布控库的操作权限
  {
    id: '100001000197',
    title: '一体机布控库增删改权限',
    parentId: '100001010071',
    name: 'AIOLibsMessage',
    isLocal: false,
    isAction: true
  },
];
