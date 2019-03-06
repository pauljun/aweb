import { httpRequest } from '../../utils/HttpUtil';
import { ALARM, LIBS } from '../RequestUrl';
import { message } from 'antd';

const alarmType = {
  1: 'faceAlarm', // 重点人员告警
  2: 'outsidersAlarm', // 外来人员告警
  3: 'phantomAlarm', // 魅影历史提醒
  4: 'AIOAlarm', // 专网套件告警
  5: 'personnelRealAlarm', // 实时告警
  6: 'phantomRealAlarm', // 魅影实时提醒
}
@httpRequest
class LibsService {
  /**获取警情列表 */
  getList(data) {
    return this.$httpRequest({
      url: ALARM.list.value,
      method: 'post',
      data,
    }).then(res => {
      if (res && res.code === 200) {
        return res.result
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    })
  }

  /**根据id获取警情详情*/
  getDetail({ id, libType, isRealAlarm }) {
    let logType = libType;
    if(isRealAlarm) {
      logType = libType !== 3 ? 5 : 6;
    }
    let description = '';
    switch(+libType) {
      case 1:
        description = `查看重点人员布控告警信息, 信息ID：${id}`;
      break; 
      case 2:
        description = `查看外来人员布控告警信息, 信息ID：${id}`;
      break; 
      case 3:
        description = `查看魅影布防事件提醒信息, 信息ID：${id}`;
      break; 
      case 4:
        description = `查看专网套件布控告警信息, 信息ID：${id}`;
      break;
      default: break; 
    }
    const logInfo = {
      description,
      ...ALARM.detail.logInfo.find(v => v.type === alarmType[logType])
    }
    return this.$httpRequest({
      url: ALARM.detail.value.replace(':id', id),
      method: 'get',
      logInfo,
    }).then(res => {
      if (res && res.code === 200) {
        return res.result
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    })
  }
  getMoniteeLibsList(data) {
    return this.$httpRequest({
      url: LIBS.list.value,
      method: 'post',
      data,
    }).then(res => {
      if (res && res.code === 200) {
        return res.result
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    })
  }
  /**警情处理 */
  updateItem = (data, logData={}) => {
    let logType = logData.libType;
    if(logData.isRealAlarm) {
      logType = logData.libType !== 3 ? 5 : 6;
    }
    let description = '';
    const isEffective = data.isEffective ? '有效' : '无效';

    switch(logData.libType) {
      case 1:
        description = `标记重点人员布控告警为【${isEffective}】, 信息ID：${data.id}`;
      break; 
      case 2:
        description = `标记外来人员布控告警为【${isEffective}】, 信息ID：${data.id}`;
      break; 
      case 3:
        description = `标记魅影布防事件提醒为【${isEffective}】, 信息ID：${data.id}`;
      break;
      default: break; 
    }
    const logInfo = {
      description,
      ...ALARM.updateItem.logInfo.find(v => v.type === alarmType[logType])
    }
    return this.$httpRequest({
      url: ALARM.updateItem.value,
      method: 'post',
      data,
      logInfo
    }).then(res => {
      if (res && res.code === 200) {
        return res.result
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    })
  }

  //根据人脸或人体id获取结构化信息
  getCaptureDetailInfoById(data) {
    return this.$httpRequest({
      url: ALARM.getCaptureDetailInfoById.value,
      method: 'post',
      data,
    }).then(res => {
      if (res && res.code === 200) {
        return res.result
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    })
  }
}
export default new LibsService();
