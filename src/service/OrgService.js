import { httpRequest } from '../utils/HttpUtil';
import { ORG } from './RequestUrl'

@httpRequest
class OrgService {
  /**获取组织结构 */
  getList(data) {
    return this.$httpRequest({
      url: ORG.ORG_LIST.value,
      method: 'post',
      data
    }).then(res => res.result)
    .catch(() => [])
  }
  searchOrg(data){
    return this.$httpRequest({
      url: ORG.SEARCHORG.value,
      method: 'post',
      data
    })
  }
  /**控制上移与下移 */
  controlUpDown(data){
    return this.$httpRequest({
      url: ORG.ORDERUPDOWN.value,
      method: 'post',
      data:data
    }) 
    .then(res => res.result)
    .catch(() => [])
  }
  /**删除组织 */
  DeleteOrg(data,organizationName){
    let logInfo = {
      description:`移除【${organizationName}】组织`,
      ...ORG.ORG_DELETE.logInfo[0]
      }
    return this.$httpRequest({
      url: ORG.ORG_DELETE.value,
      method: 'post',
      data,
      logInfo,
    })
    .then(res => res.result)
    .catch(() => [])
  }
  EditAndUpdate(data){
    let logInfo = {
      description:`编辑【${data.organizationName}】组织`,
      ...ORG.ORG_UPDATE.logInfo[0]
      }
    return this.$httpRequest({
      url: ORG.ORG_UPDATE.value,
      method: 'post',
      data,
      logInfo,
    }).then(res => res.result)
    .catch(() => [])
  }
  addAction(options){
    let logInfo = {
      description:`新增【${options.organizationName}】组织`,
      ...ORG.ORG_ADD.logInfo[0]
      }
    return this.$httpRequest({
      url: ORG.ORG_ADD.value,
      method: 'post',
      data: options,
      logInfo,
    }).then(res => res.result)
  }
}

export default new OrgService()
