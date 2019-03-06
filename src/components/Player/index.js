import React from 'react';
import LivePlayer from 'html5-player';
import HistoryPlayer from 'html5-player/libs/history';
import VideoEvent from './component/VideoEvent';
import PropTypes from 'prop-types';
import VideoMessage from './component/VideoMessage';
import PlayStatusLib from './status';
import NoPlayerData from './component/NoPlayerData';
import { shouldComponentUpdate } from '../../utils/Decorator/shouldComponentUpdate';
import DeviceService from 'src/service/DeviceService';
import {
  TopContrallerBar,
  BottomContrallerBar
} from './component/ContrallerBar';

import HistoryTimeChoise from './component/HistoryTimeChoise';
import CameraControl from './component/CameraControl';
import { exitFullscreen } from 'src/utils/FullScreen';

import DomMarkRepeat from '../WaterMarkView/DomMarkRepeat';
import { cloneDeep } from 'lodash';
import isEqualWith from '../../utils/isEqualWith';

import './style/index.scss';

const MAX_ERROR_NUM = 5;
const RE_CONNECT_TIME = 2 * 1000;

/**
 * 关闭部分默认配置，自定义实现
 */
const defaultControls = {
  playPause: false,
  volume: false,
  speed: false
};

const LoadingMessageComponent = props => {
  return <span>加载超时，第{props.count}次重连中...</span>;
};

@shouldComponentUpdate
export default class VideoPlayer extends React.Component {
  static childContextTypes = {
    getPlayContainer: PropTypes.func,
    videoDom: PropTypes.object,
    player: PropTypes.object,
    fileData: PropTypes.object,
    playStatus: PropTypes.string,
    setPlayStatus: PropTypes.func,
    isNativeVideo:PropTypes.bool,
    isLiving: PropTypes.bool,
    stretching: PropTypes.string,
    setStretching: PropTypes.func,
    isLoop: PropTypes.bool
  };
  getChildContext() {
    return {
      getPlayContainer: () => this.playerContainerRef.current,
      videoDom: this.playerContainerRef.current,
      player: this.player,
      fileData: this.props.fileData,
      playStatus: this.state.playStatus,
      setPlayStatus: this.setPlayStatus,
      isLiving: this.props.isLiving !== false,
      isNativeVideo:this.props.isNativeVideo,
      stretching: this.state.stretching,
      setStretching: this.setStretching,
      isLoop: this.props.isLoop
    };
  }
  constructor(props) {
    super(props);
    this.playId = `lm-player-${Math.random()}`;
    this.player = null;
    this.playerContainerRef = React.createRef();
    this.fileData = cloneDeep(props.fileData);
    this.timer = null;
    this.errorNum = 0;
    this.errorTimer = 0;
    this.state = {
      playStatus: null,
      stretching: 'uniform',
      showHistoryTimeChoise: false,
      key: Math.random(),
      timeRange: null, // 时间控件默认时间段
      autoHideBar: false
    };
  }
  componentWillUnmount() {
    this.fileData = null;
    clearTimeout(this.timer);
    this.timer = null;
  }
  componentWillReceiveProps(nextProps) {
    if (!isEqualWith(this.fileData, nextProps.fileData)) {
      const { isLiving = true } = nextProps;
      const newFileData = nextProps.fileData || {};
      const oldFileData = this.fileData || {};
      if (isLiving) {
        if (oldFileData.file !== newFileData.file) {
          this.setState({ key: Math.random(), playStatus: null });
        } else {
          this.setState({ playStatus: null });
        }
      } else {
        if (oldFileData.historyList !== newFileData.historyList) {
          this.setState({ key: Math.random(), playStatus: null });
        } else {
          this.setState({ playStatus: null });
        }
      }
      this.fileData = cloneDeep(newFileData);
      console.warn('当前视频播对象：', this.fileData);
    }
  }
  setStretching = type => {
    this.setState({ stretching: type ? type : 'uniform' });
  };
  setPlayStatus = status => {
    const { fileData,isLiving } = this.props
    this.setState({ playStatus: status });
    //this.props.videoPlayState&&this.props.videoPlayState(status);
    /**如果视频处于播放状态, 而且视频能够获取流, 通知后台修改设备状态 */
    if(status === 'play' && fileData.deviceData === '0' && isLiving){
      DeviceService.updateStateByDeviceId(fileData.id, '1')
      let deviceList = []
      window.GlobalStore.DeviceStore.deviceList
        .map(v => {
          let item = Object.assign({}, v)
          if(v.id === fileData.id){
            item.deviceData = '1'
          }
          deviceList.push(item)
          return v
        })
      window.GlobalStore.DeviceStore.setDeviceList(deviceList)
    }
    // const { playStatus } = this.state;
    // if (status === PlayStatusLib.Reload) {
    //   clearInterval(this.errorTimer);
    //   this.errorNum = 0;
    //   this.setState({ key: Math.random(), playStatus: PlayStatusLib.Reload });
    // }
    // //TODO 当视频能播放时，清空重连状态
    // if (status === PlayStatusLib.Canplay) {
    //   this.errorNum = 0;
    //   this.setState({ playStatus: PlayStatusLib.Canplay });
    //   clearInterval(this.errorTimer);
    //   return;
    // }
    // //TODO 当当前视频是重连状态时，忽略更新其他状态
    // if (playStatus === PlayStatusLib.ReConnect) {
    //   return;
    // }
    // if (status === PlayStatusLib.Error) {
    //   this.errorNum++;
    //   //TODO 当第一次发生错误时，直接设置重连状态.
    //   if (this.errorNum === 1) {
    //     this.setState({
    //       playStatus: PlayStatusLib.ReConnect,
    //       key: Math.random()
    //     });
    //     this.errorTimer = setInterval(() => {
    //       this.errorNum++;
    //       //TODO 当错误数达到最大限制时，触发
    //       if (this.errorNum > MAX_ERROR_NUM) {
    //         console.warn('视频重连次数超过', MAX_ERROR_NUM);
    //         clearInterval(this.errorTimer);
    //         this.setState({ playStatus: PlayStatusLib.Error });
    //         return;
    //       }
    //       this.setState({
    //         key: Math.random()
    //       });
    //     }, RE_CONNECT_TIME);
    //     return;
    //   }
    //   return;
    // }
    // this.setState({ playStatus: status });
  };
  videoCallback = player => {
    this.player = player;
    this.forceUpdate();
  };
  openOrHideHistoryPopup = (flag, eventType) => {
    exitFullscreen();
    if (eventType === 'download') {
      const { timeRange } = this.props.fileData;
      if (timeRange) {
        this.setState({ timeRange });
      }
    }
    this.setState({ showHistoryTimeChoise: !!flag, eventType });
  };
  handleSelectTime = options => {
    const { eventType } = this.state;
    const { method } = this.props;
    if (eventType === 'history') {
      method.setPlayMethods(options);
    } else if (eventType === 'download') {
      method.downloadVideo(options);
    }
  };
  mouseoverAction = e => {
    clearTimeout(this.timer);
    this.setState({ autoHideBar: false });
    this.timer = setTimeout(() => {
      this.setState({ autoHideBar: true });
    }, 5000);
  };
  mouseooutAction = () => {
    clearTimeout(this.timer);
    this.setState({ autoHideBar: true });
  };
  render() {
    const {
      playStatus,
      stretching,
      showHistoryTimeChoise,
      key,
      timeRange,
      eventType,
      autoHideBar
    } = this.state;
    const {
      fileData = {},
      method = {},
      event = {},
      options = {},
      isLiving = true,
      hasLiving = true,
      hasHistory = true,
      hasDownload = true,
      hideBar = false,
      hideTopBar = false,
      isNativeVideo = false,
      customTopBar,
      customBottmLeftBar,
      customBottmRightBar,
      ...props
    } = this.props;
    const { file, historyList } = fileData;
    const isEmpty = !file && !historyList;
    const Player = isLiving ? LivePlayer : HistoryPlayer;
    let playUrlOptions = { file, historyList };
    isLiving ? delete playUrlOptions.historyList : delete playUrlOptions.file;
    return (
      <div
        id={this.playId}
        className={`lm-player ${autoHideBar ? 'lm-player-hide-bar' : ''} ${
          props.className ? props.className : ''
        }`}
        draggable={false}
        ref={this.playerContainerRef}
        onMouseOver={this.mouseoverAction}
        onMouseMove={this.mouseoverAction}
        onMouseOut={this.mouseooutAction}
      >
        {isEmpty ? (
          <React.Fragment>
            {this.props.children &&
              React.cloneElement(this.props.children, { playInstance: this })}
            <NoPlayerData />
          </React.Fragment>
        ) : (
          <Player
            {...playUrlOptions}
            autoplay={props.autoplay !== false}
            isLiving={isNativeVideo ? false : isLiving}
            videoCallback={this.videoCallback}
            controls={defaultControls}
            contextMenu={[]}
            loop={false}
            stretching={stretching}
            livingMaxBuffer={3} // 直播缓存时间
            timeout={1000 * 15} // 超时重载
            retryTimes={5} // 重载次数
            LoadingMessageComponent={<LoadingMessageComponent />}
            key={key}
          >
            <div className="popup-set-volume-popup" />
            <div className="popup-set-speed-popup" />

            <DomMarkRepeat className="player-marke" />

            {/* <VideoMessage
              playStatus={playStatus}
              reConnectNum={this.errorNum}
            /> */}
            {!hideBar && (
              <React.Fragment>
               {!hideTopBar&&<TopContrallerBar
                  customTopBar={customTopBar}
                  title={fileData.deviceName}
                  closeVideo={method.closeVideo}
                />}
                <BottomContrallerBar
                  hasHistory={hasHistory}
                  hasLiving={hasLiving}
                  hasDownload={hasDownload}
                  customBottmLeftBar={customBottmLeftBar}
                  customBottmRightBar={customBottmRightBar}
                  setPlayMethods={method.setPlayMethods}
                  openHistoryPopup={this.openOrHideHistoryPopup}
                />
              </React.Fragment>
            )}

            {showHistoryTimeChoise && (
              <HistoryTimeChoise
                timeRange={timeRange}
                eventType={eventType}
                close={this.openOrHideHistoryPopup}
                onSelectTime={this.handleSelectTime}
              />
            )}
            {props.ptzControl && isLiving === true && <CameraControl />}

            <VideoEvent {...event} isEmpty={isEmpty} />
            {this.props.children &&
              React.cloneElement(this.props.children, { playInstance: this })}
          </Player>
        )}
      </div>
    );
  }
}
