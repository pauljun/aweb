import React from 'react';
import { providerMap } from '../../../components/Map/providerMap';
import MakerPoints from '../../../components/Map/MapComponent/component/MakerPoints';
import { map } from '../../../components/Map/MapComponent/mapContext';
import './index.scss';

@providerMap('map-point-label-layout')
@map
export default class MapPointLabelView extends React.Component {
  constructor(props) {
    super(props);
    this.markerPoint = null;
  }
  componentDidUpdate() {
    this.markerPoint.removeAllMarker();
    this.createMarker(this.props.point);
  }
  componentWillUnmount() {
    this.markerPoint = null;
  }
  createMarker = point => {
    if (!point || !point.latitude || !point.longitude) {
      return false;
    }
    setTimeout(() => {
      this.markerPoint && this.markerPoint.createMarker(point);
      this.props.mapMethods.setFitView();
    }, 10);
  };
  initMarkerPoint = markerPoint => {
    const { point } = this.props;
    this.markerPoint = markerPoint;
    this.createMarker(point);
  };

  render() {
    return (
      <MakerPoints init={this.initMarkerPoint} />
    );
  }
}
