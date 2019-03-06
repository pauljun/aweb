import React from 'react';
import WaterMark from 'src/components/WaterMarkView';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { roomMateType } from '../../../../libs/Dictionary';
import { withRouter } from 'react-router-dom';

import './residencePeople.scss';

@BusinessProvider('TabStore')
@withRouter
class ResidencePeople extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	handlePageJump = (data) => {
		const { TabStore, history} = this.props;
		const moduleName = 'Detail';
		const childModuleName = 'CommunityResidenceDetail';
		const state = { data,type:false};
		TabStore.goPage({ moduleName, childModuleName, history, state });
	}
	render() {
		let { data = {} } = this.props;
		let roommateList = data.roommateList || [];
		let householder = [],
			arr = [];
		roommateList.map((v) => {
			if (v.identifyType == 114501) {
				if(householder.length == 0){
					householder.push(v);
				} else {
					arr.push(v);
				}
			}else {
				arr.push(v);
			}
		});
		if(arr.length > 6 ) {
			arr.length = 6; 
		}
		return (
			<div className="residence_people">
				<div className="people_title">人员关系：</div>
					<div className="people_content">
							<React.Fragment>
								<div className="content_box">
									<div className="content_right">
										<div className="right_1">
											{arr.map((v, index) => {
												return (
													<div className="right_boom" key={index} onClick={this.handlePageJump.bind(this, v)}>
														<div className="right_box">
															<WaterMark src={v.portraitPicUrl} type="face" />
														</div>
														<div className="center_text">
															<p className="text_name">{v.name}</p>
															<p className="text_type">{roomMateType.map((item) => {
																if(item.value == v.identifyType) {
																	return item.label
																}
															})}</p>
														</div>
													</div>
												);
											})}
										</div>
									</div>
									{householder.length > 0 && (
										<div className="content_center">
											{householder.map((v, index) => {
												return (
													<React.Fragment key={index}>
														<div className="center_box" onClick={this.handlePageJump.bind(this, v)}>
															<WaterMark src={v.portraitPicUrl} type="face" />
														</div>
														<div className="center_text">
															<p className="text_name">{v.name}</p>
															<p className="text_type">业主</p>
														</div>
													</React.Fragment>
												);
											})}
										</div>
									)}
								</div>
								<div className="content_circle">
									<div className="circle" />
								</div>
							</React.Fragment>
					</div>
			</div>
		);
	}
}

export default ResidencePeople;
