import React from 'react'
import {Input} from 'antd'
const Search = Input.Search;
export default ({
  searchData,
  onChange
}) => {
  return (
    <div className='org-wrapper-search'>
      <div className='search-group'>
        <Search
          placeholder="请输入组织名称搜索"
          enterButton
          onSearch={value => onChange({key:value, pageNo: 1})}
          defaultValue={searchData.key}
        />
      </div>
    </div>
  )
}