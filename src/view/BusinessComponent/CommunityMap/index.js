import React from 'react';
import MapComponent from '../../../components/Map/MapComponent/index.js';
import ClusterMarker from '../../../components/Map/MapComponent/component/ClusterMarker';
import CommunityPolygon from '../../../components/Map/MapComponent/component/CommunityPolygon';
import MapResetTools from '../../../components/Map/MapComponent/component/MapResetTools';
import InfoWindow from '../../../components/Map/MapComponent/component/InfoWindow';
import CommunitySelect from './component/communitySelect';
import VideoView from './component/VideoView';
import { inject, observer } from 'mobx-react';
import { message } from 'antd';
import { db, wifi } from 'src/libs/DeviceLib';

import './index.scss';

@inject('DeviceStore')
class CommunityMap extends React.Component {
  constructor(props) {
    super(props);
    this.clusterMarker = null;
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
  componentDidMount(){
    const { changeZoom=false ,zoomNum}=this.props
    changeZoom&&this.map.setZoomAndCenter(zoomNum)
  }
  componentWillUnmount() {
    this.clusterMarker = null;
    this.infoWindow = null;
  }

  getVideoFileData(info) {
    let { DeviceStore } = this.props;
    const id = info.manufacturerDeviceId || info.cid;
    const name = info.deviceName || info.name;
    const deviceType = info.deviceType;
    const ptzType =
      info.extJson && info.extJson.cameraInfo && info.extJson.cameraInfo.type;
    return DeviceStore.asyncGetCurrentVideoList(
      [id],
      [name],
      [deviceType],
      [ptzType]
    ).then(fileData => {
      return fileData[0].file;
    });
  }
  markerClick(data) {
    if (data.manufacturerDeviceType * 1 !== 103401) {
      return message.warning('当前设备不支持看视频！');
    }
    if (!data.longitude || !data.latitude) {
      return message.warning('当前设备没有设置经纬度！');
    }
    let position = [data.longitude, data.latitude];
    console.log(data,99999999)
    //this.map.setZoomAndCenter(17, position);
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
  async setPlayMethods(options) {
    const { info } = this.state;
    const { DeviceStore } = this.props;
    const { isLiving, startTime, endTime } = options;
    if (!isLiving) {
      let res = await DeviceStore.asyncGetHistoryVideo({
        cameraId: info.manufacturerDeviceId,
        startTime,
        endTime
      });
      info.isLiving = false;
      info.historyList = res;
    } else {
      info.isLiving = true;
    }
    this.setState({ info });
  }
  closeVideo() {
    this.setState({ visible: false, info: {} });
  }
  render() {
    const { children, points = [], villages = [], showVideoView=true} = this.props;
    let { visible, center, info, key } = this.state;
    return (
      <MapComponent initMap={this.initMap}>
        <ClusterMarker
          filterResource={true}
          excludeTypes={[db.value, wifi.value]}
          options={{
            click: this.markerClick.bind(this)
          }}
          points={points}
          init={this.initClusterMarker}
        />
        <CommunityPolygon villages={villages} ref={this.props.forwardRef} />
        <MapResetTools />
        {/* <CommunitySelect clusterMarker={this.clusterMarker} /> */}
          {
            showVideoView&&<InfoWindow
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
        }
        {React.Children.map(children, child =>
          React.cloneElement(child, { clusterMarker: this.clusterMarker })
        )}
      </MapComponent>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <CommunityMap {...props} forwardRef={ref} />
));
