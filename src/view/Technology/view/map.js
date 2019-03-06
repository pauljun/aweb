import React from 'react';
// import MapMarkerVideo from '../../BusinessComponent/MapMarkerVideo';
import CommunityMap from '../../BusinessComponent/CommunityBounds';
import { BusinessProvider } from '../../../utils/Decorator/BusinessProvider';
import '../style/map.scss';

@BusinessProvider('CommunityEntryStore','DeviceStore')
export default class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      village: {},
      points: [],
      selectPoints: []
    };
  }
  componentDidMount() {
    const { CommunityEntryStore } = this.props;
    Promise.all([
      CommunityEntryStore.searchCommunityList({ page: 1, pageSize: 10000 }),
      CommunityEntryStore.selectCommunityDeviceByUserId()
    ]).then(res => {
      res[1].forEach(v => {
        v.id = v.deviceId;
      });
      this.setState({
        village: res[0].list[0],
        points: res[1] || []
      });
    });
  }
  click(point, event) {
    const { selectPoints } = this.state;
    const index = selectPoints.findIndex(v => v.id === point.id);
    if (index > -1) {
      selectPoints.splice(index, 1);
    } else {
      selectPoints.push(point);
    }

    this.setState({ selectPoints });
  }
  assignedList = points => {
    let { selectPoints } = this.state;
    let arr = [].concat(selectPoints, points);
    selectPoints = [...new Set([...arr])];
    this.setState({ selectPoints });
  };
  unAllotPoint = point => {
    const { selectPoints } = this.state;
    const index = selectPoints.findIndex(v => v.id === point.id);
    if (index > -1) {
      selectPoints.splice(index, 1);
      this.setState({ selectPoints });
    }
  };
  render() {
    const { village, points } = this.state;
    return (
      <React.Fragment>
        <div className="Map-view">
          <CommunityMap
            filterResource={true}
            points={points}
            village={village}
            selectPoints={this.state.selectPoints}
            autoAssignedPints={this.assignedList}
            unAllotPoint={this.unAllotPoint}
            options={{ click: (...args) => this.click(...args) }}
          />
        </div>
      </React.Fragment>
    );
  }
}
