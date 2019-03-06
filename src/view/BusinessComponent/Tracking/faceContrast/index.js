import React from 'react';
import FaceTracking from '../faceTracking';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import { withRouter } from 'react-router-dom';
import './index.scss';

@withRouter
@BusinessProvider('TabStore')
@observer
class FaceContrast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base64Right: '',
      base64Left: ''
    }
  }

  setBase64Right = (base64Right) => {
    this.setState({base64Right },() => console.log(base64Right))
  }

  setBase64Left = (base64Left) => {
    this.setState({ base64Left }, () => console.log(base64Left))
  }

  goContrast = () => {
    const { base64Right, base64Left } = this.state;
    let { TabStore, history } = this.props;
    const data = { base64Right, base64Left }, 
    moduleName = 'Technology',
    childModuleName = 'faceContrast';
    if(!base64Right && !base64Left) {
      return
    }
    TabStore.goPage({ moduleName, childModuleName, history, state: data });
  }

  render() {
    let { base64Left, base64Right } = this.state;
    return (
      <div className="face-contrast" style={{overflow: 'auto'}}>
        <div className="face-contrast-content">
          <FaceTracking setImgBase64={this.setBase64Right}/>
          <FaceTracking setImgBase64={this.setBase64Left}/>
        </div>
        <div className="face-contrast-footer">
          <Button type="primary" onClick={this.goContrast} disabled={!!base64Left === false || !!base64Right === false}>比对</Button>
        </div>
      </div>
    )
  }
}

export default FaceContrast;