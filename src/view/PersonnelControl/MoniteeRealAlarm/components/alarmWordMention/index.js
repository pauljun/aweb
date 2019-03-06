import React from 'react';
import './index.scss';
export default class AlarmWordMention extends React.Component {
  render() {
    const { circleList = {} } = this.props;
   const {
      blacklistAlarmCounts,
      whitelistAlarmCounts,
      machineAlarmCounts
    } = circleList; 
    // const { effectiveNum, ineffectiveNum, unHandledNum } =circleLists;
    const blackpercent =
      (blacklistAlarmCounts /
        (blacklistAlarmCounts + whitelistAlarmCounts + machineAlarmCounts)) *
      100;
    const whitepercent =
      (whitelistAlarmCounts /
        (blacklistAlarmCounts + whitelistAlarmCounts + machineAlarmCounts)) *
      100;
    const machinepercnet =
      (machineAlarmCounts /
        (blacklistAlarmCounts + whitelistAlarmCounts + machineAlarmCounts)) *
      100;
    /* const eff = effectiveNum / (effectiveNum + ineffectiveNum + unHandledNum)*100;
    const ineff =
      ineffectiveNum / (effectiveNum + ineffectiveNum + unHandledNum)*100;
    const unhandle =
      unHandledNum / (effectiveNum + ineffectiveNum + unHandledNum)*100; */
    return (
      <div className="alarm-line-real">
        <div className="alarm-line-word-real">
          <div />
          <div className="alarm-get-pic">
            <span>
              &nbsp;&nbsp;重点人员告警：
              <span className="second-span">
                {blackpercent ? blackpercent.toFixed(2) : 0}%
              </span>
              <span style={{ width: '30px' }}>
               {/*  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                {blacklistAlarmCounts
                  ? parseFloat(blacklistAlarmCounts).toLocaleString()
                  : 0}
              </span>
            </span>
          </div>
        </div>
        <div className="alarm-line-word-real one">
          <div />
          <div className="alarm-get-pic">
            <span>
              &nbsp;&nbsp;外来人员告警：
              <span className="second-span">
                {whitepercent ? whitepercent.toFixed(2) : 0}%
              </span>
              <span style={{ width: '30px' }}>
               {/*  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                {whitelistAlarmCounts
                  ? parseFloat(whitelistAlarmCounts).toLocaleString()
                  : 0}
              </span>
            </span>
          </div>
        </div>
        <div className="alarm-line-word-real two">
          <div />
          <div className="alarm-get-pic">
            <span>
              &nbsp;&nbsp;专网套件告警：
              <span className="second-span">
                {machinepercnet ? machinepercnet.toFixed(2) : 0}%
              </span>
              <span style={{ width: '30px' }}>
               {/*  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                {machineAlarmCounts
                  ? parseFloat(machineAlarmCounts).toLocaleString()
                  : 0}
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
