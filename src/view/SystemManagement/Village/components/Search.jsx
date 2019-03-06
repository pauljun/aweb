import React from 'react';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import { Input, Button } from 'antd';
const Search = Input.Search;

export default ({ value, onChange, goPage }) => {
  return (
    <div className="village-table-search">
      <Search
        placeholder="请输入您想搜索的内容"
        enterButton
        defaultValue={value}
        onSearch={value =>
          onChange({
            key: value
          })
        }
      />
      {/* <AuthComponent actionName="VillageAdd">
        <Button
          className="orange-btn"
          icon="user"
          onClick={() => goPage('SystemManagement', 'VillageDetail',{type:1,isAdd:true})}
        >
          新建小区
        </Button>
      </AuthComponent> */}
    </div>
  );
};
