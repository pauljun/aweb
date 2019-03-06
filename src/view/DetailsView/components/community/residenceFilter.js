import React from 'react';
import { Radio } from 'antd';
import RangePicker from 'src/components/RangePicker';
import moment from 'moment';

import './residenceFilter.scss';

class ResidenceFilter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dateBegin: null,
			dateEnd: moment().valueOf(),
			showDate: false,
			maxDate: moment(new Date()).valueOf(),
			minDate: moment(new Date()).valueOf() - 2592000000
		};
	}
	chooseTime = (e) => {
		let { onTypeChange, changeSearchData } = this.props;
		let value = e.target.value;
		let option = {};
		if (value != -1) {
			this.setState({
				showDate: false,
				dateBegin: null,
				dateEnd: null
			});
			option.timeType = value;
			onTypeChange(option);
		} else {
			changeSearchData({ timeType: -1 });
			this.setState({
				showDate: true
			});
		}
	};
	timeChange = (type, value) => {
		console.log(value);
		let { searchData, onTypeChange } = this.props;
		let { dateBegin } = this.state;
		let startTime = dateBegin, endTime = undefined;
		if (type === 'startTime') {
			startTime = moment(moment(value).format('YYYY-MM-DD')).valueOf();
			this.setState({ dateBegin: startTime});
		} else {
			endTime = moment(moment(value).format('YYYY-MM-DD')).valueOf() + 86400000;
			this.setState({ dateEnd: endTime });
		}
		if (type === 'startTime' && endTime === undefined) {
			endTime = moment(new Date()).valueOf();
		}
		let option = searchData;
		option.timeType = -1;
		option.endTime = endTime;
		option.startTime = startTime;
		onTypeChange && onTypeChange(option);
	};
	render() {
		let { showDate, dateBegin, dateEnd } = this.state;
		let { searchData = {} } = this.props;
		return (
			<div className={`residence_filter ${showDate && 'residence_filter_active'}`}>
				<Radio.Group
					className="header_filter_radio"
					defaultValue={'null'}
					value={searchData && searchData.timeType && searchData.timeType}
					buttonStyle="solid"
					onChange={this.chooseTime.bind(this)}
				>
					{/* <Radio value={0}>不限</Radio> */}
					<Radio value={1}>24小时</Radio>
					<Radio value={2}>3天</Radio>
					<Radio value={3}>一周</Radio>
					<Radio value={-1}>自定义</Radio>
				</Radio.Group>
				<RangePicker
					className={`residence_filter_range ${showDate && 'residence_filter_range_active'}`}
					dateFormat={'YYYY.MM.DD'}
					dropdownClassName='residence_filter_range_down'
					mode={'date'}
					allowClear={false}
					onChange={this.timeChange}
					startTime={dateBegin}
					endTime={dateEnd}
					maxDate={true}
					minDate={-30}
				/>
			</div>
		);
	}
}

export default ResidenceFilter;
