import React from 'react';
import PlayerContainer from '../components/PlayContainer';
import ListTools from '../components/ListTools';
import { videoModule } from '../moduleContext';
import { toJS } from 'mobx';
import { shouldComponentUpdate } from 'src/utils/Decorator/shouldComponentUpdate';

@videoModule
@shouldComponentUpdate
export default class VideoSurveillanceListMode extends React.Component {
  constructor(props) {
    super(props);
    this.players = null;
  }
  componentWillUnmount() {
    this.players = null;
  }

  /**
   * 选中设备后获取播放信息，传递给播放容器组件
   * @param {object} info
   */
  selectDevice(list) {
    if (this.players) {
      let { asyncGetCurrentVideoList } = this.props;
      let ids = [],
        names = [],
        deviceTypes = [],
        ptzTypes = [];
      for (let i = 0, l = list.length; i < l; i++) {
        let info = list[i];
        ids.push(info.manufacturerDeviceId || info.id);
        names.push(info.deviceName || info.name);
        deviceTypes.push(info.deviceType);
        ptzTypes.push(
          info.extJson &&
            info.extJson.cameraInfo &&
            info.extJson.cameraInfo.type
        );
      }
      asyncGetCurrentVideoList(ids, names, deviceTypes, ptzTypes, {
        isOther: false
      })
        .then(fileDatas => {
          for (let i = 0, l = fileDatas.length; i < l; i++) {
            let info = list[i];
            info.file = fileDatas[i].file;
            info = toJS(info);
          }
          this.players.selectDeviceList(list);
        })
        .catch(() => this.players.selectDevice());
    }
  }

  /**
   * 获取轮巡设备的播放信息，提交给子Play组件处理
   * @param {Array} deviceList
   */
  playMethodForLoopDevice(deviceList) {
    if (this.players) {
      let { asyncGetCurrentVideoList } = this.props;
      let ids = [];
      let names = [];
      let deviceTypes = [];
      let ptzTypes = [];
      deviceList.forEach(item => {
        ids.push(item.manufacturerDeviceId || item.id);
        names.push(item.deviceName || item.name);
        deviceTypes.push(item.deviceType);
        try {
          ptzTypes.push(item.extJson.cameraInfo.type);
        } catch (e) {
          ptzTypes.push(undefined);
        }
      });
      asyncGetCurrentVideoList(ids, names, deviceTypes, ptzTypes, {
        isOther: false
      })
        .then(fileDatas => {
          fileDatas.forEach((item, index) => {
            deviceList[index].file = item.file;
          });
          //console.log(deviceList)
          this.players.playLoopVideo(toJS(deviceList));
        })
        .catch(() => this.players.playLoopVideo());
    }
  }

  /**
   * 传递给子，更新播放容器的可轮巡的状态
   * @param {Array} loopVideoBox
   */
  setLoopVideBox(loopVideoBox) {
    this.players.setLoopVideBox(loopVideoBox);
  }

  /**
   * 获取历史视频
   */
  getHistoryVideo = options => {
    let { asyncGetHistoryVideo } = this.props;
    return asyncGetHistoryVideo(options, { isOther: false });
  };

  /**
   * 关闭视频，传递给子和父
   */
  closeVideo = () => {
    this.props.closeVideo();
    this.players.closeAllVideo();
  };

  initPlayer(players) {
    this.players = players;
  }
  render() {
    const {
      setDeviceListForCurrentPlayerBox,
      isLoop,
      endVideoLoop,
      currentScreen,
      selectSrceen
    } = this.props;
    return (
      <div className="list-mode-video">
        <div className="tools-top-layout">
          <ListTools
            isLoop={isLoop}
            currentScreen={currentScreen}
            selectSrceen={selectSrceen}
            closeVideo={this.closeVideo}
            stopLoop={endVideoLoop}
          />
        </div>
        <PlayerContainer
          getHistoryVideo={this.getHistoryVideo}
          currentScreen={currentScreen}
          changePlayer={setDeviceListForCurrentPlayerBox}
          init={this.initPlayer.bind(this)}
        />
      </div>
    );
  }
}
