import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import ReactEcharts from 'echarts-for-react';
import { getKeyLable } from 'src/libs/Dictionary'
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { errorBoundary } from 'src/utils/Decorator';

@errorBoundary
@BusinessProvider('JurisdictionOverviewStore')
@observer
class PlaceAlarmNumb extends Component {
    state={
        EAPStatisData:[]
    }
    componentDidMount(){
        this.props.JurisdictionOverviewStore.getEffectiveAlarmPlaceStatistics({
            logTypes: ['1','2','4','5']
        }).then((res) => {
            this.setState({EAPStatisData:res.result || []})
            })
    }
    getOtionTem =() => {
        let {EAPStatisData} = this.state;
        let EAPStatis=EAPStatisData
        let codeSource = [], dataSource = []
        if(EAPStatis){
            let arr = Object.keys(EAPStatis)
                .map(d => { return {code:d,total:EAPStatis[d]}})
                .sort((a,b) => b.total-a.total)
                .slice(0,5)
            arr.map(v => {
                codeSource.push(getKeyLable('geoAddress', v.code).label)
                dataSource.push(v.total)
                return v
            })
        }
		let maxNum=Math.max(...dataSource)
        const option = {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
				confine:true,
                // 坐标轴指示器，坐标轴触发有效
                axisPointer : {   
                    // 默认为直线，可选为：'line'  | 'shadow'         
                    type : 'shadow'        
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top:'20',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data: codeSource,
                    axisTick:false,
                    axisLine:{
                        show:false,
                    },
                    axisLabel:{
                        show: true,
                        textStyle:{
                            color: '#666',
                            fontSize: '12',
                            width: 50
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    minInterval: 1,
                    position:'right',
                    axisTick: {
                        show:false,
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
                    } ,
                    splitLine:{
                        lineStyle: {
                            color: ['rgba(108,104,163,0.30)']
                        }
                    }
                }
            ],
            series : [
                {
                    type: 'pictorialBar',
                    barWidth: '60%',
                    symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
                    label: {
                        emphasis: {
                            // backgroundColor:'#f03b56',
                            // width:'50px',
                            // height:'50px',
                            // padding:[4,6],
                            // borderRadius:4,
                            show: true,
                            position: 'top',
                            textStyle: {
                                fontSize: '14',
                                color: '#FF5C3C'
                            }
                        }
                    },
                    data: dataSource,
                    itemStyle: {
                        normal: {
                            color:{
                                type: 'linear',
                                x: 0,y: 0,x2: 0,y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#8D96A9 ' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#9FA8B8 ' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        },
                        emphasis: {
                            color:{
                                type: 'linear',
                                x: 0,y: 0,x2: 0,y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#FFAA00  ' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#FF8800 ' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        },
                    },
                }
            ]
        };
                 
        return option;
      }
    render () {
        return (
            <ReactEcharts 
                key={Math.random()} 
                option={this.getOtionTem()} 
                style={{height:'calc(100% - 32px)'}}
            />
        )
    }
}
export default PlaceAlarmNumb;