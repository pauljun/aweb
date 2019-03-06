import { Config } from '../Config';
const { api } = Config;
export default {
  soldierModule: {
    code: 105500,
    text: '单兵管理'
  },
  enterSoldierModule: {
    text: '进入单兵管理界面',
    code: 105599,
    parent: 105500,
    moduleName: 'SoldierView',
  },
  LIST: {
    value: `${api}device/searchSolosDeviceListByOperationId`,
    label: '单兵列表'
  },
  ADD: {
    value: `${api}device/registerSolosCamera`,
    label: '新增单兵',
    logInfo: [{
      code: 105501,
      parent: 105500,
      text: '新增单兵'
    }]
  },
  BIND: {
    value: `${api}device/bindUserSolosDevice`,
    label: '绑定单兵',
    logInfo: [{
      code: 105503,
      parent: 105500,
      text: '绑定单兵'
    }]
  },
  REMOVEBIND: {
    value: `${api}device/removeBindUserSolosDevice`,
    label: '解绑单兵',
    logInfo: [{
      code: 105504,
      parent: 105500,
      text: '解绑单兵'
    }]
  }
};
