import React from 'react';
import PropTypes from 'prop-types';
import { createMarker, createIndexMaker } from '../factory/MapFactory';
import { map } from '../mapContext';
import { errorBoundary } from '../../../../utils/Decorator';
import {
  getAMapCameraIcon,
  getMapIndexContent
} from '../../../../utils/CameraIconTools';

@errorBoundary
@map
export default class MakerPoints extends React.Component {
  constructor(props) {
    super(props);
    this.markers = {};
  }
  componentDidMount() {
    this.props.init && this.props.init(this);
  }

  componentWillUnmount() {
    Object.keys(this.markers).map(id => {
      this.removeMarker(id);
    });
    this.markers = null;
  }

  /**
   * 创建marker
   * @param {string} id
   * @param {Object} points
   * @param {Object} options
   */
  createMarker(
    point,
    options,
    config = { active: false, icon: false, isMut: false, color: false }
  ) {
    this.removeMarker(point.id);
    let marker = createMarker(
      point,
      options,
      config.icon,
      config.active,
      config.color
    );
    this.markers[point.id] = marker;
    !config.isMut && marker.setMap(this.props.map);
    return marker;
  }
  /**
   * 创建markers
   * @param {Object} points
   * @param {Object} options
   */
  createMarkers(points, options = {}, config = { color: false }) {
    const { mapMethods } = this.props;
    const markers = points.map(item =>
      this.createMarker(item, options, {
        isMut: true,
        color: config.color
      })
    );
    mapMethods.addOverlayers(markers);
    return markers;
  }

  /**
   *(轨迹所用)
   * @param {object} param
   */
  createIndexMaker({
    point,
    index,
    options,
    active,
    color,
    activeColor,
    isMut = false
  }) {
    this.removeMarker(point.id);
    let marker = createIndexMaker({
      point,
      index,
      options,
      active,
      color,
      activeColor
    });
    this.markers[point.id] = marker;
    !isMut && marker.setMap(this.props.map);
    return marker;
  }

  /**
   * 创建markers(轨迹所用)
   * @param {Object} points
   * @param {Object} options
   */
  createIndexMarkers({ points, options = {}, color }) {
    const { mapMethods } = this.props;
    const markers = points.map((point, index) =>
      this.createIndexMaker({ point, index:index + 1, options, color })
    );
    mapMethods.addOverlayers(markers);
    return markers;
  }

  /**
   * 删除marker
   * @param {*} id
   */
  removeMarker(id) {
    if (this.markers[id]) {
      this.props.mapMethods.removerOverlayers(this.markers[id]);
      delete this.markers[id];
    }
  }

  /**
   * 删除所有markers
   *
   */
  removeAllMarker() {
    Object.keys(this.markers).map(id => this.removeMarker(id));
  }

  /**
   * 更新设备点位图标(轨迹所用)
   * @param {object} item
   * @param {boolean} active
   */
  updateIndexMarkersIcon({ id, index, active, color, activeColor }) {
    if (this.markers[id]) {
      this.markers[id].setContent(
        getMapIndexContent({ index, color, active, activeColor })
      );
      this.markers[id].setzIndex(active ? 102 : 100);
    }
  }

  /**
   * 更新设备点位图标
   * @param {object} item
   * @param {boolean} active
   */
  updateMarkersIcon(item, active, color) {
    if (this.markers[item.id]) {
      this.markers[item.id].setContent(
        getAMapCameraIcon(item, !!active, color)
      );
      this.markers[item.id].setzIndex(active ? 102 : 100);
    }
  }

  /**
   * 获取地图的Marker对象
   * @param {} id
   */
  getMarkerForId(id) {
    return this.MarkerMap[id] ? this.MarkerMap[id] : null;
  }

  /**
   * 设置marker content zindex
   * @param {string} id
   * @param {number} num
   */
  setMarkerZindex(id, num) {
    this.getMarkerForId(id).setZindex(num);
  }

  render() {
    return null;
  }
}
