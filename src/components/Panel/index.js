import React from 'react';
import './index.scss';
import WaterMarkView from '../WaterMarkView';

class Panel extends React.Component {
  render() {
    //mode => vertical horizontal
    const { img, className, title, mode = 'vertical', children } = this.props;
    return (
      <div className={`aicweb-c-panel ${className ? className : ''}`}>
        <div className={`aicweb-c-panel-img aicweb-c-panel-img-${mode}`}>
          {img ? <WaterMarkView src={img} /> : null}
        </div>
        <div className="aicweb-c-panel-desc">
          <div className="aicweb-c-panel-title">{title}</div>
          <div
            className={`aicweb-c-panel-content aicweb-c-panel-conten-${mode}`}
          >
            {React.Children.map(children, function(child) {
              return React.cloneElement(child, { mode });
            })}
          </div>
        </div>
      </div>
    );
  }
}

class PanelItem extends React.Component {
  render() {
    const { title, value, mode, titleWidth = 64 } = this.props;
    if (mode === 'vertical') {
      return (
        <div className="aicweb-c-panel-item aicweb-c-panel-item-vertical">
          <div
            className="aicweb-c-panel-item-title"
            style={{ width: `${titleWidth / 100}rem` }}
          >
            {title}:
          </div>
          <div className="aicweb-c-panel-item-value">{value}</div>
        </div>
      );
    } else {
      return (
        <div
          className="aicweb-c-panel-item aicweb-c-panel-item-horizontal"
          title={value}
        >
          <div className="aicweb-c-panel-item-title">{title}:</div>
          <div className="aicweb-c-panel-item-value">{value}</div>
        </div>
      );
    }
  }
}
Panel.Item = PanelItem;

export default Panel;
