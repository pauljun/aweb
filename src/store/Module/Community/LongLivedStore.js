import { observable, action } from 'mobx';
import { Promise } from 'core-js';
import CommunityService from '../../../service/Community/CommunityService';
let LongSearchOption = {
  villageIds: [],
  tagCodes: [],
  fuzzyContent: '',
  faceFeature: '',
  page: 1,
  pageSize: 24,
  collectionType: 1,
  peroidType:0,
  startTime:undefined,
  endTime:undefined,
  sortType:0,
  focusType:null
};
let LongSearchOptionUppear = {
  villageIds: [],
  tagCodes: [],
  fuzzyContent: '',
  faceFeature: '',
  page: 1,
  pageSize: 24,
  collectionType: 0,
  peroidType:0,
  startTime:undefined,
  endTime:undefined,
  sortType:2,
  focusType:null
};
class LongLivedStore {
  /**搜索条件 */
  @observable
  searchOption = LongSearchOption;
  @observable
  searchOptionUnappear = LongSearchOptionUppear;
  @observable imgurl = '';
  @observable imgurlA = '';
  @observable val = '';
  @observable valA = '';

  /**处理和改变查询条件 */
  @action
  editSearchData(options, key) {
    return new Promise(resolve => {
      if (key == 1) {
        let params = Object.assign({}, this.searchOption, options);
        this.searchOption = params;
      } else {
        let params = Object.assign({}, this.searchOptionUnappear, options);
        this.searchOptionUnappear = params;
      }
      resolve();
    });
  }
  @action
  editImgUrl(url, activeKey) {
    if (activeKey == 1) {
      this.imgurl = url;
    } else {
      this.imgurlA = url;
    }
  }
  /**获取输入内容 */
  @action
  editVal(val, activeKey) {
    if (activeKey == 1) {
      this.val = val;
      this.searchOption.fuzzyContent = val;
    } else {
      this.valA = val;
      this.searchOptionUnappear.fuzzyContent = val;
    }
  }
  /**删除对应的图片和输入内容 */
  @action
  deleteImgAndVal(activeKey, type) {
    if (activeKey == 1) {
      if (type == 1) {
        this.imgurl = '';
        this.val = '';
      } else {
        this.imgurl = '';
      }
    } else {
      if (type == 1) {
        this.imgurlA = '';
        this.valA = '';
      } else {
        this.imgurlA = '';
      }
    }
  }
  /**初始化数据 */
  @action
  initImgandVal() {
    this.imgurl = '';
    this.val = '';
    this.imgurlA = '';
    this.valA = '';
  }
  /**初始化查询条件 */
  @action
  initSearchData(key) {
    if (key == 1) {
      this.searchOption = LongSearchOption;
    } else {
      this.searchOptionUnappear = LongSearchOptionUppear;
    }
  }
  /**查询常住用户列表 */
  getListPersonalInformation(option) {
    return CommunityService.getListPersonalInformation(option).then(res => {
      return res.result ? res.result : [];
    });
  }
  //常住人口抓拍数（小区维度）
  getcountPeopleByVillage(option) {
    return CommunityService.getcountPeopleByVillage(option);
  }
  //常住人口分类统计图
  getCountPeopleTypeByVillageIds(option) {
    return CommunityService.getCountPeopleTypeByVillageIds(option);
  }
}

export default new LongLivedStore();
