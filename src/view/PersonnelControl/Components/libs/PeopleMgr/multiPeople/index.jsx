import React, {Component} from 'react';
import { observer } from 'mobx-react';
import { BusinessProvider } from '../../../../../../utils/Decorator/BusinessProvider';
import { Button, Popconfirm, message, Modal, Popover } from 'antd';

import { searchFormat } from 'src/utils'
import lyService from 'src/service/lyService.js'
import svgDelete from 'src/assets/img/monitees/Delete_Colour.svg';
import svgReUpload from 'src/assets/img/monitees/UpData_Colour.svg';
import svgDefaultPerson from 'src/assets/img/monitees/Person.svg';
import svgLoadingDark from 'src/assets/img/monitees/Loading_Dark.svg';

import MultiUpload from '../../../components/upload/upload.multi'
import PropleCard from '../../components/PeopleCard';
import FormPeopleInfo from '../FormPeopleInfo';
import './index.scss';

const confirm = Modal.confirm


// --------------------------------------------- 
// --------------  备用代码 --------------------- 
// --------------------------------------- -----

@BusinessProvider('MoniteePeopleStore','MenuStore')
@observer
class MultiPeople extends Component {
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

  setLoading = (loading = true) => {
    const { setLoading } = this.props;
    setLoading && setLoading(loading)
  }

  setLayoutLoading = (loading = true, loadingTip = '') => {
    const { MenuStore } = this.props;
    MenuStore.setSpinning(loading, loadingTip)
  }
  // 上传之前
  beforeUpload = () => {
    this.setLayoutLoading(true, '图片上传中，请耐心等待...');
    // if(loading){
    //   this.setLayoutLoading(true, '图片上传中，请耐心等待...');
    // }
    // fileInfo = Object.assign({},fileInfo);
    // let peopleList = this.state.peopleList
    // const idx = fileInfo.file.name.lastIndexOf('.');
    // const fileName = fileInfo.file.name.substring(0, idx);
    // let [ name, identityNumber ] = fileName.split('-');
    // // 校验身份证是否上传正确
    // const identityNumberReg = /^((\d{18})|([0-9x]{18})|([0-9X]{18}))$/;
    // identityNumber = identityNumberReg.test(identityNumber) ? identityNumber : '';
    // const selfAttr = {
    //   name, identityNumber
    // } 
    // const infoList = [fileInfo.file];
    // const propleItem = {
    //   selfAttr,
    //   infoList,
    //   uuid: fileInfo.uuid,
    //   uploadStatus: fileInfo.uploadStatus
    // }
    // peopleList.push(propleItem);
    // this.setState({ peopleList })
  }

  // 上传图片
  uploadDone = (fileList) => {
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
      }
      peopleList.push(propleItem);
    })
    this.setState({
      peopleList
    })
    const { uploadDone } = this.props;
    uploadDone && uploadDone(peopleList);
  }

  // 重新上传
  reUpload = (peopleInfo) => {
    console.log(peopleInfo,92)
    this.setLoading();
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
    let peopleItem = peopleList.find(v => v.uuid === peopleInfo.uuid);
    peopleItem = callback&&callback(peopleItem)
    this.setState({ peopleList })
  }

  // 删除图片
  deleteImg = (peopleInfo) => {
    console.log(peopleInfo)
    // 本地删除
    this.props.MoniteePeopleStore.deleteMutilImg(this.state.peopleList, peopleInfo.uuid).then(peopleList => {
      this.setState({ peopleList })
    })
    //删除数据库中存储的图片
    if(peopleInfo.infoList.length) {
      this.deleteLyFile(peopleInfo.infoList)
    }
    message.success('删除成功');
  }

  // 羚羊存储删除
  deleteLyFile = (fileList) => {
    let objIds=[];
    fileList.map(file => {
      if(file.url && file.uploadType==='remote') {
        const objId = searchFormat(file.url.split('?')[1]).obj_id;
        objIds.push(objId)
      }
    });
    lyService.deleteFileList(objIds);
  }

  // 保存
  onSubmit = async (peopleList, callback) => {
    const { MoniteePeopleStore, libDetail, libType } = this.props;
    if(!peopleList.length) {
      return message.error('必须上传人员图像');
    }
    // 保存回调函数
    this.submitCallback = () =>　callback(libDetail.id);
    // 设置超时定时器
    this.setTimer();
    // 设置全局loading   
    this.setLayoutLoading(true, '人员上传中，请耐心等待...');
    const result = await MoniteePeopleStore.onMutilSubmit(peopleList, libDetail.id, libType);
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
        peopleList.map(v => fileList = fileList.concat(v.infoList))
        that.deleteLyFile(fileList);
        //跳转
        callback && callback();        
      }
    });
  }

  render() {
    const { className, label, showUploadList } = this.props;
    const { editInfo, editVisible } = this.state;
    const peopleList = this.state.peopleList || [];
    const currentLength = peopleList.length;
    const maxLength = 500;
    const multiUploadProps = {
      multiple: true,
      expiretype: 0,
      beforeUpload: this.beforeUpload,
      uploadDone: this.uploadDone,
      uploadText: '上传',
      uploadType: 'remote',
      maxLength,
      currentLength
    }
    // console.log(peopleList,192)
    return (
      <div className={'monitee-multi-people-wrapper '+ className}>
        {currentLength < maxLength && (
          <div className='upload-wrapper'>
            <MultiUpload {...multiUploadProps}>
              <Button icon='plus'>{label}</Button>
            </MultiUpload>
            <br/>
            <UploadTip maxLength={maxLength} currentLength={currentLength} />
          </div>
        )}
        { showUploadList && peopleList.lehgth && (
          <div className='img-list-wrapper clearfix'>
            {peopleList.map(peopleInfo => {
              const key = peopleInfo.uuid;
              const { name } = peopleInfo.selfAttr;
              if(peopleInfo.uploadStatus === null) { // 上传中
                return (
                  <div key={key} className='monitee-people-list-item fl'>
                    <div className="item-img">
                      <img src={svgDefaultPerson} />
                    </div>
                    <div className='item-uploading'>
                      <div><img src={svgLoadingDark} className='rotation'/></div>
                      <div><span>文件“{name}”正在上传中...</span></div>
                    </div>
                  </div>
                )
              } else if(peopleInfo.uploadStatus) { // 上传成功
                return (
                  <PropleCard key={key} className='fl' item={peopleInfo}>
                    <div className="item-opera"> 
                      <Button icon='edit' className='lib-btn' onClick={() => this.editPeople(peopleInfo)}> 编辑 </Button>
                      <Popconfirm
                        title='确认删除吗' 
                        okText="确定" 
                        cancelText="取消" 
                        onConfirm={() => this.deleteImg(peopleInfo)}
                      >
                        <Button icon='delete' className='lib-btn item-delete'> 删除 </Button>
                      </Popconfirm>
                    </div>
                  </PropleCard>
                )
              } else { // 上传失败
                return (
                  <div key={key} className='monitee-people-list-item fl'>
                    <div className="item-img">
                      <img src={svgDefaultPerson} />
                    </div>
                    <div className='item-fail'>
                      <div className='fail-tip'>
                        <span>文件“{name}”上传失败</span>
                      </div>
                      <div className='fail-opera'>
                        <div className='re-upload'>
                          <img src={svgReUpload} onClick={() => this.reUpload(peopleInfo)} />
                          <span>重新上传</span>  
                        </div>
                        <div className='cancel-upload'>
                          <img src={svgDelete} onClick={() => this.deleteImg(peopleInfo)} />
                          <span>取消上传</span>  
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            })}
          </div>
        )}
        <Modal
          className='monitee-multi-people-edit-modal'
          width='1200px'
          title="人员编辑"
          maskClosable={false}
          visible={editVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          <FormPeopleInfo 
            formRef={form => this.editForm = form}
            uploadType='local'
            selfAttr={editInfo.selfAttr}
            infoList={editInfo.infoList}
            deleteImg={this.editDeleteImg} 
            beforeUpload={this.editBeforeUpload}
            uploadDone={this.editUploadDone}
          />
        </Modal>       
      </div>
    )
  }

  editDeleteImg = (item) => {
    // 删除图片
    const { editInfo } = this.state;
    editInfo.infoList = editInfo.infoList.filter(v => v.uid !== item.uid);
    this.setState({
      editInfo
    })
  }
  editBeforeUpload = (v) => {
    // 设置loading
  }
  editUploadDone = (file) => {
    // 保存图片到本地
    console.log(file, 289)
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
  editPeople = (peopleInfo) => {
    this.setState({
      editVisible: true,
      editInfo: peopleInfo
    })
  }
}

const UploadTip = ({maxLength, currentLength}) => (
  <div className='monitee-people-upload-tip-wrapper'>
    <div>命名规则：<span className='highlight'>姓名-身份证</span>，身份证可为空</div>
    <div>人数限制：单次上传限制为 <span className='highlight'>{maxLength}</span> 人 </div>
    {currentLength && <div>还可选择 <span className='highlight'>{ maxLength - currentLength }</span> 个人员</div>}
  </div>
)

export default MultiPeople;