import React from 'react'
import {
  Radio,
} from 'antd'
const RadioGroup = Radio.Group
export default ({
  ifInclude,
  changeSearchData
}) => {
  return (
    <div className='user-container-search'>
    <div className='childrenOrg'>
      <div>包含子组织:</div>
      <RadioGroup value={ifInclude} onChange={e => changeSearchData({value:e.target.value , containSuborganization:0})} >
        <Radio value={1}>包含</Radio>
        <Radio value={0}>不包含</Radio>
      </RadioGroup>
    </div>
    </div>
  )
}