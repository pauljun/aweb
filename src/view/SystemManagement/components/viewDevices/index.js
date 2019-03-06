import React from 'react';
import Table from '../Table';
import Search from './search';
import {Pagination} from 'antd'

import './index.scss'

export default class ViewDevices extends React.Component {
	render() {
		let {villageDevices}=this.props
    const columns = [
      {
      title: '序号',
      dataIndex: 'tools'
    },
			{
				title: '设备名称',
        dataIndex: 'deviceName'
			},
			// {
			// 	title: 'SN码',
			// 	dataIndex: 'address'
			// },
			// {
			// 	title: '设备类型',
			// 	dataIndex: 'associateUser'
			// },
			// {
			// 	title: '场所类型',
			// 	dataIndex: 'tools'
			// },
			// {
			// 	title: '分组信息',
			// 	dataIndex: 'tools'
			// }
		];
		return (
			<div className='viewDevices'>
        <Search />
        <Table columns={columns} dataSource={villageDevices} />
      	<Pagination pageSize={10} current={1} />
      </div>
		);
	}
}
