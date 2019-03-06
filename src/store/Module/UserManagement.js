import { observable, action,toJS } from 'mobx';
import { Promise } from 'core-js';
import Service from '../../service/UserService'
import Services from '../../service/KVService'
import * as util from '../../utils'
import UploadPicMessage from '../../service/lyService.js'
const initSearch = {
    searchFilter: '',
    pageSize: 10,
    pageNum: 1,
    isHadChild: false,
    containSuborganization:0
}
class UserManagementStore {
  /**默认选中节点id */
  @observable 
  activeKey = []

  /**搜索条件 */
  @observable
  searchData = initSearch
  // 初始化查询条件
  initData = (searchData = {}) => {
    return new Promise(resolve => {
      this.setData({
        searchData:Object.assign({},this.searchData,initSearch)
      })
      resolve()
    })
  }
  //系统logo
  @observable systemMes = []
  // 修改store数据
  @action
  setData(json) {
    for (var k in json) {
      this[k] = json[k]
    }
  }
  /**編輯搜索條件 */
  editSearchData(options) {
    console.log(options,'options')
    return new Promise(resolve => {
      let params = Object.assign({}, this.searchData, { ...options })
      this.setData({ searchData: params })
      resolve()
    })
  }

  /**查询所有用户 */
  getUserList(){
    let searchData = this.searchData
    searchData.organizationId = this.activeKey[0]
    return Service.queryUserList(searchData)
  }

  /**重置密码 */
	resetPsw(id){
		return Service.resetPsw(id)
  }
  
  async getUserInfo(id) {
		let result = await Service.queryUserInfo({id});
		return result
  }
  
  async queryUserDetail(id,name) {
		let result = await Service.queryUserDetail({id, name});
		return result
  }

	async changeUserStatus(params) {
		let result = await Service.changeUserStatus(params.userId,params.status,params.loginName);
		return result
	}

	addUser(userInfo) {
		return Service.addUser(userInfo)
	}

	editUser(userInfo) {
		return Service.updateUser(userInfo)
	}

	async delUser(item) {
    return Service.deleteUser(item);
  }
	// async delUser(storeId, id) {
	// 	await Service.delUser(id);
	// 	return this.search(storeId);
	// }

  /**获取系统logo */
  getSystemMes(userId){
    Services.getKVStore(userId, 'SYSTEM_MES').then(res => {
      this.setData({
        systemMes: res || []
      })
    })
  }
  /**设置系统logo与名称 */
  setSystemMes=(item,userId) => {
    let systemMes = toJS(this.systemMes)
    console.log(systemMes,909)
    systemMes.push({
      systemId: util.uuid(),
      systemName: item.systemName,
      systemLogo: item.systemLogo,
      userList: []
    })
    this.setData({
      systemMes
    })
    let systemMesToServer = JSON.parse(JSON.stringify(systemMes))
    systemMesToServer.forEach((item) => {
      if(item && item.systemName){
        item.systemName = item.systemName.replace(/#/,escape('#'))
        item.systemLogo = escape(item.systemLogo)
      }
    })
    return Services.setKVStore(userId, 'SYSTEM_MES',JSON.stringify(systemMesToServer) )
  }
/**删除系统logo和名称 */
  delSystemMes(id,userId){
    let systemMes = toJS(this.systemMes)
    let systemMesNow = systemMes.filter(item => {
      return item.systemId !== id
    })
    let delItem = systemMes.find(item => {
      return item.systemId === id
    })
    this.setData({
      systemMes: systemMesNow
    })
    let systemMesToServer = JSON.parse(JSON.stringify(systemMesNow))
    systemMesToServer.forEach((item) => {
      if(item && item.systemName){
        item.systemName = item.systemName.replace(/#/,escape('#'))
        item.systemLogo = escape(item.systemLogo)
      }
    })
    return Services.setKVStore(userId,'SYSTEM_MES', JSON.stringify(systemMesToServer)).then(res => {
      if(res.code === 200){
        const ObjId = util.searchFormat(delItem.systemLogo.split('?')[1]).obj_id
        UploadPicMessage.deleteFile(ObjId)
      }
      return res
    })
  }
}

export default new UserManagementStore();
