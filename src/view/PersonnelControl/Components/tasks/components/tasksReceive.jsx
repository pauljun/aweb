import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Checkbox, Radio, Button, message, Popconfirm } from 'antd'
import { Form, Input } from 'antd-form-component'
import OrgSelectUsers from '../../../../BusinessComponent/OrgSelectUsers/index'
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group;
const timeBtns = [
	{
		label: '周一',
		value: '1'
	}, {
		label: '周二',
		value: '2'
	}, {
		label: '周三',
		value: '3'
	},{
		label: '周四',
		value: '4'
	},{
		label: '周五',
		value: '5'
	},{
		label: '周六',
		value: '6'
	},{
		label: '周日',
		value: '7'
	},
]
// 任务告警接收权限
const privilegeNames = [
	['faceAlarm', 'liveAlarmViewHandle'],
	['outsidersAlarm', 'liveAlarmViewHandle'],
	['PhantomAlarms', 'PhantomCurrentAlarmViewHandle'],
	['AIOAlarms', 'liveAlarmViewHandle']
]
export default class TasksReceive extends Component {
	state = {
		repeatModeState: 1
	}
	componentDidMount(){
		let item = this.props.itemDate || {}
		if(item.alarmMode){
			let repeatModeState = 1
			if(item.repeatMode === '8'){
				repeatModeState = 1
			}else if(item.repeatMode === '9'){
				repeatModeState = 2
			}else if(item.repeatMode === '10'){
				repeatModeState = 3
			}else{
				if(item.repeatMode){
					repeatModeState = 4
				}
			}
			this.setState({
				repeatModeState
			})
			this.props.form.setFieldsValue({
        acceptAlarmUser: item.acceptAlarmUser,
				alarmMode: item.alarmMode || [],
				repeatMode: item.repeatMode ? item.repeatMode : '8',
      })
		}
	}
	// 数据提交到父组件
	toFatherComponent = (obj) => {
		this.props.changeTasksData && this.props.changeTasksData(obj)
	}
	// 报警方式选择
	changeAlarmMode = (val) => {
		this.toFatherComponent({
			alarmMode: val
		})
		this.props.form.setFieldsValue({
      alarmMode: val
    })
	}
	// 重复方式类型选择
	repeatMode = (e) => {
		let repeatModeState = e.target.value
		let repeatMode = ''
		if(repeatModeState === 1){
			repeatMode = '8'
		}else if(repeatModeState === 2){
			repeatMode = '9'
		}else if(repeatModeState === 3){
			repeatMode = '10'
		}else if(repeatModeState === 4){
			repeatMode = ''
		}
		this.setState({
			repeatModeState: e.target.value,
		})
		this.toFatherComponent({
			repeatMode
		})
		this.props.form.setFieldsValue({
      repeatMode
    })
	}
	// 重复方式类型选择-自定义
	changeRepeatModeItem = (val) => {
		let repeatMode = this.props.itemDate.repeatMode
		let repeatModeArr = repeatMode.length > 0 ? repeatMode.split(',') : []
		//let isAdd = repeatModeArrr.includes(val)
		let index = repeatModeArr.indexOf(val)
		if(index !== -1){
			repeatModeArr.splice(index,1)
		}else{
			repeatModeArr.push(val)
		}
		repeatMode = repeatModeArr.join(',')
		this.setState({repeatMode})
		this.props.form.setFieldsValue({
      repeatMode
		})
		this.toFatherComponent({
			repeatMode
		})
	}
	/**
	 * 从用户选择组件传递的数据
   */
  changeSelectUser = (acceptAlarmUser) => {
		this.toFatherComponent({
			acceptAlarmUser
		})
		this.props.form.setFieldsValue({
      acceptAlarmUser
    })
	}
	render(){
		const { repeatModeState } = this.state
		const { errorShow } = this.props
		const { alarmMode, repeatMode, acceptAlarmUser } = this.props.itemDate
		let repeatModeArr = (repeatMode && repeatMode.length > 0) ? repeatMode.split(',') : []
		let privilegeName = privilegeNames[this.props.libType - 1]
		return(
			<div className='monitee_tasks_box tasks_receive'>
				{/* --------------报警方式----------------- */}
				<Input
					name='alarmMode'
					type='hidden'
					required
					value={alarmMode}
				/>
				{this.props.libType !== 3 &&<div className='form-group-item'>
					 <div className='form-group-item-label-required repeat-type-tl'>
					 是否推送App :
          </div>
					<div className='form-group-item-content'>
						<CheckboxGroup onChange={this.changeAlarmMode} value={alarmMode}>
							{/* <Checkbox value={'1'}>电脑端页面推送</Checkbox> */}
							<Checkbox value={'2'}>App</Checkbox>	
						</CheckboxGroup>			
					</div> 
					{!!!alarmMode.length && errorShow && <div className='monitees-error' style={{marginTop: '10px'}}>至少选择一种报警方式</div>}
				</div>}

				{/* --------------------重复方式-------------------- */}
				<Input
					name='repeatMode'
					type='hidden'
					required
					value={repeatMode}
				/>
				<div className='form-group-item repeat-mode-box'>
					<div className='form-group-item-label-required'>
						重复方式 :
          </div>
					<div className='form-group-item-content repeat-mode'>
						<RadioGroup style={{marginBottom:'10px'}} onChange={this.repeatMode} value={repeatModeState}>
							<Radio value={1}>每天</Radio>
							{/* <Radio value={2} style={{marginLeft: '50px'}}>工作日</Radio>
							<Radio value={3} style={{marginLeft: '50px'}}>周末</Radio> */}
							<Radio value={4} style={{marginLeft: '50px'}}>自定义</Radio>
						</RadioGroup>
						{	repeatModeState === 4 && 
							 timeBtns.map(v => (<Button
									key={v.value}
									className={repeatModeArr.indexOf(v.value) === -1 ? '' : 'active'}
									onClick={this.changeRepeatModeItem.bind(this,v.value)}
								>
									{v.label}
								</Button>)
							) 
						}
					</div>
				</div>
					{!!!repeatModeArr.length && errorShow && <div className='monitees-error repeat-mode-error' style={{marginTop: '10px'}}>至少选择一种重复方式</div>}
					{/* ---------------------------接收报警人员---------------------------- */}
					 <Input
            name='acceptAlarmUser'
            type='hidden'
            required
						value={acceptAlarmUser}
          />             
          <div className='form-group-item'>
            <div
              className='form-group-item-label-required'
            >
              接收报警人员 :
            </div>
            <div className='form-group-item-content'>
               {/* <PromissionManagement
                formTreeData={modelData.formTreeData}
                orgUserList={modelData.orgUserList} 
                userId={acceptAlarmUser}
                setCheckedKeys={this.setCheckedKeys}
              />  */}
							<OrgSelectUsers 
								defaultSelectUser={acceptAlarmUser}
								onChange={this.changeSelectUser}
								privilegeName={privilegeName}
								andOr={2}
							/>
               {!!!acceptAlarmUser.length && errorShow && <div className='monitees-error' style={{marginTop: '10px'}}>请输入管理权限</div>} 
            </div>
          </div> 
			</div>
		)
	}
}