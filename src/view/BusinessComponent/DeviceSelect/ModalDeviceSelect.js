import React from 'react';
import { Modal } from 'antd';
import DeviceSelect from './index';

// 组件：从组织树选择设备弹窗
export default ({
  className = '',
  width = 900,
  visible,
  onCancel,
  onOk,
  data,
  defaultSelectList = [], // 默认选中项（完整的设备信息）
  includeDevices,
  footer,
  ...params
}) => (
  <Modal
    className={`modal-device-select ${className}`}
    visible={visible}
    width={width}
    footer={null}
    onCancel={onCancel}
    {...params}
  >
    <DeviceSelect
      onCancel={onCancel}
      onOk={onOk}
      data={data}
      defaultSelectList={defaultSelectList}
      includeList={includeDevices}
      footer={footer}
    />
  </Modal>
);
