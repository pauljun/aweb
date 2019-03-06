import React from 'react';
import { observer } from 'mobx-react';
import { Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import SollotContent from './components/assignDevices';
import MapSollotWrapper from './components/mapSelect';
import { CommunityDeviceType } from 'src/libs/DeviceLib';
import _ from 'lodash';
import './index.scss';

import IconFont from 'src/components/IconFont';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
const deviceTypes = _.flattenDeep(
  CommunityDeviceType.filter(v => v.value && v.value !== '-1').map(v =>
    v.value.split(',')
  )
);

@withRouter
@BusinessProvider('OperationCenterDeviceSollotStore')
@observer
export default class DeviceSollot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 1,
      points: [],
      defaultSelectList: [],
      key: Math.random(),
      leftSList: [],
      selectList: [],
      rightSelectList: [],
      markerList: []
    };
  }

  componentWillMount() {
    this.getLargeDeivceList();
  }

  getLargeDeivceList = (list, addlist, type) => {
    const { OperationCenterDeviceSollotStore, ocId } = this.props;
    /**所有未分配设备列表 */
    OperationCenterDeviceSollotStore.getMapAllList({
      deviceTypes,
      currentOptCenterId: ocId,
      distributionState: '2',
      page: 1,
      pageSize: 100000
    }).then(res => {
      this.setState({
        points: res.result.resultList
      });
    });
    /**所有已分配列表 */
    if (!type) {
      OperationCenterDeviceSollotStore.getList({
        operationCenterIds: [ocId],
        deviceTypes,
        pageSize: 100000,
        page: 1
      }).then(res => {
        this.setState({
          defaultSelectList: res.result.resultList,
          key: Math.random()
        });
      });
    } else {
      this.setState({
        defaultSelectList: addlist.concat(list),
        key: Math.random()
      });
    }
  };
  getLeftList = (list, anotherList, type) => {
    this.setState({
      selectList: [],
      rightSelectList: []
    });
    if (type) {
      this.setState({
        leftSList: list.concat(anotherList)
      });
    } else {
      this.setState({
        leftSList: list
      });
    }
  };
  getSelectList = (list, type) => {
    this.setState({
      selectList: [],
      rightSelectList: []
    });
    if (type) {
      this.setState({
        selectList: list,
        markerList: list
      });
    } else {
      this.setState({
        rightSelectList: list
      });
    }
  };
  changeType = type => {
    if (this.state.type !== type) {
      this.setState({ type });
    }
    if (type == 2) {
      this.setState({
        leftSList: [],
        markerList: []
      });
    }
  };

  onOk = (list, addlist, type) => {
    this.getLargeDeivceList(list, addlist, type);
    if(!type)
    {this.setState({
      markerList:[]
    })}
    message.success('处理成功');
  };
  getNewMarkerList = list => {
    this.setState({
      markerList: list
    });
  };
  render() {
    let { ocId, changeModel, OperationCenterDeviceSollotStore } = this.props;
    let {
      type,
      defaultSelectList,
      points,
      key,
      leftSList,
      selectList,
      rightSelectList,
      markerList
    } = this.state;
    return (
      <div className="VD-sollot system-management-tl">
        <div className="change_type">
          <Button
            className={`btn ${type === 1 && 'active'}`}
            onClick={this.changeType.bind(this, 1)}
          >
            <IconFont type="icon-List_Tree_Main" />
            列表模式
          </Button>
          <Button
            className={`btn ${type === 2 && 'active'}`}
            onClick={this.changeType.bind(this, 2)}
          >
            <IconFont type="icon-List_Map_Main" />
            地图模式
          </Button>
          <button className="VD-edit-btn another-style" onClick={changeModel}>
            <IconFont type="icon-Back_Main" />
          </button>
        </div>
        {type === 1 ? (
          <SollotContent
            ocId={ocId}
            getLargeDeivceList={this.getLargeDeivceList}
          />
        ) : (
          <div className="device-sollot-wrapper">
            <MapSollotWrapper
              key={key}
              selectList={defaultSelectList}
              points={points}
              deviceSollotStore={OperationCenterDeviceSollotStore}
              changeModel={changeModel}
              ocId={ocId}
              getLeftList={this.getLeftList}
              getSelectList={this.getSelectList}
              leftSList={leftSList}
              leftSelectList={selectList}
              rightSelectList={rightSelectList}
              onOk={this.onOk}
              markerList={markerList}
              getNewMarkerList={this.getNewMarkerList}
            />
          </div>
        )}
      </div>
    );
  }
}
