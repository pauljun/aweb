import React, { Component } from 'react';
import ItemComponent from './ItemComponent';
import { observer } from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import util from '../middle/util/util'
import { errorBoundary } from 'src/utils/Decorator';

import './style.scss';

@errorBoundary
@BusinessProvider('DeviceStore','JurisdictionOverviewStore')
@observer
class Cameras extends Component {
	state = {
		cameraList: []
	};

	componentDidMount() { 
		this.props.JurisdictionOverviewStore
			.getDeviceTypeCount({ deviceTypes: [] })
			.then((res) => {
				this.setState({ cameraList: res.result || []});
			});
	}
	getValue = (data) => {
		let count = 0;
		data.map((v) => {
			count += v.num;
		});
		return count;
	};
	render() {
		let {cameraList} = this.state;
		let total = this.getValue(cameraList);
		let znqj = {
			value:this.getValue( cameraList.filter((v) => v.deviceType === 100604)),
			name: '智能枪机'
		};
		let qj = {
			value:this.getValue( cameraList.filter((v) => v.deviceType === 100602)),
			name: '球机'
		};
		let zpj = {
			value:this.getValue( cameraList.filter((v) => v.deviceType === 100603)),
			name: '抓拍机'
		};
		let qita = {
			value: total - znqj.value - qj.value - zpj.value,
			name: '其他'
		};
		return (
			<div className="chart table">
				<div className="cameras-item-wrapper">
					<ItemComponent label="设备总数" icon="icon-_Camera__Main2" value={util.splitNum(total)} />
					<ItemComponent label="智能枪机" icon="icon-_Camera__Main1" value={util.splitNum(znqj.value)} />
					<ItemComponent label="抓拍机" icon="icon-_Camera__Main3" value={util.splitNum(zpj.value)} />
					<ItemComponent label="球机" icon="icon-_Camera__Main" value={util.splitNum(qj.value)} />
					<ItemComponent label="其他" icon="icon-Data___Dark4" value={util.splitNum(qita.value)} />
				</div>
			</div>
		);
	}
}
export default Cameras;
