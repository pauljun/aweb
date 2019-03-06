import React from 'react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import Group from './components/Group';
import LeftList from './components/LeftList';
import RightList from './components/RightList';
import { observer } from 'mobx-react';

import './index.scss';
const configOptions = {
	'1': '运营中心',
	'2': '小区'
}

@BusinessProvider('VillageListStore', 'OperationCenterDeviceVillageStore')
@observer
export default class DisCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			centerList: [],
			uncenterList: [],
			choseList: [], // 勾选已分配运营中心
			filterList: [],
			unChoseList: [], // 勾选未分配运营中心
			unfilterList:[],
		};
		if (props.type === '1') {
			this.getCenterList();
			this.getUnCenterList();
		} else if (props.type === 2) {
			this.getCenterByCenterId()
		}
	}

	/**获取已分配和未分配小区列表 */
	getCenterByCenterId = () => {
		this.props.OperationCenterDeviceVillageStore
			.getList(this.props.ocId)
			.then(res => {
				if (res.code === 200) {
					this.setState({
						centerList: res.result.assigned,
						filterList: res.result.assigned,
						uncenterList: res.result.unallocated,
						unfilterList: res.result.unallocated,
					})
				}
			})
	}

	// 获取已分配运营中心列表
	getCenterList = () => {
		let { VillageListStore, villageId } = this.props;
		let option = {
			villageId,
			page: 1,
			pageSize: 9999
		};
		VillageListStore.getAssignedCentersByPage(option).then((res) => {
			this.setState({
				centerList: res.result.list,
				filterList: res.result.list,
			});
		});
	};

	// 获取未分配运营中心列表
	getUnCenterList = () => {
		let { VillageListStore, villageId } = this.props;
		let option = {
			villageId,
			page: 1,
			pageSize: 9999
		};
		VillageListStore.getUnAssignedCentersByPage(option).then((res) => {
			this.setState({
				uncenterList: res.result.list,
				unfilterList: res.result.list,
			});
		});
	};

	updateListData = () => {
		if (this.props.type === '1') {
			this.getCenterList();
			this.getUnCenterList();
		} else if (this.props.type === 2) {
			this.getCenterByCenterId()
		}
		this.setState({
			choseList: [],
			unChoseList: []
		});
	};

	getChoseCenterList = (choseList = []) => {
		this.setState({
			choseList,
		});
	};

	getUnChoseCenterList = (unChoseList = []) => {
		this.setState({
			unChoseList,
		});
	};
	
	onSearch = (v, type) => {
		let { uncenterList, centerList } = this.state;
		if(type === 0) {
			let unfilterList = uncenterList.filter(item => item.centerName.indexOf(v) > -1);
			this.setState({
				unfilterList
			})
		} else {
			let filterList = centerList.filter(item => item.centerName.indexOf(v) > -1);
			this.setState({
				filterList
			})
		}
	}
	render() {
		let { centerList, uncenterList, unChoseList, choseList, filterList, unfilterList } = this.state;
		let { villageId, VillageListStore, type, ocId } = this.props;
		return (
			<div className="dis-center">
				<LeftList
					unChoseList={unChoseList}
					data={unfilterList}
					onSearch={this.onSearch}
					getUnChoseCenterList={this.getUnChoseCenterList}
					type={type}
					name={configOptions[type]}
				/>
				<Group
					VillageListStore={VillageListStore}
					villageId={villageId}
					ocId={ocId}
					updateListData={this.updateListData}
					centerList={centerList}
					uncenterList={uncenterList}
					unChoseList={unChoseList}
					choseList={choseList}
					name={configOptions[type]}
				/>
				<RightList
					choseList={choseList}
					data={filterList}
					onSearch={this.onSearch}
					getChoseCenterList={this.getChoseCenterList}
					name={configOptions[type]}
				/>
			</div>
		);
	}
}
