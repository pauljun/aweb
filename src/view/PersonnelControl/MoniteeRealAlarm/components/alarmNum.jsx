import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
class AlarmNum extends Component {
  constructor() {
    super();
  /*   this.state = {
      nowTime: moment().format('YYYY-MM-DD HH:mm:ss')
    }; */
  }
/*   componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        nowTime: moment().format('YYYY-MM-DD HH:mm:ss')
      });
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  } */
  getOtionTem() {
    let { List } = this.props;
    if (!List) {
      List = [];
    }
    const {effectiveNum,ineffectiveNum,unHandledNum}=List;
    let otherCount =effectiveNum+ineffectiveNum;
    let UnhandleCount = unHandledNum;
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        confine: true
      },
      grid: {
        x: 30,
        y: 0,
        x2: 50,
        y2: 50,
        borderWidth: 0
      },

      series: [
        {
          name: '告警总量统计',
          type: 'pie',
          radius: ['71%', '70%'],
          hoverAnimation: false,
           label: {
            
            normal: {
              position: 'center',
              show:false,
             /*  formatter: function(params, ticket, callback) {
                if (params.name === '告警总量') {
                  return (
                    '{blueP|告警总量}\n{blueH2|' + splitNum(params.value) + '}\n{hr|}\n'
                  );
                } else {
                  return (
                    '\n{block|待处理告警总量}\n{blueP|待处理告警总量}\n{blueH3|' +
                   10000 +
                    '}\n'
                  );
                }
              },  */
              rich: {
                hr: {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  width: 120,
                  // borderWidth: 1,
                  height: 1,
                  shadowColor: 'rgba(255,255,255,0.7)',
                  shadowBlur: 2
                },
                orangeP: {
                  color: '#FFAF5D',
                  fontSize: 12,
                  align: 'center',
                  padding: [5, 0]
                },
                orangeH2: {
                  color: '#FFAF5D',
                  fontSize: 16,
                  align: 'center',
                  fontWeight: 'bold',
                  padding: [5, 0]
                },
                block: {
                  color: 'rgba(0,0,0,0)',
                  fontSize: 8,
                  align: 'center'
                },
                blueP: {
                  color: '#666666 ',
                  fontSize: 12,
                  align: 'center',
                  fontWeight: 300,
                  padding: [5, 0]
                },
                blueH2: {
                  color: ' #151515 ',
                  fontSize: 24,
                  align: 'center',
                  fontWeight: 'bold',
                  padding: [5, 0]
                },
                blueH3: {
                  color: ' #FFAA00 ',
                  fontSize: 24,
                  align: 'center',
                  fontWeight: 'bold',
                  padding: [5, 0]
                }
              }
            },
            emphasis: {
              show: false,
          }
          },
          data: [
            {
              value:UnhandleCount,
              name: '待处理告警总量',
              itemStyle: {
                normal: {
                  shadowColor: '#EAEDF1',
                  shadowBlur: 10,
                  borderWidth: 14,
                  borderColor: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#FF8800' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#FFAA00' // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  }
                }
              }
            },
            {
              value: otherCount,
              name: '已处理告警量',
              itemStyle: {
                normal: {
                  shadowColor: '#EAEDF1',
                  shadowBlur: 10,
                  borderWidth: 9,
                  borderColor: '#D8DCE3 '
                }
              }
            }
          ]
        }
      ]
    };

    return option;
  }
  render() {
    return (
      <div className="chartAnother">
        {/* <Circle 
                    width={200} 
                    height={200} 
                    value={50}
                /> */}
        <ReactEcharts
          option={this.getOtionTem()}
          style={{ height: 'calc(100% - 32px)',width:'100%' }}
        />
      </div>
    );
  }
}
export default AlarmNum;
