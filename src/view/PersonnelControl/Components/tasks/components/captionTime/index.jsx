import React, { Component } from 'react'
import { Radio, TimePicker } from 'antd'
import moment from 'moment'
import './index.scss'
const RadioGroup = Radio.Group;
export default class CaptureTiem extends Component {
  state = {
    timePickerState: false,// 是否禁用时间控件
    radioValue: 2 // 类型选择 1-全时 2-自定义
  }
  componentDidMount(){
    this.setState({
      radioValue: this.props.radioValue || 2,
      timePickerState: this.props.radioValue === 1 ? true : false
    })
  }
  changeData = (obj) => {
    this.props.captureTimeChange(obj)
  }
  onChangeRadioValue = (e) => {
    if(e.target.value === 1){
      this.setState({
        radioValue: 1,
        timePickerState: true,
      })
      this.changeData({
        captureStartTime: '00:00:00',
        captureEndTime: '23:59:59',
      })
    }else{
      this.setState({
        radioValue: 2,
        timePickerState: false,
      })
    }
  }
  //将时间字符串转化为对应的数字，进行比较
  // getTimeNumber = (time) => {
  // 	let arr = time.split(':')
  // 	return parseInt(arr[0]) * 60 * 60 + parseInt(arr[1]) * 60 + parseInt(arr[2])
  // }
  //抓拍时间
  changeCaptureTime = (isStartTime,moment,time) => {
    if(isStartTime){
      //判断开始时间是否大于结束时间
      // if(this.getTimeNumber(this.state.captureEndTime) - this.getTimeNumber(time) > 0){
      // 	this.setState({
      // 		captureStartTime: time
      // 	})
      // }else{
      // 	message.error('抓拍的开始时间不能大于结束时间')
      // }
      this.changeData({
          captureStartTime: time
      })
    }else{
      // if(this.getTimeNumber(time) - this.getTimeNumber(this.state.captureStartTime) > 0){
      // 	this.setState({
      // 		captureEndTime: time
      // 	})
      // }else{
      // 	message.error('抓拍的开始时间不能大于结束时间')
      // }
      this.changeData({
        captureEndTime: time
      })
    }
  }
  render(){
    const { captureStartTime, captureEndTime } = this.props
    const { radioValue, timePickerState } = this.state
    return (
      <div className='form-group-item-content capture_time'>
        <RadioGroup style={{marginBottom:'10px'}} onChange={this.onChangeRadioValue} value={radioValue}>
          <Radio value={1}>全时</Radio>
          <Radio value={2} style={{marginLeft: '16px'}}>自定义</Radio>
        </RadioGroup>
        <br/>
        <TimePicker className="time_picker" disabled={timePickerState} onChange={this.changeCaptureTime.bind(this,true)} value={moment(captureStartTime, 'HH:mm:ss')} />
        <span className="basic-line"> ~ </span>
        <TimePicker className="time_picker" disabled={timePickerState} onChange={this.changeCaptureTime.bind(this,false)} value={moment(captureEndTime, 'HH:mm:ss')} />
      </div>
    )
  }
}