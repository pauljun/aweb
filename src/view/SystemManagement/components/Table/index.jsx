import React from 'react';
import { Table } from 'antd';
import './index.scss';

const ConfigTable = ({
  title,
  dataSource,
  columns,
  rowKey,
  loading,
  ...props,
}) => {
  return (
    <div className='setting-table'>
      <Table
        columns={columns}
        rowKey={rowKey ? rowKey : 'id'}
        locale={{ emptyText: '暂无数据' }}
        dataSource={dataSource}
        pagination={false}
        loading={loading}
        {...props}
      />    
    </div>
  );
};
export default ConfigTable;
