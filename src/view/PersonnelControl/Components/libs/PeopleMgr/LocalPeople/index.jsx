import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { message, Modal } from 'antd';
import { BusinessProvider } from '../../../../../../utils/Decorator/BusinessProvider';
import lyService from 'src/service/lyService.js'
import { searchFormat } from 'src/utils'

import FormPeopleInfo from '../FormPeopleInfo';

import './index.scss';

const confirm = Modal.confirm

/* 
  本地添加布控人员
  this.isEdit 表明是添加或是编辑
*/
@BusinessProvider('MoniteePeopleStore', 'MenuStore')
@observer
class LocalPeople extends Component {

  state = {
    loading: false,
    selfAttr: {}, // 人员表单信息
    infoList: [], // 人员图片列表
    itemInfo: {}, // 布控库id和?人员id
  }

  setSpinning = (loading = true, loadingTip) => {
    const { MenuStore } = this.props;
    MenuStore.setSpinning(loading, loadingTip)
  }

  // 保存
  onSubmit = (placeholder, callback) => {
    const { MoniteePeopleStore, libDetail } = this.props;
    this.form.validateFields(async (err,values) => {
      if (err) {
        return message.error('表单填写有误')
      }
      const { infoList, itemInfo } = this.state
      if (!infoList.length) {
        return message.error('必须上传人员图像')
      }
      // 设置全局loading    
      this.setSpinning(true,'人员上传中，请耐心等待...')
      const result = await MoniteePeopleStore.onSubmit(itemInfo, infoList, values, libDetail)
      this.setSpinning(false,'')
      if (!result) {
        return message.error('信息保存失败')
      }
      Modal.info({
        title: `共添加${result.totalPicCount}个图片，成功${result.successPicCount}张，失败${result.totalPicCount - result.successPicCount}张`,
        keyboard: false,      
        okText: '确定',
        zIndex: 9999,
        onOk() {
          callback&&callback(libDetail.id);     
        }
      });
    })
  }

  // 取消操作
  onCancel = (callback) => {
    const that = this;
    confirm({
      title: '确定取消操作吗',
      onOk() {
        // 删除已经上传到羚羊存储的图片
        const { infoList } = that.state
        let objIds = []
        infoList.forEach(item => {
          let oldImg;
          if(that.oldInfoList){
            oldImg = that.oldInfoList.find(v => v.imageUrl === item.imageUrl)
          }
          if (!oldImg) {
            let objId = searchFormat(item.imageUrl.split('?')[1]).obj_id;
            objIds.push(objId)
          }
        })
        lyService.deleteFileList(objIds);
        //跳转
        callback && callback();
      }
    });
  }

  // 删除图片
  deleteImg = (item) => {
    const { MoniteePeopleStore } = this.props;
    // //删除后台数据库中的图片
    MoniteePeopleStore.deleteImg(this.state.infoList, item).then(infoList => {
      this.setState({infoList})
    })
    const objId = searchFormat(item.imageUrl.split('?')[1]).obj_id;
    // //删除羚羊存储中的图片    
    lyService.deleteFile(objId)
  }

  // 上传之前
  // beforeUpload = () => {
  //   this.setLoading()
  // }
  // 上传图片
  uploadDone = (file) => {
    // this.setLoading(false)
    if (file) {
      message.success('上传成功')
      const infoList = [].concat(this.state.infoList);
      const newInfo = {
        type: 1,
        image: file.url,
        imageUrl: file.url
      }
      infoList.push(newInfo)
      this.setState({infoList})
    }
  }

  componentWillMount() {
    const { libDetail, peopleId, libType, viewRef } = this.props;
    viewRef(this)
    this.libLabel = libType === 1 ? '重点' : '合规人员';
    let params = {};
    // 区分编辑和添加
    if (peopleId){
      this.isEdit = true;
      const peopleInfo = libDetail.objectMainList.find(v => v.id === peopleId)
      params = {
        selfAttr: peopleInfo.selfAttr,
        infoList: peopleInfo.infoList,
        itemInfo: {
          libId: libDetail.id,
          id: peopleInfo.id
        }
      }
      // 保存未修改前的图片
      this.oldInfoList = toJS(peopleInfo.infoList)
      this.setState({
        selfAttr: params.selfAttr,
        infoList: params.infoList,
        itemInfo: params.itemInfo
      })
    } else {
      params = {
        itemInfo: {
          libId: libDetail.id
        }
      }
      this.setState({
        itemInfo: params.itemInfo
      })
    }
  }

  render() {
    const { className='' } = this.props;
    const { selfAttr, infoList } = this.state;
    return (
      <div className={'monitees-local-people-wrapper '+ className}>
        <FormPeopleInfo 
          uploadType='remote'
          showStatus={this.isEdit}
          formRef={form => this.form = form}
          selfAttr={selfAttr}
          infoList={infoList}
          deleteImg={this.deleteImg} 
          beforeUpload={this.beforeUpload}
          uploadDone={this.uploadDone}
        /> 
      </div>
    )
  }
}

export default LocalPeople