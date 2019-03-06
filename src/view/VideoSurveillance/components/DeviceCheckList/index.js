import React from 'react';
import { Icon, Checkbox, Button, message } from 'antd';
import { AutoSizer, List } from 'react-virtualized';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import DeviceIcon from '../../../../components/DeviceIcon';
import { exitFullscreen } from '../../../../utils/FullScreen';

import './index.scss';
@withRouter
@inject('TabStore')
export default class DeviceCheckList extends React.Component {
  constructor(props) {
    super(props);
    this.selectArr = [];
  }
  clickDeviceItem(item) {
    const { onSelectDevice } = this.props;
    onSelectDevice && onSelectDevice(item);
  }
  deleteDeviceItem(item) {
    const { deleteDeviceItem } = this.props;
    let index = this.selectArr.findIndex(v => v.id === item.id);
    index > -1 && this.selectArr.splice(index, 1);
    deleteDeviceItem && deleteDeviceItem(item);
  }
  clearSelect() {
    const { clearSelect } = this.props;
    this.selectArr = [];
    clearSelect();
  }
  onCheckItem(item) {
    let index = this.selectArr.findIndex(v => v.id === item.id);
    if (index > -1) {
      this.selectArr[index].cheched = !this.selectArr[index].cheched;
      this.forceUpdate();
    }
  }
  selectAllItem(flag) {
    this.selectArr.forEach(item => {
      item.cheched = !flag;
    });
    this.forceUpdate();
  }
  goVideoPage() {
    const { TabStore, history } = this.props;
    const ids = this.selectArr.filter(v => v.cheched).map(v => v.id);
    if (ids.length > 16) {
      return message.warn('最多同时查看16个设备视频！');
    }
    exitFullscreen();
    TabStore.goPage({
      moduleName: 'VideoSurveillance',
      state: { mapMode: false, selectIds: ids },
      history
    });
  }
  goView = type => {
    const { TabStore, history, deviceList } = this.props;
    let list = [];
    this.selectArr.forEach((item, index) => {
      item.cheched && list.push(deviceList[index]);
    });
    exitFullscreen();
    TabStore.goPage({
      moduleName: 'baselib',
      childModuleName: type === 'face' ? 'faceLibrary' : 'bodyLibrary',
      state: { mapMode: false, cameraList: list },
      history
    });
  };
  rowRender({ key, index, style }) {
    const { deviceList } = this.props;
    return (
      <div style={style} className={`device-item`} key={key}>
        <div>
          {(() => {
            let item = this.selectArr.filter(
              v => v.id === deviceList[index].id
            )[0];
            let checked = item ? item.cheched : false;
            return (
              <Checkbox
                onChange={() => this.onCheckItem(deviceList[index])}
                checked={checked}
              />
            );
          })()}

          <DeviceIcon
            type={deviceList[index].deviceType}
            status={deviceList[index].deviceData}
          />
          {deviceList[index].manufacturerDeviceType === 103401 ? (
            <a onClick={() => this.clickDeviceItem(deviceList[index])}>
              {deviceList[index].deviceName}
            </a>
          ) : (
            <span>{deviceList[index].deviceName}</span>
          )}
        </div>
        <span
          className="delete-item"
          onClick={() => this.deleteDeviceItem(deviceList[index])}
        >
          删除
        </span>
      </div>
    );
  }
  computedListStatus(deviceList) {
    let onlineList = [],
      offlineList = [];
    for (let i = 0, l = deviceList.length; i < l; i++) {
      let item = deviceList[i];
      if (this.selectArr.findIndex(v => v.id === item.id) === -1) {
        this.selectArr.push({ id: item.id, cheched: true });
      }
      if (item.deviceData * 1 === 0) {
        offlineList.push(item);
      } else {
        onlineList.push(item);
      }
    }
    return {
      list: onlineList.concat(offlineList),
      onlineCount: onlineList.length,
      offlineCount: offlineList.length
    };
  }

  render() {
    const { deviceList, className } = this.props;
    const result = this.computedListStatus(deviceList);
    const isSelectItem = this.selectArr.filter(v => v.cheched);
    const isNoSelectItem = this.selectArr.filter(v => !v.cheched);
    const disabledGoPage = isNoSelectItem.length === deviceList.length;
    return (
      <div
        className={`video-device-check-list-layout ${
          className ? className : ''
        }`}
      >
        <div className="title-part">
          <span>
            已选设备（
            {deviceList.length}
            个）
          </span>
          <Icon type="close" onClick={() => this.clearSelect()} />
        </div>
        <div className="content-part">
          <div className="content-tools">
            <span>
              <Checkbox
                onChange={() => this.selectAllItem(isNoSelectItem.length === 0)}
                checked={isNoSelectItem.length === 0}
                indeterminate={
                  isNoSelectItem.length > 0 && isSelectItem.length > 0
                }
              />
              全选
            </span>
            <span onClick={() => this.clearSelect()}>清空</span>
          </div>
          <div className="list-layout">
            <AutoSizer>
              {({ width, height }) => (
                <List
                  width={width}
                  height={height}
                  rowCount={result.list.length}
                  rowHeight={30}
                  rowRenderer={this.rowRender.bind(this)}
                />
              )}
            </AutoSizer>
          </div>
          <div className="button-group">
            <Button
              type="primary"
              onClick={() => this.goVideoPage()}
              disabled={disabledGoPage}
              className="orange-btn"
            >
              视频监控
            </Button>
            <Button
              type="primary"
              className="orange-btn"
              disabled={disabledGoPage}
              onClick={() => this.goView('face')}
            >
              人脸图库
            </Button>
            <Button
              type="primary"
              className="orange-btn"
              disabled={disabledGoPage}
              onClick={() => this.goView('body')}
            >
              人体图库
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
