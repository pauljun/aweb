import { Config } from '../Config';

export default {
  jurModule: {
    text: '辖区总览',
    code: 107100,
  },
  EnterJurModule: {
    text: '进入辖区总览界面',
    code: 107199,
    parent: 107100,
    moduleName: 'Panel'
  },
  JUR_RESOURCESSTATIS: {
    value: `${Config.api}statistics/getResourcesStatis`,
    label: '资源统计'
  },
  JUR_RESOURCESTRENDSTATIS: {
    value: `${Config.api}statistics/getResourcesTrendStatis`,
    label: '资源趋势统计'
  },
  JUR_DAYRESOURCESSTATIS: {
    value: `${Config.api}statistics/getDayResouecesStatis`,
    label: '近24小时资源统计'
  },
  JUR_DEVICESTATESTATIS: {
    value: `${Config.api}statistics/getDeviceStateStatis`,
    label: '近24小时设备在线统计'
  },
  JUR_CONTROLSTATIS: {
    value: `${Config.api}statistics/getControlStatistics`,
    label: '布控库统计'
  },
  JUR_ALARMSUMMARYSTATIS: {
    value: `${Config.api}alarmStatistics/countTotalAlarmsByHandleType`,
    label: '警情统计'
  },
  JUR_ALARMBYDAYSTATIS: {
    value: `${Config.api}statistics/getAlarmStatisticsByDay`,
    label: '报警数'
  },
  JUR_EAPSTATIS: {
    value: `${Config.api}statistics/countEffectiveAlarmsPlaceByCondition`,
    label: '场所有效报警书Top5'
  },
  JUR_STORAGE: {
    value: `${Config.api}statistics/getStorageInfo`,
    babel: '存储'
  },
  JUR_FLOW: {
    value: `${Config.api}statistics/realTimeStatisticsOfEquipmentStatus`,
    babel: '流量'
  },
  SET_CARD: {
    value: `${Config.api}userKvStore/setUserKvStore`,
    label: '设置卡片位置'
  },
  GET_CARD: {
    value: `${Config.api}userKvStore/getUserKvStore`,
    label: '获取卡片位置'
  },
  JUR_COUNT: {
    value: `${Config.api}device/countOrgDevice`,
    label: '查询当前用户所有设备在线离线设备数量'
  },
  JUR_TYPE_COUNT: {
    value: `${Config.api}device/countDeviceByType`,
    label: '设备类型统计'
  }
}