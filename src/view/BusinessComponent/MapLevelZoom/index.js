import React from 'react';
import { providerMap } from '../../../components/Map/providerMap';
import { map } from '../../../components/Map/MapComponent/mapContext';
import MakerPoints from '../../../components/Map/MapComponent/component/MakerPoints';
import ClusterMarker from '../../../components/Map/MapComponent/component/ClusterMarker';
import { uuid } from '../../../utils';
import centerImage from '../../../assets/img/MapCenter.svg';
import { inject } from 'mobx-react';
import './index.scss';

const id = uuid();

@inject('DeviceStore')
@providerMap('map-zoom-center-layout')
@map
export default class MapPointLabelView extends React.Component {
  constructor(props) {
    super(props);
    this.markerLayout = null;
    this.points = this.props.DeviceStore.cameraArray
  }
  editable = true;

  componentDidMount() {
    this.props.init && this.props.init(this);
    setTimeout(() => {
      const { mapMethods } = this.props;
      this.mapChange();
      mapMethods.on('zoomchange', this.mapChange);
      mapMethods.on('moveend', this.mapChange);
    }, 100);
  }
  componentWillUnmount() {
    const { mapMethods } = this.props;
    this.markerLayout = null;
    this.points = null
    mapMethods.off('zoomchange', this.mapChange);
    mapMethods.off('moveend', this.mapChange);
  }
  initMarkerLayout = markerLayout => {
    this.markerLayout = markerLayout;
  };
  mapChange = () => {
    const { mapMethods, editable=true } = this.props;
    if(!this.editable) {
      return
    }
    if(!editable) {
      this.editable = editable;
    }
    const info = mapMethods.getZoomAndCenter();
    this.markerLayout.createMarker(
      {
        id,
        longitude: info.center.lng,
        latitude: info.center.lat,
        deviceName: '当前中心点'
      },
      {
        w: 28,
        h: 40,
        offset: [-14, -20],
        draggable: editable,
        dragend: (point, event, position) => {
          mapMethods.setCenter(position);
        }
      },
      { icon: centerImage }
    );
    this.props.mapChange && this.props.mapChange(info);
  };
  setMapZoomCenter = info => {
    const { mapMethods } = this.props;
    mapMethods.setZoomAndCenter(info.zoom, info.center);
  };
  render() {
    const {showPoints}=this.props
    return (
      <React.Fragment>
        <MakerPoints init={this.initMarkerLayout} />
        {
          showPoints?<ClusterMarker points={this.points} />:''
        }
      </React.Fragment>
    );
  }
}