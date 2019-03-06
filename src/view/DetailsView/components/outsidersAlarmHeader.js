import React from 'react';
import WaterMark from 'src/components/WaterMarkView';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { toJS } from 'mobx';
import moment from 'moment';

import './detailed.scss';

@BusinessProvider('MenuStore')
class OutsidersAlarmHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checkType: false
		};
	}

	componentDidMount() {
		let munuList = toJS(this.props.MenuStore.privileges);
		let arr = munuList.find((v) => v.privilegeCode === 1060601);
		if (arr) {
			this.setState({
				checkType: true
			});
		}
	}
	render() {
		let { data = {}, libType, libList = {}, goLibDetail } = this.props;
		let { checkType } = this.state;
		return (
			<section className={`detail_detailed ${libType == 3 && 'detail_detailed_meiying'}`}>
				<div className="detail_detailed_left">
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
						<p className="header_name header_name_illegal" title={data.taskName}>
							所在布控任务：{data.taskName}
						</p>
					</div>
					<div className="detailed_right_center">
						<div className="detailed_right_center_left">
							<p className="right_center_p">
								<span className="right_center_span" title={data.cameraName}>
									告警设备：
								</span>
								{data.cameraName}
							</p>
							<p className="right_center_p">
								<span className="right_center_span">抓拍时间：</span>
								{moment(+data.captureTime).format('YYYY.MM.DD HH:mm:ss')}
							</p>
						</div>
						<div className="detailed_right_center_right">
							<span className="right_center_span">合规人员库：</span>
							<div className="right_btn_box">
								{libList.length > 0 &&
									libList.map((v) => {
										return (
											<div className="btn_box" key={v.libId}>
												<AuthComponent
													actionName="outsidersBlackLibView"
													noAuthContent={<span className="btn_box_span">{v.libName}</span>}
												>
													<span
														className="btn_box_span"
														title={v.libName}
														onClick={checkType ? () => goLibDetail(v.libId) : null}
													>
														{v.libName}
													</span>
												</AuthComponent>
											</div>
										);
									})}
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

export default OutsidersAlarmHeader;
