import React from 'react';
import PropTypes from 'prop-types';
import { errorBoundary } from '../../../../utils/Decorator';
import { map } from '../mapContext';

const drawOptions = {
  fillOpacity: 0.1,
  fillColor: '#FF5F57',
  strokeColor: '#FF4343',
  strokeStyle: 'solid'
};

@errorBoundary
@map
export default class MouseTool extends React.Component {
  constructor(props) {
    super(props);
    this.mouseTool = null;
  }
  componentDidMount() {
    this.initMouseTool();
    this.props.init && this.props.init(this);
  }
  componentWillUnmount() {
    AMap.event.removeListener(this.mouseTool, 'draw', this.drawEnd);
    this.mouseTool = null;
  }
  initMouseTool(callback) {
    const { map } = this.props;
    map.plugin(['AMap.MouseTool'], () => {
      this.mouseTool = new AMap.MouseTool(map);
      AMap.event.addListener(this.mouseTool, 'draw', this.drawEnd);
      callback && callback();
    });
  }
  drawEnd = e => {
    if (this.props.drawEnd) {
      if (e.obj.CLASS_NAME === 'AMap.Circle') {
        this.props.drawEnd(
          {
            center: e.obj.getCenter(),
            radius: e.obj.getRadius()
          },
          true
        );
      } else {
        this.props.drawEnd(e.obj.getPath());
      }
    }
  };
  rectangle(options) {
    this.mouseTool.rectangle({ ...drawOptions, options });
  }
  circle(options) {
    this.mouseTool.circle({ ...drawOptions, options });
  }
  polygon(options) {
    this.mouseTool.polygon({ ...drawOptions, ...options });
  }
  close(flag) {
    this.mouseTool.close(!!flag);
  }
  render() {
    return null;
  }
}
