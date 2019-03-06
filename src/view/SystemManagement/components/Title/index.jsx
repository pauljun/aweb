import React from 'react';
import './index.scss'

export default ({className='', name, children}) => {
  return (
    <div className={`table-setting-title ${className}`}>
      <div className='titleName'>{name}</div>
      {children}
    </div>
  );
};
