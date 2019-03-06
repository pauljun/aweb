import { httpRequest } from '../utils/HttpUtil';
import { JUR } from './RequestUrl';
import * as _ from 'lodash';

@httpRequest
class JurService {
  KEY = 'HOME_CARD';
  //关联home页 卡片位置及顺序
  getCard(id) {
    return this.$httpRequest({
      url: JUR.GET_CARD.value,
      method: 'post',
      data: {
        userId: id,
        storeKey: this.KEY
      }
    });
  }
  setCard(id, item) {
    let options = {
      userId: id,
      storeKey: this.KEY,
      storeValue: item
    };
    let bodyStr = '';
    for (var k in options) {
      bodyStr += `&${k}=${
        _.isObject(options[k]) ? JSON.stringify(options[k]) : options[k]
      }`;
    }
    bodyStr = bodyStr.substring(1);
    return this.$httpRequest({
      url: JUR.SET_CARD.value,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      method: 'post',
      data: bodyStr
    });
  }

  getResourcesStatis(data) {
    return this.$httpRequest({
      url: JUR.JUR_RESOURCESSTATIS.value,
      method: 'post',
      data
    });
  }
  getResourcesTrendStatis(data) {
    return this.$httpRequest({
      url: JUR.JUR_RESOURCESTRENDSTATIS.value,
      method: 'post',
      data
    });
  }
  getDayResouecesStatis(data) {
    return this.$httpRequest({
      url: JUR.JUR_DAYRESOURCESSTATIS.value,
      method: 'post',
      data
    });
  }
  getDeviceStateStatis(data) {
    return this.$httpRequest({
      url: JUR.JUR_DEVICESTATESTATIS.value,
      method: 'post',
      data
    });
  }
  getStorage(data) {
    return this.$httpRequest({
      url: JUR.JUR_STORAGE.value,
      method: 'get',
      data
    });
  }
  getFlow(data) {
    return this.$httpRequest({
      url: JUR.JUR_FLOW.value,
      method: 'get',
      data
    });
  }
  getControlStatistics() {
    return this.$httpRequest({
      url: JUR.JUR_CONTROLSTATIS.value,
      method: 'get'
    });
  }
  getAlarmSummaryStatistics(data) {
    return this.$httpRequest({
      url: JUR.JUR_ALARMSUMMARYSTATIS.value,
      method: 'post',
      data
    });
  }
  getAlarmStatisticsByDay(data) {
    return this.$httpRequest({
      url: JUR.JUR_ALARMBYDAYSTATIS.value,
      method: 'post',
      data
    });
  }
  getEffectiveAlarmPlaceStatistics(data) {
    return this.$httpRequest({
      url: JUR.JUR_EAPSTATIS.value,
      method: 'post',
      data
    });
  }
  getDeviceCount(data) {
    return this.$httpRequest({
      url: JUR.JUR_COUNT.value,
      method: 'post',
      data: data
    });
  }
  getDeviceTypeCount(data) {
    return this.$httpRequest({
      url: JUR.JUR_TYPE_COUNT.value,
      method: 'post',
      data
    });
  }
}

export default new JurService();
