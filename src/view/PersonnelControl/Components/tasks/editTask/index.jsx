import React from "react";
import moment from 'moment'
import _ from 'lodash'
import IconFont from 'src/components/IconFont'
import { observer, inject } from 'mobx-react'
import { message, Row, Col, Collapse, Modal, Button } from 'antd';
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
// import ModalView from 'src/components/ModalView';
import ModalView from 'src/components/ModalComponent/'
// 权限处理
import AuthComponent from '../../../../BusinessComponent/AuthComponent/'
const AuthComponentArray = ['FaceTasksMessage', 'OutsidersTasksMessage','PhantomTasksMessage','AIOTasksMessage']
const taskTypeDict = [101501, 101502, 101503, 101504]

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
		componentIsEdit: false,
		devicesBoxList: [],
		machineLibs:{},
		activeKey: ['0'], // 默认值
		initTaskData: {}, // 布控初始值，当编辑取消时使用
		errorShow: false,
		isShowModel: false
  }
	componentDidMount() {
		this.dealItemData()
	}
	// 对传入的说数据进行处理 
	dealItemData = () => {
		let item = this.props.item
		if (item && item.name){
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
        acceptAlarmUser: item.acceptAlarmUser,
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
		let headerFace = ['基本信息','重点人员','任务范围','任务接收',]
		let headerPhantom = ['基本信息','魅影','任务范围','任务接收',]
		let headerOuter = ['基本信息','合规人员','任务范围','任务接收',]
		let headerAIO = ['基本信息','布控人员','任务范围','任务接收',]
		let title =[headerFace, headerOuter,headerPhantom, headerAIO]
		let catg = ['basicInfoisShow','libslistisShow','taskScopeisShow','taskReceiveisShow']
		return (
			<div className='colla-header'>
				<div className="left_title">
					<div className="colla-left">{title[this.props.libType - 1][index]}</div>
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
	showEditComponent = () => {
		// 编辑转态下默认展开第一个组件
		let activeKey = ['0']
		this.setState({
			activeKey,
			componentIsEdit: true
		})
	}
	// 取消提交
	cancleSubmit = (index) => {
		// let initTaskData = this.state.initTaskData
		// this.setState({ 
		// 	taskData: initTaskData,
		// 	componentIsEdit: false,
		// })
		this.setState({
			isShowModel: true
		})
	}
	handleCancel = () => {
		this.setState({
			isShowModel: false,
			activeKey: ['0']
		})
	}
	handleOk = () => {
		let initTaskData = this.state.initTaskData
		this.setState({ 
			taskData: initTaskData,
			componentIsEdit: false,
			isShowModel: false,
			activeKey: ['0']
		})
	}
	/**提交数据前对部分数据进行处理 */
	handleData = (data) => {
		if(data.alarmMode){
			data.alarmMode=data.alarmMode.join(',')
		}
	}
	// 确认修改
	toSubmit = () => {
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
      const taskType = taskTypeDict[this.props.libType - 1];
			this.props.MoniteeTasksStore.onSubmit(taskData, taskType).then(res => {
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
		const { taskData, componentIsEdit, libType, activeKey, errorShow, isShowModel } = this.state
		const { item } = this.props
		return (
			<div className="library-form-wrapper">
				<div className="taks-full-top">
					<div className="task-top">
						<span title={taskData.name} className="title">{taskData.name}</span>
						{!componentIsEdit && 
							<AuthComponent actionName={AuthComponentArray[this.props.libType - 1]}>
								<Button onClick={this.showEditComponent}><IconFont type="icon-Edit_Main"/>编辑</Button>
							</AuthComponent>
						}
					</div>
				</div>
				<div className="library-view library-edit">
					<Form>
					<div className="task-container-box">
						<Collapse bordered={false} activeKey={activeKey}>
							<Panel header={this.collapseHeader(0)} key="0">
								{componentIsEdit ? <div>
									<BasicInfo 
										itemDate={taskData}
										changeTasksData={this.changeTasksData}
										form={this.props.form}
										libType={this.props.libType}
									/>
								</div> : <BasicInfoView 
													item={item} 
													libType={this.props.libType}
											/>}
							</Panel>
							{this.props.libType !== 3 && <Panel header={this.collapseHeader(1)} key="1">
								{componentIsEdit ? <div>
									<LibsList 
										itemDate={taskData}
										errorShow={errorShow}
										changeTasksData={this.changeTasksData}
										form={this.props.form}
										libType={this.props.libType}
										item={item}
									/>
								</div> : 
								<LibsListView 
									item={item} 
									libType={this.props.libType}
								/>}
							</Panel>}
							<Panel header={this.collapseHeader(2)} key="2" className={libType === 4 ? "area-camera-list machineScope" : 'area-camera-list'}>
								{componentIsEdit ? <div>
										<TaskScope 
											errorShow={errorShow}
											changeTasksData={this.changeTasksData}
											itemDate={taskData}
											form={this.props.form}
										/>
									</div> : <TasksScopeView item={taskData}/>}
							</Panel> 
							 <Panel header={this.collapseHeader(3)} key="3">
								{componentIsEdit ? <div>
										<TaskReceive 
											itemDate={taskData}
											errorShow={errorShow}
											changeTasksData={this.changeTasksData}
											form={this.props.form}
											libType={this.props.libType}
										/> 
									</div> : <TasksReceiveView item={item} libType={this.props.libType}/>}
							</Panel>  
						</Collapse>
						{componentIsEdit && <FormBtn 
							cancleSubmit={this.cancleSubmit}
							toSubmit={this.toSubmit}
						/>}
					</div>
					</Form>
				</div>
				<ModalView
					title="提示"
					visible={isShowModel}
					onCancel={this.handleCancel}
					onOk={this.handleOk}
					className='tasks-edit-model'
				>
					<div className='edit-model'>
						<div className="icon-img"></div>
						<div className="title-name">
							确定要取消编辑吗？已经编辑的数据将不会保存。
						</div>
					</div>
				</ModalView>
			</div>
		);
	}
}

export default view;
