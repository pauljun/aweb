import React, { Component } from 'react';
import { Row, Col } from 'antd';
let repeatModeObj = {
	'1':'周一',
	'2':'周二',
	'3':'周三',
	'4':'周四',
	'5':'周五',
	'6':'周六',
	'7':'周日',
	'8':'每天',
	'9':'工作日',
	'10':'周末'
}
const TasksReceiveView = (props) => {
  const { item } = props
  //报警方式
  let alarmModeArr = []
  if(item.alarmMode === '1'){
    alarmModeArr = [
      //'电脑端页面推送'
      '不推送'
    ]
  }else if(item.alarmMode === '2'){
    alarmModeArr = [
      //'APP端页面推送'
      '推送'
    ]
  }else{
    alarmModeArr = [
      //'电脑端页面推送',
      //'APP端页面推送'
      '推送'
    ]
  }
  //重复方式
  let repeatModeArr = []
  item.repeatMode && item.repeatMode.split(',').sort().map(item => {
    if(item){
      repeatModeArr.push(repeatModeObj[item])
    }
  })
  // 告警人员
  let acceptAlarmUserNameArr=[]
  item.acceptAlarmUsers&&item.acceptAlarmUsers.map(v => {
    acceptAlarmUserNameArr.push(v.userName)
  })
  return (
    <div className="tasks_receive_view info_view">
      <Row>
      {props.libType !== 3 && <Col span={24}>
          <div className='label'>是否推送App：</div>
          <div className='content'>
            {alarmModeArr && alarmModeArr.map((v,k) => <span key={k}>{v}</span> )}
          </div>
        </Col>}
        <Col span={24}>
          <div className='label'>重复方式：</div>
          <div className='content'>
             {repeatModeArr && repeatModeArr.map((v,k) => <span key={k}>{v}</span> )} 
          </div>
        </Col>
        {/* <Col span={12} className="alarm-receive-user">
          <div className='label'>告警接收人员：</div>
          <div className='content'>
             {acceptAlarmUserNameArr && acceptAlarmUserNameArr.map((v,k) => <span key={k}>{v}</span> )} 
          </div>
        </Col> */}
      </Row>
      <Row>
        <Col span={24} className="alarm-receive-user">
          <div className='label'>告警接收人员：</div>
          <div className='content'>
             {acceptAlarmUserNameArr && acceptAlarmUserNameArr.map((v,k) => <span title={v} key={k}>{v}</span> )} 
          </div>
        </Col>
      </Row>
      {/* <Row>
        <Col span={12} className="alarm-receive-user">
          <div className='label'>告警接收人员：</div>
          <div className='content'>
             {acceptAlarmUserNameArr && acceptAlarmUserNameArr.map((v,k) => <span key={k}>{v}</span> )} 
          </div>
        </Col>
      </Row> */}
    </div>
  )
}
export default TasksReceiveView