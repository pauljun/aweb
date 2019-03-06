import React from 'react';
import { Icon, Popover, Slider } from 'antd';
import IconFont from '../../IconFont';
import FullScreenLayout from '../../FullScreenLayout';
import PropTypes from 'prop-types';
import Status from '../status';
import { stopPropagation, animateFly } from '../../../utils';
import CustomSlider from './CustomSlider';
import { DEVICE } from 'src/service/RequestUrl';
import moment from 'moment';

import '../style/contraller-bar.scss';

export class TopContrallerBar extends React.Component {
  static contextTypes = {
    getPlayContainer: PropTypes.func
  };
  render() {
    const { getPlayContainer } = this.context;
    const { className, title, closeVideo, customTopBar } = this.props;
    return (
      <div
        className={`top-contraller-bar contraller-bar-layout ${
          className ? className : ''
        }`}
      >
        <div className="player-title">{title}</div>
        <div className="top-contraller">
          {customTopBar}
          <FullScreenLayout
            className="fullscreen-bar"
            getContainer={getPlayContainer}
          >
            {isFullscreen => (
              <IconFont
                title={!isFullscreen ? '全屏播放' : '窗口播放'}
                type={!isFullscreen ? 'icon-Full_Main' : 'icon-ExitFull_Main'}
                theme="outlined"
              />
            )}
          </FullScreenLayout>
          <IconFont
            className="close-video"
            type="icon-Close_Main1"
            onClick={closeVideo}
          />
        </div>
      </div>
    );
  }
}

const SpeedLibs = [0.125, 0.25, 0.5, 1, 2, 4, 8];

export class BottomContrallerBar extends React.Component {
  static contextTypes = {
    getPlayContainer: PropTypes.func,
    isLiving: PropTypes.bool,
    isNativeVideo: PropTypes.bool,
    stretching: PropTypes.string,
    setStretching: PropTypes.func,
    player: PropTypes.object,
    isLoop: PropTypes.bool,
    setPlayStatus: PropTypes.func,
    playStatus: PropTypes.string,
    fileData: PropTypes.object
  };
  state = {
    volume: 0, // 0~100
    speed: 1
  };
  componentDidMount() {
    // const { getPlayContainer } = this.context;
    // const video = getPlayContainer().querySelector('video');
    // this.setState({
    //   volume: video ? video.volume * 100 : 0
    // });
    const { player } = this.context;
    player.setVolume(0);
  }
  setVolume = value => {
    const { player } = this.context;
    this.setState({ volume: value });
    player.setVolume(value);
  };

  setMuted = event => {
    stopPropagation(event);
    const { player } = this.context;
    if (this.state.volume > 0) {
      player.setVolume(0);
      this.setState({ volume: 0, muted: true });
    } else {
      player.setVolume(100);
      this.setState({ volume: 100, muted: false });
    }
  };

  setSpeed = (num, event) => {
    stopPropagation(event);
    const { player } = this.context;
    player.setPlaybackRate(num);
    this.setState({ speed: num });
  };

  liveAction = event => {
    stopPropagation(event);
    const { setPlayMethods } = this.props;
    const { isLiving } = this.context;
    !isLiving && setPlayMethods({ isLiving: true });
  };
  historyAction = event => {
    stopPropagation(event);
    const { openHistoryPopup } = this.props;
    openHistoryPopup(true, 'history');
  };
  playOrPause = event => {
    stopPropagation(event);
    const { player, playStatus, setPlayStatus } = this.context;
    if (playStatus === Status.Pause) {
      player.play();
      setPlayStatus(Status.Play);
    } else {
      player.pause();
      setPlayStatus(Status.Pause);
    }
  };
  downloadAction = event => {
    const { getPlayContainer } = this.context;
    const ele = getPlayContainer().querySelector('video');
    console.log(ele);
    ele.currentTime = 10;
    // player.setSeeking(0.5)
    stopPropagation(event);
    const { openHistoryPopup } = this.props;
    openHistoryPopup(true, 'download');
  };
  screenCapture = e => {
    const { getPlayContainer, fileData, player, isLiving } = this.context;
    let video = getPlayContainer().querySelector('video');
    let canvas = document.createElement('canvas');
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL();
    const options = {
      start: { clientX: e.clientX, clientY: e.clientY },
      url: base64
    };
    animateFly(options);
    window.GlobalStore.MediaLibStore.add({
      cameraId: fileData.id,
      cameraName: fileData.deviceName,
      captureTime: Date.now(),
      imgUrl: base64,
      type: 'image'
    });
    let description = '';
    if (isLiving) {
      description = `保存点位【${fileData.deviceName}】 ${moment(
        new Date()
      ).format('YYYY.MM.DD HH:mm:ss')}的截图`;
    } else {
      let hisTime = moment(
        moment(fileData.historyList.beginDate).valueOf() +
          player.currentTime * 1000
      ).format('YYYY.MM.DD HH:mm:ss');
      description = `保存点位【${fileData.deviceName}】${hisTime}的截图`;
    }
    GlobalStore.LoggerStore.save({
      description,
      ...DEVICE.ScreenshotModule
    });
    setTimeout(() => {
      ctx = null;
      canvas.remove();
      canvas = null;
    }, 10);
  };

  renderLeftStatus() {
    const { isLoop, isNativeVideo, isLiving } = this.context;
    const { hasHistory, hasLiving } = this.props;
    if (isLoop) {
      return (
        <div className="video-loop">
          视频轮巡中
          <Icon type="loading" />
        </div>
      );
    } else {
      if (isNativeVideo) {
        return null;
      } else {
        return (
          <div className="play-type">
            {hasLiving && (
              <i onClick={this.liveAction} className={isLiving ? 'active' : ''}>
                实时
              </i>
            )}
            {hasHistory && (
              <i
                onClick={this.historyAction}
                className={!isLiving ? 'active' : ''}
              >
                历史
              </i>
            )}
          </div>
        );
      }
    }
  }

  renderRightStatus() {
    const { isNativeVideo, isLiving, getPlayContainer } = this.context;
    const { hasDownload } = this.props;
    const { speed } = this.state;
    if (isNativeVideo) {
      return null;
    }
    return (
      <React.Fragment>
        {hasDownload && (
          <IconFont
            type="icon-Download_Main"
            title="下载"
            onClick={this.downloadAction}
          />
        )}
        <IconFont
          type="icon-Photo_Main"
          title="截屏"
          onClick={this.screenCapture}
        />
        {!isLiving && (
          <Popover
            placement="top"
            overlayClassName={'popup-speed-volume'}
            getPopupContainer={() =>
              getPlayContainer().querySelector('.popup-set-speed-popup')
            }
            content={
              <div className="speed-popup">
                {SpeedLibs.map(v => (
                  <span key={v} onClick={event => this.setSpeed(v, event)}>
                    {v}x
                  </span>
                ))}
              </div>
            }
          >
            <span className="speed">{speed}x</span>
          </Popover>
        )}
      </React.Fragment>
    );
  }

  render() {
    const { volume, speed } = this.state;
    const {
      isLiving,
      stretching,
      setStretching,
      isLoop,
      isNativeVideo,
      playStatus,
      getPlayContainer
    } = this.context;
    const {
      className,
      hasHistory,
      hasLiving,
      hasDownload,
      customBottmLeftBar,
      customBottmRightBar
    } = this.props;
    return (
      <div
        className={`bottom-contraller-bar contraller-bar-layout ${
          className ? className : ''
        }`}
      >
        <div className="left-contraller">
          {this.renderLeftStatus()}
          <div className="play-tools">
            {!isLiving || isNativeVideo ? (
              <IconFont
                onClick={this.playOrPause}
                type={
                  playStatus !== Status.Pause
                    ? 'icon-Pause_Main'
                    : 'icon-Play_Main'
                }
              />
            ) : null}
            <Popover
              placement="top"
              trigger="hover"
              overlayClassName={'popup-set-volume'}
              getPopupContainer={() =>
                getPlayContainer().querySelector('.popup-set-volume-popup')
              }
              content={
                // <Slider vertical value={volume} onChange={this.setVolume} />
                <CustomSlider
                  vertical
                  percent={volume / 100}
                  onChange={this.setVolume}
                />
              }
            >
              <IconFont
                onClick={this.setMuted}
                type={
                  volume === 100
                    ? 'icon-volume-max'
                    : volume === 0
                    ? 'icon-volume-close'
                    : 'icon-volume-normal-fuben'
                }
              />
            </Popover>
            {customBottmLeftBar}
          </div>
        </div>
        <div className="right-contraller">
          {customBottmRightBar}
          <IconFont
            title={stretching === 'uniform' ? '画面填充' : '画面自适应'}
            type={
              stretching === 'uniform' ? 'icon-Size__Main' : 'icon-Size__Main1'
            }
            onClick={() =>
              setStretching(stretching === 'uniform' ? 'exactfit' : null)
            }
          />
          {this.renderRightStatus()}
        </div>
      </div>
    );
  }
}
