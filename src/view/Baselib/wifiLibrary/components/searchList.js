import React from 'react'
import { Modal,Button, Input } from 'antd'
import { observer } from 'mobx-react'
import { BusinessProvider }from 'src/utils/Decorator/BusinessProvider'
import { withRouter } from 'react-router-dom'
import _ from 'lodash';
import { TimeRadio} from '../../components/SearchGroupNew/';
import IconFont from 'src/components/IconFont'
import MapSelect from 'src/view/BusinessComponent/MapSelect';
import WifiDeviceList from './wifiDeviceList'
import './searchList.scss'
const Search = Input.Search
@withRouter
@BusinessProvider('wifiStore')
@observer
class SearchList extends React.Component{
  state = {
    wifiGroupView:false,
    Modalcontent:null,
    wifiDeviceSelected:[],
    mapShowSelected:[],
    wifiDeviceAll:[], // 所有的wifi设备信息
    wifiDeviceAllIds:[],//所有wifi设备的manufacturerDeviceId,设备的cid
    deviceNames:[],//所有的wifi采集设备名称列表
    indeterminateStatus:0,//0为不选中 1 为半选中 2为全选中
    modalType: 1,
    mapDeviceListInfo:{checkedListIds:[],selectedDevice:[]},
  }

   
  //关闭wifi设备列表弹窗
  handleCancel = () => {
    this.setState({
      wifiGroupView: false
    })
  }
  //显示地图模式或者列表模式
  showDeviceSelect = (modalType) => {
    this.setState({
      modalType,
      wifiGroupView: true
    })
  }
  getModalContent = (type) => {
    const { mapShowSelected, mapDeviceListInfo,indeterminateStatus}=this.state
    const {wifiDeviceOptions=[],deviceNames=[]}=this.props;
    var Modalcontent = null;
    switch(type){
      case 1:
        Modalcontent = (
          <WifiDeviceList 
            getWifiDevice={deviceSelectedList => this.deviceSelectedList = deviceSelectedList} 
            wifiDeviceOptions={wifiDeviceOptions}
            deviceNames={deviceNames}
            mapDeviceListInfo={mapDeviceListInfo}
            indeterminateStatus={indeterminateStatus}
            inputSearchDevices={this.inputSearchDevices}
          />
        )
      break;
      case 2:
        Modalcontent = (
          <MapSelect 
            getWifiDevice={deviceSelectedList => this.deviceSelectedList = deviceSelectedList}
            selectList={mapShowSelected} 
            title="已选wifi采集设备" 
            onSelect={this.changeSelectList} 
            points={wifiDeviceOptions} 
            deleteDeviceItem={this.deleteDeviceItem}
            iconType={103408}
          />
        )
      break;
      default:
      break
    }
    return Modalcontent
  }
  //清除查询条件
  clear = () => {
    const { wifiStore, setTimeRadioValue, searchDataChange } = this.props
    wifiStore.initSearchData().then(
      () => {
        setTimeRadioValue(3, () => searchDataChange({}, true))
        this.clearWifiDevice()
      }
    )
  }
  
  change = (options,) => {
    this.props.searchDataChange(options,this.state.mapDeviceListInfo.selectedDevice)
  }

  //wifi采集设备列表弹窗点击确认查询wifi数据列表
  searchDevices = () => {
    const { modalType ,mapShowSelected}=this.state
    const { wifiDeviceAllIds }=this.props
    const {handleDevicesChange}=this.props
    let captureDeviceCids = []
    let wifiDeviceSelected = []
    const checkedListIds=[]
    const selectedDevice=[]
    let indeterminateStatus=0
    //如果是列表模式，那么左侧选中的设备列表等于type=1弹框中选中的设备
    //如果是地图模式，那么左侧选中的设备列表应该和地图弹框中设备列表保持一致
    if(modalType===1){
      wifiDeviceSelected = this.deviceSelectedList?this.deviceSelectedList.state.selectedDevice:[]
    }else{
      wifiDeviceSelected=mapShowSelected
    }
    //如果有选中的列表，则查询选中的wifi设备采集的wifi信息，如果清空设备列表，则查询所有的wifi设备采集的wifi信息
    if(wifiDeviceSelected.length>0){
      wifiDeviceSelected.map(v => {
        captureDeviceCids.push(v.manufacturerDeviceId)
        checkedListIds.push(v.id)
        selectedDevice.push(v)
      })
      if(wifiDeviceSelected.length===wifiDeviceAllIds.length){
        indeterminateStatus=2
      }else{
        indeterminateStatus=1
      }
    }else{
      captureDeviceCids=wifiDeviceAllIds
      indeterminateStatus=0
    }
    handleDevicesChange&&handleDevicesChange(selectedDevice)
    this.setState({
      wifiGroupView:false,
      wifiDeviceSelected,
      mapShowSelected:_.cloneDeep(wifiDeviceSelected),
      mapDeviceListInfo:{checkedListIds,selectedDevice},
      indeterminateStatus
    })
    this.props.handleSearchWifi({captureDeviceCids:captureDeviceCids,page:1})
  }

  //清空wifi采集设备列表
  clearWifiDevice = () => {
    const {wifiDeviceAllIds} = this.props;
    this.setState({
      mapShowSelected:[],
      wifiDeviceSelected:[],
      mapDeviceListInfo:{checkedListIds:[],selectedDevice:[]},
      indeterminateStatus:0

    })
  this.props.handleSearchWifi({captureDeviceCids:wifiDeviceAllIds,page:1})
  } 
  //地图模式中框选中或者是清空列表
  changeSelectList = (mapShowSelected) => {
    //在框选的列表中去重
    const selectedIds = []
    const selectedValue = []
    for (let i=0; i<mapShowSelected.length; i++){
      if(selectedIds.indexOf(mapShowSelected[i].id)==-1){
        selectedIds.push(mapShowSelected[i].id)
        selectedValue.push(mapShowSelected[i])
      }
    }
    this.setState({ 
      mapShowSelected:selectedValue
     });
  }
  //地图模式wifi列表点击删除列表项
  deleteDeviceItem = (item) => {
    const { mapShowSelected } = this.state;
    const index = mapShowSelected.findIndex(v => v.id === item.id);
    mapShowSelected.splice(index, 1);
    this.setState({ 
      mapShowSelected,
    });
  }

  render(){
    const { 
      timeRadioValue, 
      setTimeRadioValue, 
      wifiStore ,
      handleDateChange,
      onSearch,
      searchValue,
      placeholder,
      onSearchChange
    } = this.props;
    const { searchData={} } = wifiStore;
    const { wifiGroupView,wifiDeviceSelected, modalType} = this.state
    return(
      <div className='data-repository-search'>
      <div className="upload-or-search">
          {onSearch && (
            <Search 
              value={searchValue}
              enterButton
              placeholder={placeholder}
              onChange={onSearchChange}
              onSearch={onSearch}
            />
          )}
        </div>
        <div className="search-title">
          图库筛选：
          <Button className='reset-btn' onClick={this.clear}>重置</Button>
        </div>
        <div className='data-repository-search-form'>
          <TimeRadio
            change={handleDateChange}
            onOk={this.change}
            value={timeRadioValue}
            startTime={searchData.startTime}
            endTime={searchData.endTime}
            changeTimeRaioValue={setTimeRadioValue}
          />
          <div className="wifi-group-point">
            <div className='label-data-repository'>
              <IconFont type="icon-Add_Main" className="data-repository-icon" />
              点位：
            </div>
            <div className="item-content point-group">
              <div className="scope-type">
                <Button className='btn' onClick={() => this.showDeviceSelect(1)}><IconFont type="icon-List_Tree_Main" />列表模式</Button>
                <Button className='btn' onClick={() => this.showDeviceSelect(2)}><IconFont type="icon-List_Map_Main" />地图模式</Button>
              </div>
                {
                  wifiDeviceSelected.length > 0 ? (
                  <div className="wifi-left-list">
                    <div className="wifi-device-content">
                      {
                        wifiDeviceSelected.map((v) => (
                            <div key={v.id} className={ v.deviceData=='1' ? "wifiOnline" : 'wifiOffline'}>
                              <IconFont type="icon-_Wifi__Green_Dark" className="data-repository-icon" />
                              <span>{v.deviceName}</span>
                            </div>
                        ))
                      }
                    </div>
                    <div className="clear" onClick={this.clearWifiDevice}>
                      <IconFont type="icon-Delete_Main" className="data-repository-icon" />
                      <span>清空wifi采集设备列表</span>
                    </div>
                  </div>
                  ): ''
                }
              <Modal 
                wrapClassName={modalType==1?'wifi-grap-point':"wifi-map-point"}
                visible = {wifiGroupView}
                onCancel={this.handleCancel}
                onOk={this.searchDevices}
                destroyOnClose={true}
                title={modalType==1 ? "列表选择":"地图选择"}
              > 
                { wifiGroupView ? this.getModalContent(modalType) : null }
              </Modal>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default SearchList

