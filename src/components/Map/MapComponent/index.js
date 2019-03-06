import React from 'react';
import Map from '../index.js';
import { Provider } from './mapContext';
import './style/map.scss';

export default class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.IbsMapDom = React.createRef();
    this.ele = document.createElement('div');
    this.initMapLayout = false;
    this.mapMethods = {};
    const {
      centerPoint = '',
      zoomLevelCenter = 1
    } = window.GlobalStore.UserStore.systemConfig;
    if (centerPoint) {
      const center = centerPoint.split(',');
      this.map = new Map(this.ele, { center });
      this.mapConfig = { center, zoom: zoomLevelCenter };
    } else {
      this.mapConfig = { zoom: zoomLevelCenter };
      this.map = new Map(this.ele);
      this.mapConfig.center = this.map.getCenter();
    }
    this.map.setZoom(+zoomLevelCenter);

    Object.getOwnPropertyNames(this.map.__proto__).map(key => {
      if (key !== 'constructor' || key !== 'init' || key !== 'destroy') {
        this.mapMethods[key] = this.map[key].bind(this.map);
      }
    });
    this.mapMethods.resetMap = this.resetMap;

    this.props.initMap && this.props.initMap(this.map);
  }
  componentDidMount() {
    this.IbsMapDom.current.appendChild(this.ele);
    this.initMapLayout = true;
    this.forceUpdate();
  }
  componentWillUnmount() {
    this.IbsMapDom.current.removeChild(this.ele);
    this.IbsMapDom = null;
    this.initMapLayout = null;
    this.ele = null;
    setTimeout(() => {
      this.map && this.map.destroy();
      this.map = null;
      this.mapMethods = null;
    }, 10);
  }

  getProviderValue() {
    return {
      map: this.map.map,
      mapMethods: this.mapMethods,
      mapConfig: this.mapConfig
    };
  }
  
  resetMap = () => {
    this.map.setZoomAndCenter(this.mapConfig.zoom, this.mapConfig.center);
  };

  render() {
    return (
      <Provider value={this.getProviderValue()}>
        <div
          className={`ibs-amap-wrapper ${
            this.props.className ? this.props.className : ''
          }`}
          ref={this.IbsMapDom}
        >
          {this.initMapLayout && this.props.children}
        </div>
      </Provider>
    );
  }
}
