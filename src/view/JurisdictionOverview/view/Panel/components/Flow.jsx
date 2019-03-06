import React, { Component } from 'react';
// import CountUp from 'react-countup';
import ItemComponentCopy from './ItemComponentCopy';
import { observer } from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { errorBoundary } from 'src/utils/Decorator';

@errorBoundary
@BusinessProvider('JurisdictionOverviewStore')
@observer
class Flow extends Component {
	state = {
		resourcesStatis: {}
	};

	componentDidMount() {
		this.props.JurisdictionOverviewStore.getFlow().then((res) => {
			this.setState({ resourcesStatis: res.result || {} });
		});
	}

	render() {
		let { resourcesStatis } = this.state;
		let download1 = (resourcesStatis.download_traffic_today !== 0
			? resourcesStatis.download_traffic_today / 1024 / 1024 / 1024 / 1024
			: 0.0).toFixed(2);
		let download2 = (Number(resourcesStatis.down_traffic_yesterday) / 1024 / 1024 / 1024 / 1024).toFixed(2);
		let upload1 = (resourcesStatis.up_traffic_today !== 0
			? resourcesStatis.up_traffic_today / 1024 / 1024 / 1024 / 1024
			: 0.0).toFixed(2);
		let upload2 = (Number(resourcesStatis.up_traffic_yesterday) / 1024 / 1024 / 1024 / 1024).toFixed(2);
		return (
			<div className="chart table">
				<div className="flow-item-wrapper">
					<ItemComponentCopy
						label="下载"
						subLabel1="下载总量"
						subLabel2="昨日新增"
						icon="icon-Download_Main"
						value1={isNaN(download1) ? 0 : download1}
						value2={isNaN(download2) ? 0 : download2}
					/>
					<ItemComponentCopy
						label="上传"
						subLabel1="上传总量"
						subLabel2="昨日新增"
						icon="icon-Upload_Main"
						color={'#0FC484'}
						value1={isNaN(upload1) ? 0 : upload1}
						value2={isNaN(upload2) ? 0 : upload2}
					/>
				</div>
			</div>
		);
	}
}
export default Flow;
