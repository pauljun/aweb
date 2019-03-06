import React from 'react';
import MapComponent from 'src/components/Map/MapComponent';
import CommunityPolygon from 'src/components/Map/MapComponent/component/CommunityPolygon';
import MapResetTools from 'src/components/Map/MapComponent/component/MapResetTools';
import AllotDevice from './component/AllotDevice';
import IconFont from 'src/components/IconFont';
import PropTypes from 'prop-types';
import DeviceList from '../DeviceList';
import './index.scss';

export default class CommunityBoundsMap extends React.Component {
  static propTypes = {
    points: PropTypes.arrayOf(PropTypes.object).isRequired,
    options: PropTypes.object,
    village: PropTypes.object.isRequired,
    autoAssignedPints: PropTypes.func.isRequired,
    selectPoints: PropTypes.arrayOf(PropTypes.object).isRequired,
    unAllotPoint:PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.communityRef = React.createRef();
    this.map = null;
  }
  initMap = map => {
    this.map = map;
  };
  autoAssignedPints = () => {
    const { village, points, autoAssignedPints } = this.props;
    const polygon = this.communityRef.current.getPolygon(village.id);
    let insidePints = this.map.computedPointsInArea(points, polygon.getPath());
    autoAssignedPints && autoAssignedPints(insidePints);
  };
  jumpCommunity=() => {
    let {village} = this.props
    this.communityRef.current.jumpCommunity(village.id);
  }
  render() {
    const { points, options, selectPoints, village = {},unAllotPoint ,hideReset,filterResource} = this.props;
    return (
      <MapComponent className="CommunityBounds-map" initMap={this.initMap}>
        <AllotDevice
          points={points}
          options={options}
          selectPoints={selectPoints}
          filterResource={filterResource}
        />
        <CommunityPolygon
          ref={this.communityRef}
          villages={[village]}
          currentId={village.id}
        />
        <span className="auto-assgind-btn" onClick={this.autoAssignedPints}>
          <IconFont type="icon-Allocation_One_Main" /> 一键分配小区内所有设备
        </span>
        <MapResetTools hideReset={hideReset} click={this.jumpCommunity} />
        {selectPoints.length !== 0 && (
          <DeviceList
            deviceList={selectPoints}
            selectDeviceList={selectPoints}
            checkable={false}
            deleteDeviceItem={unAllotPoint}
            title={'设备列表'}
          />
        )}
      </MapComponent>
    );
  }
}
