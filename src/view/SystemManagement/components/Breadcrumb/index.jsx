import React from 'react';
import IconFont from '../../../../components/IconFont';
import { Breadcrumb } from 'antd';
import './index.scss';

export default ({ list, ...props }) => {
  return (
    <div className="setting-breadcrumb-container">
      <Breadcrumb separator={'>'}>
        {list.map((v, i) => (
          <Breadcrumb.Item key={v.id}>
            {i === 0 && <IconFont type="icon-TreeIcon_index_Main" />}
            {v.name}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
      {props.children}
    </div>
  );
};
