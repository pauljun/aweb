import React from 'react';
import { BusinessProvider } from '../../../../utils/Decorator/BusinessProvider';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import LoggerTableView from './components/logTab';
import SearchForm from './components/searchForm';
import { getLogInfoList } from 'src/service/RequestUrl';
import LogsComponent from 'src/components/LogsComponent';
import {appList} from 'src/libs/Dictionary'
import _ from 'lodash';
import './index.scss';

const logInfoDict = getLogInfoList();
let actionModelType=[], actionFeaturnType=[]
let actionPlatType=[
	{
		text:"全部",
		code:null
	},
	{
		text:"Web端",
		code: 'userAgentWeb'
	},
	{
		text:"App端",
		code:'userAgentMobile'  
	}
]
const logAllInfo=_.unionBy(logInfoDict,appList,'code');//合并去重
logAllInfo.map(v => {
	if(v.parent) {
		actionFeaturnType.push(v);
	} else {
		actionModelType.push(v);
	}
})
@withRouter
@LogsComponent()
@BusinessProvider('TabStore', 'LogManagementStore','UserStore')
@observer
class PlatFormLogger extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			total: 0,
			pageNum: 0,
			loading:false
		};
	}
	componentWillMount() {
		const { UserStore } = this.props
		const centerId = UserStore.userInfo.optCenterId;
		let { LogManagementStore } = this.props;
		LogManagementStore.initData({centerId})
		this.getLogList();
	}
	// 获取数据
	getLogList = (options={}) => {
		this.setState({
			loading:true
		})
		let { LogManagementStore } = this.props;
		LogManagementStore.editSearchData(options).then(() => {
			LogManagementStore.searchLogList().then((res) => {
				this.setState({
					total: res.total,
					list: res.list,
					pageNum: res.pageNum,
					loading:false
				});
			});
		});
	}

	onChange = (page, pageSize) => {
		this.getLogList({ pageNum: page, pageSize: pageSize });
	};
	render() {
		const { LogManagementStore ,menuInfo} = this.props;
		const { searchData } = LogManagementStore;
		const { list, total, loading } = this.state;
		return (
			<div className="logger-platform-view">
			  <div className='noTreeTitle'>日志管理</div>
				<div className='logger-container'>
					<div className="platform-header">
            <SearchForm 
              search={this.getLogList}
							menuInfo={menuInfo}
							logInfoDict={logInfoDict}
							appList={appList}
							logAllInfo={logAllInfo}
              actionModelType={actionModelType}
							actionFeaturnType={actionFeaturnType}
							actionPlatType={actionPlatType}
            />
					</div>
					<div className="platform-content">
						<LoggerTableView
							logInfoDict={logInfoDict}
							logAllInfo={logAllInfo}
							key="soldier"
							sourceList={actionPlatType}
							total={total}
							searchData={searchData}
							dataSource={list}
							loading={loading}
							onChange={this.onChange}
							scroll={{y:'100%'}}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default PlatFormLogger;
