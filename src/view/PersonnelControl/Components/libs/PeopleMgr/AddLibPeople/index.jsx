import React, {Component} from 'react';
import { observer } from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { message, Modal } from 'antd';
import * as _ from 'lodash';
import { searchFormat } from 'src/utils'
import lyService from 'src/service/lyService.js'

import ModalComponent from 'src/components/ModalComponent';
import FormPeopleInfo from '../FormPeopleInfo';
import LibPeople from '../../components/LibPeople';

import './index.scss';

const confirm = Modal.confirm;
const AuthActionArray = [
  'FaceLibsMessage', // 重点人员布控库增删改权限
  'OutsidersLibsMessage', // 外来人员布控库增删改权限
  'placeholder', // 占位
  'AIOLibsMessage' // 一体机布控库增删改权限
]

@BusinessProvider('MoniteePeopleStore','MenuStore')
@observer
class MultiPeople extends Component {
  constructor(props) {
    super(props);
    this.libType = props.libType || 1
    this.libLabel = props.libType === 1 ? '重点' : '合规';
    this.actionName = AuthActionArray[props.libType -1]
  }
  state = {
    editVisible: false,
    editInfo: {},
    showResult: false, // 上传结果弹窗 
    // mobx数据
    peopleList: [], // 人员列表
  }
  componentWillMount() {
    const { viewRef } = this.props;
    viewRef && viewRef(this);
  }

  setLayoutLoading = (loading = true, loadingTip = '') => {
    const { MenuStore } = this.props;
    MenuStore.setSpinning(loading, loadingTip)
  }

  // 上传图片
  uploadDone = (peopleList) => {
    const oldPeopleList = this.state.peopleList;
    const newPeopleList = oldPeopleList.concat(peopleList)
    this.setState({
      peopleList:newPeopleList
    })
  }

  // 重新上传
  reUpload = (peopleInfo) => {
    console.log(peopleInfo,92)
    let peopleFile;
    this.updatePeopleItem(peopleInfo, peopleItem => {
      peopleItem.uploadStatus = null;
      peopleFile = peopleItem.infoList[0]
      return peopleItem
    })
    lyService.uploadImgToLy({file: peopleFile, expiretype: 0}).then(({file}) => {
      if(file) {
        peopleFile.file.url = file.url;
        peopleFile.uploadStatus = true;
      } else {
        peopleFile.uploadStatus = false;
      }
      this.uploadDone(peopleInfo);
    });
  }

  // 更新store中单个人员信息
  updatePeopleItem = (peopleInfo, callback) => {
    const peopleList = this.state.peopleList
    let peopleItem = peopleList.find(v => v.id === peopleInfo.id);
    peopleItem = callback&&callback(peopleItem)
    this.setState({ peopleList })
  }

  // 批量删除人员
  deletePeopleBatch = (checkList, libId, callback) => {
    const { peopleList } = this.state;
    const deleteList = [], newPeopleList=[];
    peopleList.map(v => {
      if(checkList.indexOf(v.id) !== -1){
        deleteList.push(...v.infoList)
      } else {
        newPeopleList.push(v)
      }
    })
    this.deleteLyFile(deleteList);
    this.setState({ peopleList: newPeopleList });
    callback && callback()
  }

  // 删除人员
  deleteLibPeople = (peopleInfo) => {
    //删除数据库中存储的图片
    this.deleteLyFile(peopleInfo.infoList)
    // 本地删除
    const peopleList = this.state.peopleList.filter(v => v.id !== peopleInfo.id);
    this.setState({ peopleList })
  }

  // 羚羊存储删除
  deleteLyFile = (fileList) => {
    if(fileList.length){
      let objIds=[];
      fileList.map(file => {
        if(file.url && file.uploadType==='remote') {
          const objId = searchFormat(file.url.split('?')[1]).obj_id;
          objIds.push(objId)
        }
      });
      lyService.deleteFileList(objIds);
    }
  }

  // 保存
  onSubmit = async (libInfo, callback) => {
    const { MoniteePeopleStore, libType } = this.props;
    const { peopleList } = this.state;
    if(!peopleList.length) {
      // 布控人员是否不为空验证
      return callback && callback()
      // return message.error('必须上传人员图像');
    }
    // 保存回调函数
    this.submitCallback = callback;
    // 设置超时定时器
    this.setTimer();
    // 设置全局loading   
    this.setLayoutLoading(true, '人员上传中，请耐心等待...');
    const result = await MoniteePeopleStore.onMutilSubmit(peopleList, libInfo);
    if(this.timeout){
      console.log('上传成功')
      // 取消定时器
      clearTimeout(this.timeout);
      if (!result){
        this.showResult('信息保存失败，请重试', false)
        return 
      }
      // 显示上传结果
      this.showResult(`共添加${result.totalPicCount}个图片，成功${result.successPicCount}张，失败${result.totalPicCount - result.successPicCount}张`)
    }
  }

  // 设置超时定时器
  setTimer = () => {
    this.timeout = setTimeout(() => {  
      console.log('上传超时')
      this.timeout = null   
      this.showResult('上传时间超过1分钟，请到布控库中查询上传结果')
    },1000*60)
  }

  // 显示上传结果弹窗
  showResult = (title, goBack = true) => {    
    // 取消全局loading  
    this.setLayoutLoading(false);
    const that = this;    
    Modal.info({
      title,
      keyboard: false,      
      okText: '确定',
      onOk() {
        goBack && that.submitCallback();     
      }
    });
  }

  // 取消操作
  onCancel = (callback) => {
    const that = this;
    confirm({
      title: '确定取消操作吗',
      onOk() {
        // 删除已经上传到羚羊存储的图片
        const { peopleList } = that.state
        let fileList = [];
        peopleList.map(v => fileList.push(...v.infoList))
        that.deleteLyFile(fileList);
        //跳转
        callback && callback();        
      }
    });
  }

  render() {
    const { libType } = this.props;
    const { editInfo, editVisible, peopleList } = this.state;
    const currentLength = peopleList.length;
    const libDetail = {
      objectMainList: peopleList,
    }
    return (
      <div className={'monitee-multi-people-wrapper'}>
        <LibPeople 
          actionName={this.actionName}
          deleteCheckable
          libType={libType}
          libDetail={libDetail}
          currentLength={currentLength}
          uploadDone={this.uploadDone}
          deleteLibPeople={this.deleteLibPeople}
          editLibPeople={this.editLibPeople}
          deletePeopleBatch={this.deletePeopleBatch}
        />
        <ModalComponent
          className='monitee-lib-modal'
          visible={editVisible}
          title={`编辑${this.libLabel}人员：${editInfo.selfAttr && editInfo.selfAttr.name}`}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
          width='800px'
        >
          <FormPeopleInfo 
            formRef={form => this.editForm = form}
            uploadType='local'
            selfAttr={editInfo.selfAttr}
            infoList={editInfo.infoList}
            deleteImg={this.deleteImg} 
            beforeUpload={this.editBeforeUpload}
            uploadDone={this.editUploadDone}
          />
        </ModalComponent>   
      </div>
    )
  }
  
  // 删除图片
  deleteImg = (item) => {
    const uid = item.uid;
    const { editInfo } = this.state;
    editInfo.infoList = editInfo.infoList.filter(v => v.uid !== uid);
    this.setState({
      editInfo
    })
  }
  editBeforeUpload = (v) => {
    // 设置loading
  }
  editUploadDone = (file) => {
    // 保存图片到本地
    if(file){
      const { editInfo } = this.state;
      editInfo.infoList.push(file);
      this.setState({
        editInfo
      })
    }
  }
  // 保存单个人员编辑信息
  handleOk = () => {
    // 上传图片到羚羊
    this.editForm.validateFields((err,values) => {
      if (err) {
        return message.error('表单填写有误')
      }
      const { editInfo } = this.state;
      // 1. 批量上传图片到羚羊
      const fileList = editInfo.infoList.filter(v => v.uploadType==='local');
      if(fileList.length){
        lyService.uploadImgListToLy({fileList, expiretype:0 }).then(results => {
          let errCount = 0;
          results.map((v,k) => {
            if(v.file){
              fileList[k].url = v.file.url;
              fileList[k].uploadType = 'remote';
            } else {
              errCount++
              fileList.splice(k,1) 
            }
          })
          errCount && message.info(`${errCount}张图片上传失败`);
          // 2. 保存用户信息
          this.updatePeopleItem(editInfo,peopleItem => {
            peopleItem.selfAttr = values
            peopleItem.infoList = editInfo.infoList
            return peopleItem
          })
          // 3. 取消模态框
          this.handleCancel()
        })
      } else {
        this.updatePeopleItem(editInfo, peopleItem => {
          peopleItem.selfAttr = values
          peopleItem.infoList = editInfo.infoList
          return peopleItem
        })
        this.handleCancel()
      }
    })
  }
  // 取消人员编辑  
  handleCancel = () => {
    this.setState({
      editVisible: false,
      editInfo: {}
    })
  }
  // 编辑人员
  editLibPeople = (item) => {
    const editInfo = _.cloneDeep(item);
    this.setState({
      editVisible: true,
      editInfo
    })
  }
}


export default MultiPeople;