import { httpRequest } from '../../utils/HttpUtil';
import { PEOPLE } from '../RequestUrl';

@httpRequest
class MoniteePeople {
  // 获取布控人员列表
  getLocalList(options = {}) {
    return this.$httpRequest({
      url: PEOPLE.localList.value,
      method: 'POST',
      data: options
    }).then(result => this.handleResult(result))
  }
  // 编辑或添加布控人员
  update(options, libInfo) {
    console.log(libInfo, 16)
    const urlType = options.id ? 'editPeople' : 'addPeople';
    const logInfo = {
      description: `${options.id?'编辑':'添加'}${libInfo.libType===1?'重点':'合规'}人员库【${libInfo.name}】 人员【${options.selfAttr.name}】`,
      ...PEOPLE[urlType].logInfo.find(v => v.type === libInfo.libType),
    }
    return this.$httpRequest({
      url: PEOPLE[urlType]['value'],
      method: 'POST',
      data: options,
      logInfo
    }).then(result => this.handleResult(result))
  }
  // 批量上传添加
  addMultiUpLoad(options,libInfo){
    const peopleNames = options.map(v => v.objectMainAttr.name);
    const logInfo = {
      description: `添加人员【${peopleNames}】到${libInfo.libType===1?'重点':'合规'}人员库【${libInfo.name}】`,
      ...PEOPLE.addMultiUpLoad.logInfo.find(v => v.type === libInfo.libType),
    }
    return this.$httpRequest({
      url: PEOPLE.addMultiUpLoad.value,
      method: 'POST',
      data: options,
      logInfo
    }).then(result => this.handleResult(result))
  }
  // // 删除布控人员
  // deletePeople(id) {
  //   return this.$httpRequest({
  //     url: PEOPLE.delete.value.replace('<id>', id),
  //     method: 'GET',
  //     logInfo: PEOPLE.delete
  //   }).then(result => this.handleResult(result))
  // }
  // 批量删除人员
  deletePeopleBatch(mainIds, libDetail) {
    let peopleNames = []
    mainIds.map(id => {
      const item = libDetail.objectMainList.find(v => v.id === id);
      item && peopleNames.push(item.selfAttr.name)
    })
    const logInfo = {
      description: `移除${libDetail.libType===1?'重点':'合规'}人员库【${libDetail.name}】的人员【${peopleNames}】`,
      ...PEOPLE.deleteBatch.logInfo.find(v => v.type === libDetail.libType),
    }
    return this.$httpRequest({
      url: PEOPLE.deleteBatch.value,
      method: 'POST',
      data: { mainIds },
      logInfo
    }).then(result => this.handleResult(result))
  }

  // 删除单个布控人员的单个图片
  deleteImage(id) {
    return this.$httpRequest({
      url: PEOPLE.deleteImage.value.replace('<id>', id),
      method: 'GET',
      logInfo: PEOPLE.deleteImage
    }).then(result => this.handleResult(result))
  }

  handleResult(result) {
    if (!result || result.code !== 200) {
      return false
    }
    return result.result || result
  }
}
export default new MoniteePeople()