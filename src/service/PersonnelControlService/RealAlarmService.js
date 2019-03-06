import { httpRequest } from '../../utils/HttpUtil';
import { getCacheItem } from '../../utils';
import { ALARM } from '../RequestUrl';
import { message } from 'antd'
@httpRequest
class RealAlarmService {
  /**获取七天报警统计数据 */
getSevenStatistic(data){
  return this.$httpRequest({
    url: ALARM.getAlarmStatisticsByDay.value,
    method: 'POST',
    data
  }).then(res => {
    if (res && res.code === 200) {
      return res
    } else {
      message.error(res.message)
      return Promise.reject(res)
    }
  })
}  
 getDataAllCount(){
   return this.$httpRequest({
     url:ALARM.getAlarmCount.value,
     method:'POST'
   }).then(res => {
     if (res&&res.code ===200){
       return res
     } else {
      return Promise.reject(res)
     }
   })
 }
getTypeStaticCount(data){
  return this.$httpRequest({
    url:ALARM.getTypeAlarm.value,
    method:'POST',
    data
  }).then(res => {
    if (res&&res.code ===200){
      return res
    } else {
     return Promise.reject(res)
    }
  })
}
}

export default new RealAlarmService();