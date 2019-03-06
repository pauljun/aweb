import React, { Component } from 'react'
import { Select } from 'antd';
import IconFont from 'src/components/IconFont'
const Option = Select.Option
class GroupSelect extends Component {
  render(){
    const { label = '标题', iconFont, data, value, placeholder, change, name } = this.props
    return (
      <div className='item'>
      <div className='label-data-repository'>
        {iconFont && <IconFont 
          type={iconFont}
          className="data-repository-icon"/>}
        {label}：
      </div> 
      <div className='item-content'>
        <Select 
          placeholder={placeholder}
          onChange={(v) => change({[name]: v})}
          value={value}
          showSearch
          optionFilterProp="children"
          className='car-search'
        >
          {data.map(v => {
            return <Option value={v.value} key={v.value}>{v.label}</Option>        
          })}
        </Select>
      </div>
    </div>
    )
  }
}

export default GroupSelect;