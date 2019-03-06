import React from 'react';
import './Title.scss';

export default ({className='', title='', children=null}) => (
  <div className={`setting-title-wrapper ${className}`}>
    <div className='title-container'>
      <div className='title'> {title} </div>
      <div className='title-right'> {children} </div>
    </div>
  </div>
)