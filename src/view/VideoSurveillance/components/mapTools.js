import React from 'react';
import { Icon, Popover } from 'antd';
import IconFont from '../../../components/IconFont';
import FullScreenLayout from '../../../components/FullScreenLayout';
import DeviceIcon from '../../../components/DeviceIcon';
import { CameraType, DeviceState } from '../../../libs/DeviceLib';
import { videoModule } from '../moduleContext';
import '../style/mapTools.scss';

const deviceType = CameraType.filter(v => v.value !== '-1');
const deviceData = DeviceState.filter(v => v.value !== '-1');

@videoModule
export default class MapTools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: deviceType.map(v => v.value),
      status: deviceData.map(v => v.value)
    };
  }
  changeMapMarker(changeType, code, flag) {
    const { clusterMarker } = this.props;
    const state = this.state;
    const index = state[changeType].indexOf(code);
    if (index > -1) {
      state[changeType].splice(index, 1);
    } else {
      state[changeType].push(code);
    }
    this.setState({ [changeType]: state[changeType] }, () => {
      clusterMarker.showCustomMarker(this.state.type, this.state.status);
    });
  }

  render() {
    const {
      startDrawRect,
      startDrawCircle,
      startDrawPolygon,
      clearDraw,
      videoLayoutDom,
      ProcessRef
    } = this.props;
    return (
      <div className="video-map-tools">
        <div className="tools-layout">
          <div className="map-draw-layout">
            <div
              className="tools-draw"
              onClick={() => startDrawRect && startDrawRect()}
            >
              <IconFont type="icon-Choose__Main1" theme="outlined" />
              框选
            </div>
            <div
              className="tools-draw"
              onClick={() => startDrawCircle && startDrawCircle()}
            >
              <IconFont type="icon-Choose__Main" theme="outlined" />
              圆选
            </div>

            <div
              className="tools-draw"
              onClick={() => startDrawPolygon && startDrawPolygon()}
            >
              <IconFont type="icon-Choose__Main2" theme="outlined" />
              多边形
            </div>
            <div
              className="tools-draw"
              onClick={() => clearDraw && clearDraw()}
            >
              <IconFont type="icon-Close_Main1" theme="outlined" />
              清除
            </div>
          </div>
          <FullScreenLayout
            className="tools-screen"
            ProcessRef={ProcessRef}
            getContainer={() => videoLayoutDom}
          />
        </div>
      </div>
    );
  }
}
