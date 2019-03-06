import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import CommunityMap from '../../../BusinessComponent/CommunityMap';
import CommunityList from '../../components/entry/communityList';
import CommunityDetail from '../../components/entry/communityDetail';
import LogsComponent from 'src/components/LogsComponent';

import './index.scss';

@LogsComponent()
@withRouter
@BusinessProvider('TabStore', 'CommunityEntryStore', 'UserStore')
@observer
class EntryView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			villageList: [],
			solidCount: {},
			points: [],
			selectId: '',

		};
		this.communityRef = React.createRef();
		this.init();
		this.getVillSolidData();
		this.getDeviceList();
	}

	init(){
		let { CommunityEntryStore } = this.props;
		this.getVillageList().then((list) => {
			let villageIds = [];
			list.map(v => villageIds.push(v.id));
			if(villageIds.length === 0) {
				return
			}
			CommunityEntryStore.getPermanentInfoByVillageIds({villageIds}).then(res => {
				res.map(item => {
					try {
						Object.assign(list.find(v => v.id === item.villageId), item);
					} catch (e) {

					}
					this.setState({
						villageList: list,
						filterVillageList: list,
					})
				})
			})
		})
	}

	// 获取小区总览列表
	getVillageList = async (keyWord = '') => {
		let { CommunityEntryStore } = this.props;
		let option = {
			keyWord: keyWord,
			page: 1,
			pageSize: 10000
		};
		let res = await CommunityEntryStore.getVillagesForShortInfo(option)
		this.setState({
			villageList: res.list,
			filterVillageList: res.list,
		})
		return res.list;
	};

	getVillSolidData = () => {
		let { CommunityEntryStore, UserStore } = this.props;
		let userId = UserStore.userInfo.id;
		CommunityEntryStore.getCountVillageSolidData({ userId }).then((res) => {
			this.setState({
				solidCount: res
			});
		});
	};

	clickCommunity = (item) => {
		this.communityRef.current.jumpCommunity(item.id);
		this.setState({
			selectId: item.id
		});
	};

	restMap = () => {
		this.setState({
			selectId: ''
		});
	};

	getDeviceList() {
		const { CommunityEntryStore } = this.props;
		CommunityEntryStore.selectCommunityDeviceByUserId().then((res) => {
			res.forEach((item) => {
				item.id = item.deviceId;
			});
			this.setState({
				points: res
			});
		});
	}
	webGetVillageList = (keyWord) => {
		let { villageList } = this.state;
		let filterVillageList = villageList.filter(v => v.villageName.indexOf(keyWord) > -1);
		this.setState({
			filterVillageList
		})
	}
	render() {
		const { filterVillageList, solidCount, points, selectId } = this.state;
		let allPoints = [];
		if (selectId) {
			allPoints = points.filter((v) => v.villageId === selectId);
		} else {
			allPoints = points;
		}
		return (
			<div className="community_entry">
				<CommunityMap points={allPoints} villages={filterVillageList} ref={this.communityRef} />
				<CommunityList
					restMap={this.restMap}
					getVillageList={this.webGetVillageList.bind(this)}
					data={filterVillageList}
					clickCommunity={this.clickCommunity}
				/>
				<CommunityDetail data={solidCount} selectId={selectId} />
			</div>
		);
	}
}

export default EntryView;
