import React from 'react';
import PropTypes from 'prop-types';
import addEventListener from 'add-dom-event-listener';
import { Tooltip } from 'antd';
import '../style/CustomSlider.scss';

export default class CustomSlider extends React.Component {
  static contextTypes = {
    getPlayContainer: PropTypes.func
  };
  static propTypes = {
    //是否是垂直的
    vertical: PropTypes.bool,
    onChange: PropTypes.func,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    //跟input的一样有default的percent，最大值为1
    percent: PropTypes.number,
    defaultPercent: PropTypes.number,
    //只在移上去的时候显示圆点。
    onlyShowCircleOnEnter: PropTypes.bool
  };
  start = 0;
  percent = 0;
  canMove = false;
  componentDidMount() {
    this.sliderDOM = this.refs.slider;
    this.sliderContainerDOM = this.refs['slider-container'];
    this.sliderHandle = this.refs['slider-btn'];
    this.sliderRail = this.refs['slider-rail'];
    this.videoDom = this.context.getPlayContainer();
    this.bindEvents();
    this.document = this.sliderDOM.ownerDocument;
    let { percent, defaultPercent } = this.props;
    if (percent !== undefined || defaultPercent !== undefined) {
      this.setSliderValueByPercent(percent || defaultPercent);
      this.setState({ random: Math.random() });
    }
  }
  componentWillReceiveProps(nextProps) {
    let nextPercent = nextProps.percent;
    let thisPercent = this.props.percent;
    if (thisPercent || thisPercent === 0) {
      if (nextPercent !== thisPercent) {
        this.setSliderValueByPercent(nextPercent);
      }
    }
  }
  componentWillUnmount() {
    this.removeEvents();
  }
  events = [];
  removeEvents() {
    //移除事件
    this.events.forEach(v => {
      v.remove && v.remove();
    });
  }
  bindEvents() {
    //像mousemove、mousedown、mouseup等事件，直接使用jsx绑定方式，在高德地图上的tooltip会失效。
    this.events.push(
      addEventListener(this.sliderHandle, 'mousedown', this.onMouseDown)
    );
  }
  setSliderValueByPercent(percent = 0) {
    this.percent = percent;
  }
  eventsAfterMouseDown = [];
  bindEventsAfterMouseDown() {
    this.eventsAfterMouseDown.push(
      addEventListener(this.sliderContainerDOM, 'mouseup', this.onEnd)
    );
    this.eventsAfterMouseDown.push(
      addEventListener(this.sliderContainerDOM, 'mousemove', this.onMouseMove)
    );
    this.eventsAfterMouseDown.push(
      addEventListener(this.videoDom, 'mouseup', this.onEnd)
    );
    this.eventsAfterMouseDown.push(
      addEventListener(this.videoDom, 'mousemove', this.onMouseMove)
    );
  }
  removeEventsAfterMouseDown() {
    //移除事件
    this.eventsAfterMouseDown.forEach(v => {
      v.remove && v.remove();
    });
  }
  getSliderLength() {
    const slider = this.sliderDOM;
    if (!slider) {
      return 0;
    }
    const coords = slider.getBoundingClientRect();
    return this.props.vertical ? coords.height : coords.width;
  }
  getSliderStart() {
    const slider = this.sliderDOM;
    const rect = slider.getBoundingClientRect();
    if (rect.left < slider.offsetLeft || rect.top < slider.offsetTop) {
      return this.props.vertical ? slider.offsetTop : slider.offsetLeft;
    }
    return this.props.vertical ? rect.top : rect.left;
  }
  calcValueByPos(position) {
    const pixelOffset = position - this.getSliderStart();
    return pixelOffset;
  }
  onEnd = e => {
    e.stopPropagation();
    this.canMove = false;
    this.removeEventsAfterMouseDown();
    //结束设置isMove为false
    this.onChange(this.percent, false);
    //document和time-line的mouseup都要触发
    const { onMouseUp } = this.props;
    onMouseUp && onMouseUp(e);
  };
  getMousePosition(vertical, e) {
    return vertical ? e.pageY : e.pageX;
  }
  onStart(position, isMove) {
    let value = this.calcValueByPos(position);
    const sliderLength = this.getSliderLength();

    if (value < 0) {
      value = 0;
    }
    if (value > sliderLength) {
      value = sliderLength;
    }
    let percent = value / sliderLength;
    const { defaultPercent, vertical } = this.props;
    if (vertical) {
      percent = 1 - percent;
    }
    if (defaultPercent || defaultPercent === 0) {
      this.percent = percent;
      this.setState({ random: Math.random() });
    }
    this.onChange(percent, isMove);
  }
  onChange = (percent, isMove) => {
    const { onChange } = this.props;
    const value = this.getValue(percent);
    console.log(value, percent);
    onChange && onChange(value, isMove);
  };
  onMouseDown = e => {
    e.stopPropagation();
    this.canMove = true;
    const { vertical, onMouseDown } = this.props;
    if (vertical) {
      this.start = this.sliderRail.getBoundingClientRect().top;
    } else {
      this.start = this.sliderRail.getBoundingClientRect().left;
    }
    let temp = this.percent;
    let position = this.getMousePosition(vertical, e);
    this.removeEventsAfterMouseDown();
    this.onStart(position);
    this.bindEventsAfterMouseDown();
    onMouseDown && onMouseDown(e);
  };
  onMouseUp = e => {
    e.stopPropagation();
    this.onEnd(e);
  };
  onMouseMove = e => {
    e.stopPropagation();
    if (this.canMove) {
      const { vertical } = this.props;
      let position = this.getMousePosition(vertical, e);
      this.onStart(position, true);
    }
  };
  getValue = percent => {
    const { min = 0, max = 100 } = this.props;
    const value = Math.round(
      (typeof percent === 'number' ? percent : this.percent) * (max - min)
    );
    return value;
  };
  render() {
    const { vertical, min = 0, max = 100 } = this.props;

    const circleStyle = {};
    const trackStyle = {};

    const percent = (this.getValue() * 100) / (max - min);

    if (vertical) {
      circleStyle.top = 100 - percent + '%';
      trackStyle.height = percent + '%';
    } else {
      circleStyle.left = percent + '%';
      trackStyle.width = percent + '%';
    }
    return (
      <div
        ref="slider-container"
        className={`custom-slider-container ant-slider ${
          vertical ? 'ant-slider-vertical' : ''
        }`}
        onClick={e => e.stopPropagation()}
        onDoubleClick={e => e.stopPropagation()}
        onMouseMove={e => e.stopPropagation()}
        onDrag={e => e.stopPropagation()}
        draggable={false}
      >
        <div ref="slider">
          <div className="ant-slider-rail" ref="slider-rail" />
          <div style={trackStyle} className={'ant-slider-track'} />
          <Tooltip title={this.getValue()}>
            <div
              style={circleStyle}
              ref="slider-btn"
              className={'ant-slider-handle'}
            />
          </Tooltip>
        </div>
      </div>
    );
  }
}
