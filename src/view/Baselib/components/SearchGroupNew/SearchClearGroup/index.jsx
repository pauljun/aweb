import React from 'react';
import { Button } from 'antd';

const SearchClearGroup = props => {
  return (
    <div className='search-btn-group'>
      <Button onClick={() => props.clear()}>重置</Button>
      <Button type='primary' onClick={() => props.search()}>查询</Button>
    </div>
  )
}

export default SearchClearGroup;