import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Tabs, Spin } from 'antd';
import AssignOpc from '../components/assignOpc';
import BaseInfo from '../components/BaseInfo';
import DeviceSollots from '../components/DeviceSollots';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import Socket from 'src/libs/Socket';
import '../style/edit.scss';

const TabPane = Tabs.TabPane;

@withRouter
@BusinessProvider('VillageListStore', 'CommunityEntryStore')
@observer
export default class CenterVillageListEdit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			initData: {},
			villageDevices: [],
			activeId: '',
			type: 1,
			isCenter: false,
			disabled:false
		};
		let defaultActiveKeys = this.props.location.search.includes('type')
			? this.props.location.search.split('&')[0].split('?type=')[1]
			: '1';
		this.defaultActiveKey = defaultActiveKeys;
		this.center = this.props.location.pathname.includes('CenterVillage');
		Socket.on('updateVillageDevices', this.initDatas);
		Socket.on('disableTabs', this.disableTabs);
	}

	disableTabs=(flag) => {
		this.setState({disabled:!flag})
	}

	componentWillUnmount() {
		Socket.off('updateVillageDevices');
		Socket.off('disableTabs', this.disableTabs);
		this.defaultActiveKey = null;
	}
	//初始化数据
	initDatas = () => {
		//getDetail
		const { VillageListStore, CommunityEntryStore, location } = this.props;
		let ids = location.search.split('id=')[1];
		Promise.all([
			VillageListStore.getDetail(ids),
			VillageListStore.queryVillageDevices({ villageId: ids }),
			// VillageListStore.queryUnbindedVillageDevices(),
			// CommunityEntryStore.selectCommunityDeviceByUserId()
		]).then((resArray) => {
			this.setState({
				initData: resArray[0],
				villageDevices: resArray[1].result.resultList,
				// unbindPoint: resArray[2].result.resultList,
				// allPoints: resArray[3],
				loading: false,
				activeId: ids
			});
		});
	};
	componentWillMount() {
		this.initDatas();
	}
	render() {
		let { initData, villageDevices, loading, activeId, unbindPoint, allPoints,disabled } = this.state;
		return (
			<React.Fragment>
				<div className="edit-village-waper">
					<Spin spinning={loading} style={{ position: 'fixed', top: '40%', left: '50%' }} />
					{!loading && <div className="villageTitle">{initData.villageName}</div>}
					{!loading && (
						<Tabs defaultActiveKey={this.defaultActiveKey}>
							<TabPane disabled={disabled} tab="基本信息" key="1">
								<div className="wappers">
									<BaseInfo
									isCenter={this.center}
										points={villageDevices}
										unbindPoint={unbindPoint}
										allPoints={allPoints}
										initData={initData}
										activeId={activeId}
									/>
								</div>
							</TabPane>
							<TabPane disabled={disabled} tab="已分配设备" key="2">
								<DeviceSollots isCenter={this.center} points={villageDevices} initData={initData} activeId={activeId} />
							</TabPane>
							{this.center && (
								<TabPane disabled={disabled} tab="已分配运营中心列表" key="3">
									<AssignOpc activeId={activeId} isCenter={this.center} />
								</TabPane>
							)}
						</Tabs>
					)}
				</div>
			</React.Fragment>
		);
	}
}
