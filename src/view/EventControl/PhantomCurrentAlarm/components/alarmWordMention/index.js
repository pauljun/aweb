import React from 'react';
import './index.scss';
export default class AlarmWordMention extends React.Component {
  render() {
    const { circleList} = this.props;
   const { effectiveNum, ineffectiveNum, unHandledNum } =circleList;
     const eff = effectiveNum / (effectiveNum + ineffectiveNum + unHandledNum)*100;
    const ineff =
      ineffectiveNum / (effectiveNum + ineffectiveNum + unHandledNum)*100;
    const unhandle =
      unHandledNum / (effectiveNum + ineffectiveNum + unHandledNum)*100; 
    return (
      <div className="alarm-line">
        <div className="alarm-line-word">
          <div />
          <div className="alarm-get-pic">
            <span>
              &nbsp;&nbsp;有效提醒：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="second-span">
                
                  {(eff?eff.toFixed(2): 0)}%
              </span>
              <span style={{ width: '30px' }}>
               {/*  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                {effectiveNum
                    ? parseFloat(effectiveNum).toLocaleString()
                    : 0
                  }
              </span>
            </span>
          </div>
        </div>
        <div className="alarm-line-word one">
          <div />
          <div className="alarm-get-pic">
            <span>
              &nbsp;&nbsp;无效提醒：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="second-span">
                
                {ineff ?ineff.toFixed(2): 0}%
              </span>
              <span style={{ width: '30px' }}>
               {/*  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                {ineffectiveNum ? parseFloat(ineffectiveNum).toLocaleString(): 0}
              </span>
            </span>
          </div>
        </div>
        <div className="alarm-line-word two">
          <div />
          <div className="alarm-get-pic">
            <span>
              &nbsp;&nbsp;未处理提醒：&nbsp;
              <span className="second-span" style={{paddingLeft:'1px'}}>
              {unhandle ? unhandle.toFixed(2) : 0}%
              </span>
              <span style={{ width: '30px',paddingLeft:'1px' }}>
                {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                {unHandledNum ? parseFloat(unHandledNum).toLocaleString() : 0}
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}