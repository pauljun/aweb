import asyncComponent from '../asyncComponent';
export default [
  {
    id: '100001010046',
    title: '人员布控',
    name: 'PersonnelControl',
    isLocal: false,
    //storeName: ['MoniteeTasksStore'],
    icon: 'icon-_PeopleAlarm',
    url: 'PersonnelControl',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/PersonnelControl').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/PersonnelControl')
            )
          )
  },
  {
    id: '100001010066',
    parentId: '100001010046',
    title: '实时告警',
    name: 'MoniteeRealAlarm',
    isLocal: false,
    storeName: ['MoniteeTasksStore'],
    icon: 'icon-_Alarm',
    url: 'PersonnelControl/MoniteeRealAlarm',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/PersonnelControl/MoniteeRealAlarm/index').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/PersonnelControl/MoniteeRealAlarm/index')
            )
          )
  },
  {
    id: '100001010069',
    parentId: '100001010046',
    title: '重点人员布控',
    name: 'MoniteeFace',
    isLocal: false,
    storeName: ['MoniteeTasksStore'],
    icon: 'icon-People_Machine_Main',
    url: 'PersonnelControl/MoniteeFace',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/PersonnelControl/MoniteeFace/index').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/PersonnelControl/MoniteeFace/index')
            )
          )
  },
  {
    id: '100001010070',
    parentId: '100001010046',
    title: '外来人员布控',
    name: 'MoniteeOutsiders',
    isLocal: false,
    icon: 'icon-People_Machine_Main',
    url: 'PersonnelControl/MoniteeOutsiders',
    storeName: ['MoniteeAlarmsStore'],
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/PersonnelControl/MoniteeOutsiders/index').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/PersonnelControl/MoniteeOutsiders/index')
            )
          )
  },
  {
    id: '100001010071',
    parentId: '100001010046',
    title: '专网套件布控',
    name: 'MoniteeAIO',
    isLocal: false,
    icon: 'icon-People_Machine_Main',
    url: 'PersonnelControl/MoniteeAIO',
    component:
      process.env.NODE_ENV !== 'production'
        ? require('../../view/PersonnelControl/MoniteeAIO/index').default
        : asyncComponent(() =>
            require.ensure([], require =>
              require('../../view/PersonnelControl/MoniteeAIO/index')
            )
          )
  }
];
