import React from 'react';
import { Icon, Popover } from 'antd';
import IconFont from '../../../components/IconFont';
import libScreen from '../../../libs/Dictionary/videoScreen';
import '../style/screen.scss';

export default class SreenChiose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  showChangeScreent = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };
  selectScreen = item => {
    this.setState({ visible: false });
    this.props.selectSrceen(item);
  };
  createHoverContent = () => {
    const { currentScreen } = this.props;
    return (
      <ul className="select-screen">
        {libScreen.map(item => (
          <li
            key={item.num}
            onClick={() => this.selectScreen(item)}
            className={`screen-item ${
              currentScreen.num === item.num ? 'active' : ''
            }`}
          >
            <IconFont type={item.icon} />
            {item.label}
          </li>
        ))}
      </ul>
    );
  };
  render() {
    const { visible } = this.state;
    const { currentScreen, getPopupContainer, className } = this.props;
    return (
      <Popover
        visible={visible}
        placement="bottom"
        content={this.createHoverContent()}
        getPopupContainer={() => getPopupContainer()}
      >
        <div
          className={`tools-split-screen ${className ? className : ''} ${
            visible ? 'active' : ''
          }`}
          onClick={() => this.showChangeScreent()}
        >
          <IconFont type={currentScreen.icon} theme="outlined" />
          {currentScreen.label}
          <IconFont
            style={{ float: 'right', paddingTop: 10 }}
            type={
              visible ? 'icon-Arrow_Small_Up_Main' : 'icon-Arrow_Small_Down_Mai'
            }
          />
        </div>
      </Popover>
    );
  }
}
