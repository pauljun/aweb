import React from 'react';
import { observer } from 'mobx-react';
import Title from '../../components/Title';
import { message, Modal } from 'antd';
import Search from '../components/Search';
import Table from '../components/Table';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import AssignedVillage from '../components/AssignedVillage';
import ModalDeviceSelect from '../../../BusinessComponent/DeviceSelect/ModalDeviceSelect';
import ModalFooter from '../../../BusinessComponent/ModalFooter';
import '../style/list.scss';

const confirm = Modal.confirm;

@BusinessProvider('CenterVillageListStore', 'TabStore')
@observer
export default class CenterVillageListView extends React.Component {
  state = {
    list: [],
    total: 10,
    loading: false,
    visible: false,
    showDevice: false,
    currentVillage: {},
    key: Math.random()
  };

  componentWillMount() {
    this.search();
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
  search() {
    const { CenterVillageListStore } = this.props;
    this.setState({ loading: true });
    CenterVillageListStore.getList().then(res => {
      this.setState({
        total: res.result.total || 10,
        list: res.result.list,
        loading: false
      });
    });
  }

  /**修改查询条件 */
  editSearchData = options => {
    const { CenterVillageListStore } = this.props;
    CenterVillageListStore.mergeSearchData(options);
    this.search();
  };
  /**分页切换查询 */
  onChange = (pageNo, pageSize) => {
    this.editSearchData({ pageNo, pageSize });
  };

  changeCenter = item => {
    const { CenterVillageListStore } = this.props;
    CenterVillageListStore.getCentersByVillage(item.villageId).then(res => {
      item.assigned = res.result.assigned;
      item.unallocated = res.result.unallocated;
      this.setState({
        visible: true,
        currentVillage: item,
        key: Math.random()
      });
    });
  };

  changeDevice = item => {
    const { CenterVillageListStore } = this.props;
    Promise.all([
      CenterVillageListStore.queryVillageDevices(item.villageId),
      CenterVillageListStore.queryUnbindedVillageDevices()
    ]).then(res => {
      item.assignedDevices = Array.isArray(res[0].result)
        ? res[0].result.map(v => v.deviceId)
        : [];
      const list = Array.isArray(res[1].result)
        ? res[1].result.map(v => v.deviceId)
        : [];
      item.includeDevices = [].concat(item.assignedDevices, list);
      this.setState({
        showDevice: true,
        currentVillage: item,
        key: Math.random()
      });
    });
  };

  onSubmitDeviceChange = (list, item) => {
    console.log(list, item);
    const { CenterVillageListStore } = this.props;
    let options = {
      villageId: item.villageId,
      deviceIds: list.map(item => item.id)
    };
    CenterVillageListStore.updateVillageDevices(options).then(res => {
      message.success('操作成功！');
      this.onCancelDevice();
    });
  };

  onCancelDevice = () => {
    this.setState({ showDevice: false });
    setTimeout(() => {
      this.setState({ currentVillage: {}, key: Math.random() });
    }, 500);
  };

  onSubmitChange = (item, ids) => {
    const { CenterVillageListStore } = this.props;
    CenterVillageListStore.assignedByVillage({
      villageId: item.villageId,
      centerIds: ids
    }).then(() => {
      this.search();
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

  resetVillage = item => {
    const { CenterVillageListStore } = this.props;
    confirm({
      content: '确认重置小区数据？',
      onCancel: () => {},
      onOk: () => {
        return CenterVillageListStore.resetVillage({ id: item.villageId }).then(
          () => {
            message.success('操作成功！');
            this.search();
          }
        );
      }
    });
  };

  render() {
    const { CenterVillageListStore } = this.props;

    const { searchData } = CenterVillageListStore;

    const {
      list,
      total,
      loading,
      visible,
      currentVillage,
      key,
      showDevice
    } = this.state;
    return (
      <React.Fragment>
        <div className="noTreeTitle">小区管理</div>
        <div className="centerVillage-wrapper">
          <Title className="centerVillage-title" name="">
            <Search
              value={searchData.key}
              onChange={this.editSearchData}
              goPage={this.goPage.bind(this)}
            />
          </Title>
          <Table
            rowKey={item => item.villageId}
            total={total}
            goPage={this.goPage.bind(this)}
            searchData={searchData}
            dataSource={list}
            loading={loading}
            changeCenter={this.changeCenter}
            onChange={this.onChange}
            resetVillage={this.resetVillage}
            changeDevice={this.changeDevice}
            scroll={{ y: '100%' }}
          />
          <AssignedVillage
            key={`${key}-AssignedVillage`}
            visible={visible}
            data={currentVillage}
            onCancel={this.onCancel}
            onSubmit={this.onSubmitChange}
          />
          <ModalDeviceSelect
            title={`分配设备-${currentVillage.villageName}`}
            className="viliage-device-change"
            visible={showDevice}
            onCancel={this.onCancelDevice}
            footer={<ModalFooter onCancel={this.onCancelDevice} />}
            onOk={this.onSubmitDeviceChange}
            data={currentVillage}
            defaultSelectList={currentVillage.assignedDevices}
            includeDevices={currentVillage.includeDevices}
            key={`${key}-ModalDeviceSelect`}
          />
        </div>
      </React.Fragment>
    );
  }
}
