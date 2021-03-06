import React from 'react';
import { message, Button } from 'antd';
import { observer } from 'mobx-react';
import Table from '../components/Table';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import SoldierModal from '../components/SoldierModal';
import Title from '../components/Title';
import SearchView from '../components/SearchView';
import CenterHeader from '../components/CenterHeader';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import LogsComponent from 'src/components/LogsComponent';
import IconSpan from 'src/components/IconSpan';

import './index.scss';

@LogsComponent()
@BusinessProvider(
  'OrgStore',
  'SoldierStore',
  'UserStore',
  'DeviceManagementStore'
)
@observer
export default class Soldier extends React.Component {
  state = {
    list: [],
    total: 10,
    loading: false,
    // 弹窗
    modalVisible: false,
    content: 1, // 1: 解绑弹窗， 2: 编辑弹窗, 3: 添加弹窗
    
    // 编辑单兵弹窗
    firstClick: true,
    confirmLoading: false,
    isEdit: false,
    editItem: {}, // 编辑单兵时单个单兵信息
    userList: [], // 右侧用户列表
    selectUser: null, // 右侧选中用户信息
    activeOrgIds:[], // 左侧选中组织的id集合


    //解除绑定信息
    unbindInfo:'',

    //包含子组织
    ifInclude:'exclusive',

    //弹窗组织信息
    //批量解除绑定
    selectedRowKeys:[],
    selectedRows:null
  };

  componentDidMount() {
    const { UserStore, SoldierStore} = this.props;
    SoldierStore.initData()
    SoldierStore.editSearchData({
      operationCenterIds: [UserStore.userInfo.optCenterId]
    })
    this.handleSearch(true);
  }
  // 搜索 resetPage: true: 从第一页开始搜索
  handleSearch = async (resetPage) => {
    const { SoldierStore } = this.props;
    if(resetPage) {
      await SoldierStore.editSearchData({ page: 1 });
    }
    this.setState({ loading: true });
    const { result } = await SoldierStore.getList();
    this.setState({
      total: result.size,
      list: result.list,
      loading: false
    });
  };
  // 修改查询条件
  editSearchData = (options, resetPage=true) => {
    const { SoldierStore } = this.props;
    SoldierStore.editSearchData(options).then(() => {
      this.handleSearch(resetPage);
    })
  };
  // 分页切换查询
  handlePageChange = (page, pageSize) => {
    this.editSearchData({ page, pageSize }, false)
  };

  // Tree组件渲染时调用一次（处理已绑定单兵用户展开的组织）
  firstClickLeaf = (bindUser) => {
    const { OrgStore } = this.props;
    const parentOrgList = OrgStore.getParentOrgListByOrgId(bindUser.organizationId);
    let expandkeys = parentOrgList.map(v => v.id);
    const arr = expandkeys.filter(v => v !== bindUser.organizationId);
    this.orgTree.onExpand(arr);
  }
  // 获取组织下的用户
  getUserListByOrgId = async (organizationId) => {
    const { UserStore } = this.props;
    const params = {
      searchFilter: '',
      pageNum: 1,
      pageSize: 500,
      organizationId,
      containSuborganization: 0, // 不包含子组织用户
    };
    const { result } = await UserStore.getUserList(params);
    const list = result && result.list;
    return list;
  }
  /**
   * 树节点点击节点事件
   *    clickKey: 点击节点的 key 值
   */
  clickLeaf = (clickKey, isEdit) => { 
    const { firstClick, editItem:{ bindUser }, selectUser } = this.state;
    if(firstClick){
      this.setState({ firstClick: false })
      if(bindUser){
        clickKey = [bindUser.organizationId]
        this.firstClickLeaf(bindUser);
      }
    }
    this.getUserListByOrgId(clickKey[0]).then(list => {
      const options = {
        userList: list || [],
        activeOrgIds: clickKey
      }
      if(selectUser) {
        options.selectUser = bindUser || '';
      }
      this.setState(options);
    })
  };
  // 显示新建单兵弹窗
  handleAddSoldier = () => {
    this.setState({
      content:2,
      isEdit: false,
      modalVisible: true,
      userList: [],
      editItem: {},
    });
  };
  // 显示编辑单兵弹窗
  editAction = (editItem) => {
    let selectUser;
    if(editItem.bindUser) {
      selectUser = editItem.bindUser;
    }
    this.setState({
      content:2,
      isEdit: true,
      modalVisible: true,
      firstClick: true,
      selectUser,
      editItem,
    });
  }
  // 弹窗选中用户事件
  clickUserName = (item) => {
    const { userList, selectUser } = this.state;
    let newSelectUser='';
    if(!selectUser || selectUser.id !== item.id) {
      const userItem = userList.find(v => v.id === item.id);
      newSelectUser = userItem;
    }
    this.setState({
      selectUser:  newSelectUser,
    });
  }
  
  // 编辑、添加单兵确定事件
  handleOk = async (newName) => {
    const { isEdit, selectUser, editItem } = this.state;
    this.setState({ confirmLoading: true })
    // 新建单兵
    if (!isEdit) { 
      const result = await this.addSoldier(newName);
      return this.bindSoldier(result.deviceId, newName);
    }
    // 编辑单兵
    const bindUser = editItem.bindUser; 
    // 编辑单兵名称
    if (editItem.deviceName !== newName) {
      editItem.deviceName = newName;
      await this.updateSoldierName(editItem, newName)
      // 绑定用户没变
      if(bindUser && selectUser && selectUser.id === bindUser.id) {
        this.handleSearch();
      }
    }
    // 未绑定
    if(!bindUser) { 
      return this.bindSoldier(editItem.id, editItem.deviceName);
    } 
    // 已绑定
    // 未选择用户：解绑
    if(!selectUser) {
      return this.unbindOk({userId: bindUser.id, deviceId: editItem.id}, {
        soldierName: editItem.deviceName,
        loginName: bindUser.loginName
      });
    } 
    // 选择了不同用户： 解绑 重新绑定
    if(selectUser.id !== bindUser.id) {
      await this.unbindSoldier(bindUser.id, editItem.id, {
        soldierName: editItem.deviceName,
        loginName: bindUser.loginName
      });
      return this.bindSoldier(editItem.id, editItem.deviceName)
    } 
    // 选择了同一个用户切单兵名称没变：直接取消
    this.handleCancel();
  };

  // 更新单兵名称
  updateSoldierName = (editItem, newName) => {
    const { SoldierStore } = this.props;
    return SoldierStore.getDeviceVo(editItem.id, true).then(({result}) => {
      result.deviceName = newName;
      result.lyCameraInfo.name = newName;
      result.lyCameraInfo.osd = newName;
      return SoldierStore.updateDeviceVo(result);
    });
  }

  // 添加单兵
  addSoldier = (newName) => {
    const { SoldierStore } = this.props;
    let newSoldierInfo = {
      brand: 'soldier',
      model: 'app',
      deviceName: newName
    };
    return SoldierStore.addSoldier(newSoldierInfo).then(({result}) => {
      return result
    });
  }

  // 绑定单兵
  bindSoldier = async (deviceId, soldierName) => {
    const { selectUser } = this.state;
    if (selectUser) {
      const bindInfo = {
        userId: selectUser.id,
        deviceId
      };
      await this.props.SoldierStore.bindSoldier(bindInfo, {
        soldierName,
        loginName: selectUser.loginName
      });
    }
    this.handleCancel();
    this.handleSearch();
  }

  // 解绑单兵
  unbindSoldier = (userId, deviceId, logInfoObj) => {
    return this.props.SoldierStore.removeBindSoldier({
      userId, deviceId
    }, logInfoObj)
  }

  // 编辑、添加取消弹窗
  handleCancel = () => {
    this.setState({
      modalVisible: false,
      confirmLoading: false,
      selectUser: {},
      unbindInfo: {},
    });
  };

  // 解除绑定 logInfoObj -- 日志相关信息收集
  unbindOk = async ({userId, deviceId}, logInfoObj) => {
    this.setState({ confirmLoading: true });
    await this.unbindSoldier(userId, deviceId, logInfoObj)
    message.success('解除绑定成功');
    this.handleCancel();
    this.handleSearch();
  }

  // 解绑弹窗
  disconnectAction = item => {
    console.log(item,99)
    if (item.isBind !== 1) {
      return;
    }
    this.setState({
      modalVisible: true,
      content:1,
      unbindInfo: item,
    })
  };
// 1: 解绑弹窗， 2: 编辑弹窗, 3: 添加弹窗
  getContentOptions = (content) => {
    let contentOptions;
    // let userId;
    // let deviceId
    switch(content) {
      case 1:
        const { unbindInfo } = this.state;
        // if(unbindInfo instanceof Array){
        //   unbindInfo.map(v => {
        //     userId=userId.push(v.bindUser.id).join(' 、');
        //     deviceId=deviceId.push(v.id).join(' 、');
        //   })
        // }
        const userId = unbindInfo.bindUser.id;
        const deviceId = unbindInfo.id;
        contentOptions = {
          bindName: unbindInfo.bindUser && unbindInfo.bindUser.realName,
          unbindOk: () => this.unbindOk({ userId, deviceId }, {
            soldierName: unbindInfo.deviceName,
            loginName: unbindInfo.bindUser.loginName
          }),
          unbindCancel: this.handleCancel,
        }
      break;
      case 2:
        const { selectUser, isEdit, editItem, activeOrgIds, userList, confirmLoading } = this.state;
        contentOptions = {
          selectUser,
          isEdit,
          editItem,
          activeOrgIds,
          userList,
          confirmLoading,
          clickUserName: this.clickUserName,
          treeRef: orgTree => this.orgTree = orgTree,
          leafClk: this.clickLeaf,
          onOk: this.handleOk,
          onCancel: this.handleCancel,
        }
      break;
      default:break;
    }
    return contentOptions
  }
  批量解除绑定弹窗
  unbindGroup = () => {
    let unbindGroupInfo = []
    const {selectedRows}=this.state
    console.log(selectedRows,66)
    selectedRows.map(v => {
      unbindGroupInfo.push(v.loginName)
    })
    // this.setState({
    //   modalVisible:true,
    //   content:1,
    //   unbindInfo:{},
    // })
  }
  
  render() {
    const { SoldierStore } = this.props;
    const { searchData } = SoldierStore;
    const {
      list,
      total,
      loading,
      modalVisible,
      content,
      selectedRowKeys,
      selectedRows
    } = this.state;
    const contentOptions = modalVisible ? this.getContentOptions(content) : {};
    const rowSelection={
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows
        })
      },
    }
    return (
      <div className="soldier-container">
        <CenterHeader title='单兵管理' />
        <div className="soldier-content-wrapper">
          <Title>
            <SearchView onSearch={this.editSearchData} />
            <AuthComponent actionName="SoldierAdd">
              <Button type="primary" icon="plus" className="orange-btn" onClick={() => this.handleAddSoldier()}>
                新建单兵
              </Button>
            </AuthComponent>
            {/* <AuthComponent actionName="DeviceAssigned">
              <Button
                className="orange-btn form-btn-group"
                style={{marginLeft:'10px'}}
                disabled={selectedRowKeys.length===0}
                onClick={this.unbindGroup}
              >
                <IconSpan icon='icon-OffLine_Main'/>
                  批量解除绑定  
              </Button>
            </AuthComponent> */}
          </Title>
          <Table
            rowSelection={rowSelection}
            editAction={this.editAction}
            total={total}
            searchData={searchData}
            dataSource={list}
            loading={loading}
            onChange={this.handlePageChange}
            disconnectAction={this.disconnectAction}
            scroll={{ y: '100%' }}
          />
          {modalVisible && (
            <SoldierModal 
              visible={modalVisible}
              content={content}
              contentOptions={contentOptions}
            />
          )}
        </div>
      </div>
    );
  }
}
