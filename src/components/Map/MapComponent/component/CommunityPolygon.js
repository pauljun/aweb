import React from 'react';
import { differenceWith } from 'lodash';
import { map } from '../mapContext';
import { errorBoundary } from '../../../../utils/Decorator';

@errorBoundary
@map
export default class CommunityPolygon extends React.Component {
  constructor(props) {
    super(props);
    this.polygons = [];
    this.villages = [];
    this.markPolygon = null;
  }

  componentDidMount() {
    const { villages, currentId, options = {} } = this.props;
    const { mapMethods } = this.props;
    this.createPolygons(villages, options);
    mapMethods.addOverlayers(this.polygons.filter(v => !!v));
    currentId && this.jumpCommunity(currentId);
  }

  componentWillReceiveProps(nextProps) {
    const { villages, options = {}, currentId } = nextProps;
    const { mapMethods } = this.props;
    this.computedVillages(villages)
      .then(diffArr => {
        console.warn('小区数据变化 -> 变化数据：', diffArr);
        this.clearPolygons();
        this.createPolygons(villages, options);
        mapMethods.addOverlayers(this.polygons.filter(v => !!v));
        currentId && this.jumpCommunity(currentId);
        //this.drawMakes();
      })
      .catch(() => console.warn('小区数据无变化！'));
  }
  componentWillUnmount() {
    this.clearPolygons();
    setTimeout(() => {
      this.villages = null;
      this.polygons = null;
      this.markPolygon = null;
    }, 10);
  }

  /**
   * 比较小区数据
   * @param {array} villages
   */
  computedVillages(villages) {
    return new Promise((resolve, reject) => {
      let diffArr = differenceWith(villages, this.villages, function(
        newValue,
        oldView
      ) {
        let flag = true;
        if (newValue.id !== oldView.id || newValue.rangeCoordinates !== oldView.rangeCoordinates) {
          flag = false;
        }
        return flag;
      });
      if (diffArr.length > 0) {
        resolve(diffArr);
      } else {
        reject();
      }
    });
  }

  restMap() {
    const { mapMethods } = this.props;
    mapMethods.resetMap();
  }

  /**
   * 清除小区边界
   */
  clearPolygons() {
    const { mapMethods } = this.props;
    if (this.polygons.length > 0) {
      mapMethods.removerOverlayers(this.polygons);
    }
    if (this.markPolygon) {
      mapMethods.removerOverlayers([this.markPolygon]);
    }

    this.villages = [];
    this.polygons = [];
  }

  /**
   * 批量创建边界
   * @param {*} villages
   * @param {*} options
   */
  createPolygons(villages, options) {
    let polygons = villages
      .map(item => this.createPolygon(item, options))
      .filter(v => !!v);
    this.villages = villages;
    this.polygons = polygons;
  }

  /**
   * 创建小区边界
   * @param {*} valigeInfo
   * @param {*} options
   */
  createPolygon(valigeInfo, options = {}) {
    let path;
    try {
      path = JSON.parse(valigeInfo.rangeCoordinates);
    } catch (e) {
      console.warn('格式化小区边界出错', valigeInfo.rangeCoordinates);
    }
    if (!path) {
      return false;
    }

    let polygon = new AMap.Polygon({
      zIndex: options.zIndex || 100,
      strokeWeight: options.strokeWeight || 2,
      path,
      fillOpacity: options.fillOpacity || 0.1,
      fillColor: options.fillColor || '#44AAFF',
      strokeColor: options.strokeColor || '#2299FF',
      strokeStyle: options.strokeStyle || 'dashed'
    });
    polygon.setExtData({
      id: valigeInfo.id,
      path,
      center: this.getCenterPoint(path),
      bound: this.setValigeFitView(path)
    });
    polygon.on('mouseover', () => {
      polygon.setOptions({
        fillOpacity: 0.3
      });
    });

    polygon.on('click', event => {
      options.click && options.click(event, polygon);
    });

    polygon.on('mouseout', () => {
      polygon.setOptions({
        fillOpacity: 0.1
      });
    });
    return polygon;
  }

  /**
   * 定义遮住模式
   */
  drawMakes() {
    const { map } = this.props;
    const outer = [
      new AMap.LngLat(-360, 90, true),
      new AMap.LngLat(-360, -90, true),
      new AMap.LngLat(360, -90, true),
      new AMap.LngLat(360, 90, true)
    ];
    const paths = this.polygons.map(v => v.getPath());
    let array = [outer].concat(paths);
    this.markPolygon = new AMap.Polygon({
      pathL: array,
      strokeColor: '#00eeff',
      strokeWeight: 1,
      fillColor: '#71B3ff',
      fillOpacity: 0.8,
      zIndex: 200
    });
    this.markPolygon.setPath(array);
    map.add(this.markPolygon);
  }

  /**
   * 跳转小区边界
   * @param {string} id
   */
  jumpCommunity(id) {
    const { mapMethods } = this.props;
    let polygon = this.getPolygon(id);
    if (polygon) {
      const data = polygon.getExtData();
      mapMethods.setBounds(data.bound);
      mapMethods.setCenter(data.center);
    }
  }

  /**
   * 获取小区图层
   * @param {string} id
   */
  getPolygon(id) {
    return this.polygons.filter(v => {
      let info = v ? v.getExtData() : {};
      return info.id === id;
    })[0];
  }

  /**
   * 计算小区的可视区
   * @param {*} path
   */
  setValigeFitView(path) {
    let lngs = [],
      lats = [];
    lngs = path.map(d => d.lng);
    lats = path.map(d => d.lat);
    let lngMax = Math.max(...lngs);
    let lngMin = Math.min(...lngs);
    let latMax = Math.max(...lats);
    let latMin = Math.min(...lats);
    let bounds = new AMap.Bounds([lngMin, latMin], [lngMax, latMax]);
    return bounds;
  }

  // 计算polygon的质心
  getCenterPoint(points) {
    let sum_x = 0;
    let sum_y = 0;
    let sum_area = 0;
    let p1 = points[1];
    for (let i = 2; i < points.length; i++) {
      let p2 = points[i];
      let area = this._getThreePointArea(points[0], p1, p2);
      sum_area += area;
      sum_x += (points[0].lng + p1.lng + p2.lng) * area;
      sum_y += (points[0].lat + p1.lat + p2.lat) * area;
      p1 = p2;
    }
    let xx = sum_x / sum_area / 3;
    let yy = sum_y / sum_area / 3;
    return new AMap.LngLat(xx, yy);
  }

  _getThreePointArea(p0, p1, p2) {
    let area = 0.0;
    area =
      p0.lng * p1.lat +
      p1.lng * p2.lat +
      p2.lng * p0.lat -
      p1.lng * p0.lat -
      p2.lng * p1.lat -
      p0.lng * p2.lat;
    return area / 2;
  }
  render() {
    return null;
  }
}
