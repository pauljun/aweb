import { observable } from 'mobx';
import BaselibStoreUtil from './BaselibStoreUtil';
import _ from 'lodash';
let geoAddressArray = ['102401', '102402', '102403', '102404', '102405', '102406', '102407', '102408', '102409']
   
const initSearch = {
  pageSize: 24,
  currentPage: 1,
  startTime: null,
  endTime: null,
  cameraIds: [],
  sex:null,
  geoAddress: null,
  upColor: null,
  lowerColor: null,
  head: null,
  goods: null,
  upperTexture: null,
  lowerTexture: null,
  nation: null,
  maxId: null, // 上一页时取list第一个id
  minId: null, // 下一页时取list最后一个id
  pageType: 0, // 0:首次进入（需要请求total）, 1:上一页,  2:下一页
  // confidence:0, // 置信度，废弃
  // timeType: 3, // 废弃
  // maxCaptureTime:'', // 废弃
  // minCaptureTime:'', // 废弃
}

class bodyStore extends BaselibStoreUtil {

  @observable searchData = initSearch

  @observable imgStyle='2'

  // 初始化搜索条件
  initSearchData(searchData={}){
    return this.setData({
      searchData:  Object.assign({}, initSearch, searchData)
    })
  }

  handleSearchData(options) {
    const data = options || this.searchData
    const {
      pageSize,
      currentPage,
      endTime,
      startTime,
      cameraIds,
      sex,
      geoAddress,
      upColor,
      lowerColor,
      head,
      goods,
      upperTexture,
      lowerTexture,
      nation,
      maxId, 
      minId, 
      pageType, 
    } = data;
    
    let bodyTags = [], cameraTags=[], noCameraTags = [];
    if (head) { bodyTags.push(head) }
    if (goods) { bodyTags.push(goods) }
    if (sex) { bodyTags.push(sex) }
    if (upColor) { bodyTags.push(upColor) }
    if (lowerColor) { bodyTags.push(lowerColor) }
    if (upperTexture) { bodyTags.push(upperTexture) }
    if (lowerTexture) { bodyTags.push(lowerTexture) }
    if (nation) { bodyTags.push(nation) }
    if (geoAddress) { 
      // cameraTags.push(geoAddress)
      // cameraTags = geoAddress 
      // 判断是否有其他
      if(~geoAddress.indexOf('102409')){
        // 存在其他
        noCameraTags = _.difference(geoAddressArray, geoAddress)
      }else{
        cameraTags = geoAddress
      }
     } 
    
    return {
      pageSize,
      currentPage,
      endTime,
      startTime,
      cameraIds: cameraIds.length ? this.getDeviceId(cameraIds) : undefined,
      cameraTags: cameraTags.length ? cameraTags : undefined,
      noCameraTags: noCameraTags.length ? noCameraTags : undefined,
      bodyTags: bodyTags.length ? bodyTags : undefined,
      pageType,
      maxId, 
      minId,
    }
  }
}

export default new bodyStore()
