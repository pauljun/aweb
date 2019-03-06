import React from 'react';
import WaterMark from 'src/components/WaterMarkView';
import moment from 'moment';
import { Progress } from 'antd';

import './detailed.scss';
class AIOAlarmHeader extends React.Component {
	render() {
		let { data = {} } = this.props;
		return (
			<section className="detail_detailed detail_detailed_AIOA">
				<div className="detail_detailed_left">
					<div className="detailed_Cloth">
						<div className="cloth_img_box">
							<WaterMark src={data.facePath} type="face" />
						</div>
						<p className="cloth_p">抓拍人脸</p>
					</div>
					{data.isHandle == 1 && (
						<div className={`detailed_rotate ${data.isEffective == 0 ? 'rotate_no' : 'rotate_yes'} `} />
					)}
				</div>
				<div className="detail_detailed_right">
					<div className="detailed_right_header">
						<p className="header_name header_name_illegal" title={data.objectMainJson && data.objectMainJson.name}>
							互联网别名：{data.objectMainJson && data.objectMainJson.name}
						</p>
						<div className="header_progress">
							<span className="progress_span">相似度</span>
							<Progress percent={data.similarity && Math.floor(data.similarity)} status="active" strokeWidth={4} />
						</div>
					</div>
					<div className="detailed_right_center detailed_right_center_zhuanwang">
						<p className="right_center_p" title={data.cameraName}>
							<span className="right_center_span">告警设备：</span>
							{data.cameraName}
						</p>
						<p className="right_center_p" title={data.libName}>
							<span className="right_center_span">所在布控库：</span>
							{data.libName}
						</p>
						<p className="right_center_p">
							<span className="right_center_span">抓拍时间：</span>
							{data.captureTime && moment(+data.captureTime).format('YYYY.MM.DD HH:mm:ss')}
						</p>
					</div>
				</div>
			</section>
		);
	}
}

export default AIOAlarmHeader;
