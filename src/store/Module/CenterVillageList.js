import { observable, action } from 'mobx';
import Service from '../../service/Community/VillageService'

class CenterVillageListStore {
  @observable
  searchData = {
    key: '',
    page: 1,
    pageSize: 10,
  }

  @action
  initData() {
    this.searchData = {
      key: '',
      page: 1,
      pageSize: 10,
    }
  }

  @action
  mergeSearchData(data) {
    this.searchData = Object.assign(this.searchData, { ...data });
  }

  getList(){
    let searchData = this.searchData
    searchData.keyWord = searchData.key
    return Service.getVillageList(searchData)
  }

  getCentersByVillage(id){
    return Service.getCentersByVillage(id)
  }


  assignedByVillage(options){
    return Service.assignedByVillage(options)
  }

  resetVillage(options){
    return Service.resetVillage(options)
  }

  /**添加小区 */
  add(options){
    return Service.add(options)
  }

  /**编辑小区 */
  update(options){
    return Service.update(options)
  }

  /**查询小区 */
  getDetail(id){
    return Service.getDetail(id).then(res => res.result)
  }

  queryVillageDevices(options){
    return Service.queryVillageDevices(options)
  }
  updateVillageDevices(options){
    return Service.updateVillageDevices(options)
  }
  queryUnbindedVillageDevices(){
    return Service.queryUnbindedVillageDevices()
  }

}

export default new CenterVillageListStore();
