import { httpRequest } from '../utils/HttpUtil';
import { OPERATIONCENTER, DEVICE } from './RequestUrl'

@httpRequest
class OperationCenterService {
  /**获取组织结构 */
  getList(data) {
    return this.$httpRequest({
      url: OPERATIONCENTER.LIST.value,
      method: 'post',
      data
    })
  }

  /**获取运营中心摄像机资源数 */
  getOptCenterDeviceCount(data){
    return this.$httpRequest({
      url: DEVICE.CAMERA_TOTAL_BY_OCID.value,
      method: 'post',
      data
    })
  }

  /**添加运营中心 */
  add(data){
    return this.$httpRequest({
      url: OPERATIONCENTER.ADD.value,
      method: 'post',
      data
    })
  }

  /**添加运营中心 */
  update(data){
    return this.$httpRequest({
      url: OPERATIONCENTER.UPDATE.value,
      method: 'post',
      data
    })
  }

  /**删除运营中心 */
  del(data){
    return this.$httpRequest({
      url: OPERATIONCENTER.DEL.value,
      method: 'post',
      data
    })
  }

  /**查询运营中心详情 */
  getDetail(id){
    return this.$httpRequest({
      url: OPERATIONCENTER.DETAIL.value,
      method: 'post',
      data:{id}
    })
  }
}
export default new OperationCenterService()
