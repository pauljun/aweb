import React from 'react'
import { observer } from 'mobx-react'
import { Spin,message } from 'antd'
import { BusinessProvider }from 'src/utils/Decorator/BusinessProvider'
import { withRouter } from 'react-router-dom'
import ModuleWrapper from '../components/ModuleWrapper'
import getTimeRange from '../components/SearchGroupNew/timeRadioUtil'
import BackTopComponent from '../../BusinessComponent/BackToTop/index'
import NoData from '../../../components/NoData/index'
import SearchList from './components/searchList'
import WifiList from './components/wifiList'
import _ from 'lodash';

@withRouter
@BusinessProvider('wifiStore') 
@observer
class WifiLibrary extends React.Component{
  state = {
    loading: true,
    timeRadio: 3,
    list:[],
    current: 1,
    total: 0,
    searchValue:'',
    wifiDeviceOptions:null,
    wifiDeviceAllIds:[],
    deviceNames:[]
  }
  selectedDevices=[]

  componentDidMount = async () => {
    const {wifiStore}=this.props
    const wifiDeviceAllIds = []
    const deviceNames = []
    const list = await wifiStore.getWifiDevices({ page:1,pageSize:999});
    const wifiDeviceOptions = list.list
    wifiDeviceOptions.map(v => { 
      wifiDeviceAllIds.push(v.manufacturerDeviceId)
      deviceNames.push(v.deviceName)
    })
    this.setState({
      wifiDeviceOptions,
      wifiDeviceAllIds,
      deviceNames
    })
    this.handleReload();
  }
  // 当选择的wifi采集设备改变时候
  handleDevicesChange = (value) => {
    this.selectedDevices = _.cloneDeep(value)
  }
  // 搜索WiFi信息
  handleWifi = (value) => {
    // var regu = /(([a-f0-9]{2}:)|([a-f0-9]{2}-)|([a-f0-9]{2}\/)){5}[a-f0-9]{2}/gi;
    // var re = new RegExp(regu);
    // if (re.test( value )) {
    //      this.handleReload({keyWord:value})
    //   }else{
    //     message.warning("请输入正确的MAC地址格式")
    //   }
    this.handleReload({keyWord:value})
  }
  // 翻页事件
  handlePageChange =(page,pageSize) => {
    this.handleSearch({pageSize,page})
  }

  // wifi采集设备
  searchWifiDevice = async () => {
    const {wifiDeviceAllIds}=this.state
    let captureDeviceCids = []
    if(!this.selectedDevices.length){
      captureDeviceCids = wifiDeviceAllIds;
    }
    return captureDeviceCids.length > 0 ? { captureDeviceCids } : {};
  }

  //查询wifi列表
  handleSearch = async (options={}) => {
    const {wifiStore}=this.props
    const captureDeviceCids = await this.searchWifiDevice();
    await wifiStore.editSearchData(Object.assign({}, options, captureDeviceCids))
    this.setState({loading:true})
    const list = await wifiStore.getList(wifiStore.searchData);
    this.setState({
      list:list.list,
      loading:false,
      total:list.total
    })
  }

  // 刷新列表
  handleReload = (options={},clearSearchValue) => {
    const { timeRadio } = this.state;
    const timeRange = timeRadio === 2 ? {} : getTimeRange(timeRadio);
    const searchData = Object.assign({}, options, timeRange, {page: 1})
    this.handleSearch(searchData)
    if(clearSearchValue){
      this.setState({
        searchValue: ''
      })
    }
  }

  handleSearchChange = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  }
  //设置时间radio值
  setTimeRadioValue = (timeRadio, callback) => {
    this.setState({
      timeRadio
    }, () => callback&&callback())
  }
  
  //datePicker 自定义时间的时候触发事件
  handleDateChange = (options) => {
    const { wifiStore } = this.props;
    wifiStore.editSearchData(options)
  }
  render(){
    const { wifiStore } = this.props;
    const { timeRadio,list,loading,current,total,searchValue,wifiDeviceOptions, wifiDeviceAllIds,deviceNames} = this.state;
    const { pageSize ,page} = wifiStore.searchData || {};
    return(
      <ModuleWrapper 
        total={total}
        title='wifi资源库'
        current={page}
        onPageChange={this.handlePageChange}
        onReload={this.handleReload}
        pageSize={pageSize}
      >
        <SearchList 
          wifiDeviceAllIds={wifiDeviceAllIds}
          deviceNames={deviceNames}
          handleDevicesChange={this.handleDevicesChange}
          wifiDeviceOptions={wifiDeviceOptions}
          handleDateChange={this.handleDateChange}
          searchDataChange={this.handleReload} 
          timeRadioValue={timeRadio}
          setTimeRadioValue={this.setTimeRadioValue}
          handleSearchWifi={this.handleSearch}
          searchValue={searchValue}
          placeholder='请输入关键字搜索'
          onSearch={this.handleWifi}
          onSearchChange={this.handleSearchChange}
        />
        <BackTopComponent>
          <Spin spinning={loading}>
            {((list && list.length) || loading) 
              ? <WifiList 
                  listData={list}
                  className="wifi-list-wrapper"
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  handleSearch={this.handleSearch}
                  onPageChange={this.handlePageChange}
                />
              : <NoData />
            }  
          </Spin>
        </BackTopComponent>
      </ModuleWrapper>
    )
  }
}
export default WifiLibrary