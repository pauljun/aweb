import React from 'react';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import { Input, Button } from 'antd';

const Search = Input.Search;

export default ({ searchData, onChange, goPage }) => {
  return (
    <div className="user-container-search">
      <Search
        placeholder="请输入角色名称"
        enterButton
        defaultValue={searchData.roleName}
        onSearch={value =>
          onChange({
            roleName: value
          })
        }
      />
      <AuthComponent actionName="RoleAdd">
        <Button
          icon="plus"
          type="primary"
          className="orange-btn"
          onClick={() => goPage('SystemManagement', 'RoleAdd')}
        >
          新建角色
        </Button>
      </AuthComponent>
    </div>
  );
};
