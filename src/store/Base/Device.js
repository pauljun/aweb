import { observable, action, computed, toJS, autorun } from 'mobx';
import { message } from 'antd';
import DeviceService from '../../service/DeviceService';
import { qj, znxj, zpj, db } from '../../libs/DeviceLib';
import { setCacheItem, getCacheItem, tagAToDownload } from '../../utils';

export default class DeviceStore {
  constructor() {
    autorun(() => {
      if (process.env.NODE_ENV !== 'production') {
        const deviceList = getCacheItem('deviceList') || [];
        this.setDeviceList(deviceList);
      }
    });
  }
  @observable
  deviceList = [];

  @computed
  get cameraList() {
    return this.deviceArray.filter(
      v =>
        v.deviceType === +qj.value ||
        v.deviceType === +znxj.value ||
        v.deviceType === +zpj.value ||
        v.deviceType === +db.value
    );
  }

  @computed
  get accessControlList() {
    return this.deviceArray.filter(v => v.manufacturerDeviceType === 103406);
  }

  @computed
  get gateList() {
    return this.deviceArray.filter(v => v.manufacturerDeviceType === 100607);
  }

  @computed
  get deviceArray() {
    return this.deviceList.map(v => {
      return {
        deviceName: v.deviceName,
        deviceType: v.deviceType,
        deviceData: v.deviceData,
        id: v.id,
        latitude: v.latitude,
        longitude: v.longitude,
        manufacturerDeviceId: v.manufacturerDeviceId,
        manufacturerDeviceType: v.manufacturerDeviceType,
        operationCenterIds: toJS(v.operationCenterIds),
        organizationIds: toJS(v.organizationIds),
        sn: v.sn
      };
    });
  }

  @computed
  get cameraArray() {
    return this.cameraList.map(v => {
      return {
        deviceName: v.deviceName,
        deviceType: v.deviceType,
        deviceData: v.deviceData,
        id: v.id,
        latitude: v.latitude,
        longitude: v.longitude,
        manufacturerDeviceId: v.manufacturerDeviceId,
        manufacturerDeviceType: v.manufacturerDeviceType,
        operationCenterIds: toJS(v.operationCenterIds),
        organizationIds: toJS(v.organizationIds),
        sn: v.sn
      };
    });
  }

  @action
  setDeviceList(list) {
    this.deviceList = list;
    if (process.env.NODE_ENV !== 'production') {
      setCacheItem('deviceList', list);
    }
  }

  async getCameraList(data) {
    const res = await DeviceService.getCameraList(data);
    this.setDeviceList(res.result.resultList);
  }

  /**
   * 查询组织下设备数量（不包含子组织）
   * @param {string} orgId
   */
  queryCameraCountByOrgId(orgId) {
    const cameraList = this.cameraList.filter(
      v => v.organizationIds && v.organizationIds.indexOf(orgId) > -1
    );
    const onlineList = cameraList.filter(v => v.deviceData * 1 === 1);
    return {
      count: cameraList.length,
      onlineCount: onlineList.length
    };
  }

  /**
   * 查询组织下设备数量（包含子组织）
   * @param {Array} orgIds
   */
  queryCameraCountByIncludeOrgId(orgId) {
    let orgIds = window.GlobalStore.OrgStore.queryOrgIdsForParentOrgId(orgId);
    const cameraList = this.cameraArray.filter(item => {
      let flag = false;
      if (!Array.isArray(item.organizationIds)) {
        item.organizationIds = [];
      }
      for (let i = 0, l = item.organizationIds.length; i < l; i++) {
        if (orgIds.indexOf(item.organizationIds[i]) > -1) {
          flag = true;
          break;
        }
      }
      return flag;
    });
    const onlineList = cameraList.filter(v => v.deviceData * 1 === 1);
    return {
      count: cameraList.length,
      onlineCount: onlineList.length
    };
  }

  /**
   * 根据ID获取摄像机
   */
  queryCameraById(id) {
    return this.cameraList.find(
      v => v.id == id || v.manufacturerDeviceId == id
    );
  }

  /**
   * 根据ID集合获取摄像机列表
   * @param {array} ids
   */
  queryCameraListByIds(ids) {
    return this.cameraArray.filter(
      v => ids.indexOf(v.id) > -1 || ids.indexOf(v.manufacturerDeviceId) > -1
    );
  }

  /**
   * 查询组织下设备列表(不包含子组织)
   * @param {string} orgId
   */
  queryCameraByOrgId(orgId) {
    return this.cameraList.filter(
      v => v.organizationIds && v.organizationIds.indexOf(orgId) > -1
    );
  }

  /**
   * 查询组织下设备列表(含子组织)
   * @param {string} orgId
   */
  queryCameraByIncludeOrgId(orgId) {
    let orgIds = window.GlobalStore.OrgStore.queryOrgIdsForParentOrgId(orgId);
    const cameraList = this.cameraArray.filter(item => {
      let flag = false;
      if (!Array.isArray(item.organizationIds)) {
        item.organizationIds = [];
      }
      for (let i = 0, l = item.organizationIds.length; i < l; i++) {
        if (orgIds.indexOf(item.organizationIds[i]) > -1) {
          flag = true;
          break;
        }
      }
      return flag;
    });
    return cameraList;
  }

  /**
   * 根据摄像头id集合获取实时视频流集合 asyncGetCurrentVideoList
   *  不传球机类型则没有云台功能，默认云台为非国标控制
   *  球机播放flv，球机有云台控制功能，云台分为国标控制和非国标控制
   *  非球机播放hls，无云台控制
   * @param {array: number} cameraIds   : 摄像机id集合
   * @param {array} cameraNames : 摄像机名称集合
   * @param {array} cameraTypes : 摄像机类型集合：球机、非球机,
   * @param {array} ptzTypes    : 摄像机云台类型：国标、非国标,
   */
  async asyncGetCurrentVideoList(
    cameraIds,
    cameraNames,
    cameraTypes = [],
    ptzTypes,
    logData = {}
  ) {
    const results = await Promise.all(
      cameraIds.map((cameraId, k) => {
        let funcName =
          ( cameraTypes[k] === 100602 || cameraTypes[k] === 100605 ) ? 'asyncGetFlvVideo' : 'asyncGetHlsVideo';
        return DeviceService[funcName](cameraId, cameraNames[k], logData);
      })
    );
    const fileDatas = cameraIds.map((v, k) => {
      const cameraName = cameraNames[k];
      const item = results.find(x => v === x.cameraId);
      let data = undefined;
      if (!item || !item.file) {
        message.error(`未获取到${cameraName}的实时视频`);
      } else {
        const ptzControl = cameraTypes[k] === 100602 ? true : false;
        data = {
          cameraId: item.cameraId,
          file: item.file,
          title: {
            cameraName
          },
          isLiving: true,
          controls: {},
          ptzControl
        };
        if (ptzTypes && ptzTypes[k]) {
          data.ptzTypes = ptzTypes[k];
        }
      }
      return data;
    });
    return fileDatas;
  }

  async asyncGetHistoryVideo(options, logData = {}) {
    if (!options.cameraName) {
      const { deviceName } = this.queryCameraById(options.cameraId) || {};
      options.cameraName = deviceName;
    }
    return DeviceService.asyncGetHistoryVideo(options, logData);
  }

  asyncDownloadVideo(options) {
    if (!options.cameraName) {
      const { deviceName } = this.queryCameraById(options.cameraId) || {};
      options.cameraName = deviceName;
    }
    return DeviceService.asyncDownloadVideo(options).then(url => {
      if (url) {
        tagAToDownload({ url });
      } else {
        message.error('下载失败');
      }
      return url;
    });
  }

  getDeviceStatus(cameraIds) {
    return DeviceService.getDeviceStatus(cameraIds).then(result => {
      if(result.code === 200) {
        return result.result
      }
      return false
    })
  }
}
