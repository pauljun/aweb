import React, { Component } from 'react'
import { Button } from 'antd'
import { Input } from 'antd-form-component'
import IconFont from 'src/components/IconFont'
import MapMarkerVideo from '../../../../BusinessComponent/MapSelect/index'
import OrgSelectDevice from '../../../../BusinessComponent/OrgSelectDevice/index'
export default class TasksScope extends Component {
	state = {
		type: 1, // 1-地图模式 2-列表模式
		selectList: []
	}
	changeType = (type) => {
		if(this.state.type !== type){
			this.setState({
				type
			})
		}
	}
	componentDidMount(){
		let item = this.props.itemDate || {}
		if(item.device){
			this.props.form.setFieldsValue({
        device: item.device
      })
		}
	}
	shouldComponentUpdate(nextProps,nextState){
		if(nextState.type !== this.state.type){
			return true
		}
		if(nextProps.errorShow !== this.props.errorShow){
			return true
		}
		if(nextProps.itemDate.device === this.props.itemDate.device){
			return false
		}
		return true
	}
	// 数据提交到父组件
	toFatherComponent = (selectList) => {
		let obj = {
			device: selectList
		}
		this.props.changeTasksData && this.props.changeTasksData(obj)
	}
	changeSelectList = (selectList) => {
		this.props.form.setFieldsValue({
			device: selectList
		})
		this.toFatherComponent(selectList)
	}
	deleteDeviceItem =(item) => {
		let selectList = this.props.itemDate.device
		selectList = selectList.filter(k => {
			if(k.id !== item.id){
				return true
			}
		})
		this.changeSelectList(selectList)
	}
	render(){
		const { errorShow, itemDate } = this.props
		let device = itemDate.device
		return(
			<div className='monitee_tasks_box tasks_scope'>
				<div className="scope-type">
					<Button className={`btn ${this.state.type === 1 && 'active'}`} onClick={this.changeType.bind(this,1)}><IconFont type="icon-List_Map_Main"/>地图模式</Button>
					<Button className={`btn ${this.state.type === 2 && 'active'}`} onClick={this.changeType.bind(this,2)}><IconFont type="icon-List_Tree_Main"/>列表模式</Button>
				</div>
				<div className="tasks_scope_box">
					<Input 
						name='device'
						type='hidden'
						required
					/>
					<div className='form-group-item'>
						 {/* <div className='form-group-item-label-required'>
							 布控范围 : 
									</div>  */}
						<div className='form-group-item-content'>
							{this.state.type === 1 ? 
							<div className='libs-select-map'>
								<div className="libs-select-left">
									<MapMarkerVideo 
										onSelect={this.changeSelectList} 
										selectList={device} 
										//isShowList={true}
										deleteDeviceItem={this.deleteDeviceItem}/>
								</div>
								<div className="libs-select-right">

								</div>
								</div> 
							: <div className='libs-select-list'>
								 <OrgSelectDevice onChange={this.changeSelectList} defaultSelectList={device} footer={false} hasSolidier={false}/>
								</div>}
							{!!!device.length && errorShow && <div className='monitees-error' style={{marginTop: '10px'}}>请选择布控范围 </div>}
						</div>
					</div>
				</div>
			</div>
		)
	}
}