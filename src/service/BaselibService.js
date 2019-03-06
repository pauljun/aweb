import { httpRequest } from '../utils/HttpUtil';
import { BASELIB_URL } from './RequestUrl';
import { message } from 'antd';

@httpRequest
class BaselibService {
  /**
   * 获取人脸, 人体, 车辆列表数据
   * @param {Object} options
   * @param {String} type
   */
  getList(type, options){
    const requestUrl = {
      'face': BASELIB_URL.faceList,
      'body': BASELIB_URL.bodyList,
      'vehicle': BASELIB_URL.vehicleList,
      'wifiDataList':BASELIB_URL.wifiDataList,
    }
    let list = [], total = 0;
    return this.$httpRequest({
      url: requestUrl[type]['value'],
      method: 'POST',
      data: options
    }).then(result => {
      if(type === 'vehicle' ||type === 'wifiDataList'){
        list = result.result.list
      } else {
        list = result.result[type]
      }
      total = result.result.total || total;
      return { list, total }
    }).catch(() => {
      return { list, total }
    })
  }
  /**
   * 获取人体人脸的列表的总total值
   */
  getListSize(type, options){
    let requestUrl;
    if(type === 'faceListSize'){
      requestUrl = BASELIB_URL.faceListSize.value
    } else if(type === 'bodyListSize'){
      requestUrl = BASELIB_URL.bodyListSize.value
    }
    return this.$httpRequest({
      url: requestUrl,
      method: 'POST',
      data: options
    }).then(result => result.result)
  }

  // 以图搜图列表通过人脸、人体特征获取列表
  getFeatureList(type, options, logData){
    const TYPE = type === 'face' ? 'faceFeatureList' : 'bodyFeatureList';
    const description = `以图搜图【${logData.searchType}】, 图片URL: ${logData.url} `;
    return this.$httpRequest({
      url: BASELIB_URL[TYPE]['value'],
      method:"POST",
      data:options,
      logInfo: {
        description,
        ...BASELIB_URL[TYPE].logInfo[0],
      }
    }).then(result => {
      let list = [], total = 0
      if(result.code === 200){
        list = result.result[type]
        total = result.result[type].length
      }
      return {list, total}
    })
  }
  // 通过人脸 Url 查询人脸特征
  getFaceFeatureByUrl(options){
    options.score = 0.6
    if (options.url&&options.url.indexOf('data:image/jpeg;base64')>=0){
      options.base64 = options.url.split(',')[1]
      delete (options.url)
    }
    return this.$httpRequest({
      url: BASELIB_URL.faceFeatureUrl.value,
      method:"POST",
      data: options,
    }).then(result => {
      let feature, id
      if(!result.result.imgsList.length){
        message.error('提取图片特征失败，请重新上传图片！')
      }else{
        let face = result.result.imgsList[0].face;
        if(face){
          feature = face.feature;
          id = face.id;
        }else{
          message.error('提取图片特征失败，请重新上传图片！')
        }
      }
      return { feature, id }
    }).catch(() => ({feature: null, id: null }))
  }
  // 通过人脸 id 查询人脸特征 新增一个字段，dbSource
  getFaceFeatureById(id,dbSource){
    return this.$httpRequest({
      url: BASELIB_URL.faceIdFeatureList.value, 
      method:"POST",
      data:{ id, dbSource },
    }).then(result => {
      return { 
        feature: result.result.faceFeature, 
        url: result.result.facePath,
      }
    }).catch(() => ({feature: null, url: null }))
  }
  // 通过人体 Url 查询人体特征
  getBodyFeture(options){
    if (options.url && options.url.indexOf('data:image/jpeg;base64') >= 0) {
      options.base64 = options.url.split(',')[1]
      delete (options.url)
    }
    return this.$httpRequest({
      url: BASELIB_URL.bodyFeatureUrl.value, 
      method:"POST",
      data: options,
      // logInfo: BASELIB_URL.bodyFeatureUrl.logInfo[0]
    }).then(result => {
      let feature, id
      if (!result.result.imgsList.length) {
        message.error('提取图片特征失败，请重新上传图片！')
      } else {
        let body = result.result.imgsList[0].body
        if(body){
          feature = body.feature
          id = body.id
        }
      }
      return { feature, id }
    }).catch(() => ({feature: null, id: null }))
  }
  // 通过人体 id 查询人体特征
  getBodyFeatruByEntity(options){
    return this.$httpRequest({
      url: BASELIB_URL.bodyIdFeatureList.value,
      method:"POST",
      data: options,
      // logInfo: BASELIB_URL.bodyIdFeatureList.logInfo[0]
    }).then(result => {
      const feature = result.result.bodyFeature
      const url = result.result.bodyPath
      return { feature, url }
    }).catch(() => ({feature: null, url: null }))
  }

 //获取wifi采集设备
  getWifiDevices(options){
    let list = [], total = 0;
    return this.$httpRequest({
      url: BASELIB_URL.wifiDeviceList.value,
      method: 'POST',
      data: options
    }).then(result => {
        list = result.result.resultList
        total = result.result.resultSize || total;
        return { list, total }
    }).catch(() => {
        return { list, total }
    })
  }
//获取wifi详情信息
  getWifiList(options){
    let list = [], total = 0;
    return this.$httpRequest({
      url: BASELIB_URL.wifiDataList.value,
      method: 'POST',
      data: options
    }).then(result => {
        list = result.result.list
        total = result.result.total || total;
        return { list, total }
    }).catch(() => {
        return { list, total }
    })
  }

}
export default new BaselibService();
