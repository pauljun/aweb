import React, {Component} from 'react';
import { BusinessProvider } from '../../../../../../utils/Decorator/BusinessProvider';
import { message, Modal, Button, Popover } from 'antd';
import IconSpan from 'src/components/IconSpan';
import MultiUpload from '../../../components/upload/upload.multi';

import './index.scss';

@BusinessProvider('MoniteePeopleStore','MenuStore')
class MultiPeople extends Component {

  componentWillMount() {
    const { viewRef } = this.props;
    viewRef && viewRef(this)
  }

  setLayoutLoading = (loading = true, loadingTip = '') => {
    const { MenuStore } = this.props;
    MenuStore.setSpinning(loading, loadingTip)
  }
  
  // 上传之前
  beforeUpload = () => {
    this.setLayoutLoading(true, '图片上传中，请耐心等待...');
    const { beforeUpload } = this.props;
    beforeUpload && beforeUpload('multiView');
  }
  // hasErrorCallback --- 检验失败后的回调函数
  hasErrorCallback = () => {
    this.setLayoutLoading(false); // loading 重置
  }
  
  // 上传图片
  uploadDone = (fileList) => {
    this.setLayoutLoading(false);
    let peopleList = []
    fileList.map(file => {
      const idx = file.name.lastIndexOf('.');
      const fileName = file.name.substring(0, idx);
      let [ name, identityNumber ] = fileName.split('-');
      // 校验身份证是否上传正确
      const identityNumberReg = /^((\d{18})|([0-9x]{18})|([0-9X]{18}))$/;
      identityNumber = identityNumberReg.test(identityNumber) ? identityNumber : '';
      const selfAttr = {
        name, identityNumber
      } 
      const infoList = [file];
      const propleItem = {
        selfAttr,
        infoList,
        id: Math.random(),
      }
      peopleList.push(propleItem);
    })
    const { uploadDone } = this.props;
    uploadDone && uploadDone(peopleList);
  }

  // 保存
  onSubmit = async (peopleList, callback) => {
    const { MoniteePeopleStore, libDetail } = this.props;
    if(!peopleList.length) {
      return message.error('必须上传人员图像');
    }
    // 保存回调函数
    this.submitCallback = () => callback(libDetail.id);
    // 设置超时定时器
    this.setTimer();
    // 设置全局loading   
    this.setLayoutLoading(true, '人员上传中，请耐心等待...');
    const result = await MoniteePeopleStore.onMutilSubmit(peopleList, libDetail);
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
      zIndex: 9999,
      onOk() {
        goBack && that.submitCallback();     
      }
    });
  }

  render() {
    const { className='', label, popover, currentLength=0 } = this.props;
    let { disabled=false } = this.props;
    const maxLength = 500;
    disabled = disabled || currentLength >= maxLength;
    const multiUploadProps = {
      maxLength,
      currentLength,
      disabled,
      multiple: true,
      expiretype: 0,
      beforeUpload: this.beforeUpload,
      uploadDone: this.uploadDone,
      uploadType: 'remote',
      hasErrorCallback: this.hasErrorCallback
    }
    return (
      <div className={'monitee-upload-people-wrapper '+ className}>
        { popover 
          ? <MultiUpload {...multiUploadProps}>
              <Popover content={<UploadTip maxLength={maxLength} />} trigger="hover">
                <IconSpan disabled={disabled} icon='icon-user-add' mode='inline' label={label} />
              </Popover>
            </MultiUpload>
          : <div className='upload-wrapper'>
              <MultiUpload {...multiUploadProps}>
                <Button disabled={disabled} icon='plus'>{label}</Button>
              </MultiUpload>
              <br/>
              <UploadTip maxLength={maxLength} />
            </div>
        }
      </div>
    )
  }
}

const UploadTip = ({maxLength}) => (
  <div className='monitee-people-upload-tip-wrapper'>
    <div>命名规则：<span className='highlight'>姓名-身份证</span>，身份证可为空</div>
    <div>人数限制：单次上传限制为 <span className='highlight'>{maxLength}</span> 人</div>
  </div>
)

export default MultiPeople;