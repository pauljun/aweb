import React from 'react';
import { observer } from 'mobx-react';
import MiddleGroup from '../components/Group';
import LeftSearch from '../components/LeftSearch';
import RightSearch from '../components/RightSearch';
import LeftTabel from '../components/LeftTable';
import RightTabel from '../components/RightTabel';
import MapCluster from '../components/MapCluster';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { Button } from 'antd';
import './index.scss';

@BusinessProvider(
  'OperationCenterDeviceSollotStore',
  'DeviceManagementStore'
)
@observer
class PlaceManagementView extends React.Component {
  constructor(props) {
    super(props);
    this.ocId = this.props.history.location.search.split('=')[1];
  }
  /**
   * @param allDeviceList [Array] 所有设备列表[左侧]
   * @param allDeviceTotal [Number] 所有设备总数
   * @param deviceList [Array] 当前运营中心设备列表
   * @param deviceTotal [Number] 当前运营中心设备列表
   * @param type [Number] 0：列表分配, 1:地图框选分配
   * @param leftRowKeys [Array] 左侧选中框选id
   * @param rightRowKeys [Array] 右侧框选id
   */
  state = {
    allDeviceList: [],
    allDeviceTotal: 0,
    allTbLoading: false,
    deviceList: [],
    deviceTotal: 0,
    tbLoading: false,
    type: 0,
    leftRowKeys: [],
    rightRowKeys: [],
    deviceGroup: [],
    mapCameraArray: []
  };
  componentWillMount() {
    this.getTbData();
    const { DeviceManagementStore } = this.props;
    /**获取羚羊云设备分组 */
    DeviceManagementStore.getLingyangOrgs().then(res => {
      this.setState({
        deviceGroup: res
      });
    });
  }

  /**
   * 左右两侧数据重新获取
   */
  getTbData = () => {
    this.allDeviceSearch();
    this.deviceSearch();
    this.getCameraArrayOtherOpt()
  };

  /**
   * 所有设备查询
   */
  allDeviceSearch = () => {
    this.setState({
      allTbLoading: true
    });
    const { OperationCenterDeviceSollotStore } = this.props;
    OperationCenterDeviceSollotStore.getAllList(
      this.ocId
    ).then(res => {
      this.setState({
        allDeviceTotal: res.result.resultSize,
        allDeviceList: res.result.resultList,
        allTbLoading: false
      });
    });
  };
  /**
   * 当前运营中心设备
   */
  deviceSearch = () => {
    this.setState({
      tbLoading: true
    });
    const { OperationCenterDeviceSollotStore } = this.props;
    OperationCenterDeviceSollotStore.getList(this.ocId).then(res => {
      this.setState({
        deviceTotal: res.result.resultSize,
        deviceList: res.result.resultList,
        tbLoading: false
      });
    });
  };

  /**
   * 修改查询条件
   */
  editSearchData = (name, options) => {
    const { OperationCenterDeviceSollotStore } = this.props;
    if (name === 'allSearchData') {
      OperationCenterDeviceSollotStore.mergeAllSearchData(options);
      this.allDeviceSearch();
    } else {
      OperationCenterDeviceSollotStore.mergeSearchData(options);
      this.deviceSearch();
    }
  };

  leftSearchSub = () => {
    this.editSearchData('allSearchData', { page: 1 });
  };

  rightSearchSub = () => {
    this.editSearchData('searchData', { page: 1 });
  };

  /**
   * 分页
   */
  onChange = (name, page, pageSize) => {
    this.editSearchData(name, { page, pageSize });
  };

  /**
   * 左侧栏勾选
   */
  setLeftKeys = leftRowKeys => {
    this.setState({
      leftRowKeys
    });
  };

  /**
   * 右侧栏勾选
   */
  setRightKeys = rightRowKeys => {
    this.setState({
      rightRowKeys
    });
  };
  /**
   * 分配完成
   */
  updateDeviceComplete = type => {
    if (type === 1) {
      this.setState({
        leftRowKeys: []
      })
    } else {
      this.setState({
        rightRowKeys: []
      });
    }
    this.getTbData()
  };
  /**
   * 切换分配模式
   */
  typeChange = type => {
    this.setState({ type });
  };
  /**过滤非当前运营中心设备 */
  getCameraArrayOtherOpt = () => {
    const {
      OperationCenterDeviceSollotStore
    } = this.props
    OperationCenterDeviceSollotStore.getMapAllList(this.ocId).then(res => {
      this.setState({
        mapCameraArray: res.result.resultList
      })
    })
  }
  render() {
    const {
      OperationCenterDeviceSollotStore
    } = this.props;
    const {
      allDeviceList,
      allDeviceTotal,
      allTbLoading,
      deviceList,
      deviceTotal,
      tbLoading,
      leftRowKeys,
      rightRowKeys,
      type,
      deviceGroup,
      mapCameraArray
    } = this.state;
    return (
      <React.Fragment>
        <div className="noTreeTitle" style={{ paddingLeft: '20px' }}>
          分配设备
          <div className="device-sollot-type">
            <Button
              className={type === 0 ? 'orange-btn' : ''}
              onClick={this.typeChange.bind(this, 0)}
            >
              列表分配
            </Button>
            <Button
              className={type === 1 ? 'orange-btn' : ''}
              onClick={this.typeChange.bind(this, 1)}
            >
              地图分配
            </Button>
          </div>
        </div>
        <div className="optCenter-wrapper">
          <div className="device-assiged-layout" style={{ paddingTop: '48px' }}>
            <div className="device-sollot-wrapper" key="device-sollot">
              <div className="tb">
                <div className="content">
                  <LeftSearch
                    total={allDeviceTotal}
                    deviceGroup={deviceGroup}
                    onSubmit={this.leftSearchSub}
                    showForm={type === 0}
                    type={type}
                  />
                  <div className="content-table">
                    {type === 0 ? (
                      <LeftTabel
                        searchData={
                          OperationCenterDeviceSollotStore.allSearchData
                        }
                        dataSource={allDeviceList}
                        loading={allTbLoading}
                        onChange={this.onChange}
                        total={allDeviceTotal}
                        rowSelection={{
                          selectedRowKeys: leftRowKeys,
                          onChange: this.setLeftKeys,
                          getCheckboxProps: record => {
                            let item = deviceList.find(v => v.id === record.id);
                            return item
                              ? { checked: true, disabled: true }
                              : {};
                          }
                        }}
                      />
                    ) : (
                      <MapCluster
                        selectIds={leftRowKeys}
                        list={mapCameraArray}
                        setSelectKeys={this.setLeftKeys}
                      />
                    )}
                  </div>
                </div>
              </div>
              <MiddleGroup
                leftRowKeys={leftRowKeys}
                rightRowKeys={rightRowKeys}
                updateListData={this.updateDeviceComplete}
                ocId={this.ocId}
              />
              <div className="tb">
                <div className="content">
                  <RightSearch
                    total={deviceTotal}
                    deviceGroup={deviceGroup}
                    onSubmit={this.rightSearchSub}
                  />
                  <div className="content-table">
                    <RightTabel
                      searchData={OperationCenterDeviceSollotStore.searchData}
                      dataSource={deviceList}
                      loading={tbLoading}
                      onChange={this.onChange}
                      total={deviceTotal}
                      selectKeys={rightRowKeys}
                      setSelectKeys={this.setRightKeys}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PlaceManagementView;