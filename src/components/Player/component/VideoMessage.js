import React from 'react';
import PropTypes from 'prop-types';
import IconFont from '../../IconFont';
import { Icon } from 'antd';
import Status from '../status';
import '../style/message.scss';

export default class VideoMessage extends React.Component {
  static contextTypes = {
    player: PropTypes.object,
    setPlayStatus: PropTypes.func
  };
  clickReload = () => {
    const { setPlayStatus } = this.context;
    setPlayStatus(Status.Reload);
  };
  playForPause = () => {
    const { player, setPlayStatus } = this.context;
    player.play();
    setPlayStatus(Status.Play);
  };
  render() {
    const { playStatus, reConnectNum } = this.props;
    if (playStatus === Status.Error) {
      return (
        <div
          className="video-message-layout video-error-layout"
          onClick={this.clickReload}
        >
          <IconFont className="error-icon" type="icon-Error" />
          <span>视频解析错误</span>
        </div>
      );
    }
    if (playStatus === Status.Loading) {
      return (
        <div className="video-message-layout video-noMark-layout">
          <Icon className="icon-tools" type="loading" />
        </div>
      );
    }
    if (playStatus === Status.ReConnect) {
      return (
        <div className="video-message-layout video-noMark-layout video-reconent-layout">
          <Icon className="icon-tools" type="loading" />
          <span>视频正在第 {reConnectNum} 次重连</span>
        </div>
      );
    }
    if (playStatus === Status.Pause) {
      return (
        <div className="video-message-layout video-noMark-layout">
          <IconFont
            onClick={this.playForPause}
            className="icon-tools play-icon"
            type="icon-Play_Main"
          />
        </div>
      );
    }
    return null;
  }
}
