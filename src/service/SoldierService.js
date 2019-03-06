import { httpRequest } from '../utils/HttpUtil';
import { SOLDIER } from './RequestUrl';
import { message } from 'antd'

@httpRequest
class SoldierService {
  getList(options){
    return this.$httpRequest({
      url: SOLDIER.LIST.value,
      method: 'post',
      data: options
    }).catch(() => {})
  }

  add(options){
    let logInfo = {
      description: `新增【${options.deviceName}】单兵`, 
      ...SOLDIER.ADD.logInfo[0]
    }
    return this.$httpRequest({
      url: SOLDIER.ADD.value,
      method: 'post',
      data: options,
      logInfo,
    }).catch(() => {})
  }

  bind(options, logInfoObj){
    let logInfo = {
      description: `绑定单兵【${logInfoObj.soldierName}】到用户【${logInfoObj.loginName}】`, 
      ...SOLDIER.BIND.logInfo[0]
    }
    return this.$httpRequest({
      url: SOLDIER.BIND.value,
      method: 'post',
      data: options,
      logInfo,
    }).catch(() => {})
  }
  removeBindSoldier(options, logInfoObj = {}) {
    let logInfo = {
      description: `解绑用户【${logInfoObj.loginName}】的单兵【${logInfoObj.soldierName}】`, 
      ...SOLDIER.REMOVEBIND.logInfo[0]
    }
    return this.$httpRequest({
      url: SOLDIER.REMOVEBIND.value,
      method: 'POST',
      data: options,
      logInfo,
    }).catch(() => {})
  }
}

export default new SoldierService()