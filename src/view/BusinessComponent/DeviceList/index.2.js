import React from 'react';
import { AutoSizer, List } from 'react-virtualized';
import { getCameraTypeIcon } from 'src/libs/Dictionary';


import './index.scss';

export default class OrgTreeWithDevice extends React.Component {
  constructor(props) {
    super(props);
  }
  clickDeviceItem(item) {
    const { onSelectDevice } = this.props;
    onSelectDevice && onSelectDevice(item);
  }
  deleteDeviceItem(item) {
    const { deleteDeviceItem } = this.props;
    deleteDeviceItem && deleteDeviceItem(item);
  }
  rowRender({ key, index, style }) {
    const { deviceList } = this.props;
    const item = deviceList[index];
    const cameraStateInfo = getCameraTypeIcon(item.deviceType, item.deviceData);

    return (
      <div
        style={style}
        className={`device-item`}
        key={key}
        onClick={() => this.clickDeviceItem(item)}
      >
        <label>
          <div className='item-info'>
            <img src={cameraStateInfo.url} />
            <span>{item.deviceName}</span>
          </div>
          <span className="delete-item" onClick={() => this.deleteDeviceItem(item)}>
            删除
          </span>
        </label> 
      </div>
    );
  }

  render() {
    const { deviceList, clearSelect,className } = this.props;
    return (
      <div className={`device-list-layout ${className ? className : ''}`}>
        <div className="title-part">
          <span>
            已选摄像机：
            {deviceList.length}个
          </span>
          <span onClick={clearSelect}>清空</span>
        </div>
        <div className="list-layout">
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={deviceList.length}
                rowHeight={30}
                rowRenderer={this.rowRender.bind(this)}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }
}
