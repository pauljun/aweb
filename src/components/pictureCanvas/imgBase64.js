import { addWaterMark } from 'src/utils';

export default (options, timeSamp, cb) => {
  let img = document.createElement('img')
  img.setAttribute('crossOrigin', 'anonymous')
  img.src = options.url
  img.onload = () => {    
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    let canvasFill = canvas.getContext('2d')
    canvasFill.drawImage(img, 0, 0)
  
    /**水印 */
    let waterMark = {
      text: [options.UserStore.userInfo.realName, timeSamp],
      font: '32px 黑体',
      hadowColor: 'rgba(0, 0, 0, 0.3)',
      color: 'rgba(255,255,255,0.2)',
      shadowX: 1,
      shadowY: 1,
      shadowBlur: 1,
      degree: 45,
      width: 400,
      height: 400
    }
    addWaterMark(canvas, waterMark);
    let frame = [];
    if(options.data) {
      if(options.data.faceRect) {
        frame = options.data.faceRect.split(',');
      }
      if(options.data.bodyRect) {
        frame = options.data.bodyRect.split(',');
      }
      const vehicleRect = options.data.vehicleRect
      if(vehicleRect) {
        const { leftTopX, leftTopY, width, height} = vehicleRect;
        frame = [leftTopX, leftTopY, width, height];
      }
    }
    if (frame && frame.length > 0) {
      let x, y, width, height;
      switch(options.type){
        case 'body':
          x = frame[0] - frame[2] * 0.2
          y = frame[1] - frame[3] * 0.2
          width = frame[2] * 1.4
          height = frame[3] * 1.4
        break;
        case 'vehicle':
          x = frame[0] 
          y = frame[1]
          width = frame[2]
          height = frame[3]
        break;
        default: // face
          x = frame[0] - frame[2] * 0.8
          y = frame[1] - frame[3] * 1.5
          width = frame[2] * 2.6
          height = frame[3] * 3.2
        break;
      }
      canvasFill.strokeStyle = frame.color || 'red'
      canvasFill.lineWidth = frame.width || 4
      canvasFill.save();
      canvasFill.strokeRect(x,y,width,height);
      canvasFill.restore();
    }
    let url = canvas.toDataURL('image/jpeg', .8)
    cb(url)
  }
}