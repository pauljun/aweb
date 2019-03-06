import React from 'react';
import ReactDOM from 'react-dom';
import { stopPropagation } from '../../../../utils';

export default class PopupSelectGroup extends React.Component {
  constructor(props) {
    super(props);
    this.ele = document.createElement('div');
    if (props.className) {
      this.ele.className = props.className;
    }
    this.ele.style.position = 'absolute';
    this.ele.style.zIndex = 12;
    document.body.appendChild(this.ele);
    document.body.addEventListener('click', this.hidePopup, false);
    //this.ele.addEventListener('click', this.clickChild, false);
  }
  hidePopup = event => {

    if (event.path.indexOf(this.ele) === -1) {
      this.props.onHide();
    }
  };
  componentWillReceiveProps(nextProps) {
    const [left, top] = nextProps.position;
    this.ele.style.left = `${left}px`;
    this.ele.style.top = `${top}px`;
  }
  componentWillUnmount() {
    document.body.removeEventListener('click', this.hidePopup, false);
    this.ele.removeEventListener('click', this.clickChild, false);
    document.body.removeChild(this.ele);
    this.ele = null;
  }
  clickChild = e => {
    stopPropagation(e.nativeEvent);
  };
  render() {
    const { visible } = this.props;
    return ReactDOM.createPortal(
      React.cloneElement(this.props.children, {
        onClick: this.clickChild,
        style: { display: visible ? 'block' : 'none' }
      }),
      this.ele
    );
  }
}
