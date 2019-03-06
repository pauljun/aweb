import React from 'react';
import { AutoSizer, List } from 'react-virtualized';
import IconFont from '../../../../components/IconFont';
import DeviceIcon from '../../../../components/DeviceIcon';
import HightLevel from '../../../../components/HightLevel';
import { stopPropagation } from '../../../../utils';
import ModalMapPointLabel from '../../MapPointLabel/ModalMapPointLabel';
import { BusinessProvider } from '../../../../utils/Decorator/BusinessProvider';
import { videoModule } from '../../../VideoSurveillance/moduleContext';
import { observer } from 'mobx-react';
import AuthComponent from '../../AuthComponent';
import { db } from 'src/libs/DeviceLib';

import { message, Select, Button } from 'antd';
const Option = Select.Option;

@BusinessProvider('DeviceManagementStore')
@videoModule
@observer
export default class OrgTreeWithDevice extends React.Component {
  constructor(props) {
    super(props);
    this.groupNames = [];
    this.currentDevice = null;
    this.deviceExts = [];
    this.deviceListRef = React.createRef();
    this.setDeviceExt(this.props.deviceList);
    this.state = {
      point: null,
      visible: false,
      key: Math.random(),
      currentId: null
    };
  }
  setDeviceExt = deviceList => {
    let arr = [];
    for (let i = 0, l = deviceList.length; i < l; i++) {
      let item = deviceList[i];
      let ext = this.deviceExts.find(v => v.id === item.id);
      if (!ext) {
        arr.push({ id: item.id, visible: false });
      } else {
        arr.push(ext);
      }
    }
    this.deviceExts = arr;
  };

  componentWillReceiveProps(nextProps) {
    this.setDeviceExt(nextProps.deviceList);
  }
  clickDeviceItem(item) {
    const { onSelectDevice } = this.props;
    onSelectDevice(item);
  }
  editDevice(e, item) {
    stopPropagation(e);
    const { goPage } = this.props;
    goPage({
      moduleName: 'SystemManagement',
      childModuleName: 'DeviceEdit',
      data: {
        id: item.id
      }
    });
  }
  closeModal = () => {
    this.setState({ visible: false });
  };
  openModal = (e, item) => {
    stopPropagation(e);
    this.setState({ visible: true, point: item });
  };
  submitDevicePoint = info => {
    const { DeviceManagementStore } = this.props;
    DeviceManagementStore.updateDeviceGeo({
      address: info.address,
      name: info.name,
      deviceId: info.point.id,
      latitude: info.position[1],
      longitude: info.position[0]
    }).then(() => {
      message.success('操作成功！');
    });
  };

  changeGroup = (selectGroup, item) => {
    this.groupNames = selectGroup;
    this.currentDevice = item;
    this.forceUpdate();
  };
  onVisibleChange = (visible, deviceId) => {
    this.setState({
      currentId: visible ? deviceId : null
    });
  };

  showDeviceGroup = (item, index, event) => {
    stopPropagation(event);
    this.layoutGroupUp = document.body.clientHeight - event.pageY < 110;
    const { collectionList } = this.props;
    this.groupNames = collectionList
      .filter(v => v.deviceList.find(v2 => v2.id === item.id))
      .map(v => v.groupName);
    this.currentDevice = null;
    this.deviceExts.forEach(v => (v.visible = false));
    this.deviceExts[index].visible = true;
    this.forceUpdate();
  };
  cancelGroup = index => {
    this.groupNames = [];
    this.currentDevice = null;
    this.deviceExts[index].visible = false;
    this.forceUpdate();
  };
  subGroup = (item, index) => {
    const { addGroupDevice } = this.props;
    if (this.groupNames.length === 0) {
      return false;
    }
    let arr = this.groupNames.map(name => {
      let data = {
        groupName: name,
        deviceKey: `${item.manufacturerDeviceId}/${item.deviceName}`
      };
      return data;
    });
    addGroupDevice(arr)
      .then(() => {
        message.success('操作成功！');
      })
      .then(() => this.cancelGroup(index));
  };

  rowRender({ key, index, style }) {
    const { currentId } = this.state;
    const { selectDevice } = this.props;
    const { deviceList, collectionList, keyword } = this.props;
    const ids = selectDevice.map(v => v.id);
    return (
      <div
        style={style}
        className={`device-item ${
          ids.indexOf(deviceList[index].id) > -1 ? 'active' : ''
        } ${currentId === deviceList[index].id ? 'group-select-item' : ''}`}
        key={key}
        onClick={() => this.clickDeviceItem(deviceList[index])}
      >
        <div className="device-item-layout">
          <DeviceIcon
            onlineClass="device-online"
            offlineClass="device-offline"
            type={deviceList[index].deviceType}
            status={deviceList[index].deviceData}
          />

          <span className="device-name">
            <HightLevel name={deviceList[index].deviceName} keyword={keyword} />
          </span>
          <span
            className={`device-item-tools`}
            onClick={e => stopPropagation(e)}
          >
            <IconFont
              type="icon-Keep_Main"
              title="添加到分组"
              onClick={event =>
                this.showDeviceGroup(deviceList[index], index, event)
              }
            />
            {deviceList[index].deviceType != db.value && (
              <React.Fragment>
                <AuthComponent actionName="MapLabel">
                  <IconFont
                    type="icon-_LocusAnalysis"
                    title="点位设置"
                    onClick={e => this.openModal(e, deviceList[index])}
                  />
                </AuthComponent>
                <AuthComponent actionName="DeviceEdit">
                  <IconFont
                    type="icon-Setting_Main"
                    onClick={e => this.editDevice(e, deviceList[index])}
                    title="设备编辑"
                  />
                </AuthComponent>
              </React.Fragment>
            )}
          </span>
        </div>
        {this.deviceExts[index].visible && (
          <div
            className={`device-to-group ${
              this.layoutGroupUp ? 'device-to-group-up' : ''
            }`}
            onClick={e => stopPropagation(e)}
          >
            <div className="group-select-title">
              {deviceList[index].deviceName}
            </div>
            <div className={`group-select-${deviceList[index].id}`} />
            <Select
              placeholder="请选择分组"
              mode="multiple"
              key={this.state.key}
              onChange={v => this.changeGroup(v, deviceList[index])}
              className="group-select-com"
              value={this.groupNames}
              getPopupContainer={() =>
                document
                  .querySelector('.ant-tabs-tabpane-active')
                  .querySelector(`.group-select-${deviceList[index].id}`)
              }
            >
              {collectionList.map(v => (
                <Option key={v.groupName} value={v.groupName}>
                  {v.groupName}
                </Option>
              ))}
            </Select>
            <div className="group-btn">
              <Button size="small" onClick={() => this.cancelGroup(index)}>
                取消
              </Button>
              <Button
                size="small"
                type="primary"
                onClick={() => this.subGroup(deviceList[index], index)}
              >
                确定
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
  computedListStatus(deviceList) {
    let onlineList = [],
      offlineList = [];
    for (let i = 0, l = deviceList.length; i < l; i++) {
      let item = deviceList[i];
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
    const { visible, point } = this.state;
    const { deviceList, slideDevice, changeSlideDevice } = this.props;
    const result = this.computedListStatus(deviceList);
    return (
      <div className="device-list-part" ref={this.deviceListRef}>
        <div className="title-part" onClick={changeSlideDevice}>
          <IconFont
            type={
              slideDevice
                ? 'icon-Arrow_Small_Up_Main'
                : 'icon-Arrow_Small_Down_Mai'
            }
          />
          摄像机列表
          <span className="count-part">
            <span className="count-part-on">{result.onlineCount}</span>
            <span className="count-part-off">{result.offlineCount}</span>
          </span>
        </div>
        <div className={`list-layout ${!slideDevice ? 'list-hide' : ''}`}>
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={result.list.length}
                rowHeight={25}
                rowRenderer={this.rowRender.bind(this)}
              />
            )}
          </AutoSizer>
        </div>
        <ModalMapPointLabel
          title="点位设置"
          visible={visible}
          point={point}
          onCancel={this.closeModal}
          onOk={this.submitDevicePoint}
        />
      </div>
    );
  }
}
