import React, { Component } from 'react';
import { message } from 'antd';
import lyService from 'src/service/lyService.js'
import util from './utils';
/* 
  3.0原生input上传
  expiretype
  uploadDone
  beforeUpload
  disabled
  maxSize = 2, 
  maxLength = 100, 
  currentLength=0, 
  multiple,
  uploadType 
  children

*/
class MultiUpload extends Component {
  fileList = []

  // 本地上传
  localUpload = (fileList) => {
    fileList.map(v => {
      util.fileToBase64(v, (base64) => {
        v.url = base64;
        v.uploadType = 'local';
      })
    })
    this.uploadDone(fileList);
  }

  // 远程上传（到羚羊）
  remoteUpload = (fileList) => {
    const { expiretype = 0, hasErrorCallback } = this.props;
    lyService.uploadImgListToLy({fileList, expiretype}).then((results) => {
      fileList.map((v,k) => {
        if(results[k].file){
          v = results[k].file;
          v.uploadType = 'remote';
        }
      })
      this.uploadDone(fileList);
    }).catch(() => {
      hasErrorCallback && hasErrorCallback()
    }) 
  }

  // 上传完成后的回调
  uploadDone = (fileList) => {
    const { uploadDone } = this.props;
    uploadDone && uploadDone(fileList)
  }

  //上传之前
  beforeUpload = (e) => {
    this.fileList = [];
    const { maxSize = 2, maxLength = 100, currentLength=0, beforeUpload } = this.props;
    let fileList = e.target.files;
    fileList = Array.prototype.slice.apply(fileList);
    if(currentLength + fileList.length > maxLength){
      message.error(`最多选择${maxLength}张图片, 已选${currentLength}张`)
      return false
    }
    fileList.map(file => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      if (!isJPG) {
        message.error(`${file.name}:图片格式必须为JPG或者PNG!`)
      }
      const limitSize = file.size / 1024 / 1024 < maxSize;
      if (!limitSize) {
        message.error(`${file.name}:图片大小不能超过${maxSize}M!`)
      }
      if(isJPG && limitSize) {
        file.uid = util.uuid();
        this.fileList.push(file);
      } 
    })
    e.target.value = null; // 清空input
    beforeUpload && beforeUpload()
    this.customRequest(this.fileList);
  }

  //上传方法
  customRequest = (fileList) => {
    this.props.uploadType === 'remote' 
      ? this.remoteUpload(fileList) 
      : this.localUpload(fileList);
  }

  onClick = () => {
    this.refs.input.click()
  }

  render() {
    const { className='', multiple, disabled, children } = this.props;

    return (
      <span 
        className={`origin-input-upload-wrapper ${className} ${disabled?'disabled':''}`} 
        onClick={this.onClick} 
      >
        <input 
          ref='input'
          accept="image/png, image/jpeg, image/jpg"
          style={{display: 'none'}}
          type='file' 
          disabled={disabled}
          multiple={multiple} 
          onChange={this.beforeUpload} 
        />
        { children }
      </span>
    )
  }
}

export default MultiUpload;