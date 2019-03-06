import React from 'react';
import { observer } from 'mobx-react';
import MapSollotWrapper from '../../../../BusinessComponent/MapSelect';
import MiddleGroup from '../../../Village/components/DeviceSollots/DeviceSollot/assignDevices/components/Group';
import { Button, message, Spin} from 'antd';
import DeviceList from '../../../../BusinessComponent/DeviceList';
import _ from 'lodash';
import { Promise } from 'core-js';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';

@BusinessProvider(
  'OperationCenterDeviceSollotStore',
  'DeviceManagementStore'
)
@observer
export default
  class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      deviceUnBindChecked:[],
      deviceBindChecked:[],
      leftRowKeys:[],
      rightRowKeys:[],
      leftList:[],
      rightList:this.props.selectList.map(v => v)
    };
  }
  deviceUnBindList=[];
  deviceBindList=[]
  changeSelectList = leftList => {
    this.setState({ leftList });
  };
  /**删除 */
  deleteDeviceItem = item => {
    const { leftList } = this.state;
    const index = leftList.findIndex(v => v.id === item.id);
    leftList.splice(index, 1);
    this.setState({ leftList });
  }


  /**保存 */
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

  updateDeviceComplete = ( type) => {
    const { selectList, onOk } = this.props
    const { leftList,deviceUnBindChecked,deviceBindChecked,rightList} = this.state
    let outDeviceIds=[]
    let deviceIds=[]
    // /**删除列表 */
    // const outDeviceIds = _.difference(leftList,deviceUnBindChecked ).map(v => v.id)
    // /**新增列表 */
    // const deviceIds = _.difference(rightList, selectList).map(v => v.id)

    if (!deviceIds.length && !outDeviceIds.length) {
      return message.error('请选择需要分配或者取消的设备!')
    }
    this.setState({
      loading: true
    })
    if(outDeviceIds.length){
      this.updateDeviceOcIdDel(outDeviceIds).then(res => {
        if(!deviceIds.length){
          onOk(leftList)
        }
      })
    }    
    let requests = []
    if(deviceIds.length){
      for(var i = 0; i < deviceIds.length / 20000; i++){
        requests.push(this.updateDeviceOcIdAdd(i, deviceIds))
      }
      Promise.all(requests)
        .then(res => {
          onOk(rightList)
        })
    }
    if(type==1){
        this.setState({
           leftList: _.difference(leftList,deviceUnBindChecked ),
           rightList:_.concat(rightList, deviceUnBindChecked)
        })

    } else{
      this.setState({
        leftList:_.concat(rightList, deviceBindChecked),
        rightList: _.difference(deviceBindChecked,rightList )
      })
    }
  }
  
  /**新增 */
  updateDeviceOcIdAdd = (i, deviceIds) => {
    const {
      ocId,
      deviceSollotStore
    } = this.props
    let ids = deviceIds.slice(i*20000, (i + 1)*20000)
    /**新增列表 */
    return deviceSollotStore.updateDeviceOcId({
      toOcId: ocId,
      deviceIds: ids,
    })
  }
  /**删除 */
  updateDeviceOcIdDel = ids => {
    const {
      ocId,
      deviceSollotStore
    } = this.props
    /**删除 */
    return deviceSollotStore.updateDeviceOcId({
      fromOcId: ocId,
      outDeviceIds: ids,
    })
  }

  //地图选中列表
  handleCheckDevice = (checked,item,type) => {
    if(type=="unbind"){
      if(checked){
        this.deviceUnBindList.push(item)
      }else{
        const index=this.deviceUnBindList.indexOf(item)
        this.deviceUnBindList.splice(index,1)
      }
      this.setState({
        deviceUnBindChecked:this.deviceUnBindList,
        leftRowKeys:this.deviceUnBindList.map(v => v.id)
      })
    }else{
      if(checked){
        this.deviceBindList.push(item)
      }else{
        const index=this.deviceBindChecked.indexOf(item)
        this.deviceBindChecked.splice(index,1)
      }
      this.setState({
        deviceBindChecked:this.deviceBindList,
        rightRowKeys:this.deviceBindList.map(v => v.id)
      })
    }
  }

  onCheckAllChange = (checked,type) => {
    const {leftList}=this.state
    console.log(leftList,'list')
    if(type=="unbind"){
      if(checked){
        this.deviceUnBindList=leftList
      }else{
        this.deviceUnBindList=[]
      }
      this.setState({
        deviceUnBindChecked:this.deviceUnBindList,
        leftRowKeys:this.deviceUnBindList.map(v => v.id)
      })
    }else{
      if(checked){
        this.deviceBindList=(this.props.selectList.map(v => v))
      }else{
        this.deviceBindList=[]
      }
    }
    this.setState({
      deviceBindChecked:this.deviceBindList,
      rightRowKeys:this.deviceBindList.map(v => v.id)
    })
  }
 

  render() {
    const{isShowList}=this.props
    const {
      leftList,
      loading,
      deviceUnBindChecked,
      deviceBindChecked,
      rightList
    } = this.state
    console.log(leftList,rightList,196)
    return (
      <React.Fragment>
        <Spin spinning={loading}>
          <div className="opt-map-select">
            <MapSollotWrapper
              checkable={true}
              deleteDeviceItem={this.deleteDeviceItem}
              onSelect={this.changeSelectList}
              selectList={leftList}
              clearConfirm={true}
              points={this.props.points}
              onCheckItemChange={(e,item,type) => this.handleCheckDevice(e,item,'unbind')}
              selectDeviceList={deviceUnBindChecked}
              onCheckAllChange={(e,type) => this.onCheckAllChange(e,'unbind')}
            />
            <div className="center-btn-container">
              <MiddleGroup
                leftRowKeys={deviceUnBindChecked}
                rightRowKeys={deviceBindChecked}
                updateListData={this.updateDeviceComplete}
                villageId={this.props.villageId}
                ocId={this.props.ocId}
                updateDeivceSollot={this.updateDeivceSollot}
              />
            </div>
            <div className="opt-center-map-right">
              {(this.props.selectList.map(v => v).length > 0 || isShowList) && (
                <DeviceList
                  clearSelect={this.clearDraw}
                  deviceList={rightList}
                  checkable={true}
                  title={`已分配设备(${this.props.selectList.map(v => v).length}个)`}
                  onCheckItemChange={(e,item,type) => this.handleCheckDevice(e,item,'bind')}
                  selectDeviceList={deviceBindChecked}
                  onCheckAllChange={(e,type) => this.onCheckAllChange(e,'bind')}
                />
              )}
            </div>
          </div>
          {/* <div className='opt-center-group'>
            <Button
              onClick={this.props.changeModel}
            >
              取消
					</Button>
            <Button
              type="primary"
              onClick={this.submit.bind(this)}
            >
              保存
					</Button>
          </div> */}
        </Spin>
      </React.Fragment>
    )
  }
}