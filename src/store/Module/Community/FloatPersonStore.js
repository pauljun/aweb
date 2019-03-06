import { observable, action } from 'mobx';
import { Promise } from 'core-js';
import CommunityService from '../../../service/Community/CommunityService';
let Floatsearch = {
  villageIds: [],
  fuzzyContent: '',
  peroidType: 0,
  page: 1,
  pageSize: 24,
  startTime: undefined,
  endTime: undefined,
  sortType: 0,
  faceFeature: '',
  floatingPeopleType: 0,
  focusType:null,
  tagCodes:[]
};
let FloatsearchAppear = {
  villageIds: [],
  fuzzyContent: '',
  peroidType: 0,
  page: 1,
  pageSize: 24,
  faceFeature: '',
  startTime: undefined,
  endTime: undefined,
  sortType: 0,
  floatingPeopleType: 1,
  focusType:null,
  tagCodes:[]
};
class FloatPersonStore {
  /**搜索条件 */
  @observable
  FloatsearchOption = Floatsearch;
  @observable
  FloatsearchOptionUnappear = FloatsearchAppear;
  @observable imgurl = '';
  @observable imgurlA = '';
  @observable val = '';
  @observable valA = '';
  @action
  editSearchData(options, key) {
    return new Promise(resolve => {
      if (key == 1) {
        let params = Object.assign({}, this.FloatsearchOption, options);
        this.FloatsearchOption = params;
      } else {
        let params = Object.assign({}, this.FloatsearchOptionUnappear, options);
        this.FloatsearchOptionUnappear = params;
      }
      resolve();
    });
  }
  /**初始化查询条件 */
  @action
  initSearchData(key) {
    if (key == 1) {
      this.FloatsearchOption = Floatsearch;
    } else {
      this.FloatsearchOptionUnappear = FloatsearchAppear;
    }
  }
  @action
  editImgUrl(url, activeKey) {
    if (activeKey == 1) {
      this.imgurl = url;
    } else {
      this.imgurlA = url;
    }
  }
  @action
  editVal(val, activeKey) {
    if (activeKey == 1) {
      this.val = val;
      this.FloatsearchOption.fuzzyContent = val;
    } else {
      this.valA = val;
      this.FloatsearchOptionUnappear.fuzzyContent = val;
    }
  }
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
  // 流动人口列表查询
  getListFlowFace(option) {
    return CommunityService.getListFlowFace(option).then(res => {
      return res.result ? res.result : {};
    });
  }
  // 流动人口近七日抓拍数（小区维度）
  getCountSnappingTimesForVidByVillage(option) {
    return CommunityService.getCountSnappingTimesForVidByVillage(option);
  }
  // 流动人口分类统计图
  getCountVidTypeByVillageIds(option) {
    return CommunityService.getCountVidTypeByVillageIds(option);
  }
}

export default new FloatPersonStore();
