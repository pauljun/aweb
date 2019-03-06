import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Avatar, Popover } from 'antd';
import IconFont from '../../../components/IconFont';
import { observer, inject } from 'mobx-react';
import UserAction from './UserAction';
import audioUrl from '../../../assets/video/alarm.mp3';
import UserDefault from '../../../assets/img/base/user-default.svg';
import Socket from '../../../libs/Socket';
import AboutSystem from './aboutSystem';
import BroadComponent from './BroadComponent';
import OtherService from '../../../service/OtherService';
import AuthComponent from '../../BusinessComponent/AuthComponent';

@withRouter
@inject('UserStore', 'MenuStore')
@observer
export default class RootHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      versionList: {},
      broadcastSrc: ''
    };
    this.init();
  }
  init() {
    Promise.all([
      OtherService.getVersion(),
      OtherService.getBroadcastInfo()
    ]).then(res => {
      this.setState({
        broadcastSrc: res[1].broadcast,
        versionList: res[0]
      });
    });
  }
  render() {
    let { UserStore, showMediaLibrary, MenuStore } = this.props;
    let { versionList = {}, broadcastSrc } = this.state;
    let { userAvatar, realName, userType } = UserStore.userInfo;
    const isAlarm = MenuStore.getMenuForName('MoniteeRealAlarm');
    return (
      <React.Fragment>
        {userType !== 100701 && (
          <div
            className="user-item system-view"
            onClick={() => showMediaLibrary()}
          >
            <IconFont type="icon-View_Main" theme="outlined" />
            <span className="about-text media-library-btn">我的视图</span>
          </div>
        )}
        <AuthComponent actionName="BroadcastTool">
          <Popover
            placement="bottom"
            overlayClassName={'version_card'}
            content={<BroadComponent />}
          >
            <div className="user-item broadcast-item">
              <IconFont type="icon-Broadcast_Dark" theme="outlined" />
              <a href={broadcastSrc.path}>{broadcastSrc.name}</a>
            </div>
          </Popover>
        </AuthComponent>
        <Popover
          placement="bottom"
          overlayClassName={'version_card'}
          content={<AboutSystem versionList={versionList.about} />}
        >
          <div
            className="user-item system-about"
            onClick={() => window.open('/about.html')}
          >
            <IconFont type="icon-About_Main" theme="outlined" />
            <span className="about-text">关于</span>
          </div>
        </Popover>
        <Popover
          placement="bottomRight"
          content={<UserAction userInfo={UserStore.userInfo} />}
        >
          <div className="user-item user-info">
            <Avatar
              size={36}
              icon="user"
              src={userAvatar ? userAvatar : UserDefault}
            />
            <span className="user-name" title={realName}>
              {realName}
            </span>
            <IconFont type="icon-Arrow_Small_Down_Mai" theme="outlined" />
          </div>
        </Popover>
        {isAlarm && <AlarmNumIcon />}
      </React.Fragment>
    );
  }
}

@inject('UserStore', 'MenuStore', 'TabStore')
class AlarmNumIcon extends React.Component {
  state = {
    alarmNum: 0,
    alarmSound: false
  };
  componentWillMount() {
    const { UserStore } = this.props;
    Socket.on('alarmNum', this.notifyAlarmNum);
    Socket.on('alarm', this.handleAlarm);
    UserStore.countAlarmCountByUserIds({ logTypes: [1, 2, 5] }).then(res => {
      this.setState({ alarmNum: res.result.unHandleNum });
    });
  }
  componentWillUnmount() {
    Socket.off('alarmNum', this.notifyAlarmNum);
    Socket.off('alarm', this.handleAlarm);
  }
  handleAlarm = () => {
    this.setState({
      alarmSound: true
    });
    setTimeout(() => {
      this.setState({
        alarmSound: false
      });
    }, 2000);
  };
  notifyAlarmNum = data => {
    const { UserStore } = this.props;
    if (UserStore.userInfo.id * 1 === data.userId * 1) {
      this.setState({ alarmNum: data.unHandleNum });
    }
  };
  jumpAlarm = () => {
    const { TabStore } = this.props;
    TabStore.goPage({
      moduleName: 'PersonnelControl',
      history: window.ReactHistory,
      childModuleName: 'MoniteeRealAlarm'
    });
  };
  render() {
    const { alarmNum, alarmSound } = this.state;
    return (
      <div className="user-item system-alarm" onClick={this.jumpAlarm}>
        {alarmSound && <audio src={audioUrl} autoPlay />}
        <IconFont type="icon-AlarmOpen_Main1" theme="outlined" />
        <span className="about-text" title={alarmNum}>
          {alarmNum > 999 ? `999+` : alarmNum}
        </span>
      </div>
    );
  }
}
