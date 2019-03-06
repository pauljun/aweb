import React, { Component } from 'react'
import moment from 'moment'
import './index.scss'
import { vehicleColor, plateColor, vehicleBrands } from 'src/libs/Dictionary';
const HeaderVehicle = ({item}) => {
  /*车辆颜色vehicleColor 车牌颜色plateColor*/
    let vehicleC='', plateC='', brandC ='';
    if(item.vehicleColor){
      const vehicleColorItem = vehicleColor.find(v => v.value*1 === item.vehicleColor*1) || {};
      vehicleC = vehicleColorItem.text || '';
    }
    if(item.plateColor){
      const plateColorItem = plateColor.find(v => v.value*1 === item.plateColor*1) || {};
      plateC = plateColorItem.text || '';
    }
    if(item.vehicleBrand){
      const vehicleBrandsItem = vehicleBrands.find(v => v.value * 1 === item.vehicleBrand) || {};
      brandC = vehicleBrandsItem.label || ''
    }
  return(
    <div className='data-repository-vehicle'>
      <div className="detail-item">
        <div className="item">
          车牌颜色: <br/>
          <span>{plateC || '-'}</span>
        </div>
        <div className="item">
          车辆颜色: <br/>
          <span>{vehicleC || '-'}</span>
        </div>
        <div className="item">
          车牌号码: <br/>
          <span>{item.plateNo || '-'}</span>
        </div>
      </div>
      <div className="detail-item">
        <div className="item">
          通行时间: <br/>
          <span>{moment(parseInt(item.passTime, 10)).format('YYYY.MM.DD HH:mm:ss') || '-'}</span>
        </div>
        <div className="item">
          通过设备: <br/>
          <span>{item.deviceName ? item.deviceName : '-'}</span>
        </div>
        <div className="item">
         车辆品牌：<br/>
         <span>{brandC || '-'}</span>
        </div>
      </div>
    </div>
  )
}
export default HeaderVehicle