import { observable, action } from 'mobx';
import Service from '../../service/SoldierService'
import DeviceService from '../../service/DeviceService';

const initSearch = {
  deviceName: '',
  deviceType: '100605',
  page: 1,
  pageSize: 10,
  operationCenterIds: [],
}
class SoldierStore {
  // @observable
  // searchData = {
  //   deviceName: '',
  //   deviceType: '100605',
  //   page: 1,
  //   pageSize: 10,
  //   operationCenterIds: [],
  // }
  @observable
  searchData = initSearch
  // 初始化编辑条件
  initData = (searchData={}) => {
      return this.setData({
        searchData:Object.assign({},initSearch,searchData)
      })
  }

  /**編輯搜索條件 */
  editSearchData(options) {
    const searchData = Object.assign({}, this.searchData, options)
    return this.setData({ searchData })
  }

  getList(){
    return Service.getList(this.searchData)
  }

  /**解除绑定 */
  removeBindSoldier(soldierInfo, logInfoObj) {
    return Service.removeBindSoldier(soldierInfo, logInfoObj);
  }
  /**绑定用户 */
  bindSoldier(options, logInfoObj){
    return Service.bind(options, logInfoObj);
  } 

  /**添加 */
  addSoldier(options){
    return Service.add(options);
  } 
  
  /**
   * 获取设备信息
   */
  getDeviceVo(data, isSoldier) {
    return DeviceService.getDeviceVo(data, isSoldier);
  }

  /**
   * 更新设备信息
   */
  updateDeviceVo(data) {
    return DeviceService.updateDeviceVo(data);
  }

  @action
  setData(json) {
    for (var k in json) {
      this[k] = json[k]
    }
    return Promise.resolve()
  }
}

export default new SoldierStore();
