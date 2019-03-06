import React from "react";
import moment from 'moment'
import _ from 'lodash'
import IconFont from 'src/components/IconFont'
import { observer, inject } from 'mobx-react'
import { message, Row, Col, Collapse, Modal } from 'antd';
import { getCameraTypeIconType } from '../../../../../libs/Dictionary'
import { BusinessProvider } from '../../../../../utils/Decorator/BusinessProvider';
import { splitArrForX } from 'src/utils'
import { toJS } from 'mobx'
// 查看布控任务组件
import BasicInfoView from './component/basicInfoView'
import LibsListView from './component/libsListView'
import TasksScopeView from './component/tasksScopeView'
import TasksReceiveView from './component/tasksReceiveView'
import FormBtn from './component/formBtn'
import { Form } from 'antd-form-component'
// 编辑组件
import BasicInfo from '../components//basicInfo' //基本信息
import LibsList from '../components/libsList' //布控对象
import TaskScope from '../components/tasksScope' //任务范围
import TaskReceive from '../components/tasksReceive' //任务接收

import "./index.scss";
// import '../addTask/index.scss'

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
const Panel = Collapse.Panel;
@Form.create()
@BusinessProvider('MoniteeLibsStore', 'MoniteeTasksStore', 'DeviceStore')
@observer
class view extends React.Component {
	state = {
    taskData: {
      taskType: 101501 //黑名单
		}, //布控任务信息
		basicInfoisShow: false,
		libslistisShow: false,
		taskScopeisShow: false,
		taskReceiveisShow: false,
		devicesBoxList: [],
		machineLibs:{},
		//modelData: {},// 用户组织机构
		activeKey: ['0','1', '2', '3'],
		initTaskData: {}, // 布控初始值，当编辑取消时使用
		errorShow: false
  }
	componentDidMount() {
		console.log('componentDidMount','========================')
    // const { MoniteeLibsStore } = this.props
    // /**获取用户评级组织结构树 */
    // MoniteeLibsStore.getOrgUsersList().then(modelData => {
    //   this.setState({
    //     modelData
    //   })
    // })
		//数据处理 -- 编辑页面 -- 查看详情页面
		this.dealItemData()
	}
	// 对传入的说数据进行处理 
	dealItemData = () => {
		let item = this.props.item
		if (item && item.name){
			// 对acceptAlarmUser进行处理
			let acceptAlarmUser = item.acceptAlarmUser && item.acceptAlarmUser.length > 0 ? item.acceptAlarmUser : []
			if(acceptAlarmUser.length > 0){
				let arr = []
				acceptAlarmUser.forEach(v => arr.push('user-' + v))
				acceptAlarmUser = arr
			}
			// 对device进行处理
			let device = item.device || []
			let cameraArray = this.props.DeviceStore.cameraArray
			let deviceArr = cameraArray.filter(item => {
				if(~device.indexOf(item.id)){
					return true
				}
			})
			let taskData = {
				id: item.id,
				name: item.name,
				startTime: moment(new Date(item.startTime * 1)),
        endTime: moment(new Date(item.endTime * 1)),
				captureStartTime: item.captureStartTime ? item.captureStartTime : '00:00:00',//兼容之前布控任务
				captureEndTime: item.captureEndTime ? item.captureEndTime : '23:59:59',
        describe: item.describe ? item.describe : '',//兼容之前布控任务
				alarmThreshold: item.alarmThreshold ? item.alarmThreshold : (this.props.libType === 3 ? undefined : 80),//兼容之前布控任务
				libId: item.libId,
				libs: item.libs,
				device: deviceArr,
        acceptAlarmUser: acceptAlarmUser,
				//alarmMode: item.alarmMode ? item.alarmMode :this.props.libType === 4 ? '1,2,3' : '1,2',//兼容之前布控任务
				alarmMode: (item.alarmMode && item.alarmMode.length > 0) ? item.alarmMode.split(',') : ['1', '2'],
				repeatMode: item.repeatMode ? item.repeatMode : '8'//兼容之前布控任务
			}
			this.setState({
				taskData,
				initTaskData: _.cloneDeep(taskData)
			})
		}
	}
	// 手风琴头部信息
	collapseHeader = (index) => {
		let headerTitle = ['基本信息','重点人员','任务范围','任务接收',]
		let catg = ['basicInfoisShow','libslistisShow','taskScopeisShow','taskReceiveisShow']
		return (
			<div className='colla-header'>
				<div className="left_title">
					<div className="colla-left">{headerTitle[index]}</div>
					{!!(~(this.index ? this.index : [0,1,2,3]).indexOf(index)) && <div className="colla-right" onClick={(e) => this.showEditComponent(e,index)}>
						{this.state[catg[index]] ? <i className="icon anticon">&#xa61c;</i> : <i className="icon anticon">&#xa61f;</i>}
						<span index={this.state[catg[index]] ? '1' : '0'}>{this.state[catg[index]] ? '取消' : '编辑'}</span>        
					</div>}
				</div>
				<div className="right_icon" onClick={this.changeActive.bind(this, index + '')}>
					<IconFont type={~this.state.activeKey.indexOf(index + '') ? 'icon-Arrow_Small_Up_Main' : 'icon-Arrow_Small_Down_Mai'}/>
				</div>
			</div>
		)
	}
	changeActive = (index) => {
		let activeKey = []
		if(~this.state.activeKey.indexOf(index)){
			// 存在--剔除
			activeKey = _.without(this.state.activeKey, index)
		}else{
			// 不存在
			activeKey = this.state.activeKey.concat(index)
		}
		this.setState({
			activeKey
		})
	}
	showEditComponent = (e, index) => {
		// 编辑转态下默认展开对应的组件
		let activeKey = this.state.activeKey
		if(~activeKey.indexOf(index + '')){
			// 存在--不处理
			//activeKey = _.without(this.state.activeKey, index)
		}else{
			// 不存在 -- 添加
			activeKey = this.state.activeKey.concat([index + ''])
		}
		// 这里需要增加一个提示弹框
		e.stopPropagation()
		let isEdit = e.target.getAttribute('index') === '0' ? true : false
		let componentState = ['basicInfoisShow', 'libslistisShow', 'taskScopeisShow', 'taskReceiveisShow']
		let showComponent = componentState[index]
		let initTaskData = this.state.initTaskData // 初始化数据
		if(isEdit){
			this.index = [index] // 当前组件可编辑
		}else{
			this.index = [0,1,2,3] // 所有组件可编辑
		}
		this.setState({
			[showComponent]: isEdit,
			taskData: initTaskData,
			activeKey
		})
	}
	// 取消提交
	cancleSubmit = (index) => {
		let componentState = ['basicInfoisShow', 'libslistisShow', 'taskScopeisShow', 'taskReceiveisShow']
		let showComponent = componentState[index]
		let initTaskData = this.state.initTaskData
		this.index = [0,1,2,3]
		this.setState({ 
			taskData: initTaskData,
			[showComponent]: false,
		})
	}
	/**提交数据前对部分数据进行处理 */
	handleData = (data) => {
		if(data.alarmMode){
			data.alarmMode=data.alarmMode.join(',')
		}
		if(data.acceptAlarmUser){
			let acceptAlarmUser = []
			data.acceptAlarmUser.map(v => {
				let spd = v.split('-')
				if (spd[0] === 'user') {
					acceptAlarmUser.push(spd[1])
				}
				return v
			})      
			//data.acceptAlarmUser = acceptAlarmUser.join(',')
			data.acceptAlarmUser = acceptAlarmUser
		}
	}
	// 确认修改
	toSubmit = () => {
		console.log('确认修改')
		this.props.form.validateFields((err, data) => {
			if(err){
				this.setState({
					errorShow: true
				})
				return message.error('表单验证失败')
			}
			let taskData = Object.assign({}, this.state.taskData, data)
			//对收集的数据进行处理
			taskData.startTime = taskData.startTime * 1
			taskData.endTime = taskData.endTime * 1
			this.handleData(taskData)
			// // 对相机id进行处理
      let deviceIds = []
      for(let i = 0; i < taskData.device.length; i++){
        deviceIds.push(taskData.device[i].id)
      }
			taskData.device = deviceIds
			// 提交数据
			this.props.MoniteeTasksStore.onSubmit(taskData).then(res => {
        if(res && res.code === 200){
          message.success('修改成功')
					// 调用接口，更新列表和单个任务详情
					this.props.updateNavList && this.props.updateNavList()
        }
      })
		})
	}
	// 从编辑组件修改的数据
	changeTasksData = (obj) => {
		let taskData = Object.assign({}, this.state.taskData, obj)
    this.setState({ taskData })
	}

	render() {
		const { taskData, basicInfoisShow, libslistisShow, taskScopeisShow, taskReceiveisShow, libType, activeKey, errorShow } = this.state
		console.log(taskData,'render-------------')
		const { item } = this.props
		return (
			<div className="library-form-wrapper">
				<div className="library-view library-edit">
					<div className="task-top-title" title={taskData.name}>
						{taskData.name}
					</div>
					<Form>
					<div className="task-container-box">
						<Collapse bordered={false} activeKey={activeKey}>
							<Panel header={this.collapseHeader(0)} key="0">
								{basicInfoisShow ? <div>
									<BasicInfo 
										itemDate={taskData}
										changeTasksData={this.changeTasksData}
										form={this.props.form}
										libType={this.props.libType}
									/>  
									 <FormBtn 
										cancleSubmit={this.cancleSubmit}
										toSubmit={this.toSubmit}
										index={0}
									/> 
								</div> : <BasicInfoView item={item} />}
							</Panel>
							{this.props.libType !== 3 && <Panel header={this.collapseHeader(1)} key="1">
								{libslistisShow ? <div>
									<LibsList 
										itemDate={taskData}
										errorShow={errorShow}
										changeTasksData={this.changeTasksData}
										form={this.props.form}
										libType={this.props.libType}
										item={item}
									/>
									<FormBtn 
										cancleSubmit={this.cancleSubmit}
										toSubmit={this.toSubmit}
										index={1}
									/> 
								</div> : <LibsListView item={item} />}
							</Panel>}
							<Panel header={this.collapseHeader(2)} key="2" className={libType === 4 ? "area-camera-list machineScope" : 'area-camera-list'}>
								{taskScopeisShow ? <div>
										<TaskScope 
											errorShow={errorShow}
											changeTasksData={this.changeTasksData}
											itemDate={taskData}
											form={this.props.form}
										/> 
										<FormBtn 
											cancleSubmit={this.cancleSubmit}
											toSubmit={this.toSubmit}
											index={2}
										/> 
									</div> : <TasksScopeView item={taskData}/>}
							</Panel> 
							{this.props.libType !== 4 && <Panel header={this.collapseHeader(3)} key="3">
								{taskReceiveisShow ? <div>
										<TaskReceive 
											itemDate={taskData}
											errorShow={errorShow}
											changeTasksData={this.changeTasksData}
											form={this.props.form}
											modelData={this.props.userOrgTreeData}
										/> 
										<FormBtn 
											cancleSubmit={this.cancleSubmit}
											toSubmit={this.toSubmit}
											index={3}
										/> 
									</div> : <TasksReceiveView item={item} />}
							</Panel> }
						</Collapse>
					</div>
					</Form>
				</div>
			</div>
		);
	}
}

export default view;
