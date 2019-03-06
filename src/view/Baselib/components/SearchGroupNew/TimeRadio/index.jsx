import React, { Component } from 'react';
import { DatePicker,message, Radio } from 'antd';
import moment from 'moment';
import IconFont from 'src/components/IconFont';
import getTimeRange from '../timeRadioUtil';
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY.MM.DD HH:mm:ss'

class TimeRadio extends Component{
  state = {
    value: 3
  }
  disabledDate = (current) => {
    const value = new Date(current).valueOf()
    const timeNow=new Date().valueOf()
    const timeDiff=value-timeNow
    const dayDiff=Math.abs(Math.floor(timeDiff/86400000))
    return dayDiff > 30;
  }
  onChange = (dateString,type) => {
    const { startTime, endTime} = this.props
    const value = new Date(dateString).valueOf()
    if (type === 'startTime') {
      if (endTime && value > endTime){
        message.warning('开始时间不能大于结束时间')
        return
      }
    }else{
      if (startTime && value < startTime) {
        message.warning('结束时间不能小于开始时间')
        return
      }
    }
    this.props.change({
      [type]: value
    })
  }

  onOk = (options={}) => {
    const { onOk } = this.props
    onOk && onOk(options)
  }

  // 单选
  radioSelect = (e) => {
    let value = e.target.value;
    const { changeTimeRaioValue } = this.props;
    const { startTime, endTime } = getTimeRange(value);
    changeTimeRaioValue && changeTimeRaioValue(e.target.value, () => {
      this.onOk({
        startTime,
        endTime
      })
    });
    // this.props.change({
    //   startTime,
    //   endTime
    // })
  }

  render(){
    let { label, startTime, endTime, value } = this.props
    if(value === 2){
      // 自定义
      startTime = moment(startTime).format(dateFormat)
      endTime = moment(endTime).format(dateFormat)
    }
    return (
      <div className='item'>
        <div className='label-data-repository'>
          <IconFont 
						type="icon-Clock_Light"
						className="data-repository-icon"/>
          {label ? label : '时间'}：
          </div>
        <div className='item-content'>
          <RadioGroup onChange={this.radioSelect} value={value}>
            {/* <Radio value={null}>全部</Radio> */}
            <Radio value={1}>24小时</Radio>
            <Radio value={3}>3天</Radio>
            <Radio value={7}>7天</Radio>
            <Radio value={15}>15天</Radio>
            <Radio value={2}>自定义</Radio>
          </RadioGroup>
          {value === 2 && <div>
            <DatePicker
              disabledDate={this.disabledDate}
              showTime
              allowClear={false}
              format={dateFormat}
              placeholder='开始时间'
              onChange={(dateString) => this.onChange(dateString,'startTime')}
              onOk={() => this.onOk()}
              defaultValue={moment(startTime,dateFormat)}
              value={moment(startTime,dateFormat)}
            />
            <DatePicker
              disabledDate={this.disabledDate}
              showTime
              allowClear={false}
              format={dateFormat}
              placeholder='结束时间'
              onChange={(dateString) => this.onChange(dateString,'endTime')}
              onOk={() => this.onOk()}
              defaultValue={moment(endTime, dateFormat)}
              value={moment(endTime, dateFormat)}
            />
          </div>}
        </div>
      </div>
    )
  }
}

export default TimeRadio;
