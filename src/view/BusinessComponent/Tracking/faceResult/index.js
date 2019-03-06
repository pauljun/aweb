import React from 'react';
import resemble from 'src/libs/tracking/resemble.js';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@withRouter
@observer
class FaceResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base64Right: '',
      base64Left: '',
      imgData: {}
    }
  }

  
  componentWillMount() {
    this.getImgUrl().then(() => {
      this.resembleImg();
    })
  }

  resembleImg = () => {
    const { base64Right, base64Left } = this.state;
    var diff = resemble(base64Right).compareTo(base64Left).ignoreColors().onComplete(
      (data) => {
        console.log(data);
        this.setState({
          imgData: data
        })
      }
    );
  }

  async getImgUrl() {
    const { history } = this.props;
    let pageState = {};
    try {
			pageState = history.location.state.pageState;
      this.setState({
        base64Right: pageState.base64Right,
        base64Left: pageState.base64Left,
      });
    } catch(e) {
      pageState = {};
    }
  }

  render() {
    const { base64Right, base64Left, imgData } = this.state;
    console.log(imgData.misMatchPercentage);
    return (
      <div className="face-result">
        <div className="face-result-content">
            <div className="imgBox">
              <img src={base64Right} alt=""/>
            </div>
            <div className="imgBox">
            <img src={base64Left} alt=""/>
            </div>
            <p>{imgData.misMatchPercentage === '0.00' ? '100.00' : imgData.misMatchPercentage}</p>
        </div>
      </div>
    )
  }
}

export default FaceResult;