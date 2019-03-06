import React from 'react';
import Table from '../../components/Table';
import Pagination from 'src/components/Pagination';
import DeviceIcon from '../../../../components/DeviceIcon';
import { getKeyValue } from '../../../../libs/Dictionary';

class view extends React.Component {
  onSelectChange = keys => {
    console.log(keys);
  };
  render() {
    const {
      dataSource,
      loading,
      total,
      searchData,
      onChange,
      ...props
    } = this.props;
    const columns = [
      {
        title: '设备名称',
        width: '50%',
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
        width: '30%',
        dataIndex: 'sn'
      },
      {
        title: '类型',
        width: '20%',
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
          scroll={{ y: '100%' }}
          {...props}
        />
        <Pagination
          simpleMode={true}
          total={total}
          pageSize={searchData.pageSize}
          current={searchData.page}
          onChange={(page, pageSize) =>
            onChange('allSearchData', page, pageSize)
          }
        />
      </div>
    );
  }
}

export default view;
