import React from 'react';
import PlayComponent from '../../BusinessComponent/PlayComponent';
import { ArrayFill } from '../../../utils/Array';
import { message } from 'antd';
import DownloadVideo from '../../../utils/DownloadVideo';
import '../style/PlayContainer.scss';

export default class PlayContainer extends React.Component {
  constructor(props) {
    super(props);
    const { currentScreen } = props;
    this.state = {
      current: null,
      playerIndex: 0
    };
    this.fileDatas = ArrayFill(currentScreen.num, { isLoop: false });
  }
  componentDidMount() {
    this.props.init && this.props.init(this);
  }

  /**
   * 设置播放的窗口
   * @param {number} index 窗口索引
   */
  selectCurrentPlayer(index) {
    const { current, playerIndex } = this.state;
    this.setState({
      current: current !== index ? index : null,
      playerIndex: current !== index ? index : playerIndex
    });
  }

  /**
   * 更新窗口的播放信息，后回传给父组件所有窗口信息
   * @param {Object} fileData 播放信息
   */
  selectDevice(fileData, cancelNotify) {
    const { playerIndex } = this.state;
    if (fileData && playerIndex > -1) {
      this.fileDatas[playerIndex] = Object.assign(
        this.fileDatas[playerIndex],
        fileData
      );
      this.fileDatas[playerIndex].isLiving = true;
      this.fileDatas[playerIndex].isLoop = false;
      let newIndex = this.getFreeIndex();
      if (playerIndex === newIndex) {
        this.setState({ current: null });
      } else {
        this.setState({ playerIndex: newIndex, current: null });
      }
    } else {
      message.warn('没有空闲的窗口！');
    }
    if (!cancelNotify) {
      this.props.changePlayer && this.props.changePlayer(this.fileDatas);
    }
  }

  /**
   * 批量更新播放器
   * @param {Object} fileDatas
   */
  selectDeviceList(fileDatas) {
    fileDatas.map(item => {
      this.selectDevice(item, true);
    });
    this.props.changePlayer && this.props.changePlayer(this.fileDatas);
  }

  /**
   * 更新可轮巡容器的视频
   * @param {object} loopFileDatas
   */
  playLoopVideo(loopFileDatas) {
    let index = 0;
    this.fileDatas.forEach(item => {
      if (item.isLoop) {
        loopFileDatas[index] &&
          (item = Object.assign(item, loopFileDatas[index]));
        index++;
      }
    });
    this.forceUpdate();
    this.props.changePlayer && this.props.changePlayer(this.fileDatas);
  }

  /**
   * 更新播放容器的可轮巡的状态
   * @param {Array} loopVideoBox
   */
  setLoopVideBox(loopVideoBox) {
    loopVideoBox.map((item, index) => {
      if (this.fileDatas[index]) {
        this.fileDatas[index].isLoop = item.isLoop;
      } else {
        this.fileDatas[index] = { isLoop: item.isLoop };
      }
    });
    this.setState({ playerIndex: this.getFreeIndex() });
  }
  /**
   * 获取空闲的窗口
   */
  getFreeIndex() {
    const { currentScreen } = this.props;
    let { playerIndex } = this.state;
    let arr = Array.from({ length: currentScreen.num });
    let index = null;
    for (let i = 0; i < arr.length; i++) {
      if (!this.fileDatas[i].file && !this.fileDatas[i].isLoop) {
        index = i;
        break;
      }
    }
    if (index !== null) {
      return index;
    } else {
      if (this.fileDatas.filter(v => !v.isLoop).length === 0) {
        return -1;
      } else {
        return this.getNoLoopIndex(playerIndex, currentScreen.num);
      }
    }
  }

  /**
   * 获取没有轮巡的窗口索引
   * @param {number} playerIndex
   * @param {number} max
   */
  getNoLoopIndex(playerIndex, max) {
    playerIndex++;
    if (playerIndex >= max) {
      playerIndex = 0;
    }
    if (this.fileDatas[playerIndex].isLoop) {
      return this.getNoLoopIndex(playerIndex, max);
    } else {
      return playerIndex;
    }
  }

  /**
   * 关闭所有播放器
   */
  closeAllVideo() {
    const { currentScreen } = this.props;
    this.fileDatas = ArrayFill(currentScreen.num, { isLoop: false });
    this.setState({
      current: null,
      playerIndex: 0
    });
  }

  /**
   * 关闭当前播放器
   * @param {Number} index 播放器索引
   */
  closeSingleVideo(index) {
    const { isLoop } = this.fileDatas[index];
    this.fileDatas[index] = { isLoop };
    this.props.changePlayer && this.props.changePlayer(this.fileDatas);
    this.forceUpdate();
  }

  /**
   *
   * @param {object} options 历史视频传出来的时间参数
   * @param {Number} index 播放器索引
   */
  async setPlayMethods(options, index) {
    const { getHistoryVideo } = this.props;
    const { isLiving, startTime, endTime } = options;
    if (!isLiving) {
      let res = await getHistoryVideo({
        cameraId: this.fileDatas[index].manufacturerDeviceId,
        cameraName: this.fileDatas[index].deviceName,
        startTime,
        endTime
      });
      this.fileDatas[index].isLiving = false;
      this.fileDatas[index].historyList = res;
      this.forceUpdate();
    } else {
      this.fileDatas[index].isLiving = true;
      this.forceUpdate();
    }
  }

  /**
   * 下载视频
   * @param {Number} startTime 秒级时间戳
   */
  downloadVideo({ startTime, endTime }, index) {
    const fileData = this.fileDatas[index];
    DownloadVideo({ startTime, endTime, fileData });
  }

  /**
   * 拖拽改变播放器位置
   */
  onDrop = (endIndex, event) => {
    const startIndex = +event.dataTransfer.getData('playIndex');
    const startItem = this.fileDatas[startIndex];
    const endItem = this.fileDatas[endIndex];
    this.fileDatas[startIndex] = endItem;
    this.fileDatas[endIndex] = startItem;
    this.forceUpdate();
  };
  /**
   * 开始拖拽，保存开始的索引
   */
  onDragStart = (startIndex, event) => {
    event.dataTransfer.setData('playIndex', startIndex);
  };
  render() {
    const { currentScreen } = this.props;
    const { current } = this.state;
    const { fileDatas } = this;
    const boxLength = Array.from({ length: currentScreen.num });
    return (
      <div className="player-mutipart-layout">
        {boxLength.map((item, index) => {
          if (!fileDatas[index]) {
            fileDatas[index] = { isLoop: false };
          }
          return (
            <div
              key={index}
              className={`player-item-layer ${
                current === index ? 'player-item-layer-active' : ''
              }`}
              data-index={index}
              draggable={true}
              style={{ width: currentScreen.size, height: currentScreen.size }}
              onDragStart={event => this.onDragStart(index, event)}
              onDrop={event => this.onDrop(index, event)}
              onDragOver={event => event.preventDefault()}
              onClick={event => this.selectCurrentPlayer(index, event)}
            >
              <PlayComponent
                method={{
                  closeVideo: () => this.closeSingleVideo(index),
                  setPlayMethods: options =>
                    this.setPlayMethods(options, index),
                  downloadVideo: options => this.downloadVideo(options, index)
                }}
                event={{
                  onClick: event => this.selectCurrentPlayer(index, event)
                }}
                ptzControl={
                  fileDatas[index]
                    ? fileDatas[index].deviceType * 1 === 100602
                    : false
                }
                className="player-item"
                fileData={fileDatas[index] ? fileDatas[index] : {}}
                isLiving={fileDatas[index] ? fileDatas[index].isLiving : true}
                isLoop={fileDatas[index] ? fileDatas[index].isLoop : false}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
