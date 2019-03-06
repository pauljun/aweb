import React,{Component} from 'react';
import { toJS } from 'mobx';
import { Collapse, Checkbox } from 'antd';
import CollapsePanelItem from './CollapsePanel';
const CheckboxGroup = Checkbox.Group;

const CollapseList = ({
  collapseData,
  editStatus,
  onDeleteOne,
  onDownloadOne,
  onCheckCamera,
  onCheckItem,
  onVideoPlay,
  onImageView
}) => (
  <Collapse className={`media-lib-collapse-wrapper ${editStatus ? 'checkbox-hide' : 'checkbox-show'}`}>
    {collapseData.map((v, k) => {
      let checkedList = toJS(v.checkedList);
      let checkedCamera = checkedList.length === v.listData.length
      let checkedIndeterminate = !!checkedList.length && checkedList.length < v.listData.length 
      return (
        <Collapse.Panel 
          key={v.cameraId}
          header={
            <div className='collapse-item-header'>
              { !editStatus && (
                  <Checkbox
                    className='check-all'
                    checked={checkedCamera}
                    indeterminate={checkedIndeterminate}
                    onClick={(e) => onCheckCamera(e, v.cameraId, k)}
                  />
              )}
              <span className='item-title' title={v.cameraName}>{v.cameraName}</span>
            </div>
          } 
        >
          <CheckboxGroup 
            value={checkedList} 
            onChange={(checkList) => onCheckItem(checkList, v.cameraId)}
          >
            {v.listData.map(x => (
              <CollapsePanelItem 
                key={x.id}
                item={x}
                editStatus={editStatus}
                onDownloadOne={onDownloadOne}
                onDeleteOne={onDeleteOne}
                onVideoPlay={onVideoPlay}
                onImageView={onImageView}
                />
            ))}
          </CheckboxGroup>
        </Collapse.Panel>
      )
    })}
  </Collapse>
)

export default CollapseList;