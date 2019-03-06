import React from 'react';
import FullScreenLayout from '../../../components/FullScreenLayout';
import SreenChiose from './SreenChiose';
import IconFont from '../../../components/IconFont';
import { videoModule } from '../moduleContext';
import '../style/listTools.scss';

@videoModule
export default class ListTools extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      currentScreen,
      closeVideo,
      selectSrceen,
      isLoop,
      stopLoop,
      videoLayoutDom
    } = this.props;
    return (
      <div className="video-list-tools">
        <div className="split-screen-popup-layout" />
        <div className="tools-layout">
          <SreenChiose
            currentScreen={currentScreen}
            selectSrceen={selectSrceen}
            getPopupContainer={() =>
              videoLayoutDom.querySelector('.split-screen-popup-layout')
            }
          />
          <FullScreenLayout
            className="tools-screen"
            getContainer={() =>
              videoLayoutDom.querySelector('.player-mutipart-layout')
            }
          />

          <div
            className="tools-draw"
            onClick={() => (isLoop ? stopLoop() : closeVideo())}
          >
            <IconFont type="icon-Close_Main1" theme="outlined" />
            {isLoop ? '结束轮巡' : '关闭'}
          </div>
        </div>
      </div>
    );
  }
}
