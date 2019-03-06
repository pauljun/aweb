import React from 'react';
import { Button, Input, message } from 'antd';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import FaceAlarmHeader from '../../components/faceAlarmHeader';
import DetailIMM from '../../components/detailIMM';
import DetailList from '../../components/detailList';
import NextDetail from '../../components/nextDetail';
import PreviousDetail from '../../components/previousDetail';
import IconFont from 'src/components/IconFont';
import NoData from 'src/components/NoData';
import Loading from 'src/components/Loading';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import ModalView from 'src/components/ModalView';
import {cloneDeep} from 'lodash'
import './index.scss';

const { AuthMultipleComponent } = AuthComponent;

// 重点人员布控历史告警详情

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
				this.getAlarmList(pageState.searchData);
				this.getDetailList(pageState.searchData, pageState.libType);
			});
		} catch (e) {
			hasData = false;
			pageState = {};
		}
		this.state = {
			hasData,
			data: {},
			oldData: undefined,
			handleVisible: false,
			operationDetail: undefined,
			alarmInfoList: [],
			libList: [],
			detailList: [], // 外部告警列表
			detailpoint: [],
			points: [], // 排序点位
			libType: pageState.libType,
			searchData: pageState.searchData,
			isRealAlarm: pageState.isRealAlarm,
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
		const { libType, isRealAlarm } = this.state;
		return MoniteeAlarmsStore.getDetail({ id, libType, isRealAlarm }).then((res) => {
			return new Promise((resolve) => {
				this.setState(
					{
						data: res,
						detailpoint: [ res.longitude, res.latitide ],
						operationDetail: undefined
					},
					resolve
				);
			});
		});
	};

	// 获取外部告警列表
	getDetailList = (searchData, libType) => {
		if (searchData.pageSize == 0) {
			searchData.pageSize = 200;
			searchData.logTypes = 1;
		}
		let { MoniteeAlarmsStore } = this.props;
		return MoniteeAlarmsStore.detailSearch(searchData, libType).then((res) => {
			this.setState({
				detailList: res.list
			});
		});
	};
	onOperationDetailSaveClick = (isEffective) => {
		let { MoniteeAlarmsStore } = this.props;
		let { data, operationDetail, libType, isRealAlarm } = this.state;
		return MoniteeAlarmsStore.updateItem(
			{
				id: data.id,
				operationDetail: operationDetail,
				isEffective
			},
			{
				libType,
				isRealAlarm
			}
		).then((res) => {
			this.setState({
				data: res,
				operationDetail: undefined
			});
			return new Promise((resolve) => resolve(true));
		});
	};

	handleText = (e) => {
		if(e.target.value.length > 200) {
			message.info('最大长度不超过200');
			return;
		}
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
		let { data, operationDetail, type, detailList, libType, isRealAlarm, oldData } = this.state;
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
				let nextDetail = undefined;
				if (detailList.length > 0) {
					let chose = {};
					if (oldData) {
						chose = detailList.filter((v) => v.id == oldData.id)[0];
					} else {
						chose = detailList.filter((v) => v.id == data.id)[0];
					}
					let number = detailList.indexOf(chose);
					if (number < detailList.length && number > -1) {
						nextDetail = detailList[number + 1];
					}
				}
				if (nextDetail) {
					this.changeDetailView(nextDetail);
				} else {
					this.getAlarmList();
				}
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

	changeDetailView = (data, type) => {
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
					alarmInfoList: res.alarmInfoList,
					operationDetail: undefined
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
			alarmInfoList: infoList,
			points: points
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
		let {
			points,
			data = {},
			handleVisible,
			type,
			alarmInfoList,
			libType,
			detailpoint,
			checkShow,
			operationDetail,
			detailList = []
		} = this.state;
		return (
			<div className="history_alarm_detail_view">
				<header className={`detail_header ${data.isHandle !== 0 ? 'detail_header_hidden' : ''}`}>
					{data.isHandle == 0 && (
						<React.Fragment>
							<Input
								className="details_text"
								placeholder="请输入警情备注，最大长度不超过200"
								maxLength={201}
								onChange={this.handleText}
								value={operationDetail}
							/>
							<AuthMultipleComponent actionNames={[ 'MoniteeRealAlarm', 'MoniteeFace' ]}>
								<div className="detail_header_button">
									<Button className="header_btn" onClick={() => this.handleOpenModal(0)}>
										<IconFont type={'icon-YesNo_No_Main'} theme="outlined" />
										无效
									</Button>
									<Button className="header_btn" onClick={() => this.handleOpenModal(1)}>
										<IconFont type={'icon-YesNo_Yes_Main'} theme="outlined" />
										有效
									</Button>
								</div>
							</AuthMultipleComponent>
						</React.Fragment>
					)}
				</header>
				{data.isHandle !== 0 && (
					<p className="details_text_handled">
						警情备注：<span className="details_span">{data.operationDetail}</span>
					</p>
				)}
				<FaceAlarmHeader data={data} />
				<div className="detail_imm">
					<PreviousDetail
						data={data}
						detailList={detailList}
						changeDetailView={this.changeDetailView}
					/>
					<DetailIMM
						switchCheck={this.switchCheck}
						detailpoint={detailpoint}
						points={points}
						data={data}
						libType={libType}
						key={data.id}
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
					id={data.id}
					handleChangeList={this.handleChangeList}
					checkBoxChange={this.checkBoxChange}
				/>
				<ModalView
					title={type == 1 ? '有效告警确认' : '无效告警确认'}
					visible={handleVisible}
					onCancel={this.onModalCancel}
					onOk={this.handleOk}
					width={320}
					iconType={type == 1 ? 'icon-YesNo_Yes_Main' : 'icon-YesNo_No_Main'}
					view={<div>点击“确定”将其标注为{type == 1 ? '有' : '无'}效告警？</div>}
				/>
			</div>
		);
	}
}

export default AlarmDetailView;
