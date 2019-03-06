import React, { Component } from 'react';
import OrgSelectModal from 'src/view/BusinessComponent/OrgSelectDevice/OrgSelectModal';
import MapSelectModal from 'src/view/BusinessComponent/MapSelect/ModalMapSelect';
import IconFont from 'src/components/IconFont'
import DeviceIcon from '../../../../../components/DeviceIcon/index'
import { Button } from 'antd'
import { AutoSizer, List } from 'react-virtualized';
class GrapPoint extends Component {

  state = {
    modalShow: false,
    keyMath: Math.random(),
    modalType: false
  }

  /**确定 */
  handleOk = (selectList) => {
    const { onChange, name } = this.props;
    onChange && onChange({ [name || 'cameraIds']: selectList });
    this.handleCancel();
  }

  // 清空默认选中选择设备
  clearDevices = () => {
    const { onChange, name } = this.props;
    onChange && onChange({ [name || 'cameraIds']: [] })
  }

  /**取消 */
  handleCancel = () => {
    this.setState({
      modalShow: false,
      keyMath: Math.random(),
      modalType: false
    });
  }

  showDeviceSelect = (modalType) => {
    this.setState({
      modalShow: true,
      modalType,
    })
  }

  // 渲染列表项
  rowRender = ({ key, index, style }) => {
    let v = this.props.value[index]
    return (
      <div style={style} key={v.id} title={v.deviceName} className='li'>
        <DeviceIcon
          type={v.deviceType}
          status={v.deviceData}
        />
        {v.deviceName}
      </div>
    );
  }

  render() {
    const { label = '点位', value = [] } = this.props;
    const { modalType } = this.state;
    return (
      <div className='item'>
        <div className='label-data-repository'>
          <IconFont
            type="icon-Add_Main"
            className="data-repository-icon" />
          {label}：
          </div>
        <div className='item-content point-group'>
          {/* <div
            onClick={() => this.showDeviceSelect(1)}
            className='pg-t'
          >
            列表选择
          </div>
          <div
            onClick={() => this.showDeviceSelect(2)}
            className='pg-m'
          >
            地图选择
          </div> */}
          <div className="scope-type">
            <Button className='btn' onClick={() => this.showDeviceSelect(1)}><IconFont type="icon-List_Tree_Main" />列表模式</Button>
            <Button className='btn' onClick={() => this.showDeviceSelect(2)}><IconFont type="icon-List_Map_Main" />地图模式</Button>
          </div>
          {!!value.length && (
            <div className='grap-point-content'>
              <div className='camera-selected'>
                <AutoSizer>
                  {({ width, height }) => (
                    <List
                      width={width}
                      height={height}
                      rowCount={value.length}
                      rowHeight={24}
                      key={this.state.keyMath}
                      rowRenderer={this.rowRender}
                    />
                  )}
                </AutoSizer>
              </div>
              <div className='clear' onClick={this.clearDevices}>
                <IconFont
                  type="icon-Delete_Main"
                  className="data-repository-icon" />
                清空摄像机</div>
            </div>
          )}
        </div>
        { modalType && ( modalType === 2 
            ? <MapSelectModal
                title={'抓拍点位'}
                visible={this.state.modalShow}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                selectList={value}
                className='org-select-model'
              />
            : <OrgSelectModal 
                title='抓拍点位'
                visible={this.state.modalShow}
                onOk={this.handleOk}
                onCancel={this.handleCancel} 
                defaultSelectList={value} 
                className='org-select-model'
                hasSolidier={false}
              />)
        }
      </div>
    )
  }
}

export default GrapPoint;
