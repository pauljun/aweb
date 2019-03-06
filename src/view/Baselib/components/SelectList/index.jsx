import React, {Component} from 'react';
import moment from 'moment';
import { Popover, Icon, Button } from 'antd';
import IconFont from 'src/components/IconFont/index'
import './index.scss';

// 以图搜图选中列表组件

const SelectListPopoverContent = ({ selectList, onDelete, setPopoverVisible, openDiaDetail}) => {
  let listContent
  if (!selectList.length){
    listContent = (
      <p className='select-popover-nodata'>暂未选择图片</p>
    )
  } else {
    listContent = (
      <ul className='select-popover-list'>
        {selectList.map((v,k) => (
            <li className='list-item' key={v.id}>
              <div className="img-box" style={{
                backgroundImage: `url(${v.facePath || v.bodyPath})`
              }}>
                {/* <img className='item-img' src={v.facePath || v.bodyPath} alt=""/> */}
              </div>
              <div className="info-list" onClick={() => openDiaDetail(v, k)}>
               <p className='item-name' title={v.cameraName}>{v.cameraName}</p>
               <p className='time'>{v.captureTime && moment(parseInt(v.captureTime,10)).format('YYYY.MM.DD HH:mm:ss')}</p>
              </div>
              <span className='item-btns'>
                <IconFont 
                  className='item-delete' 
                  type='icon-Delete_Main' 
                  title={'取消选中'} 
                  onClick={() => onDelete(k)} 
                /> 
              </span>     
            </li>
          )
        )}
      </ul>
    )
  }
  return (
    <div className='select-popover'>
      <p className='select-popover-title clearfix'>
        <span className='fl'>已选人员</span>
        <Icon type="close" className="fr close_btn" onClick={() => setPopoverVisible(false)}/>
      </p>
      {listContent}
    </div>
  )
}

class SelectListPopover extends Component {

  state={
    visible: false
  }

  // 取消选中
  onDelete = (idx) => {
    const { selectIds, checkedChange } = this.props;
    selectIds.splice(idx,1)
    checkedChange(selectIds)
  }

  // 设置popover显示状态
  setPopoverVisible = (visible) => {
    this.setState({ visible })
  }

  handleList = (listData, selectIds) => {
    let list = []
    selectIds.map(v => {
      let item = listData.find(x => x.id ===v)
      item && list.push(item)
    })
    return list
  }

  render() {
    const { listData, selectIds, openDiaDetail } = this.props;
    const selectList = this.handleList(listData, selectIds);
    return (
      <Popover
        overlayClassName="popover_content_list"
        trigger="click"
        placement='bottom'
        visible={this.state.visible}
        onVisibleChange={this.setPopoverVisible}
        content={
          <SelectListPopoverContent 
            selectList={selectList}         
            onDelete={this.onDelete}
            setPopoverVisible={this.setPopoverVisible}
            openDiaDetail={openDiaDetail}
          />
        }
      >
        <Button className='baselib-select-list-toggle'>
          <IconFont type='icon-Select_Choosed_Main'/>
          已选 {selectList.length} 个
        </Button>
      </Popover>
    )
  }
} 

export default SelectListPopover