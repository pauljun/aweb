import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Input, Form } from 'antd-form-component'
import DateRangePicker from 'src/components/RangePicker';
import CaptureTime from './captionTime/index'
import { Row, Col } from 'antd';
import moment from 'moment'
@observer
export default class BasicInfo extends Component {
	componentDidMount(){
		let item = this.props.itemDate || {}
		if(item.name){
			this.props.form.setFieldsValue({
        name: item.name,
        describe: item.describe
      })
		}
	}
	// 数据提交到父组件
	toFatherComponent = (obj) => {
		this.props.changeTasksData && this.props.changeTasksData(obj)
	}
	// 选时控件change
  timeChange = (type, value) => {
    if (type === 'startTime'){
			this.toFatherComponent({
        startTime : moment(new Date(value))
      })
    } else {
			this.toFatherComponent({
        endTime : moment(new Date(value))
      })
    }
	}
	// 抓拍时间change
	captureTimeChange = (obj) => {
		this.toFatherComponent(obj)
	}
	render(){
		const { 
			name='',
			describe='',
			startTime= moment(new Date()),
			endTime= moment().add('days',3),
			captureStartTime='00:00:00',
			captureEndTime='23:59:59'
		} = this.props.itemDate
		const { libType } = this.props
		return(
			<div className='task_basic_info monitee_tasks_box'>
					<Input
						name="name"
						rules={[
							{ max: 50, message: `布控任务名称不超过${50}个字` }
						]}
						required
						label="任务名称"
						placeholder='请输入布控任务名称'
						className='taks_name'
					/> 
					<div className='form-group-item col-item'>
						<div className='form-group-item-label-required'>
							任务有效期 :
							</div>
						<div className={libType === 4 ?'form-group-item-content machineTime':'form-group-item-content'}>
							<DateRangePicker
								allowClear={false}
								className='date-range'
								startTime={startTime}
								endTime={endTime}
								onChange={this.timeChange}
								divider="~"
							/>
						</div>
					</div>
					{libType === 3 && <div className='form-group-item task-capture-time-box'>
						<div className='form-group-item-label-required'>
							任务执行时间 :
							</div>
						<div className='form-group-item-content'>
							<CaptureTime
								captureStartTime={captureStartTime}
								captureEndTime={captureEndTime}
								captureTimeChange={this.captureTimeChange}
							/>
						</div>
					</div>}
					<Input.TextArea
						label="任务说明"
						name="describe"
						style={{ width: '80%', height: 100, resize: 'none' }}
						value={describe}
						onChange={this.describeformchange}
						className='task-describe-basic'
						placeholder='请输入任务说明文字'
						rules={[
							{ max: 200, message: `布控任务说明不超过${200}个字` }
						]}
					/>
			</div>
		)
	}
}