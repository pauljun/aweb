import React, { Component } from 'react';
import { Button, Select, Dropdown, Icon, Menu } from 'antd';
import ReactEcharts from 'echarts-for-react';
 import util from '../../../EventControl/PhantomCurrentAlarm/components/util/util' 
class ResourceTendencyStatic extends Component {
    getOtionTem() {
        let {DataByDaysList} = this.props;
        if(!DataByDaysList){
            DataByDaysList= [];
        }

        const totalRecourcePro = DataByDaysList.map(v => v.value);
        const totalRecource=totalRecourcePro.reverse();
       
        //近一周的日期数组
        const weekDays = [util.getDay(-7),util.getDay(-6),util.getDay(-5),util.getDay(-4),util.getDay(-3),util.getDay(-2),util.getDay(-1)]
        
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                confine: true
            },
            grid:{
                x:63,
                y:10,
                x2:30,
                y2:20,
                borderWidth:0
            },
             xAxis: {
                type: 'value',
               /*  name:'千',
				nameLocation :'end', */
                boundaryGap: [0, 0.01],
                axisTick:false,
                axisLine:{
                    show:false,
                },
                axisLabel: {
                    show: true,
                    /* rotate:30, */
                    textStyle: {
                        color: '#333333'
                    }
                } ,
                splitLine:{
                    lineStyle: {
                        color: ['#D8DCE3']
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: weekDays,
                axisTick:false,
                axisLine:{
                    show:false,
                },
                axisLabel: {
                    interval:0,
                    show: true,
                    textStyle: {
                        color: '#333333'
                    }
                }
            },
            series: [
                {
                    barWidth: 4,
                    barGap: 0.8,
                    name: '每日人脸抓拍数',
                    type: 'bar',
                    label: {
                        emphasis: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                fontSize: '12',
                                color: ' #8899BB'
                            }
                        }
                    },
                    data: totalRecource,
                    itemStyle:{
                        normal:{color:' #8899BB'},
                    },
                }
            ]
        };

        return option;
    }
    render() {
        let {cardLength} = this.props
        return (
            <div className='chartAnother'>
                <ReactEcharts option={this.getOtionTem()} style={{height:'calc(100% - 32px)'}}/>
            </div>
        )
    }
}
export default ResourceTendencyStatic;