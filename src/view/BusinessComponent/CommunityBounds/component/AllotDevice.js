import React from 'react';
import ViilageCluster from 'src/components/Map/MapComponent/component/ViilageCluster';
import { errorBoundary } from 'src/utils/Decorator';
import { map } from 'src/components/Map/MapComponent/mapContext';

@errorBoundary
@map
export default class AllotDevice extends React.Component {
  render() {
    const { points, selectPoints, options, filterResource } = this.props;
    return (
      <ViilageCluster
        filterResource={filterResource}
        points={points}
        selectPoints={selectPoints}
        options={options}
      />
    );
  }
}
