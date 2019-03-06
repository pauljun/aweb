import React from 'react';
import ReactDOM from 'react-dom';
import {toJS} from 'mobx';
import { withRouter } from 'react-router-dom';
import IconFont from 'src/components/IconFont';
import moment from 'moment';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider'
import { 
  Form, Row, Col, Button, Input, Select, DatePicker, 
  InputNumber, Popconfirm, Icon, message 
} from 'antd';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent'
import FormUpload from 'src/components/FormUpload'
import AddSystemLogoModal from './SystemLogo'
import Title from '../../components/Title';
import TreeSelectOrg from '../../../BusinessComponent/TreeSelect';

const FormItem = Form.Item
const Option = Select.Option

@withRouter
@BusinessProvider('UserManagementStore','TabStore', 'UserStore')
class BaseInfo extends React.Component {

  state={
    orgId: '',
    resetLoading: false,
    systemShow: false,
    isShowSystemLogoModel: false, // 显示logo设置模拟框
  }

  //定义systemLogo的Id名称
  systemLogoBox = 'systemLogoBox' + Math.random()
  systeLogoResItem = 'systeLogoResItem' + Math.random()

  componentDidMount() {
    const { location, isAdd } = this.props;
    let clickedOrgId = isAdd ? location.state.pageState.orgId : '';
    this.setState({orgId: clickedOrgId})

    document.querySelector('#root').addEventListener('click', this.closeSelectModel)
    document.getElementById(`${this.systemLogoBox}`).addEventListener('click',this.stopPropOfSelectModel)
    ReactDOM.findDOMNode(this.formUpload).querySelector('.formUpload').addEventListener('click',this.stopPropOfSelectModel)
  }
  componentWillUnmount() {
    document.querySelector('#root').removeEventListener('click',this.closeSelectModel)
    document.getElementById(`${this.systemLogoBox}`).removeEventListener('click',this.stopPropOfSelectModel)
    ReactDOM.findDOMNode(this.formUpload).querySelector('.formUpload').removeEventListener('click',this.stopPropOfSelectModel)
  }

  //点击空白处隐藏select模拟框
  closeSelectModel = (e) => {
    if(!this.systemLogoBoxBeingClicked){
      this.setState({
        isShowSystemLogoModel:false
      })
    }
  }

  // 点击select模拟框的删除按钮时，阻止事件冒泡隐藏模拟框
  stopPropOfSelectModel = (e) => {
    this.systemLogoBoxBeingClicked = true
    setTimeout(() => {
      this.systemLogoBoxBeingClicked = false
    }, 500)
  }

  //系统logo模拟
  showSystemLogoModel = () => {
    this.setState({
      isShowSystemLogoModel: true
    })
  }
  //选中logo
  selectSystemLogo = (id) => {
    this.props.selectSystemLogo(id);
    this.setState({
      isShowSystemLogoModel: false
    })
  }

  //删除logo
  delSystemLogo = (id) => {
    const { UserManagementStore, UserStore } = this.props;
    UserManagementStore.delSystemMes(id, UserStore.userInfo.id).then(() => {
      message.success('删除成功')
      this.forceUpdate()
    })
  }

  
  /**重置密码 */
  resetPsw = id => {
    const { UserManagementStore } = this.props
    this.setState({ resetLoading: true })
    UserManagementStore.resetPsw(id).then(() => {
      message.success('重置密码成功')
      this.setState({ resetLoading: false })
    })
  }

  goAddRole = () => {
    const { history, TabStore } = this.props;
    TabStore.goPage({
      moduleName: 'Role',
      childModuleName: 'RoleAdd',
      history,
    })
  }

  disabledDate = (current) => {
    // Can not select days before today 
    return current && current < moment().subtract(1, 'd').endOf('day');
  }

  render() {
    const {
      UserStore, UserManagementStore, getFieldDecorator, initData, isDisabled, 
      roleList, userId, isView, isAdd, onUploadChange
    } = this.props;
    const { systemShow, isShowSystemLogoModel, resetLoading, orgId } = this.state;
    const maxUserGrade = UserStore.userInfo.userGrade || 100;
    let systemMesData = toJS(UserManagementStore.systemMes)
    systemMesData && systemMesData.unshift({
      systemId: '',
      systemLogo: '',
      systemName: '默认',
      userList: [{}]
    }) 

    return (
      <div className='baseInfo'>
        <Title name='基本信息'/>
        <Row>
          <Col span={24}>
            <FormItem
              className="uploadForm"
              label="上传头像"
              ref={view => this.formUpload = view}
            >
              {getFieldDecorator('userAvatar',{
                initialValue: isAdd ? '' : initData.userAvatar
              })(
                <FormUpload
                  name="userAvatar"
                  onChange={onUploadChange}
                  {...isDisabled} 
                />
              )}
            </FormItem>
            {!(isView || isAdd) && (
              <Button 
                className='user-reset-psw' 
                icon='lock'
                loading={resetLoading}
                onClick={() => this.resetPsw(userId)}
                >
                  重置密码
              </Button>
            )}
          </Col>
          <Col span={24}>
            <FormItem label="登录名称">
              {getFieldDecorator('loginName', {
                rules: [
                  { required: true, message: '登录名称必须填写' },
                  { max: 20, message: '用户名最大长度20' }
                ],
                initialValue:isAdd?'':initData.loginName
              })(
                <Input
                  name="loginName"
                  placeholder="请填写登录名称"
                  {...isDisabled}
                />
              )}
            </FormItem>
            <FormItem className='userGradeInput'label='级别'>
              {getFieldDecorator('userGrade', {
                rules: [
                  { required: true, message: '级别必须填写' },
                  { type: 'integer', message: '级别为正整数' },
                  { //自定义验证规则
                    validator(rule, value, callback) {
                      const errors = [];
                      if (value < 1) {
                        errors.push('级别不能小于1')
                      }
                      if (value >= maxUserGrade) {
                        errors.push('级别应小于当前用户级别：' + maxUserGrade)
                      }
                      callback(errors);
                    }
                  },
                ],
                initialValue:isAdd? '':initData.userGrade
              })(
                <InputNumber
                  name="userGrade"
                  placeholder="请填写用户级别"
                  {...isDisabled}
                />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="用户角色">
              {getFieldDecorator('roleId', {
                rules: [{ required: true, message: '用户角色必须填写' }],
                initialValue:isAdd?'':initData.roleId
              })(
                <Select
                  name="roleId"
                  className="ant-col-14 user-roleName"
                  placeholder="请选择用户角色"
                  {...isDisabled}
                >
                  {roleList && roleList.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.roleName}
                    </Option>
                  ))}
                </Select>
              )}
              { !isView && (
                <AuthComponent actionName='RoleAdd'>
                  <Button
                    className="addRoleBtn"
                    icon='usergroup-add'
                    onClick={this.goAddRole}
                  >新增角色
                  </Button>
                </AuthComponent>
              )}
            </FormItem>
            <FormItem label="有效期限">
              {getFieldDecorator('validEndTime',{
                initialValue: isAdd? '' : initData.validEndTime && moment(Number(initData.validEndTime))})(
                <DatePicker
                  name="validEndTime"
                  className="datePick"
                  format="YYYY.MM.DD"
                  placeholder="失效时间"
                  {...isDisabled}
                  disabledDate={this.disabledDate}
                />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="所属部门">
              {getFieldDecorator('organizationId', {
                rules: [{ required: true, message: '所属部门必须填写' }],
                initialValue: isAdd ? orgId : initData.organizationId
              })(
                <TreeSelectOrg
                  width={411}
                  {...isDisabled}
                  showSearch={false}
                  name="organizationId"
                  placeholder="请填写所属部门"
                />
              )}
            </FormItem>
            <FormItem label="系统名称">
              <div id={this.systemLogoBox} className='systemLogoBoxStyle'>
                {getFieldDecorator('systemId', {initialValue:isAdd?'':initData.systemId?initData.systemId:''})(
                  <Select
                    placeholder="请选择系统名称"
                    {...isDisabled}
                    getPopupContainer={() => document.getElementById(`${this.systemLogoBox}`)}
                    onFocus={this.showSystemLogoModel}
                  >
                    {systemMesData && systemMesData.map((v, k) => (
                      <Option value={v.systemId} key={k} title={v.systemName}>
                        <img src={v.systemLogo} width='40' />
                        <span className={!v.systemLogo ? 'systemName_res': ''}>{v.systemName}</span>
                      </Option>
                    ))} 
                  </Select>
                )}
                {isShowSystemLogoModel && !isDisabled.disabled && 
                  <div className="syste_logo_res_item" id={this.systeLogoResItem}>
                  {systemMesData && systemMesData.map((v, k) => (
                    <div className="item" key={k}> 
                      <div 
                        className="list_info" 
                        title={v.userList.length > 0 ? '该系统logo已经被占用，不支持删除': ''}   
                        onClick={() => this.selectSystemLogo(v.systemId)}
                      >
                        <img src={v.systemLogo} width='40' />
                        <span className="systemName_res">{v.systemName}</span>
                      </div>
                      {v.userList.length === 0 && 
                        <Popconfirm title="确定删除该系统logo?" 
                          onConfirm={() => this.delSystemLogo(v.systemId)} 
                          okText="是" 
                          cancelText="否"
                          placement="leftTop"
                          getPopupContainer={() => document.getElementById(`${this.systeLogoResItem}`)}
                        > 
                          <IconFont type="icon-Close_Main" />
                        </Popconfirm>
                      }
                    </div>
                  ))}
                  </div> 
                }
              </div>
              {!isView && (
                <Button 
                  icon='plus'
                  onClick={() => this.setState({ systemShow: true })}
                >
                  添加
                </Button>
              )}
            </FormItem>   
          </Col>
        </Row>
        {systemShow && <AddSystemLogoModal 
          userId={UserStore.userInfo.id}
          cancel={() => this.setState({ systemShow: false })}
        />}
      </div>
    )
  }
}

export default BaseInfo