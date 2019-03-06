import React from 'react';
import ClusterTools from '../tools/ClusterTools';
import { IbsAMapCustomStyles } from '../../config';
import { errorBoundary } from '../../../../utils/Decorator';
import ResourceLayer from './ResourceLayer';
import { map } from '../mapContext';
import { DeviceType, DeviceState } from 'src/libs/DeviceLib';
const deviceType = DeviceType.filter(v => v.value !== '-1');
const deviceData = DeviceState.filter(v => v.value !== '-1');

@errorBoundary
@map
export default class ClusterMarker extends React.Component {
  constructor(props) {
    super(props);
    this.ClusterTools = new ClusterTools();
    this.clusterLayer = null;
    this.types = deviceType.map(v => v.value);
    this.status = deviceData.map(v => v.value);
  }
  componentWillMount() {
    this.props.init && this.props.init(this);
  }
  componentDidMount() {
    this.createClusterLayer(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { points = [], options = {} } = nextProps;
    if (this.props.points !== points) {
      this.clearMarkers();
      this.ClusterTools.setPointsAndCreateMarks(points, options);
      this.showCustomMarker(this.types, this.status);
    }
    // this.ClusterTools.updatePoints(points, options, this.clusterLayer);
  }
  componentWillUnmount() {
    this.clearMarkers();
    this.ClusterTools = null;
    this.props.mapMethods.removerOverlayers(this.clusterLayer);
    this.clusterLayer = null;
    this.types = null;
    this.status = null;
  }
  createClusterLayer(props) {
    const { points = [], options = {} } = props;
    const { map } = this.props;
    //TODO 数据交给ClusterTools管理
    this.ClusterTools.setPointsAndCreateMarks(points, options);
    let markersList = this.ClusterTools.getAllMarkers();
    //TODO 创建图层
    AMap.plugin('AMap.MarkerClusterer', () => {
      this.clusterLayer = new AMap.MarkerClusterer(map, markersList, {
        styles: IbsAMapCustomStyles,
        minClusterSize: 2,
        gridSize: 40,
        maxZoom: 17,
        averageCenter: false
      });
      if (options.clusterclick) {
        this.clusterLayer.on('click', function(e) {
          options.clusterclick(e);
        });
      }
    });
  }
  clearMarkers() {
    this.clusterLayer.clearMarkers();
    this.ClusterTools.clearMarkers();
  }
  getAllPoints() {
    return this.ClusterTools.getAllPoints();
  }

  showCustomMarker(types, status) {
    let AllMarkers = this.ClusterTools.getAllMarkers();
    this.clusterLayer.clearMarkers();
    let markers = AllMarkers.filter(item => {
      const info = item.getExtData();
      const hasType = types.findIndex(v => v == info.type) > -1;
      const hasStatus = status.findIndex(v => v == info.status) > -1;
      return hasType && hasStatus;
    });
    this.currentMakers = markers;
    this.clusterLayer.addMarkers(markers);
    this.status = status;
    this.types = types;
  }

  render() {
    if (!this.props.filterResource) {
      return null;
    } else {
      return (
        <ResourceLayer
          excludeTypes={this.props.excludeTypes}
          hideFeatures={this.props.hideFeatures}
          showCustomMarker={(...args) => this.showCustomMarker(...args)}
        >
          {this.props.children}
        </ResourceLayer>
      );
    }
  }
}
