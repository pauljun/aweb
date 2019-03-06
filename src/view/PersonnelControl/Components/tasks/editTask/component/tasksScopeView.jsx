import React, { Component } from 'react';
import { Button } from 'antd'
import MapMarkerView from '../../../../../BusinessComponent/MapMarkerView/index'
import DeviceIcon from '../../../../../../components/DeviceIcon/index'
import Pagination from '../../../../../../components/Pagination/index'
import IconFont from 'src/components/IconFont'
export default class TasksScopeView extends Component {
  state = {
    type: 1,
    device: [],
    deviceNow: [], // 当前渲染的数据
    pageSize: 60,
    total: 0,
    current: 1,
    pageSizeOptions: ['60','120','180']
  }
  componentDidMount(){
    let device = this.props.item.device || []
    let deviceNow = device.slice(0, 59)
    this.setState({
      device,
      total: device.length,
      deviceNow
    })
  }
  componentWillReceiveProps(nextprops){
    if(nextprops.item.device !== this.props.item.device){
      let device = nextprops.item.device || []
      let deviceNow = device.slice(0, 60)
      this.setState({
        device,
        total: device.length,
        deviceNow
      })
    }
  }
  // shouldComponentUpdate(nextProps){
  //   if(nextProps.item.device === this.props.item.device){
  //     return false
  //   }
  //   return true
  // }
  changeType = (type) => {
    if(this.state.type !== type){
      this.setState({type})
    }
  }
  // 前端分页处理
  change = (page, pageSize) => {
    let device = this.state.device
    let deviceNow = device.slice((page - 1) * pageSize, page * pageSize)
    this.setState({
      current: page,
      pageSize,
      deviceNow
    })
  }
  render(){
    const { device, pageSize, total, current, pageSizeOptions, deviceNow } = this.state
    return (
      <div className="tasks_scope_view info_view">
        <div className="change_type">
          <Button className={`btn ${this.state.type === 1 && 'active'}`} onClick={this.changeType.bind(this, 1)}><IconFont type="icon-List_Map_Main"/>地图模式</Button>
          <Button className={`btn ${this.state.type === 2 && 'active'}`} onClick={this.changeType.bind(this, 2)}><IconFont type="icon-List_Tree_Main"/>列表模式</Button>
        </div>
        <div className="content">
          {this.state.type === 1 ? 
            <div className="map_show">
              <MapMarkerView 
                points={device}
              />
            </div>:
            <div className="device_list">
              <div className="list">
                {deviceNow.map(item => {
                  return <span key={item.id} title={item.deviceName}>
                     <DeviceIcon 
                      type={item.deviceType}
                      status={item.deviceData}
                    /> 
                    {item.deviceName}
                    </span>
                })}
              </div>
              {device.length > 60 &&<div className="device_pagination">
                <Pagination 
                  total={total}
                  pageSize={pageSize}
                  current={current}
                  pageSizeOptions={pageSizeOptions}
                  onChange={this.change}
                />
              </div>}
            </div>
          }
        </div>
      </div>
    )
  }
}