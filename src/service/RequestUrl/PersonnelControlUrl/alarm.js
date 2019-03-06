import { Config } from '../../Config';
export default {
  moniteePersonnelRealAlarmModule: {
    text: '实时告警',
    code: 105800,
  },
  enterMoniteePersonnelRealAlarmModule: {
    text: '进入实时告警界面',
    code: 105899,
    parent: 105800,
    moduleName: 'MoniteeRealAlarm',
  },
  moniteeFaceAlarmModule: {
    text: '重点人员告警处理',
    code: 105200,
  },
  enterMoniteeFaceAlarmModule: {
    text: '进入重点人员布控告警处理界面',
    code: 105299,
    parent: 105200,
    moduleName: 'faceAlarm',
  },
  moniteeOutsidersAlarmModule: {
    text: '外来人员告警处理',
    code: 105900,
  },
  enterMoniteeOutsidersAlarmModule: {
    text: '进入外来人员布控告警处理界面',
    code: 105999,
    parent: 105900,
    moduleName: 'outsidersAlarm',
  },
  moniteeAIOAlarmModule: {
    text: '专网套件告警处理',
    code: 107200,
  },
  enterMoniteeAIOAlarmModule: {
    text: '进入专网套件布控告警处理界面',
    code: 107299,
    parent: 107200,
    moduleName: 'AIOAlarms',
  },
  moniteePhantomRealAlarmModule: {
    text: '事件提醒',
    code: 106400,
  },
  enterMoniteePhantomRealAlarmModule: {
    text: '进入事件提醒界面',
    code: 106499,
    parent: 106400,
    moduleName: 'PhantomCurrentAlarm',
  },
  moniteePhantomAlarmModule: {
    text: '魅影布防历史提醒',
    code: 106500,
  },
  enterMoniteePhantomAlarmModule: {
    text: '进入魅影布防历史提醒界面',
    code: 106599,
    parent: 106500,
    moduleName: 'PhantomAlarms',
  },
  list: {
    value: `${Config.api}alarm/selectHistoryAlarmResult`,
    label: '查询列表',
  },
  detail: {
    value: `${Config.api}alarm/selectHistoryAlarmResultDetail/:id`,
    label: '获取警情详情',
    logInfo: [
      {
        type: 'personnelRealAlarm',
        code: 105801,
        parent: 105800,
        text: '查看告警信息',
      },
      {
        type: 'faceAlarm',
        code: 105203,
        parent: 105200,
        text: '查看告警信息',
      },
      {
        type: 'outsidersAlarm',
        code: 105901,
        parent: 105900,
        text: '查看告警信息',
      },
      {
        type: 'AIOAlarm',
        code: 107201,
        parent: 107200,
        text: '查看告警信息',
      },
      {
        type: 'phantomRealAlarm',
        code: 106401,
        parent: 106400,
        text: '查看提醒信息',
      },
      {
        type: 'phantomAlarm',
        code: 106501,
        parent: 106500,
        text: '查看提醒信息',
      },
    ]
  },
  updateItem: {
    value: `${Config.api}alarm/saveHistoryAlarmResult`,
    label: '警情设置处理结果',
    logInfo: [
      {
        type: 'personnelRealAlarm',
        code: 105802,
        parent: 105800,
        text: '处理告警信息',
      },
      {
        type: 'faceAlarm',
        code: 105202,
        parent: 105200,
        text: '处理告警信息',
      },
      {
        type: 'outsidersAlarm',
        code: 105905,
        parent: 105900,
        text: '处理告警信息',
      },
      {
        type: 'phantomRealAlarm',
        code: 106405,
        parent: 106400,
        text: '处理提醒信息',
      },
      {
        type: 'phantomAlarm',
        code: 106505,
        parent: 106500,
        text: '处理提醒信息',
      },
    ]
  },
  getAlarmStatisticsByDay:{
    value:`${Config.api}alarmStatistics/countTotalAlarmsTrendForEveryType`,
    label:"获取最近七天报警数据"
  },
  getAlarmCount:{
    value:`${Config.api}alarmStatistics/countTotalAlarmsByLogType`,
    label:"各类型告警总数统计"
  },
  getTypeAlarm:{
    value:`${Config.api}alarmStatistics/countTotalAlarmsByHandleType`,
    label:'待处理,有效,无效警情数量展示'
  },
  getCaptureDetailInfoById:{
    value:`${Config.api}largeData/getCaptureDetailInfoById`,
    label:'根据人脸或人体id获取结构化信息'
  }
}