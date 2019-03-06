import React from 'react';
import { observer } from 'mobx-react';
import Container from '../../components/Container';
import Table from '../../components/Table';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import moment from 'moment';
import Pagination from 'src/components/Pagination';
import Search from '../components/Search';
import Breadcrumb from '../../components/Breadcrumb';
import { Modal,Button } from 'antd';
import BaseInfo from '../components/baseInfo';
import ModalView from '../components/ModalView';
import ModalDelete from 'src/components/ModalComponent'
import IconSpan from 'src/components/IconSpan';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import LogsComponent from 'src/components/LogsComponent';
import Title from '../../components/Title';
import GetOrgAndDevice from 'src/utils/GetOrgAndDevice'
/**前端分页处理函数 */
/**数组截取 */
const confirm = Modal.confirm;

@LogsComponent()
@BusinessProvider(
  'OrgManagementStore',
  'OrgStore',
  'UserStore',
  'TabStore',
  'OrgStore',
  'MenuStore'
)
@observer
export default class OrganizationView extends React.Component {
  state = {
    /**渲染列表 */
    list: [],
    editShow: false,
    deleteShow:false,
    deleteInfo:'',
    data: {},
    total: 0,
    type: '',
    modalKey: Math.random(),
    //  获取当前点击的组织信息
    clickedOrgInfo: '',
    selectedRowKeys:[],
    selectedRows:null,
  };
  componentWillMount(){
    const { OrgManagementStore } = this.props
    OrgManagementStore.initData()
  }
  /**子节点点击事件1 */
  leafClk(key) {
    const { OrgManagementStore } = this.props;
    if (key.length !== 0) {
      OrgManagementStore.setData({
        activeKey: key,
      });
      this.setState({
        pageIf: false
      });
    }
    OrgManagementStore.editSearchData({
      orgId: key[0],
      pageNo:1
    });
    this.getBaseInfo();
    this.getUserList();
  }

  /**
   * 获取选中的组织信息
   */
  getBaseInfo = () => {
    const { OrgManagementStore, OrgStore } = this.props;
    OrgStore.getOrgInfoByOrgId(OrgManagementStore.activeKey[0]).then(res => {
      this.setState({
        clickedOrgInfo: res
      });
    });
  };
  /*
   * 修改查询条件
   */
  editSearchData = options => {
    const { OrgManagementStore } = this.props;
    OrgManagementStore.editSearchData(options).then(() => {
      this.getUserList();
    });
  };
  getUserList = () => {
    const { OrgManagementStore } = this.props;
    this.setState({ loading: true });
    OrgManagementStore.getOrgList().then(res => {
      this.setState({
        list: res.data,
        total: res.total,
        loading: false,
      });
    });
  };
  /**
   * 分页切换查询
   */
  onChange = (currentPage, pageSize) => {
    this.editSearchData({
      pageSize,
      pageNo: currentPage
    });
  };
  // 上移或者下移组织
  orderAction = (item,index,type) => {
    var that = this;
    const { list } = this.state;
    const { OrgManagementStore, OrgStore } = this.props;
    const Index = type && type==='isUp'? (list.findIndex(v => v.id == item.id) - 1) : (list.findIndex(v => v.id == item.id) + 1);
    const title = type && type==='isUp'? '请确认是否上移组织':'请确认是否下移组织'
    let upOptions = [
      {
        orgId: item.id, // 当前ID
        sort: list[Index].orgSort // 上一个orgSort
      },
      {
        orgId: list[Index].id, // 上一个ID
        sort: item.orgSort // 当前orgSort
      }
    ]
    let downOptions = [
      {
        orgId: item.id, // 当前ID
        sort: list[Index].orgSort // 上一个orgSort
      },
      {
        orgId: list[Index].id, // 上一个ID
        sort: item.orgSort // 当前orgSort
      }
    ]
    // 操作步骤
    confirm({
      title,
      content:`${item.name /* item.organizationName */}`,
      onOk(){
        if(type&&type === 'isUp'){
          OrgManagementStore.getUpDownList(upOptions).then(function() {
            that.setState({
              NameState: true
            });
            that.getUserList();
            OrgStore.getOrgList();
          });
        }else{
          OrgManagementStore.getUpDownList(downOptions).then(function() {
            that.setState({
              NameState: true
            });
            that.getUserList();
            OrgStore.getOrgList();
          });
        }
      },
      onCancel(){
        return Promise.resolve();
      },
      okType: 'danger',
      cancelText: '取消',
      okText: '确定'
    })
  }
  // 新增组织或者编辑组织
  operateOrg = (item,type) => {
    this.setState({
      data:item,
      editShow: true,
      type: type,
      modalKey: Math.random()
    })
  }
  CancelModal = () => {
    this.setState({
      editShow: false
    });
  };
  // 删除组织
  deleteAction(item) {
    this.setState({
      deleteShow:true,
      deleteInfo:item,
    })
  }
  deleteOk = () => {
    var that = this;
    const { deleteInfo } = this.state
    const { OrgManagementStore, OrgStore, UserStore } = this.props;
    let options = {
      orgId: deleteInfo.id
    };
    OrgManagementStore.DeleteOrg(options,deleteInfo.name).then(() => {
      OrgManagementStore.getOrgList().then((res) => {
        that.setState({
          list: res.data
        });
      });
      GetOrgAndDevice();
    });
    this.deleteCancel()
  }
  deleteCancel = () => {
    this.setState({
      deleteShow:false
    })
  }
  deleteGroup = () => {
    const {selectedRowKeys,selectedRows}=this.state
    let deleteGroupInfo = []
    selectedRows.map(v => {
      deleteGroupInfo.push(v.name)
    })
    this.setState({
      deleteShow:true,
      deleteInfo:{name:deleteGroupInfo.join(' 、')},
    })
  }
  onSubmit = (data, value, type) => {
    const { OrgManagementStore, UserStore, OrgStore } = this.props;
    let options = {
      organizationDesc: value.organizationDesc,
      organizationName: value.organizationName,
      organizationType: data.type,
      parentId: OrgManagementStore.searchData.orgId || 0,
      validEndTime: '',
      centerId: UserStore.userInfo.optCenterId // 获取用户信息，获取该用户对应的运营中心id
    };
    let subAction = OrgManagementStore.addAction;
    if (type === 'edit') {
      options.id = data.id;
      options.parentId = data.parentId;
      subAction = OrgManagementStore.EditOrganization;
    }
    return subAction(options).then(() => {
      this.getUserList();
      GetOrgAndDevice()
    });
  };
  render() {
    const { OrgStore, OrgManagementStore } = this.props;
    const columns = [
      {
        title: '序号',
        key: 'id',
        width: '10%',
        render: (text, record, index) => {
          return index + 1;
        }
      },
      {
        title: '组织名称',
        dataIndex: 'name',
        width: '25%',
        render: (name, record) => {
         const id=[record.id]
          let orgTreeInfo=OrgStore.orgList.filter(
            v => id.indexOf(v.id) > -1
          )[0];
          if(!orgTreeInfo){
            return null
          }
          return (
            <a onClick={() => this.operateOrg(record, 'view')} title={OrgStore.getOrgTreeText(orgTreeInfo.id)}>{name}</a>
          );
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: '20%',
        render: time =>
          time && moment(parseInt(time, 10)).format('YYYY.MM.DD HH:mm:ss')
      },
      {
        title: '描述',
        width: '25%',
        dataIndex: 'desc'
      },
      {
        title: '操作',
        width: '20%',
        dataIndex: 'action',
        key: '10',
        render: (text, record, index) => {
          const isUp = index === 0;
          const isDown = index === list.length - 1;
          return (
            <div className="table-tools">
              <AuthComponent actionName="OrganizationOperata">
                <IconSpan
                  icon="icon-Edit_Main"
                  title="编辑"
                  onClick={() => this.operateOrg(record, 'edit')}
                />
              </AuthComponent>
              <AuthComponent actionName="OrganizationOperata">
                <IconSpan
                  icon="icon-Delete_Main"
                  title="删除"
                  onClick={this.deleteAction.bind(this, record)}
                />
              </AuthComponent>
              <AuthComponent actionName="OrganizationOperata">
                <IconSpan
                  title="上移"
                  onClick={() => this.orderAction(record, index,'isUp')}
                  disabled={isUp ? true : false}
                  icon="icon-UpDown_Up_Dark"
                />
              </AuthComponent>
              <AuthComponent actionName="OrganizationOperata">
                <IconSpan
                  title="下移"
                  onClick={() => this.orderAction(record, index,'isDown')}
                  disabled={isDown ? true : false}
                  icon="icon-UpDown_Down_Dark"
                />
              </AuthComponent>

            </div>
          );
        }
      }
    ];
   //批量删除操作
    const rowSelection={
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
          selectedRows
        })
      },
    };
    const { searchData } = OrgManagementStore;
    const { list, total, type, clickedOrgInfo, loading, modalKey ,selectedRowKeys} = this.state;
    return (
      <Container
        title='组织管理'
        treeActiveKey={OrgManagementStore.activeKey}
        leafClk={this.leafClk.bind(this)}
        allowClear={true}
      >
        {OrgManagementStore.activeKey && 
        <div className="org-breadCrumb">
          <Breadcrumb
            list={OrgStore.getParentOrgListByOrgId(
              OrgManagementStore.activeKey[0]
            ).reverse()}
          >
          </Breadcrumb>
        </div>
        }
        <div className="org-table-content">
          <div className="org-baseInfo">
            <Title name='基本信息'/>
            <BaseInfo info={clickedOrgInfo}/>
          </div>
          <div className="org-table-container">
            <Title name='直属组织列表'>
              <div className='org-Search-Btns'>
                <Search searchData={searchData} onChange={this.editSearchData} />
                <AuthComponent actionName="OrganizationOperata">
                  <Button
                    className='orange-btn addOrgBtn'
                    type={'primary'}
                    icon={'plus'}
                    onClick={() => this.operateOrg('', 'add')}
                  >
                    新建直属组织
                  </Button>
                </AuthComponent>
                <AuthComponent actionName="organizationDelete">
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
            <div className="org-table">
              <Table
                columns={columns}
                dataSource={list}
                loading={loading}
                scroll={{ y: '100%' }}
                rowSelection={!this.props.MenuStore.getAuthAction("organizationDelete") ? null:rowSelection}
              />
              <Pagination
                total={total}
                current={searchData.pageNo}
                pageSize={searchData.pageSize}
                onChange={this.onChange}
                simpleMode={false}
              />
            </div>
          </div>
          <ModalView
            key={modalKey}
            visible={this.state.editShow}
            CancelModal={this.CancelModal}
            data={this.state.data}
            onSubmit={this.onSubmit}
            type={type}
          />
          <ModalDelete 
            visible={this.state.deleteShow}
            onOk = {this.deleteOk}
            onCancel = {this.deleteCancel}
            title= '删除确认'
            img = 'delete'
          >
            <p style={{textAlign: 'center'}}>确定删除 <span className='highlight'>{this.state.deleteInfo.name}</span></p>
          </ModalDelete>
        </div>
      </Container>
    );
  }
}
