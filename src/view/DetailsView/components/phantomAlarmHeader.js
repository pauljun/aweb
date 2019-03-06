import React from 'react';
import moment from 'moment';

import './detailed.scss';
class PhantomAlarmHeader extends React.Component {
	render() {
		let { data = {} } = this.props;
		return (
			<section className="detail_detailed detail_detailed_meiying">
				<div className="detail_detailed_right">
					<div className="detailed_right_header">
						<p className="header_name header_name_illegal" title={data.taskName}>所在布防任务：{data.taskName}</p>
					</div>
					<div className="detailed_right_center detailed_right_center_meiying">
						<p className="right_meiying_p" title={data.cameraName}>
							<span className="right_center_span">告警设备：</span>
							{data.cameraName}
						</p>
						<p className="right_meiying_p">
							<span className="right_center_span">抓拍时间：</span>
							{moment(+data.captureTime).format('YYYY.MM.DD HH:mm:ss')}
						</p>
					</div>
					{data.isHandle == 1 && (
							<div className={`detailed_rotate ${data.isEffective == 0 ? 'rotate_no' : 'rotate_yes'} `} />
						)}
				</div>
			</section>
		);
	}
}

export default PhantomAlarmHeader;
