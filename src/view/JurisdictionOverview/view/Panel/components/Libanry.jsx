import React, { Component } from 'react';
import ItemComponent from './ItemComponent';
import { observer } from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import util from '../middle/util/util';
import { errorBoundary } from 'src/utils/Decorator';

@errorBoundary
@BusinessProvider('JurisdictionOverviewStore')
@observer
class Libanry extends Component {
	state = {
		resourcesStatis: {}
	};

	componentDidMount() {
		this.props.JurisdictionOverviewStore.getControlStatistics().then((res) => {
			this.setState({ resourcesStatis: res.result || {}});
		});
	}
	render() {
		let { resourcesStatis } = this.state;
		return (
			<div className="chart table">
				<div className="resource-item-wrapper">
					<ItemComponent label="布控总人数" icon="icon-People_Light" value={util.splitNum(resourcesStatis.personnum)} />
					<ItemComponent label="布控任务" icon="icon-Data___Dark3" value={util.splitNum(resourcesStatis.tasknum)} />
					<ItemComponent label="布控库总数" icon="icon-Layer_Main" value={util.splitNum(resourcesStatis.libnum)} />
				</div>
			</div>
		);
	}
}
export default Libanry;
