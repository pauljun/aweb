import React from 'react';
import IconFont from '../../IconFont';
import '../style/message.scss';

export default function() {
  return (
    <div className="video-message-layout vidie-empty-data">
      <IconFont className="no-data-icon" type="icon-PlaySource" />
      <span>请选择播放源</span>
    </div>
  );
}
