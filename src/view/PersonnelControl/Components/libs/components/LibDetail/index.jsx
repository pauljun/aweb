import React from 'react';

import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import IconSpan from 'src/components/IconSpan';
import LibHeader from '../LibHeader'
import './index.scss'

// 黑名单库、白名单库详情查看
const LibDetailView = ({ className='', libType='', libDetail={}, userId, btnPriv, onEdit, actionName }) => {
  const managerList = libDetail.managers || []
  let label = libType === 2 ? '合规人员库' : '重点人员库';
  return (
    <div className={`monitee-lib-info-wrapper ${className}`}>
      <LibHeader title={`${label}详情`}>
        <div className='lib-info-edit'>
          { userId === libDetail.creator && (
            <AuthComponent actionName={actionName}>
              <IconSpan 
                className='span-btn'  
                mode='inline'
                icon="icon-Edit_Main" 
                onClick={onEdit} 
                label='编辑' 
              />
            </AuthComponent>
          )}
        </div>
      </LibHeader>
      <div className='lib-info-container'>
        <div className='lib-info lib-name'>
          <span className='info-label'>{`${label}名称 :`}</span>
          <span className='info-value'>{libDetail.name}</span>
        </div>
        <div className='lib-info lib-desc'>
          <span className='info-label'>{`${label}描述 :`}</span>
          <span className='info-value info-desc'>{libDetail.describe || '-- 暂无描述 --'}</span>
        </div>
        <div className='lib-info lib-manager'>
          <span className='info-label'>
            查看权限 (  <span className='highlight'> {managerList.length} </span> 人 ) :
          </span>
          <div className='lib-manager-list clearfix'>
          { !!managerList.length && managerList.map(v => (
              <span className='list-item fl' key={v.userId}>
                {v.userName}
              </span>
            ))
          }
          </div>
        </div>
      </div>
    </div>
  )
}

export default LibDetailView;

