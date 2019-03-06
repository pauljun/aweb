import React from 'react';
import { observer } from 'mobx-react';
import Title from '../../components/Title';
import Search from '../components/Search';
import { message } from 'antd';
import Table from '../components/Table';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import AssignedVillage from '../components/AssignedVillageNew';
// import { computTreeList } from '../../../../utils';
import LogsComponent from 'src/components/LogsComponent';
import Socket from 'src/libs/Socket';

import '../style/list.scss';

@LogsComponent()
@BusinessProvider('VillageListStore', 'TabStore', 'OrgStore')
@observer
export default class CenterVillageListView extends React.Component {
  state = {
    list: [],
    total: 10,
    loading: false,
    visible: false,
    currentVillage: {},
    key: Math.random(),
    //orgUserTreeList: [],
    //orgUserList: []
  };

	componentWillUnmount(){
    
		Socket.off('UPDATE_VILLAFE_LIST',this.search)
	}

  componentWillMount() {
    const { VillageListStore, OrgStore } = this.props;
    this.search();
		Socket.on('UPDATE_VILLAFE_LIST',this.search)
    // VillageListStore.getUserList().then(res => {
    //   let list = [].concat(OrgStore.orgArray, res);
    //   this.setState({
    //     orgUserList: list,
    //     orgUserTreeList: computTreeList(list)
    //   });
    // });
  }

  /**跳转 */
  goPage(moduleName, childModuleName, data) {
    this.props.TabStore.goPage({
      moduleName,
      childModuleName,
      history: this.props.history,
      data
    });
  }

  /**
   * 搜索
   */
  search = () => {
    const { VillageListStore } = this.props;
    this.setState({
      loading: true
    });
    
    return VillageListStore.getList().then(res => {
      this.setState({
        total: res.result.total || 10,
        list: res.result.list,
        loading: false
      });
    });
  };

  /**修改查询条件 */
  editSearchData = options => {
    const { VillageListStore } = this.props;
    VillageListStore.mergeSearchData(options);
    this.search();
  };
  /**分页切换查询 */
  onChange = (pageNo, pageSize) => {
    this.editSearchData({ pageNo, pageSize });
  };

  changeUser = item => {
    this.setState({
      visible: true,
      currentVillage: item,
      key: Math.random()
    });
  };

  onSubmitChange = (item, ids) => {
    const { VillageListStore } = this.props;
    VillageListStore.assignedByUser({
      villageId: item.villageId,
      userIds: ids
    }).then(() => {
      this.search()
      message.success('操作成功！');
      this.onCancel();
    });
  };
  onCancel = () => {
    this.setState({ visible: false });
    setTimeout(() => {
      this.setState({ currentVillage: {}, key: Math.random() });
    }, 500);
  };

  render() {
    const { VillageListStore } = this.props;

    const { searchData } = VillageListStore;
    console.log(searchData)
    const {
      list,
      total,
      loading,
      visible,
      currentVillage,
      key,
    } = this.state;
    return (
      <React.Fragment>
			<div className='noTreeTitle'>小区管理</div>
      <div className="Village-wrapper">
        <Title className="village-title" name={''}>
          <Search
            value={searchData.key}
            onChange={this.editSearchData}
            goPage={this.goPage.bind(this)}
          />
        </Title>
        <Table
          rowKey="villageId"
          total={total}
          goPage={this.goPage.bind(this)}
          searchData={searchData}
          dataSource={list}
          loading={loading}
          onChange={this.onChange}
          changeUser={this.changeUser}
          scroll={{ y: '100%' }}
        />
        <AssignedVillage
          key={key}
          visible={visible}
          data={currentVillage}
          onCancel={this.onCancel}
          onSubmit={this.onSubmitChange}
          privilegeName={['commmuityViewPriv', 'RegisteredView', 'UnRegisteredView']}
          andOr={2}
        />
        </div>
      </React.Fragment>
    );
  }
}
