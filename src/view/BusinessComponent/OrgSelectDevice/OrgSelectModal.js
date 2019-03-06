import React from 'react';
import { Modal } from 'antd';
import OrgSelectDevice from './index';

// 组件：从组织树选择设备弹窗
export default (
  {
    className='',
    width=1000, 
    visible, 
    onCancel, 
    onOk, 
    hasSolidier=true,
    defaultSelectList=[], // 默认选中项（完整的设备信息）
    footer,
    ...params 
  }) => (
  <Modal
    className={`modal-org-select ${className}`}
    visible={visible}
    width={width}
    footer={null}
    onCancel={onCancel}
    {...params}
  >
    <OrgSelectDevice 
      onCancel={onCancel} 
      onOk={onOk}
      defaultSelectList={defaultSelectList}
      footer={footer}
      hasSolidier={hasSolidier}
    />
  </Modal>
);
