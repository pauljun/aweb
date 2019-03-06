import React from 'react';
import { Select } from 'antd';
import IconFont from 'src/components/IconFont'
import ColorSpan from './colorSpan'
const Option = Select.Option;

const getOption = (v) => {
  if(v.text === '全部'){
    return <IconFont 
    className='icon-all-color'
    type={'icon-Skin_Main'}/>
  }else if(v.text === '花色'){
    return <ColorSpan />
  }else {
    return <span 
    className={`color-bg ${v.text === '白色' ? 'bg-border-white' : ''}`} 
    style={{
      'backgroundColor':v.label,
      width:'14px', 
      height:'14px',
      display:'inline-block'
    }}></span>
  }
}
const ColorSelect = (
  {
    label, 
    iconFont, 
    placeholder, 
    change, 
    // 上衣数据
    nameUpper, 
    valueUpper, 
    dataUpper=[],
    // 下衣数据
    nameLower, 
    valueLower, 
    dataLower=[],
    activeTabId
  }
) => {
  return ( 
    <div className='item'>
      <div className='label-data-repository'>
        {iconFont && <IconFont 
          type={iconFont}
          className="data-repository-icon"/>}
        {label}：
      </div> 
      <div className='item-content color-select-tlzj' id={`a-${activeTabId}`}>
        <Select 
          placeholder={placeholder}
          onChange={(v) => change({[nameUpper]: v})}
          value={valueUpper}
          showSearch
          optionFilterProp="children"
          className='color-select'
          getPopupContainer={() => document.getElementById(`a-${activeTabId}`)}
        >
          {dataUpper.map(v => {
            return <Option value={v.value} key={v.value}>
               {getOption(v)} 
               {v.text} 
              </Option>        
          })}
        </Select>
        <Select 
          placeholder={placeholder}
          onChange={(v) => change({[nameLower]: v})}
          value={valueLower}
          showSearch
          optionFilterProp="children"
          className='color-select'
          getPopupContainer={() => document.getElementById(`a-${activeTabId}`)}
        >
          {dataLower.map(v => {
            return <Option value={v.value} key={v.value}>
              {getOption(v)}
              {v.text}</Option>        
          })}
        </Select>
      </div>
    </div>
  )
}

export default ColorSelect;