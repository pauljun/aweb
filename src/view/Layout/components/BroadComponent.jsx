import React from 'react';
import { Button } from 'antd';
import IconFont from 'src/components/IconFont';
import NoticeImg from 'src/assets/img/base/Notice.svg';
import '../style/broad-notice.scss'

const BroadComponent = () => (
  <div class='broad-notice-container'>
    <img src={NoticeImg} />
    <p>
      请转至您的客户端使用智慧广播服务<br></br>
      如未安装,请下载：
    </p>
    <a href={window.webConfig.smartBroadcasting}>
      <Button type='primary'>
        <IconFont type='icon-Download_Main' theme="outlined" />
        客户端下载
      </Button>
    </a>
  </div>
)

export default BroadComponent;