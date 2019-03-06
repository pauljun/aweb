import React, { Component } from 'react';
import { Spin, message, BackTop } from 'antd';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from '../../../../utils/Decorator/BusinessProvider';
import AlarmHeaderSearch from './components/alarmHeaderSearch';
import Pagination from 'src/components/Pagination';
import AlarmHeaderFilter from './components/alarmHeaderFilter';
import AlarmHeaderPagtion from './components/alarmHeaderPagtion';
import NoDataComp from 'src/components/NoData';
import LogsComponent from 'src/components/LogsComponent';
// 人脸布控
import Loading from 'src/components/Loading';
import List from './components/list';
import eventEmmiter from 'src/libs/Socket';
// 未知人员 魅影告警列表
import ListAll from './components/list_all';
import NavView from '../components/tasksNavList/alarmList';
import './index.scss';
import QueueAnim from 'rc-queue-anim';

@LogsComponent()
@withRouter
@BusinessProvider('MoniteeAlarmsStore', 'DeviceStore', 'TabStore')
@observer
export default class AlarmHistory extends Component {
	state = {
		loading: true,
		showDetail: false,
		detailItem: {},
		detailIndex: undefined,
		detailDomKey: Math.random(),
		showSearch: false,
		searchData: {},
		sortType: '1', // 1-按时间排序 2-按相识度排序
		dataList: {
			list: [],
			total: 0
		}, // 告警列表数据
		alarmInfoListAll: {
			alarmInfoList: [],
			alarmInfoTotal: 0
		}
	};
	backTopRef = React.createRef()
	setSortType = (sortType = '1') => {
		this.setState({ sortType });
	};

	componentWillMount() {
		this.isClick = true;
		eventEmmiter.on('resolveAlarm', this.updateCard);
	}

	componentWillUnmount() {
		eventEmmiter.off('resolveAlarm');
	}
	updateCard = (data) => {
		let { dataList } = this.state;
		let { list } = dataList;
		list.forEach((v) => {
			if (v.id == data.id) {
				v.isEffective = data.isEffective;
				v.isHandle = 1;
			}
		});
		this.setState({
			dataList
		});
	};
	// 获取摄像头信息
	getCameraDetail = (item) => {
		let { DeviceStore } = this.props;
		let result = DeviceStore.cameraArray.filter((v) => v.manufacturerDeviceId * 1 === item.cameraId * 1)[0];
		if (result) {
			item.deviceData = result.deviceData;
			item.deviceType = result.deviceType;
			item.extJson = result.extJson;
		}
		this.setState({
			detailItem: item
		});
	};

	// 布控详情跳转
	handlePageJump = (id, libType) => {
		const { TabStore, history, MoniteeAlarmsStore } = this.props;
		let searchDatas = toJS(MoniteeAlarmsStore.searchData);
		this.setState({
				searchData: searchDatas
			}, () => {
				const moduleName = 'Detail';
				let childModuleName = 'faceDetail';
				if (libType == 1) {
					childModuleName = 'faceDetail';
				}
				if (libType == 2) {
					childModuleName = 'outsidersDetail';
				}
				if (libType == 3) {
					childModuleName = 'PhantomAlarmsDetail';
				}
				if (libType == 4) {
					childModuleName = 'AIOAlarmsDetail';
				}
				const data = { id, libType, searchData: this.state.searchData };
				TabStore.goPage({ moduleName, childModuleName, history, state: data });
			}
		);
	};
	// 查看报警历史详情
	openDetail = (item, k) => {
		if (!this.isClick) {
			return;
		}
		this.isClick = false;
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.isClick = true;
		}, 500);
		this.getCameraDetail(item);
		const { MoniteeAlarmsStore } = this.props;
		const searchData = MoniteeAlarmsStore.searchData;
		if (this.props.libType === 1) {
			MoniteeAlarmsStore.getAlarmInfoList({ infoId: item.infoId, threshold: searchData.threshold }).then((res) => {
				this.setState(
					{
						alarmInfoListAll: res
					},
					() => {
						this.getAlarmDetail(item, res);
					}
				);
			});
		} else {
			this.getAlarmDetail(item, this.state.alarmInfoListAll);
		}
	};
	// 获取单个报警详情
	getAlarmDetail = (item, alarmInfoListAll) => {
		this.setState({
			showDetail: true,
			detailIndex: alarmInfoListAll.alarmInfoList.map((i) => i.id).indexOf(item.id),
			detailDomKey: Math.random()
		});
	};

	// 关闭报警历史详情
	closeDetail = () => {
		this.setState({
			showDetail: false
		});
	};

	// 选择图片
	changeImg = (v, k) => {
		this.getCameraDetail(v);
		this.setState({
			detailIndex: k
		});
	};

	// 搜索
	search = () => {
		// 新增搜索前判断是否存在id，如果不存在，不搜索
		const { MoniteeAlarmsStore } = this.props;
		let taskListIds = MoniteeAlarmsStore.searchData.taskListIds;
		if (!taskListIds) {
			return new Promise((resolve) => resolve(true));
		}
		return MoniteeAlarmsStore.search(this.props.libType).then((res) => {
			this.setState({
				loading: false,
				dataList: res
			});
			return new Promise((resolve) => resolve(true));
		});
	};
	onSliderChange = (options) => {
		this.onTypeChange(options);
	};
	// 搜索条件选择
	searchDataChange = (options) => {
		return this.props.MoniteeAlarmsStore.editSearchData(options).then((res) => {
			return this.search();
		});
	};

	// 翻页
	onChange = (currentPage, pageSize) => {
		this.searchDataChange({ page: currentPage, pageSize: pageSize });
	};

	// 排序
	onSortTypeChange = (value) => {
		this.searchDataChange({ sortType: parseInt(value, 10) });
		this.setState({ sortType: value });
	};

	//全部筛选方法
	onTypeChange = (value) => {
		return this.searchDataChange(value);
	};

	// 修改store 参数
	setStoreSeacrhData = (value) => {
		this.props.MoniteeAlarmsStore.editSearchData(value);
	};

	/**处理警情 */
	handle = (item, isEffective, operationDetail = undefined) => {
		const { MoniteeAlarmsStore, libType } = this.props;
		return MoniteeAlarmsStore.updateItem({
      id: item.id, isEffective, operationDetail
    },{
      libType
    }).then((res) => {
			message.info(`设置${libType === 3 ? '提醒': '告警'}状态成功`);
			//更新警情
			let { list, total } = this.state.dataList;
			list.map((v) => {
				if (v.id === item.id) {
					v.isHandle = 1;
					v.isEffective = isEffective;
				}
				return v;
			});
			this.setState({
				dataList: {
					list,
					total
				}
			});
			// 更新布控告警列表的告警数量
			this.NavViewDom.updataListUnhandledAlarmCount(res);
			return new Promise((resolve) => resolve(true));
		});
	};
	/**隐藏搜索 */
	hiddenSearch = () => {
		this.setState({
			showSearch: false
		});
	};

	/**新增方法 根据获取的布控任务id重新获取数据，刷新列表 获得id后，之前所有的查询条件重置*/
	getTaskId = (id) => {
		let taskListIds = id;
		const { MoniteeAlarmsStore } = this.props;
		let initSearchData = MoniteeAlarmsStore.getInitSearchData();
		let searchDataObj = Object.assign({}, initSearchData, { taskListIds });
		if (!id) {
			this.setState({
				loading: false,
				dataList: {
					list: [],
					total: 0
				}
			});
			MoniteeAlarmsStore.editSearchData(searchDataObj);
			return new Promise((resolve) => resolve(true));
		}
		return this.searchDataChange(searchDataObj);
	};
	/**更新、获取告警列表数据 */
	updataAlarmInfoList = (data) => {
		this.props.MoniteeAlarmsStore.getAlarmInfoList(data).then((res) => {
			this.setState({
				alarmInfoListAll: res
			});
		});
	};
	//显示隐藏高级搜索
	changeSearchView = () => {
		this.setState({
			showSearch: !this.state.showSearch
		});
	};
	render() {
		const { libType } = this.props;
		const { dataList, modalVisable, loading } = this.state;
		const { list, total } = dataList;
		let alarmHandlePriv = true;
		let searchData = this.props.MoniteeAlarmsStore.searchData;
		return (
			<div className="baselib-container alarm-new">
				<div className="baslib-wrapper history-alarm-wrapper">
					{/* <QueueAnim delay={200} type={[ 'left', 'right' ]} leaveReverse>
						{showSearch && (
							<div className="history-alarm-search" key={1}>
								<Search
									searchDataChange={this.searchDataChange}
									onSliderChange={this.onSliderChange}
									search={this.search}
									storeId={this.storeId}
									closeSearch={() => {
										this.setState({
											showSearch: false
										});
									}}
									setSortType={this.setSortType}
									libType={libType}
								/>
							</div>
						)}
					</QueueAnim> */}
					<div className="alarm-task">
						<NavView
							isAlarmMthodsgetId={this.getTaskId}
							item={{}}
							isAlarm={true}
							listType={1}
							libType={libType}
							refDom={(ref) => (this.NavViewDom = ref)}
						/>
					</div>
					<div className="alarm-container">
						<div className="alarm-container-header">
						<AlarmHeaderFilter
								libType={libType}
								searchData={searchData}
								setStoreSeacrhData={this.setStoreSeacrhData}
								onTypeChange={this.onTypeChange}
							/>
							
							{libType !== 3 && libType !== 4 && libType !== 2 ? (
								<AlarmHeaderPagtion
									searchData={searchData}
									onTypeChange={this.onTypeChange}
									setStoreSeacrhData={this.setStoreSeacrhData}
								/>
							) : (
								<div />
							)}

						</div>
						<AlarmHeaderSearch
							searchData={searchData}
							total={total}
							onTypeChange={this.onTypeChange}
							onChange={this.onChange}
							search={this.search.bind(this)}
							changeSearchView={this.changeSearchView}
						/>
						
						<div className="box_container alarm-history-box-out" ref={this.backTopRef}>
							{loading ? (
								<Loading />
							) : (
								<React.Fragment>
									{list && list.length > 0 ? (
										<div
											className={`task-list ${list.length > 0 ? '' : 'no-data'} ${alarmHandlePriv ? '' : 'no-handle'}`}
										>
											<Spin spinning={this.state.loading}>
												{libType === 1 ? (
													<List
														realName={'水印'}
														list={list}
														handle={this.handle}
														libType={libType}
														modalVisable={modalVisable}
														handlePageJump={this.handlePageJump.bind(this)}
													/>
												) : (
													<ListAll
														realName={'水印'}
														list={list}
														handle={this.handle}
														libType={libType}
														handlePageJump={this.handlePageJump.bind(this)}
													/>
												)}
												<Pagination
													total={total}
													onChange={this.onChange}
													onShowSizeChange={this.onChange}
													current={searchData.page}
													pageSize={searchData.pageSize}
													pageSizeOptions={[ '24', '36', '48', '72', '96' ]}
												/>
											</Spin>
										</div>
									) : (
										<NoDataComp imgType={2} title={'告警数据'} />
									)}
								</React.Fragment>
							)}
						</div>
					</div>
				</div>
				<BackTop target={() => this.backTopRef.current} />
			</div>
		);
	}
}
