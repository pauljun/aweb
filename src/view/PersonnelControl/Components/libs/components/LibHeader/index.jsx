import React from 'react';
import { Button } from 'antd';

import './index.scss'

// 黑名单库、白名单库公共头部组件
const LibHeader = ({title, subTitle='', className='', children=null}) => (
  <div className={`monitee-lib-common-header-wrapper clearfix ${className}`}>
    <div className='title-container fl'>
      <span className='title'>{title}</span>
      <span className='sub-title'>{subTitle}</span>
    </div>
    <div className='children-container fr'>
      { children }
    </div>
  </div>
)

export default LibHeader;

