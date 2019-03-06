/* eslint-disable radix */
import React from 'react';
import 'src/libs/tracking/tracking.js';
import 'src/libs/tracking/face.js';
import UploadComponent from '../../../../components/Upload';
import CaptureViewPlus from '../../../Baselib/components/ImageView/captureViewPlus';


import './index.scss';

class FaceTracking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
      imgURLBase64: '',
      type: 0
    };
    this.imgRef = React.createRef();
    this.photoRef = React.createRef();
  }

  face = () => {
    let { imgUrl } = this.state;
    if (!imgUrl) {
      return;
    }
    let tracking = window.tracking;
    let img = this.imgRef.current;
    let tracker = new tracking.ObjectTracker('face');
    tracking.track(img, tracker);
    tracker.on('track', event => {
      event.data.forEach(rect => {
        this.plotRectangle(rect.x, rect.y, rect.width, rect.height);
      });
    });
  };

  plotRectangle = (x, y, w, h) => {
    var friends = ['Thomas Middleditch', 'Martin Starr', 'Zach Woods'];
    var rect = document.createElement('div');
    var arrow = document.createElement('div');
    var input = document.createElement('input');
    let img = this.imgRef.current;
    input.value = friends.pop();
    rect.onclick = function name() {
      input.select();
    };
    // arrow.classList.add('arrow');
    rect.classList.add('rect');
    // rect.appendChild(input);
    // rect.appendChild(arrow);
    rect.addEventListener('click', e => {
      this.cliceImage(e);
    });
    this.photoRef.current.appendChild(rect);
    rect.style.width = w*2 + 'px';
    rect.style.height = h*2.2 + 'px';
    rect.style.left = img.offsetLeft + x -w*.5 + 'px';
    rect.style.top = img.offsetTop + y - h*.7 + 'px';
  };

  cliceImage = e => {
    let box = e.target;
    let img = this.imgRef.current;
    let w = parseInt(box.style.width),
      h = parseInt(box.style.height),
      l = parseInt(box.style.left),
      t = parseInt(box.style.top),
      iw = parseInt(img.width),
      ih = parseInt(img.height);
    let canvas = document.createElement('canvas');
    canvas.width = iw;
    canvas.height = ih;
    let context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, iw, ih);
    let dataImg = context.getImageData(l, ih / 2 - 19 / 2 + t, w, h);
    context.clearRect(0, 0, iw, ih);
    let canvas2 = document.createElement('canvas');
    let context2 = canvas2.getContext('2d');
    canvas2.width = w;
    canvas2.height = h;
    context2.putImageData(dataImg, 0, 0, 0, 0, w, h);
    let imgURLBase64 = canvas2.toDataURL('image/jpeg');
    // document.getElementById('photo').appendChild(canvas2);
    this.props.setImgBase64 && this.props.setImgBase64(imgURLBase64);
    // this.setState({
    //   imgURLBase64
    // })
  };

  changeheadImg = imgUrl => {
    this.setState({ imgUrl }, () => {
      this.face();
    });
  };

  changeImgType = type => {
    this.setState({
      type
    });
  };

  captureCb = (imgURLBase64) => {
    console.log(imgURLBase64);
    this.props.setImgBase64 && this.props.setImgBase64(imgURLBase64);
  }

  render() {
    let { imgUrl, type } = this.state;
    return (
      <div className="face-tracking">
        <div className="face-tracking-header">
          <UploadComponent
            className="face-tracking-upload"
            changeheadImg={this.changeheadImg}
          />
        </div>
        <div className="face-tracking-content">
          <div className="footer-type">
            <div
              className={`type-btn ${type === 0 ? 'type-btn-active' : ''}`}
              onClick={() => this.changeImgType(0)}>
              自动识别
            </div>
            <div
              className={`type-btn ${type === 1 ? 'type-btn-active' : ''}`}
              onClick={() => this.changeImgType(1)}>
              手动框选
            </div>
          </div>
        </div>
        <div className="face-tracking-footer">
            <span className={`photo ${type === 1 ? 'photo-dis': ''}`} key={imgUrl} ref={this.photoRef}>
              <img
                crossOrigin=""
                width="800"
                height="538"
                src={imgUrl}
                alt=""
                ref={this.imgRef}
              />
            </span>
            <div className={`img-box ${type === 0 ? 'photo-dis': ''}`}>
              <CaptureViewPlus 
                isDownload={true}
                isStorage={true}
                isRotate={true}
                isScan={true}
                isScale={true}
                styles={{width:'280px'}}
                options={{
                  capture: true,
                  init:true,
                  urlSrc: imgUrl,
                  width: '800px',
                  height: '538px',
                  captureCb: this.captureCb
                }}
              />
            </div>
        </div>
      </div>
    );
  }
}

export default FaceTracking;
