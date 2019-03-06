import React from 'react'
import TreeComponent from '../Tree'

export default ({
  leafClk,//点击节点时候触发的事件
  treeActiveKey,//设置选中的节点
  title,
  viewRef,
  operateChild=null,
  ...props,
  allowClear
}) => {
  return (
    <div className='setting-container'>
      <div className='s-left'>
        <div className='title'>
          {title}
        </div>
        { operateChild }
        <div className='tree'>
          <TreeComponent 
            allowClear = {allowClear}
            leafClk={leafClk}
            activeKey={treeActiveKey}
            viewRef={viewRef}
          />
        </div>
      </div>
      <div className='s-container'>
        {props.children}
      </div>
    </div>
  )
}