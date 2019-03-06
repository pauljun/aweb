import React from 'react';
import Table from 'src/view/SystemManagement/components/Table';
import { observer } from 'mobx-react';
import moment from 'moment';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import Pagination from 'src/components/Pagination';

import '../style/edit.scss'

@BusinessProvider('VillageListStore')
@observer
class view extends React.Component {
	state = {
		dataSource:[],
		page:1,
		pageSize:10
	}
	componentDidMount(){
		this.search()
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
		VillageListStore.getAssignedCentersByPage(options).then((res) => {
			this.setState({
				total: res.result.total,
				dataSource: res.result.list,
				pageSize: res.result.pageSize,
				page: res.result.page,
				loading: false
			});
		});
	};
	/**分页切换查询 */
	onChange = (page, pageSize) => {
		this.setState({ page, pageSize }, () => this.search());
	};
	render() {
		const { dataSource, loading, total , page, pageSize} = this.state;
		const columns = [
			{
			width: '10%',
			title: '序号',
			dataIndex: 'index',
			render: (text, item,index) => {
				return <span>{index+1}</span>;
			}
		},
			{
				width: '25%',
				title: '运营中心名称',
        dataIndex: 'centerName'
			},
			{
				width: '25%',
				title: '系统名称',
				dataIndex: 'systemName'
			},
			{
				title: '创建时间',
				dataIndex: 'createTime',
				render: (text, item,index) => {
					return <span>{text ? moment(Number(text)).format(
						'YYYY.MM.DD HH:mm:ss'
					):''}</span>;
				}
			}
		];
		return (
			<div className="VD-table">
				<Table columns={columns} dataSource={dataSource} />
				<Pagination total={total} pageSize={pageSize} current={page} onChange={this.onChange} />
			</div>
		);
	}
}

export default view;
