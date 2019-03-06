import React from 'react';
import { Select } from 'antd';
import moment from 'moment';
import NoDataComp from 'src/components/NoData';
import WaterMark from 'src/components/WaterMarkView';
import IconFont from 'src/components/IconFont';

import './residenceTime.scss';

const Option = Select.Option;

class ResidenceTime extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			timeType: 0
		};
		this.accessListDom = React.createRef();
	}
	handleChange = (value) => {
		this.setState({
			leftValue: 0,
			timeType: value
		});
	};

	handleTwoArrray = (arr = []) => {
		let list = {};
		arr.map((item) => {
			let timeKey = moment(+item.captureTime).format('YYYY-MM-DD-HH');
			if (list[timeKey]) {
				list[timeKey].value.push(item);
			} else {
				list[timeKey] = { key: moment(+item.captureTime).format('YYYY.MM.DD HH:00'), value: [ item ] };
			}
		});
		return Object.keys(list).map((k) => list[k]);
	};
	
	handleChangeList = (type) => {
		let { faceList = [] } = this.props;
		let listBoxContent = this.accessListDom.current;
		let leftValue = 180 * Math.floor(listBoxContent.scrollLeft / 180);
		if (type == 2) {
			leftValue += 180;
		} else {
			leftValue -= 180;
		}
		if (leftValue < 0) {
			return;
		}
		if (leftValue > (faceList.length - 5) * 180) {
			return;
		}
		listBoxContent.scrollLeft = leftValue;
		this.setState({
			leftValue
		});
	};
	
	render() {
		let { faceList, changeIndex, currentId } = this.props;
		return (
			<div className="residence_time_content">
		{faceList.length > 5 ? (
					<div className="list_view_left" onClick={this.handleChangeList.bind(this, 1)}>
						<IconFont type={'icon-Arrow_Big_Left_Main'} theme="outlined" />
					</div>
				) : (
					<div className="list_view_left_null" />
				)}
				<div className="residence_time" ref={this.accessListDom}>
						{faceList.length > 0 ? (
							<div className="time_content_two" style={{ width: faceList.length * 180 }}>
								{faceList.map((v, index) => (
									<div className={`box_img_box ${currentId === v.id ? 'active_index' : ''}`} key={index} onClick={() => changeIndex(index,v)}>
										<div className="box_item">
										<WaterMark
											key={v.id}
											className={'box_img'}
											background={true}
											type="face"
											src={v.facePath}
										/>
										</div>
										<div className="box_message">
											<p className="message_name" title={v.cameraName}>	<IconFont type={'icon-Add_Main2'} theme="outlined" />{v.cameraName}</p>
											<p className="meaage_time">	<IconFont type={'icon-Clock_Light'} theme="outlined" />{v.captureTime && moment(+v.captureTime).format('YYYY.MM.DD HH:mm:ss')}</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<NoDataComp title="相关数据" />
						)}
				</div>
				{faceList.length > 5 ? (
					<div className="list_view_left" onClick={this.handleChangeList.bind(this, 2)}>
						<IconFont type={'icon-Arrow_Big_Right_Main'} theme="outlined" />
					</div>
				) : (
					<div className="list_view_left_null" />
				)}
			</div>
		);
	}
}

export default ResidenceTime;
