import { observable, action, autorun } from 'mobx';
import videoScreen from '../../libs/Dictionary/videoScreen';


class VideoSurveillance {
  constructor() {
    autorun(() => {
      this.initData();
    });
  }

  @observable
  currentVideoScreen = videoScreen[1]; //默认4分屏

  @observable
  videoConfig = {
    screenNum: 4,
    draggable: true,
    maxScreenNum: 16,
    currIndex: 0,
    ptzControl: true
  };

  @observable
  videoData = Array.from({ length: 16 });

  @action
  setVideoScreen(item) {
    this.currentVideoScreen = item;
  }

  @action
  initData() {
    this.videoConfig = {
      screenNum: 4,
      draggable: true,
      maxScreenNum: 16,
      currIndex: 0,
      ptzControl: true
    };
    this.videoData = Array.from({ length: 16 });
  }

}

export default new VideoSurveillance();
