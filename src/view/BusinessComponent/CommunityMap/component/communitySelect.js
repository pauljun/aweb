import React from 'react';
import IconFont from '../../../../components/IconFont';
import DeviceIcon from '../../../../components/DeviceIcon';
import { Popover } from 'antd';
import { CommunityDeviceType, DeviceState } from '../../../../libs/DeviceLib';

import './communitySelect.scss';

const deviceType = CommunityDeviceType.filter((v) => v.value !== '-1');
const deviceData = DeviceState.filter((v) => v.value !== '-1');

class CommunitySelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			type: deviceType.map((v) => v.value),
			status: deviceData.map((v) => v.value)
		};
	}
	changeMapMarker(changeType, code, flag) {
		console.log(changeType,code );
		const { clusterMarker } = this.props;
		const state = this.state;
		const index = state[changeType].indexOf(code);
		if (index > -1) {
			state[changeType].splice(index, 1);
		} else {
			state[changeType].push(code);
		}
		this.setState({ [changeType]: state[changeType] }, () => {
			clusterMarker.showCustomMarker(this.state.type, this.state.status);
		});
	}
	getPopupContent = () => {
		const { type, status } = this.state;
		const {showBind} = this.props
		return (
			<div className="type-popup-layout">
				<div className="type-part">
					<div className="type-name">设备种类</div>
					<div className="type-content">
						{deviceType.map((item) => (
							<div
								className={`type-item ${type.indexOf(item.value) > -1 ? 'active' : ''} `}
								key={item.value}
								onClick={() => this.changeMapMarker('type', item.value)}
							>
								<span className="icon">
									<DeviceIcon type={item.value} theme="outlined" />
								</span>
								<span className="lable-text">{item.label}</span>
							</div>
						))}
					</div>
				</div>
				<div className="type-part">
					<div className="type-name">在离线状态：</div>
					<div className="type-content">
						{deviceData.map((item) => (
							<div
								className={`type-item ${status.indexOf(item.value) > -1 ? 'active' : ''} `}
								key={item.value}
								onClick={() => this.changeMapMarker('status', item.value)}
							>
								<span className="icon">
									<IconFont type={item.value === '1' ? 'icon-OnLine_Main' : 'icon-OffLine_Main'} theme="outlined" />
								</span>
								<span className="lable-text">{item.label}</span>
							</div>
						))}
					</div>
				</div>
				{showBind && <div className="type-part">
					<div className="type-name">分配状态：</div>
					<div className="type-content">
						{deviceData.map((item) => (
							<div
								className={`type-item ${status.indexOf(item.value) > -1 ? 'active' : ''} `}
								key={item.value}
								onClick={() => this.changeMapMarker('status', item.value)}
							>
								<span className="icon">
									<IconFont type={item.value === '1' ? 'icon-OnLine_Main' : 'icon-OffLine_Main'} theme="outlined" />
								</span>
								<span className="lable-text">{item.label}</span>
							</div>
						))}
					</div>
				</div>}
			</div>
		);
	};

	render() {
		return (
			<div className="community_select">
				<div className="community_select_layout" />
				<Popover
					placement="bottomRight"
					trigger={'click'}
					getPopupContainer={() => document.querySelector('.community_select_layout')}
					content={this.getPopupContent()}
				>
					<div className="tools-resource">
						<IconFont type="icon-Layer_Main" theme="outlined" />
						资源
						<IconFont type="icon-Arrow_Small_Down_Mai" theme="outlined" />
					</div>
				</Popover>
			</div>
		);
	}
}

export default CommunitySelect;
