import React from 'react';
import { observer } from 'mobx-react';
import { Modal, Checkbox, Row, Col, Input,message } from 'antd';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { withRouter } from 'react-router-dom';
import Loading from 'src/components/Loading';
import ResidenceHeader from '../../components/community/residenceHeader';
import AccessRecord from '../../components/community/accessRecord';
import ResidenceTrajectory from '../../components/community/residenceTrajectory';
import ResidencePeople from '../../components/community/residencePeople';
import HousePower from '../../components/community/housePower';

import './index.scss';

const CheckboxGroup = Checkbox.Group;

@withRouter
@BusinessProvider('TabStore', 'CommunityDetailStore', 'UserStore','CommunityEntryStore')
@observer
class CommunityResidenceDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			details: {},
			tipVisible: false,
			peopleInputValue: '',
			behaviorInputValue: '',
			personnelList: [],
			behaviorList: [],
			key: Math.random(),
			peopleCountList: [], // 近7天抓拍次数  人员唯独
			showMap:false
		};
		let { history } = this.props;
		let data = {};
		try {
			data = history.location.state.pageState.data;
			this.init(data);
			// this.getPeopleCount(data.id);
		} catch (e) {
			data = {};
		}
	}

	init = (data) => {
		let { CommunityDetailStore} = this.props;
		this.getPeopleDetail(data).then(res => {
			CommunityDetailStore.getPeopleRecentInfo({id: res.id}).then(item => {
				try {
					Object.assign(res, item);
				} catch (e) {

				}
				this.setState({
					details: res
				})
			})
		})
	}

	//获取人员详情
	getPeopleDetail = (data) => {
		let { CommunityDetailStore} = this.props;
		return CommunityDetailStore.getPeopleBasicInfo(data).then((res) => {
			if (res && res.tagList && res.tagList.length > 0) {
				let personnelList = [],
					behaviorList = [],
					peopleInputValue,
					behaviorInputValue;
				res.tagList.map((v) => {
					if (v.tagType == 118600) {
						if (!v.isisDeleted && v.tagCode == 0) {
							peopleInputValue = v.tagName;
						}
						if (!v.isisDeleted) {
							personnelList.push(v.tagCode);
						}
					}
					if (v.tagType == 118700) {
						if (!v.isisDeleted && v.tagCode == 0) {
							behaviorInputValue = v.tagName;
						}
						if (!v.isisDeleted) {
							behaviorList.push(v.tagCode);
						}
					}
				});
				this.setState({
					personnelList,
					behaviorList,
					peopleInputValue,
					behaviorInputValue
				});
			}
			this.setState({
				details: res
			});
			return res
		});
	};

	// 获取近七天抓拍次数
	getPeopleCount = (id) => {
		let { CommunityDetailStore } = this.props;
		let optinos = { days: 7, peopleId: id };
		CommunityDetailStore.getCountPeople(optinos).then((res) => {
			this.setState({
				peopleCountList: res
			});
		});
	};

	tipModalChange = () => {
		this.setState({
			tipVisible: true
		});
	};
	tipHandleOk = () => {
		let { CommunityDetailStore } = this.props;
		let { details, personnelList, behaviorList, peopleInputValue, behaviorInputValue } = this.state;
		let options = {
			details,
			peopleTags: [
				{ tagType: 118600, tagCode: 118601, tagName: '外卖', isDeleted: true },
				{ tagType: 118600, tagCode: 118602, tagName: '空巢老人', isDeleted: true },
				{ tagType: 118600, tagCode: 118603, tagName: '工作人员', isDeleted: true },
				{ tagType: 118600, tagCode: 118604, tagName: '快递', isDeleted: true },
				{ tagType: 118600, tagCode: 0, tagName: '', isDeleted: true },
				{ tagType: 118700, tagCode: 118701, tagName: '昼伏夜出', isDeleted: true },
				{ tagType: 118700, tagCode: 118702, tagName: '早出晚归', isDeleted: true },
				{ tagType: 118700, tagCode: 118703, tagName: '足不出户', isDeleted: true },
				{ tagType: 118700, tagCode: 0, tagName: '', isDeleted: true }
			]
		};
		options.peopleTags.map((v) => {
			if (v.tagType == 118600) {
				for (let i = 0; i < personnelList.length; i++) {
					if (v.tagCode == personnelList[i]) {
						v.isDeleted = false;
						if (personnelList[i] == 0) {
							if (peopleInputValue) {
								v.tagName = peopleInputValue;
							} else {
								v.isDeleted = true;
								personnelList.splice(i, 1);
							}
						}
					}
				}
			}
			if (v.tagType == 118700) {
				for (let i = 0; i < behaviorList.length; i++) {
					if (v.tagCode == behaviorList[i]) {
						v.isDeleted = false;
						if (behaviorList[i] == 0) {
							if (behaviorInputValue) {
								v.tagName = behaviorInputValue;
							} else {
								v.isDeleted = true;
								behaviorList.splice(i, 1);
							}
						}
					}
				}
			}
		});
		options.type = 'residence';
		CommunityDetailStore.updatePeopleTags(options).then(() => {
			let arr = [];
			options.peopleTags.map((v) => {
				if (!v.isDeleted) {
					arr.push(v);
				}
			});
			details.tagList = arr;
			this.setState({
				personnelList,
				behaviorList,
				details
			});
			this.tipHandleCancel();
		});
	};
	tipHandleCancel = () => {
		this.setState(
			{
				tipVisible: false
			},
			() => setTimeout(() => this.setState({ key: Math.random() }), 500)
		);
	};
	onPersonnelChange = (checkedValues) => {
		this.setState({
			personnelList: checkedValues
		});
	};
	onBehaviorChange = (checkedValues) => {
		this.setState({
			behaviorList: checkedValues
		});
	};

	inputChange = (type, e) => {
		if (type) {
			this.setState({
				behaviorInputValue: e.target.value
			});
		} else {
			this.setState({
				peopleInputValue: e.target.value
			});
		}
	};
	AttentionChange = (id,type) => {
		let {details}=this.state;
		this.props.CommunityEntryStore.UpdatePeopleFocusById({peopleId:id,isDeleted:type}).then(() => {
			let newDetail=Object.assign({},details,{focusType:details.focusType?0:1})
			this.setState({
				details:newDetail
			})
			message.info('修改关注状态成功');
		 })
	}
	render() {
		if(!this.state.details.id) {
			return <Loading/>
		}
		let {
			details,
			tipVisible,
			personnelList,
			behaviorList,
			peopleInputValue,
			behaviorInputValue,
			peopleCountList,
			key,
		} = this.state;
		let { UserStore,history } = this.props;
		let showType;
		try {
			showType = history.location.state.pageState.type;
		} catch (e) {
			showType = null;
		}
		let realName = UserStore.userInfo && UserStore.userInfo.realName;
		return (
			<div className="community_residence">
				<ResidenceHeader
					showMap={showType}
					AttentionChange={this.AttentionChange}
					realName={realName}
					data={details}
					peopleCountList={peopleCountList}
					tipModalChange={this.tipModalChange.bind(this)}
				/>
				 {showType && <ResidenceTrajectory data={details} />}
				<AccessRecord data={details} key={details.id} />
				{ details.roommateList.length > 0 && <ResidencePeople data={details} realName={realName} /> }
				{ details.villageCode === "420102005007001" && <HousePower data={details} /> }
				<Modal
					centered
					wrapClassName={'residence_detail_modal'}
					width={600}
					key={key}
					title="标签"
					visible={tipVisible}
					onOk={this.tipHandleOk.bind(this)}
					onCancel={this.tipHandleCancel.bind(this)}
				>
					<div className="residence_detail_modal_content">
						<div className="modal_radio">
							<div className="radio_label">人员属性：</div>
							<CheckboxGroup value={personnelList} onChange={this.onPersonnelChange.bind(this)}>
								<Row>
									<Col span={6}>
										<Checkbox value={118601}>外卖</Checkbox>
									</Col>
									<Col span={6}>
										<Checkbox value={118602}>空巢老人</Checkbox>
									</Col>
									<Col span={6}>
										<Checkbox value={118603}>工作人员</Checkbox>
									</Col>
									<Col span={6}>
										<Checkbox value={118604}>快递</Checkbox>
									</Col>
									<Col span={6}>
										<Checkbox value={0}>自定义</Checkbox>
									</Col>
									<Col span={22} offset={1}>
										{personnelList.filter((v) => v === 0).length > 0 && (
											<Input
												value={peopleInputValue}
												onChange={this.inputChange.bind(this, 0)}
												placeholder="请输入人员属性标签，多个标签以“；”分隔"
											/>
										)}
									</Col>
								</Row>
							</CheckboxGroup>
						</div>
						<div className="modal_radio">
							<div className="radio_label">行为属性：</div>
							<CheckboxGroup value={behaviorList} onChange={this.onBehaviorChange.bind(this)}>
								<Row>
									<Col span={6}>
										<Checkbox value={118701}>昼伏夜出</Checkbox>
									</Col>
									<Col span={6}>
										<Checkbox value={118702}>早出晚归</Checkbox>
									</Col>
									<Col span={12}>
										<Checkbox value={118703}>足不出户</Checkbox>
									</Col>
									<Col span={6}>
										<Checkbox value={0}>自定义</Checkbox>
									</Col>
									<Col span={22} offset={1}>
										{behaviorList.filter((v) => v === 0).length > 0 && (
											<Input
												value={behaviorInputValue}
												onChange={this.inputChange.bind(this, 1)}
												placeholder="请输入行为属性标签，多个标签以“；”分隔"
											/>
										)}
									</Col>
								</Row>
							</CheckboxGroup>
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}

export default CommunityResidenceDetail;
