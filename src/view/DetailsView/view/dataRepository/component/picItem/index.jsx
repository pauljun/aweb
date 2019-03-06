import React, { Component } from 'react'
import IconFont from 'src/components/IconFont'
import { Progress } from 'antd';
import moment from 'moment'
import WaterMark from 'src/components/WaterMarkView';
import './index.scss'
const PicItem = ({item , id, type = 'face', onChange, realName, similarInfo}) => {
  if(type === 'vehicle'){
    type = 'face'
  }
  return (
    <div 
      className={`pic-item ${item.id === id ? 'active': ''}`}
      onClick={onChange.bind(this,item)}
    >
      <div className="img">
        {/* <div className="watermask">{realName}</div>
        <img src={item[type + 'Path'] || (item.picUrl &&(item.picUrl.smallPicUrl || item.picUrl.bigPicUrl))} alt=""/> */}
        <WaterMark src={item[type + 'Path'] || (item.picUrl &&(item.picUrl.smallPicUrl || item.picUrl.bigPicUrl))} type={type}/>
      </div>
      <div className="info">
        {similarInfo && <div className="info-similar">
          <Progress type="circle" strokeWidth={15} width={14} percent={item.score && Number(item.score.toFixed())} strokeColor="#FFAA00" showInfo={false} />
          相似度 <span>{item.score && item.score.toFixed()}%</span>
        </div> }
        {type === 'vehicle' && <div className="info-plateNo">
          <IconFont type='icon-Brand_Dark'/>
          {item.plateNo || '-'}
        </div>}
        <div className="info-address" title={item.cameraName || item.deviceName || ''}>
          <IconFont type='icon-Add_Main'/>
           {item.cameraName || item.deviceName || '-'} 
        </div>
        <div className="info-capture-time">
          <IconFont type='icon-Clock_Light'/>
          {moment(parseInt(item.captureTime || item.passTime, 10)).format('YYYY.MM.DD HH:mm:ss')}
        </div>
      </div>
    </div>
  )
}
export default PicItem;