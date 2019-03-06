import React from 'react';
import { Input, message } from 'antd';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import NextDetail from '../../components/nextDetail';
import PreviousDetail from '../../components/previousDetail';
import AIOAlarmHeader from '../../components/AIOAlarmHeader';
import DetailIMM from '../../components/detailIMM';
import Loading from 'src/components/Loading';
import DetailList from '../../components/detailList';
import NoData from 'src/components/NoData';
import {cloneDeep} from 'lodash'

// 专网套件告警详情

import './index.scss';

const { TextArea } = Input;

@withRouter
@BusinessProvider('MoniteeAlarmsStore', 'DeviceStore', 'MoniteeLibsStore', 'UserStore')
@observer
class AlarmDetailView extends React.Component {
	constructor(props) {
		super(props);
		let { history } = this.props;
		let pageState = {},
			hasData;
		try {
			pageState = history.location.state.pageState;
			hasData = true;
			this.state = {
				libType: pageState.libType,
				isRealAlarm: pageState.isRealAlarm
			};
			this.getDetail(pageState.id).then(() => {
				this.getAlarmList();
				this.getDetailList(pageState.searchData, pageState.libType);
			});
		} catch (e) {
			hasData = false;
			pageState = {};
		}
		this.state = {
			hasData,
			data: {},
			handleVisible: false,
			operationDetail: undefined,
			alarmInfoList: [],
			detailList: [], // 外部告警列表
			points: [], // 排序点位
			libType: pageState.libType,
			searchData: pageState.searchData,
			isRealAlarm: pageState.isRealAlarm, // 是否从实时告警跳转（记录日志需要）
			checkShow: false // 控制底部列表单选按钮显示隐藏
		};
		/*
		libType
		详情类型
			重点人员布控历史告警详情  1
			非法入侵告警详情         2
			魅影告警								3
			专网套件告警详情         4
	*/
	}

	getDetail = (id) => {
		let { MoniteeAlarmsStore } = this.props;
		const { isRealAlarm, libType } = this.state;
		return MoniteeAlarmsStore.getDetail({ id, libType, isRealAlarm }).then((res) => {
			return new Promise((resolve) => {
				this.setState(
					{
						data: res
					},
					resolve
				);
			});
		});
	};

	// 获取外部告警列表
	getDetailList = (searchData, libType) => {
		if (!searchData.taskListIds) {
			searchData.pageSize = 200;
			searchData.logTypes = 5;
		}
		let { MoniteeAlarmsStore } = this.props;
		return MoniteeAlarmsStore.detailSearch(searchData, libType).then((res) => {
			this.setState({
				detailList: res.list
			});
		});
	};

	handleText = (e) => {
		this.setState({
			operationDetail: e.target.value
		});
	};

	handleOpenModal = (type) => {
		this.setState({
			type,
			handleVisible: true
		});
	};

	onModalCancel = () => {
		this.setState({
			handleVisible: false
		});
	};

	handleOk = () => {
		let { MoniteeAlarmsStore } = this.props;
		let { data, operationDetail, type, libType, isRealAlarm } = this.state;
		MoniteeAlarmsStore.updateItem(
			{
				id: data.id,
				operationDetail: operationDetail,
				isEffective: type
			},
			{
				libType,
				isRealAlarm
			}
		)
			.then((res) => {
				this.setState({
					data: res,
					handleVisible: false,
					operationDetail: undefined
				});
			})
			.then(() => {
				message.info('设置告警状态成功');
				this.getAlarmList();
			});
	};
	//获取下方列表
	getAlarmList = () => {
		let { data } = this.state;
		let { MoniteeAlarmsStore } = this.props;
		MoniteeAlarmsStore.getAlarmInfoList(data).then((res) => {
			if (res.alarmInfoList.length > 0) {
				res.alarmInfoList = res.alarmInfoList.map(
					(v) =>
						v.isHandle == 0 || v.isEffective !== 0
							? (v = Object.assign({}, v, { checked: 1 }))
							: (v = Object.assign({}, v, { checked: 0 }))
				);
			}
			let arr = res.alarmInfoList.filter((v) => v.checked == 1);
			let points = cloneDeep(arr).reverse();
			this.setState({
				alarmInfoList: res.alarmInfoList,
				points
			});
		});
	};

	handleChangeList = (id) => {
		this.setState(
			{
				oldData: this.state.data
			},
			() => {
				this.getDetail(id);
			}
		);
	};

	changeDetailView = (data) => {
		let { MoniteeAlarmsStore } = this.props;
		this.getDetail(data.id).then(() => {
			MoniteeAlarmsStore.getAlarmInfoList(data).then((res) => {
				if (res.alarmInfoList.length > 0) {
					res.alarmInfoList = res.alarmInfoList.map(
						(v) =>
							v.isHandle == 0 || v.isEffective !== 0
								? (v = Object.assign({}, v, { checked: 1 }))
								: (v = Object.assign({}, v, { checked: 0 }))
					);
				}
				let arr = res.alarmInfoList.filter((v) => v.checked == 1);
				let points = cloneDeep(arr).reverse();
				this.setState({
					oldData: undefined,
					points,
					alarmInfoList: res.alarmInfoList
				});
			});
		});
	};

	// 选择轨迹点
	checkBoxChange = (item) => {
		let { alarmInfoList } = this.state;
		let infoList = alarmInfoList;
		let chose = infoList.filter((v) => v.id == item.id)[0];
		let number = infoList.indexOf(chose);
		infoList[number].checked = item.checked;
		let arr = infoList.filter((v) => v.checked == 1);
		let points = cloneDeep(arr).reverse();
		this.setState({
			points,
			alarmInfoList: infoList
		});
	};
	switchCheck = (type) => {
		let { checkShow } = this.state;
		if (type == 2 && checkShow !== true) {
			this.setState({
				checkShow: true
			});
		} else if (checkShow !== false) {
			this.setState({
				checkShow: false
			});
		}
	};
	render() {
		if (!this.state.hasData) {
			return <NoData />;
		}
		if (!this.state.data.id) {
			return <Loading />;
		}
		let { points, data = {}, libType, detailList = [], alarmInfoList, checkShow } = this.state;

		points.reverse();
		return (
			<div className="history_alarm_detail_view">
				<header className={`detail_header ${data.isHandle !== 0 ? 'detail_header_hidden' : ''}`} />
				<AIOAlarmHeader data={data} />
				<div className="detail_imm">
					<PreviousDetail
						data={data}
						detailList={detailList}
						changeDetailView={this.changeDetailView}
					/>
					<DetailIMM
						switchCheck={this.switchCheck}
						points={points}
						data={data}
						libType={libType}
						key={data && data.id}
						maptype={true}
					/>
					<NextDetail
						data={data}
						detailList={detailList}
						changeDetailView={this.changeDetailView}
					/>
				</div>
				<DetailList
					libType={libType}
					checkShow={checkShow}
					data={alarmInfoList}
					id={data && data.id}
					handleChangeList={this.handleChangeList}
					checkBoxChange={this.checkBoxChange}
				/>
			</div>
		);
	}
}

export default AlarmDetailView;
