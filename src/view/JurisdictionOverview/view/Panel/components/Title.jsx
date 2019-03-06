import React from 'react';
import * as _ from 'lodash';

export default ({ total = 0, title = '羚眸视频大数据平台' }) => {
	return (
		<React.Fragment>
			<div className="header">
				<p>{title}辖区总览</p>
			</div>
			<div className="device-total-view">
				<p>设备总数</p>
				<div className="count font-resource-normal">
					<div className="line" />
					{_.split(_.toString(total), '').map((v, k) => <span key={k}>{v}</span>)}
				</div>
			</div>
		</React.Fragment>
	);
};
