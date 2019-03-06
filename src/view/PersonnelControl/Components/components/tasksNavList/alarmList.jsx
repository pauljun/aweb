import React from 'react';
import { Button, Popover, List, Checkbox, Spin } from 'antd';
import { observer } from 'mobx-react';
import InfiniteScroll from 'react-infinite-scroller';
import './alarmList.scss';
import InputAfter from 'src/components/InputAfter';
// import InputSearch from 'src/components/SearchInput';
import NoDataComp from 'src/components/NoData';
import Loading from 'src/components/Loading';
import { BusinessProvider } from '../../../../../utils/Decorator/BusinessProvider';
import ModalView from 'src/components/ModalView';

const titleListInfo = [ '人脸布控告警处理', '外来人员告警处理', '魅影告警处理', '一体机告警处理' ];
const taskTypeArr = [ 101501, 101502, 101503, 101504 ];
@BusinessProvider('MoniteeTasksStore')
@observer
class view extends React.Component {
	state = {
		listType: 1, // 2-布控任务列表 告警列表类型: 1-全部任务（默认）  2-布控任务列表（自己创建） 3-指派任务 4-本地任务
		loading: false,
		val: '', //搜索框值,
		name: '', //当前搜索条件（布控任务)
		alarmIds: [], //选中的告警列表id
		indeterminate: false, //半选转态
		checkAll: false, //全选状态
		taskType: 101501, //101501-黑名单 101502-未知人员布控 101503-魅影
		buttonIsClick: true,
		detelVisible: false,
		choseLibId: undefined,
		list: [], // 布控任务列表,
		isShowStopModel: false // 布控告警开启关闭弹框
	};

	//初始化列表时，对列表进行处理，提取告警列表id，是否同步到父组件（isToFather,默认不同步）
	getAlarmHistoryId = (data, isToFather) => {
		let alarmIds = [];
		data.forEach((item) => {
			alarmIds.push(item.id);
		});
		//布控告警所有id-全局设置
		this.alarmAllIds = alarmIds;
		//初始全部选中
		this.setState({
			alarmIds,
			checkAll: true
		});
		// 数据传递到父组件
		if (isToFather) {
			let id = alarmIds.length > 0 ? alarmIds.join(',') : '';
			this.props.isAlarmMthodsgetId &&
				this.props.isAlarmMthodsgetId(id).then((res) => {
					if (res) {
						this.setState({
							buttonIsClick: false
						});
					}
				});
		}
	};

	componentWillMount() {
		const { MoniteeTasksStore, listType, changeLoadingState, libType } = this.props;
		//listType 告警列表类型 1-全部任务（默认）  2-本地任务  3-指派任务
		this.setState({
			listType,
			taskType: taskTypeArr[libType - 1]
		});
		MoniteeTasksStore.getList({
			taskType: taskTypeArr[libType - 1],
			listType
		}).then((res) => {
			this.setState({
				list: res
			});
			if (res) {
				this.getAlarmHistoryId(res, true);
			}
		});
	}
	componentDidMount() {
		const { refDom } = this.props;
		refDom && refDom(this);
	}
	/**更新list对应的未处理的告警数 */
	updataListUnhandledAlarmCount = (res) => {
		let list = this.state.list;
		list.forEach((item) => {
			if (item.id === res.taskId) {
				item.unhandledAlarmCount = item.unhandledAlarmCount - 1;
			}
		});
		this.setState({ list });
	};
	/**布控任务搜索 */
	search = () => {
		const { MoniteeTasksStore } = this.props;
		MoniteeTasksStore.getList(this.storeId);
		if (this.props.isAlarm) {
			//moniteeTaskModel.getListByOther(this.storeId)
		}
	};

	/**加载更多 */
	loadMore = () => {
		this.search();
	};
	/**根据条件查询任务列表 */
	getTaskList = (option = {}, callback) => {
		this.setState({loading: true});
		let { taskType, listType, name } = this.state;
		let { MoniteeTasksStore } = this.props;
		let data = Object.assign({}, { taskType, listType, name }, option);
		MoniteeTasksStore.getList(data).then((res) => {
			this.setState(
				{
					loading: false,
					list: res
				},
				() => {
					callback && callback(res);
				}
			);
		});
	};

	//判断布控任务状态
	taskTypeStr = (item, isClass) => {
		if (Date.now() < item.startTime) {
			return isClass ? 'state out-of-date' : '未开始';
		} else if (Date.now() > item.endTime) {
			// return 'state out-of-date'
			return isClass ? 'state out-of-date' : '已过期';
		} else if (item.type === '1') {
			return isClass ? 'state be-running' : '运行中';
		} else {
			return isClass ? 'state be-paused' : '已暂停';
		}
	};
	//切换布控库类型
	tasksFromWhere = (listType) => {
		this.setState(
			{
				listType,
				buttonIsClick: true
			},
			() => {
				this.setState({ val: '' });
				this.searhGroup('');
			}
		);
	};
	/**设置忽略/取消忽略他人授权的布控任务报警 */
	setWhetherIgnoreAlarm = (e, data) => {
		e.stopPropagation();
		let options = {
			taskId: data.id,
			whetherIgnore: data.ignoreStatus === 0 ? 1 : 0
		};
		this.options = options
		this.ignoreStatus = data.ignoreStatus === 0 ? 1 : 0
		this.setState({
			isShowStopModel: true
		})
		// const { MoniteeTasksStore } = this.props;
		// let options = {
		// 	taskId: data.id,
		// 	whetherIgnore: data.ignoreStatus === 0 ? 1 : 0
		// };
		// MoniteeTasksStore.setWhetherIgnoreAlarm(options).then((res) => {
		// 	if (res === true) {
		// 		this.getTaskList();
		// 	}
		// });
	};
	// 设置忽略/取消忽略他人授权的布控任务报警 --- 二次确认取消
	handleCancelIgnoreStatus = () => {
		this.setState({
			isShowStopModel: false
		}, () => {
			this.options = {}
		})
	}
	// 设置忽略/取消忽略他人授权的布控任务报警 --- 二次确认确认修改
	handleOkIgnoreStatus = () => {
		const { MoniteeTasksStore } = this.props;
		MoniteeTasksStore.setWhetherIgnoreAlarm(this.options).then((res) => {
			if (res === true) {
				this.setState({
					isShowStopModel: false
				}, () => {
					this.getTaskList();
				})
			}
		});
	}

	detelControlTask = (id) => {
		const { MoniteeTasksStore } = this.props;
		MoniteeTasksStore.delItemById(this.state.choseLibId).then((res) => {
			this.getTaskList({ name: this.state.name });
			this.setState({
				detelVisible: false,
			})
		});
	};

	changeDelView = (e, id) => {
		e.stopPropagation();
		this.setState({
			detelVisible: true,
			choseLibId: id
		});
	}

	changeVal = (e) => {
		this.setState({
			val: e.target.value
		});
		let value = e.target.value;
		clearTimeout(this.alarmTime);
		this.alarmTime = setTimeout(() => {
			this.getTaskList({ name: value}, (res) => {
				if (res && this.props.isAlarm) {
					this.getAlarmHistoryId(res, true);
				}
			});
		}, 500);
	};

	onCancel = () => {
		this.setState({
			val: ''
		});
		this.getTaskList({ name: ''}, (res) => {
			if (res && this.props.isAlarm) {
				this.getAlarmHistoryId(res, true);
			}
		});
	}

	/**布控名称搜索 */
	searhGroup = (name) => {
		this.setState({ name });
		this.getTaskList({ name }, (res) => {
			if (res && this.props.isAlarm) {
				this.getAlarmHistoryId(res, true);
			}
		});
	};
	//复选框
	onAlarmIdChange = (val) => {
		this.setState({
			alarmIds: val,
			indeterminate: !!val.length && val.length < this.alarmAllIds.length,
			checkAll: val.length === this.alarmAllIds.length
		});
		let id = val.length > 0 ? val.join(',') : '';
		this.props.isAlarmMthodsgetId && this.props.isAlarmMthodsgetId(id);
	};
	//全选
	alarmCheckAll = (e) => {
		// let isCheckAll = e.target.checked
		this.setState({
			alarmIds: e.target.checked ? this.alarmAllIds : [],
			indeterminate: false,
			checkAll: e.target.checked
		});
		if (e.target.checked) {
			let id = this.alarmAllIds.length > 0 ? this.alarmAllIds.join(',') : '';
			this.props.isAlarmMthodsgetId && id && this.props.isAlarmMthodsgetId(id);
		} else {
			//不传id的情况
			this.props.isAlarmMthodsgetId && this.props.isAlarmMthodsgetId('');
		}
	};
	changeAlarmTask = (id) => {
		let data = [];
		data.push(id);
		let checkAll = false;
		if(this.alarmAllIds.length == 1){
			checkAll = true;
		}
		this.setState({
			alarmIds: data,
			checkAll
		})
		this.props.isAlarmMthodsgetId && this.props.isAlarmMthodsgetId(id);
	};
	thousand(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
 }
	render() {
		const { loading, hasMore, buttonIsClick, list, detelVisible, isShowStopModel } = this.state;
		//取到所有的布控告警id
		let alarmIds = [];
		list.forEach((item) => {
			alarmIds.push(item.id);
		});
		//布控告警所有id
		this.alarmAllIds = alarmIds;
		return (
			<div className="alarm_list tasks_nav">
				{/* <div className="title-tasks">{this.props.isAlarm ? '人脸布控告警处理' : '人脸布控任务列表'}</div> */}
				{/* <div className="title-tasks">{titleListInfo[this.props.libType - 1]}</div> */}
				<div className="search-group">
				<InputAfter
						size={'lg'}
						placeholder={'请输入任务名称搜索'}
						value={this.state.val}
						// onSearch={this.searhGroup}
						onChange={this.changeVal}
						onCancel={this.onCancel.bind(this)}
						style={{ width: '100%' }} 
					/>
					{/* <InputSearch
						size={'lg'}
						placeholder={'请输入任务名称搜索'}
						value={this.state.val}
						onSearch={this.searhGroup}
						onChange={this.changeVal}
						style={{ width: '100%' }} 
					/> */}
				</div>
				<div className="change-class">
					<Button
						disabled={buttonIsClick}
						type="default"
						className={this.state.listType === 1 ? 'active' : ''}
						onClick={() => this.tasksFromWhere(1)}
					>
						全部任务
					</Button>
					<Button
						disabled={buttonIsClick}
						type="default"
						className={this.state.listType === 4 ? 'active' : ''}
						onClick={() => this.tasksFromWhere(4)}
					>
						本地任务
					</Button>
					<Button
						disabled={buttonIsClick}
						type="default"
						className={this.state.listType === 3 ? 'active' : ''}
						onClick={() => this.tasksFromWhere(3)}
					>
						指派任务
					</Button>
				</div>
				<div className="list-total">
					<span className="list-total-text">我的任务列表：</span>
					{list.length > 0 ? (
						<div className="list-total-checkbox">
							<span className="checkbox-span">全部显示</span>
							<Popover overlayClassName={'checkbox-span-pop'} placement="bottom" content={
								<div className="checkbox-span-pop-div">
									请选择下面列表查看单个任务告警
								</div>
							}>
							<Checkbox
								// indeterminate={this.state.indeterminate}
								onChange={this.alarmCheckAll}
								checked={this.state.checkAll}
							/>
							</Popover>
	
						</div>
					) : (
						<div />
					)}
				</div>
				<Checkbox.Group onChange={this.onAlarmIdChange} value={this.state.alarmIds}>
					<div className={this.props.isAlarm ? 'list alarm-list' : 'list task-list'}>
						<InfiniteScroll
							initialLoad={false}
							pageStart={1}
							loadMore={this.loadMore}
							hasMore={!loading && hasMore}
							useWindow={false}
						>
						{loading ? <Loading/> :
							<List
								locale={{ emptyText: <NoDataComp title="告警" imgType={1} /> }}
								dataSource={list}
								renderItem={(v, k) => (
									<List.Item key={v.id}>
										<div className={`item ${this.state.alarmIds.length > 0 && this.state.alarmIds.filter(item => item == v.id).length == 1 && 'active'} ${this.state.checkAll ? 'check-all' : '' }`} onClick={this.changeAlarmTask.bind(this, v.id) }>
											<p className="title-name" title={v.name}>
												{v.name}
											</p>
											<div className="item-content">
												<div className="item-teype">
													<span className={this.taskTypeStr(v, true)} />
													<span>{this.taskTypeStr(v, false)}</span>
												</div>
												<div className="item-num">
													<span className="num">{v.unhandledAlarmCount && this.thousand(+v.unhandledAlarmCount)}</span>
													<div className="num-box">
														{/* {new Date() < v.startTime || Date.now() > v.endTime ? (
															<span title="删除布控任务" onClick={(e) => this.changeDelView(e, v.id)}>
																<IconFont type={'icon-Delete_Main'} theme="outlined" />
															</span>
														) : ( */}
															<span
																className="icon-span"
																title={`${v.ignoreStatus === 0 ? '关闭' : '开启'}实时提醒`}
																onClick={(e) => this.setWhetherIgnoreAlarm(e, v)}
															>
																{v.ignoreStatus === 0 ? (
																	<i className="icon anticon">&#xf606;</i>
																) : (
																	<i className="icon anticon">&#xf608;</i>
																)}
															</span>
														{/* )} */}
													</div>
												</div>
											</div>
										</div>
									</List.Item>
								)}
							>
								{loading &&
								hasMore && (
									<div className="demo-loading-container">
										<Spin />
									</div>
								)}
							</List>}
						</InfiniteScroll>
					</div>
				</Checkbox.Group>
				<ModalView
					title={`${this.ignoreStatus === 0 ? '开启' : '关闭'}实时提醒确认`}
					visible={isShowStopModel}
					onCancel={this.handleCancelIgnoreStatus}
					onOk={this.handleOkIgnoreStatus}
					className='ignore-status-model'
					iconType={this.ignoreStatus === 1 ? 'icon-AlarmClose_Main' : 'icon-AlarmOpen_Main'}
					view={
						<div className='box-model'>
							点击“确认”{`${this.ignoreStatus === 0 ? '开启' : '关闭'}`}该任务的实时提醒
						</div>
					}
				>
				</ModalView>
				<ModalView title={'删除布控库'} view={
					<div>
						点击“确定”删除选中布控库
					</div>
				} visible={detelVisible} onOk={this.detelControlTask.bind(this)} onCancel={() => this.setState({detelVisible: false})}/>
			</div>
		);
	}
}

export default view;
