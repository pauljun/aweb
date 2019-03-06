import React, { Component } from 'react';
import moment from 'moment'
import { Row, Col } from 'antd';
const BasicInfoView = (props) => {
  const { item } = props
  let startTime=moment(item.startTime*1).format('YYYY.MM.DD HH:mm:ss')
  let endTime=moment(item.endTime*1).format('YYYY.MM.DD HH:mm:ss')
  return (
    <div className="basic_info_view info_view">
      <Row>
        <Col span={24}>
          <div className='label'>任务名称：</div>
          <div className='content'>{item.name}</div>
        </Col>
        <Col span={24}>
          <div className='label'>创建人：</div>
          <div className='content'>{item.creatorName}</div>
        </Col>
        {props.libType !== 3 && <Col span={24}>
          <div className='label'>创建时间：</div>
          <div className='content'>{moment(item.createTime*1).format('YYYY.MM.DD HH:mm:ss')}</div>
        </Col>}
        <Col span={24}>
          <div className='label'>任务有效期：</div>
          <div className='content'>{item.startTime && item.endTime && `${startTime} ~ ${endTime}`}</div>
        </Col>
        {props.libType === 3 && <Col span={24}>
          <div className='label'>任务执行时间：</div>
          <div className='content'>{item.captureStartTime && item.captureEndTime && `${item.captureStartTime} ~ ${item.captureEndTime}`}</div>
        </Col>}
        <Col span={24}>
          <div className='label'>任务说明：</div>
          <div className='content'>{item.describe}</div>
        </Col>
      </Row>
    </div>
  )
}
export default BasicInfoView