import React from 'react';
import { Progress } from 'antd';
import '../style/top-view.scss';

export default class ResourceTopView extends React.Component {
  render() {
    const { count, onlineCount } = this.props;
    const score = Math.round((onlineCount / count) * 100);
    return (
      <div className="resource-tree-top">
        <div className="title">视频监控</div>
        <div className="device-count">
          <p className="count">
            摄像机总数：
            <span className="font-resource-normal">{count}</span>
          </p>
          <p className="count online-count">
            在线摄像机：
            <span className="font-resource-normal">{onlineCount}</span>
          </p>
        </div>
        <div className="score">
          <Progress
            width={44}
            className="font-resource-normal"
            type="circle"
            strokeColor={'#44DBA5'}
            percent={score}
          />
        </div>
      </div>
    );
  }
}
