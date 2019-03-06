import React from 'react';
import { Table, Popover } from 'antd';
import WaterMark from 'src/components/WaterMarkView';
import { getKeyValue, identifyType as IdentifyType } from '../../../../libs/Dictionary';

import '../style/infoList.scss';

const columns = [
	{
		title: '照片',
		dataIndex: 'lyyUrl',
		width: '5%',
		render: (lyyUrl) =>
			lyyUrl ? (
				<Popover
					trigger="hover"
					placement="right"
					overlayClassName="people-info-pop"
					content={
						<div className="people-box">
							<WaterMark background={true} type="face" src={lyyUrl} />
						</div>
					}
				>
					<div className="list-pop-box">
						<img className="pop-img" src={lyyUrl && lyyUrl} alt="" />
					</div>
				</Popover>
			) : (
				<div className="list-pop-box">
					<img className="pop-img" src={lyyUrl && lyyUrl} alt="" />
				</div>
			)
	},
	{
		title: '姓名',
		dataIndex: 'peopleName',
		width: '9%',
	},
	{
		title: '性别',
		dataIndex: 'gender',
		width: '7%',
	},
	{
		title: '证件类型',
		dataIndex: 'credentialType',
		width: '10%',
		render: (credentialType) => {
			return credentialType/* getKeyValue(IdentifyType, identifyType) */;
		}
	},
	{
		title: '证件号码',
		dataIndex: 'credentialNo',
		width: '18%',
	},
	{
		title: '手机号',
		dataIndex: 'mobile',
		width: '14%',
	},
	{
		title: '楼栋号',
		dataIndex: 'buildingNo',
		width: '6%',
	},
	{
		title: '单元号',
		dataIndex: 'unitNo',
		width: '6%',
	},
	{
		title: '房间号',
		dataIndex: 'houseNo',
		width: '8%',
	},
	{
		title: '上传状态',
		dataIndex: 'importStatus',
		render: (importStatus) => (
			<div className="import-status">
				<span
					className={`status-span ${importStatus === 1
						? 'green'
						: importStatus === 256
							? 'blue'
							: importStatus === 64 || importStatus === 128
								? 'yellow'
								: importStatus === 16 || importStatus === 32
									? 'red'
									: importStatus === 4 || importStatus === 8 ? 'yard' : ' '}`}
				/>
				{importStatus === 1 ? (
					'上传成功'
				) : importStatus === 256 ? (
					'照片无特征值'
				) : importStatus === 64 || importStatus === 128 ? (
					'暂无照片'
				) : importStatus === 16 || importStatus === 32 ? (
					'信息输入错误'
				) : importStatus === 4 || importStatus === 8 ? (
					'其他'
				) : (
					''
				)}
			</div>
		)
	}
];

class InfoList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedRowKeys: []
		};
	}
	onSelectChange = (selectedRowKeys) => {
		let { list } = this.props;
		this.setState({
			selectedRowKeys
		});
		let arr = list.filter((item) => selectedRowKeys.find((v) => v === item.id));
		this.props.crossValue && this.props.crossValue(arr);
	};

	render() {
		const { selectedRowKeys } = this.state;
		let { list } = this.props;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange
		};
		return (
			<div className="info-list-view">
				<Table
					childrenColumnName="info-list-table"
					rowKey={(record) => record.id}
					rowClassName="info-list-table-row"
					rowSelection={rowSelection}
					columns={columns}
					dataSource={list}
					pagination={false}
				/>
			</div>
		);
	}
}

export default InfoList;
