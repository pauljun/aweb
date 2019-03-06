import React from 'react';
import Table from '../../components/Table';
import Pagination from 'src/components/Pagination';
import { withRouter } from 'react-router-dom';
import IconFont from '../../../../components/IconFont';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import { inject } from 'mobx-react';

@withRouter
@inject('TabStore')
class view extends React.Component {
	// goPage = (moduleName, childModuleName, data) => {
	// 	this.props.TabStore.goPage({
	// 		moduleName,
	// 		childModuleName,
	// 		history: this.props.history,
	// 		data:{id:data.villageId},
	// 		isUpdate: false
	// 	});
	// };
	render() {
		const { dataSource, loading, total, searchData, onChange, goPage, changeUser, ...props } = this.props;
		const columns = [
			{
				width: '25%',
				title: '小区名称',
        dataIndex: 'villageName',
				// render: (text, item) => {
        //   return <a onClick={() => goPage('SystemManagement', 'VillageDetail', {type:1,id:item.villageId})}>{text}</a>;
        // }
			},
			{
				width: '25%',
				title: '小区地址',
				dataIndex: 'address',
				render: (status, item, index) => status ? status : '-'
			},
			{
				width: '35%',
				title: '关联用户',
				dataIndex: 'associateUser',
				render: (text) => {
					let str =text.map((v) => v.userName).join(',');
					return (
						<span title={str} className="user-tr">
							{str ? str : '-'}
						</span>
					);
				}
			},
			// {
			// 	width: '35%',
			// 	title: '关联设备',
			// 	dataIndex: 'associateUser',
			// 	render: (text) => {
			// 		let str = text.map((v) => v.userName).join(',');
			// 		return (
			// 			<span title={str} className="user-tr">
			// 				{str}
			// 			</span>
			// 		);
			// 	}
			// },
			{
				title: '操作',
				dataIndex: 'tools',
				render: (text, item) => (
					<div className="table-tools">
            <IconFont
              type="icon-Export_Main"
              style={{ cursor: 'pointer' }}
              title="分配用户"
              onClick={() => changeUser(item)}
            />
					<AuthComponent actionName="VillageDetail">
						<IconFont
							type="icon-Task_Main2"
							style={{ cursor: 'pointer' }}
							title="基本信息"
							// disabled = {disabledDom}
							onClick={() => goPage('SystemManagement', 'VillageDetail', {type:1,isEdit:false,id:item.villageId})}
						/>
					</AuthComponent>
					<AuthComponent actionName="VillageDetail">
					<IconFont
							type="icon-Camera_Main2"
							style={{ cursor: 'pointer' }}
							title="设备信息"
							onClick={() => goPage('SystemManagement', 'VillageDetail', {type:2,isEdit:false,id:item.villageId})}
						/>
					</AuthComponent>
					
						{/* <AuthComponent actionName="UserOperata">
							<IconFont
								type="icon-Delete_Main"
								style={{ cursor: 'pointer' }}
								title="删除"
								// disabled = {disabledDom}
								// onClick={() => allowClick && this.deleteAction(item)}
							/>
						</AuthComponent> */}
					</div>
				)
			}
		];
		return (
			<div className="village-container">
				<Table columns={columns} dataSource={dataSource} loading={loading} {...props} />
				<Pagination total={total} pageSize={searchData.pageSize} current={searchData.page} onChange={onChange} />
			</div>
		);
	}
}

export default view;
