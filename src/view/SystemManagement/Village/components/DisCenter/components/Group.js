import React from 'react';
import IconFont from 'src/components/IconFont';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { Button, message, Spin } from 'antd';

import '../style/Group.scss';

@BusinessProvider('VillageListStore', 'OperationCenterDeviceVillageStore')
class view extends React.Component {
  state = {
    loading: false
  };
  /**分配设备 */
  async updataDeviceOcId(model){
    const {
      VillageListStore,
      centerList,
      unChoseList = [],
      choseList = [],
      villageId,
      name,
      ocId,
      OperationCenterDeviceVillageStore
    } = this.props;
    if (
      (model === 1 && !unChoseList.length) ||
      (model === 2 && !choseList.length)
    ) {
      return message.warning(`请选择需要分配的${name}`);
    }
    this.setState({
      loading: true
    });
    var result;
    if (name === '运营中心') {
      result = await VillageListStore.distributionCenterToVillage({
        villageId,
        assignedCenterIds: unChoseList,
        unAssignedCenterIds: choseList
      })
    } else if (name === '小区') {
      result = await OperationCenterDeviceVillageStore.updateVillageToCenter({
        centerId: ocId,
        assignedVillageIds: unChoseList,
        unAssignedVillageIds: choseList
      })
    }
    this.setState({
      loading: false
    });
    message.success('操作成功!');
    this.props.updateListData(model);
  }

  render() {
    const { unChoseList = [], choseList = [] } = this.props;
    const { loading } = this.state;
    return (
      <div className="dis-group">
        <Spin spinning={loading}>
          <Button
            type='primary'
            disabled={unChoseList.length === 0}
            className="orange-btn"
            onClick={this.updataDeviceOcId.bind(this, 1)}
          >
            <IconFont type="icon-Arrow_Big_Right_Main" />
            <p className="left-text">分配</p>
          </Button>
          <Button
            type='primary'
            disabled={choseList.length === 0}
            className="orange-btn"
            onClick={this.updataDeviceOcId.bind(this, 2)}
          >
            <IconFont type="icon-Arrow_Big_Left_Main" />
            <p className="left-text">取消</p>
          </Button>
        </Spin>
      </div>
    );
  }
}

export default view;
