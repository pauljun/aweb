import React from 'react';
import { providerMap } from '../../../components/Map/providerMap';
import ClusterMarker from '../../../components/Map/MapComponent/component/ClusterMarker';
import { inject } from 'mobx-react';

@inject('DeviceStore')
@providerMap()
export default class MapMarkerView extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { DeviceStore, points } = this.props;
    return (
      <React.Fragment>
        <ClusterMarker points={points ? points : DeviceStore.deviceArray} />
      </React.Fragment>
    );
  }
}
