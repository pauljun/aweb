import React from 'react'
import { Checkbox,Row,Col} from 'antd'
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { BusinessProvider }from 'src/utils/Decorator/BusinessProvider'
import IconSpan from 'src/components/IconSpan'
import IconFont from 'src/components/IconFont'
import InputSearch from 'src/components/SearchInput/indexOnChange';
import _ from 'lodash';
import './wifiDeviceList.scss'

const CheckboxGroup = Checkbox.Group
@withRouter
@BusinessProvider('wifiStore') 
@observer
class WifiDeviceList extends React.Component{
  state={
    checkedListIds: [],//左边选中的设备id数组 deviceListInfo是wifi地图框选的列表信息
    selectedDevice: [],//右边要展示的设备信息
    checkAll:false,
    indeterminate:false,
    keyWords: '',
    searchDevices:this.props.wifiDeviceOptions
  }
 componentDidMount = () => {
  const { getWifiDevice }=this.props;
  if(getWifiDevice){
    getWifiDevice(this)
  }
  const { mapDeviceListInfo, indeterminateStatus } = this.props;
  this.setState({
    checkedListIds: _.cloneDeep(mapDeviceListInfo.checkedListIds),
    selectedDevice: _.cloneDeep(mapDeviceListInfo.selectedDevice),
    checkAll: indeterminateStatus===2 ? true:false,
    indeterminate: indeterminateStatus===1 ? true:false
  })
 }
  //点击全选框  
  onCheckAllChange = (e) => {
    const { wifiDeviceOptions }=this.props; 
    const { searchDevices, checkedListIds } = this.state;
    const searchCheckedIds = searchDevices.map(v => v.id);
    let newSelectIds = [];
    if(e.target.checked) {
      newSelectIds = _.uniq([...checkedListIds, ...searchCheckedIds]);
    } else {
      newSelectIds = _.difference(checkedListIds, searchCheckedIds);
    }
    let newSearchDevices = [];
    wifiDeviceOptions.map(v => {
      if(newSelectIds.indexOf(v.id) !== -1) {
        newSearchDevices.push(v)
      }
    })
    this.setState({
      selectedDevice: newSearchDevices,
      checkedListIds: newSelectIds,
      checkAll: e.target.checked,
      indeterminate: false,
    })
  }
  // 点击checkbox选择设备
  onChange = (checkedList) => {
    this.addOrDelete('add',checkedList)
  }
  //列表模式删除选中的选项
  deleteDeviceItem = (item) => {
    this.addOrDelete('delete',item)
  }
//列表添加或删除
addOrDelete = (type,item) => {
  const { searchDevices, selectedDevice } = this.state
  const { wifiDeviceOptions }=this.props
  let selectDeviceTemp = [];
  if( type=="add"){
    if(item.length < selectedDevice.length){
      // 取消选中
      selectedDevice.map(v => {
        if(item.indexOf(v.id) !== -1 ) {
          selectDeviceTemp.push(v);
        }
      })
    } else {
      // 选中
      item.map(v => {
        const item = selectedDevice.find(x => x.id === v);
        if(!item) {
          selectedDevice.push(wifiDeviceOptions.find(x => x.id === v));
        }
      })
      selectDeviceTemp = selectedDevice;
    }
  }else{
    selectedDevice.map(v => {
      if(item.indexOf(v.id) === -1 ) {
        selectDeviceTemp.push(v);
      }
    })
  }
  const newSelectedDevice = _.intersectionBy(
    wifiDeviceOptions,
    selectDeviceTemp,
    'id'
  );
  const checkedListIds = newSelectedDevice.map(v => v.id);
  const searchIds = searchDevices.map(v => v.id);
  const searchCheckdIds = _.intersection(checkedListIds, searchIds);
  this.setState({
    selectedDevice: newSelectedDevice,
    checkedListIds,
    checkAll: !!searchIds && searchCheckdIds.length === searchIds.length,
    indeterminate:!!searchCheckdIds.length && (searchCheckdIds.length < searchIds.length),
  })
}
  //搜索wifi设备
  changeKeyWord = (value='') => {
    const { wifiDeviceOptions } = this.props;
    const { selectedDevice } = this.state
    value = value.trim();
    const searchDevices = wifiDeviceOptions.filter(v => v.deviceName.indexOf(value) !== -1);
    let hadSelected = _.intersectionBy(
      searchDevices,
      selectedDevice,
      'id'
    );
    this.setState({
      keyWords: value.trim(),
      searchDevices,
      checkAll: !!hadSelected.length && hadSelected.length === searchDevices.length,
      indeterminate: !!hadSelected.length && (hadSelected.length < searchDevices.length),
    })
  }

//清空选择的wifi设备列表
  clearDevices= () => {
    const {selectedDevice}=this.state
    const clearAllIds = selectedDevice.map(v => v.id)
    this.deleteDeviceItem(clearAllIds)
  }
  render(){
    const {checkAll,checkedListIds,indeterminate,selectedDevice, keyWords, searchDevices }=this.state;
    console.log(searchDevices,999)
    return (
      <div className="wifi-grap-point">
        <div className="grappoint-modal-body">
          <div className="wifi-device-wrapper">
            <div className="wifi-device-title">
              <span>wifi列表</span>
              <span>
                <InputSearch
                  className="device-search-wrapper"
                  placeholder="请输入你要搜索的wifi"
                  onChange={this.changeKeyWord}
                /> 
              </span>
            </div>
            <div className="wifi-device-list">
              <Row>
                <Col span={24} className="wifi-checked-all">
                  <Checkbox onChange={this.onCheckAllChange} checked ={checkAll} indeterminate={indeterminate}>全选</Checkbox>
                </Col>
              </Row>
              <CheckboxGroup value={checkedListIds} onChange={this.onChange}>
                <Row>
                  { searchDevices.map((v) => (
                    <Col span={24} key={v.id} >
                      <Checkbox value={v.id} className={ v.deviceData=='1' ? "wifiOnline" : 'wifiOffline'}> 
                        <IconSpan icon="icon-_Wifi__Green_Dark" />
                        { keyWords && v.deviceName.indexOf(keyWords) !== -1
                            ? <span dangerouslySetInnerHTML={{ __html: v.deviceName.split(keyWords).join('<span class="highlight">'+ keyWords +'</span>')}} />
                            : v.deviceName
                        }
                      </Checkbox>
                      <span className="wifi-list-close">
                        <IconSpan 
                          type="icon-Close_Main"
                          className="delete-item"
                          onClick={() => this.deleteDeviceItem([v.id])}
                        />
                      </span>
                    </Col>
                  ))}
                </Row>
              </CheckboxGroup>
            </div>
          </div>
          <div className="wifi-device-choosed-wrapper">
            <div className="wifi-device-title">
              <span>已选wifi采集设备{checkedListIds.length}</span>
              <span className="clear" onClick={this.clearDevices}>
                <IconSpan icon="icon-Delete_Main"/>
                 清空
              </span>
            </div>
            <div className="wifi-choosed-list">
              <Row>
                { selectedDevice.map((v,k) => (
                    <Col span={24} key={k}>
                      <div className="ant-checkbox-wrapper">
                        <IconSpan icon="icon-_Wifi__Green_Dark"/>
                      <span>{v.deviceName}</span>
                      </div>
                      <span className="wifi-list-close">
                        <IconFont 
                          type="icon-Close_Main"
                          className="delete-item"
                          onClick={() => this.deleteDeviceItem([v.id])}
                        />
                      </span>
                    </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default WifiDeviceList



