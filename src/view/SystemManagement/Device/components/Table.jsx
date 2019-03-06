import React from 'react';
import { observer } from 'mobx-react';
import Table from '../../components/Table';
import Pagination from 'src/components/Pagination';
import AuthComponent from '../../../BusinessComponent/AuthComponent';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import IconFont from '../../../../components/IconFont';
import { getKeyValue } from '../../../../libs/Dictionary';
import DeviceIcon from '../../../../components/DeviceIcon';
import { withRouter } from 'react-router-dom';

@withRouter
@BusinessProvider('OrgStore', 'TabStore')
@observer
class view extends React.Component {
  render() {
    const {
      dataSource,
      loading,
      total,
      searchData,
      onChange,
      OrgStore,
      ...props
    } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'deviceName',
        width: '35%',
        align: 'left',
        render: (name, record) => {
          return (
            <div className="device-table-name">
              <span>
                <DeviceIcon
                  type={record.deviceType}
                  status={record.deviceData}
                />
                {record.manufacturerDeviceType === 103401 ? (
                  <a
                    onClick={() => {
                      const { TabStore, history } = this.props;
                      TabStore.goPage({
                        moduleName: 'SystemManagement',
                        childModuleName: 'DeviceDetailView',
                        data: { id: record.id },
                        state: { isView: true },
                        history
                      });
                    }}
                  >
                    {name}
                  </a>
                ) : (
                  name
                )}
              </span>
            </div>
          );
        }
      },
      {
        title: 'SN码',
        dataIndex: 'sn',
        width: '15%',
        key: '3'
      },
      {
        title: '所属组织',
        dataIndex: 'organizationIds',
        key: '4',
        width: '18%',
        render: item => {
          let orgItem = OrgStore.orgList.filter(
            v => item.indexOf(v.id) > -1
          )[0];
          if (!orgItem) {
            return null;
          }
          return (
            <span title={OrgStore.getOrgTreeText(orgItem.id)}>
              {orgItem.name}
            </span>
          );
        }
      },
      {
        title: '类型',
        dataIndex: 'deviceType',
        key: '6',
        width: '10%',
        render: (text, item, index) => {
          return (
            <span>
              {getKeyValue(
                'deviceType',
                `${
                  item.manufacturerDeviceType === 103401||103408
                    ? item.deviceType
                    : item.manufacturerDeviceType
                }`
              )}
            </span>
          );
        }
      },
      {
        title: '经纬度',
        dataIndex: 'address',
        key: '10',
        width: '10%',
        render: (text, item, index) => {
          return (
            <span>{item.latitude && item.longitude ? '已设置' : '未设置'}</span>
          );
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: '13',
        width: '10%',
        render: (text, item, index) => {
          return (
            <div className="table-tools">
              <AuthComponent actionName="MapLabel">
                <IconFont
                  type="icon-_LocusAnalysis"
                  onClick={() => this.props.changePoint([item])}
                  title="地图标注"
                />
              </AuthComponent>
              {item.manufacturerDeviceType === 103401 && (
                <AuthComponent actionName="DeviceEdit">
                  <IconFont
                    onClick={() => {
                      const { TabStore, history } = this.props;
                      TabStore.goPage({
                        moduleName: 'SystemManagement',
                        childModuleName: 'DeviceEdit',
                        data: { id: item.id },
                        history
                      });
                    }}
                    type="icon-Edit_Main"
                    title="编辑"
                  />
                </AuthComponent>
              )}
              <AuthComponent actionName="DeviceAssigned">
                <IconFont
                  type="icon-Export_Main"
                  onClick={() => this.props.changeOrg([item.id])}
                  title="分配"
                />
              </AuthComponent>
            </div>
          );
        }
      }
    ];
    return (
      <div className="device-container" key="device">
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
