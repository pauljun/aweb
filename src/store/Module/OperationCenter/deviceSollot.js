import Service from 'src/service/DeviceService';

class OperationCenterDeviceSollotStore {
  /**
   * 列表查询所有设备
   */
  getAllList(options) {
    return Service.getCameraList(options);
  }

  /**地图查询所有设备 */
  getMapAllList(params) {
    return Service.getCameraList(params);
  }

  /**
   * 查询当前运营中心下设备
   */
  getList(options) {
    return Service.getCameraListByOcId(options);
  }

  /**
   * 分配设备
   */
  updateDeviceOcId(params) {
    return Service.updateDeviceOcId(params);
  }
}

export default new OperationCenterDeviceSollotStore();
