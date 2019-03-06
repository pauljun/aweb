import React from 'react'
import { inject, observer } from 'mobx-react';
import moment from 'moment'
import IconFont from 'src/components/IconFont'
import PicItem from '../picItem/index'
import './index.scss'
@inject('UserStore')
@observer
class DetailList extends React.Component {
  render() {
    const { itemActive, changeItem, renderData = [], getPrePage, getNextPage } = this.props
    return (
      <div className='detail-list-foot'>
        <div className="btn left-btn" onClick={getPrePage}>
          <IconFont type='icon-Arrow_Big_Left_Main'/>
        </div>
        <div className={`list-container ${renderData.length !== 6 ? 'list-less-container': ''}`}>
          {renderData.map(item => {
            return <PicItem 
              key={item.id}
              item={item}
              id={itemActive.id}
              onChange={changeItem}
              type={this.props.type}
              realName={this.props.UserStore.userInfo.realName}
              similarInfo={this.props.similarInfo}
              />
          })}
        </div>
        <div className="btn right-btn" onClick={getNextPage}>
          <IconFont type='icon-Arrow_Big_Right_Main'/>
        </div>
      </div>
    )
  }
}

export default DetailList
