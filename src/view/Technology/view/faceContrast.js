import React from 'react';
import FaceResult from '../../BusinessComponent/Tracking/faceResult';


class FaceContrast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="face-contrast-test">
        <FaceResult />
      </div>
    )
  }
}

export default FaceContrast;