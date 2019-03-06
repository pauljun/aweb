import React from 'react';
import Table from 'src/view/SystemManagement/components/Table';
import Pagination from 'src/components/Pagination';
import DeviceIcon from 'src/components/DeviceIcon';
import { CommunityDeviceType } from 'src/libs/DeviceLib';
import { geoAddress } from 'src/libs/geoAddress';

class view extends React.Component {
  onChange =(page, pageSize) => {
    const { paginationChange } = this.props
    paginationChange && paginationChange({
      pageSize,
      page
    })
  }
  render() {
    const {
      dataSource,
      loading=false,
      searchData={},
      onChange,
      total=200,
      deviceGroup,
      showSN=false,
      ...props
    } = this.props;
    const columns = [
      {
        title: '设备名称',
        width:  200,
        dataIndex: 'deviceName',
        render: (name, record) => {
          return (
            <div className="device-table-name">
              <div title={name}>
                <DeviceIcon
                  type={record.deviceType}
                  status={record.deviceData}
                />
                {name}
              </div>
            </div>
          );
        }
      },
      {
        title: '设备类型',
        width: 65,
        dataIndex: 'deviceType',
        render: name => {
          let item = ''
          if(name === 103501 || name === 103502){
            item= {
              label: '门禁'
            }
          }else{
            item = CommunityDeviceType.find(item => item.value === name + '') || {}
          }
          return (
           <span>{item.label || '-'}</span>
          );
        }
      },
      {
        // filterDropdownVisible:false,
        // className:`${showSN} table-sn`,
        title: 'SN码',
        dataIndex: 'sn',
        width: 125,
        // render:(text) => {
        //   return(
        //     <span>{showSN? text:'' }</span>
        //   )
        // }
      },
      {
        title: '场所类型',
        width: 60,
        dataIndex: 'placeType',
        render: (name, record) => {
          name = record.placeType || record.installationSite
          let item = geoAddress.find(item => item.id === name + '') || {}
          return (
           <span>{item.name || '-'}</span>
          );
        }
      },
      {
        title: '分组信息',
        // width: 10,
        dataIndex: 'lyGroupId',
        render: (name, record) => {
          name = record.lyGroupId || record.lygroupId
          let item = deviceGroup.find(item => item.id === name + '') || {}
          return (
           <div className='ly-group-box' title={item.name}>{item.name || '-'}</div>
          );
        }
      }
    ];
    return (
      <div className="device-sollot-table-tl">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          scroll={{ y: '100%' }}
          {...props}
        />
        <Pagination
          total={total}
          pageSize={searchData.pageSize}
          current={searchData.page}
          onChange={this.onChange}
          pageSizeOptions={['60', '120', '180']}
          hasCurrent={false}
        />
      </div>
    );
  }
}

export default view;
