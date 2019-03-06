import React, { Component } from 'react'
import WaterMark from 'src/components/WaterMarkView';
import moment from 'moment'
import './index.scss'
const HeaderImgSearch = ({item, uploadImgUrl, realName, type = 'face'}) => {
  console.log(type,'type')
  return(
    <div className='data-repository-img-search'>
      <div className="upload-img img-box">  
        <div className="img">
          {/* <div className="watermask">{realName}</div>
          <img src={uploadImgUrl} alt=""/> */}
          <WaterMark src={uploadImgUrl} type={type}/>
        </div>
        <div className="title">上传{type === 'face' ? '人脸' : '人体'}</div>
      </div>
      <div className="compare-img img-box">
        <div className="img">
          {/* <div className="watermask">{realName}</div>
          <img src={item[type + 'Path']} alt=""/> */}
          <WaterMark src={item[type + 'Path']} type={type}/>
        </div>
        <div className="title">对比{type === 'face' ? '人脸' : '人体'}</div>
      </div>
      <div className="compare-result">
        <div className="similar-value">
          <div className="left">相似度</div>
          <div className="center">
            <div style={{
              width: item.score + 'px',
              height:'100%'
            }}></div>
          </div>
          {/* <div className="right">{item.score && item.score.toFixed()}%</div> */}
          <div className="right">{(item.score*100).toString().substring(0,2)}%</div>
        </div>
        <div className="res-container">
          <div className="res-address list">
            抓拍像机：<span>{item.cameraName || '-'}</span>
          </div>
          <div className="res-capture-time list">
            抓拍时间： <span>{item.captureTime ? moment(parseInt(item.captureTime,10)).format('YYYY.MM.DD HH:mm:ss'): '-'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HeaderImgSearch