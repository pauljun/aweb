import React from 'react';
import './CenterHeader.scss';

export default ({className='', title, children=null}) => (
  <div className={`setting-center-header-wrapper ${className}`}>
    <div className='header-container'>
      <div className='header'> {title} </div>
      <div className='header-right'> {children} </div>
    </div>
  </div>
)