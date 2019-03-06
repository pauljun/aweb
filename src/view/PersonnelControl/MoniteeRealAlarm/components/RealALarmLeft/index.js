import React from 'react';
import AlarmNum from '../alarmNum';
import AlarmType from '../alarmType';
import AlarmState from '../alarmState';
import AlarmWordMention from '../alarmWordMention/index';
import Socket from '../../../../../libs/Socket';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
const splitNum = (data = 0) => {
  return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
@BusinessProvider('RealAlStore')
export default class RealAlarmLeft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DouList: { effectiveNum: 0, ineffectiveNum: 0, unHandledNum: 0 },
      circleList: {},
      chartList: []
    };
    this.initData();
    this.getTypeData();
    this.getDataCount();
    this.getDataByDay();
  }
  initData(){
    Socket.on('resolveAlarm', this.handleDataUpdate);
  }
  handleDataUpdate = () => {
   this.getTypeData();
  }
  componentWillUnmount() {
    Socket.off('resolveAlarm', this.handleDataUpdate);
  }
  getTypeData = () => {
    const { RealAlStore } = this.props;
    RealAlStore.getTypeStaticCounts({ logTypes: ['1', '2', '5'] }).then(res => {
      if(Object.keys(res).length==0){
        return
      }
      this.setState({
        DouList: res
      });
    });
  };
  getDataCount = () => {
    const { RealAlStore } = this.props;
    RealAlStore.getDataFromCount().then(res => {
      if(Object.keys(res).length==0){
        return
      }
      this.setState({
        circleList: res
      });
    });
  };
  getDataByDay = () => {
    const { RealAlStore } = this.props;
    RealAlStore.getSevenStatistics().then(res => {
      this.HandleData(res);
    });
  };
  HandleData = data => {
    if(Object.keys(data).length==0){
      return
    }
    let arr = [];
    for (let i = 0; i < 7; i++) {
      let PRO = {
        black: data.blackListAlarm[i],
        white: data.whiteListAlarm[i],
        special: data.machineAlarm[i]
      };
      arr.push(PRO);
    }
    this.setState({
      chartList: arr
    });
  };
  render() {
    const { chartList, circleList } = this.state;
    const { effectiveNum, ineffectiveNum, unHandledNum } = this.state.DouList;
    return (
      <React.Fragment>
        <div className="alarm-title-real" style={{ margin: 0 }}>
          实时告警
        </div>
        <div className="alarm-real-just">
          <div className="alarm_all_total_num">
            <div className="title" />
            <div className="circle-word">
              <div className="circle-word-count">
                <div>告警总量</div>
                <div className="font-resource-normal">
                  {splitNum(effectiveNum + ineffectiveNum + unHandledNum)}
                </div>
              </div>
              <div className="circle-nohandle-count">
                <div>待处理告警总量</div>
                <div className="font-resource-normal">
                  {splitNum(unHandledNum)}
                </div>
              </div>
            </div>
            <div className="content">
               <AlarmNum List={this.state.DouList} /> 
            </div>
          </div>
          <div className="alarm_type_total_num">
            <div className="title" />
            <div className="content">
              <AlarmType dataAlarmType={circleList} />
            </div>

            <AlarmWordMention circleList={circleList} />
          </div>
          <div className="alarm_change_total_num">
            <div className="title" />
            <div className="content">
              {<AlarmState resourcesTrendStatis={chartList} />}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
