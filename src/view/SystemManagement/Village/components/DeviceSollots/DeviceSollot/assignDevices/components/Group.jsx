import React from 'react';
import IconFont from 'src/components/IconFont';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { Button, message, Spin } from 'antd';

@BusinessProvider('VillageListStore')
class view extends React.Component {
  state = {
    loading: false
  };

  /**分配设备 */
  updataDeviceOcId = type => {
    if (this.props.assignDevice) {
      this.props.assignDevice(type);
      return
    }
    const {
      VillageListStore,
      leftRowKeys,
      rightRowKeys,
      villageId,
      updateDeivceSollot,
      ocId
    } = this.props;
    this.setState({
      loading: true
    });
    let options = {};
    if (type === 1) {
      options = {
        villageId,
        bindDeviceIds: leftRowKeys
      };
    } else {
      options = {
        villageId,
        unbindDeviceIds: rightRowKeys
      };
    }
    if (ocId) {
      return updateDeivceSollot(type).then(res =>
        this.setState({ loading: false })
      );
    }
    VillageListStore.updateVillageDevices(options).then(
      res => {
        this.setState({
          loading: false
        });
        this.props.updateListData(type);
      },
      err => {
        this.setState({
          loading: false
        });
      }
    );
  };

  render() {
    const { leftRowKeys, rightRowKeys, className } = this.props;
    const { loading } = this.state;
    return (
      <div className={`group ${className}`}>
        <Spin spinning={loading}>
          <Button
            disabled={leftRowKeys.length === 0}
            type="primary"
            className="orange-btn"
            onClick={this.updataDeviceOcId.bind(this, 1)}
          >
            <IconFont type="icon-Arrow_Big_Right_Main" />
            <div className="text">分配</div>
          </Button>
          <Button
            disabled={rightRowKeys.length === 0}
            type="primary"
            className="orange-btn"
            onClick={this.updataDeviceOcId.bind(this, 2)}
          >
            <IconFont type="icon-Arrow_Big_Left_Main" title="取消" />
            <div className="text"> 取消</div>
          </Button>
        </Spin>
      </div>
    );
  }
}

export default view;
