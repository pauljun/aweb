import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {BusinessProvider}from 'src/utils/Decorator/BusinessProvider'
import IconFont from 'src/components/IconFont'
import { sex } from 'src/libs/Dictionary';
import { Button, Spin, message } from 'antd';
import IconSpan from 'src/components/IconSpan';
import CustomUpload from 'src/components/Upload/upload.sw.jsx';
import CaptureViewPlus from '../components/ImageView/captureViewPlus.jsx';
import RangePicker from 'src/components/RangePicker';
import { GroupRadioNew, ScoreSlider, GrapPoint } from '../components/SearchGroupNew';

@BusinessProvider('imgSearchStore')
@observer
class imgSearch extends Component{
  state = {
    imgCutVisible:false,
    uploadLoading: false,
	}
  //清除查询条件
	clear = () => {
    const { imgSearchStore, clearCheckList, pageState = {} } = this.props;
    let { url, type, feature } = imgSearchStore.searchData;
    if(pageState.startTime && pageState.endTime){
      imgSearchStore.initData({ 
        url, 
        type, 
        feature,
        startTime: pageState.startTime,
        endTime: pageState.endTime
      });
    }else{
      imgSearchStore.initData({ url, type, feature });
    }
    clearCheckList([])
    this.props.search(true)
		this.setState({
      imgCutVisible:false,
		})
  }

	change = (options={}, doSearch=true) => {
		this.props.searchDataChange(options).then(() => {
      doSearch && this.props.search();
    })
  }
  // 搜索时间改变
  handleDateChange = (type, value) => {
    this.change({[type]: value}, false);
  }

  handleDateOk = () => {
    this.change()
  }

  beforeUpload = () => {
    this.setState({
      uploadLoading: true
    })
  }

  uploadDone = (file) => {
    this.setState({
      uploadLoading: false
    })
    if(file){
      this.changeheadImg(file.url);
    } else {
      message.error('系统错误')
    }
  }
	changeheadImg = url => {
    this.change({ url }, false)
		this.props.uploadDone(url)
	}
	captureCb = url => {
		this.changeheadImg(url)
		this.setState({
			imgCutVisible: false
		})
	}
	setImgCutVisible = () => {
		this.setState({
			imgCutVisible: !this.state.imgCutVisible
		})
	}

	delPic = () => {
		this.changeheadImg('')
  }

	render(){
    const { imgCutVisible, uploadLoading } =this.state;
    const { showSwitch, changeType, imgSearchStore: {searchData} } = this.props;
    const { url, type, score, startTime, endTime, cameraIds } = searchData;
    let uploadBtn = '请上传jpg、jpeg、png格式的照片搜索';
    if(url){
      uploadBtn = (
        <div>
          <img src={url} alt='' /> 
        </div>
      )
    }
		return (
			<div className='data-repository-search img-search-box'>
        <div className="search-title">
          <Button className='reset-btn' onClick={this.clear}>重置</Button>
        </div>
        <div className="search-container-outer">
          {showSwitch && (
            <div className='face-body-search-select'>
              <Button
                className='face-select' 
                type={type==='face' ? 'primary' : ''} 
                onClick={() => changeType('face')}
              > <IconFont type='icon-Face_Main'/>人脸 </Button>
              <Button
                className='body-select' 
                type={type==='body' ? 'primary' : ''} 
                onClick={() => changeType('body')}
              > <IconFont type='icon-Body_Main'/>人体 </Button>
            </div>
          )}
          <Spin spinning={uploadLoading}>
            <div className='baselib-upload-contaier'>
              <CustomUpload
                className='baselib-upload'
                uploadBtn={uploadBtn}
                beforeUpload={this.beforeUpload}
                uploadTip={false}
                expiretype={2}
                uploadDone={this.uploadDone}
              />
              { url && (
                <div className="img-opare">
                  <span>
                    <IconSpan 
                      className='delete-img' 
                      icon='icon-Delete_Main' 
                      mode='inline' 
                      label='删除图片' 
                      onClick={this.delPic}
                    />
                    <span className='devider'></span>
                    <IconSpan 
                      mode='inline'
                      icon={imgCutVisible ? 'icon-Close_Main' : 'icon-Choose__Main1'} 
                      label={imgCutVisible ?'取消框选':'手动框选'} 
                      onClick={this.setImgCutVisible}
                    />
                  </span>
                </div>
              )}
            </div>
          </Spin>
          <div className='container search-by-pic'>
            <div className='data-repository-search-form'>
              <div className='item'>
                <div className='label-data-repository'>
                  <IconFont type="icon-Clock_Light" className="data-repository-icon"/>
                  时间选择：
                </div>
                <div className='item-content'>
                  <RangePicker
                    className='rangepicker-select'
                    allowClear={false}
                    maxDate={true}
                    minDate={-30}
                    startLabel='开始时间：'
                    endLabel='结束时间：'
                    divider={false}
                    startTime={startTime}
                    endTime={endTime}
                    onOk={this.handleDateOk}
                    onChange={this.handleDateChange}
                  />
                </div>
              </div>
              <ScoreSlider
                iconFont='icon-Like_Dark'
                name='score'
                value={score}
                change={this.change}
              />
              <GrapPoint
                value={cameraIds}
                onChange={this.change}
              />
              <GroupRadioNew
                data={sex}
                label='性别'
                iconFont='icon-Sex_Dark'
                value={searchData.sex}
                name='sex'
                change={this.change}
              />
            </div>
          </div>
          {/* <SearchClearGroup
            search={() => this.props.search(true)}
            clear={this.clear}
          /> */}
        </div>
        {imgCutVisible &&
          <div className="img-cut-wrapper">
            <div className='img-cut-header'>
              <span>手动框选</span>
              <IconSpan icon='icon-Close_Main' mode='inline' onClick={this.setImgCutVisible} />
            </div>
            <CaptureViewPlus
              isDownload={true}
              isStorage={true}
              isRotate={true}
              isScan={true}
              isScale={true}
              styles={{width:'280px'}}
              options={{
                capture: true,
                init:true,
                urlSrc: url,
                width: '400px',
                height: '400px',
                captureCb: this.captureCb
              }}
            />
            <div className='img-cut-footer'></div>
          </div>
        }
			</div>
		)
	}
}

export default imgSearch;
