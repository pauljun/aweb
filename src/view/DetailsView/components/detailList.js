import React from 'react';
import ListCard from './listCard';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import IconFont from 'src/components/IconFont';
import './detailList.scss';

@BusinessProvider('UserStore')
class DetailList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			leftValue: 0,
			key: Math.random()
		};
		this.alarmListDom = React.createRef();
	}

	handleChangeList = (type) => {
		let { data = [] } = this.props;
		let listBoxContent = this.alarmListDom.current;
		let leftValue = 154 * Math.floor(listBoxContent.scrollLeft / 154);
		if (type == 2) {
			leftValue += 154;
		} else {
			leftValue -= 154;
		}
		if (leftValue < 0) {
			return;
		}
		if (leftValue > (data.length - 6) * 154) {
			return;
		}
		listBoxContent.scrollLeft = leftValue;
		this.setState({
			leftValue
		});
	};

	render() {
		let { data, handleChangeList, id, checkBoxChange, libType, checkShow, UserStore = {} } = this.props;
		data = data || [];
		return (
			<div className="detail_list_view">
				{data.length > 6 ? (
					<div className="list_view_left" onClick={this.handleChangeList.bind(this, 1)}>
						<IconFont type={'icon-Arrow_Big_Left_Main'} theme="outlined" />
					</div>
				) : (
					<div className="list_view_left_null" />
				)}
				<div className="list_view_content" ref={this.alarmListDom}>
					<div className="list_box" style={{ width: data.length * 154 - 8 }}>
						{data.map((v, index) => {
							return (
								<ListCard
									libType={libType}
									username={UserStore.userInfo && UserStore.userInfo.realName}
									checkShow={checkShow}
									isActive={v.id == id}
									checkBoxChange={checkBoxChange && checkBoxChange}
									handleChangeList={handleChangeList && handleChangeList}
									key={v.id}
									data={v}
								/>
							);
						})}
					</div>
				</div>
				{data.length > 6 ? (
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

export default DetailList;
