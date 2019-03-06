import React, { Component } from 'react';
import TableMode from './tableMode';
import MapMode from '../../../components/editMap';

import './index.scss';

export default class view extends Component {
	constructor(props) {
		super(props);
		this.communityRef = React.createRef();
	}
	jumpCommunity=() => {
		let {initData} = this.props
		this.communityRef.current.jumpCommunity(initData.id);
	}
	render() {
		let { points, activeId, initData, type } = this.props;
		if (type === 2) {
			setTimeout(() => {
				this.jumpCommunity()
			}, 300);
		}
		return (
			<div className="VD-deviceView">
				<div className="content">
					{type === 1 && (
						<div className="device_list">
							<TableMode dataSource={points} activeId={activeId} />
						</div>
					)}
					{type === 2 && (
						<div className="map_show">
							<MapMode
								showTools={true}
								key={'VDMap'}
								isVD={true}
								click={this.jumpCommunity}
								isView={true}
								points={points}
								initData={initData}
								ref={this.communityRef}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}
