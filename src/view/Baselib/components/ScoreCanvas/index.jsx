import React, { Component } from 'react';

class ScoreCanvas extends Component {
  componentDidMount(){
    this.initCanvas({
      width: this.props.lineWidth || 6,
      size: this.props.fontSize || 20,
      needText: this.props.needText === undefined ? true : this.props.needText,
      oc: 2,
      bgGradient: this.props.bgGradient === undefined ? false : this.props.bgGradient,
      obj: 'canvas',
      time: 1000,
      score: this.props.score,
      color: this.props.color || '#ff4e4e',
      bgcolor: this.props.bgcolor || '#e7e7e7'
    })
  }
  initCanvas = opt => {
    var canvas = document.getElementById(opt.obj + this.props.id),
      context = canvas.getContext('2d'),
      centerX = canvas.width / 2,
      centerY = canvas.height / 2,
      rad = Math.PI * 2 / 100,
      speed = 1;
    function blueCircle(n) {
      context.save();
      context.strokeStyle = opt.color;
      context.lineWidth = opt.width;
      context.beginPath();
      context.arc(centerX, centerY, canvas.width / 2 - opt.width / 2, -Math.PI / 2, -Math.PI / 2 + n * rad, false);
      context.stroke();
      context.closePath();
      context.restore();
    }
    function whiteCircle() {
      context.save();
      context.beginPath();
      context.strokeStyle = opt.bgcolor;
      context.lineWidth = opt.width; //设置线宽
      context.arc(centerX, centerY, canvas.width / 2 - opt.width / 2, 0, Math.PI * 2, false);
      context.stroke();
      context.closePath();
      context.restore();
      context.save();
      if (opt.bgGradient) {
        context.save();
        context.beginPath();
        context.arc(centerX, centerY, centerX - opt.width - opt.oc, 0, Math.PI * 2, false);
        var grd = context.createRadialGradient(centerX, centerX, 0, centerX, centerX, centerX - opt.width / 2 - opt.oc);
        grd.addColorStop(0, 'transparent');
        grd.addColorStop(0.5, 'transparent');
        grd.addColorStop(1, opt.color);
        context.fillStyle = grd;
        context.fill();
        context.closePath();
        context.restore();
        context.save();
      }
    }
    function text(n) {
      context.font = 'bold ' + opt.size + 'px arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(n.toFixed(0) + '%', canvas.width / 2, canvas.width / 2);
      context.fillStyle = opt.color;
    }
    var time = setInterval(function () {
      if (speed > opt.score) {
        clearInterval(time);
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height);
        whiteCircle();
        if (opt.needText) {
          text(speed);
        }
        blueCircle(speed);
        speed++;
      }
    }, opt.time / opt.scrop)
  }

  render(){
    const { width, height } = this.props
    return(
      <canvas
        id={'canvas' + this.props.id}
        width={width || '80'}
        height={height || 80}>
      </canvas>
    )
  }
}

export default ScoreCanvas;
