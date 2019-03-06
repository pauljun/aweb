import React from 'react';
import IconFont from 'src/components/IconFont';
import moment from 'moment';
import {Popover} from 'antd'
import WaterMark from 'src/components/WaterMarkView';
import ReactEcharts from 'echarts-for-react';
import { getKeyValue, marital, sex, nation } from '../../../../libs/Dictionary';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import focus from '../../../../assets/img/community/RealPopulation/Follow_Yes_Main.svg';
import nofocus from '../../../../assets/img/community/RealPopulation/Follow_No_Main.svg';
import './residenceHeader.scss';

class ResidenceHeader extends React.Component {
	constructor(props) {
		super(props);
	}
	// getOtionTem = () => {
	// 	let { peopleCountList = [] } = this.props;
	// 	let yAxisList = [],
	// 		xAxisList = [];
	// 	if (peopleCountList.length > 0) {
	// 		peopleCountList.map((v) => {
	// 			xAxisList.unshift(v.value);
	// 			yAxisList.unshift(v.key.slice(5, 10));
	// 		});
	// 	}
	// 	const option = {
	// 		color: [ '#3398DB' ],
	// 		tooltip: {
	// 			trigger: 'axis',
	// 			axisPointer: {
	// 				type: 'shadow'
	// 			}
	// 		},
	// 		grid: {
	// 			left: 0,
	// 			top: 10,
	// 			right: 20,
	// 			bottom: 20,
	// 			containLabel: true
	// 		},
	// 		yAxis: [
	// 			{
	// 				type: 'category',
	// 				data: yAxisList,
	// 				axisTick: {
	// 					alignWithLabel: true,
	// 					show: false
	// 				},
	// 				axisLine: {
	// 					show: true,
	// 					lineStyle: {
	// 						color: '#ccc'
	// 					}
	// 					// symbol: ['none', 'arrow']
	// 				}
	// 			}
	// 		],
	// 		xAxis: [
	// 			{
	// 				type: 'value',
	// 				minInterval: 1,
	// 				axisLine: {
	// 					show: true,
	// 					lineStyle: {
	// 						color: '#ccc'
	// 					}
	// 					// symbol: ['none', 'arrow']
	// 				},
	// 				axisTick: {
	// 					alignWithLabel: false,
	// 					show: false
	// 				},
	// 				splitLine: {
	// 					show: false
	// 				},
	// 			}
	// 		],
	// 		series: [
	// 			{
	// 				name: '抓拍数量',
	// 				color: '#8899BB',
	// 				type: 'bar',
	// 				barWidth: '30%',
	// 				label: {
	// 					normal: {
	// 						show: false,
	// 						// position: 'right'
	// 					}
	// 				},
	// 				data: xAxisList
	// 			}
	// 		]
	// 	};
	// 	return option;
	// };
	render() {
		let { tipModalChange, data = {},showMap } = this.props;
		let item = [],
			itemT = [];
		data.tagList &&
			data.tagList.map((v) => {
				if (v.tagCode == 0 && v.tagName) {
					if (v.tagName.indexOf(';') > 0 || v.tagName.indexOf('；') > 0) {
						let arr = v.tagName.replace(/;/gi, '；').split('；');
						itemT = itemT.concat(arr);
					} else {
						itemT.push(v.tagName);
					}
				} else if(v.tagType !== 118500){
					item.push(v.tagName);
				}
			});
		let tagList = item.concat(itemT).filter((v) => v !== '') || [];
		let imgUrl=data.portraitPicUrl?data.portraitPicUrl:
		(data.picUrl&&data.picUrl.length>0?data.picUrl[0]:null)
		return (
			<div className="community_residence_header">
				<p className="header_title">人员信息：</p>
				<div className="header_content">
					<div className="header_left">
					<div
              className={`handle-focus ${data.focusType?"attentioned":''}`}
              onClick={this.props.AttentionChange&&this.props.AttentionChange.bind(
                this,
                data.id,
                data.focusType==1
              )}
            >
              <Popover
                overlayClassName={'attention_poppver'}
                placement="right"
                content={data.focusType ? '取消关注' : '添加关注'}
              >
                {data.focusType ? <img src={focus} /> : <img src={nofocus} />}
              </Popover>
            </div>
					<WaterMark 	className={'left_img'}
							background={true}
							type='face'
							src={imgUrl}/>
					</div>
					<div className="header_right">
						<div className={`right_message show`}>
							<p className="message_name">{data.name}</p>
							<div className="message_content">
								<div className="text_box">
									<span className="text_value">手机号码：</span>
									<p className="content_text">{data.mobile}</p>
								</div>
								<div className="text_box">
									<span className="text_value">婚姻状况：</span>
									<p className="content_text">{data.maritalStatus && getKeyValue(marital, data.maritalStatus)}</p>
								</div>
								<div className="text_box content_nation">
									<span className="text_value">性别:</span>
									<p className="content_text ">{data.gender && getKeyValue(sex, data.gender)}</p>
								</div>
								<div className="text_box content_nation">
									<span className="text_value">民族：</span>
									<p className="content_text ">{data.nation && getKeyValue(nation, data.nation)}</p>
								</div>
								<div className="text_box">
									<span className="text_value">出生日期：</span>
									<p className="content_text">{data.birthDate && moment(+data.birthDate).format('YYYY.MM.DD')}</p>
								</div>
								<div className="text_box content_adress">
									<span className="text_value">住址：</span>
									<p className="content_text" title={data.presentAddress}>
										{data.presentAddress}
									</p>
								</div>
								<div className="text_box">
									<span className="text_value">身份证号：</span>
									<p className="content_text">{data.credentialNo}</p>
								</div>
							</div>
							<div className="message_content_lately">
								<div className="text_box">
									<span className="text_value">最近出现时间：</span>
									<p className="content_text">{data.recentTime && moment(+data.recentTime).format('YYYY.MM.DD HH:mm:ss')}</p>
								</div>
								<div className="text_box">
									<span className="text_value">最近出现地点：</span>
									<p className="content_text" title={data.recentAddress}>
										{data.recentAddress}
									</p>
								</div>
								{showMap&&<div className="text_box">
									<span className="text_value">三天出现次数：</span>
									<p className="content_text">{data.appearTimesForThreeDays || 0}</p>
								</div>}
							</div>
							<div className="message_content_label">
								<p className="label_title">标签：</p>
								<div className="label_value_box">
								<AuthComponent actionName="RegisteredManagement">
										<span className="label_add" onClick={tipModalChange}>
											<IconFont type={'icon-Zoom__Light'} theme="outlined" />
										</span>
									</AuthComponent>
									{tagList &&
										tagList.map((v, index) => {
											return (
												<span className="label_value" key={index}>
													{v}
												</span>
											);
										})}
								
								</div>
							</div>
						</div>
						{/* {showMap&&<div className="right_chart">
							<div className="chart_title">近七天抓拍次数</div>
							<ReactEcharts option={this.getOtionTem()} style={{ height: 'calc(100% - 25px)' }} />
						</div>} */}
					</div>
				</div>
			</div>
		);
	}
}

export default ResidenceHeader;
