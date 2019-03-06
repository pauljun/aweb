import { observable, action } from 'mobx'
import moment from 'moment'
import Service from '../../../service/BaselibService';
import KVService from '../../../service/KVService';


const initSearch = {
  current: 1,
  pageSize: 24,
  cameraIds: [],
  score: 85,
  endTime: new Date().valueOf(),
  startTime: new Date(moment().subtract(3, 'd')).valueOf(),
  url: '',
  sex: null,
  type: 'face',
  id: null,
  feature: [],
  searchOrigin: '', // 搜索源头及类型：日志参数，1：图库，2：上传 
}
const searchOriginDict = {
  1: '图库',
  2: '上传',
}
class imgSearchStore {

  @observable searchData = initSearch;

  @observable imgStyle='2'

  // 初始化搜索条件
  initSearchData(searchData = {}) {
    return this.setData({
      searchData: Object.assign({}, initSearch, searchData)
    })
  }

  // 初始化store
  initData(searchData = {}) {
    searchData = Object.assign({}, {
      endTime: new Date().valueOf(),
      startTime: new Date(moment().subtract(3, 'd')).valueOf(),
    }, searchData)
    this.initSearchData(searchData);
  }

  /**编辑搜索条件 */
  editSearchData(options = {}) {
    const searchData = Object.assign({}, this.searchData, options)
    return this.setData({ searchData })
  }

  /* 处理deviceId */
  getDeviceId(list) {
    return list.map(v => v.manufacturerDeviceId + '' || v.id + '');
  }

  // 通过人体 id 查询人体特征
  async getBodyFeatureById(id) {
    const { feature, url } = await Service.getBodyFeatruByEntity({ id });
    this.editSearchData({ feature, url, id, searchOrigin: 1 });
    return Promise.resolve(feature)
  }

  // 通过人体 Url 查询人体特征
  async getBodyFeatureByUrl(url) {
    this.editSearchData({ url })
    const { feature, id } = await Service.getBodyFeture({ url });
    this.editSearchData({ feature, id, searchOrigin: 2 })
    return Promise.resolve(feature)
  }

  // 通过人脸 id 查询人脸特征
  async getFaceFeatureById(id) {
    let { feature, url } = await Service.getFaceFeatureById(id)
    this.editSearchData({ feature, id, url, searchOrigin: 1 })
    return Promise.resolve(feature)
  }
  
  // 通过人脸 Url 查询人脸特征
  async getFaceFeatureByUrl(url) {
    this.editSearchData({ url })
    const { feature, id } = await Service.getFaceFeatureByUrl({ url })
    this.editSearchData({ feature, id, searchOrigin: 2 })
    return Promise.resolve(feature)
  }

  // 增加查询人脸详细字段的方法
  async getFaceInfoList(id, dbSource) {
    let res = await Service.getFaceFeatureById(id, dbSource)
    return res
  }

  // 搜索
  getImgSearchList() {
    const { sex, startTime, endTime, cameraIds, score, id, feature, type, url, searchOrigin } = this.searchData;
    const options = {
      startTime,
      endTime,
      score,
      id,
      cameraIds: cameraIds.length ? this.getDeviceId(cameraIds) : undefined,
      [`${type}Tags`]: sex ? [sex] : undefined,
      [`${type}Feature`]: feature
    }
    const searchType = searchOriginDict[searchOrigin];
    const logData = {
      url,
      searchType
    };
    return Service.getFeatureList(type, options, logData)
  }

  kvStoreKey = 'LIB_IMG_SEARCH_STYLE'

  getImgStyle() {
    // const userId = GlobalStore.UserStore.userInfo.id;
    // return KVService.getKVStore(userId, this.kvStoreKey).then(imgStyle => {
    //   if(imgStyle) {
    //     this.setData({ imgStyle: ''+imgStyle })
    //   } 
    // })
  }

  setImgStyle(imgStyle) {
    const userId = GlobalStore.UserStore.userInfo.id;
    return KVService.setKVStore(userId, this.kvStoreKey, imgStyle).then((res) => {
      this.setData({ imgStyle })
      return res
    })
  }

  @action
  setData(json) {
    for (var k in json) {
      if (this[k]) {
        this[k] = json[k]
      }
    }
    return Promise.resolve()
  }
}

export default new imgSearchStore()
