import React from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import echarts from 'echarts';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { DatePicker } from 'antd';

import './housePower.scss';

//袁家社区专属
@BusinessProvider('CommunityDetailStore')
class HousePower extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			xList: [],
			yList: [],
      total: 0,
      modalTimeValue: new Date()
    }
	}
	
	componentDidMount() {
		this.getPower(this.state.modalTimeValue);
	}

	getOption = () => {
		let { datas } = this.props;
		let { xList, yList } = this.state;
		datas = [
			{ name: 1, personCount: 2 },
			{ name: 1, personCount: 8 },
			{ name: 1, personCount: 12 },
			{ name: 1, personCount: 2 },
			{ name: 1, personCount: 2 },
			{ name: 1, personCount: 2 },
			{ name: 1, personCount: 7 }
		];
		let LibName = xList;
		let LibNum = yList;
		datas.map((v) => {
			v.value = v.personCount;
		});
		const XMax = Math.ceil(Math.max(LibNum));
		const dataShadow = [];
		for (var i = 0; i < LibNum.length; i++) {
			dataShadow.push(XMax);
		}
		const option = {
			legend: {
				orient: 'horizontal',
				icon: 'rect',
				itemGap: 6,
				itemWidth: 20,
				itemHeight: 4,
				bottom: 10,
				textStyle: {
					color: 'red'
				}
				// y: 60,
				// x: '50%',
				// itemWidth: 10,
				// itemHeight: 10,
				// data:LibName
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '3%',
				top: 60,
				bottom: 10,
				containLabel: true
			},
			yAxis: {
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				splitLine: {
					show: false
				},
				axisLabel: {
					show: true,
					textStyle: {
						// color: '#ddd'
					}
				}
			},
			xAxis: {
				type: 'category',
				axisLabel: {
					show: true
				},
				axisTick: {
					show: false
				},
				axisLine: {
					show: false
				},
				splitLine: {
					show: false
				},
				data: LibName
			},
			series: [
				{
					// For shadow
					type: 'bar',
					stack: 'sum',
					barWidth: '10',
					barMinHeight: '',
					barGap: '80%',
					itemStyle: {
						normal: {
							shadowColor: 'rgba(112,148,255,0.5)', //默认透明
							shadowBlur: 15,
							shadowOffsetX: 0,
							shadowOffsetY: 6,
							barBorderRadius: 20,
							color: new echarts.graphic.LinearGradient(1, 0, 1, 1, [
								{ offset: 1, color: '#FF8800' },
								{ offset: 0.6, color: '#FFaa00' },
								{ offset: 0, color: '#FFeb00' }
							]),
							label: {
								show: true,
								position: 'top',
								formatter: function(params) {
									return params.value;
								}
							}
						}
					},
					data: LibNum
				}
			]
		};
		return option;
	};
  getPower = (modalTimeValue) => {
		let { CommunityDetailStore, data } = this.props;
		let { buildingNo, unitName, houseNo } = data;
		let name = `${buildingNo}-${unitName}-${houseNo}`;
		let times = moment(modalTimeValue).format('YYYY.MM.DD');
		let option = {
			name,
			times: `${times}~${times}`
		};
		CommunityDetailStore.getPower(option).then((res) => {
			try {
				let data = res.business[0].details[0];
				if (!data) {
					this.setState({
						xList: [],
						yList: [],
						total: 0
					});
					return;
				}
				let total = data.electricNum;
				let list = JSON.parse(data.electricDetail);
				let xList = Object.keys(list);
				let yList = Object.values(list);
				this.setState({
					xList,
					yList,
					total
				});
			} catch (e) {

			}
		});
	};

	timeChange = (value) => {
		this.getPower(value);
	};
  render() {
    let { data } = this.props;
    let { total } = this.state;
    return (
      <div className="house_power">
					<div className="house_power_header">
					<div className="house_power_title">
						电量信息:
					</div>
					<DatePicker
                disabledDate={current => current > moment(new Date())}
								className="power_time"
								defaultValue={moment(new Date())}
								onChange={this.timeChange}
							/>
					</div>
					<div className="power_content">
						<div className="power_box">
							<p className="power_text">{data.presentAddress && data.presentAddress}</p>
						</div>
		
						<div className="power_value">{total} &nbsp; kw/h</div>
						<ReactEcharts
							key={2}
							option={this.getOption()}
							style={{ width: '100%', height: 'calc(100% - 35px)' }}
						/>
					</div>
      </div>
    )
  }
}

export default HousePower;