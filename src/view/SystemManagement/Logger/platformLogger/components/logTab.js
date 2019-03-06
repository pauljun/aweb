import React from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Pagination from 'src/components/Pagination';
import Table from '../../../components/Table';
import { Tooltip } from 'antd';
import moment from 'moment';

@withRouter
@inject('TabStore')
class LoggerTableView extends React.Component {
	goPage(moduleName, childModuleName, data) {
		this.props.TabStore.goPage({
			moduleName,
			childModuleName,
			history: this.props.history,
			data,
			isUpdate: true
		});
  }
  
  getLogLabel = (code) => {
		const { logInfoDict,logAllInfo } = this.props;
    const logItem = logAllInfo.find(x => x.code+'' === code+'') || {}
    return logItem.text
  }

	render() {
    let { dataSource, loading, total, searchData, onChange, sourceList, ...props } = this.props;
		let data = dataSource
		const columns = [
			{
				title: '序号',
				dataIndex: 'id',
				width: 60,
				className:'log-column-index',
				render(text, item, index) {
					return index + 1;
				}
			},
			{
				title: '操作人',
				dataIndex: 'username',
				width: 120,
			},
			{
				title: '操作端',
				dataIndex: 'userAgent',
				width: 80,
				render(text){
					let code = sourceList.filter(v => v.code&&v.code === text)
					return code.length ? code[0].text : sourceList[1].text
				}
			},
			{
				title: '记录时间',
				width: 140,
				dataIndex: 'time',
				render(text, item, index) {
					return moment(+text).format('YYYY.MM.DD HH:mm:ss');
				}
			},
			{
				title: 'IP地址',
				width: 120,
				dataIndex: 'ip'
			},
			{
				title: '操作模块',
				width: 150,
				dataIndex: 'module',
				render:(text, item, index) => {
					return this.getLogLabel(text)
				}
			},
			{
				title: '操作功能',
				width: 160,
				dataIndex: 'function',
				render : (text, item, index) => {
					return this.getLogLabel(text)
				}
			},
			{
				title: '描述',
				dataIndex: 'description',
				render: (text) => (
          <Tooltip overlayClassName='log-description-tooltip' title={text||''}>
            <div className='log-description'>{text || ''}</div>  
          </Tooltip> 
        )
			}
		];
		return (
			<div className="logger-table-container">
        <Table 
          className="logger-table" 
          pagination={false} 
          columns={columns} 
          dataSource={data} 
          loading={loading} 
          {...props}
        />
				<Pagination total={total} pageSize={searchData.pageSize} current={searchData.pageNum} onChange={onChange} simpleMode={false}/>
			</div>
		);
	}
}

export default LoggerTableView;
