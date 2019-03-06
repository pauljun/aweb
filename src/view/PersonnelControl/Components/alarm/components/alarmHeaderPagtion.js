import React from 'react';
import { Input } from 'antd';
import InputAfter from 'src/components/InputAfter';
import { BusinessProvider } from '../../../../../utils/Decorator/BusinessProvider';
import { observer } from 'mobx-react';

import './alarmHeaderPagtion.scss';

const Search = Input.Search;

@BusinessProvider('MoniteeAlarmsStore')
@observer
class AlarmHeaderPagtion extends React.Component {
	constructor(props) {
		super(props);
	}
	alarmTime = 0;
	onChangeType = (type) => {
		let { onChange, searchData } = this.props;
		let res = searchData;
		let page = res.page;
		if (type == 1) {
			if (page > 1) {
				page = page - 1;
				onChange(page, res.pageSize);
			} else {
				return;
			}
		}
		if (type == 2) {
			page = page + 1;
			onChange(page, res.pageSize);
		}
	};
	search = (event) => {
		let value =	event.target.value;
		let { setStoreSeacrhData, onTypeChange } = this.props;
		clearTimeout(this.alarmTime);
		let option = {captureUids: value, page: 1 };
		setStoreSeacrhData(option);
		this.alarmTime = setTimeout(() => {
			onTypeChange(option);
		}, 500);
	};
	onCancel = () => {
		let option = {captureUids: '', page: 1 };
		this.props.onTypeChange(option);
	}
	render() {
		let { searchData } = this.props;
		return (
			<div className="alarm_header_pagtion">
				<InputAfter
					value={searchData.captureUids ? searchData.captureUids : ''}
					onChange={this.search.bind(this)}
					onCancel={this.onCancel.bind(this)}
					placeholder="请输入姓名或身份证号搜索"
					size='lg'
				/>
			</div>
		);
	}
}

export default AlarmHeaderPagtion;
