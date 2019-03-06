import React from 'react'
import {withRouter} from 'react-router-dom'
import { observer } from 'mobx-react'
import { Card ,Button, Modal} from 'antd'
import moment from 'moment';
import IconSpan from 'src/components/IconSpan';
import { BusinessProvider }from 'src/utils/Decorator/BusinessProvider'
import CustomPagination from '../../components/ModuleWrapper/CustomPagination';
import MapCenter from 'src/view/SystemManagement/components/MapZoomAndLevel'
import Pagination from 'src/components/Pagination';
import wifiIcon from '../wifiImg/wifiIcon.svg'
import './wifiList.scss'

@withRouter
@BusinessProvider('wifiStore')
@observer
class WifiList extends React.Component{
  state = {
    showMap :false,
    locationName:'',
    locationDetail:'',
    locationMapCenter:{},
  }
  //计算卡片的日历时间，显示**天、**时  或者是**时、**分
  accountTime = (startTime,endTime) => {
    var onlineTime
    var offlineTime
    var start = Number(new Date(startTime))
    var end = Number(new Date(endTime))
    console.log(start,end,30)
    var timediff = Math.abs(end - start)
    var onLineHours = Math.floor(timediff/(60*60))
    console.log(onLineHours,33)
    var timeRange = {}
    if(onLineHours>24){
      onlineTime = (<p><span>{Math.floor(onLineHours/24)}</span> <span>天</span></p> )
      offlineTime = (<p><span>{ Math.floor((timediff/60/60-Math.floor(onLineHours/24)*24)) }</span><span>时</span></p>)
    }else{
      onlineTime = (<p><span>{onLineHours}</span><span>时</span></p>)
      offlineTime = (<p><span>{Math.floor((timediff-onLineHours*60*60)/60)}</span><span>分</span></p>)
    }
    timeRange = {onlineTime, offlineTime}
    return (timeRange)
  }
  //点击位置详情
  locationDetail = (locationDetail,locationName,longitude,latitude) => {
    const mapCenter = [longitude,latitude] 
    this.setState({
      showMap:true,
      locationDetail,
      locationName,
      locationMapCenter:{center:mapCenter,zoom:18}
    })
  }
  //关闭位置详情地图弹框
  canCelModal = () => {
    this.setState({
      showMap:false
    })
  }
  render(){
    const { showMap ,locationName,locationDetail,locationMapCenter}=this.state
    const { 
      listData=[], 
      className , 
      customPagenation=true,
      current, 
      pageSize,
      total,
      onPageChange
    } = this.props
    const mapTitle = (
      <div className="wifi-map-address">
        <IconSpan icon="icon-Add_Main"/>
          <b>{locationName}</b>
          <span>
            地址：
            {locationDetail}
          </span>
      </div>
    )
    return(
      <div className={className}>
        <div className="wifi-list-Container">
          {
            listData && listData.map( (v,k) => (
              <Card key={k} className='wifi-cards'>
                <div className="wifi-cards-top">
                {
                  v.endTime ? (
                    <span className="wificards-kalendar">
                      <Button className="wifi-kalendar-top">{this.accountTime(v.startTime,v.endTime).onlineTime}</Button>
                      <Button className="wifi-kalendar-bottom">{this.accountTime(v.startTime,v.endTime).offlineTime}</Button>
                    </span>
                  ):(
                    <span className="wificards-kalendar">
                      <img src={wifiIcon}/>
                    </span>
                  )
                }
                  <span className="wificards-device-name">
                    <span>设备MAC: </span>
                    <b>{v.deviceMac}</b>
                  </span>
                </div>
                <div className="wifi-cards-middle">
                  <b>时间：</b>
                  <span>
                    <IconSpan icon="icon-Clock_Light" className="wifi-time-online"/>
                    <span>发现：<span>{moment(v.startTime*1000).format('YYYY-MM-DD HH:mm:ss')}</span></span>
                  </span>
                  <span>
                    <IconSpan icon="icon-Clock_Light"/>
                    <span>离开：{v.endTime?<span>{moment(v.endTime*1000).format('YYYY-MM-DD HH:mm:ss')}</span>:'--'}</span>
                  </span>
                </div>
                <div className="wifi-cards-bottom">
                  <div className='wifi-cards-device-address'>
                    <b>采集设备:</b>   
                    <Button onClick = {() => this.locationDetail(v.address,v.captureDeviceName,Number(v.longitude),Number(v.latitude))}>
                      <IconSpan icon="icon-Add_Main"/>
                      位置详情
                    </Button>
                  </div>
                  <span>
                    <IconSpan icon="icon-Reset_Add_Light"/>
                    <span>经纬度：<span>{`${v.longitude}-${v.latitude}`}</span></span>
                  </span>
                  <span>
                    <IconSpan icon="icon-Task_Dark"/>
                    <span>名称：<span title={`${v.captureDeviceName}`}>{v.captureDeviceName}</span></span>
                  </span>
                  <span>
                    <IconSpan icon="icon-Community_Main"/>
                    <span>MAC : <span>{v.captureDeviceMac}</span></span>
                  </span>
                  <span>
                    <IconSpan icon="icon-Map_Main"/>
                    <span className="wifi-list-address">位置：<span title={`${v.address}`}>{v.address}</span></span>
                  </span>
                </div>
              </Card>
            ))
          }
        </div>
        <div className='wifi-pagination'>
          { customPagenation  
            ? <CustomPagination 
                current={current}
                pageSize={pageSize}
                total={total}
                onPageChange={onPageChange}
              />
            : <Pagination 
                total={total}
                current={current}
                pageSize={pageSize}
                onChange={onPageChange}
                pageSizeOptions={['10', '20', '50', '100', '200']}
              />
          }
        </div> 
        <Modal 
          visible = {showMap}
          onCancel = {this.canCelModal}
          className="wifi-location-map"
          // key={showMap}
          // title='位置详情'
        >
          <div className="wifi-map-title">位置详情</div>
          <div className='mapShow'>
            { showMap 
              ? <MapCenter className='userCenter-mpa' 
                  editable={false}
                  zoomLevelCenter={locationMapCenter}
                  showPoints={false}
                  showMapInfo={false}
                  title={mapTitle}
                  mapChange={false}
                />
              : null 
            }
          </div>
        </Modal>
      </div>
    )
  }
}
export default WifiList