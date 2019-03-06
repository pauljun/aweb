import asyncComponent from '../../asyncComponent';
export default [
  {
    id: '100001000202',
    parentId: '100001010070',
    title: '历史告警',
    name: 'outsidersAlarm',
    isLocal: false,
    isAction: true,
    icon: 'icon-Clock_Main',
    url: 'PersonnelControl/MoniteeOutsiders/outsidersAlarm',
    storeName: ['MoniteeAlarmsStore'],
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/PersonnelControl/MoniteeOutsiders/outsidersAlarm/index')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/PersonnelControl/MoniteeOutsiders/outsidersAlarm/index')
            )
          )
  },

  {
    id: '100001000172',
    parentId: '100001010070',
    title: '任务管理',
    name: 'outsidersTasks',
    isLocal: false,
    isAction: true,
    icon: 'icon-News_Main',
    url: 'PersonnelControl/MoniteeOutsiders/outsidersTasks',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/PersonnelControl/MoniteeOutsiders/outsidersTasks/index')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/PersonnelControl/MoniteeOutsiders/outsidersTasks/index')
            )
          )
  },

  {
    id: '100001000178',
    parentId: '100001010070',
    title: '合规人员库管理',
    name: 'outsidersBlackLib',
    isLocal: false,
    isAction: true,
    icon: 'icon-Layer_Main',
    url: 'PersonnelControl/MoniteeOutsiders/outsidersBlackLib',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../../view/PersonnelControl/MoniteeOutsiders/outsidersBlackLib/index')
            .default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../../view/PersonnelControl/MoniteeOutsiders/outsidersBlackLib/index')
            )
          )
  },
  {
    id: '100001000182',
    parentId: '100001010070',
    title: '合规人员库管理-添加',
    name: 'outsidersBlackLibAdd',
    isLocal: false,
    isAction: true,
    icon: 'icon-Layer_Main',
    url:
      'PersonnelControl/MoniteeOutsiders/outsidersBlackLib/outsidersBlackLibAdd',
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
  {
    id: '100001000178',
    parentId: '100001010070',
    title: '合规人员库管理-查看',
    name: 'outsidersBlackLibView',
    isLocal: true,
    isAction: true,
    icon: 'icon-Layer_Main',
    url:
      'PersonnelControl/MoniteeOutsiders/outsidersBlackLib/outsidersBlackLibView',
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
  // 以下是外来人员布控任务的操作权限
  {
    id: '100001000209',
    title: '外来人员布控任务增删改权限',
    parentId: '100001010070',
    name: 'OutsidersTasksMessage',
    isLocal: false,
    isAction: true
  },
  // 以下是外来人员布控库的操作权限
  {
    id: '100001000182',
    title: '外来人员布控库增删改权限',
    parentId: '100001010070',
    name: 'OutsidersLibsMessage',
    isLocal: false,
    isAction: true
  },
];
