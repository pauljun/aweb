import React from 'react';
import PropTypes from 'prop-types';
import { errorBoundary } from '../../../../utils/Decorator';
import { map } from '../mapContext';

@errorBoundary
@map
export default class Walking extends React.Component {
  constructor(props) {
    super(props);
    this.walking = null;
    this.driving = null;
  }
  componentDidMount() {
    this.initWalking();
    this.initDriving();
    this.props.init && this.props.init(this);
  }
  componentWillUnmount() {
    this.walking.clear();
		this.walking = null;
		this.driving = null;
  }

  initWalking() {
    const { map } = this.props;
    AMap.plugin(['AMap.Walking'], () => {
      this.walking = new AMap.Walking({ map, hideMarkers: true });
    });
  }
  initDriving() {
    const { map } = this.props;
    AMap.plugin(['AMap.Driving'], () => {
      this.driving = new AMap.Driving({ map, hideMarkers: true });
    });
  }

  searchWalking(...args) {
    this.walking.search(...args);
  }

  searchDriving(...args) {
    this.driving.search(...args);
  }

  async computedPointsPaths(points) {
    let walks = points
      .map((item, index) => {
        if (index !== points.length - 1) {
          return [item, points[index + 1]];
        } else {
          return null;
        }
      })
      .filter(v => !!v);
    let walkPointsFnArr = walks.map(arr => {
      return this.computedStartEndPaths(arr[0], arr[1]);
    });
    let paths = await Promise.all(walkPointsFnArr.filter(v => !!v));
    paths = paths.filter(v => !!v);
    if (paths.length > 1) {
      return paths.reduce(function(previousValue, currentValue) {
        return previousValue.concat(currentValue);
      });
    } else {
      return paths;
    }
  }

  searchCallback = (status, result, errorCallback) => {
    let path = [];
    if (status === 'complete') {
      result.routes.map(item => {
        item.steps.map(item2 => {
          path = path.concat(item2.path);
        });
      });
      return path;
    } else {
      errorCallback ? errorCallback(status, result) : null;
      return false;
    }
  };

  computedStartEndPaths(start, end) {
    return new Promise((resolve, reject) => {
      this.searchWalking(start, end, (status, result) => {
        let path = this.searchCallback(status, result, () => {
          this.searchDriving(start, end, (status, result) => {
            let path2 = this.searchCallback(status, result);
            resolve(path2 ? path2 : null);
          });
        });
        if (path) {
          resolve(path);
        }
      });
    });
  }
  render() {
    return null;
  }
}
