import React,{ Component } from 'react';
import { toJS } from 'mobx';
import { Form, Input } from 'antd-form-component';
import { message } from 'antd';
import OrgSelectUsers from '../../../../../BusinessComponent/OrgSelectUsers/index'

import './index.scss'
// 管理权限
const privilegeNames = [
  ['faceBlackLib'],
  ['outsidersBlackLib'],
  [''],
  ['AIOLibs']
]
// 黑名单库、白名单库详情查看
@Form.create() 
class FormLibInfo extends Component {

  state = {
    userId: [],
    checkUserId: false
  }

  onSubmit(callback){
    this.props.form.validateFields((err, libInfo) => {
      if(err){
        return message.error('表单填写有误')
      }
      const userList = this.state.userId    
      if(!userList.length){
        this.setState({
          checkUserId: true
        })
        return message.error('管理人员不能为空')
      }
      libInfo.userId = userList;      
      libInfo.libType = this.props.libType;  
      callback && callback(libInfo)
    })
  }

  /**
   * 从OrgSelectUsers组件拿到userId
   */
  setCheckedKeys = (userId) => {
    this.setState({ 
      userId,
      checkUserId: true
    })
    this.props.form.setFieldsValue({
      userId
    })
  }

  componentWillMount(){
    const { viewRef, libType, libInfo } = this.props;
    this.libLabel = libType === 1 ? '重点人员' : '合规人员';
    viewRef(this);
    this.setState({
      userId: libInfo.userId || []
    })
  }

  componentDidMount(){
    const { form, libInfo } = this.props;
    if(libInfo && libInfo.id){
      let userId = toJS(libInfo.userId);
      form.setFieldsValue({
        name: libInfo.name,
        describe: libInfo.describe,
        userId
      })
    }
  }

  render() { 
    const { formTreeData, orgUserList } = this.props;
    const { userId, checkUserId } = this.state;
    let label = this.libLabel;
    const hasError = !userId.length;
    const privilegeName = privilegeNames[this.props.libType - 1]
    return (
      <Form
        className='monitee-form-lib-info'
        layout='horizontal'
      >
        <Input
          required
          name='name'
          label={`${label}库名称`}
          placeholder={`请输入${label}库名称`}
          rules={[
            {max: 50, message: `${label}库名称不超过${50}个字`}
          ]}
        />
        <Input.TextArea
          name='describe' 
          label={`${label}库描述`}
          placeholder={`请输入${label}库说明文字`}
          rules={[
            { max: 200, message: `布控库描述不超过${200}个字` }
          ]}
        />
        <Input
          name="userId"
          type="hidden"
          label="管理权限"
        />
        <div className='promission-container ant-form-item'>
          <div className='ant-form-item-label'>
            <label className='ant-form-item-required'>
              管理权限
            </label>
          </div>
          <div className='ant-form-item-control-wrapper'>
            <OrgSelectUsers 
              defaultSelectUser={userId}
              privilegeName={privilegeName}
              onChange={this.setCheckedKeys}
            />
            {hasError && checkUserId && <div className='ant-form-explain'>请输入管理权限</div>}
          </div>
        </div>
      </Form >
    )
  } 
}

export default FormLibInfo;

