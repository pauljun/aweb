import React from 'react';
import Player from '../../../components/Player';

export default class PlayComponent extends React.Component {
  render() {
    const { fileData = {}, hasLiving=true, children } = this.props;
    const hasHistory = !!window.GlobalStore.MenuStore.getAuthAction(
      'HistoryVideo'
    );
    const hasDownload = !!window.GlobalStore.MenuStore.getAuthAction(
      'DownloadVideo'
    );
    return (
      <Player
        {...this.props}
        //videoPlayState={this.props.videoPlayState}
        hasHistory={hasHistory}
        hasLiving={hasLiving}
        hasDownload={hasDownload}
        ptzControl={fileData.deviceType * 1 === 100602}
      >
        {children}
      </Player>
    );
  }
}
