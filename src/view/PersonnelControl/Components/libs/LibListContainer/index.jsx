import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { withRouter } from "react-router-dom"
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import LogsComponent from 'src/components/LogsComponent';
import { message } from 'antd';
import LibList from '../components/LibList';
import LibDetail from '../components/LibDetail';
import MachineDetail from '../components/LibDetail/machineDetail';
import LibPeople from '../components/LibPeople';
import FormLibInfo from '../components/FormLibInfo';
import LocalPeopleView from '../PeopleMgr/LocalPeople';
import NoData from 'src/components/NoData';
import MachineInfo from '../components/LibDetail/machineInfo';
import ModalComponent from 'src/components/ModalComponent';
import Socket from '../../../../../libs/Socket';

import './index.scss';

const titleLabel = {
  1: '重点人员',
  2: '合规人员',
  4: '专网'
}
const AuthActionArray = [
  'FaceLibsMessage', // 重点人员布控库增删改权限
  'OutsidersLibsMessage', // 外来人员布控库增删改权限
  'placeholder', // 占位
  'AIOLibsMessage' // 一体机布控库增删改权限
]

@LogsComponent()
@withRouter
@BusinessProvider('MoniteeLibsStore', 'MoniteePeopleStore', 'TabStore', 'UserStore')
@observer
class LibListContainer extends Component {
  constructor(props) {
    super(props)
    this.libType = props.libType || 1
    this.libLabel = titleLabel[props.libType]
    this.actionName = AuthActionArray[props.libType -1]
  }
  state={
    content: 2, // 组件，2. 编辑库信息, 3本地添加，6: 编辑一体机库, 7：删除布控库
    contentOptions: {}, // 组件参数
    loadingList: false,
    peopleId: '',
    headerLoading: false,
    modalVisible: false,
    //数据迁移，将mobx数据迁移到当前state
    libList: [],// 布控库列表
    currLibId: '', // 当前选中布控库的id
    libDetail: {},/**选中的布控库的详情 */
    hasMore: false,
  }

  // 查询布控库
  handleSearchLib = (name) => {
    const { MoniteeLibsStore } = this.props;
    MoniteeLibsStore.editSearchData({ name });
    MoniteeLibsStore.getLibList().then(result => {
      if(result){
        const { libList, libInfo} = result;
        this.setState({
          libList,
          currLibId: libInfo.currLibId,
          libDetail: libInfo.libDetail || {}
        })
      }
    })
  }
  // 获取布控库详情
  getLibDetail = (id) => {
    const { MoniteeLibsStore } = this.props;
    if(id !== this.state.currLibId){
      const funcName = this.libType === 4 ? 'getMachineDetail' : 'getLibDetail';
      MoniteeLibsStore[funcName](id).then(res => {
        this.setState({
          currLibId: res.currLibId,
          libDetail: res.libDetail
        })  
      })
    }
  }

  // --------------  布控库操作 ------------------    
  // 添加布控库
  addLib = (libType) => {
    const { TabStore, history } = this.props;
    let childModuleName = ['faceBlackLibAdd', 'outsidersBlackLibAdd']
    TabStore.goPage({
      history,
      moduleName: 'PersonnelControl',
      childModuleName: childModuleName[libType - 1],
      isUpdate: true
    })
  }
  // 删除布控库
  deleteLib = () => {
    const { id, name } = this.state.contentOptions;
    this.props.MoniteeLibsStore.deleteLib({
      id,
      libType: this.libType, 
      libName: name,
    }).then(result => {
      if(result){
        const { libList, libInfo} = result;
        this.setState({
          libList,
          currLibId: libInfo.currLibId,
          libDetail: libInfo.libDetail || {},
          modalVisible: false
        })
      }
    })
  }
  // 编辑布控库表单信息
  submitLibInfo = (id) => {
    this.libInfoView.onSubmit(libInfo => {
      libInfo.id = id;
      this.setConfirmLoading()
      const { MoniteeLibsStore } = this.props;
      MoniteeLibsStore.saveLib(libInfo).then(result => {
        if(result){
          this.updateLibDetail(id);
        }else{
          this.setConfirmLoading(false)
        }
      })
    })
  }
  // --------------  布控人员操作 ------------------      
  // 删除布控人员
  setDeleteLibPeopleContent = (peopleIds, libId, callback) => {
    this.setContent({
      content: 8,
      peopleIds,
      libId,
      callback
    })
    return Promise.resolve()
  }
  // 批量删除布控人员
  deletePeopleBatch = () => {
    const { libDetail, contentOptions } = this.state;
    const { peopleIds, libId, callback } = contentOptions;
    const { MoniteePeopleStore } = this.props;
    return MoniteePeopleStore.deletePeopleBatch(peopleIds, libDetail).then(res => {
      if(res){
        callback && callback()
        this.updateLibDetail(libId);
      } else {
        this.setModalVisible();
      }
    })
  }
  // 编辑布控人员弹窗
  editLibPeople = (item) => {
    this.peopleView = 'localView';  
    this.setState({
      peopleId: item.id,
    })
    this.setContent({
      content: 3,
      peopleName: item.selfAttr.name
    }) 
  }

  // --------------  上传布控人员 ------------------ 
  beforeUpload = (peopleView) => {
    this.peopleView = peopleView;
  }
  // 上传布控人员
  submitPeople = (peopleList) => {
    // 1. 提交人员信息    
    this[this.peopleView]['onSubmit'](peopleList, libId => {
      // 2. 更新布控库详情
      this.updateLibDetail(libId);
      // 本地添加时，清空peopleId
      this.peopleView === 'localView' && this.setState({peopleId: ''})
    })
  }
  // 取消添加布控人员
  cancelPeople = () => {
     // 1. 取消人员信息    
     this[this.peopleView]['onCancel'](() => {
      // 2. 跳转列表页
      this.setContent({})
      // 本地添加时，清空peopleId
      this.peopleView === 'localView' && this.setState({peopleId: ''})
    })
  }

  // --------------  一体机操作 ------------------
  // 编辑一体机
  submitMachineInfo = () => {
    const { MoniteeLibsStore } = this.props;
    const { libDetail } = this.state;
    this.machineView.onSubmit().then(obj => {
      let describe = obj.describe
      if(obj.errorShow){
        return message.error('表单验证失败')
      }
      return MoniteeLibsStore.saveMachineLib({ 
        describe,
        id: libDetail.id, 
      }).then(res => {
        if(res) {
          const newLib = Object.assign({}, libDetail, { describe });
          this.setState({
            libDetail: newLib,
            modalVisible: false
          })
        }
      })
    })
  }
  // --------------  一体机操作 -- 结束 ------------------

  // 设置确认按钮loading
  setConfirmLoading = (confirmLoading=true) => {
    const { contentOptions } = this.state;
    if(contentOptions.confirmLoading !== confirmLoading){
      contentOptions.confirmLoading = confirmLoading
      this.setState({
        contentOptions
      })
    }
  }
  // 更新布控库信息并返回列表页
  updateLibDetail = (libId, hideModal=true) => {
    // this.setHeaderLoading(false)
    this.props.MoniteeLibsStore.getLibDetail(libId).then(res => {
      //本地更新左侧数据列表
      let { libList } = this.state;
      const libItem = libList.find(v => v.id === res.currLibId)
      libItem.name = res.libDetail.name;
      libItem.personCount = res.libDetail.objectMainList && res.libDetail.objectMainList.length;
      this.setState({
        currLibId: res.currLibId,
        libDetail: res.libDetail,
        libList
      }) 
    })
    hideModal && this.setModalVisible();
  }

  // 设置弹窗显示状态和子组件
  setContent = ({ content=0, modalVisible=true, ...contentOptions }) => {
    this.setState({
      content,
      modalVisible,
      contentOptions
    })
  }

  // 设置弹窗显示状态
  setModalVisible = (modalVisible=false) => {
    this.setState({
      modalVisible
    })
  }

  // 获取组件
  getContent = (content) => {
    const { libDetail, peopleId, contentOptions } = this.state;
    const libType= this.libType;
    let children, title, onOk, modalOptions={}; // 弹窗额外参数
    let onCancel = this.setModalVisible;
    switch(content){
      case 2: // 编辑布控库信息
        modalOptions.width='998px';
        title = `编辑${this.libLabel}库详情`;
        onOk = () => this.submitLibInfo(libDetail.id);
        children = (
          <FormLibInfo 
            libType={libType}
            libInfo={libDetail}
            viewRef={view => this.libInfoView = view}            
          />
        )
      break;
      case 3: // 编辑布控人员
        title = `编辑${this.libLabel}：${contentOptions.peopleName}`;
        onOk = this.submitPeople;
        modalOptions.width='800px';
        children = (
          <LocalPeopleView
            className='monitee-people-wrapper'
            viewRef={localView => this.localView = localView}              
            libType={libType}
            peopleId={peopleId}
            // setLoading={this.setHeaderLoading}              
            libDetail={libDetail}
          />
        )
      break;
      case 6: // 编辑一体机布控库
        modalOptions.width='800px'
        title='编辑专网库详情';
        onOk= this.submitMachineInfo;
        children = (
          <MachineInfo 
            isEdit
            libDetail={libDetail}
            viewRef={view => this.machineView = view}
          />
        )
      break;
      case 7: // 删除布控库
        if(!contentOptions.personCount || contentOptions.personCount == 0){
          modalOptions.width='320px'
          modalOptions.img='delete'
          title = '删除确认';
          onOk = this.deleteLib;
          children = (
            <div className='lib-delete-content'>
              <p>确定要删除 <span className='highlight'> {contentOptions.name} </span> ？</p>
            </div>
          );
        } else {
          modalOptions.width='320px'
          modalOptions.img='warning'
          title = '提示';
          onOk= this.setModalVisible;
          children = (
            <div className='lib-delete-content'>
              <p>
                <span className='highlight'>{contentOptions.name}</span> 中还有
                <span className='highlight'>{contentOptions.personCount}</span> 名{this.libLabel}
              </p>
              <p>请先清空{this.libLabel}在删除本库</p>
            </div>
          )
        }
      break;
      case 8: // 删除布控人员
        modalOptions.width='320px'
        modalOptions.img='delete'
        title = '删除确认';
        onOk= this.deletePeopleBatch;
        children = (
          <div className='lib-delete-content'>
            <p>确定要删除选定人员 ？</p>
          </div>
        )
      break;
      default: break;
    }
    return {
      title,
      onOk,
      onCancel,
      children,
      ...modalOptions
    }
  }

  componentWillMount(){
    const { MoniteeLibsStore, libType } = this.props;
    MoniteeLibsStore.initData({ libType })
  }

  componentDidMount() {
    this.libImportUpdate();
    if(this.libType === 4) {
      Socket.on('LIbIMPORTUPDATE', this.libImportUpdate)
    }
  }
  componentWillUnmount(){
    if(this.libType === 4) {
      Socket.off('LIbIMPORTUPDATE', this.libImportUpdate)
    }
  }
  libImportUpdate = () => {
    const { MoniteeLibsStore, location:{ state } } = this.props;
    let libId;
    if(state && state.pageState) {
      libId = state.pageState.libId;
    }
    MoniteeLibsStore.getLibList(libId).then(result => {
      if(result){
        const { libList, libInfo } = result;
        this.setState({
          libList,
          currLibId: libInfo.currLibId,
          libDetail: libInfo.libDetail || {}
        })
      }
    })
  }

  render() {
    const { UserStore } = this.props;
    const { loadingList, content, libDetail, hasMore, libList, currLibId, modalVisible } = this.state;
    const libType = this.libType;
    const userId = UserStore.userInfo.id;
    let modalOptions;
    if(modalVisible) {
      modalOptions = this.getContent(content);
    }
    return (
      <div className='monitee-lib-wrapper monitee-black-lib-wrapper'>
        <LibList 
          libType={libType}
          listData={libList}
          userId={userId}
          actionName={this.actionName}
          loading={loadingList}
          currLibId={currLibId}
          onSearch={this.handleSearchLib}
          addLib={this.addLib}
          deleteLib={(id, name, personCount) => this.setContent({content: 7, id, name, personCount})}
          getLibDetail={this.getLibDetail}
          hasMore={hasMore}
          loadMore={() => {}}
        />  
        <div className='monitee-black-content-wrapper'>
          { !!libList.length 
            ? <div className='monitee-black-lib-detail-wrapper'>
                {libType !== 4 
                  ? <LibDetail 
                      libType={libType}
                      userId={userId}
                      actionName={this.actionName}
                      libDetail={libDetail} 
                      onEdit={() => this.setContent({content: 2, id: libDetail.id })}
                    />
                  : <MachineDetail 
                      libDetail={libDetail}
                      actionName={this.actionName}
                      onEdit={() => this.setContent({content: 6, id:libDetail.id })}
                    />
                }
                {libType !== 4 && (
                  <LibPeople
                    userId={userId}
                    libType={libType}
                    actionName={this.actionName}
                    libDetail={libDetail}
                    viewRef={multiView => this.multiView = multiView}
                    deleteCheckable
                    beforeUpload={this.beforeUpload}
                    uploadDone={this.submitPeople}
                    deleteLibPeople={(item,libId, callback) => this.setDeleteLibPeopleContent([item.id], libId, callback)}
                    editLibPeople={this.editLibPeople}
                    deletePeopleBatch={this.setDeleteLibPeopleContent}
                  />
                )} 
              </div>
            : <NoData title={`${this.libLabel}库信息`}/>
          }
        </div>
        <ModalComponent
          className={`monitee-lib-modal ${this.state.content === 3 ? 'edit-people-model' : ''} ${this.state.content === 6 ? 'edit-machine-model' : ''}`}
          visible={modalVisible}
          {...modalOptions}
        />
      </div>
    )
  }
}

export default LibListContainer;