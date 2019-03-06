import React from 'react';
import MapComponent from '../../../components/Map/MapComponent/index.js';
import ClusterMarker from '../../../components/Map/MapComponent/component/ClusterMarker';
import InfoWindow from '../../../components/Map/MapComponent/component/InfoWindow';
import MapResetTools from '../../../components/Map/MapComponent/component/MapResetTools';
import VideoView from './component/VideoView';
import { mj, zj, wifi } from 'src/libs/DeviceLib';
import { message } from 'antd';
import { inject } from 'mobx-react';
import { cloneDeep } from 'lodash';

@inject('DeviceStore')
export default class MapMarkerVideo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.clusterMarker = null;
    this.infoWindow = null;
    this.map = null;
    this.state = {
      info: null,
      center: [0, 0],
      visible: false,
      key: Math.random()
    };
  }
  initMap = map => {
    this.map = map;
  };
  initClusterMarker = clusterMarker => {
    this.clusterMarker = clusterMarker;
    this.forceUpdate();
  };
  initInfoWindow = infoWindow => {
    this.infoWindow = infoWindow;
  };
  componentWillUnmount() {
    this.clusterMarker = null;
    this.infoWindow = null;
  }
  markerClick(data) {
    if (data.manufacturerDeviceType * 1 !== 103401) {
      return message.warning('当前设备不支持看视频！');
    }
    if (!data.longitude || !data.latitude) {
      return message.warning('当前设备没有设置经纬度！');
    }
    data.isLiving = true;
    data.historyList = undefined;
    let position = [data.longitude, data.latitude];
    this.getVideoFileData(data).then(file => {
      data.file = file;
      this.setState({
        info: data,
        center: position,
        visible: true,
        key: Math.random()
      });
    });
  }
  getVideoFileData(info) {
    let { DeviceStore, logData } = this.props;
    const id = info.manufacturerDeviceId || info.id;
    const name = info.deviceName || info.name;
    const deviceType = info.deviceType;
    const ptzType =
      info.extJson && info.extJson.cameraInfo && info.extJson.cameraInfo.type;
    return DeviceStore.asyncGetCurrentVideoList(
      [id],
      [name],
      [deviceType],
      [ptzType],
      logData
    ).then(fileData => {
      return fileData[0].file;
    });
  }

  async setPlayMethods(options) {
    const info = cloneDeep(this.state.info);
    const { DeviceStore, logData } = this.props;
    const { isLiving, startTime, endTime } = options;
    if (!isLiving) {
      let res = await DeviceStore.asyncGetHistoryVideo(
        {
          cameraId: info.manufacturerDeviceId,
          startTime,
          endTime
        },
        logData
      );
      if (res.fragments.length === 0) {
        message.warn('未获取到视频！');
      } else {
        info.isLiving = false;
        info.historyList = res;
      }
    } else {
      info.isLiving = true;
    }
    this.setState({ info });
  }
  closeVideo() {
    this.setState({ visible: false, info: {} });
  }
  render() {
    const { DeviceStore, children, points } = this.props;
    const { info, center, visible, key } = this.state;
    return (
      <MapComponent initMap={this.initMap}>
        <ClusterMarker
          options={{
            click: this.markerClick.bind(this)
          }}
          filterResource={true}
          excludeTypes={[mj.value, zj.value, wifi.value]}
          points={points ? points : DeviceStore.deviceArray}
          init={this.initClusterMarker}
        />
        <InfoWindow
          visible={visible}
          center={center}
          init={this.initInfoWindow}
          content={
            <VideoView
              info={info}
              key={key}
              closeVideo={() => this.closeVideo()}
              setPlayMethods={options => this.setPlayMethods(options)}
            />
          }
        />
        <MapResetTools />
        {React.Children.map(children, child =>
          React.cloneElement(child, { clusterMarker: this.clusterMarker })
        )}
      </MapComponent>
    );
  }
}
