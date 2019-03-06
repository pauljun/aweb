import { action, observable } from 'mobx'
import BaselibService from '../../../service/BaselibService';
import KVService from '../../../service/KVService';

class BaselibStoreUtil {
  
  kvStoreKeyMap = {
    face: 'FACELIB_IMG_STYLE',
    body: 'BODYLIB_IMG_STYLE',
    vehicle: 'VEHICLELIB_IMG_STYLE',
  };

  @observable searchData = {}

  // 初始化store
  initData(searchData){
    this.initSearchData(searchData);
  }

  // 编辑搜索条件
  editSearchData(options){
    const searchData = Object.assign({}, this.searchData, options);
    return this.setData({ searchData })
  }

  /* 处理deviceId */
  getDeviceId(list) {
    return list.map(v => v.manufacturerDeviceId + '' || v.id + '');
  }

  // type: face, body, vehicle
  getList(type, options) {
    const searchData = this.handleSearchData(options);
    return BaselibService.getList(type, searchData)
  }

  // type: face, body
  getTotal(type) {
    const urlType = {
      face: 'faceListSize',
      body: 'bodyListSize',
    }
    let pageType = 0, maxId, minId;
    const oldSearchData = Object.assign({}, this.searchData, { pageType, maxId, minId })
    const searchData = this.handleSearchData(oldSearchData);
    return BaselibService.getListSize(urlType[type], searchData);
  }

  getImgStyle(type) {
    // 暂时不上大中小图功能，屏蔽此方法
    // const userId = GlobalStore.UserStore.userInfo.id;
    // return KVService.getKVStore(userId, this.kvStoreKeyMap[type]).then(imgStyle => {
    //   if(imgStyle) {
    //     this.setData({ imgStyle: ''+imgStyle })
    //   } 
    // })
  }

  setImgStyle(type, imgStyle) {
    const userId = GlobalStore.UserStore.userInfo.id;
    return KVService.setKVStore(userId, this.kvStoreKeyMap[type], imgStyle).then((res) => {
      this.setData({ imgStyle })
      return res
    })
  }

  @action
  setData(json) {
    for (var k in json) {
      this[k] = json[k]
    }
    return Promise.resolve()
  }
}

export default BaselibStoreUtil
