import React, { Component } from 'react';
import ItemComponent from './ItemComponent';
import { observer } from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import util from '../middle/util/util'
import { errorBoundary } from 'src/utils/Decorator';

import './style.scss';

@errorBoundary
@BusinessProvider('JurisdictionOverviewStore')
@observer
class Alarms extends Component {
	state = {
		resourcesStatis: {}
	};

	componentDidMount() {
		this.props.JurisdictionOverviewStore.getAlarmSummaryStatistics({
			logTypes:["1","2","4","5"]
		}).then((res) => {
			this.setState({ resourcesStatis: res.result || {} });
		});
	}
	render() {
		let { resourcesStatis } = this.state;
		return (
			<div className="chart table">
				<div className="alarms-item-wrapper">
					<ItemComponent label="警情总数" icon="icon-_Alarm" value={util.splitNum(isNaN(resourcesStatis.effectiveNum + resourcesStatis.ineffectiveNum + resourcesStatis.unHandledNum)?0:(resourcesStatis.effectiveNum + resourcesStatis.ineffectiveNum + resourcesStatis.unHandledNum))} />
					<ItemComponent label="有效警情数" icon="icon-YesNo_Yes_Main" value={util.splitNum(resourcesStatis.effectiveNum)} />
					<ItemComponent label="无效警情数" icon="icon-YesNo_No_Main" value={util.splitNum(resourcesStatis.ineffectiveNum)} />
					<ItemComponent label="未处理警情数" icon="icon-Data___Dark2" value={util.splitNum(resourcesStatis.unHandledNum)} />
				</div>
			</div>
		);
	}
}
export default Alarms;
