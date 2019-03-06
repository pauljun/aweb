import { observable, action } from 'mobx';
import Service from '../../../service/OperationCenterService'

class OperationCenterStore {
  @observable
  searchData = {
    centerCode: '',
    centerName: '',
    key: '',
    pageNo: 1,
    pageSize: 20,
    validState: ''
  }

  @action
  initData() {
    this.searchData = {
      centerCode: '',
      centerName: '',
      key: '',
      pageNo: 1,
      pageSize: 20,
      validState: ''
    }
  }

  @action
  mergeSearchData(data) {
    this.searchData = Object.assign(this.searchData, { ...data });
  }

  getList(){
    let searchData = this.searchData
    return Service.getList(searchData)
  }


  /**添加运营中心 */
  add(options){
    return Service.add(options)
  }

  /**编辑运营中心 */
  update(options){
    return Service.update(options)
  }

  /**删除运营中心 */
  del(options){
    return Service.del(options)
  }

  /**查询运营中心详情 */
  getDetail(id){
    return Service.getDetail(id).then(res => res.result)
  }

  /**查询摄像机总数 */
  getOptCenterDeviceCount(ids){
    return Service.getOptCenterDeviceCount({
      operationCenterIds: ids
    })
  }

  @action
  setData(json) {
    for (var k in json) {
      this[k] = json[k]
    }
  }
}

export default new OperationCenterStore();
