import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {BusinessProvider}from 'src/utils/Decorator/BusinessProvider'
import { escapeUrl as Util_escapeUrl } from 'src/utils';
import { message, Button } from 'antd';
import { TimeRadio, GrapPoint, GroupRadioNew, GroupCheckboxNew } from '../components/SearchGroupNew/';
import { sex, geoAddress, eyeGlass } from 'src/libs/Dictionary';
import IconFont from 'src/components/IconFont';
import AuthComponent from '../../BusinessComponent/AuthComponent';
import CustomUpload from 'src/components/Upload/upload.sw'

@BusinessProvider('faceStore','TabStore')
@observer
class SearchView extends Component{

  //清除查询条件
  clear = () => {
    const { faceStore, searchDataChange, setTimeRadioValue } = this.props
    const { pageSize } = faceStore.searchData;
    faceStore.initSearchData({pageSize}).then(
      () => {
        // 修改timeRadio的选中状态
        setTimeRadioValue(3, searchDataChange)
      }
    )
  }

  jumpUrl = file => {
    if(!file.url){
      return message.error('图片上传失败，请重试')
    }
    const { TabStore, history } = this.props;
    TabStore.goPage({
      moduleName: 'baselib',
      childModuleName: 'imgSearch',
      history,
      data: {
        url: Util_escapeUrl(file.url, true),
        type: 'face',
        model: 11,
      },
    })
  }  

  change = (options={}) => {
    options.pageType = 0
    options.maxCaptureTime = ''
    options.maxId = ''
    options.minCaptureTime = ''
    options.minId = ''
    this.props.searchDataChange(options)
  }
  render(){
    const { 
      timeRadioValue, 
      setTimeRadioValue, 
      faceStore, 
      handleDateChange,
      onUpload
     } = this.props;
    const { searchData = {} } = faceStore;
    const BTN = <Button className='search-btn-data-repository'>
      <IconFont type='icon-ImageSearch_Light'/>
      <span>以图搜图</span>
    </Button>
    return (
      <div className='data-repository-search'>
        <div className="upload-or-search">
          {onUpload && (
            <AuthComponent actionName={'BaselibImgSearch'}>
              <CustomUpload
                className='img-upload'
                expiretype={2}
                uploadBtn={BTN}
                uploadTip={false}
                uploadDone={onUpload}
              />
            </AuthComponent>
          )}
        </div>
        <div className="search-title">
          图库筛选：
          <Button className='reset-btn' onClick={this.clear}>重置</Button>
        </div>
        <div className='container'>
          <div className='data-repository-search-form'>
            <TimeRadio
              change={handleDateChange}
              onOk={this.change}
              value={timeRadioValue}
              startTime={searchData.startTime}
              endTime={searchData.endTime}
              changeTimeRaioValue={setTimeRadioValue}
            />
            <GrapPoint
              value={searchData.cameraIds}
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
            <GroupRadioNew
              data={eyeGlass}
              label='眼镜'
              iconFont='icon-Control_Black_Main'
              value={searchData.eyeGlass}
              name='eyeGlass'
              change={this.change}
            />
            {/* <GroupRadioNew
              data={geoAddress}
              label='场所'
              iconFont='icon-Community_Main1'
              value={searchData.geoAddress}
              name='geoAddress'
              change={this.change}
            /> */}
            <GroupCheckboxNew 
              data={geoAddress}
              label='场所'
              showCheckAll={false}
              iconFont='icon-Community_Main1'
              value={searchData.geoAddress}
              name='geoAddress'
              change={this.change}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default SearchView;
