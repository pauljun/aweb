import React, { Component } from 'react'
import { Radio } from 'antd';
import IconFont from 'src/components/IconFont'
const RadioGroup = Radio.Group;
const GroupRadio = (props) => {
  const { label = '标题', iconFont, data, name, value } = props
  return (
    <div className='item'>
      <div className='label-data-repository'>
        {iconFont && <IconFont 
          type={iconFont}
          className="data-repository-icon"/>}
        {label}：
      </div> 
      <div className='item-content'>
        {data && <RadioGroup onChange={(e) => props.change({[name]: e.target.value === '' ? null : e.target.value})} value={value===null ? '': value}>
          {
            data.map((v,index) => {
              return <Radio value={v.value || ''} key={v.value}>{v.label}</Radio>
            })
          }
        </RadioGroup>}
      </div>
    </div>
  )
}

export default GroupRadio;