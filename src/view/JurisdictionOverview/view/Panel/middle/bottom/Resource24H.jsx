import React, { Component } from 'react';
import { Button, Select, Dropdown, Icon, Menu } from 'antd';
import ReactEcharts from 'echarts-for-react';
import { observer, inject } from 'mobx-react';
import util from '../util/util'
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider'
import { errorBoundary } from 'src/utils/Decorator';

@errorBoundary
@BusinessProvider('JurisdictionOverviewStore')
@observer
class Resource24H extends Component { 
    state = {
        dayResouecesStatis : []
    }
    
    componentWillMount() {
        this.props.JurisdictionOverviewStore.getDayResouecesStatis({timestamp:new Date().getTime()}).then(res => {
            this.setState({dayResouecesStatis : res.result || []}) 
        });
        
    }
    getOtionTem() {
        let { dayResouecesStatis } = this.state;
        //最近24小时的数组
        let hours24 = []
        for (var i = 0; i < 24; i++) {
            hours24[i] = util.get24H(i-23);
        }
        const vehicleNumRecource= dayResouecesStatis.map((v) => v.vehicleNum);
        const bodyNumRecource = dayResouecesStatis.map(v => v.bodyNum);
        const faceNumRecource = dayResouecesStatis.map(v => v.faceNum);
        //数据量过大时，防止纵坐标文本显示越界
        let chartLeft = 50;
        let dataSet = [ ...bodyNumRecource, ...faceNumRecource,...vehicleNumRecource];
        if(dataSet.length > 0){
          let maxData = Math.max(...dataSet);
          if(maxData.toString().length > 5){
            chartLeft += (maxData.toString().length - 5) * 10;
          }
        }
        const option = {
            color:['#6B72C0','#6B72C0','#FFAA00'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle:{
                        color:'rgba(255,136,0,0.20)'
                    }
                },
                confine:true
            },
            legend: {
                icon:'rect',
                y:'bottom',
                itemGap:6,
                itemWidth:26,
                itemHeight:2,
                data: [{
                    name: '人脸数',
                    textStyle: { color: "#666" }
                },
                {
                    name: '人体数',
                    textStyle: { color: "#666 " }
                },
                {
                    name: '车辆数',
                    textStyle: { color: "#666" }
                }],
            },
            grid: {
                left: chartLeft,
                right: 20,
                bottom: 45,
                top:20,
            },
            xAxis: {
                type: 'category',
                splitNumber :24,
                boundaryGap: false,
                axisTick:false,
                splitLine:{
                  show:true,
                  lineStyle:{
                      color:'rgba(108,104,163,0.30)',
                  }
                },
                axisLabel:{
                    color:'#666',
                    fontSize:12,
                    fontFamily:'Microsoft YaHei',
                },
                axisLine:{
                    show:false,
                },
                data: hours24
            },
            yAxis: {
                type: 'value',
                axisTick:false,
                axisLine:{
                    show:false,
                },
                axisLabel:{
                    color:'#666',
                    fontSize:12,
                    fontFamily:'Microsoft YaHei',
                },
                splitLine:{
                  show:false  
                },
                splitArea:{
                    show:true,
                    areaStyle:{
                        color: ['rgba(108,104,163,0.08)','rgba(0,0,0,0)']
                    }
                },
            },
            series: [
                {
                    name:'人脸数',
                    type:'line',
                    lineStyle:{
                        color:'#6B72C0',
                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                        shadowBlur: 4,
                        shadowOffsetY:10,
                    },
                    data:faceNumRecource
                },
                {
                    name:'人体数',
                    type:'line',
                    lineStyle:{
                        color:'#8899BB',
                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                        shadowBlur: 4,
                        shadowOffsetY:10,
                    },
                    data:bodyNumRecource
                },
                {
                    name:'车辆数',
                    type:'line',
                    lineStyle:{
                        color:'#FFAA00',
                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                        shadowBlur: 4,
                        shadowOffsetY:10,
                    },
                    data:vehicleNumRecource
                }
            ]
        };

        return option;
    }
    render() {
        return (
            <div className='chart'>
                <ReactEcharts option={this.getOtionTem()} style={{width:'100%',height:'165px'}}/>
            </div>
        )
    }
}
export default Resource24H;