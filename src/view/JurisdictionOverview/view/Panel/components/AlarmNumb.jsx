import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { observer} from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import util from '../middle/util/util';
import { errorBoundary } from 'src/utils/Decorator';

@errorBoundary
@BusinessProvider('JurisdictionOverviewStore')
@observer
class AlarmNumb extends Component {
	state = {
		AlarmByDayStatis: []
	};
	componentWillMount() {
		const beginDay = util.getDayYMD(-6);
		const endDay = util.getDayYMD(0);
		this.props.JurisdictionOverviewStore.getAlarmStatisticsByDay({ beginDay, endDay, logTypes:["1","2","5"] }).then((res) => {
			this.setState({ AlarmByDayStatis: res.result || []});
		});
	}

	getOtionTem = () => {
		let { AlarmByDayStatis } = this.state;
		const weekFDays = [
			util.getDayYMD(-7),
			util.getDayYMD(-6),
			util.getDayYMD(-5),
			util.getDayYMD(-4),
			util.getDayYMD(-3),
			util.getDayYMD(-2),
			util.getDayYMD(-1)
		];
		const newData = weekFDays.map((a) => {
			for (let i = 0; i < AlarmByDayStatis.length; i++) {
				if (AlarmByDayStatis[i].daydex === a) {
					return AlarmByDayStatis[i];
				}
			}
			return { totalNum: 0, effectiveNum: 0, noHandledNum: 0, unEffectiveNum: 0, daydex: a };
		});
		let noHandleRecource = newData.map((v) => v.noHandledNum);
		let effectiveRecource = newData.map((v) => v.effectiveNum);
		let unEffectiveRecource = newData.map((v) => v.unEffectiveNum);
		let maxNum=Math.max(...noHandleRecource,...effectiveRecource,...unEffectiveRecource)
		let base=maxNum>10000?10000:(maxNum>1000?1000:1)
 		let qu=maxNum>10000?'万':(maxNum>1000?'千':'')
		noHandleRecource=noHandleRecource.map(v => v/base)
		effectiveRecource=effectiveRecource.map(v => v/base)
		unEffectiveRecource=unEffectiveRecource.map(v => v/base)
		
		//近一周的日期数组
		const weekDays = [
			util.getDay(-7),
			util.getDay(-6),
			util.getDay(-5),
			util.getDay(-4),
			util.getDay(-3),
			util.getDay(-2),
			util.getDay(-1)
		];
		const option = {
			tooltip: {
				trigger: 'axis',
				confine:true,
				// 坐标轴指示器，坐标轴触发有效
				axisPointer: {
					// 默认为直线，可选为：'line' | 'shadow'
					type: 'shadow'
				}
			},
			legend: {
				// y:'bottom',
				orient: 'horizontal',
				icon: 'rect',
				itemGap: 6,
				itemWidth: 20,
				itemHeight: 8,
				bottom: 10,
				data: [
					{
						name: '未处理警情',
						textStyle: { color: '#666' }
					},
					{
						name: '有效警情',
						textStyle: { color: '#666 ' }
					},
					{
						name: '无效警情',
						textStyle: { color: '#666' }
					}
				]
			},
			grid: {
				x: 30,
				y: 10,
				x2: 50,
				y2: 60,
				borderWidth: 0
			},
			// grid: {
			//     left: '3%',
			//     right: '4%',
			//     bottom: '3%',
			//     containLabel: true
			// },
			xAxis: {
				type: 'value',
				minInterval: base<1000?1:'',
				name:qu,
				nameLocation :'end',
				inverse: true,
				axisTick: {
					show: false
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: [ 'rgba(108,104,163,0.30)' ]
					}
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: '#666'
					}
				},
				splitLine: {
					lineStyle: {
						color: [ 'rgba(108,104,163,0.30)' ]
					}
				}
			},
			yAxis: {
				type: 'category',
				data: weekDays,
				axisTick: {
					show: false
				},
				axisLine: {
					show: false
				},
				position: 'right',
				axisLabel: {
					show: true,
					textStyle: {
						color: '#666'
					}
				}
			},
			series: [
				{
					barWidth: 12,
					name: '未处理警情',
					type: 'bar',
					stack: '总量',
					label: {
						emphasis: {
							show: true,
							position: 'inside',
							textStyle: {
								fontSize: '12',
								color: '#FFF'
							}
						}
					},
					itemStyle: {
						normal: { color: '#5A60A2' }
					},
					data: noHandleRecource
				},
				{
					name: '有效警情',
					type: 'bar',
					stack: '总量',
					label: {
						emphasis: {
							show: true,
							position: 'bottom',
							textStyle: {
								fontSize: '12',
								color: '#5990D6 '
							}
						}
					},
					itemStyle: {
						normal: { color: '#8899BB ' }
					},
					data: effectiveRecource
				},
				{
					name: '无效警情',
					type: 'bar',
					stack: '总量',
					label: {
						emphasis: {
							show: true,
							position: 'top',
							textStyle: {
								fontSize: '12',
								color: '#50D6BD'
							}
						}
					},
					itemStyle: {
						normal: { color: '#FFAA00' }
					},
					data: unEffectiveRecource
				}
			]
		};

		return option;
	}
	render() {
		return <ReactEcharts option={this.getOtionTem()} style={{ height: 'calc(100% - 32px)' }} />;
	}
}
export default AlarmNumb;
