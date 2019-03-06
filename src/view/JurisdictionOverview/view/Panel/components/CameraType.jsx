import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { observer } from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import IconFont from 'src/components/IconFont';
import util from '../middle/util/util';
import { znxj, qj, zpj, db } from 'src/libs/DeviceLib';
import { errorBoundary } from 'src/utils/Decorator';

@errorBoundary
@BusinessProvider('DeviceStore', 'JurisdictionOverviewStore')
@observer
class PoliceSituationStatic extends Component {
  state = {
    total: 0,
    data: [
      { value: 0, name: '智能枪机' },
      { value: 0, name: '抓拍机' },
      { value: 0, name: '球机' },
      { value: 0, name: '其他' }
    ],
    myColor: ['#FF8800 ', '#5A60A2', '#8899BB', '#96B4E8']
  };

  componentDidMount() {
    let type = [znxj, qj, zpj, db].map(v => v.value);
    this.props.JurisdictionOverviewStore.getDeviceTypeCount({
      deviceTypes: type
    }).then(res => {
      let znqj = {
        value: this.getValue(res.result.filter(v => v.deviceType === 100604)),
        name: '智能枪机'
      };
      let qj = {
        value: this.getValue(res.result.filter(v => v.deviceType === 100602)),
        name: '球机'
      };
      let zpj = {
        value: this.getValue(res.result.filter(v => v.deviceType === 100603)),
        name: '抓拍机'
      };
      let total = this.getValue(res.result);
      let qt = {
        value: total - znqj.value - qj.value - zpj.value,
        name: '其他'
      };
      let data = [znqj, zpj, qj, qt];
      this.setState({ data, total });
    });
  }
  getValue = data => {
    let count = 0;
    data &&
      data.map(v => {
        count += v.num;
      });
    return count;
  };
  getOtionTem() {
    let { data, myColor, total } = this.state;
    let percentData = (data.length > 0 &&
      data.map(v => (v.value / total) * 100)) || [0, 0, 0];
    const option = {
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: function(params) {
          if (params.dataIndex == 0) {
            return `${params.name} : <br/>${params.value} (${
              percentData[0] ? percentData[0].toFixed(2) : 0
            }%)`;
          } else if (params.dataIndex == 1) {
            return `${params.name} : <br/>${params.value} (${
              percentData[1] ? percentData[1].toFixed(2) : 0
            }%)`;
          } else if (params.dataIndex == 2) {
            return `${params.name} : <br/>${params.value} (${
              percentData[2] ? percentData[2].toFixed(2) : 0
            }%)`;
          } else {
            return `${params.name} : <br/>${params.value} (${
              percentData[3] ? percentData[3].toFixed(2) : 0
            }%)`;
          }
        }
      },
      color: myColor,
      series: [
        {
          type: 'pie',
          symbol: 'circle',
          radius: ['30%', '75%'],
          center: ['48%', '50%'],
          label: {
            normal: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: data
        },
        {
          type: 'pie',
          radius: ['75%', '85%'],
          center: ['48%', '50%'],
          label: {
            normal: {
              show: false,
              textStyle: {
                fontSize: 24,
                color: '#FFAA00'
              }
            }
          },
          animation: false,
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              opacity: 0.3
            }
          },
          data: data
        }
      ]
    };

    return option;
  }

  render() {
    let { data, myColor, total } = this.state;
    return (
      <div className="chart">
        <ReactEcharts
          option={this.getOtionTem()}
          style={{ height: 'calc(100% - 32px)', width: '60%' }}
        />
        <div
          className="legends"
          style={{ height: 'calc(100% - 32px)', width: '40%' }}
        >
          {data.map((v, x) => (
            <div key={x}>
              <i style={{ backgroundColor: myColor[x] }} className="symbolC" />
              <IconFont
                style={{
                  fontSize: '16px',
                  color: '#8899bb',
                  marginRight: '5px'
                }}
                type={
                  v.name === '智能枪机'
                    ? 'icon-_Camera__Main1'
                    : v.name === '球机'
                    ? 'icon-_Camera__Main'
                    : v.name === '抓拍机'
                    ? 'icon-_Camera__Main3'
                    : 'icon-Entrance_Guard'
                }
              />
              <span className="name">{v.name} ： </span>
              <div className="num">
                {util.splitNum(v.value)}({((v.value / total) * 100).toFixed(2)}
                %)
              </div>
            </div>
          ))}
        </div>
        <style jsx="true">{`
          .chart {
            position: relative;
            display: flex;
            align-items: center;
          }
          .legends {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }
          .symbolC {
            display: inline-block;
            width: 12px;
            height: 12px;
            vertical-align: middle;
            border-radius: 50%;
            margin-right: 5px;
          }
          .name {
            font-size: 12px;
          }
          .num {
            margin-left: 20px;
            line-height: 14px;
            margin-bottom: 6px;
            font-size: 12px;
          }
        `}</style>
      </div>
    );
  }
}
export default PoliceSituationStatic;
