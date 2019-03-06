import React, { Component } from 'react';
import { Upload, message, Button } from 'antd';
import lyService from 'src/service/lyService.js'
import util from './utils';

/* 
  云眼2.x版本批量上传
*/
class MultiUpload extends Component {
  fileList = []

  // 本地上传
  localUpload = (fileInfo, fileList) => {
    util.fileToBase64(fileInfo.file, (base64) => {
      fileInfo.file.url = base64;
      fileInfo.file.uploadType = 'local';
      this.uploadDone(fileInfo, fileList);
    })
  }

  // 远程上传（到羚羊）
  remoteUpload = (fileInfo, fileList) => {
    const { expiretype = 0 } = this.props;
    lyService.uploadImgToLy({file: fileInfo.file, expiretype}).then(({file}) => {
      const newFile = file ? file : fileInfo.file;
      newFile.uploadType = 'remote';
      fileInfo.file = newFile
      this.uploadDone(fileInfo, fileList);
    });
  }

  // 上传完成后的回调
  uploadDone = (fileInfo, fileList) => {
    if(fileInfo.file.url) {
      fileInfo.uploadStatus = true;
    } else {
      fileInfo.uploadStatus = false;
    }
    this.fileList = []
    const { uploadDone, setLoading } = this.props;
    let loading = true;
    if(fileInfo.file.uid === fileList[fileList.length - 1].uid){ // 只设置一次loading
      loading = false;
    }
    uploadDone && uploadDone(fileInfo, loading);
  }

  //上传之前
  beforeUpload = (file, fileList) => {
    let fileInfo = { 
      uuid: util.uuid(),
      file: file, 
      uploadStatus: null, 
      errMsg: [], 
    }
    const { maxSize = 2, maxLength = 100, currentLength=0, beforeUpload, setLoading } = this.props;
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJPG) {
      fileInfo.errMsg.push(`${file.name}:图片格式必须为JPG或者PNG!`)
      message.error(`${file.name}:图片格式必须为JPG或者PNG!`)
    }
    const limitSize = file.size / 1024 / 1024 < maxSize;
    if (!limitSize) {
      fileInfo.errMsg.push(`${file.name}:图片大小不能超过${maxSize}M!`)
      message.error(`${file.name}:图片大小不能超过${maxSize}M!`)
    }
    // const limitLength = maxLength ? currentLength + fileList.length > maxLength + 1 : true;
    if(currentLength + fileList.length > maxLength){
      if(file===fileList[0]){ // 只提示一次
        message.error(`最多选择${maxLength}张图片, 已选${currentLength}张`)
      }
      return false
    }
    if(isJPG && limitSize) {
      this.fileList.push(fileInfo);
      let loading = false;
      if(file === fileList[0]){ // 只设置一次loading
        loading = true
      } 
      beforeUpload && beforeUpload(fileInfo, loading)
      this.customRequest(fileInfo, fileList)
    } 
    return false
    // return isJPG && limitSize
  }

  //上传方法
  customRequest = (uploadFile, fileList) => {
    let fileInfo = this.fileList.find(value => value.file.uid === uploadFile.file.uid);
    if(fileInfo) {
      this.props.uploadType === 'remote' ? this.remoteUpload(fileInfo, fileList) : this.localUpload(fileInfo, fileList);
    }
  }

  render() {
    const upLoadProps = {
      showUploadList: false,
      multiple: this.props.multiple,
      beforeUpload: this.beforeUpload,
      customRequest: this.customRequest,
    }
    return (
      <Upload {...upLoadProps}>
        <Button>
          {this.props.children}
          {this.props.uploadText}
        </Button>
      </Upload>
    )
  }
}

export default MultiUpload;