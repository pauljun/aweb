
import PeopleService from '../../../service/PersonnelControlService/MoniteePeople';
import { message } from 'antd'

class MoniteePeople {
  // ========================   本地添加   =====================
  // 获取本地布控人员列表
  getLocalList(libId) {
    let params = { page: 1, pageSize: 99999, libId }
    return PeopleService.getLocalList(params)
  }
  // 编辑或添加本地人员
  onSubmit(itemInfo, infoList, selfAttr, libDetail) {
    const objectInfo = infoList.map(v => (
      { 
        id: v.id,
        type: v.type,
        image: v.image
      }
    ))
    const options = {
      ...itemInfo,
      selfAttr,
      objectInfo
    }
    return PeopleService.update(options, libDetail)
  }
  // 删除人员
  // onDelete(id) {
  //   return PeopleService.deletePeople(id)
  // }
  // 批量删除人员
  deletePeopleBatch(ids, libDetail) {
    return PeopleService.deletePeopleBatch(ids, libDetail)
  }
  // 编辑人员删除图片
  deleteImg(infoList, image) { 
    if (image.id) {
      return PeopleService.deleteImage(image.id).then(result => {
        if (result) {
          const newInfoList = infoList.filter(v => v.id !== image.id);
          message.success('删除成功')
          return newInfoList
        } else {
          message.error('删除失败')
        }
      })
    } else {
      const newInfoList = infoList.filter(v => v.image !== image.image);
      message.success('删除成功')
      return new Promise(r => r(newInfoList))
    }
  }
  // ========================   批量添加   =====================
  onMutilSubmit(peopleList, libInfo) {
    const option = peopleList.map(people => ({
      libId: libInfo.id,
      objectMainAttr: people.selfAttr,
      pictureUrl: people.infoList.map(v => v.url)
    }));
    return PeopleService.addMultiUpLoad(option, libInfo).then(result => {
      if(!result) {
        return false;
      }
      return result;
    });
  }
}
export default new MoniteePeople()