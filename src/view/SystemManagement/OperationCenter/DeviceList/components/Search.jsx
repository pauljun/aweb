import React from 'react';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import { Input, Button } from 'antd';
const Search = Input.Search;

export default ({ searchData, onChange, goPage }) => {
  return (
    <div className="setting-search">
      <Search
        placeholder="请输入您想搜索的内容"
        enterButton
        className="search-item"
        defaultValue={searchData.deviceName}
        onSearch={value =>
          onChange({
            deviceName: value,
            page:1
          })
        }
      />
      <AuthComponent actionName="CenterAssignedDevice">
        <Button
          icon="user"
          type="primary"
          className="search-item orange-btn"
          onClick={() => goPage('SystemManagement', 'CenterAssignedDevice')}
        >
          分配设备
        </Button>
      </AuthComponent>
    </div>
  );
};
