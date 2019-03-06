import { observable, action } from 'mobx';
import OrgService from '../../service/OrgService';
const initSearch = {
    key: '', // 关键字
    pageSize: 10,
    pageNo: 1,
    orgId: null
}
class OrgManagementStore {
  /**默认选中节点id */
  @observable
  searchData = initSearch
  activeKey = [];

  /**搜索条件 */
  // @observable
  // searchData = {
  //   key: '', // 关键字
  //   pageSize: 10,
  //   pageNo: 1,
  //   orgId: null
  // };
  
  /**初始化搜索条件 */
  initData(searchData={}){
    return this.setData({
      searchData:Object.assign({},initSearch,searchData)
    })
  }

  /**編輯搜索條件 */
  editSearchData(options) {
    const searchData = Object.assign({}, this.searchData, options);
    return this.setData({ searchData });
  }
  /**条件搜索所有符合条件的组织 */
  getOrgList() {
    let searchData = this.searchData;
    searchData.orgId = this.activeKey[0];
    return OrgService.searchOrg(searchData).then(res => {
      let list = res.result.data.map(v => {
        return {
          name: v.organizationName,
          id: v.id,
          parentId: v.parentId,
          desc: v.organizationDesc,
          type: v.organizationType,
          createTime: v.createTime,
          orgSort: v.orgSort
        };
      });
      res.result.data = list;
      return res.result;
    });
  }
  /**上移和下移 */
  getUpDownList(option) {
    return OrgService.controlUpDown(option);
  }
  /**删除组织 */
  DeleteOrg(option,name) {
    return OrgService.DeleteOrg(option,name);
  }

  /**编辑修改组织 */
  EditOrganization(option) {
    // return OrgService.EditAndUpdate(option).then(res => {
    //   return ''
    // })
    return OrgService.EditAndUpdate(option);
  }

  /**添加组织 */
  addAction(option) {
    return OrgService.addAction(option);
  }
  @action
  setData(json) {
    for (var k in json) {
      this[k] = json[k];
    }
    return Promise.resolve();
  }
}

export default new OrgManagementStore();
