import React from 'react';
import IconFont from 'src/components/IconFont';
import '../style/about-system.scss'

const AboutSystem = (props) => (
  <div className="about_system">
    <div className="about_system_box">
    <IconFont type={'icon-Version_Main'} theme="outlined" />
    <div className="box_text">
      版本号：{props.versionList && props.versionList[0].name}
    </div>
    </div>
    <div className="about_system_box">
    <IconFont type={'icon-Clock_Light'} theme="outlined" />
    <div className="box_text">
      更新时间：{props.versionList && props.versionList[0].time}
    </div>
    </div>
  </div>
)

export default AboutSystem;