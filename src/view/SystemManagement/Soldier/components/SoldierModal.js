import React from 'react';
import ModalComponent from 'src/components/ModalComponent';
import SoldierEdit from './SoldierEdit';
import { message } from 'antd';

import './SoldierModal.scss';

export default class SoldierModal extends React.Component {
  state = {
    inputValue: '',
  }

  handleChange = (e) => {
    this.setState({
      inputValue: e.target.value.trim()
    })
  }
  handleSubmit = () => {
    const { contentOptions } = this.props;
    const { inputValue } = this.state;
    if(!inputValue) {
      return message.warn('请输入单兵名称！');
    }
    contentOptions.onOk(inputValue);
  }

  getContent = (content) => {
    const { contentOptions } = this.props;
    let children, title, onOk, onCancel, extraOptions={};
    switch(content) {
      case 1 : // 解绑弹窗
        const { bindName, unbindOk, unbindCancel } = contentOptions;
        extraOptions.width = '320px';
        extraOptions.img = 'unbind'
        title = '解绑确认';
        onOk = unbindOk;
        onCancel = unbindCancel;
        children = (
          <p style={{textAlign: 'center'}}>
            确定要解除与账号 
            <span className='highlight'>{bindName}</span>
            的绑定吗？
          </p>
        )
      break;
      case 2: // 编辑弹窗
        let { isEdit, editItem, activeOrgIds, userList, selectUser, leafClk, treeRef, clickUserName, ...rest } = contentOptions;
        title = isEdit ? '编辑单兵' : '新建单兵';
        extraOptions = rest;
        extraOptions.width = "800px"
        extraOptions.onOk = this.handleSubmit;
        let radioValue = null;
        if(selectUser && selectUser.id){
          radioValue = selectUser.id
        } 
        children = (
          <SoldierEdit 
            onSearchChange={this.handleChange}
            isEdit={isEdit}
            editItem={editItem}
            treeRef={treeRef}
            clickUserName={clickUserName}
            leafClk={leafClk}
            radioValue={radioValue}
            activeOrgIds={activeOrgIds}
            userList={userList}
          />
        )
      break;
      default: break;
    }
    return {
      title,
      onOk,
      onCancel,
      children,
      ...extraOptions,
    }
  }
  
  componentDidMount() {
    const { isEdit, editItem } = this.props.contentOptions;
    const inputValue = isEdit && editItem ? editItem.deviceName : ''
    this.setState({
      inputValue
    })
  }

  render () {
    const { visible, content } = this.props;
    const modalOptions = visible ? this.getContent(content) : {};
    return (
      <ModalComponent
        className='soldier-modal'
        visible={visible}
        {...modalOptions}
      >
      </ModalComponent>
    )
  }
}