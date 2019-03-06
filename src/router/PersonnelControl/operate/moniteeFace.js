import asyncComponent from '../../asyncComponent';
export default [
  {
    id: '100001000201',
    parentId: '100001010069',
    title: '历史告警',
    name: 'faceAlarm',
    isLocal: false,
    isAction: true,
    icon: 'icon-Clock_Main',
    url: 'PersonnelControl/MoniteeFace/faceAlarm',
    storeName: ['MoniteeAlarmsStore'],
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/PersonnelControl/MoniteeFace/faceAlarm')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/PersonnelControl/MoniteeFace/faceAlarm')
            )
          )
  },
  {
    id: '100001000130',
    parentId: '100001010069',
    title: '任务管理',
    name: 'faceTasks',
    isAction: true,
    isLocal: false,
    icon: 'icon-News_Main',
    url: 'PersonnelControl/MoniteeFace/faceTasks',
    storeName: ['MoniteeTasksStore'],
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/PersonnelControl/MoniteeFace/faceTasks')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/PersonnelControl/MoniteeFace/faceTasks')
            )
          )
  },
  {
    id: '100001000137',
    parentId: '100001010069',
    title: '重点人员库管理',
    name: 'faceBlackLib',
    isLocal: false,
    isAction: true,
    icon: 'icon-Layer_Main',
    url: 'PersonnelControl/MoniteeFace/faceBlackLib',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/PersonnelControl/MoniteeFace/faceBlackLib')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/PersonnelControl/MoniteeFace/faceBlackLib')
            )
          )
  },
  {
    id: '100001000141',
    parentId: '100001010069',
    title: '重点人员布控库-添加',
    name: 'faceBlackLibAdd',
    isLocal: false,
    isAction: true,
    icon: 'icon-_Main1',
    url: 'PersonnelControl/MoniteeFace/faceBlackLib/faceBlackLibAdd',
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

  //下面是重点人员布控库管理的展位
  {
    id: '100001000137',
    parentId: '100001010048',
    title: '重点人员布控库-查看',
    name: 'faceBlackLibView',
    isLocal: false,
    isAction: true,
    icon: 'icon-People_Machine_Main',
    url: 'PersonnelControl/MoniteeFace/faceBlackLib/faceBlackLibView',
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
  // 以下是重点人员布控任务的操作权限
  {
    id: '100001000208',
    title: '重点人员布控任务增删改权限',
    parentId: '100001010069',
    name: 'FaceTasksMessage',
    isLocal: false,
    isAction: true
  },
  // 以下是重点人员布控库的操作权限
  {
    id: '100001000141',
    title: '重点人员布控库增删改权限',
    parentId: '100001010048',
    name: 'FaceLibsMessage',
    isLocal: false,
    isAction: true
  },
];
