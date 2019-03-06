import React from 'react'
import moment from 'moment'
import { message, Button, Icon, Tag } from 'antd'
import { inject, observer } from 'mobx-react'

@observer
class ImageListView extends React.Component {

  itemClick = (v, k) => {
    this.props.itemClick && this.props.itemClick(v, k)
  }

  render() {
    let { list, activeIndex } = this.props
    return (
      <div className='image-list-container'>
        {
          list && list.length > 0 &&
          list.map((item, index) => {
            let tagAttr = {}
            if (item.isHandle === 0) {
              tagAttr = { className: 'tag-red', title: '未处理' }
            } else if (item.isEffective === 1) {
              tagAttr = { className: 'tag-green', title: '有效' }
            } else {
              tagAttr = { className: 'tag-gray', title: '无效' }
            }
            return (
              <div
                className={index === activeIndex ?
                  'image-item active' : 'image-item'}
                onClick={this.itemClick.bind(this, item, index)}
                key={item.id}>
                <div className="image-container">
                  <div className='watermask'>{"水印。。。。"}</div>  
                  <img src={item.facePath} />
                </div>
                <div className='image-item-detail'>
                  <div className='detail-camera' title={item.cameraName}>
                    {item.cameraName}
                  </div>
                  <div className='detail-time'>
                    {moment(parseInt(item.captureTime, 10)).format('YYYY.MM.DD HH:mm:ss')}
                  </div>
                  <span className={tagAttr.className}>{tagAttr.title}</span>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default ImageListView