import React from 'react'
import { Button, List, message, Spin } from 'antd'
import { observer } from 'mobx-react'
import InfiniteScroll from 'react-infinite-scroller'
import { BusinessProvider } from '../../../../../utils/Decorator/BusinessProvider';
import NoDataComp from 'src/components/NoData'
import InputSearch from 'src/components/SearchInput';
import ModalView from 'src/components/ModalComponent/'
import IconFont from 'src/components/IconFont'
import AuthComponent from '../../../../BusinessComponent/AuthComponent/'
import './index.scss'
const titleListInfo = ['人脸布控任务列表','外来人员告警任务列表','魅影告警任务列表','一体机布控任务列表']
// 权限字段
const AuthComponentArray = ['FaceTasksMessage', 'OutsidersTasksMessage','PhantomTasksMessage','AIOTasksMessage']
// const	taskTitle = ['新建人脸布控任务','新建外来人员告警任务','新建魅影告警任务','新建一体机布控任务']
/**布控类型 //101501-黑名单 101502-未知人员布控 101503-魅影 101504-一体机*/
const	taskTypeArr = [101501,101502,101503,101504]

@BusinessProvider('MoniteeTasksStore')
@observer
class view extends React.Component {
	state = {
		listType: 2,// 2-布控任务列表 告警列表类型: 1-全部任务（默认）  2-布控任务列表（自己创建） 3-指派任务 4-本地任务
		loading: false,
		val:'',//搜索框值
		name:'',//当前搜索条件（布控任务)
    taskType: 101501,//101501-黑名单 101502-未知人员布控 101503-魅影
		list: [], // 布控任务列表
		isShowModel: false
	}

  componentWillMount() {
		const { MoniteeTasksStore, libType, listType, changeLoadingState, getItem } = this.props
		this.setState({
			taskType: taskTypeArr[libType - 1],
      listType
		})
    MoniteeTasksStore.getList({
      taskType: taskTypeArr[libType - 1],
      listType
    }).then(res => {
			this.setState({
				list: res
			})
			if(res.length && listType === 2){
				// 如果是自己创建的任务，设置第一个为选中状态
				let item = res[0] ? res[0] : {}
				if(item.id){
					this.setItemById(item.id)	
				}
			}else{
				changeLoadingState && changeLoadingState(false)
				getItem && getItem([])
			}
    })
	}
	componentDidMount(){
		const { refDom } = this.props
		refDom && refDom(this)
	}
	/**点击查看布控任务 */
	getDetailLib = id => {
		let item = this.props.item
		if (item.id !== id) {
			//新增判断，如果是布控任务列表，点击时展示当前布控任务信息
			this.setItemById(id)	
		}
	}
  /**加载更多 */
	loadMore = () => {
		//this.search()
  }
  //判断布控任务状态
	taskTypeStr = (item, isClass) => {
		if (Date.now() < item.startTime) {
			return isClass ? 'state out-of-date' : '未开始'
		} else if (Date.now() > item.endTime) {
			return isClass ? 'state out-of-date' : '已过期'
		} else if (item.type === '1') {
			return isClass ? 'state be-running' : '运行中'
		} else {
			return isClass ? 'state be-paused' : '已暂停'
		}
	}
	/**根据条件查询任务列表 */
	getTaskList = (option = {}, callback) => {
		let { taskType, listType, name} = this.state
		let { MoniteeTasksStore } = this.props
		let data = Object.assign({},{taskType, listType, name},option)
		MoniteeTasksStore.getList(data).then(res => {
			this.setState({
				list: res
			},() => {
				callback && callback(res)
			})
		})
	}
	/**通过id拿数据详情，并设置当前选中的任务 */
	setItemById = (id) => {
		const { changeLoadingState, MoniteeTasksStore, getItem, changeLibId } = this.props
		changeLoadingState && changeLoadingState(true)
		return MoniteeTasksStore.getDetailById(id).then((res) => {
			changeLoadingState && changeLoadingState(false)
			getItem && getItem(res)
			changeLibId && changeLibId(id)
		})
	}
	/**暂停/开启任务 */
	onStartPauseBtnClick = (e, item) => {
		e.stopPropagation()
		const { MoniteeTasksStore } = this.props
		if (Date.now() > item.endTime) {
			return message.info('请修改有效时间')
    }
    const { taskType } = this.state;
		MoniteeTasksStore.onStartPause({
      id: item.id, 
      type: item.type === '1' ? '0' : '1', 
      taskType,
      taskName: item.name
    }).then(response => {
			if (response.code === 200) {
				this.getTaskList()
				message.success('任务操作成功')
			} else {
				message.error('任务操作失败')
			}
		})
	}
	/**搜索功能 */
	changeVal = (e) => {
		this.setState({
			val: e.target.value
		})
	}
	/**布控名称搜索 */
	searhGroup = name => {
		this.setState({name})
		this.getTaskList({name}, (res) => {
			let item = res[0] ? res[0] : {}
			if(this.state.listType === 2 && !this.props.isAlarm){
				// if(!item.id){
				// 	this.setState({
				// 		item
				// 	})
				// }
				if(item.id){
					this.setItemById(item.id)		
				}else {
					this.props.getItem && this.props.getItem({})
				}
			}
		})
	}
	/**删除布控任务 isSelectItem-是否删除的是当前选中的布控任务 */
	del = (e, id, isSelectItem, name) => {
		//const { MoniteeTasksStore, changeLoadingState } = this.props
		e.stopPropagation()
		// let that = this
		// const content = (
    //   <div className='lib-delete-content'>
    //      <img src={svgDelete} alt=""/> 
    //     <p>确定要删除 <span> {name} </span> ？</p>
    //   </div>
		// )
		this.delLibName = name
		this.isSelectItem = isSelectItem
		this.delId = id
		this.setState({
			isShowModel: true
		})
		// confirm({
		// 	//title: '确认要删除该布控任务吗?',
		// 	okText: '确定',
		// 	okType: 'danger',
		// 	cancelText: '取消',
		// 	content,
		// 	className:'monitee-lib-delete-modal',
		// 	onOk() {
		// 		MoniteeTasksStore.delItemById(id).then(res => {
		// 			if(res.code === 200){
		// 				// 删除成功
		// 				that.getTaskList({}, (res) => {
		// 					if(isSelectItem){
		// 						let item = res[0] ? res[0] : {} 
		// 						if(item.id){
		// 							that.setItemById(item.id)
		// 						}
		// 					}
		// 				})
		// 			}
		// 		})
		// 	},
		// 	onCancel() {
		// 		message.success('取消刪除')
		// 	}
		// })
	}
	// 取消删除
	handleCancel = () => {
		this.delLibName = ''
		this.isSelectItem = ''
		this.delId = ''
		this.setState({
			isShowModel: false
		})
	}
	// 确认删除
	handleOk = () => {
		const { MoniteeTasksStore, getItem } = this.props
		MoniteeTasksStore.delItemById(this.delId).then(res => {
			if(res.code === 200){
				// 删除成功
				this.setState({
					isShowModel: false
				})
				this.getTaskList({}, (res) => {
					if(this.isSelectItem){
						let item = res[0] ? res[0] : {} 
						if(item.id){
							this.setItemById(item.id)
						}else{
							getItem && getItem({})
						}
					}
				})
			}
		})
	}
	render() {
    const {
      loading,
      hasMore,
			list,
			isShowModel
		} = this.state
		const { item } = this.props
		return (
			<div className='list-left tasks_nav'>
				{/* <ModalView
					title="删除确认"
					visible={isShowModel}
					onCancel={this.handleCancel}
					onOk={this.handleOk}
					width={320}
          iconType={'icon-Delete_Main'}
					view={
						<div>
							你确定要删除 <span>{this.delLibName}</span> ?
						</div>
					}
				/> */}
				<ModalView
					title="删除确认"
					visible={isShowModel}
					onCancel={this.handleCancel}
					onOk={this.handleOk}
					className='tasks-del-model'
				>
					<div className='del-model'>
						<div className="icon-img"></div>
						<div className="title-name">
							你确定要删除 <span>{this.delLibName}</span> ?
						</div>
					</div>
				</ModalView>
				{/* <div className="title-tasks">{titleListInfo[this.props.libType - 1]}</div> */}
				<div className="create-new-tasks">
					<AuthComponent actionName={AuthComponentArray[this.props.libType - 1]}>
						<Button type='primary' onClick={this.props.addNewTasks}><IconFont type='icon-Zoom__Light'/>新建任务</Button>
					</AuthComponent>
				</div>
				<div className='search-group'>
					<InputSearch
						placeholder={'请输入任务名称搜索'}
						value={this.state.val}
						onSearch={this.searhGroup}
						onChange={this.changeVal}
						style={{ width: '100%' }} 
					/>
				</div>
				<div className={'list task-list'}>
					<InfiniteScroll
						initialLoad={false}
						pageStart={1}
						loadMore={this.loadMore}
						hasMore={!loading && hasMore}
						useWindow={false}
					>
						<List
							locale={{emptyText: <NoDataComp title='布控任务'/>}}
							dataSource={list}
							renderItem={(v, k) => (
								<List.Item key={v.id}>
									<div
										className={v.id === item.id && !this.props.isAlarm ? 'item active' : 'item'}
										onClick={() =>
											this.getDetailLib(v.id)
										}
									>
										<div className="title-name">
											<span className='title-tl' title={v.name}>{v.name}</span>
										</div>
										<div className="btn_message">
											<span className={this.taskTypeStr(v, true)}></span>
											<span>{this.taskTypeStr(v, false)}</span>
											{/* <span onClick={(e) => { this.del(e,v.id,v.id === item.id ? true: false,v.name) }}>删除</span> */}
												{/* <AuthComponent actionName={AuthComponentArray[this.props.libType - 1]}>
													<IconFont 
														type="icon-Delete_Main"
														className="del_task"
														title={'删除任务'}
														onClick={(e) => { this.del(e,v.id,v.id === item.id ? true: false,v.name) }}
														/>
												</AuthComponent> */}
											 {(this.taskTypeStr(v, true) === 'state out-of-date' || v.canOperate === 0) ? null :
												<AuthComponent actionName={AuthComponentArray[this.props.libType - 1]}>
													<IconFont 
														type={v.type === '1' ? 'icon-Pause_Main' : 'icon-Play_Main'}
														title={v.type === '1' ? '暂停任务' : '开启任务'}
														onClick={(e) => this.onStartPauseBtnClick(e, v)}
														className="stop_or_play_icon"
													/>
												</AuthComponent>
											 }
										</div>
									</div>
								</List.Item>
							)}
						>
							{loading && hasMore && (<div className="demo-loading-container"><Spin /></div>)}
						</List>
					</InfiniteScroll>
				</div>
			</div>
		)
	}
}

export default view