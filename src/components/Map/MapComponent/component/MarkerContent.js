import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { createContentMarker } from '../factory/MapFactory';
import { errorBoundary } from '../../../../utils/Decorator';
import { map } from '../mapContext';


@errorBoundary
@map
export default class MarkerContent extends React.Component {
  constructor(props) {
    super(props);
    this.markers = {};
  }
  componentWillMount() {
    this.props.init && this.props.init(this);
  }

  componentWillUnmount() {
    Object.keys(this.markers).map(id => {
      this.removeContentMarker(id);
    });
    this.markers = null;
  }

  /**
   * marker模拟InfoWindow
   * @param {*} Content
   * @param {*} position
   */
  createContentMarker(Content, position, { id, className, offset }) {
    this.removeContentMarker(id);
    let marker = createContentMarker(Content, position, offset, id, className);
    this.markers[id] = marker;
    marker.setMap(this.props.map);
    return marker;
  }

  /**
   * 删除marker模拟InfoWindow
   * @param {*} id
   */
  removeContentMarker(id) {
    if (this.markers[id]) {
      let dom = document.getElementById(id);
      if (dom) {
        ReactDOM.unmountComponentAtNode(dom);
        dom.remove();
      }
      this.props.mapMethods.removerOverlayers(this.markers[id]);
      delete this.markers[id];
    }
  }

  /**
   * 获取地图的Marker对象主要用于获取模拟InfoWindow
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
