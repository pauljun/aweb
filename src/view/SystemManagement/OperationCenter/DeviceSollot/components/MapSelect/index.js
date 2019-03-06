import React from 'react';
import { providerMap } from '../../../../../../components/Map/providerMap';
import ClusterMarker from '../../../../../../components/Map/MapComponent/component/ClusterMarker';
import MouseTool from '../../../../../../components/Map/MapComponent/component/MouseTool';
import DrawTools from './DrawTools';
import { inject } from 'mobx-react';
import { Modal } from 'antd';
import DeviceList from '../../../../../BusinessComponent/DeviceList'
import ReT from '../../../../../../components/Map/MapComponent/component/MapResetTools';
import { map } from '../../../../../../components/Map/MapComponent/mapContext';
import _ from 'lodash';
import './index.scss';

const confirm = Modal.confirm;

@inject('DeviceStore')
@providerMap('map-select-layout')
@map
export default class MapMarkerVideo extends React.Component {
  constructor(props) {
    super(props);
    this.clusterMarker = null;
    this.mouseTool = null;
    this.cursor = null;
    this.addList = [];
  }
  componentWillUnmount() {
    this.clusterMarker = null;
    this.mouseTool = null;
    this.cursor = null;
  }
  initClusterMarker = clusterMarker => {
    this.clusterMarker = clusterMarker;
    this.forceUpdate();
  };

  initMouseTools = mouseTool => {
    this.mouseTool = mouseTool;
  };

  startDrawRect() {
    const { mapMethods } = this.props;
    this.cursor = mapMethods.getDefaultCursor();
    mapMethods.setDefaultCursor('crosshair');
    this.mouseTool.rectangle();
  }
  startDrawCircle() {
    const { mapMethods } = this.props;
    this.cursor = mapMethods.getDefaultCursor();
    mapMethods.setDefaultCursor('crosshair');
    this.mouseTool.circle();
  }
  startDrawPolygon() {
    const { mapMethods } = this.props;
    this.cursor = mapMethods.getDefaultCursor();
    mapMethods.setDefaultCursor('crosshair');
    this.mouseTool.polygon();
  }
  drawEnd = (path, isCircle) => {
    const { mapMethods } = this.props;
    const { selectList = [] } = this.props;
    const allPoints = this.clusterMarker.getAllPoints();
    this.mouseTool.close();
    mapMethods.setDefaultCursor(this.cursor);
    let points = [];
    if (isCircle) {
      points = mapMethods.computedPointsInCircle(
        allPoints,
        path.center,
        path.radius
      );
    } else {
      points = mapMethods.computedPointsInArea(allPoints, path);
    }
    const list = [...new Set([...points, ...selectList])];
    this.addList = this.addList.concat(_.difference(points, selectList));
    this.props.onSelect && this.props.onSelect(list,this.addList );
  };

  clearDraw = type => {
    
    if (this.props.clearConfirm) {
      confirm({
        title:'是否确定清空所有设备?',
        onOk: () => {
          this.mouseTool.close(true);
          /**清除框选 */
          if (type === true) {
            const drawlist = _.difference(this.props.selectList, this.addList);
            this.props.onSelect && this.props.onSelect([]);
            this.addList=[]
          } else {
            //清空列表
            this.props.onSelect && this.props.onSelect([]);
            this.addList=[]
          }
        }
      });
    } else {
      this.mouseTool.close(true);
      this.props.onSelect && this.props.onSelect([]);
      this.addList=[]
    }
  };
  /**清除框选 */
  clearDrawList = () => {
    this.clearDraw(true);
  };
  render() {
    const {
      DeviceStore,
      selectList = [],
      deleteDeviceItem,
      points,
      isShowList,
      hideOther = false,
      title = '已选摄像机',
      iconType,
      clearConfirm,
      leftSelectList
    } = this.props;
    return (
      <React.Fragment>
        <ClusterMarker
          points={points ? points : DeviceStore.deviceArray}
          init={this.initClusterMarker}
        />
        {!hideOther && (
          <DrawTools
            startDrawRect={this.startDrawRect.bind(this)}
            startDrawCircle={this.startDrawCircle.bind(this)}
            startDrawPolygon={this.startDrawPolygon.bind(this)}
            clearDraw={this.clearDrawList}
          />
        )}
        {!hideOther && (
          <MouseTool init={this.initMouseTools} drawEnd={this.drawEnd} />
        )}
        {/* (leftSelectList.length > 0 || isShowList) && */ (
          <DeviceList
            deleteDeviceItem={null/* deleteDeviceItem */}
            //clearSelect={this.clearDraw}
            deviceList={leftSelectList}
            checkable={true}
            newMark={clearConfirm}
            addList={[]}
            showInput={true}
            onChange={(value) => this.props.onChange(value)}
            className="equip-assign"
            title={`${'已框选设备'}(${leftSelectList.length}个)`}
            iconType={iconType}
            onCheckAllChange={this.props.handleCheckAll}
            selectDeviceList={this.props.selectDeviceList}
            onCheckItemChange={this.props.handleItemChange}
          />
        )}
        <ReT />
      </React.Fragment>
    );
  }
}
