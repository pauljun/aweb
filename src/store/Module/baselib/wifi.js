import {observable,action} from 'mobx'
import BaselibStoreUtil from './BaselibStoreUtil';
import Service from '../../../service/BaselibService';
import { SecurityScanTwoTone } from 'src/libs/AntdIcon/icons/lib';

const initSearch={
  pageSize: 24,
  page: 1,
  // startTime: "1535932800000",
  // endTime: "1542758400000",
  startTime: undefined,
  endTime: undefined,
  keyWord:'',
  captureDeviceCids:[]
}

class WifiStore extends BaselibStoreUtil {
  @observable searchData = initSearch
  @observable test =''

  // 初始化搜索条件
  initSearchData(searchData={}){
    return this.setData({
      searchData:  Object.assign({}, initSearch, searchData)
    })
  }

  handleSearchData(options){
    return options
  }
  //获取wifi设备列表
  getWifiDevices(options){
    return Service.getWifiDevices(options)
  }
  //获取wifi设备详情列表
  getList(options){
    return Service.getWifiList(options)
  }

}



export default new WifiStore()