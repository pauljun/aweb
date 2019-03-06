import { observable } from 'mobx'
import BaselibStoreUtil from './BaselibStoreUtil';
import { vehicleClasses } from 'src/libs/Dictionary';

const initSearch = {
  pageSize: 24,
  page: 1,
  startTime: undefined,
  endTime: undefined,
  plateColor: null,
  vehicleColor: null,
  vehicleBrands: null,
  vehicleClasses: null,
  plateNo: "",
  devices: [],
}

class VehicleStore extends BaselibStoreUtil {

  @observable searchData = initSearch;
  
  @observable imgStyle='2'
  
  // 初始化搜索条件
  initSearchData(searchData={}){
    return this.setData({
      searchData:  Object.assign({}, initSearch, searchData)
    })
  }

  handleSearchData(options) {
    const data = options || this.searchData;
    let devices = data.devices.length ? this.getDeviceId(data.devices) : undefined;
    // 对车辆类型进行处理
    let type = vehicleClasses.filter(v => v.value === data.vehicleClasses)[0].ids
    // 对车辆品牌进行处理
    let vehicleBrands = data.vehicleBrands ? [data.vehicleBrands] : null
    return Object.assign({}, data, { devices, vehicleClasses: type, vehicleBrands } );
  }
}

export default new VehicleStore()
