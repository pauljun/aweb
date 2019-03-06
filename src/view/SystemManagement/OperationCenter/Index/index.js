import React from 'react';
import { observer } from 'mobx-react';
import Title from '../../components/Title';
import Search from './components/Search';
import Table from './components/Table';
import {
  message
} from 'antd';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import Socket from '../../../../libs/Socket';
import './index.scss';

@BusinessProvider('OperationCenterStore', 'TabStore')
@observer
export default class OperationCenterIndex extends React.Component {
  state = {
    list: [],
    total: 10,
    loading: false
  };

  componentWillMount() {
    this.search();
    Socket.on('OperationCenterChange', this.search);
  }
  componentWillUnmount() {
    Socket.off('OperationCenterChange', this.search);
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

  /**搜索 */
  search = () => {
    const { OperationCenterStore } = this.props;
    this.setState({
      loading: true
    });
    OperationCenterStore.getList().then(res => {
      let list = res.result.data,
        ids = [];
      if (Array.isArray(list) && list.length > 0) {
        ids = list.map(v => v.id);
      } else {
        list = [];
      }
      OperationCenterStore.getOptCenterDeviceCount(ids).then(data => {
        for (let i = 0, l = list.length; i < l; i++) {
          let item = list[i];
          let countItem = data.result.filter(
            v => item.id === v.operationCenterId
          )[0];
          item.cameraTotal = countItem ? countItem.count : 0;
        }
        this.setState({
          total: res.result.total,
          loading: false,
          list
        });
      });
    });
  };

  /**删除运营中心 */
  del = id => {
    this.props.OperationCenterStore.del({ id }).then(res => {
      if (res.code === 200) {
        message.success('删除成功!')
      } else {
        message.success('删除失败!')
      }
      this.search()
    })
  }

  /**修改查询条件 */
  editSearchData = options => {
    const { OperationCenterStore } = this.props;
    OperationCenterStore.mergeSearchData(options);
    this.search();
  };
  /**分页切换查询 */
  onChange = (pageNo, pageSize) => {
    this.editSearchData({ pageNo, pageSize });
  };

  render() {
    const { OperationCenterStore } = this.props;

    const { searchData } = OperationCenterStore;

    const { list, total, loading } = this.state;
    return <React.Fragment>
      <div className='optCenter-wrapper-main'>
        <div className='noTreeTitle'>运营中心管理</div>
        <div className="optCenter-wrapper">
          <Title className="optCenter-title" key="title" name="">
            <Search
              value={searchData.key}
              onChange={this.editSearchData}
              goPage={this.goPage.bind(this)}
            />
          </Title>
          <Table
            key="optCenter"
            total={total}
            goPage={this.goPage.bind(this)}
            searchData={searchData}
            dataSource={list}
            loading={loading}
            del={this.del}
            onChange={this.onChange}
            scroll={{ y: '100%' }}
          />
        </div>
      </div>
    </React.Fragment>
  }
}
