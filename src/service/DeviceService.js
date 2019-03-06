import { httpRequest } from '../utils/HttpUtil';
import { DEVICE, OTHER } from './RequestUrl';
import moment from 'moment';
const DATE_FORMAT = 'YYYY.MM.DD HH:mm:ss';

@httpRequest
class DeviceService {
  queryLyToken() {
    return this.$httpRequest({
      url: DEVICE.LY_OBJECT_TOKEN.value
    });
  }

  getCameraList(data) {
    return this.$httpRequest({
      url: DEVICE.CAMERA_LIST.value,
      method: 'post',
      data
    });
  }

  getCameraListByOrgs(data) {
    return this.$httpRequest({
      url: DEVICE.CAMERA_LIST_ORG.value,
      method: 'post',
      data
    });
  }

  getAccessControlList(data) {
    return this.$httpRequest({
      url: DEVICE.ACCESSCONTROL_LIST.value,
      method: 'post',
      data
    });
  }
  getGateList(data) {
    return this.$httpRequest({
      url: DEVICE.GATE_LIST.value,
      method: 'post',
      data
    });
  }
  getWifiList(data) {
    return this.$httpRequest({
      url: DEVICE.WIFI_LIST.value,
      method: 'post',
      data
    });
  }
  getCountDevice(data) {
    return this.$httpRequest({
      url: DEVICE.COUNT_DEVICE.value,
      method: 'post',
      data
    });
  }
  // 获取设备token
  getDeviceToken(cameraId) {
    return this.$httpRequest({
      url: `${DEVICE.LY_TOKEN.value}${cameraId}`
    }).then(result => result.result);
  }
  // flv实时视频流
  async asyncGetFlvVideo(cameraId, cameraName) {
    const result = { file: undefined, cameraId };
    const token = await this.getDeviceToken(cameraId);
    // 记录日志
    const logInfo = DEVICE.FLV_VIDEO.logInfo[0];
    GlobalStore.LoggerStore.save({
      description: `查看点位【${cameraName}】的实时视频`,
      ...logInfo
    });
    const url = DEVICE.FLV_VIDEO.value
      .replace('<lyapi>', window.webConfig.domainLy)
      .replace('<cid>', cameraId)
      .replace('<token>', token);
    result.file = url;
    return result;
  }

  // hls实时视频流
  async asyncGetHlsVideo(cameraId, cameraName) {
    const result = { file: undefined, cameraId };
    const token = await this.getDeviceToken(cameraId);
    // 记录日志
    const logInfo = DEVICE.HLS_VIDEO.logInfo[0];
    GlobalStore.LoggerStore.save({
      description: `查看点位【${cameraName}】的实时视频`,
      ...logInfo
    });
    if (token) {
      const url = DEVICE.HLS_VIDEO.value
        .replace('<lyapi>', window.webConfig.domainLy)
        .replace('<cid>', cameraId)
        .replace('<token>', token);
      result.file = url;
    }
    return result;
  }

  //获取历史视频
  async asyncGetHistoryVideo({ cameraId, startTime, endTime, cameraName } ) {

    const token = await this.getDeviceToken(cameraId);
    // 记录日志
    const beginStringDate = moment.unix(startTime).format(DATE_FORMAT);
    const endStringDate = moment.unix(endTime).format(DATE_FORMAT);
    const logInfo = DEVICE.HISTORY_VIDEO.logInfo[0];

    GlobalStore.LoggerStore.save({
      description: `查看点位【${cameraName}】 ${beginStringDate}到${endStringDate}的录像`,
      ...logInfo
    });
    const url = DEVICE.HISTORY_VIDEO.value
      .replace('<lyapi>', window.webConfig.domainLy)
      .replace('<cameraId>', cameraId)
      .replace('<token>', token)
      .replace('<begin>', startTime)
      .replace('<end>', endTime);
    return this.$httpXMLInstance({ url }).then(res => {
      let fragment = {};
      fragment.beginDate = moment(res.begin * 1000).format('YYYY-MM-DD HH:mm:ss');
      fragment.duration = res.end - res.begin;
      fragment.fragments = [];
      if (res.playlist.length === 0) {
        // message.warn('未获取到视频！')
        return fragment;
      }
      if (res.playlist.length === 1) {
        let item = res.playlist[0];
        if (item.begin !== res.begin) {
          fragment.fragments.push({
            begin: 0,
            end: item.begin - res.begin
          });
        }
        fragment.fragments.push({
          begin: item.begin - res.begin,
          end: item.end - res.begin,
          file: item.url
        });
      } else {
        res.playlist.reduce((item, nextItem, index) => {
          //TODO 开始时间有缺失
          if (index === 0 && item.begin !== res.begin) {
            fragment.fragments.push({
              begin: 0,
              end: item.begin - res.begin
            });
          }

          fragment.fragments.push({
            begin: item.begin - res.begin,
            end: item.end - res.begin,
            file: item.url
          });

          //TODO 中间时间有缺失
          if (nextItem.begin !== item.end) {
            fragment.fragments.push({
              begin: item.end - res.begin,
              end: nextItem.begin - res.begin
            });
          }
          if (index === res.playlist.length - 1) {
            fragment.fragments.push({
              begin: nextItem.begin - res.begin,
              end: nextItem.end - res.begin,
              file: nextItem.url
            });
          }

          return nextItem;
        });
      }
      return fragment;
    });
  }

  //云台控制
  async ptzControl({ cameraId, direction, isGB, speed, isStop, token }) {
    if (
      !token ||
      +token.split('_')[0] !== cameraId ||
      token.split('_')[2] * 1000 < new Date() * 1
    ) {
      // 如果没有传token或token与cameraId不一致或token过期
      token = await this.getDeviceToken(cameraId);
    }
    const lyapi = window.webConfig.domainLy;
    const urlObj = isGB
      ? DEVICE.UPDATE_DEVICE_GB_PTZ
      : DEVICE.UPDATE_DEVICE_PTZ;
    const url = urlObj.value
      .replace('<lyapi>', lyapi)
      .replace('<cameraId>', cameraId)
      .replace('<token>', token);
    const options = {
      cmd: isGB ? (isStop ? 'stop' : 'move') : undefined,
      type: isGB ? undefined : 'direction',
      control: {
        direction,
        delay: isGB ? undefined : 100,
        speed: isGB ? speed : undefined,
        step: isGB ? undefined : speed
      }
    };
    await this.$httpXMLInstance({
      url,
      method: 'POST',
      data: options,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
    return token;
  }

  // 视频下载 begin: 秒级时间戳
  async asyncDownloadVideo({ cameraId, begin, end, cameraName }) {
    const token = await this.getDeviceToken(cameraId);
    if (!token) {
      return false;
    }
    // 记录日志
    const beginStringDate = moment.unix(begin).format(DATE_FORMAT);
    const endStringDate = moment.unix(end).format(DATE_FORMAT);
    GlobalStore.LoggerStore.save({
      description: `下载点位【${cameraName}】 ${beginStringDate}到${endStringDate}的录像`,
      ...OTHER.downloadVideo
    });

    const downloadUrl = DEVICE.DOWNLOAD_VIDEO.value
      .replace('<lyapi>', window.webConfig.domainLy)
      .replace('<cid>', cameraId)
      .replace('<begin>', begin)
      .replace('<end>', end)
      .replace('<token>', token)
      .replace('<name>', cameraName);
    return downloadUrl;
  }

  /**获取羚羊云设备分组 */
  getLingyangOrgs() {
    return this.$httpRequest({
      url: `${DEVICE.LINGYANG_ORGS.value}`
    });
  }

  /**根据运营中心id获取设备列表 */
  getCameraListByOcId(data) {
    return this.$httpRequest({
      url: `${DEVICE.CAMERA_LIST_BY_OC_ID.value}`,
      method: 'post',
      data
    });
  }

  updateDeviceOrg(data) {
    return this.$httpRequest({
      url: `${DEVICE.UPDATE_DEVICE_ORG.value}`,
      method: 'post',
      data
    });
  }

  /**分配设备到运营中心 */
  updateDeviceOcId(data) {
    return this.$httpRequest({
      url: `${DEVICE.UPDATE_DEVICE_OCID.value}`,
      method: 'post',
      data
    });
  }

  /**更新设备信息 */
  updateDeviceVo(data) {
    const urlObj =
      data.cameraType != 100605
        ? DEVICE.UPDATE_DEVICE_CAM
        : DEVICE.UPDATE_DEVICE_SOLDIER;
    const { deviceName } =
      GlobalStore.DeviceStore.queryCameraById(data.id) || {};
    return this.$httpRequest({
      url: `${urlObj.value}`,
      method: 'post',
      data,
      logInfo: {
        description: `编辑${
          data.cameraType != 100605 ? '设备' : '单兵'
        }【${data.deviceName || data.lyCameraInfo.name}】信息`,
        ...urlObj.logInfo[0]
      }
    });
  }

  /**获取设备信息 */
  getDeviceVo(id, isSoldier = false) {
    const { deviceName } = GlobalStore.DeviceStore.queryCameraById(id) || {};
    return this.$httpRequest({
      url: DEVICE.DETAIL_DEVICE.value.replace('<id>', id),
      method: 'get',
      logInfo: isSoldier
        ? {}
        : {
            description: `查看设备【${deviceName}】信息`,
            ...DEVICE.DETAIL_DEVICE.logInfo[0]
          }
    });
  }
  updateDeviceGeo(data) {
    const { deviceName } =
      GlobalStore.DeviceStore.queryCameraById(data.deviceId) || {};
    return this.$httpRequest({
      url: `${DEVICE.UPDATE_DEVICE_GEO.value}`,
      method: 'post',
      data,
      logInfo: {
        description: `修改设备【${deviceName}】经纬度为：[${data.longitude},${
          data.latitude
        }]`,
        ...DEVICE.UPDATE_DEVICE_GEO.logInfo[0]
      }
    });
  }
  getDeviceById(id) {
    return this.$httpRequest({
      url: DEVICE.getDeviceById.value.replace('<id>', id),
      method: 'GET'
    });
  }

  /**根据拉流状态判断设备状态不对时，向后台反馈设备状态 */
  updateStateByDeviceId(deviceId, deviceData){
    const url = DEVICE.updateStateByDeviceId.value
    .replace('<deviceId>', deviceId)
    .replace('<deviceData>', deviceData)
    return this.$httpRequest({
      url: url,
      method: 'get'
    })
  }

  async getDeviceStatus(cameraIds) {
    return this.$httpRequest({
      url: DEVICE.CAMERA_STATUS.value,
      method: 'POST',
      data: {cids:cameraIds}
    })
  }
}
export default new DeviceService();
