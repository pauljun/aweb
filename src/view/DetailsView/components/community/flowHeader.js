import React from 'react';
import IconFont from 'src/components/IconFont';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { Popover } from 'antd';
import WaterMark from 'src/components/WaterMarkView';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import focus from '../../../../assets/img/community/RealPopulation/Follow_Yes_Main.svg';
import nofocus from '../../../../assets/img/community/RealPopulation/Follow_No_Main.svg';

import './flowHeader.scss';

class FlowHeader extends React.Component {
	constructor(props) {
		super(props);
	}
	// getOtionTem = () => {
	// 	let { peopleCountList } = this.props;
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
	// 			right: 36,
	// 			bottom: 10,
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
	// 					show: true
	// 				}
	// 			}
	// 		],
	// 		xAxis: [
	// 			{
	// 				type: 'value',
	// 				minInterval: 1,
	// 				axisLine: {
	// 					show: true
	// 				},
	// 				axisTick: {
	// 					alignWithLabel: false,
	// 					show: false
	// 				}
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
		let { tipModalChange, data = {} } = this.props;
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
		return (
			<div className="community_residence_header">
				<p className="header_title">人员信息：</p>
				<div className="header_content">
					<div className="header_left">
					<div
              className={`handle-focus ${data.focusType?"attentioned":''}`}
              onClick={this.props.AttentionChange&&this.props.AttentionChange.bind(
                this,
                data.vid,
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
							src={data.picUrl}/>
					</div>
					<div className="header_right">
						<div className="right_message show">
							<div className="message_content_lately">
								<div className="text_box">
									<span className="text_value">最近出现时间：</span>
									<p className="content_text">{data.recentTime && moment(+data.recentTime).format('YYYY.MM.DD HH:mm:ss')}</p>
								</div>
								<div className="text_box">
									<span className="text_value">最近出现地点：</span>
									<p className="content_text" title={data.recentAddress}>{data.recentAddress}</p>
								</div>
								<div className="text_box">
									<span className="text_value">三天出现次数：</span>
									<p className="content_text">{data.appearNumForThreeDays || 0}</p>
								</div>
							</div>
							<div className="message_content_lately">
								<div className="text_box">
									<span className="text_value">虚拟身份号码：</span>
									<p className="content_text">{data.vid}</p>
								</div>
								<div className="text_box">
									<span className="text_value">疑似居住地：</span>
									<p className="content_text" title={data.homeAddress}>{data.homeAddress}</p>
								</div>
							</div>
							<div className="message_content_label">
								<p className="label_title">标签：</p>
								<div className="label_value_box">
								<AuthComponent actionName="UnRegisteredManagement">
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
						{/* <div className="right_chart">
							<div className="chart_title">近七天抓拍次数</div>
							<ReactEcharts option={this.getOtionTem()} style={{ height: 'calc(100% - 25px)' }} />
						</div> */}
					</div>
				</div>
			</div>
		);
	}
}

export default FlowHeader;
