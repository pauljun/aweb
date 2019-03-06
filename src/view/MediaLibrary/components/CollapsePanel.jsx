import React from 'react';
import { Icon, Checkbox, Tooltip } from 'antd';
import IconFont from 'src/components/IconFont';
import WaterMark from 'src/components/WaterMarkView';
import svgNoData from 'src/assets/img/none_pic.png';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';

const CollapsePanelItem = ({ 
  item,
  editStatus,
  onDownloadOne,
  onDeleteOne,
  onVideoPlay,
  onImageView
}) => (
  <div className='list-item-wrapper clearfix'>
    { !editStatus && (
      <Checkbox
        className='check-item'
        value={item.id}
      />
    )}
    <div className='item-img-wrapper fl'>
      {item.imgUrl 
        ? <WaterMark className='item-img-small' src={item.imgUrl} type='' />
        : <img className='item-img-small' src={svgNoData} />
      }
      { item.type === 'video' && (
        <Icon
          type='caret-right'
          onClick={() => { onVideoPlay&&onVideoPlay(item)}}
        />
      )}
      { item.type === 'image' && (
        <Icon 
          type='picture' 
          onClick={() => { onImageView&&onImageView(item) }}
        />
      )}
    </div>
    <div className='item-info-wrapper fr'>
      <div className='item-time-wrapper'>
        {
          item.type==='image'
          ? <p>{item.captureTime}</p>
          : [<p key='startTime'>{item.startTime}</p>,<p key='endTime'>{item.endTime}</p>]
        }
      </div>
      { editStatus && 
        <div className='item-operate-wrapper'>
          <AuthComponent actionName={item.type === 'image' ? 'BaselibImgDownload' : 'DownloadVideo'}>
            <Tooltip title="下载">
              <IconFont type='icon-Download_Main' title='下载' onClick={() => onDownloadOne(item)} />
            </Tooltip>
          </AuthComponent>
          <Tooltip title="删除">
            <IconFont type='icon-Delete_Main' title='删除' onClick={() => onDeleteOne(item)} /> 
          </Tooltip>
        </div>
      }
    </div>
  </div>
)

export default CollapsePanelItem