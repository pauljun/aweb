import React, { Component } from 'react';
import SearchInputGroup from './components/searchInputGroup'
import { observer } from 'mobx-react';
import MiddleGroup from './components/Group';
import TableList from './components/TableList'
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { CommunityDeviceType } from 'src/libs/DeviceLib';
import './index.scss'
@BusinessProvider(
  'VillageListStore',
  'DeviceManagementStore'
)
@observer
class assignDevices extends Component {
  state = {
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
    }, // 未分配设备筛选条件集合
    searchDateRight: {
      page: 1,
      pageSize: 60,
      deviceTypes: '-1',
      placeType: null,
      villageId: this.props.villageId
    }, // 已分配设备筛选条件集合
    tableLeftLoading: false, // 未分配loading
    tableRightLoading: false, // 已分配loading
    unbindTotal: 0, // 未分配总数
    bindTotal: 0, // 已分配总数

  }
  componentWillMount(){
    const { DeviceManagementStore, VillageListStore, villageId } = this.props;
    /**获取羚羊云设备分组 */
    DeviceManagementStore.getLingyangOrgs().then(res => {
      let searchDateLeft = Object.assign({}, this.state.searchDateLeft, {lyGroupId: res[0].id})
      let searchDateRight = Object.assign({}, this.state.searchDateRight, {lyGroupId: res[0].id})
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
    // 处理摄像机门禁类型
    let device = []
    let { deviceTypes, placeType, lyGroupId } = searchDate
    if(deviceTypes === '103501,103502'){
      device = deviceTypes.split(',')
    }else if(deviceTypes === '-1'){
      // 传值为-1的时候过滤掉单兵
      CommunityDeviceType.forEach(item => {
        if(item.value === '-1'){
          //device.push(item)
        }else if(item.value === '103501,103502'){
          device.push('103501', '103502')
        }else{
          device.push(item.value)
        }
      })
    }else{
      device = [deviceTypes]
    }
    let handlesearchDate = {
      deviceTypes: device,
      placeType: placeType === null ? undefined : placeType,
      lyGroupId: lyGroupId === '-1' ? undefined: lyGroupId
    }
    return Object.assign({}, searchDate, handlesearchDate)
  }
  /**
   * 所有未分配设备列表
   */
  allDeviceNotBindSearch = () => {
    this.setState({
      tableLeftLoading: true
    });
    const { VillageListStore, activeId } = this.props;
    let searchDate = this.handleParams(this.state.searchDateLeft)
    VillageListStore.queryUnbindedVillageDevices(searchDate).then(res => {
      let result = res.result
      if(result){
        this.setState({
          unbindTotal: result.resultSize,
          allDeviceNotBind: result.resultList,
          tableLeftLoading: false
        });
      }
    }, () => {
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
    const { VillageListStore, activeId } = this.props;
    let searchDate = this.handleParams(this.state.searchDateRight)
    VillageListStore.queryVillageDevices(searchDate).then(res => {
      let result = res.result
      if(result){
        this.setState({
          bindTotal: result.resultSize,
          allDeviceBeBind: result.resultList,
          tableRightLoading: false
        });
      }
    }, () => {
      this.setState({
        tableRightLoading: false
      });
    });
  };
  /**
   * 搜索条件改变
   */
  onSearchChange = (obj, leftOrRight, isResetPage) => {
    console.log("明月几时有")
    let searchDate = {}
    let pageReset = isResetPage ? { page: 1 } : {}
    if(leftOrRight === 'left'){
      searchDate = Object.assign({}, this.state.searchDateLeft, obj, pageReset)
      this.setState({
        searchDateLeft: searchDate
      },() => {
        // 刷新未分配摄像机列表
        this.allDeviceNotBindSearch()
      })
    }else{
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
    // 重置page值
    let searchDateLeft = Object.assign({}, this.state.searchDateLeft, {page: 1})
    let searchDateRight = Object.assign({}, this.state.searchDateRight, {page: 1})
    this.setState({
      [type === 1 ? 'leftRowKeys' : 'rightRowKeys']: [],
      searchDateLeft,
      searchDateRight
    }, () => {
      // 获取未分配列表
      this.allDeviceNotBindSearch()
      // 获取已分配列表
      this.allDeviceBeBindSearch()
    })
  }
  // 未分配勾选
  setLeftKeys =(selectedRowKeys) => {
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
  render(){
    const { 
      deviceGroup, 
      leftRowKeys, 
      rightRowKeys, 
      allDeviceNotBind=[],
      allDeviceBeBind=[],
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
            rowKey='deviceId'
            paginationChange={value => this.onSearchChange(value, 'left')}
            searchData={searchDateLeft}
            total={unbindTotal}
            loading={tableLeftLoading}
            deviceGroup={deviceGroup}
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
          />
        </div>
        <div className="right-table-container">
          <SearchInputGroup 
            deviceGroup={deviceGroup}
            onChange={(value) => this.onSearchChange(value, 'right', true)}
            title='已分配设备'
            searchData={searchDateRight}
          />
          <TableList 
            dataSource={allDeviceBeBind}
            rowKey='deviceId'
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
