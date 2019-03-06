import React from 'react';
import Table from '../../../components/Table';
import Pagination from 'src/components/Pagination';
import DeviceIcon from '../../../../../components/DeviceIcon';
// import { getKeyValue } from '../../../../../libs/Dictionary';
import { getKeyValue, getKeyLable } from 'src/libs/Dictionary';

class view extends React.Component {

  render() {
    const {
      dataSource,
      loading,
      total,
      searchData,
      onChange,
      goPage,
      updateDeviceOcId,
      deviceGroup=[],
      ...props
    } = this.props;
    const columns = [
      {
        width: '10%',
        title: '序号',
        dataIndex: 'id',
        render(text, item, index) {
          return index + 1;
        }
      },
      {
        title: '设备名称',
        width: '25%',
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
        dataIndex: 'sn',
        width: '20%'
      },
      {
        title: '设备类型',
        dataIndex: 'deviceType',
        width: '15%',
        render: (text, item, index) => {
          return (
            <span>
              {getKeyValue(
                'deviceType',
                `${
                  (item.manufacturerDeviceType === 103401 || item.manufacturerDeviceType === 103408)
                    ? item.deviceType
                    : item.manufacturerDeviceType
                }`
              )}
            </span>
          );
        }
      },
      {
        title: '场所类型',
        dataIndex: 'installationSite',
        width: '15%',
        render: (text) => {
					return <span>{text ? getKeyLable('geoAddress', text).label : '-'}</span>;
				}
      },
      {
        title: '分组类型',
        dataIndex: 'lygroupId',
        width: '15%',
        render: (text, item, index) => {
					let names=deviceGroup.filter((v) => v.id === text)[0]
					let str = text ? names && names.name ? names.name : '': '-';
					return (
						<span title={str} className="user-tr">
							{str}
						</span>
					);
				}
      }
    ];
    return (
      <div className="center-device-container">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          {...props}
        />
        <Pagination
          total={total}
          pageSize={searchData.pageSize}
          current={searchData.page}
          onChange={onChange}
        />
      </div>
    );
  }
}

export default view;
