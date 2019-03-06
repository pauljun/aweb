import React from 'react';
import { getKeyValue } from '../../../../libs/Dictionary';

export default class DeviceInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { info = {} } = this.props;
    const { lyCameraInfo = {} } = info;
    return (
      <div className="device-info-layout">
        <h3 className="part-title">设备信息</h3>
        <div className="content-layout">
          <div className="content-item">
            <div>设备类型:</div>
            <div>{getKeyValue('deviceType', info.cameraType)}</div>
          </div>
          <div className="content-item">
            <div>设备型号:</div>
            <div>{lyCameraInfo.type}</div>
          </div>
          <div className="content-item">
            <div>设备品牌:</div>
            <div>{lyCameraInfo.brand_str || '未知'}</div>
          </div>
          <div className="content-item">
            <div>SN码:</div>
            <div>{info.sn}</div>
          </div>
          <div className="content-item">
            <div>CID码:</div>
            <div>{info.cid}</div>
          </div>
          <div className="content-item">
            <div>云台:</div>
            <div>{lyCameraInfo.platform === '1' ? '是' : '否'}</div>
          </div>
          <div className="content-item">
            <div>视频储存周期:</div>
            <div>7天</div>
          </div>
        </div>
      </div>
    );
  }
}
