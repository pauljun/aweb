import React from 'react';
import { Select} from 'antd';

const Option = Select.Option;

const imgStyleOptions = [
  {value: "1", label: '小图'},
  {value: "2", label: '标准'},
  {value: "3", label: '大图'},
]

export default ({className='', value, onChange}) => (
  <span className={`${className}`}>
    <Select value={''+value} onChange={onChange}>
      {imgStyleOptions.map(v => (
        <Option key={v.value} value={v.value}>{v.label}</Option>
      ))}
    </Select>
  </span>
)