import {observable } from 'mobx'
import BaselibStoreUtil from './BaselibStoreUtil';
import _ from 'lodash';
let geoAddressArray = ['102401', '102402', '102403', '102404', '102405', '102406', '102407', '102408', '102409']

const initSearch = {
  pageSize: 24,
  currentPage:1,
  startTime: null,
  endTime: null,
  cameraIds:[],
  sex:null,  
  geoAddress: null,
  eyeGlass:null,
  maxId:null,
  minId:null,
  pageType: 0 
}

class FaceStore extends BaselibStoreUtil {

  @observable searchData = initSearch

  @observable imgStyle='2'
  
  // 初始化搜索条件
  initSearchData(searchData={}){
    return this.setData({
      searchData:  Object.assign({}, initSearch, searchData)
    })
  }

  handleSearchData(options) {
    const data = options || this.searchData;
    const {
      pageSize,
      currentPage,
      startTime,
      endTime,
      cameraIds,
      sex,  
      geoAddress,
      eyeGlass,
      maxId,
      minId,
      pageType,
    } = data;

    let faceTags = [], cameraTags = [], emptyTags = [], noCameraTags = [];
    if(sex){ faceTags.push(sex) }
    if (geoAddress){ 
      //cameraTags.push(geoAddress) 
      //cameraTags = geoAddress 
      // 判断是否有其他
      if(~geoAddress.indexOf('102409')){
        // 存在其他
        noCameraTags = _.difference(geoAddressArray, geoAddress)
      }else{
        cameraTags = geoAddress
      }
    }
    if (eyeGlass) {
      const EyeGlass = parseFloat(eyeGlass)
      if (EyeGlass > 0){
        faceTags.push(EyeGlass)
      }else{
        emptyTags.push(Math.abs(EyeGlass))
      }
    }

    console.log(new Date(startTime), new Date(endTime))
    
    return {
      pageSize,
      currentPage,
      endTime,
      startTime,
      cameraIds: cameraIds.length ? this.getDeviceId(cameraIds) : undefined,
      cameraTags: cameraTags.length ? cameraTags : undefined,
      noCameraTags: noCameraTags.length ? noCameraTags : undefined,
      faceTags: faceTags.length ? faceTags : undefined,
      emptyTags: emptyTags.length ? emptyTags : undefined,
      pageType,
      maxId, 
      minId,
    }
  }
}

export default new FaceStore()