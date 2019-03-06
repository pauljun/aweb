import { observable, action } from 'mobx';
import Service from '../../service/DeviceService';
import _ from 'lodash';

class DeviceEditStore {
  @observable
  formData = {};

  @action
  initData() {
    this.formData = {};
  }

  @action
  mergeFormData(data) {
    this.formData = Object.assign(this.formData, { ...data });
  }

  updateCameraInfo() {
    let options = {
      id: this.formData.id,
      cameraOrientation: this.formData.cameraOrientation,
      telephone: this.formData.telephone,
      installSite: this.formData.installSite,
      installMethod: this.formData.installMethod,
      isIdleDeal: this.formData.isIdleDeal,
      lyCameraInfo: {
        name: this.formData.deviceName,
        image_invert: this.formData.image_invert,
        video_quality: this.formData.video_quality,
        resolution: this.formData.resolution,
        zone: this.formData.zone,
        interval: this.formData.interval,
        count: this.formData.count,
        push: this.formData.push,
        osd: this.formData.osd
      }
    };
    for (let k1 in options) {
      if (options[k1] === undefined || options[k1] === 'undefined') {
        delete options[k1];
      }
      for (let k2 in options.lyCameraInfo) {
        if (
          options.lyCameraInfo[k2] === undefined ||
          options.lyCameraInfo[k2] === 'undefined'
        ) {
          delete options.lyCameraInfo[k2];
        }
      }
    }
    return Service.updateDeviceVo(options);
  }
}

export default new DeviceEditStore();
