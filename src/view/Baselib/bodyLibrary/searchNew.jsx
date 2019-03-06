import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {BusinessProvider}from 'src/utils/Decorator/BusinessProvider'
import { escapeUrl as Util_escapeUrl } from 'src/utils';
import { message, Button } from 'antd';
import { ColorSelect, TimeRadio, GrapPoint, GroupRadioNew, GroupCheckboxNew } from '../components/SearchGroupNew/';
import { sex, geoAddress, upperColor, lowerColor, head, goods, upperTexture, lowerTexture } from 'src/libs/Dictionary';
import IconFont from 'src/components/IconFont';
import AuthComponent from '../../BusinessComponent/AuthComponent';
import CustomUpload from 'src/components/Upload/upload.sw'
@BusinessProvider('bodyStore','TabStore')
@observer
class SearchView extends Component{
  clear = () => {
    const { bodyStore, searchDataChange, setTimeRadioValue } = this.props
    const { pageSize } = bodyStore.searchData
    bodyStore.initSearchData({ pageSize }).then(
      () => {
        // 修改timeRadio的选中状态
        setTimeRadioValue(3, searchDataChange)
      }
    )
  }
  
  componentDidMount(){
    this.activeTabId = this.props.TabStore.activeTab    
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
        type: 'body',
        model: 1,
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
    const { timeRadioValue, setTimeRadioValue, bodyStore, handleDateChange, onUpload } = this.props;
    const { searchData = {} } = bodyStore;
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
            <ColorSelect
							label='衣服颜色'
              iconFont='icon-Theme_Main'
              // 上衣数据
							dataUpper={upperColor}
							valueUpper={searchData.upColor}
							nameUpper='upColor'
              // 下衣数据
              dataLower={lowerColor}
							valueLower={searchData.lowerColor}
							nameLower='lowerColor'
							change={this.change}
              activeTabId={this.activeTabId}
						/>
            {/* <GroupRadioNew
              // data={eyeGlass}
              label='年龄'
              iconFont='icon-_PeopleAlarm'
              //value={searchData.eyeGlass}
              //name='eyeGlass'
              change={this.change}
            /> */}
            <GroupRadioNew
              data={head}
              label='头部特征'
              iconFont='icon-Control_Black_Main'
              value={searchData.head}
              name='head'
              change={this.change}
            />
            <GroupRadioNew
              data={upperTexture}
              label='上身纹理'
              iconFont='icon-Skin_Main'
              value={searchData.upperTexture}
              name='upperTexture'
              change={this.change}
            />
            <GroupRadioNew
              data={lowerTexture}
              label='下身类别'
              iconFont='icon-Pants_Dark'
              value={searchData.lowerTexture}
              name='lowerTexture'
              change={this.change}
            />
            <GroupRadioNew
              data={goods}
              label='随身物品'
              iconFont='icon-Bag_Dark'
              value={searchData.goods}
              name='goods'
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
