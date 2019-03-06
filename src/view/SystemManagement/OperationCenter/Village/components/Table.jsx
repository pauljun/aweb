import React from 'react';
import Table from '../../../components/Table';
import moment from 'moment'
class view extends React.Component {

  render() {
    const {
      dataSource,
      loading,
      ...props
    } = this.props;
    const columns = [
      {
        width: '6%',
        title: '序号',
        dataIndex: 'id',
        render(text, item, index) {
          return index + 1;
        }
      },
      {
        title: '小区名称',
        width: '25%',
        dataIndex: 'villageName'
      },
      {
        title: '小区地址',
        dataIndex: 'address',
        //width: '49%',
        render: v => <span title={v}>{v ? v : '-'}</span>
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '20%',
        render: v => <span>{moment(parseInt(v, 10)).format('YYYY.MM.DD HH:mm:ss')}</span>
      }
    ];
    return (
      <div className="center-device-container">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey='villageId'
          {...props}
        />
      </div>
    );
  }
}

export default view;
