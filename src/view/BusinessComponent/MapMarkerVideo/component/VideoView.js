import React from 'react';
import PlayComponent from '../../PlayComponent';
import DownloadVideo from '../../../../utils/DownloadVideo';
import { stopPropagation } from '../../../../utils';
import '../style/video.scss';

class VideoView extends React.PureComponent {
  closeVideo = event => {
    stopPropagation(event);
    this.props.closeVideo && this.props.closeVideo();
  };
  render() {
    const fileData = this.props.info || {};
    if(!fileData.manufacturerDeviceId && fileData.cid){
      fileData.manufacturerDeviceId = fileData.cid
    }
    return (
      <div className="camera-video-map">
        <PlayComponent
          fileData={fileData}
          isLiving={fileData.isLiving}
          method={{
            closeVideo: event => this.closeVideo(event),
            setPlayMethods: options => this.props.setPlayMethods(options),
            downloadVideo: options => DownloadVideo({ fileData, ...options })
          }}
        />
      </div>
    );
  }
}

export default VideoView