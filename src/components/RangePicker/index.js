import React,{ Component } from 'react';
import { DatePicker, message } from 'antd';
import moment from 'moment';
import './index.scss';

/** 配置项
  必传
        className='',
  true  startTime, 开始时间： 时间戳（毫秒级13位数字） 或 'YYYY.MM.DD HH:mm:ss'
  true  endTime, 结束时间： 时间戳（毫秒级13位数字）
        maxDate:null,  最大时间： 时间戳（毫秒级13位数字） true: 不超过当前时间
        minDate:null,  最小时间： 时间戳（毫秒级13位数字） 
        dateFormat: 'YYYY.MM.DD HH:mm:ss',
        startLabel ='',
        endLabel='',
        showTime=true,
        showToday=true,
        allowClear=true,
        startTimePlaceholder = '开始时间',
        endTimePlaceholder = '结束时间',
        divider:'-'
 * 
 */
class RangePicker extends Component {

  DATE_FORMAT = 'YYYY.MM.DD HH:mm:ss';
  
  judgeType(data,type) {
    return Object.prototype.toString.apply(data) === `[object ${type}]`;
  }

  onOk = () => {
    const { onOk } = this.props;
    onOk && onOk();
  }

  onChange = (date, type) => {
    const { startTime, endTime, onChange, maxDate } = this.props
    const value = date*1;
    if (type === 'startTime') {
      if(this.minDate && value < this.minDate){
        return message.error(
          '开始时间不能小于最小时间:' + moment(this.minDate).format(this.DATE_FORMAT)
        )        
      }
      if(endTime && value >= new Date(endTime)*1){
        return message.error('开始时间不能大于结束时间')
      }
    }  
    if (type === 'endTime') {
      if(this.judgeType(maxDate, 'Boolean') && maxDate) {
        this.maxDate = moment()*1
      }
      if(this.maxDate && value > this.maxDate){
        return message.error(
          '结束时间不能大于最大时间:' + moment(this.maxDate).format(this.DATE_FORMAT)
        )        
      }
      if(startTime && value < new Date(startTime)*1){
        return message.error('结束时间不能小于开始时间')
      }
    }
    onChange&&onChange(type, value)
  }

  /**
   * minDate: 最小时间
   *    true: 当前时间
   *    false:  不限制最小时间
   *    int: minDate < 86400000，则数字代表天数，如:minDate: -7，即代表最小日期在7天前，正数代表若干天后
   *    int: minDate >= 86400000，则数字代表天数，如:minDate: 4073558400000，即代表最小日期在，moment(minDate)
   */
  disabledStartDate = (startTime) => {
    let { minDate=false, endTime } = this.props; 
    if(this.judgeType(minDate, 'Boolean')){
      this.minDate = minDate ? moment()*1 : false;
    }
    if(this.judgeType(minDate, 'Number')){
      if(minDate >= 0 && minDate < 86400000){
        // 往后minDate天
        this.minDate = moment().add(minDate,'d')*1;
      } else if(minDate < 0){
        // 往前minDate天     
        this.minDate = moment().subtract(-minDate,'d')*1;
      } else {
        // 指定时间点
        this.minDate = moment(minDate)*1;
      }
    }
    if(this.minDate){
      if(endTime){
        return startTime < this.minDate || startTime >= endTime
      } else {
        return startTime < this.minDate
      }
    } else {
      if(endTime){
        return startTime >= endTime
      } else {
        return null
      }
    }
  }

  /**
   * maxDate: 最大时间
   *    false:  不限制时间
   *    true:   不超过当前时间
   *    int: maxDate < 86400000，则数字代表天数，如:maxDate: -7，即代表最大日期在7天前，正数代表若干天后
   *    int: maxDate >= 86400000，则数字代表天数，如:maxDate: 4073558400000，即代表最大日期在，moment(maxDate)
   */
  disabledEndDate = (endTime) => {
    let { maxDate=false, startTime } = this.props;
    if(this.judgeType(maxDate, 'Boolean')){
      this.maxDate = maxDate ? moment()*1 : false;
    }
    if(this.judgeType(maxDate, 'Number')){
      if(maxDate >= 0 && maxDate < 86400000){
        // 往后maxDate天
        this.maxDate = moment().add(maxDate,'d')*1;                                           
      } else if(maxDate < 0){
        // 往前maxDate天  
        this.maxDate = moment().subtract(maxDate,'d')*1;                                     
      } else {
        // 指定时间戳
        this.maxDate = moment(maxDate)*1;                                   
      }
      return endTime > this.maxDate || startTime >= endTime      
    }
    if(this.maxDate){
      if(startTime){
        return endTime > this.maxDate || startTime >= endTime 
      } else {
        return endTime > this.maxDate
      }
    } else {
      if(startTime){
        return startTime >= endTime
      } else {
        return null
      }
    }
  }
  
  formatDate = (date, dateFormat) => {
    if(!date){
      return null
    }
    if (date < 10000000000){
      date = date * 1000
    }
    dateFormat = dateFormat ? dateFormat : this.DATE_FORMAT;
    return moment(moment(date), dateFormat)
  }

  render(){
    let { 
      className='',
      startTime, 
      endTime, 
      dateFormat = null, 
      startLabel ='',
      endLabel='',
      showTime=true,
      showStartToday=false,
      showToday=true,
      allowClear=true,
      startTimePlaceholder = '开始时间',
      endTimePlaceholder = '结束时间',
      minDate=null,
      maxDate=null,
      divider='-',
      onOk,
      dropdownClassName=null,
      mode,
    } = this.props;    
    const rest = mode ? { mode } : {};
    dateFormat = dateFormat ? dateFormat : this.DATE_FORMAT;
    startTime = this.formatDate(startTime,dateFormat)
    endTime = this.formatDate(endTime,dateFormat)
    return (
      <div className={`range-picker-wrapper clearfix ${className}`}>
        <div className='date-picker-wrapper start-picker-wrapper fl'>
          {startLabel && 
            <div className='date-picker-label start-picker-label'>
              {startLabel}     
            </div>
          }
          <div className='date-picker-content start-picker-content'>
            <DatePicker
              showTime={showTime}
              allowClear={allowClear}
              format={dateFormat}
              showToday={showStartToday}
              dropdownClassName={dropdownClassName}
              placeholder={startTimePlaceholder}
              onChange={time => this.onChange(time,'startTime')}
              onOk={this.onOk}
              // value={moment(startTime, dateFormat)}
              value={startTime}
              disabledDate={this.disabledStartDate}
              {...rest}
            />  
          </div>
        </div>
        { divider &&
          <span className='date-picker-divider fl'>{ divider }</span>
        }
        <div className='date-picker-wrapper end-picker-wrapper fl'>
          {endLabel && 
            <div className='date-picker-label end-picker-wrapper'>
              {endLabel}      
            </div>
          }
          <div className='date-picker-content end-picker-content'>
            <DatePicker
              showTime={showTime}
              allowClear={allowClear}
              showToday={showToday}
              format={dateFormat}
              disabledDate={this.disabledEndDate}
              dropdownClassName={dropdownClassName}
              placeholder={endTimePlaceholder}
              onChange={time => this.onChange(time,'endTime')}
              onOk={this.onOk}
              // onOk={time => this.onChange(time,'endTime')}
              // value={moment(endTime, dateFormat)}
              value={endTime}
              {...rest}
            />  
          </div>        
        </div>
      </div>
    )
  }
}

export default RangePicker;