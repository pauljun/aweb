import React from 'react';
import { Popover } from 'antd';
import IconFont from 'src/components/IconFont';
import DeviceIcon from 'src/components/DeviceIcon';
import { DeviceType, DeviceState } from 'src/libs/DeviceLib';
import { map } from '../mapContext';
import '../style/resource-layer.scss';

const deviceType = DeviceType.filter(v => v.value !== '-1');
const deviceData = DeviceState.filter(v => v.value !== '-1');

const mapFeaturesLib = [
  { value: 'bg', label: '地图背景', icon: 'icon-Imge_Main' },
  { value: 'point', label: 'POI点', icon: 'icon-Map_Main' },
  { value: 'road', label: '道路', icon: 'icon-_Car__Main' },
  { value: 'building', label: '建筑物', icon: 'icon-_Community__Main' }
];

@map
export default class ResourceLayer extends React.Component {
  constructor(props) {
    super(props);
    this.deviceType = deviceType;
    if (props.excludeTypes && props.excludeTypes.length > 0) {
      this.deviceType = this.deviceType.filter(
        v => props.excludeTypes.indexOf(v.value) === -1
      );
    }
    this.state = {
      type: this.deviceType.map(v => v.value),
      status: deviceData.map(v => v.value),
      features: mapFeaturesLib.map(v => v.value)
    };
  }
  changeMapMarker(changeType, code) {
    const state = this.state;
    const index = state[changeType].indexOf(code);
    if (index > -1) {
      state[changeType].splice(index, 1);
    } else {
      state[changeType].push(code);
    }
    this.setState({ [changeType]: state[changeType] }, () => {
      const types = this.state.type.join(',').split(',');
      const status = this.state.status.join(',').split(',');
      this.props.showCustomMarker(
        types.filter(v => v !== ''),
        status.filter(v => v !== '')
      );
    });
  }
  changeMapFeatures(code) {
    const { mapMethods } = this.props;
    const { features } = this.state;
    const index = features.indexOf(code);
    if (index > -1) {
      features.splice(index, 1);
    } else {
      features.push(code);
    }
    this.setState({ features });
    mapMethods.setFeatures(features);
  }
  getPopupContent = () => {
    const { hideFeatures } = this.props;
    const { type, status, features } = this.state;
    return (
      <div className="map-type-popup-layout">
        <div className="type-part">
          <div className="type-name">设备种类</div>
          <div className="type-content">
            {this.deviceType.map(item => (
              <div
                className={`type-item ${
                  type.indexOf(item.value) > -1 ? 'active' : ''
                } `}
                key={item.value}
                onClick={() => this.changeMapMarker('type', item.value)}
              >
                <span className="icon">
                  <DeviceIcon type={item.value} theme="outlined" />
                </span>
                <span className="lable-text">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="type-part">
          <div className="type-name">在离线状态：</div>
          <div className="type-content">
            {deviceData.map(item => (
              <div
                className={`type-item ${
                  status.indexOf(item.value) > -1 ? 'active' : ''
                } `}
                key={item.value}
                onClick={() => this.changeMapMarker('status', item.value)}
              >
                <span className="icon">
                  <IconFont
                    type={
                      item.value === '1'
                        ? 'icon-OnLine_Main'
                        : 'icon-OffLine_Main'
                    }
                    theme="outlined"
                  />
                </span>
                <span className="lable-text">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        {this.props.children}
        {hideFeatures !== true && (
          <div className="type-part">
            <div className="type-name">地图元素：</div>
            <div className="type-content">
              {mapFeaturesLib.map(item => (
                <div
                  className={`type-item ${
                    features.indexOf(item.value) > -1 ? 'active' : ''
                  } `}
                  key={item.value}
                  onClick={() => this.changeMapFeatures(item.value)}
                >
                  <span className="icon">
                    <IconFont type={item.icon} theme="outlined" />
                  </span>
                  <span className="lable-text">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  render() {
    return (
      <Popover
        trigger={'click'}
        overlayClassName="resource-popup-layout"
        content={this.getPopupContent()}
        getPopupContainer={() => document.querySelector('.tools-wrapper') ? document.querySelector('.tools-wrapper') : document.querySelector('.tools-resource-layer') }
        placement="bottomLeft"
      >
        <div className="tools-resource-layer">
          <IconFont type="icon-Layer_Main" theme="outlined" />
          资源
          <IconFont type="icon-Arrow_Small_Down_Mai" theme="outlined" />
        </div>
      </Popover>
    );
  }
}
