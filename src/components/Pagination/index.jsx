import React, { Component } from 'react';
import { Pagination } from 'antd';
import './index.scss';

class PaginationView extends Component {
  showTotal = total => {
    const { current, pageSize, hasCurrent = true } = this.props;
    const totalPage = Math.ceil(total / pageSize);
    return hasCurrent ? `第${current}页 | 共${totalPage}页 / 共${total}条记录` : `共${totalPage}页 / 共${total}条记录`;
  };

  render() {
    const {
      total,
      pageSize,
      current,
      pageSizeOptions,
      onChange,
      simpleMode,
      ...rest
    } = this.props;
    if (!total || total === 0) {
      return null;
    }
    return (
      <Pagination
        className="pagination-layout"
        style={{ textAlign: 'center' }}
        hideOnSinglePage={false}
        total={total}
        pageSize={pageSize}
        current={current}
        onShowSizeChange={onChange}
        onChange={onChange}
        showTotal={simpleMode !== true ? this.showTotal : null}
        pageSizeOptions={pageSizeOptions || ['10', '20', '50', '100', '200']}
        showSizeChanger
        showQuickJumper
        {...rest}
      />
    );
  }
}

export default PaginationView;
