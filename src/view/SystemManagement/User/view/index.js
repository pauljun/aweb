import React from 'react';
import { Input,Button} from 'antd';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Title from '../../components/Title';
import Container from '../../components/Container';
import UserTable from '../components/Table.js';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import Breadcrumb from '../../components/Breadcrumb';
import SearchOrg from '../components/Search.js';
import HeadTitle from '../components/Head.jsx';
import EventEmitter from 'src/libs/Socket';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import LogsComponent from 'src/components/LogsComponent';
import IconSpan from 'src/components/IconSpan';

import '../index.scss';
const Search = Input.Search;

@withRouter
@LogsComponent()
@BusinessProvider('OrgStore', 'UserManagementStore', 'TabStore','RoleManagementStore','MenuStore')
@observer
export default class UserView extends React.Component {
  state = {
    list: [],
    loading: false,
    ifInclude: 0, // 是否包含子组织
    roleList:[],
    clickedOrgInfo:null, 
    selectedRowKeys:[],
    selectedRows:null
  };
  componentWillMount(){
    const { UserManagementStore } = this.props
    UserManagementStore.initData()  
  }
  componentDidMount(){
    EventEmitter.on('UPDATE_OrgTree_LIST', this.updateOrgTreeList)
  }
  componentWillUnmount(){
    EventEmitter.off('UPDATE_OrgTree_LIST', this.updateOrgTreeList);
  }

  // 监听组织更新
  updateOrgTreeList = (dataInfo, type='emitEvent') => {
    this.leafClk([dataInfo.organizationId], type)
  }

  /**子节点点击事件 */
  leafClk = (key, type) => {
    if(!key || !key.length){
      return
    }
    const { UserManagementStore, OrgStore } = this.props;
    const parentOrgList = OrgStore.getParentOrgListByOrgId(key[0]);
    const infoByOrgId =parentOrgList[0]
    if(type && type==='emitEvent'){
      let expandkeys = parentOrgList.map(v => v.id);
      const arr = expandkeys.filter(v => v!==key[0]);
      this.orgTree.onExpand(arr)
    }
    UserManagementStore.setData({
      activeKey: key
    });
    this.getUserList();
    this.setState({
      clickedOrgInfo:infoByOrgId ? infoByOrgId.id : ''
    })
  }
  /**查询 */
  getUserList = () => {
    const { RoleManagementStore, UserManagementStore } = this.props;
    this.setState({ loading: true });
    RoleManagementStore.getList({pageSize:999,pageNum:1}).then(({ result }) => {
      this.setState({ roleList: result.list })  
    })
    UserManagementStore.getUserList().then(({ result }) => {
      this.setState({
        list: result.list,
        total: result.total,
        loading: false
      });
    });
  };
  /**删除弹窗确定 */
  deleteOk = item => {
    const { UserManagementStore } = this.props;
    return UserManagementStore.delUser(item).then(() => {
      this.getUserList();
      return Promise.resolve()
    })
  }

  // 包含子组织
  changeSearchData = ({value}) => {
    this.setState({
      ifInclude: value
    })
    this.editSearchData({ containSuborganization:value })
  }
  // 查询条件改变并查询
  editSearchData = (options) => {
    this.props.UserManagementStore.editSearchData(options).then(this.getUserList);
  }
  /**分页切换查询 */
  onPageChange = (pageNum, pageSize) => {
    this.editSearchData({
      pageSize, pageNum
    });
  };
  keyWordsSearch = (searchFilter) => {
    this.editSearchData({
      searchFilter,
      pageNum: 1
    })
  }
  /**新增用户 */
  goPage = ({moduleName, childModuleName, state}) => {
    this.props.TabStore.goPage({
      moduleName,
      childModuleName,
      history: this.props.history,
      isUpdate: false,
      state
    });
  };
  handleAddUser = () => {
    this.goPage({
      moduleName:'SystemManagement', 
      childModuleName: 'UserAdd', 
      state: {
        orgId: this.state.clickedOrgInfo
      }
    })
  }
  changeStatus = item => {
    const { UserManagementStore } = this.props;
    UserManagementStore.changeUserStatus({
      userId: item.id,
      status: item.validState == 104406 ? 104405 : 104406,
      loginName: item.loginName
    }).then(this.getUserList);
  };
  //批量删除操作
  deleteGroup = () => {
    const { selectedRowKeys,selectedRows} = this.state
    this.deleteGroupInfo.deleteGroup(selectedRowKeys,selectedRows)
  }
  render() {
    const { OrgStore, UserManagementStore } = this.props;
    let { list, total, loading, ifInclude, roleList,selectedRowKeys,selectedRows} = this.state;
    const { searchData, activeKey } = UserManagementStore;
    const BreadcrumbList = OrgStore.getParentOrgListByOrgId(activeKey[0]).reverse()
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows
        })
      },
    };
    return (
      <Container
        allowClear={true}
        title='用户管理'
        treeActiveKey={activeKey}
        leafClk={this.leafClk}
        viewRef={orgTree => this.orgTree = orgTree}
      >
        <div className="user-breadCrumb">
          <Breadcrumb list={BreadcrumbList}/>
        </div>
        <div className="user-content">
          <div className='user-searchTitle'>
            <SearchOrg
              changeSearchData={this.changeSearchData}
              ifInclude={ifInclude}
            />
          </div>
          <div className='user-listTitle'>
            <Title name='直属用户列表'>
              <div className='user-Search-Btns' >
                <Search
                  placeholder="请输入用户名或手机号查询"
                  style={{width:'250px'}}
                  enterButton
                  defaultValue={searchData.searchFilter}
                  onSearch={this.keyWordsSearch}
                />  
                <AuthComponent actionName="UserAdd">
                  <HeadTitle
                    goPage={this.handleAddUser}
                    icon="plus"
                    label="新建用户"
                    className="orange-btn setting-user-add"
                  />
                </AuthComponent>
                <AuthComponent actionName="userDeleteAction">
                  <Button
                    className="orange-btn form-btn-group"
                    style={{marginLeft:'10px'}}
                    disabled={selectedRowKeys.length===0}
                    onClick={this.deleteGroup}
                  >
                    <IconSpan icon="icon-Delete_Main"/>
                      批量删除  
                  </Button>
                </AuthComponent>
              </div>
            </Title>
          </div>
          <UserTable
            deleteRef = { deleteGroup => { this.deleteGroupInfo = deleteGroup}}
            rowSelection={!this.props.MenuStore.getAuthAction("userDeleteAction") ? null:rowSelection}
            className="user-content-table"
            deleteOk={this.deleteOk}
            dataSource={list}
            loading={loading}
            total={total}
            searchData={searchData}
            onChange={this.onPageChange}
            changeStatus={this.changeStatus}
            scroll={{ y: '100%' }}
            // scroll={{ y: '300px' }}
            roleList={roleList}
            goPage={this.goPage}
          />
        </div>
      </Container>
    );
  }
}
