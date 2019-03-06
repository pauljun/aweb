import { httpRequest } from '../utils/HttpUtil';
import { LOGGER } from './RequestUrl';

@httpRequest
class LoggerService {
  /**
   * 日志查询
   * @param {Object} options
   */
  searchLoggerList(options){
    return this.$httpRequest({
      url: LOGGER.SEARCH.value,
      method: 'POST',
      data:options,
    })
  }
}

export default new LoggerService();