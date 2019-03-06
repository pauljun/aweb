import React, { Component } from 'react';
import IconFont from 'src/components/IconFont';

import './communityDetail.scss';
class CommunityDetail extends Component {
	constructor(props) {
		super(props);
	}

	thousand(num) {
		return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
	}
	
	render() {
		let { data = {}, selectId } = this.props;
		let solidCount = {
			cameraCount: 0,
			doorCount: 0,
			floatingPeople: 0,
			houseCount: 0,
			residentPeople: 0,
			tollgateCount: 0,
			villageCount: 0
		};
		if (selectId && data[selectId * 1]) {
			solidCount = data[selectId * 1];
		} else {
			Object.values(data).map((v) => {
				v.cameraCount && (solidCount.cameraCount += v.cameraCount);
				v.doorCount && (solidCount.doorCount += v.doorCount);
				v.floatingPeople && (solidCount.floatingPeople += v.floatingPeople);
				v.houseCount && (solidCount.houseCount += v.houseCount);
				v.residentPeople && (solidCount.residentPeople += v.residentPeople);
				v.tollgateCount && (solidCount.tollgateCount += v.tollgateCount);
				solidCount.villageCount += 1;
			});
		}
		return (
			<div className="community_suspension">
				{!selectId && (
					<div className="suspension_box">
						<div className="icon_box">
							<IconFont type={'icon-Dataicon__Dark1'} theme="outlined" />
						</div>
						<div className="box_type">
							<p className="box_type_p">小区数量</p>
							<span className="box_type_span font-resource-normal">
								{solidCount.villageCount ? this.thousand(solidCount.villageCount) : 0}
							</span>
						</div>
					</div>
				)}
				<div className="suspension_box">
				<div className="icon_box">
					<IconFont type={'icon-Dataicon__Dark2'} theme="outlined" />
				</div>
					<div className="box_type">
						<p className="box_type_p">常住人口</p>
						<span className="box_type_span font-resource-normal">{solidCount.residentPeople ? this.thousand(solidCount.residentPeople) : 0}</span>
					</div>
				</div>
				<div className="suspension_box">
						<div className="icon_box">
							<IconFont type={'icon-Dataicon__Dark3'} theme="outlined" />
						</div>
					<div className="box_type">
						<p className="box_type_p">流动人口</p>
						<span className="box_type_span font-resource-normal">
							{solidCount.floatingPeople ? this.thousand(solidCount.floatingPeople) : 0}
						</span>
					</div>
				</div>
				<div className="suspension_box">
						<div className="icon_box">
							<IconFont type={'icon-Dataicon__Dark4'} theme="outlined" />
						</div>
					<div className="box_type">
						<p className="box_type_p">房屋数量</p>
						<span className="box_type_span font-resource-normal">
							{solidCount.houseCount ? this.thousand(solidCount.houseCount) : 0}
						</span>
					</div>
				</div>
				<div className="suspension_box">
						<div className="icon_box">
							<IconFont type={'icon-_Camera__Main2'} theme="outlined" />
						</div>
					<div className="box_type">
						<p className="box_type_p">摄像机数量</p>
						<span className="box_type_span font-resource-normal">
							{solidCount.cameraCount ? this.thousand(solidCount.cameraCount) : 0}
						</span>
					</div>
				</div>
				<div className="suspension_box">
						<div className="icon_box">
							<IconFont type={'icon-Dataicon__Dark'} theme="outlined" />
						</div>
					<div className="box_type">
						<p className="box_type_p">道闸数量</p>
						<span className="box_type_span font-resource-normal">
							{solidCount.tollgateCount ? this.thousand(solidCount.tollgateCount) : 0}
						</span>
					</div>
				</div>
				<div className="suspension_box">
						<div className="icon_box">
							<IconFont type={'icon-Entrance_Guard'} theme="outlined" />
						</div>
					<div className="box_type">
						<p className="box_type_p">门禁数量</p>
						<span className="box_type_span font-resource-normal">
							{solidCount.doorCount ? this.thousand(solidCount.doorCount) : 0}
						</span>
					</div>
				</div>
			</div>
		);
	}
}

export default CommunityDetail;
