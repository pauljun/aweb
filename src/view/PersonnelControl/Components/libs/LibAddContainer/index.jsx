import React,{ Component } from 'react';
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import FormLibInfo from '../components/FormLibInfo';
import LibHeader from '../components/LibHeader';
import AddLibPeople from '../PeopleMgr/AddLibPeople';
import ModalFooter from '../../../../BusinessComponent/ModalFooter'

import './index.scss'

// 布控库添加组件
@withRouter
@BusinessProvider('MoniteeLibsStore', 'TabStore', 'MenuStore', 'UserStore')
@observer
class LibAddContainer extends Component {
  constructor(props) {
    super(props)
    this.libType = props.libType || 1; 
    this.libLabel = props.libType === 2 ? '合规': '重点'
  }

  state={
    formLibInfoKey: ''
  }

  setLayoutLoading = (loading = true, loadingTip = '') => {
    const { MenuStore } = this.props;
    MenuStore.setSpinning(loading, loadingTip)
  }

  // --------------  第一步：提交布控库信息 ------------------
  submitLibInfoForm = async () => {
    this.libInfoView.onSubmit(libInfo => {
      const { MoniteeLibsStore } = this.props;   
      if(this.libInfo){
        libInfo.id = this.libInfo.id;      
      } 
      MoniteeLibsStore.saveLib(libInfo).then(result => {
        if(result){
          libInfo.id = result.message;
          this.libInfo = libInfo; // 保存添加信息到本地
          this.submitPeople(libInfo)
        }
      })
    }) 
  }

  // --------------  第二步：提交布控人员 ------------------
  submitPeople = (libInfo) => {
    // 1. 提交人员信息    
    this.multiView.onSubmit(libInfo, () => {
      // 2. 跳转列表
      this.jumpUrl();
    })
  }

  // 取消新建布控库
  handleCancel = () => {
    const that = this;
    that.multiView.onCancel(() => {
      if(this.libInfo){
        // 删除lib
        const { MoniteeLibsStore } = this.props;
        MoniteeLibsStore.deleteLib({
          id: this.libInfo.id, 
          updateList: false,
          libType: this.libType,
          libName: this.libInfo.name
        }).then(result => {
          result && that.jumpUrl()
        })
      }else{
        that.jumpUrl()
      }
    })
  }

  // 路由跳转
  jumpUrl = () => {
    const { TabStore, history } = this.props;
    const childModuleName = this.libType === 1 ? 'faceBlackLibView' : 'outsidersBlackLibView'
    TabStore.goPage({
      history,
      moduleName: 'PersonnelControl',
      childModuleName,
      isUpdate: true
    })
  }

  componentWillMount() {
    const { MoniteeLibsStore, libType } = this.props
    // 增加默认选中用户
    this.libInfo = {}
    this.libInfo.userId = [this.props.UserStore.userInfo.id]
    MoniteeLibsStore.editSearchData({ libType });
  }
  
  render(){
    const { userOrgTreeData, formLibInfoKey } = this.state;

    return (
      <div className='monitee-lib-wrapper monitee-lib-add-wrapper'>
        <div className='lib-add-header'>
          <span className='highlight'>{`新建${this.libLabel}人员布控库`}</span>
        </div>
        <div className='lib-add-content-wrapper'>
          <div className='lib-add-content-container'>
            <LibHeader title={`${this.libLabel}人员库详情`} />
            <FormLibInfo 
              libType={this.libType}
              libInfo={this.libInfo || {}}
              viewRef={view => this.libInfoView = view} 
              key={formLibInfoKey} 
            />
            <AddLibPeople
              libType={this.libType}
              viewRef={multiView => this.multiView = multiView}
            />
            <ModalFooter 
              className='monitee-lib-btns'
              onOk={this.submitLibInfoForm}
              onCancel={this.handleCancel}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default LibAddContainer;

