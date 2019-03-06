import React from 'react';
import Table from '../../components/Table';
import Pagination from 'src/components/Pagination';
import { Switch ,message} from 'antd';
import { getCacheItem } from 'src/utils';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import ModalDelete from 'src/components/ModalComponent'
import { getKeyValue } from 'src/libs/Dictionary';
import IconFont from '../../../../components/IconFont';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider'

const ADMIN_CODE = 100702;
@BusinessProvider('OrgStore')
class UserTable extends React.Component {
  state={
    deleteShow: false,
    deleteInfo: '',
  }
  componentDidMount() {
    const { deleteRef } = this.props;
    deleteRef && deleteRef(this)
  }
  // 取消删除弹窗
  deleteCancel = () => {
    this.setState({
      deleteShow:false, 
      deleteInfo: ''
    })
  }

  // 显示删除弹窗
  deleteAction = (item) => {
    this.setState({
      deleteShow:true,
      deleteInfo:item
    })
  }

  deleteOk = (deleteInfo) => {
    this.props.deleteOk(deleteInfo).then(() => {
      message.success(`删除${deleteInfo.loginName}成功`)
      this.deleteCancel();
    })
  }

  goPage = (moduleName, childModuleName, item) => {
    this.props.goPage({
      moduleName,
      childModuleName,
      state: {
        id: item.id,
        name: item.loginName
      },
    });
  };
  //批量删除操作
  deleteGroup = (selectedRowKeys,selectedRows) => {
    let deleteGroupInfo = []
    selectedRows.map(v => {
      deleteGroupInfo.push(v.loginName)
    })
    this.setState({
      deleteShow:true,
      deleteInfo:{loginName:deleteGroupInfo.join(' 、')},
    })
  }
  render() {
    const userInfo = getCacheItem('userInfo') || {};
    const userGrade = userInfo.userGrade;
    const {
      dataSource,
      total,
      loading,
      searchData,
      onChange,
      changeStatus,
      className,
      roleList,
      ...props,
    } = this.props;
    const { deleteShow, deleteInfo } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        width: '10%',
        render: (text, record, index) => index + 1
      },
      {
        title: '用户名',
        width: '10%',
        dataIndex: 'loginName',
        render: (text, item) => {
          const allowClick =
            item.userType !== ADMIN_CODE &&
            userInfo.id !== item.id &&
            userGrade > item.userGrade;
            const className = allowClick ? '' : 'disabled';
          return (
            <a
              className={className}
              onClick={() => allowClick && this.goPage('User', 'UserCheck', item)}
            >
              {text}
            </a>
          );
        }
      },
      { 
        title: '姓名', 
        width: '12%', 
        dataIndex: 'realName', 
      },
      {
        title: '用户角色',
        width: '10%',
        dataIndex: 'roleId',
        render : roleId => {
            let roleInfo = roleList.find(item => item.id == roleId) || {};
            return roleInfo.roleName
        }
      },
      {
        title: '性别',
        width: '8%',
        dataIndex: 'userSex',
        render: key => {
          const sex = getKeyValue('sex', key);
          return sex === '全部' ? '未知' : sex;
        }
      },
      { 
        title: '手机号', 
        width: '12%', 
        dataIndex: 'phoneNum' 
      },
      {
        title: '所属组织',
        dataIndex: 'organizationId',
        width: '15%',
        render: (text, item) => {
          const { OrgStore } = this.props;
          let orgItem = OrgStore.orgList.find(v => text == v.id);
          return orgItem ? (
            <span title={OrgStore.getOrgTreeText(orgItem.id)}>
              {orgItem.name}
            </span>
          ): null;
        }
      },
      {
        title: '级别',
        width: '8%',
        dataIndex: 'userGrade'
      },
      {
        title: '状态',
        width: '7%',
        dataIndex: 'validState',
        render: (status, item) => {
          let disabledDom =
            item.userType === ADMIN_CODE ||
            item.id === userInfo.id ||
            userGrade <= item.userGrade ||
            !window.GlobalStore.MenuStore.getAuthAction('UserOperata');
          return (
            <Switch
              className='user-Switch'
              size="small"
              checked={status === 104406}
              disabled={disabledDom}
              onChange={() => changeStatus(item)}
            />
          );
        }
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: '8%',
        render: (text, item) => {
          const allowClick = item.userType !== ADMIN_CODE && item.id !== userInfo.id
          const disabledDom = item.userType === ADMIN_CODE || item.id === userInfo.id
          const showHandle = userGrade > item.userGrade;
          return (
            showHandle &&
            <div className="table-tools">
              <AuthComponent actionName="UserOperata">
                <IconFont
                  type="icon-Edit_Main"
                  style={{ cursor: 'pointer' }}
                  title="编辑"
                  disabled = {disabledDom}
                  onClick={() => allowClick&&this.goPage('User', 'UserEdit', item)}
                />
              </AuthComponent>
              <AuthComponent actionName="UserOperata">
                <IconFont
                  type="icon-Delete_Main"
                  style={{ cursor: 'pointer' }}
                  title="删除"
                  disabled = {disabledDom}
                  onClick={() => allowClick && this.deleteAction(item)}
                />
              </AuthComponent>
            </div>
          )
        }
      }
    ];
    return (
      <React.Fragment>
        <Table
          rowSelection={this.props.rowSelection}
          className={className}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          {...props}
        />
        <Pagination
          total={total}
          pageSize={searchData.pageSize}
          current={searchData.pageNum}
          onChange={onChange}
        />
        <ModalDelete 
          visible={deleteShow}
          onOk = {() => this.deleteOk(deleteInfo)}
          onCancel = {this.deleteCancel}
          title= '删除确认'
          img = 'delete'
        >
          <p style={{textAlign: 'center'}}>
            确定删除 <span className='highlight'>{deleteInfo.loginName}</span>
          </p>
        </ModalDelete>
      </React.Fragment>
    );
  }
}
export default UserTable;
