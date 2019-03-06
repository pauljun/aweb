
import { LOGGER } from '../../service/RequestUrl';
import { httpRequest } from '../../utils/HttpUtil';

@httpRequest
export default class Logger {
  /* 
    保存日志
  */
  save(options) {
    const description = options.description;
    return this.$httpRequest({
      url: LOGGER.SAVE.value,
      method: 'POST',
      data: {
        function: options.code,
        module: options.parent,
        description
      }
    });
  }
}