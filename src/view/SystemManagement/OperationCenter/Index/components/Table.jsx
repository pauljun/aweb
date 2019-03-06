import React from 'react';
import Table from '../../../components/Table';
import Pagination from 'src/components/Pagination';
import { withRouter } from 'react-router-dom';
import IconFont from '../../../../../components/IconFont';
import { inject } from 'mobx-react';
import {
  Modal
} from 'antd';
const confirm = Modal.confirm

@withRouter
@inject('TabStore')
class view extends React.Component {
  del(id) {
    confirm({
      title: '确定删除当前运营中心吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props.del(id)
      }
    });
  }
  render() {
    const {
      dataSource,
      loading,
      total,
      searchData,
      onChange,
      goPage,
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
        width: '15%',
        title: '运营中心名称',
        dataIndex: 'centerName',
        render(text, item) {
          return (
            <a
              onClick={() =>
                goPage('SystemManagement', 'CenterDetail', {
                  id: item.id,
                  type: 1,
                  name: escape(item.centerName)
                })
              }
            >
              {text}
            </a>
          );
        }
      },
      {
        width: '12%',
        title: '联系人姓名',
        dataIndex: 'contactPerson'
      },
      {
        width: '10%',
        title: '联系人电话',
        dataIndex: 'contactPhone'
      },
      {
        width: '12%',
        title: '登录账号',
        dataIndex: 'loginName'
      },
      {
        width: '15%',
        title: '系统名称',
        dataIndex: 'systemName'
      },
      {
        width: '10%',
        title: '设备数量(台)',
        dataIndex: 'cameraTotal'
      },
      {
        width: '10%',
        title: '小区数量(个)',
        dataIndex: 'villageNum'
      },
      {
        title: '操作',
        dataIndex: 'tools',
        render: (text, item) => (
          <div className="table-tools">
            <IconFont
              type="icon-View_Main"
              style={{ cursor: 'pointer' }}
              title="运营中心信息"
              onClick={() =>
                goPage('SystemManagement', 'CenterDetail', {
                  id: item.id,
                  type: 1,
                  isEdit: true,
                  name: escape(item.centerName)
                })
              }
            />

            <IconFont
              type="icon-Camera_Main2"
              style={{ cursor: 'pointer' }}
              title="分配设备"
              onClick={() =>
                goPage('SystemManagement', 'CenterDetail', {
                  id: item.id,
                  type: 2,
                  isEdit: true,
                  name: escape(item.centerName)
                })
              }
            />

            <IconFont
              type="icon-Allocation_One_Main"
              style={{ cursor: 'pointer' }}
              title="分配小区"
              onClick={() =>
                goPage('SystemManagement', 'CenterDetail', {
                  id: item.id,
                  type: 3,
                  isEdit: true,
                  name: escape(item.centerName)
                })
              }
            />

            <IconFont
              type="icon-Delete_Main"
              style={{ cursor: 'pointer' }}
              onClick={() => this.del(item.id)}
              title="删除"
            />
          </div>
        )
      }
    ];
    return (
      <div className="optCenter-container">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          {...props}
        />
        <Pagination
          total={total}
          pageSize={searchData.pageSize}
          current={searchData.pageNo}
          onChange={onChange}
        />
      </div>
    );
  }
}

export default view;
