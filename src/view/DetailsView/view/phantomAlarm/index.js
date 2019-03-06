import React from 'react';
import { Button, Input, message } from 'antd';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import PhantomAlarmHeader from '../../components/phantomAlarmHeader';
import DetailIMM from '../../components/detailIMM';
import NextDetail from '../../components/nextDetail';
import PreviousDetail from '../../components/previousDetail';
import IconFont from 'src/components/IconFont';
import NoData from 'src/components/NoData';
import Loading from 'src/components/Loading';
import ModalView from 'src/components/ModalView';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';

import './index.scss';

const { TextArea } = Input;
const {AuthMultipleComponent} = AuthComponent

// 魅影告警详情

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
				this.getDetailList(pageState.searchData, pageState.libType);
			});
		} catch (e) {
			hasData = false;
		}
		this.state = {
			hasData,
			data: {},
			handleVisible: false,
			operationDetail: undefined,
			alarmInfoList: [],
			libList: [],
			detailList: [], // 外部告警列表
			libType: pageState.libType,
			searchData: pageState.searchData,
			isRealAlarm: pageState.isRealAlarm
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

	//获取数据详情
	getDetail = (id) => {
		let { MoniteeAlarmsStore } = this.props;
		const { libType, isRealAlarm } = this.state;
		return MoniteeAlarmsStore.getDetail({ id, libType, isRealAlarm }).then((res) => {
			return new Promise((resolve) => {
				this.setState(
					{
						operationDetail: undefined,
						data: res,
						detailpoint: [ res.longitude, res.latitide ]
					},
					resolve
				);
			});
		});
	};

	// 获取外部告警列表
	getDetailList = (searchData, libType) => {
		let { MoniteeAlarmsStore } = this.props;
		if (searchData.pageSize == 0) {
			searchData.pageSize = 200;
			searchData.logTypes = 3;
		}
		return MoniteeAlarmsStore.detailSearch(searchData, libType).then((res) => {
			this.setState({
				detailList: res.list
			});
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

	// 处理有效无效
	handleOk = () => {
		let { MoniteeAlarmsStore } = this.props;
		let { data, operationDetail, type, detailList, libType, isRealAlarm } = this.state;
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
					operationDetail: undefined,
					data: res,
					handleVisible: false
				});
			})
			.then(() => {
				message.info('设置提醒状态成功');
				let nextDetail = undefined;
				if (detailList.length > 0) {
					let chose = detailList.filter((v) => v.id == data.id)[0];
					let number = detailList.indexOf(chose);
					if (number < detailList.length && number > -1) {
						nextDetail = detailList[number + 1];
					}
				}
				if (nextDetail) {
					this.changeDetailView(nextDetail);
				}
			});
	};

	handleChangeList = (id) => {
		this.getDetail(id);
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
				this.setState({
					alarmInfoList: res.alarmInfoList
				});
			});
		});
	};

	render() {
		if (!this.state.hasData) {
			return <NoData />;
		}
		if(!this.state.data.id) {
			return <Loading/>
		}
		let { data = {}, handleVisible, type, libType, libList, detailList = [], operationDetail } = this.state;
		return (
			<div className="history_alarm_detail_view history_alarm_phantomAlarm">
				<header className={`detail_header  ${data.isHandle !== 0 ? 'detail_header_hidden' : ''}`}>
				{data.isHandle == 0 && (
						<React.Fragment>
							<Input
								value={operationDetail}
								className="details_text"
								placeholder="请输入警情备注，最大长度不超过200"
								maxLength={201}
								onChange={this.handleText}
							/>
							<AuthMultipleComponent actionNames={[ 'PhantomCurrentAlarm', 'Phantom' ]}>
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
				<PhantomAlarmHeader data={data} libType={libType} libList={libList} />
				<div className="detail_imm">
					<PreviousDetail
						type="body"
						data={data}
						detailList={detailList}
						changeDetailView={this.changeDetailView}
					/>
					<DetailIMM type="body" data={data} key={data.id} />
					<NextDetail
						type="body"
						data={data}
						detailList={detailList}
						changeDetailView={this.changeDetailView}
					/>
				</div>
				<ModalView
					title={type == 1 ? '有效提醒确认' : '无效提醒确认'}
					visible={handleVisible}
					onCancel={this.onModalCancel}
					onOk={this.handleOk}
					width={320}
					iconType={type == 1 ? 'icon-YesNo_Yes_Main' : 'icon-YesNo_No_Main'}
					view={<div>点击“确定”将其标注为{type == 1 ? '有' : '无'}效提醒？</div>}
				/>
			</div>
		);
	}
}

export default AlarmDetailView;
