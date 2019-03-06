import React, { Component } from 'react';
import { Upload, message } from 'antd';
import IconFont from 'src/components/IconFont';
import { 
  fileToBase64 as Util_fileToBase64, 
  judgeType as Util_judgeType
} from 'src/utils';
import lyService from 'src/service/lyService.js'

import './upload.sw.scss';

/** props：
 *  className
 *  maxSize: 大小限制
 *  uploadDone: 上传后的回调
 *  expiretype: 保存期限
 *  uploadType: 
 */

/* 
  配置参数： 下载单个、多个、图片预览、上传路径、格式限制、大小限制、存储时间
  {
    multiple,
    preview,
    uploadUrl,
    acceptFile,
    maxSize,
    beforeUpload,
    customRequest,
    disabled,
    listType,
    expiretype : 周期类型，0表示永久，1表示7天，2表示30天，3表示90天，默认为0
    name:  发到后台的文件参数名,默认file
    showUploadList: 是否展示 uploadList
    onChange: 上传文件改变时的状态
    onPreview: 点击文件链接或预览图标时的回调
    onRemove: 点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除。
  }

*/
// 0: 永久存储，1: 七天
// 存永久： logo、头像、布控照片、视图库图片、视频截图
// 临时：以图搜图、
// 删除时走羚羊接口，删除对象存储中的图片
// 上传添加key值：
// key: userid/cid/20180101/uuid
// key: userid/tmp/20180101/uuid


// 默认上传的格式
const ACCEPT_FILE = [];
const MAX_SIZE = 2;

class UploadComponent extends Component {
  state = {
    loading: false,
    // previewImage,
    // fileList
  }

  // file转化为本地base64
  uploadLocal = (file) => {
    const { uploadDone } = this.props;
    Util_fileToBase64(file, (base64) => {
      file.url = base64;
      file.uploadType = 'local';
      uploadDone && uploadDone(file);
    })
  }

  // 图片上传到远程服务器
  uploadRemote = (file) => {
    const { uploadDone, expiretype = 0 } = this.props;
    this.setState({ loading: true });
    lyService.uploadImgToLy({file, expiretype}).then(
      ({ file, result }) => {
        file && (file.uploadType = 'remote')
        this.setState({ loading: false });
        uploadDone && uploadDone(file, result);
      }
    )
  }

  /** 自定义上传方法
   *  
   */
  customUpload = ({ file }) => {
    const { uploadType = 'remote' } = this.props;
    if (uploadType !== 'remote') {
      this.uploadLocal(file)
    } else {
      this.uploadRemote(file)
    }
  }

  /** 上传之前的钩子函数,做一些上传校验
   * @return 返回false时停止上传，返回true则执行上传（customUpload）
   */
  beforeUpload = (file, fileList) => {
    const { maxSize = MAX_SIZE, beforeUpload } = this.props;
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJPG) {
      message.error('图片格式必须为JPG或者PNG!')
    }
    const limitSize = file.size / 1024 / 1024 < maxSize;
    if (!limitSize) {
      message.error(`图片大小不能超过${maxSize}M!`)
    }
    if(isJPG && limitSize){
      beforeUpload && beforeUpload();
    }
    return isJPG && limitSize
  }

  /** 渲染上传按钮
   *  支持自定义React组件 或 自定义按钮文本
   */
  renderUploadBtn = () => {
    const { uploadBtn } = this.props;
    if (React.isValidElement(uploadBtn)) {
      return uploadBtn
    }
    let uploadText = '选择图片'
    if (Util_judgeType(uploadBtn, 'String')) {
      uploadText = uploadBtn
    }
    return (
      <div className='upload-btn-wrapper'>
        <IconFont className="ant-upload-icon" type={this.state.loading ? 'loading' : 'icon-AddImg_Light'} />
        <span className="ant-upload-text">{uploadText}</span>
      </div>
    );
  }

  render() {
    const {
      className = '',
      uploadTip = true,
      maxSize = MAX_SIZE
    } = this.props;
    const uploadProps = {
      name: 'file',
      accept: "image/png, image/jpeg, image/jpg",
      multiple: false,
      showUploadList: false,
      beforeUpload: this.beforeUpload,
      customRequest: this.customUpload,
    };
    return (
      <div className={`sw-upload-wrapper ${className}`}>
        {/* 仅支持最大上传10张图片 */}
        <Upload {...uploadProps} className='upload-content-wrapper'>
          {this.renderUploadBtn()}
        </Upload>
        {uploadTip &&
          <div className="uploader-tip">
            <span>支持jpg/png格式</span>
            <br />
            <span>不超过{maxSize}M</span>
          </div>
        }
      </div>
    )
  }
}

export default UploadComponent;
