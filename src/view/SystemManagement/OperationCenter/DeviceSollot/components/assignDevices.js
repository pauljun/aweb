import React, { Component } from 'react';
import SearchInputGroup from '../../../Village/components/DeviceSollots/DeviceSollot/assignDevices/components/searchInputGroup'
import { observer } from 'mobx-react';
import MiddleGroup from '../../../Village/components/DeviceSollots/DeviceSollot/assignDevices/components/Group';
import TableList from '../../../Village/components/DeviceSollots/DeviceSollot/assignDevices/components/TableList';
import { CommunityDeviceType } from 'src/libs/DeviceLib';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import _ from 'lodash';
const deviceTypesAll = _.flattenDeep(CommunityDeviceType.filter(v => v.value && v.value !== '-1').map(v => v.value.split(',')))

@BusinessProvider(
  'OperationCenterDeviceSollotStore',
  'DeviceManagementStore'
)
@observer
class assignDevices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceGroup: [], // 设备分组(全部分组)
      leftRowKeys: [], // 未分配设备选中id
      rightRowKeys: [], // 已分配设置选中id
      allDeviceNotBind: [], // 所有未分配设备列表
      allDeviceBeBind: [], // 所有已分配设备列表
      searchDateLeft: {
        page: 1,
        pageSize: 60,
        deviceTypes: '-1',
        placeType: null,
        currentOptCenterId: props.ocId,
        distributionState: '2',
      }, // 未分配设备筛选条件集合
      searchDateRight: {
        page: 1,
        pageSize: 60,
        deviceTypes: '-1',
        placeType: null,
        villageId: this.props.villageId,
        operationCenterIds: [props.ocId]
      }, // 已分配设备筛选条件集合
      tableLeftLoading: false, // 未分配loading
      tableRightLoading: false, // 已分配loading
      unbindTotal: 0, // 未分配总数
      bindTotal: 0, // 已分配总数
    }
  }

  componentWillMount() {
    const { DeviceManagementStore } = this.props;
    /**获取羚羊云设备分组 */
    DeviceManagementStore.getLingyangOrgs().then(res => {
      let searchDateLeft = Object.assign({}, this.state.searchDateLeft, { lyGroupId: res[0].id })
      let searchDateRight = Object.assign({}, this.state.searchDateRight, { lyGroupId: res[0].id })
      this.setState({
        deviceGroup: res,
        searchDateLeft,
        searchDateRight
      });
    });
    // 获取未分配列表
    this.allDeviceNotBindSearch()
    // 获取已分配列表
    this.allDeviceBeBindSearch()
  }
  /**
   * 处理请求参数
   */
  handleParams = (obj) => {
    let searchDate = Object.assign({}, obj)
    let { deviceTypes, placeType, lyGroupId, keyWord } = searchDate
    console.log(searchDate)
    deviceTypes = _.flattenDeep(deviceTypes.split(','))
    let handlesearchDate = {
      deviceTypes: deviceTypes[0] === '-1' ? deviceTypesAll : deviceTypes,
      installationSite: placeType === null ? undefined : placeType,
      lygroupId: lyGroupId === '-1' ? undefined : lyGroupId,
      keyWords: keyWord
    }
    searchDate = _.omit(searchDate, 'deviceType')
    searchDate = _.omit(searchDate, 'lyGroupId')
    searchDate = _.omit(searchDate, 'placeType')
    searchDate = _.omit(searchDate, 'keyWord')
    return Object.assign({}, searchDate, handlesearchDate)
  }
  /**
   * 所有未分配设备列表
   */
  allDeviceNotBindSearch = () => {
    this.setState({
      tableLeftLoading: true
    });
    const { OperationCenterDeviceSollotStore } = this.props;
    let searchDate = this.handleParams(this.state.searchDateLeft)
    OperationCenterDeviceSollotStore.getAllList(searchDate).then(res => {
      let result = res.result
      if (result) {
        this.setState({
          unbindTotal: result.resultSize,
          allDeviceNotBind: result.resultList,
          tableLeftLoading: false
        });
      }
    },() => {
      this.setState({
        tableLeftLoading: false
      });
    });
  };
  /**
   * 所有已分配设备列表
   */
  allDeviceBeBindSearch = () => {
    this.setState({
      tableRightLoading: true
    });
    const { OperationCenterDeviceSollotStore } = this.props;
    let searchDate = this.handleParams(this.state.searchDateRight)
    OperationCenterDeviceSollotStore.getList(searchDate).then(res => {
      let result = res.result
      if (result) {
        this.setState({
          bindTotal: result.resultSize,
          allDeviceBeBind: result.resultList,
          tableRightLoading: false
        });
      }
    },() => {
      this.setState({
        tableRightLoading: false
      });
    });
  };
  onSearchChange = (obj, leftOrRight, isResetPage) => {
    let searchDate = {}
    let pageReset = isResetPage ? { page: 1 } : {}
    if (leftOrRight === 'left') {
      searchDate = Object.assign({}, this.state.searchDateLeft, obj, pageReset)
      this.setState({
        searchDateLeft: searchDate
      }, () => {
        // 刷新未分配摄像机列表
        this.allDeviceNotBindSearch()
      })
    } else {
      searchDate = Object.assign({}, this.state.searchDateRight, obj, pageReset)
      this.setState({
        searchDateRight: searchDate
      }, () => {
        // 刷新已分配摄像机列表
        this.allDeviceBeBindSearch()
      })
    }
  }
  updateDeviceComplete = (type) => {
    let searchDateLeft = Object.assign({}, this.state.searchDateLeft, {page: 1})
    let searchDateRight = Object.assign({}, this.state.searchDateRight, {page: 1})
    this.setState({
      [type === 1 ? 'leftRowKeys' : 'rightRowKeys']: [],
      searchDateLeft,
      searchDateRight
    },() => {
      // 获取未分配列表
      this.allDeviceNotBindSearch()
      // 获取已分配列表
      this.allDeviceBeBindSearch()
      this.props.getLargeDeivceList()
    })
  }
  // 未分配勾选
  setLeftKeys = (selectedRowKeys) => {
    this.setState({
      leftRowKeys: selectedRowKeys
    })
  }
  // 已分配勾选
  setRightKeys = (selectedRowKeys) => {
    this.setState({
      rightRowKeys: selectedRowKeys
    })
  }

  /**分配与取消分配 */
  updateDeivceSollot = type => {
    const {
      leftRowKeys,
      rightRowKeys
    } = this.state
    return this.props.OperationCenterDeviceSollotStore.updateDeviceOcId({
      [type === 1 ? 'toOcId' : 'fromOcId']: this.props.ocId,
      [type === 1 ? 'deviceIds' : 'outDeviceIds']: type === 1 ? leftRowKeys : rightRowKeys
    }).then(() => {
      this.updateDeviceComplete(type)
    })
  }
  render() {
    const {
      deviceGroup,
      leftRowKeys,
      rightRowKeys,
      allDeviceNotBind = [],
      allDeviceBeBind = [],
      searchDateLeft,
      searchDateRight,
      unbindTotal,
      bindTotal,
      tableLeftLoading,
      tableRightLoading
    } = this.state
    return (
      <div className='village-assign-devices'>
        <div className="left-table-container">
          <SearchInputGroup
            deviceGroup={deviceGroup}
            onChange={(value) => this.onSearchChange(value, 'left', true)}
            title='未分配设备'
            searchData={searchDateLeft}
          />
          <TableList
            dataSource={allDeviceNotBind}
            rowKey='id'
            paginationChange={value => this.onSearchChange(value, 'left')}
            searchData={searchDateLeft}
            total={unbindTotal}
            loading={tableLeftLoading}
            deviceGroup={deviceGroup}
            // showSN={true}
            rowSelection={{
              selectedRowKeys: leftRowKeys,
              onChange: this.setLeftKeys,
              columnWidth: 20
            }}
          />
        </div>
        <div className="center-btn-container">
          <MiddleGroup
            leftRowKeys={leftRowKeys}
            rightRowKeys={rightRowKeys}
            updateListData={this.updateDeviceComplete}
            villageId={this.props.villageId}
            ocId={this.props.ocId}
            updateDeivceSollot={this.updateDeivceSollot}
          />
        </div>
        <div className="right-table-container">
          <SearchInputGroup
            deviceGroup={deviceGroup}
            onChange={(value) => this.onSearchChange(value, 'right', true)}
            title='已分配设备'
            // showSN={true}
            searchData={searchDateRight}
          />
          <TableList
            dataSource={allDeviceBeBind}
            rowKey='id'
            paginationChange={value => this.onSearchChange(value, 'right')}
            searchData={searchDateRight}
            total={bindTotal}
            loading={tableRightLoading}
            deviceGroup={deviceGroup}
            rowSelection={{
              selectedRowKeys: rightRowKeys,
              onChange: this.setRightKeys,
              columnWidth: 30
            }}
          />
        </div>
      </div>
    )
  }
}
export default assignDevices;