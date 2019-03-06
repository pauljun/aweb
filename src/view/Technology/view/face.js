import React from 'react';
import FaceContrast from '../../BusinessComponent/Tracking/faceContrast';
import '../style/face.scss';

class Face extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className="face-test">
          <FaceContrast setImgBase64={this.setBase64Right}/>
      </div>
    )
  }
}

export default Face;