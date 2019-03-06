import React from 'react';
import { Button, Checkbox } from 'antd';
import SelectListPopover from '../components/SelectList'
import IconFont from 'src/components/IconFont/index';
import ImgStyleSelect from '../components/ModuleWrapper/ImgStyleSelect';

export default ({
  total, checkAll, isCheckAll, 
  checkInverse,ischeckInverse, listAll, 
  checkList, openDiaDetail, checkedChange, 
  onImgStyleChange, imgStyle,
  setTraject, suffix,
}) => (
  <div className='title-right'>
    <span>
      共显示  
      <span className='highlight'>{ total }</span>   
      条资源
    </span>
    <span>
      <Checkbox onChange={checkAll} checked={isCheckAll}>
        <IconFont type='icon-Select_All_Main'/>
        全选
      </Checkbox>
    </span>
    <span>
      <Checkbox onChange={checkInverse} checked={ischeckInverse}>
        <IconFont type='icon-Select_Other_Main'/>
        反选
      </Checkbox>
    </span>
    <span className={`select-list-toggle1-${suffix}`}>
      <SelectListPopover
        // type={type} 
        checkedChange={checkedChange}
        listData={listAll}
        selectIds={checkList}
        openDiaDetail={openDiaDetail}
      />
    </span>
    {/* {onImgStyleChange && (
      <ImgStyleSelect 
        className='page-size-select'
        onChange={onImgStyleChange}
        value={imgStyle}
      />
    )} */}
    <span className='set-trajectory'>
      <Button onClick={setTraject}>
         <i className="icon anticon">&#xf863;</i> 生成轨迹 
      </Button>
    </span>
  </div>
)