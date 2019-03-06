import { httpRequest } from '../utils/HttpUtil';
import { KV_STORE } from './RequestUrl';
import * as _ from 'lodash';

@httpRequest
class KVService {
  getKVStore(userId, storeKey) {
    return this.$httpRequest({
      url: KV_STORE.GET_DATA.value,
      method: 'POST',
      data: {
        storeKey,
        userId
      }
    }).then(result => {
      let data = {};
      try {
        data = JSON.parse(result.result.userKvStroe.storeValue);
      } catch (e) {
        console.warn('格式话用户分组数据失败！');
      }
      return data;
    });
  }
  setKVStore(userId, storeKey, storeValue, logName) {
    let options = {
      userId,
      storeKey,
      storeValue
    };
    let bodyStr = '';
    for (var k in options) {
      bodyStr += `&${k}=${
        _.isObject(options[k]) ? JSON.stringify(options[k]) : options[k]
      }`;
    }
    bodyStr = bodyStr.substring(1);
    let logInfo =
      logName && logName === 'Panel' ? { ...KV_STORE.PANEL_CODE } : null;
    return this.$httpRequest({
      url: KV_STORE.SET_DATA.value,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: 'POST',
      data: bodyStr,
      logInfo
    });
  }
  setKVStoreNew(userId, storeKey, storeValue, logName) {
    let logInfo =
      logName && logName === 'Panel' ? { ...KV_STORE.PANEL_CODE } : null;
    return this.$httpRequest({
      url: KV_STORE.SET_DATA_NEW.value,
      method: 'POST',
      data: {
        userId,
        storeKey,
        storeValue: JSON.stringify(storeValue),
      },
      logInfo
    });
  }
}

export default new KVService();
