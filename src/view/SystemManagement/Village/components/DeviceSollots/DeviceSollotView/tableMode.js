import React from 'react';
import Table from 'src/view/SystemManagement/components/Table';
import Pagination from 'src/components/Pagination';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import DeviceIcon from 'src/components/DeviceIcon';
import { getKeyValue, getKeyLable } from 'src/libs/Dictionary';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';

@withRouter
@BusinessProvider('TabStore', 'VillageListStore', 'DeviceManagementStore')
@observer
class view extends React.Component {
	state = {
		pageSize: 10,
		page: 1,
		dataSource: [],
		total: 10,
		loading: false,
		deviceGroup: []
	};
	componentWillMount() {
		const { DeviceManagementStore } = this.props;
		/**获取羚羊云设备分组 */
		DeviceManagementStore.getLingyangOrgs().then((res) => {
			this.setState({
				deviceGroup: res
			});
		});
		this.search();
	}
	/**
   * 搜索
   */
	search = () => {
		const { VillageListStore, activeId } = this.props;
		let { page, pageSize } = this.state;
		this.setState({
			loading: true
		});
		let options = { page, pageSize, villageId: activeId };
		VillageListStore.queryVillageDevices(options).then((res) => {
			this.setState({
				total: res.result.resultSize,
				dataSource: res.result.resultList,
				loading: false
			});
		});
	};
	/**分页切换查询 */
	onChange = (page, pageSize) => {
		this.setState({ page, pageSize }, () => this.search());
	};
	render() {
		const { dataSource, loading, total, pageSize, page, deviceGroup } = this.state;
		const columns = [
			{
				width: '10%',
				title: '序号',
				key: 'index',
				dataIndex: 'index',
				render: (text, item, index) => {
					return <span key={index}>{index + 1}</span>;
				}
			},
			{
				width: '25%',
				title: '设备名称',
				dataIndex: 'deviceName',
				render: (name, record) => {
					return (
						<div className="device-table-name">
							<span>
								<DeviceIcon
									type={record.deviceType}
									status={record.deviceData}
								/>
								{name}
							</span>
						</div>
					);
				}
			},
			{
				width: '20%',
				title: 'SN码',
				dataIndex: 'sn'
			},
			{
				width: '10%',
				title: '设备类型',
				dataIndex: 'deviceType',
				render: (text, item, index) => {
					return (
						<span>
							{getKeyValue(
								'deviceType',
								`${(item.manufacturerDeviceType === 103401 || item.manufacturerDeviceType === 103408) ? item.deviceType : item.manufacturerDeviceType}`
							)}
						</span>
					);
				}
			},
			{
				width: '15%',
				title: '场所类型',
				dataIndex: 'placeType',
				render: (text) => {
					return <span>{text ? getKeyLable('geoAddress', text).label : '-'}</span>;
				}
			},
			{
				title: '分组信息',
				dataIndex: 'lyGroupId',
				render: (text, item, index) => {
					let names = deviceGroup.filter((v) => v.id === text)[0]
					let str = text ? names && names.name ? names.name : '-' : '-';
					return (
						<span title={str} className="user-tr">
							{str}
						</span>
					);
				}
			}
		];
		return (
			<React.Fragment>
				<Table columns={columns} dataSource={dataSource} loading={loading} rowKey="sn" />
				<Pagination total={total} pageSize={pageSize} current={page} onChange={this.onChange} />
			</React.Fragment>
		);
	}
}

export default view;
