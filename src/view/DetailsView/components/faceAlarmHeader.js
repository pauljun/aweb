import React from 'react';
import WaterMark from 'src/components/WaterMarkView';
import { Progress } from 'antd';
import moment from 'moment';

import './detailed.scss';
class FaceAlarmHeader extends React.Component {
	constructor(props) {
		super(props);
		this.logType = [
			{ key: 1, value: '黑名单报警' },
			{ key: 2, value: '白名单报警' },
			{ key: 3, value: '事件报警' },
			{ key: 4, value: '白名单比对记录' },
			{ key: 5, value: '一体机黑名单报警' },
			{ key: 6, value: 'APP临时任务报警' }
		];
	}

	render() {
		let { data = {} } = this.props;
		let logTypeValue = '';
		data.logType = 3;
		let logName = this.logType.filter((v) => v.key == data.logType);
		if (logName.length == 1) {
			logTypeValue = logName[0].value;
		}
		return (
			<section className="detail_detailed">
				<div className="detail_detailed_left">
					<div className="detailed_Cloth">
						<div className="cloth_img_box">
							<WaterMark src={data.imageUrl} type="face" />
						</div>
						<p className="cloth_p">布控人脸</p>
					</div>
					<div className="detailed_Cloth">
						<div className="cloth_img_box">
							<WaterMark src={data.facePath} type="face" />
						</div>
						<p className="cloth_p">抓拍人脸</p>
					</div>
					{data &&
					data.isHandle == 1 && (
						<div className={`detailed_rotate ${data.isEffective == 0 ? 'rotate_no' : 'rotate_yes'} `} />
					)}
				</div>
				<div className="detail_detailed_right">
					<div className="detailed_right_header">
						<p className="header_name" title={data.objectMainJson && data.objectMainJson.name}>
							{data.objectMainJson && data.objectMainJson.name}
						</p>
						<div className="header_progress">
							<span className="progress_span">相似度</span>
							<Progress percent={data.similarity && Math.floor(data.similarity)} status="active" strokeWidth={4} />
						</div>
					</div>
					<div className="detailed_right_center">
						<p className="right_center_p">
							<span className="right_center_span">性别：</span>
							{data.objectMainJson && data.objectMainJson.gender}
						</p>
						<p className="right_center_p" title={data.libName}>
							<span className="right_center_span"> 所在布控库：</span>
							{data.libName}
						</p>
						<p className="right_center_p">
							<span className="right_center_span">民族：</span>
							{data.objectMainJson && data.objectMainJson.nationality}
						</p>
						<p className="right_center_p" title={data.taskName}>
							{/* <span className="right_center_span">告警类型：</span>{logTypeValue} */}
							<span className="right_center_span">所在布控任务：</span>
							{data.taskName}
						</p>
						<p className="right_center_p">
							<span className="right_center_span">身份证号：</span>
							{data.objectMainJson && data.objectMainJson.identityNumber}
						</p>
						<p className="right_center_p" title={data.cameraName}>
							<span className="right_center_span">告警设备：</span>
							{data.cameraName}
						</p>
						<p className="right_center_p">
							<span className="right_center_span">出生年月：</span>
							{data.objectMainJson && data.objectMainJson.birthday}
						</p>
						<p className="right_center_p">
							<span className="right_center_span">抓拍时间：</span>
							{data && moment(+data.captureTime).format('YYYY.MM.DD HH:mm:ss')}
						</p>
					</div>
				</div>
			</section>
		);
	}
}

export default FaceAlarmHeader;
