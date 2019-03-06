import React from 'react';
import { providerMap } from '../../../components/Map/providerMap';
import { Input, Icon, message } from 'antd';
import IconFont from '../../../components/IconFont';
import MakerPoints from '../../../components/Map/MapComponent/component/MakerPoints';
import { map } from '../../../components/Map/MapComponent/mapContext';
import MapSearch from '../../../components/Map/MapComponent/component/MapSearch';
import './index.scss';

const Search = Input.Search;

@providerMap('map-point-label-layout')
@map
export default class MapMarkerVideo extends React.Component {
  constructor(props) {
    super(props);
    this.init = false;
    this.markerPoint = null;
    this.mapSearch = null;
    this.canClickSet = false;
  }

  componentDidUpdate() {
    if (!this.init) {
      this.init = true;
      const { mapMethods } = this.props;
      mapMethods.on('click', this.clickMap);
    }
  }
  componentWillUnmount() {
    this.init = null;
    this.markerPoint = null;
    this.mapSearch = null;
    this.canClickSet = null;
  }

  clickMap = event => {
    if (this.canClickSet) {
      this.markerDrage(null, event, [event.lnglat.lng, event.lnglat.lat]);
    }
  };

  setClickPopint = () => {
    this.canClickSet = !this.canClickSet;
    this.forceUpdate();
  };

  /**点位拖拽 */
  markerDrage(data, event, position) {
    const { point } = this.props;
    point.longitude = position[0];
    point.latitude = position[1];
    this.createMarker(point);
    this.mapSearch
      .searchAddressForPosition(position)
      .then(address => {
        this.mapSearch.searchPois(address.name).then(() => {
          this.props.onChangePoint &&
            this.props.onChangePoint({ position, point, ...address });
        });
      })
      .catch(this.catchSearch);
  }
  catchSearch = error => {
    console.log(error);
    message.warn('未知的位置！');
  };
  changeSearch = address => {
    this.searchPois(address, false);
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.point !== this.props.point) {
      this.setState({
        address: null,
        resultList: [],
        selectPoi: null,
        position: []
      });
      this.markerPoint.removeAllMarker();
      this.createMarker(nextProps.point);
    }
  }
  createMarker = point => {
    if (!point || !point.latitude || !point.longitude) {
      return false;
    }
    setTimeout(() => {
      this.markerPoint.createMarker(point, {
        draggable: true,
        dragend: this.markerDrage.bind(this)
      });
      this.props.mapMethods.setFitView();
    }, 10);
  };
  initMarkerPoint = markerPoint => {
    const { point } = this.props;
    this.markerPoint = markerPoint;
    this.createMarker(point);
  };
  initMapSearch = mapSearch => {
    this.mapSearch = mapSearch;
  };
  onSelectPoi = params => {
    const { point } = this.props;
    point.longitude = params.position[0];
    point.latitude = params.position[1];
    this.createMarker(point);
    this.props.onChangePoint && this.props.onChangePoint({ point, ...params });
  };
  render() {
    return (
      <React.Fragment>
        <MakerPoints init={this.initMarkerPoint} />
        <MapSearch init={this.initMapSearch} onSelectPoi={this.onSelectPoi} />
        <span
          className={`set-point ${this.canClickSet ? 'open' : 'close'}`}
          title={`${this.canClickSet ? '关闭' : '开启'}点击获取点位`}
          onClick={this.setClickPopint}
        >
          <IconFont type="icon-Add_Light" />
        </span>
      </React.Fragment>
    );
  }
}
