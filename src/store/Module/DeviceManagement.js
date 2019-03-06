import { observable, action } from 'mobx';
import Service from '../../service/DeviceService';
import _ from 'lodash';
import { DeviceAndMjType } from '../../libs/DeviceLib';

export const ModelData = {
  page: 1,
  pageSize: 10,
  lygroupId: '-1',
  isHadChild: false,
  deviceName: '',
  sn: '',
  hadLocation: '-1',
  deviceData: '-1',
  deviceTypes: '-1',
  manufacturerDeviceId: '',
  orgSearchType: '1'
};

class DeviceManagementStore {
  @observable
  activeKey = [];

  @observable
  searchData = ModelData;

  @action
  initData() {
    this.activeKey = [];
    this.initSearchForm()
  }

  @action
  initSearchForm(){
    this.searchData = ModelData;
  }

  @action
  mergeSearchData(data) {
    this.searchData = Object.assign(this.searchData, { ...data });
  }

  /**获取羚羊云分组 */
  getLingyangOrgs() {
    return Service.getLingyangOrgs().then(res => {
      return [].concat([{ id: '-1', name: '全部分组' }], res.result.groups);
    });
  }

  /**
   * 分配设备到组织
   * @param {Object} data
   */
  updateDeviceOrg(data) {
    return Service.updateDeviceOrg(data);
  }

  updateDeviceGeo(data){
    return Service.updateDeviceGeo(data)
  }
  /**列表查询 */
  getList(orgIds) {
    let searchData = this.searchData;
    _.forIn(searchData, (value, key) => {
      if (!value || value === '-1') {
        searchData = _.omit(searchData, [key]);
      }
    });
    if (orgIds.length) {
      searchData.orgIds = orgIds;
    } else {
      searchData.orgIds = this.activeKey;
    }
    if(searchData.deviceTypes){
      searchData.deviceTypes = searchData.deviceTypes.split(',')
    }else{
      let deviceTypes = []
      DeviceAndMjType.filter(v => v.value !== '-1').map(v => {
        deviceTypes = deviceTypes.concat(v.value.split(','))
        return v
      })
      searchData.deviceTypes = deviceTypes
    }
    
    return Service.getCameraListByOrgs(searchData);
  }

  @action
  setData(json) {
    for (var k in json) {
      if (this.hasOwnProperty(k)) {
        this[k] = json[k];
      }
    }
  }
  getCameraInfoByDeviceId(id) {
    return Service.getDeviceVo(id);
  }
}

export default new DeviceManagementStore();
