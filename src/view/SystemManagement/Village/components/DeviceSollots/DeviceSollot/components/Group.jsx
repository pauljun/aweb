import React from 'react';
import IconFont from 'src/components/IconFont';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { Button, message, Spin } from 'antd';

@BusinessProvider('OperationCenterDeviceSollotStore')
class view extends React.Component {
  state = {
    loading: false
  };

  /**分配设备 */
  updataDeviceOcId = type => {
    const {
      OperationCenterDeviceSollotStore,
      leftRowKeys,
      rightRowKeys,
      ocId
    } = this.props;
    if (
      (type === 1 && !leftRowKeys.length) ||
      (type === 2 && !rightRowKeys.length)
    ) {
      return message.warning('请选择需要分配的设备');
    }
    this.setState({
      loading: true
    });
    let data = {};
    if (type === 1) {
      data = {
        toOcId: ocId,
        deviceIds: leftRowKeys
      };
    } else {
      data = {
        fromOcId: ocId,
        deviceIds: rightRowKeys
      };
    }
    OperationCenterDeviceSollotStore.updateDeviceOcId(data).then(res => {
      this.setState({
        loading: false
      });
      this.props.updateListData(type);
    });
  };

  render() {
    const { leftRowKeys, rightRowKeys } = this.props;
    const { loading } = this.state;
    return (
      <div className="group">
        <Spin spinning={loading}>
          <Button
            disabled={leftRowKeys.length === 0}
            className="orange-btn"
            onClick={this.updataDeviceOcId.bind(this, 1)}
          >
            <IconFont type="icon-Arrow_Big_Right_Main" title="分配" />
          </Button>
          <Button
            disabled={rightRowKeys.length === 0}
            className="orange-btn"
            onClick={this.updataDeviceOcId.bind(this, 2)}
          >
            <IconFont type="icon-Arrow_Big_Left_Main" title="取消分配" />
          </Button>
        </Spin>
      </div>
    );
  }
}

export default view;
