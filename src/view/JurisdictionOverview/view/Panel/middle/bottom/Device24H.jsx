import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

class Device24H extends Component {
    getOtionTem() {
        let { deviceStateStatis } = this.props;
        if (!deviceStateStatis) {
            deviceStateStatis = [];
        }
        //最近24小时的数组
        let hours24 = []
        // let allDevice=[]
        let putongData=[]
        let qiujiData=[]
        let zhuapaijiData=[]
        let qitaData=[]
        deviceStateStatis.map( v => {
            for (const i in v) {
                if (v.hasOwnProperty(i)) {
                    let item = v[i]
                    hours24.push(i)
                    // allDevice.push(item.total)
                    putongData.push(item[100604])
                    qiujiData.push(item[100602])
                    zhuapaijiData.push(item[100603])
                    if (item[100605]){
                        qitaData.push(item[103406] +item[100605] ) 
                    }else{
                        qitaData.push(item[103406]) 
                    }
                }
            }
        })
        //数据量过大时，防止纵坐标文本显示越界
        let chartLeft = 50;
        let dataSet = [...putongData, ...qiujiData, ...zhuapaijiData, ...qitaData];
        if(dataSet.length > 0){
          let maxData = Math.max(...dataSet);
          if(maxData.toString().length > 5){
            chartLeft += (maxData.toString().length - 5) * 10;
          }
        }
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle:{
                        color:'rgba(4,15,29,0.50)'
                    }
                },
                confine:true,
                backgroundColor:'#211741'
            },
            grid: {
                left: chartLeft,
                right: 20,
                bottom: 55,
                top:20,
            },
            legend: {
                y:'bottom',
                icon:'rect',
                itemGap:23,
                itemWidth:26,
                itemHeight:2,
                data: [
                //     {
                //     name: '设备总数',
                //     textStyle: { color: "#FF5580 " },
                // },
                {
                    name: '智能枪机',
                    textStyle: { color: "#F34B73 " },
                },{
                    name: '球机',
                    textStyle: { color: "#50D6BD " },
                },{
                    name: '抓拍机',
                    textStyle: { color: "#FFAF5D" },
                },{
                    name: '其他',
                    textStyle: { color: "#5990D6 " },
                }],
            },
            yAxis: {
                type: 'value',
                axisTick:false,
                axisLine:{
                    show:false,
                },
                axisLabel:{
                    color:'#A8E2FF',
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
                boundaryGap: [0, 0.01],
            },
            xAxis: {
                type: 'category',
                data: hours24,
                axisTick:false,
                axisLine:{
                    show:false,
                },
                axisLabel: {
                    interval:1,
                    rotate:50,
                    show: true,
                    textStyle: {
                        color: '#A8E2FF'
                    }
                }
            },
            series: [
                // {
                //     barWidth: 2,
                //     barGap: 1,
                //     name: '设备总数',
                //     type: 'bar',
                //     data: allDevice,
                //     itemStyle:{
                //         normal:{color:'#FF5580 '},
                //     },
                // },
                {
                    barWidth: 2,
                    barGap: 1,
                    name: '智能枪机',
                    type: 'bar',
                    data: putongData,
                    itemStyle:{
                        normal:{color:'#F34B73'},
                    },
                },{
                    barWidth: 2,
                    barGap: 1,
                    name: '球机',
                    type: 'bar',
                    data:qiujiData,
                    itemStyle:{
                        normal:{color:'#50D6BD '},
                    },
                },{
                    barWidth: 2,
                    barGap: 1,
                    name: '抓拍机',
                    type: 'bar',
                    data: zhuapaijiData,
                    itemStyle:{
                        normal:{color:'#FFAF5D'},
                    },
                },{
                    barWidth: 2,
                    barGap: 1,
                    name: '其他',
                    type: 'bar',
                    data: qitaData,
                    itemStyle:{
                        normal:{color:'#5990D6 '},
                    },
                },
            ]
        };

                            
        return option;
      }
    render () {
        return (
            <div className='chart'>
            <ReactEcharts option={this.getOtionTem()} style={{width:'100%',height:'165px'}}/>
            </div>
        )
    }
}
export default Device24H;