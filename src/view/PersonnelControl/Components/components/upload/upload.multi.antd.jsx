import React, { Component } from 'react';
import { Upload, message, Button } from 'antd';
import lyService from 'src/service/lyService.js'
import util from './utils';

/* 
  3.0 antd的Upload组件
*/
class MultiUpload extends Component {
  fileList = []

  // 本地上传
  localUpload = (fileList) => {
    fileList.map(v => {
      util.fileToBase64(v.file, (base64) => {
        v.file.url = base64;
        v.file.uploadType = 'local';
      })
    })
    console.log('fileList', fileList)
    this.uploadDone(fileList);
  }

  // 远程上传（到羚羊）
  remoteUpload = (fileList) => {
    const { expiretype = 0 } = this.props;
    let temp = fileList.map(v => v.file)
    lyService.uploadImgListToLy({fileList: temp, expiretype}).then((results) => {
      console.log(results, 23)
      fileList.map((v,k) => {
        const newFile = results[k].file ? results[k].file : v.file;
        newFile.uploadType = 'remote';
        v.file = newFile;
        v.uploadStatus = newFile.url ? true : false;
      })
      this.uploadDone(fileList);
    })    
  }

  // 上传完成后的回调
  uploadDone = (fileList) => {
    const { uploadDone } = this.props;
    uploadDone && uploadDone(fileList)
  }

  beforeLoading = false
  uploadCount = 0

  //上传之前
  beforeUpload = (file, fileList) => {
    let fileInfo = { 
      uuid: util.uuid(),
      file: file, 
      uploadStatus: null, 
    }
    const { maxSize = 2, maxLength = 100, currentLength=0, beforeUpload } = this.props;
    if(currentLength + fileList.length > maxLength){
      if(file===fileList[0]){ // 只提示一次
        message.error(`最多选择${maxLength}张图片, 已选${currentLength}张`)
      }
      return false
    }
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJPG) {
      message.error(`${file.name}:图片格式必须为JPG或者PNG!`)
    }
    const limitSize = file.size / 1024 / 1024 < maxSize;
    if (!limitSize) {
      message.error(`${file.name}:图片大小不能超过${maxSize}M!`)
    }
    if(isJPG && limitSize) {
      this.fileList.push(fileInfo);
      if(!this.beforeLoading){ // 只执行一次beforeUpload
        this.beforeLoading=true
        beforeUpload && beforeUpload()
      } 
    } 
    this.uploadCount++;
    if(this.uploadCount === fileList.length){
      this.uploadCount = 0;
      this.beforeLoading = false;
      this.customRequest(this.fileList); // 一次性上传
      this.fileList = []
    }
    return false
  }

  //上传方法
  customRequest = (fileList) => {
    this.props.uploadType === 'remote' ? this.remoteUpload(fileList) : this.localUpload(fileList);
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