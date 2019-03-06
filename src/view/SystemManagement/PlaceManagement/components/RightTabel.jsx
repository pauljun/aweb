import React from 'react';
import Table from '../../components/Table';
import Pagination from 'src/components/Pagination';
import DeviceIcon from '../../../../components/DeviceIcon';
import { getKeyValue } from '../../../../libs/Dictionary';
import { inject } from 'mobx-react';

class view extends React.Component {
  render() {
    const {
      dataSource,
      loading,
      total,
      searchData,
      onChange,
      selectKeys,
      setSelectKeys
    } = this.props;
    const columns = [
      {
        title: '设备名称',
        width:"50%",
        dataIndex: 'deviceName',
        render: (name, record) => {
          return (
            <div className="device-table-name">
              <span>
                <DeviceIcon
                  type={record.deviceType}
                  status={record.deviceData}
                />
                {name}
              </span>
            </div>
          );
        }
      },
      {
        title: 'SN码',
        width:"30%",
        dataIndex: 'sn'
      },
      {
        title: '类型',
        width:"20%",
        dataIndex: 'deviceType',
        render: (text, item, index) => {
          return (
            <span>
              {getKeyValue(
                'deviceType',
                `${
                  item.manufacturerDeviceType === 103401
                    ? item.deviceType
                    : item.manufacturerDeviceType
                }`
              )}
            </span>
          );
        }
      }
    ];
    return (
      <div className="device-sollot-table">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectKeys,
            onChange: setSelectKeys
          }}
          scroll={{ y: '100%' }}
        />
        <Pagination
        simpleMode={true}
          total={total}
          pageSize={searchData.pageSize}
          current={searchData.page}
          onChange={(page, pageSize) => onChange('searchData', page, pageSize)}
        />
      </div>
    );
  }
}

export default view;
