import React from 'react';
import { createTextImage } from '../../utils/WaterMark';
import Stores from '../../store/GlobalStore';

class DomMarkRepeat extends React.Component {
  componentWillMount() {
    this.setImagePath();
  }
  state = { markerPath: null };
  setImagePath() {
    const { options } = this.props;
    const { realName } = Stores.UserStore.userInfo;
    let content = [];
    content.push(realName);
    // OtherService.queryTimeTemp().then(res => {
    //   content.push(moment(res.result * 1).format('YYYYMMDDhhmmss'));
    //   createTextImage({ content, fontSize: 12, ...options }).then(canvas => {
    //     this.setState({ markerPath: canvas.toDataURL() });
    //   });
    // });
    createTextImage({ content, fontSize: 16, ...options, offset: {x: 100, y: 100} }).then(canvas => {
      this.setState({ markerPath: canvas.toDataURL() });
    });
  }
  render() {
    let { className = '' } = this.props;
    let { markerPath } = this.state;
    return (
      <div
        className={className}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          background: `url(${markerPath})`
        }}
      />
    );
  }
}

export default DomMarkRepeat;
