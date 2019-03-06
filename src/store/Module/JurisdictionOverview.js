import { observable, action,message } from 'mobx'
import JurService from '../../service/JurService'

class JurisdictionOverviewStore {
  //卡片位置
  @observable 
  showTypeData = {
    left1: '1',
    left2: '2',
    right1: '3',
    right2: '5'
  }
  @observable userId = null

  @action
  setUserId(userId) {
    this.userId = userId
  }
  @action
  async getShowTypeData() {
    let res = await JurService.getCard(this.userId)
    let data = res.result && res.result.userKvStroe && res.result.userKvStroe.storeValue;
    if (!data) {
      this.setShowTypeData({
        left1: '1',
        left2: '2',
        right1: '3',
        right2: '5'
      })
    } else {
      try {
        this.setShowTypeData(JSON.parse(res.result.userKvStroe.storeValue))
      } catch (e) {
        console.log('JOSN format error', e)
        
      }
    }
    return null
  }

  @action
  setShowTypeData(result) {
    this.showTypeData = result
  }
  
  setShowType(data) {
    return JurService.setCard(this.userId,data).then(res => {
      this.setShowTypeData(res.result.userKvStroe.storeValue)
    })
  }
  getResourcesStatis(data) {
    return JurService.getResourcesStatis(data).then(res => {
      if (res.code !== 200) {
        message.error(res.message);
        return Promise.reject(res);
    }
    return res;
    });
  }

  getResourcesTrendStatis(data) {
    return JurService.getResourcesTrendStatis(data).then(res => {
      if (res.code !== 200) {
        message.error(res.message);
        return Promise.reject(res);
    }
    return res;
    });
  }

  getDayResouecesStatis(data) {
    return JurService.getDayResouecesStatis(data).then(res => {
      if (res.code !== 200) {
        message.error(res.message);
        return Promise.reject(res);
    }
    return res;
    });
  }

  getDeviceStateStatis(data) {
    return JurService.getDeviceStateStatis(data).then(res => {
      if (res.code !== 200) {
        message.error(res.message);
        return Promise.reject(res);
    }
    return res;
    });
  }

  getControlStatistics() {
    return JurService.getControlStatistics().then(res => {
      if (res.code !== 200) {
        message.error(res.message);
        return Promise.reject(res);
    }
    return res;
    });
  }

  getAlarmSummaryStatistics(data) {
    return JurService.getAlarmSummaryStatistics(data).then(res => {
      if (res.code !== 200) {
        message.error(res.message);
        return Promise.reject(res);
    }
    return res;
    });
  }

  getStorage() {
    return JurService.getStorage().then(res => {
      if (res.code !== 200) {
        message.error(res.message);
        return Promise.reject(res);
    }
    return res;
    });
  }

  getFlow() {
    return JurService.getFlow().then(res => {
      if (res.code !== 200) {
        message.error(res.message);
        return Promise.reject(res);
    }
    return res;
    });
  }


  getAlarmStatisticsByDay(data) {
    return JurService.getAlarmStatisticsByDay(data).then(res => {
      if (res.code !== 200) {
        message.error(res.message);
        return Promise.reject(res);
    }
    return res;
    });
  }

  getEffectiveAlarmPlaceStatistics(data) {
    return JurService.getEffectiveAlarmPlaceStatistics(data).then(res => {
      if (res.code !== 200) {
        message.error(res.message);
        return Promise.reject(res);
    }
    return res;
    });
  }
  getDeviceCount() {
    return JurService.getDeviceCount().then(res => {
      if (res.code !== 200) {
        message.error(res.message);
        return Promise.reject(res);
    }
    return res;
    });
  }
  getDeviceTypeCount(data) {
    return JurService.getDeviceTypeCount(data).then(res => {
      if (res.code !== 200) {
        message.error(res.message);
        return Promise.reject(res);
    }
    return res;
    });
  }
}

export default new JurisdictionOverviewStore();
