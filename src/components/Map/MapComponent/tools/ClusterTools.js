import { createMarker } from '../factory/MapFactory';
import { differenceWith } from 'lodash';

export default class ClusterTools {
  markers = [];
  points = [];
  clearMarkers() {
    this.markers = [];
    this.points = [];
  }
  setPointsAndCreateMarks(points, options = {}) {
    this.points = points;
    this.points
      .filter(item => {
        return !!item.longitude && !!item.latitude;
      })
      .map(item => {
        this.markers.push(createMarker(item, options));
      });
  }

  getAllMarkers() {
    return this.markers;
  }
  getAllPoints() {
    return this.points.filter(item => {
      return !!item.longitude && !!item.latitude;
    });
  }
  getClusterMarkerForId(id) {
    return this.markers.filter(item => {
      let data = item.getExtData();
      return data.id === id;
    })[0];
  }

  comparePoints(newPoints) {
    return new Promise((resolve, reject) => {
      let list = differenceWith(newPoints, this.points, function(
        newValue,
        oldView
      ) {
        let flag = true;
        if (
          newValue.deviceName !== oldView.deviceName ||
          newValue.id !== oldView.id ||
          newValue.deviceData !== oldView.deviceData ||
          newValue.latitude !== oldView.latitude ||
          newValue.longitude !== oldView.longitude
        ) {
          flag = false;
        }
        return flag;
      });
      list.length > 0 ? resolve(list) : reject();
    });
  }

  /**
   * 根据id删除marker
   */
  removerMakers(ids) {
    let newMarkers = [];
    this.markers.map(item => {
      let data = item.getExtData();
      if (ids.indexOf(data.id) === -1) {
        newMarkers.push(item);
      }
    });
    this.markers = newMarkers;
  }
  /**
   * 新增markers
   */
  addMarkers(points, options) {
    return points
      .filter(item => {
        return !!item.longitude && !!item.latitude;
      })
      .map(item => {
        let marker = createMarker(item, options);
        this.markers.push(marker);
        return marker;
      });
  }

  /**
   * 更新点位，计算原来不相同的点位，删除不相同的，然后在批量新增
   */
  updatePoints(points = [], options = {}, clusterLayer) {
    return this.comparePoints(points)
      .then(deffPoints => {
        console.warn('聚合图层组件 -> 得到设备变化的列表！', deffPoints);
        let ids = deffPoints.map(v => v.id);
        let diffMarkers = this.getClusterMarkerForIds(ids);
        clusterLayer.removeMarkers(diffMarkers);
        this.removerMakers(ids);
        let newMarkers = this.addMarkers(deffPoints, options);
        clusterLayer.addMarkers(newMarkers);
        this.points = points;
      })
      .catch(() => console.warn('聚合图层组件 -> 设备无变化！'));
  }

  getClusterMarkerForIds(ids) {
    return this.markers.filter(item => {
      let data = item.getExtData();
      return ids.indexOf(data.id) > -1;
    });
  }
  constructor() {}
}
