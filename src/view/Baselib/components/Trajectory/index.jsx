import React from 'react';
import moment from 'moment';
import MapComponent from '../../../../components/Map/MapComponent';
import PathSimplifier from '../../../../components/Map/MapComponent/component/PathSimplifier';
import ListView from './ListView';
import './index.scss';

class view extends React.Component {
  constructor() {
    super();
    this.list = [];
    this.mapPath = null;
    this.state = {
      idx: 0
    };
  }

  changeIdx = idx => {
    this.setState({ idx });
  };
  initPath = path => {
    this.mapPath = path;
    this.mapPath.setData(
      this.list.map(item => {
        return {
          cameraId: item.cameraId,
          cameraName: item.cameraName,
          position: [item.longitude, item.latitide],
          title:item.cameraName,
          dataId: item.id,
          captureTime:item.captureTime,
          imagePath:item[`${this.props.type}Path`]
        };
      })
    );
  };
  changePointIndex = index => {
    this.setState({ idx: index });
    this.mapPath.changeIndex(index);
  };
  componentWillMount() {
    this.list = this.props.list;
    this.list = this.list.sort((a, b) => a.captureTime - b.captureTime);
  }

  render() {
    let list = this.list;
    const { idx } = this.state;
    const { type } = this.props;
    return (
      <div className="trajectory-map">
        <MapComponent initMap={this.init} className="trajectory-map-box">
          <PathSimplifier
            init={this.initPath}
            changePointIndex={this.changeIdx}
            imgType={type === 'face' ? 1 : 2 }
          />
        </MapComponent>
        <ListView
          idx={idx}
          list={list}
          changeIdx={this.changePointIndex}
          type={this.props.type}
        />
      </div>
    );
  }
}

export default view;
