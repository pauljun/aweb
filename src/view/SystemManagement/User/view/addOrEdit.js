import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider'
import lyService from 'src/service/lyService.js'
import { _Cascader } from 'src/libs/location/cascader.js';
import moment from 'moment'
import { Form, Input, Radio, Row, Col, Cascader } from 'antd'
import EventEmitter from 'src/libs/Socket';
import { searchFormat } from 'src/utils/Decorator/index.js'
import Title from '../../components/Title';
import MapCenter from '../../components/MapZoomAndLevel'
import ConfirmBtns from '../components/ConfirmBtns';
import BaseInfo from '../components/BaseInfo';

import './addOrEdit.scss'

const FormItem = Form.Item
const RadioGroup = Radio.Group

@withRouter
@BusinessProvider('UserManagementStore','TabStore','UserStore','RoleManagementStore')
@observer
class AddOrEditUser extends React.Component {

  state = {
    loading: false,
    visible: false,
    roleId: null,
    mapShow: true,
    zoomLevelCenter: null,
    centerPoint: null,
    roleList:[],
    initData:{}, 
  }

  isAdd = null 
  isView = null

  async componentWillMount() {
    const { UserStore, UserManagementStore, location } = this.props
    let pathname = location.pathname.split('/');
    let lastPath = pathname && pathname[pathname.length - 1]
    this.isView = lastPath === 'UserCheck' ? true : false;
    this.isAdd = lastPath === 'UserAdd' ? true : false;
    UserManagementStore.getSystemMes(UserStore.userInfo.id)
    if (!this.isAdd) {   
      const { id, name } = location.state.pageState;
      this.userId = id;
      UserManagementStore.queryUserDetail(Number(id), name).then(res => {
        if(res && res.result.userInfo) {
          this.setState({
            initData:res && res.result.userInfo
          })
        }
      })
    }
  }
  componentDidMount() {
    EventEmitter.on('UPDATE_ROLE_LIST',this.updateRoleList);
    const { form } = this.props
    this.updateRoleList()
    if (this.isAdd) {
      form.setFieldsValue({
        userSex: 100001,
        validEndTime: moment().add(3, 'year'),
      })
    }
  }
  componentWillUnmount(){
    EventEmitter.off('UPDATE_ROLE_LIST',this.updateRoleList);
  }
  // 监听角色列表变化
  updateRoleList = () => {
    const { RoleManagementStore } = this.props;
    RoleManagementStore.initData();
    RoleManagementStore.getList({pageSize:999,pageNum:1}).then(res => {
      this.setState({
        roleList: res.result.list
      })
    })
  }

  submitUserForm = () => {
    const { form } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      //根据systemId去补全name和logo,将数据传给后台
      let systemIdNow = values.systemId
      let systemLogos = toJS(this.props.UserManagementStore.systemMes)
      if(systemIdNow){
        systemLogos.forEach(item => {
          if(item.systemId === systemIdNow){
            values.systemLogo = item.systemLogo
            values.systemName = item.systemName
          }
        })
      }else{
        values.systemLogo = ''
        values.systemName = ''
      }
      if(this.userImgUrl && this.userAvatarUrl){
        let objId = searchFormat(this.userAvatarUrl.split('?')[1]).obj_id
        lyService.deleteFile(objId)
      }
      let codeAddress = values.addressCode.join(',')
      values.addressCode = codeAddress
      values.userSource = '100101'
      const { initData }=this.state
      values.zoomLevelCenter = this.zoom? this.zoom : initData.zoomLevelCenter
      values.centerPoint=this.centerPoint? this.centerPoint : initData.centerPoint
      this.isAdd ? this.addUser(values) : this.editUser(values)
    })
  }
  editUser(userInfo) {
    const { UserManagementStore, location } = this.props;
    let changeUserInfoModel = Object.assign({}, this.state.initData, {
			...userInfo
		});
    UserManagementStore.editUser(changeUserInfoModel).then(res => {
      this.cancelUserForm(false, userInfo);
    }) 
  }
  addUser(userInfo) {
    const { UserManagementStore, UserStore } = this.props;
    userInfo.optCenterId = UserStore.userInfo.optCenterId
    UserManagementStore.addUser(userInfo).then(() => {
      this.cancelUserForm(false, userInfo)
    })
  }
  /**增加一个参数，代表是否是由点击按钮触发 isBtn为true代表是点击触发 */
  cancelUserForm = (isBtn, dataInfo) => {
    if(this.userImgUrl && isBtn) {
      let objId = searchFormat(this.userImgUrl.split('?')[1]).obj_id
      lyService.deleteFile(objId)
    }
    this.cancel(dataInfo)
  }

  /**记录当前页面对应的上传图片的url */
  onUploadChange = (value) => {
    this.userImgUrl = value
  }
  //选中logo
  selectSystemLogo = (id) => {
    this.props.form.setFieldsValue({
      systemId: id
    })
  }

  /**取消操作 */
  cancel = (dataInfo) => {
    const { history, TabStore } = this.props;
    TabStore.closeCurrentTab({ history })
    if(dataInfo){
      EventEmitter.emit('UPDATE_OrgTree_LIST', dataInfo)
    }
  }

  mapChange = (info) => {
    this.zoom=info.zoom
    this.centerPoint=`${info.center.lng},${info.center.lat}`
  }

  Pointparse = (point) => {
    let arr = point.split(',');
    return [arr[0]*1, arr[1]*1]
  }
  render() {
    const { form:{getFieldDecorator} } = this.props
    const { roleList, initData } = this.state;

    // 查看页面就禁用各种输入框
    const isDisabled = this.isView ? { disabled: true } : {}
   
    let zoomLevelCenter = undefined;
    if(!this.isAdd){
      zoomLevelCenter = {
        zoom:initData.zoomLevelCenter,
        center: initData.centerPoint ? this.Pointparse(initData.centerPoint) : null
      }
    }
    console.log(zoomLevelCenter,'zoomCenter')
    return (
      <div className='changeUserView'>
        <div className="changeUserLayer">
          <div className="titleLayer">
            <div className="noTreeTitle">{`${this.isView ? '查看' : !this.isAdd ? '编辑' : '新建'}用户`}</div>
          </div>
          <div className="userForm">
            <Form layout='vertical'>
              <BaseInfo 
                getFieldDecorator={getFieldDecorator}
                initData={initData}
                isDisabled={isDisabled}
                selectSystemLogo={this.selectSystemLogo}
                roleList={roleList}
                userId={this.userId}
                isAdd={this.isAdd}
                isView={this.isView}
                onUploadChange={this.onUploadChange}
              />
              <div className='identifyInfo'>
                <Title name='身份信息'/>
                <Row>
                  <Col span={24}>
                    <FormItem label="真实姓名">
                      {getFieldDecorator('realName', {
                        rules: [
                          { required: true, message: '真实名称必须填写' },
                          { max: 20, message: '真实姓名最大长度20' }
                        ],
                        initialValue:this.isAdd?'':initData.realName
                      })(
                        <Input
                          name="realName"
                          type="text"
                          placeholder="请填写真实名称"
                          {...isDisabled}
                        />
                      )}
                    </FormItem>
                    <FormItem label="性别">
                      {getFieldDecorator('userSex', {
                        rules: [{ required: true, message: '性别必须填写' }],
                        initialValue:this.isAdd?'':initData.userSex
                      })(
                        <RadioGroup name="userSex" {...isDisabled}>
                          <Radio value={100001}>男</Radio>
                          <Radio value={100002}>女</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="手机号码">
                      {getFieldDecorator('phoneNum', {
                        rules: [
                          { required: true, message: '手机号码必须填写' },
                          { pattern: /^(1)\d{10}$/, message: '请输入正确手机号码'}
                        ],
                        initialValue:this.isAdd?'':initData.phoneNum
                      })(
                        <Input
                          type="text"
                          placeholder="请填写手机号码"
                          {...isDisabled}
                        />
                      )}
                    </FormItem>
                    <FormItem label="身份证号">
                      {getFieldDecorator('idCard', {
                        rules: [
                          {
                            pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                            message: '请填写正确的身份证号码'
                          }
                        ],
                        initialValue:this.isAdd?'':initData.idCard
                      })(
                        <Input
                          type="text"
                          placeholder="请填写身份证号"
                          {...isDisabled}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="邮箱">
                      {getFieldDecorator('policeEmail', {
                        rules: [
                          { required: false },
                          {
                            pattern: /^[0-9A-Za-zd]+([-_.][0-9A-Za-zd]+)*@([0-9A-Za-zd]+[-.])+[A-Za-zd]{2,4}$/,
                            message: '请填写正确的邮箱'
                          }
                        ],
                        initialValue:this.isAdd?'':initData.policeEmail
                      })(
                        <Input
                          type="text"
                          placeholder="请填写邮箱"
                          {...isDisabled}
                        />
                        )}
                    </FormItem>
                    <FormItem label="办公室座机号">
                      {getFieldDecorator('telephone', {
                        rules: [
                          { required: false },
                          {
                            pattern: /^(0\d{2}-\d{8}(-\d{1,4})?)|(0\d{3}-\d{7,8}(-\d{1,4})?)$/,
                            message: '请输入正确座机号码'
                          }
                        ],
                        initialValue:this.isAdd?'':initData.telephone
                      })(
                        <Input
                          type="text"
                          placeholder="请填写办公室座机号"
                          {...isDisabled}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="所在城市">
                      {getFieldDecorator('addressCode', {
                        rules: [
                          { required: true, message: '所在城市必须填写' }
                        ],
                        initialValue:this.isAdd?'':initData.addressCode && initData.addressCode.split(',')                    
                      })(
                        <Cascader 
                          options={_Cascader.levelData} 
                          placeholder="请选择所在城市" 
                          showSearch
                          {...isDisabled}
                        />
                      )}
                    </FormItem> 
                  </Col>
                </Row>
              </div> 
              {!this.isView && (
                <div className='map-setting'>
                  <Title name='地图设置'/>
                  <div className='mapShow'>
                    <MapCenter className='userCenter-mpa' 
                      zoomLevelCenter={zoomLevelCenter}
                      mapChange = {this.mapChange}
                      showMapInfo={false}
                    />
                  </div>
                </div>
              )}
            </Form>
          </div> 
          <ConfirmBtns 
            className='setting-edit-btns'
            isView={this.isView}
            cancelUserForm={this.cancelUserForm}
            submitUserForm={this.submitUserForm}
          />
        </div>
      </div>
    )
  }
}
export default Form.create()(AddOrEditUser)