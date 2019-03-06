import { httpRequest } from '../utils/HttpUtil';
import { STATISTIC } from './RequestUrl';
import { message } from 'antd'

@httpRequest
class StatisticStore {
  getList(options) {
    return this.$httpRequest({
      url: STATISTIC.GETLOGSTATISTICS.value,
      method: 'post',
      data: options
    })
  }
  //导出
  exportStatisticsLog(options){
    return this.$httpRequest({
      url: STATISTIC.EXPORTSTATISTICSLOG.value,
      method: 'get',
      data: options
    })
  }
}
export default new StatisticStore()