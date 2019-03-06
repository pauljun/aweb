import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import {BusinessProvider}from 'src/utils/Decorator/BusinessProvider';
import { animateFly as Util_animateFly, uuid } from 'src/utils';
import WaterMark from 'src/components/WaterMarkView';
import Pagination from 'src/components/Pagination';
import CustomPagination from '../ModuleWrapper/CustomPagination';
import svgAddress from './Add_Dark.svg';
import svgBrand from './Brand_Dark.svg';
import svgClock from './Clock_Dark.svg';
import AuthComponent from '../../../BusinessComponent/AuthComponent'
import { Checkbox, Tooltip, Progress } from 'antd';
import IconFont from 'src/components/IconFont'
import baselib from 'src/service/RequestUrl/baselib';
import { imgSearchPageSizeOptions } from '../ModuleWrapper';

import './index.scss';

const CheckboxGroup = Checkbox.Group;

@withRouter
@BusinessProvider('TabStore') 
@observer
class ListView extends React.Component{

  id = 'a' + uuid();

  // 以图搜图
  handleImgSearch = item => {
    const { type } = this.props;
    const data = { 
      type, 
      id: item.id,
      model: 2,
      from: type,
    };
    if(type === 'face'){
      data.model = 13;
    } 
    this.jumpUrl(data);    
  }

  /**人体人脸关联查询 */
  searchFaceBody = (item, cType) => {
    const data = { type: cType };
    if(cType === 'face'){
      data.model = 13;
      data.id = item.faceId;
      data.from = 'body';
    } else {
      data.model = 2;
      data.id = item.bodyId;
      data.from = 'face';
    }
    this.jumpUrl(data);
  }

  // 跳转以图搜图
  jumpUrl = (data) => {
    const { TabStore, history, searchData = {} } = this.props;
    TabStore.goPage({
      moduleName: 'baselib',
      childModuleName: 'imgSearch',
      history,
      state: {
        startTime: searchData.startTime,
        endTime: searchData.endTime,
        ...data
      }
    })
    // 跳转不记录日志 edit by welson on 2018-11-05
    // this.getlog(data);
  }

  // 跳转日志
	getlog(data) {
    let logInfo = {};
    if(data.model === 2) {
      logInfo = {
        ...baselib.jumpBodyModule
      };
    } else {
      logInfo = {
        ...baselib.jumpfaceModule
      };
    }
		GlobalStore.LoggerStore.save(logInfo);
  }
  
  // 获取关联人脸人体icon
  getIconByType = (item, cType, relatedTitle,relatedIcon) => {
    let iconFontString = cType === 'face' ? 'icon-Face_Main' : 'icon-Body_Main'
    let OperaIcon = (
      <AuthComponent actionName='BaselibImgSearch'>
        <Tooltip title={relatedTitle}>
          <IconFont className='related-icon' type={iconFontString} onClick={() => this.searchFaceBody(item, cType)} />
        </Tooltip>
      </AuthComponent>
    )
    return OperaIcon
  }

  // 单个选中飞入动画
  checkItem = (e, item) => {
    const suffix = this.props.location.pathname.split('/')[1];
    const target = document.getElementsByClassName(`select-list-toggle1-${suffix}`)[0];
    const start = {
      clientX: e.clientX,
      clientY: e.clientY,
    }
    if(e.target.checked){
      Util_animateFly({
        start,
        url: item.facePath || item.bodyPath,
        target,
        speed: 800,
        posFix: {
          top: 0,
          left: 10
        }
      })
    }
  }

  render(){
    const { 
      className='',
      checkable,
      onChange,
      checkList=[],
      type,
      listData,
      current, 
      pageSize,
      total,
      onPageChange,
      openDiaDetail,
      customPagenation=true,
      imgStyle,
    } = this.props;
    
    let cType, relatedIcon, relatedTitle;
    if(type === 'face' || type === 'body') {
      cType = type === 'face'? 'body' : 'face';
      relatedIcon = type === 'face' ? 'icon-Body_Main' : 'icon-Face_Main';
      relatedTitle = type === 'face'? '人体检索' : '人脸检索';
    }
    let imgStyleClass = ''
    switch(imgStyle) {
      case "1" :
        imgStyleClass='baselib-list-container-sm'
      break;
      case "2" :
        imgStyleClass='baselib-list-container-md'
      break;
      case "3" :
        imgStyleClass='baselib-list-container-lg'
      break;
      default: break;
    }
    return (
      <CheckboxGroup
        className={`baselib-list-wrapper ${this.id} ${className}`} 
        onChange={onChange} 
        value={checkList}
      >
         <ul className={`baselib-list-container clearfix baselib-${type}-list-container ${imgStyleClass}`}>
          {listData.map((item,k) => {
            const relatedFlag = cType && item[cType + 'Id'];
            item.cameraName = item.cameraName || item.deviceName;
            item.cameraName = item.cameraName || item.deviceName;
            return (
              <li className='baselib-list-item fl' key={item.id}>
                <div className='item-img-wrapper'>
                  {checkable && (
                    item.latitide && item.longitude 
                      ? <Checkbox className='item-check' value={item.id} onClick={(e) => this.checkItem(e, item)}></Checkbox> 
                      : <Checkbox className='item-check' disabled></Checkbox>
                  )}
                  <div onClick={() => openDiaDetail(item, k)}>
                    {relatedFlag && <IconFont className='related-icon' type={relatedIcon} />}
                    <WaterMark 
                      className='baselib-watermark-container'
                      background={true}
                      type={type === 'vehicle' ? 'face' : type}
                      src={item.facePath || item.bodyPath || item.picUrl.smallPicUrl || item.picUrl.bigPicUrl}
                    />
                  </div>
                </div>
                <div className='item-info-wrapper'>
                  <div className='item-info-container'>
                    {checkable && ( 
                      <div className='item-info info-score' title={item.cameraName}>
                        {/* <Progress 
                          type="circle" 
                          strokeWidth={15} 
                          width={14} 
                          percent={item.score && +item.score.toFixed()} 
                          showInfo={false} 
                          strokeColor="#FFAA00"
                        /> */}
                        <IconFont className="similar-icon" type='icon-Like_Dark' />
                        <span className='info-value'>
                          相似度  
                          <span className='slide-box'><span style={{width: (item.score*100).toString().substring(0,2) + '%'}}></span></span>
                          <span className='highlight'>{ (item.score*100).toString().substring(0,2)}%</span>
                        </span>
                      </div>
                    )}
                     {type === 'vehicle' && ( 
                      <div className='item-info info-plate-number'>
                        <img className='info-label' src={svgBrand} alt="" title='车牌号码'/>
                        <span className='info-value' title={item.plateNo || ''}> {item.plateNo || '-'} </span>
                      </div>
                     )} 
                    <div className='item-info info-name'>
                      <img className='info-label' src={svgAddress} alt="" title='设备名称'/>
                      <span className='info-value' title={item.cameraName}> {item.cameraName} </span>
                    </div>
                    <div className='item-info info-capture-time'>
                      <img className='info-label' src={svgClock} alt="" title='抓拍时间'/>
                      <span className='info-value'>
                        {item.captureTime && moment(parseFloat(item.captureTime)).format('YYYY.MM.DD HH:mm:ss')}
                        {item.passTime && moment(parseFloat(item.passTime)).format('YYYY.MM.DD HH:mm:ss')}
                      </span>  
                    </div>
                  </div>
                  { type !== 'vehicle' && <div className='item-opera-container'>
                    <AuthComponent actionName='BaselibImgSearch'>
                      <Tooltip title={type === 'face' ? '人脸检索' : '人体检索'}>
                        <IconFont
                          type={type === 'face' ? 'icon-Face_Main' : 'icon-Body_Main'}
                          onClick={() => this.handleImgSearch(item)}
                        />
                      </Tooltip>
                    </AuthComponent>
                    { relatedFlag && (
                      this.getIconByType(item, cType, relatedTitle,relatedIcon)
                    )}
                  </div>}
                </div>
              </li>
            )
          })}
        </ul> 
         <div className='pagination-wrapper'>
        { customPagenation  
            ? <CustomPagination 
                current={current}
                pageSize={pageSize}
                total={total}
                onPageChange={onPageChange}
              />
            : <Pagination 
                total={total}
                current={current}
                pageSize={pageSize}
                onChange={onPageChange}
                pageSizeOptions={imgSearchPageSizeOptions}
              />
          }
        </div> 
         {/* <Tooltip title='返回顶部'>  */}
             {/* <BackTop className='baselib-back-top' key={Math.random()} target={() => document.querySelector(`.${this.id}`)}> 
           </BackTop>    */}
         {/* </Tooltip>  */}
      </CheckboxGroup>
    )
  }
}

export default ListView;
