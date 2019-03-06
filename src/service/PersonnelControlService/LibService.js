import { httpRequest } from '../../utils/HttpUtil';
import { LIBS } from '../RequestUrl';
import { message } from 'antd'
@httpRequest
class LibsService {
  handleResult(result){
    if(!result || result.code !== 200){
      message.error(result.message)
      return false
    }
    return result.result || result
  }
  /**获取布控库列表 */
  getList(data = {}) {
    return this.$httpRequest({
      url: LIBS.list.value,
      method: 'POST',
      data,
    }).then(res => {
      if (res && res.code === 200) {
        return res
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    })
  }  
  /**根据组织获取用户信息 */
  getOrgUsersList(data = {}) {
    return this.$httpRequest({
      url: LIBS.usersList.value,
      method: 'POST',
      data
    }).then(res => {
      if (res && res.code === 200) {
        return res
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    })
  }
  /**
   * 布控库列表搜索
   */
  getLibList(options) {
    const url = options.libType !== 4 ? LIBS.list.value : LIBS.machineList.value;
    return this.$httpRequest({
      url,
      method: 'POST',
      data: options,
    }).then(this.handleResult)
  }
  /**一体机列表搜索*/
  getMachines(options) {
    return this.$httpRequest({
      url: LIBS.machines.value,
      method: 'POST',
      data: options
    }).then(this.handleResult)
  }
  /**单个一体机布控库列表搜索*/
  getMachineLibs(options) {
    return this.$httpRequest({
      url: LIBS.machineList.value,
      method: 'POST',
      data: options
    }).then(this.handleResult)
  }
  /**根据id获取布控库详情 */
  getLibDetail(id){
    return this.$httpRequest({
      url: `${LIBS.libDetail.value}${id}`,
      method: 'GET',
    }).then(this.handleResult)
  }
  /**根据布控库id获取 */
  getMachineDetail(id){
    return this.$httpRequest({
      url: `${LIBS.machineDetail.value}${id}`,
      method: 'GET',
    }).then(this.handleResult)
  }
  /**根据id删除布控库 */
  deleteLib({id, libType, libName}){
    return this.$httpRequest({
      url: `${LIBS.deleteLib.value}${id}`,
      method: 'GET',
      logInfo: {
        description: `删除${libType===1 ?'重点':'合规'}人员库【${libName}】`,
        ...LIBS.deleteLib.logInfo.find(v => v.type === libType),
      }
    }).then(this.handleResult)
  }
  /**编辑添加布控库 
   *  字段      类型      必填      描述
   *  id      string    false   有id表示编辑，无id表示添加
      userId  string    true    "organization-123,organization-456,user-1,user-2,user-3"
      name                      "XX布控"
      libType  int               1黑名单库；2白名单库
      describe                  "XX描述"
   * 
  */
  saveLib(options){
    const urlType = options.id ? 'editLib' : 'addLib';
    return this.$httpRequest({
      url: LIBS[urlType]['value'],
      method: 'POST',
      data: options,
      logInfo: {
        description: `${options.id ?'编辑':'新增'}${options.libType===1 ?'重点':'合规'}人员库【${options.name}】`,
        ...LIBS[urlType].logInfo.find(v => v.type === options.libType),
      }
    }).then(this.handleResult)
  }
  /**编辑一体机布控库信息 */
  editMachineInfo(options){
    return this.$httpRequest({
      url: LIBS.updateMachineLib.value,
      method:'POST',
      data: options,
      logInfo: LIBS.updateMachineLib.logInfo[0]
    }).then(this.handleResult)
  }
  /**保存一体机布控库路径 */
  saveMachineExcel(options){
    return this.$httpRequest({
      url: LIBS.saveMachineLibPath.value,
      method: 'POST',
      data: options
    }).then(this.handleResult)
  }
  /**一体机布控库导入 uploadMachineMonitorLibs */
  uploadMachineMonitorLibs(options){
    return this.$httpRequest({
      url: LIBS.uploadMachineMonitorLibs.value,
      method: 'POST',
      data: options,
      logInfo: LIBS.uploadMachineMonitorLibs.logInfo[0]
    })
  }
}
export default new LibsService();
