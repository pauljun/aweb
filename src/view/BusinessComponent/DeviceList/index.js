import React from 'react';
import * as _ from 'lodash';
import { Icon, Checkbox,Input } from 'antd';
import { AutoSizer, List } from 'react-virtualized';
import DeviceIcon from '../../../components/DeviceIcon'
import HightLevel from '../../../components/HightLevel/index'
import IconFont from 'src/components/IconFont'
import InputAfter from '../../../components/SearchInput/index'
import './index.scss';

export default class DeviceList extends React.Component {

  state = {
    checkHalfStatus: false,
    checkAllStatus: false,
  }

  clickDeviceItem(item) {
    const { onSelectDevice } = this.props;
    onSelectDevice && onSelectDevice(item);
  }

  deleteDeviceItem(item) {
    const { deleteDeviceItem } = this.props;
    deleteDeviceItem && deleteDeviceItem(item);
  }

  // 计算在线离线状态
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
      onlineCount: onlineList.length,
      offlineCount: offlineList.length
    };
  }

  // 计算全选半选状态
  computedCheckStatus = (deviceList, selectDeviceList) => {
    const temp = _.intersectionBy(deviceList, selectDeviceList, 'id');
    const checkHalfStatus = temp.length && temp.length < deviceList.length;
    const checkAllStatus = deviceList.length && temp.length === deviceList.length;
    return {
      checkHalfStatus,
      checkAllStatus
    }
  }

  // 渲染在线离线统计
  renderStatusCount = (showStatusCount, deviceList) => {
    if (showStatusCount) {
      const result = this.computedListStatus(deviceList);
      return (
        <span className="count-part">
          <span className="count-part-on">{result.onlineCount}</span>
          <span className="count-part-off">{result.offlineCount}</span>
        </span>
      )
    }
    return null
  }

  // 渲染列表项
  rowRender = ({ key, index, style }) => {
    const { deviceList = [], selectDeviceList = [], checkable = true, onCheckItemChange, deleteDeviceItem, showDeviceIcon = true, isHightLevel = false, keyWord, showUserIcon = false, iconType, newMark = false,
      addList = [],RightDeviceBox } = this.props;
    const selectIds = selectDeviceList.map(v => v.id);
    const item = deviceList[index];
    let deviceIcon = null;
    if (showDeviceIcon) {
      deviceIcon = <DeviceIcon type={item.deviceType} status={item.deviceData} />
    }
    if (showUserIcon) {
      deviceIcon = <IconFont type={'icon-UserName_Light'} className='user-icon-cla' />
    }
    const checked = selectIds.indexOf(item.id) > -1;
    const newmarker = addList.filter(v => v.id === item.id).length > 0
    return (
      <div
        style={style}
        className={`device-item ${checked ? 'active' : ''} ${newmarker && newMark ? 'new-marker': ''}`}
        key={key}
        onClick={() => this.clickDeviceItem(item)}
      >
        <label>
          {checkable && (
            <Checkbox checked={checked} onChange={(e) => onCheckItemChange(e.target.checked, item,RightDeviceBox?1:0)} />
          )}
          <div className='item-info'>
            {deviceIcon}
            {isHightLevel ? <HightLevel name={item.deviceName || item.realName} keyword={keyWord} /> : <span title={item.deviceName || item.realName}>{item.deviceName || item.realName}</span>}
            {/* <span title={item.deviceName}>{item.deviceName}</span> */}
          </div>
          {deleteDeviceItem && (
            <IconFont
              type="icon-Close_Main"
              className="delete-item"
              onClick={() => this.deleteDeviceItem(item)}
            />
          )}
        </label>
      </div>
    );
  }
  render() {
    const {
      className = '',
      title = '摄像机列表',
      deviceList = [], // 列表数据
      selectDeviceList = [], // 选中列表数据
      foldStatus = false, // 列表折叠状态
      changeFoldStatus = null, // 改变列表状态
      showFoldIcon = false, // 是否显示列表折叠按钮
      showStatusCount = false, // 是否显示设备离线在线统计
      checkable = true, // 是否显示checkbox
      onCheckAllChange,
      clearSelect,
      showDeviceIcon, // 是否显示设备图标
      keyRandom = '123', // 强制刷新大列表数据
      RightDeviceBox,
      onChange,
      showInput=undefined
    } = this.props;
    const { checkHalfStatus, checkAllStatus } = this.computedCheckStatus(deviceList, selectDeviceList);
    return (
      <div className={`device-list-check-wrapper ${className}`}>
        <div className="title-part">
          {showFoldIcon && <Icon type={foldStatus ? 'minus' : 'plus'} onClick={changeFoldStatus} />}
          {showInput&&checkable && /* deviceList.length > 0 && */ (
            <Checkbox
              indeterminate={checkHalfStatus}
              checked={checkAllStatus}
              onChange={(e) => onCheckAllChange(e.target.checked,RightDeviceBox?1:0)}
              disabled={!deviceList.length}
            >
              {title}
            </Checkbox>
          )}
          {!showInput&&title}
          {this.renderStatusCount(showStatusCount, deviceList)}
          {!showInput&&checkable && deviceList.length > 0 && (
            <Checkbox
              indeterminate={checkHalfStatus}
              checked={checkAllStatus}
              onChange={(e) => onCheckAllChange(e.target.checked,RightDeviceBox?1:0)}
              disabled={!deviceList.length}
            >
              全选
            </Checkbox>
          ) }
          {clearSelect && (
            <span onClick={clearSelect}><IconFont type='icon-Delete_Main' className='icon-del' />清空</span>
          )}
        </div>
        {showInput&&<InputAfter onSearch={(v) => onChange({keyWord: v}) } placeholder="请输入设备名称搜索"/>}
        <div className={`list-layout ${!foldStatus ? 'list-hide' : ''}`}>
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={deviceList.length}
                rowHeight={30}
                selectDeviceList={selectDeviceList}
                rowRenderer={this.rowRender}
                keyRandom={keyRandom}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }
}
