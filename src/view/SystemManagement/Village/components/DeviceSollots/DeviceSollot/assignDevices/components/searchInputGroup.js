import React, { Component } from 'react';
import { Select } from 'antd';
import { CommunityDeviceType } from 'src/libs/DeviceLib';
import { geoAddress } from 'src/libs/geoAddress';
import InputSearch from 'src/components/SearchInput';
const Option = Select.Option;
export default class SearchInputGroup extends Component {
  render(){
    const { title='未分配设备', deviceGroup, onChange, searchData } = this.props
    return (
      <div className='search-input-group'>
        <div className="item">
          <span className='device-title'>{title}</span>
        </div>
        <div className="item">
          <Select placeholder="请选择类型"
            value={searchData.deviceTypes}
            onChange={(v) => onChange({ deviceTypes: v })}
          >
            {CommunityDeviceType.map(item => 
              <Option key={item.value} value={item.value} title={item.label}>
                {item.label === '全部' ? '全部类型' : item.label}
              </Option>
            )}
          </Select>
          <Select placeholder="请选择场所" className='select-option'
            value={searchData.placeType}
            onChange={(v) => onChange({placeType: v})}
          >
            {geoAddress.map(item => (
              <Option key={item.id} value={item.id} title={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
          <Select placeholder="请选择分组" className='select-option'
            value={searchData.lyGroupId}
            onChange={(v) => onChange({lyGroupId: v})}
          >
            {deviceGroup.map(item => (
              <Option key={item.id} value={item.id} title={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
          <InputSearch className='search-tlzj'
            placeholder='请输入设备名称或SN'
            onSearch={(v) => onChange({keyWord: v})}
            />
        </div>
      </div>
    )
  }
} 