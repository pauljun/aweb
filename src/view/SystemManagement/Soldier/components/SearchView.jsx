import React from 'react';
import { Input} from 'antd';
import './SearchView.scss';

const Search = Input.Search;

export default ({ searchData, onSearch }) => (
  <div className="soilder-search-wrapper">
    <div className='search-left'></div>
    <div className='search-right'>
      <Search
        placeholder="请输入单兵名称"
        enterButton
        // defaultValue={searchData.deviceName}
        onSearch={deviceName => onSearch({ deviceName })}
      />
    </div>
  </div>
);


/* 
  预留： 包含子组织组件
  <div className='childrenOrg'>
    <div>包含子组织:</div>
    <RadioGroup value={ifInclude} onChange={e => changeSearchData({value:e.target.value,isHadChild: e.target.checked})} >
      <Radio value='include'>包含</Radio>
      <Radio value='exclusive'>不包含</Radio>
    </RadioGroup>
  </div> 
  
*/