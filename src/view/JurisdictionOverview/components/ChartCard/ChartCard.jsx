import React, { Component } from 'react';
import NowTime from '../NowTime';

import './index.scss';
class ChartCard extends Component {
	render() {
		let { type, title } = this.props;
		return type === 'charts' ? (
			<div className="camera-numb">
				<div className="title">
					<span>{title}</span>
				</div>
				{this.props.children}
			</div>
		) : null
	}
}
export default ChartCard;
