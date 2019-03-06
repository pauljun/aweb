import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Slider } from 'antd';
import DeviceService from '../../../service/DeviceService';
import * as util from 'src/utils';
import CustomSlider from './CustomSlider';
import '../style/camera-control.scss';

const layerPos = [
  'up',
  'rightup',
  'right',
  'rightdown',
  'down',
  'leftdown',
  'left',
  'leftup'
];
const zoomType = [
  'zoomin',
  'zoomout'
]
export default class CameraControl extends Component {
  static contextTypes = {
    fileData: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.token = null;
    this.isGB = false;
    // 国标摄像机
    // 控制速度0-3
    // 可以控制云台转动和焦距，持续控制

    // 非国标
    // 控制速度0-255
    // 上下控制较明显、左右不明显
    // 不能控制焦距，只能步骤控制（点控）

    this.state = {
      speed: this.isGB ? 2 : 20,
      show: false
    };
  }

  componentDidMount() {
    const { fileData } = this.context;
    DeviceService.getDeviceById(fileData.id).then(res => {
      try {
        this.isGB = res.result.extJson.cameraInfo.type.toLowerCase() === 'gb';
      } catch (e) {
        console.warn('fileData.extJson.cameraInfo', res.result);
      }
      this.setState({
        speed: this.isGB ? 2 : 20,
        show: false
      });
    });
  }

  bindEvents = () => {
    layerPos.map(v => {
      this[v].addEventListener('mousedown', this.controlHandle)
      this[v].addEventListener('mouseup', this.cancleControl)
    })
    zoomType.map(v => {
      this[v].addEventListener('mousedown', this.zoomAction)
      this[v].addEventListener('mouseup', this.cancleControl)
    })
  }

  removeEvents = () => {
    layerPos.map(v => {
      this[v].removeEventListener('mousedown', this.controlHandle)
      this[v].removeEventListener('mouseup', this.cancleControl)
    })
    zoomType.map(v => {
      this[v].removeEventListener('mousedown', this.zoomAction)
      this[v].removeEventListener('mouseup', this.cancleControl)
    })
  }

  setSpeed = (speed) => {
    this.setState({ speed });
  }

  // 调焦
  zoomAction = (e) => {
    if (this.isGB) {
      // 国标相机才能调焦
      this.controlHandle(e)
    }
  }

  controlHandle = (e, isStop=false) => {
    // console.log(e.target);
    const type = e.target.dataset.type;
    const { fileData } = this.context;
    DeviceService.ptzControl({
      cameraId: fileData.manufacturerDeviceId,
      direction: type,
      isGB: this.isGB,
      speed: this.state.speed,
      isStop: isStop,
      token: this.token
    }).then(token => {
      this.token = token;
    });
  }

  cancleControl = (e) => {
    if (this.isGB) {
      setTimeout(() => {
        this.controlHandle(e, true)
      }, 100);
    }
  }

  onDoubleClick = e => {
    util.stopPropagation(e);
  };

  setVisible = () => {
    const show = !this.state.show;
    if(show) {
      this.setState({ show }, this.bindEvents)
    } else {
      this.removeEvents();
      this.setState({ show })
    }
  }

  render() {
    let { show } = this.state;
    return (
      <div className="camera-control-layer" onDoubleClick={this.onDoubleClick}>
        <span
          className={`ptz-btn ${show ? 'open' : ''}`}
          onClick={this.setVisible}
        >
          <span className="ptz-status-icon" />
        </span>
        {show && (
          <div className="layout-content">
            <div className="camera-control-wrapper">
              <ul>
                {layerPos.map(item => (
                  <li key={item} className={`camera-control-${item}`}>
                    <a
                      className="control-item" data-type={item}
                      ref={direction => this[item] = direction}
                    >
                      <span />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="center-layer" />
            </div>
            <div className="box-focal">
              <span
                className="zoomin"
                data-type='zoomin'
                ref={zoomin => this.zoomin = zoomin}
              >
                <Icon type="plus-circle-o" title="拉近" />
              </span>
              <span
                className="zoomout"
                data-type='zoomout'
                ref={zoomout => this.zoomout = zoomout}
              >
                <Icon type="minus-circle-o" title="推远" />
              </span>
            </div>
            <div className="box-speed">
              <span className="box-speed-icon" />
              <CustomSlider 
                min={0}
                max={this.isGB ? 3 : 255}
                defaultPercent={this.isGB ? 2/3 : 20/255}
                onChange={this.setSpeed}
              />
              {/* <Slider
                min={0}
                max={this.isGB ? 3 : 255}
                defaultValue={this.isGB ? 2 : 20}
                onChange={this.setSpeed}
              /> */}
            </div>
          </div>
        )}
      </div>
    );
  }
}
