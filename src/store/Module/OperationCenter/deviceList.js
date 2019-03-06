import { observable, action } from 'mobx';
import Service from 'src/service/DeviceService';

class OperationCenterDeviceListStore {
  @observable
  searchData = {
    deviceName: '',
    page: 1,
    pageSize: 10
  };

  @action
  initData() {
    this.searchData = {
      deviceName: '',
      page: 1,
      pageSize: 10
    };
  }

  @action
  mergeSearchData(data) {
    this.searchData = Object.assign(this.searchData, { ...data });
  }

  getList(id) {
    let searchData = this.searchData;
    searchData.operationCenterIds = [id];
    return Service.getCameraListByOcId(searchData);
  }

  /**
   * 分配设备
   */
  updateDeviceOcId(params) {
    return Service.updateDeviceOcId(params);
  }
}

export default new OperationCenterDeviceListStore();
