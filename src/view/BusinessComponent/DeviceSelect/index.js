import React from 'react';
import { inject } from 'mobx-react';
import * as _ from 'lodash';
import DeviceList from '../DeviceList';
import ModalFooter from '../ModalFooter';
import InputSearch from 'src/components/SearchInput';

import './index.scss';

/* 
  组件：从组织树选择设备
  参数：
  className
  defaultSelectList： 默认选择设备集合（设备的详细信息, 至少包含id 和 deviceName）
  onChange: 选中列表改变事件
  footer: 是否显示底部按钮
  onOk： 确定按钮
  onCancel： 取消按钮
*/
@inject('DeviceStore', 'OrgStore')
export default class DeviceSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyWord: '', // 搜索关键字
      selectDeviceList: [] // 已选设备集合
    };
  }

  handleSubmit = () => {
    const { onOk, data } = this.props;
    onOk && onOk(this.state.selectDeviceList, data);
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  };

  // 选中列表改变事件
  handleChange = (selectDeviceList, update = true) => {
    this.setState({
      selectDeviceList
    });
    const { onChange } = this.props;
    update && onChange && onChange(selectDeviceList);
  };

  // 清空已选设备
  clearSelect = () => {
    this.handleChange([]);
  };

  // 列表全选事件
  handleCheckAllChange = (checked,deviceArray) => {
    const { selectDeviceList } = this.state;
    let selectList = [];
    if (checked) {
      selectList = _.uniq([].concat(selectDeviceList, deviceArray));
    } else {
      selectList = _.differenceBy(selectDeviceList, deviceArray, 'id');
    }
    this.handleChange(selectList);
  };

  // 单个选中改变事件
  handleCheckItemChange = (checked, item) => {
    const { deviceArray } = this.props.DeviceStore;
    let { selectDeviceList } = this.state;
    if (checked) {
      selectDeviceList.push(item);
      const selectIds = selectDeviceList.map(v => v.id);
      console.log(selectIds);
      let ids = [...new Set([...selectIds])];
      console.log(ids);
      this.handleChange(deviceArray.filter(v => ids.indexOf(v.id) > -1));
    } else {
      this.deleteDeviceItem(item);
    }
  };

  // 删除单个已选设备
  deleteDeviceItem = item => {
    let { selectDeviceList } = this.state;
    selectDeviceList = selectDeviceList.filter(v => v.id !== item.id);
    this.handleChange(selectDeviceList);
  };

  timer = null;
  // 设备查询
  queryDevice = keyWord => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ keyWord });
    }, 200);
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentWillMount() {
    const { defaultSelectList, DeviceStore } = this.props;
    if (defaultSelectList && defaultSelectList.length) {
      this.handleChange(
        DeviceStore.deviceArray.filter(
          v => defaultSelectList.indexOf(v.id) > -1
        )
      );
    }
  }

  render() {
    const {
      className = '',
      footer = true,
      disabled,
      DeviceStore,
      includeList
    } = this.props;
    const { selectDeviceList } = this.state;
    const keyWord = _.trim(this.state.keyWord);
    let deviceList = keyWord
      ? DeviceStore.deviceArray.filter(
          item => item.deviceName && item.deviceName.indexOf(keyWord) > -1
        )
      : DeviceStore.deviceArray;
    if (includeList) {
      deviceList = deviceList.filter(v => includeList.indexOf(v.id) > -1);
    }
    return (
      <React.Fragment>
        <div className={`no-org-select-device-wrapper ${className}`}>
          <InputSearch
            className="device-search-wrapper"
            placeholder="请输入摄像机名称"
            onSearch={value => this.queryDevice(value)}
          />
          <DeviceList
            className="no-org-device-wrapper"
            deviceList={deviceList}
            selectDeviceList={selectDeviceList}
            onCheckAllChange={(flag) => this.handleCheckAllChange(flag,deviceList)}
            onCheckItemChange={this.handleCheckItemChange}
          />
          <DeviceList
            className="no-select-device-wrapper"
            deviceList={selectDeviceList}
            clearSelect={this.clearSelect}
            checkable={false}
            title={`已选摄像机(${selectDeviceList.length}个)`}
            deleteDeviceItem={this.deleteDeviceItem}
          />
        </div>
        {footer && (
          <ModalFooter
            disabled={disabled}
            className="operate-wrapper"
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
          />
        )}
      </React.Fragment>
    );
  }
}
