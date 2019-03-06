import { observable, action,toJS } from 'mobx';
import Service from '../../service/RoleService'
import { userPrivilegeMap } from '../../libs/common'

export const ModelData1 = {
  roleName: '',
  pageNum: 1,
  pageSize: 10
}
export const ModelData2 = {
  id: '',
  organizationId: '',
  privilegeIds: '',
  roleDesc: '',
  roleName: '',
  roleType: 111903
}


class RoleManagementStore {
  @observable
  searchData = ModelData1

    /**
  * 表单信息
  */
 @observable
 RoleSettingInfo = ModelData2

 @action
  initData() {
    this.initSearchForm()
  }

  @action
  initSearchForm(){
    this.searchData = ModelData1;
    this.RoleSettingInfo = ModelData2;
  }

  @action
  setData(json) {
    for (var k in json) {
      this[k] = json[k]
    }
  }
   /**
   * change事件
   */
  @action
  roleChange = (name) => {
    this.RoleSettingInfo = { ...this.RoleSettingInfo, ...name }
  }

  /**編輯搜索條件 */
  editSearchData(options) {
    return new Promise(resolve => {
      let params = Object.assign({}, this.searchData, { ...options })
      this.setData({ searchData: params })
      resolve()
    })
  }

  getList(options={}){
    let searchData = Object.assign({},this.searchData, options)
    return Service.getList(searchData)
  }

  getRoleDetail(id) {
		return Service.detail(id).then(res => {
			return res;
    });
  }
  getMenusByOperationCenterId(id) {
		return Service.getMenusByOperationCenterId(id).then(res => {
			return res;
    });
  }
  getMenuAndPrivilegeByOperationCenterId(id) {
		return Service.getMenuAndPrivilegeByOperationCenterId(id).then(res => {
			return res;
    });
  }
  // 对角色进行操作时，需要同步更新userModel的roleList
  addRole(roleInfo) {
    return Service.add(roleInfo).then(result => {
      this.getList()
      return result
    });
  }
  editRole(roleInfo) {
    return Service.edit(roleInfo).then(res => {
      this.getList();
      return res
    })
  }
  deleteRole(id,name) {
    return Service.delete(id,name).then(res => {
      this.getList();
      return res
    })
  }
  getModulelist(id) {
    let data = toJS(userPrivilegeMap.map(v => v))
    return data
  }
  // 更新userModel的roleList
  // updateUserModelRoleList(){
  //   const { userModel } = globalStore;
  //   const optCenterId = userModel.userInfo.optCenterId;
  //   userModel.queryRoleList(optCenterId).then(res => {
  //     const roleList = res && res.list ? res.list : [];
  //     userModel.setData({
  //       roleList
  //     })
  //   })
  // }

 
}

export default new RoleManagementStore();
