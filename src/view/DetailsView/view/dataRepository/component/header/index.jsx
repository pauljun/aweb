import React, { Component } from 'react'
import moment from 'moment'
import './index.scss'
const Header = (props) => {
  const { item } = props
  let sex = ''
  if (Number(item.isMale) === 1) {
    sex = '男'
  } else if (Number(item.isFemale) === 1) {
    sex = '女'
  }
  return(
    <div className='detail_header data-repository-header'>
      <div className="item">
        性别: <br/>
        <span>{sex || '-'}</span>
      </div>
      <div className="item">
        抓拍时间: <br/>
        <span>{moment(parseInt(item.captureTime, 10)).format('YYYY.MM.DD HH:mm:ss') || '-'}</span>
      </div>
      <div className="item">
        抓拍地点: <br/>
        <span>{item.cameraName ? item.cameraName : '-'}</span>
      </div>
    </div>
  )
}
export default Header