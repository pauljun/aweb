import React, { Component } from 'react';
import IconFont from 'src/components/IconFont';
import DisCenter from '../../Village/components/DisCenter/index.js'
import './index.scss'
export default ({ changeModel , ...props }) => {
  return (
    <div>
      <div className='operation-center-nav' style={{
        width: '1000px',
        margin: '0 auto',
        padding: '16px 0'
      }}>
				<button className='VD-edit-btn' onClick={changeModel}><IconFont type="icon-Back_Main" /> 返回</button>
      </div>
      <div className="optCenter-wrapper">
        <DisCenter {...props} />
      </div>
    </div>
  )
}