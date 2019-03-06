import React from 'react';
import MapSollotWrapper from '../../../../BusinessComponent/MapSelect';
import { Button, message, Spin } from 'antd';
import Group from '../../../../SystemManagement/Village/components/DeviceSollots/DeviceSollot/assignDevices/components/Group';
import DeviceList from '../../../../BusinessComponent/DeviceList';
import _ from 'lodash';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { CommunityDeviceType } from 'src/libs/DeviceLib';
import { Promise } from 'core-js';
const deviceTypesAll = _.flattenDeep(CommunityDeviceType.filter(v => v.value && v.value !== '-1').map(v => v.value.split(',')))
/** 
 * 数组去重
 */
function arrayUnique(arr, name) {
  var hash = {};
  return arr.reduce(function (item, next) {
    hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
    return item;
  }, []);
}
@BusinessProvider(
  'OperationCenterDeviceSollotStore',
  'DeviceManagementStore'
)
export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.selectList.map(v => v) || [],
      loading: false,
      rightSelct: [],
      leftSelect: [],
      leftSelectList: props.leftSList.map(v => v) || [],
      selectDeviceList: props.leftSelectList.map(v => v) || [],
      rightSelectDeviceList: props.rightSelectList.map(v => v) || [],
      searchDateRight: {
        page: 1,
        pageSize: 6000,
        deviceTypes: '-1',
        placeType: null,
        villageId: this.props.villageId,
        operationCenterIds: [props.ocId]
      }, // 已分配设备筛选条件集合
    };
  }
  changeSelectList = (list, addList) => {
    if (Array.isArray(addList)) {
      this.setState({
        leftSelectList: addList,
        selectDeviceList:addList
      });
      this.props.getLeftList(addList);
      this.getRowKeyArr(addList);
      this.props.getNewMarkerList(addList);
    }
    if (list.length == 0) {
      this.setState({ /* list, */ leftSelectList: [] });
      this.props.getLeftList([]);
      this.props.getSelectList([],true)
      this.getRowKeyArr([])
      this.setState({
        selectDeviceList:[]
      })
    }
    //this.setState({ list })
  };
  /**删除 */
  deleteDeviceItem = item => {
    const { list } = this.state;
    const index = list.findIndex(v => v.id === item.id);
    list.splice(index, 1);
    this.setState({ list });
  };
  /**分配与取消分配 */
  submit(type) {
    const {onOk } = this.props;
    const { list, rightSelct,leftSelect } = this.state;
    /**删除列表 */
    const outDeviceIds =type==1?[]:leftSelect.map(v => v.id);
    /**新增列表 */
    const deviceIds = type==1?rightSelct.map(
      v => v.id
    ):[];
    if (!deviceIds.length && !outDeviceIds.length) {
      return message.error('请选择需要删除或者新增的设备!');
    }
    this.setState({
      loading: true
    });
    if (outDeviceIds.length) {
      this.updateDeviceOcIdDel(outDeviceIds).then(res => {
        if (!deviceIds.length) {
          onOk(arrayUnique(rightSelct,'id'));
       }
      });
    }
    let requests = [];
    if (deviceIds.length) {
      for (var i = 0; i < deviceIds.length / 20000; i++) {
        requests.push(this.updateDeviceOcIdAdd(i, deviceIds));
      }
      Promise.all(requests).then(res => {
        onOk(list,arrayUnique(rightSelct,'id'),true);
      });
    }
    this.props.getLeftList([]);
  }
  /**新增 */
  updateDeviceOcIdAdd = (i, deviceIds) => {
    const { ocId, deviceSollotStore } = this.props;
    let ids = deviceIds.slice(i * 20000, (i + 1) * 20000);
    /**新增列表 */
    return deviceSollotStore.updateDeviceOcId({
      toOcId: ocId,
      deviceIds: ids
    });
  };
  /**删除 */
  updateDeviceOcIdDel = ids => {
    const { ocId, deviceSollotStore } = this.props;
    /**删除 */
     return deviceSollotStore.updateDeviceOcId({
      fromOcId: ocId,
      outDeviceIds: ids
    });
  };
  /**获取选中设备列表 */
  getRowKeyArr = (arr,type) => {
    if(type){
      this.setState({
        leftSelect:arr
      })
    } else 
    {this.setState({
      rightSelct: arr
    });}
  };
  handleCheckAll = (type, boxType) => {
    let {leftSelectList,list}=this.state;
    if (boxType == 0) {
      if (type) {
        this.setState({
          selectDeviceList: leftSelectList
        });
        this.props.getSelectList(leftSelectList,true);
        this.getRowKeyArr(leftSelectList);
      } else {
        this.setState({
          selectDeviceList: []
        });
        this.props.getSelectList([],true);
        this.getRowKeyArr([]);
      } 
    } else {
      if (type) {
        this.setState({
          rightSelectDeviceList: list
        });
        this.props.getSelectList(list);
        this.getRowKeyArr(list,true);
      } else {
        this.setState({
          rightSelectDeviceList: []
        });
        this.props.getSelectList([]);
        this.getRowKeyArr([],true);
      }
    }
  };
  // 单个选中改变事件
  handleItemChange = (checked, item, boxType) => {
    if (boxType == 0) {
      const deviceArray = this.state.leftSelectList;
      let { selectDeviceList } = this.state;
      if (checked) {
        selectDeviceList.push(item);
        const selectIds = selectDeviceList.map(v => v.id);
        let ids = [...new Set([...selectIds])];
        this.handleChange(deviceArray.filter(v => ids.indexOf(v.id) > -1));
      } else {
        this.deleteDeviceItem(item);
      }
    } else {
       const RightdeviceArray = this.state.list;
      let { rightSelectDeviceList } = this.state;
      if (checked) {
        rightSelectDeviceList.push(item);
        const selectIds = rightSelectDeviceList.map(v => v.id);
        let ids = [...new Set([...selectIds])];
        this.handleChange(RightdeviceArray.filter(v => ids.indexOf(v.id) > -1),true);
      } else {
        this.deleteRightDeviceItem(item);
      }
    }
  };
  deleteRightDeviceItem = (item) => {
    let { rightSelectDeviceList } = this.state;
    rightSelectDeviceList = rightSelectDeviceList.filter(v => v.id !== item.id);
    this.handleChange(rightSelectDeviceList,true);
  }
   // 删除单个已选设备
   deleteDeviceItem = item => {
    let { selectDeviceList } = this.state;
    selectDeviceList = selectDeviceList.filter(v => v.id !== item.id);
    this.handleChange(selectDeviceList);
  };
  // 选中列表改变事件
  handleChange = (arrList, type) => {
    if(type){
      this.setState({
        rightSelectDeviceList:arrList
      });
        this.getRowKeyArr(arrList,true);
    }
    else 
   { this.setState({
      selectDeviceList:arrList
    });
    this.props.getNewMarkerList(arrList)
      this.getRowKeyArr(arrList);
    }
  };
  //处理查询条件
  handleParams = (obj) => {
    let searchDate = Object.assign({}, obj)
    let { deviceTypes, placeType, lyGroupId, keyWord } = searchDate
    deviceTypes = _.flattenDeep(deviceTypes.split(','))
    let handlesearchDate = {
      deviceTypes: deviceTypes[0] === '-1' ? deviceTypesAll : deviceTypes,
      installationSite: placeType === null ? undefined : placeType,
      lygroupId: lyGroupId === '-1' ? undefined : lyGroupId,
      deviceName: keyWord
    }
    searchDate = _.omit(searchDate, 'deviceType')
    searchDate = _.omit(searchDate, 'lyGroupId')
    searchDate = _.omit(searchDate, 'placeType')
    searchDate = _.omit(searchDate, 'keyWord')
    return Object.assign({}, searchDate, handlesearchDate)
  }
  /** 所有已分配设备列表*/
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
          list: result.resultList,
        });
      }
    });
  };
  onSearchChange = (obj, leftOrRight, isResetPage) => {
    let searchDate = {}
    let pageReset = isResetPage ? { page: 1 } : {}
      searchDate = Object.assign({}, this.state.searchDateRight, obj, pageReset)
      this.setState({
        searchDateRight: searchDate
      }, () => {
        // 刷新已分配摄像机列表
        this.allDeviceBeBindSearch()
      })
  }
  /**前端自定义框选设备查询 */
  onLeftkeyWordSearch = (obj) => {
    let {leftSelectList}=this.state;
    let searchResult=[];
    if(!obj.keyWord){
        this.setState({
          leftSelectList:this.props.leftSList
        })
        return
    }
    for(let i=0; i<leftSelectList.length; i++){
       if(leftSelectList[i].deviceName.indexOf(obj.keyWord)>-1){
        searchResult.push(leftSelectList[i])
       }
    }
    this.setState({
      leftSelectList:searchResult
    })
  }
  render() {
    const {
      list,
      loading,
      rightSelct,
      leftSelect,
      leftSelectList,
      selectDeviceList,
      rightSelectDeviceList
    } = this.state;
    return (
      <React.Fragment>
        <Spin spinning={loading}>
          <MapSollotWrapper
            deleteDeviceItem={this.deleteDeviceItem}
            onSelect={this.changeSelectList}
            selectList={list}
            leftSelectList={arrayUnique(leftSelectList,'id')}
            clearConfirm={true}
            points={this.props.points}
            handleItemChange={this.handleItemChange}
            handleCheckAll={this.handleCheckAll}
            selectDeviceList={arrayUnique(selectDeviceList,'id')}
            onChange={this.onLeftkeyWordSearch}
            operatorType={true}//判断条件
          />
          <div className="back-deviceList" style={{position:'absolute',top:'0px',background:'#fff',
          right:'0px',width:'380px',height:'100%'}}></div>
          <DeviceList
            className="right-select-eqiu"
            deleteDeviceItem={null}
            deviceList={list}
            checkable={true}
            newMark={true}
            showInput={true}
            addList={this.props.markerList}
            onChange={(value) => this.onSearchChange(value, 'right', true)}
            RightDeviceBox={true}
            onCheckAllChange={this.handleCheckAll}
            onCheckItemChange={this.handleItemChange}
            selectDeviceList={rightSelectDeviceList}
            handleDeviNameInput={this.handleDeviNameInput}
            title={`${'已分配设备'}(${list.length}个)`}
          />
          {/* leftSelectList.length > 0 && */ (
            <Group
              leftRowKeys={rightSelct}
              rightRowKeys={leftSelect}
              className="another-group"
              assignDevice={this.submit.bind(this)}
            />
          )}
         {/*  <div className="opt-center-group">
            <Button onClick={this.props.changeModel}>取消</Button>
            <Button type="primary" onClick={this.submit.bind(this)}>
              保存
            </Button>
          </div> */}
        </Spin>
      </React.Fragment>
    );
  }
}
