import React from 'react'
import './captureViewMinus.scss'
import { message, Button, Icon } from 'antd'
import { toJS } from 'mobx'
import moment from 'moment'
import { observer, inject } from 'mobx-react'
import util from 'src/utils'

function getElementOffset(el) {
  const rect = el.getBoundingClientRect()
  const docEl = document.documentElement
  const rectTop = rect.top + window.pageYOffset - docEl.clientTop
  const rectLeft = rect.left + window.pageXOffset - docEl.clientLeft
  return {
    top: rectTop,
    left: rectLeft
  }
}

function getClientPos(e) {
  let pageX
  let pageY

  if (e.touches) {
    pageX = e.touches[0].pageX
    pageY = e.touches[0].pageY
  } else {
    pageX = e.pageX
    pageY = e.pageY
  }

  return {
    x: pageX,
    y: pageY
  }
}

@inject('storageModel', 'PassRecordModel', 'userModel')
@observer
class CaptureViewMinus extends React.Component {
  state = {
    viewHeight: 500,
    viewWidth: 600,
    // viewWidth: 500,
    boxLeft: 0,
    boxTop: 0,
    boxWidth: 0,
    boxHeight: 0,
    nowBoxLeft: 0,
    nowBoxTop: 0,
    nowBoxWidth: 0,
    nowBoxHeight: 0,
    firstClientPos: { x: 0, y: 0 },
    resizeType: '',
    ord: '',
    boxShow: false,
    top: 0,
    left: 0,
    nowTop: 0,
    nowLeft: 0,
    rotate: 0,
    scale: 1,
    catureState: false, //是否为框选截图状态
    initTop: 0,
    initLeft: 0,
    capture: false,
    rotateButton: true,
    imgUrl: '' || this.props.options.urlSrc,
    scan: 1,
    coverSpinShow: false,
    fullScreen: false
  }

  componentWillUnmount = () => {
    util.fullScreenListener(false, this.fullscreenchange);
    this.setState = (state, callback) => {
      return
    }
  }

  componentDidMount() {
    util.fullScreenListener(true, this.fullscreenchange);
    document.addEventListener('mousemove', this.onMouseTouchMove)
    document.addEventListener('mouseup', this.onMouseTouchEnd)
    this.getImgurl(this.props.options)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options.urlSrc !== this.state.imgUrl ||
      nextProps.options.width !== this.state.viewWidth
    ) {
      // 详情页面点击更换图片的时候,更换图片
      this.setState({ 
        imgUrl: nextProps.options.urlSrc, 
        viewHeight: nextProps.options.height,
        viewWidth: nextProps.options.width,
      })
      this.getImgurl(nextProps.options)
      this.handleDoubleClick()
    }
  }

  getImgurl = options => {
    this.props.userModel.getSystemTime().then(timeSamp => {
      let { height, width, urlSrc, capture, rotate, type } = options
      if (width && typeof width === 'string') {
        width = width.replace('px', '') * 1
      }
      if (height && typeof height === 'string') {
        height = height.replace('px', '') * 1
      }
      let viewWidth = width || 600,
        viewHeight = height || 500,
        im = document.createElement('img')
      type = type || 'face'
      im.setAttribute('crossOrigin', 'anonymous')
      im.src = urlSrc
      im.onload = () => {
        let scan = viewWidth / im.width * (im.height / viewHeight)
        this.setState({
          viewWidth,
          viewHeight,
          scan
        })
        if (scan >= 1) {
          this.setState({
            top: 0,
            left: (width - im.width * viewHeight / im.height) / 2,
            nowTop: 0,
            nowLeft: (width - im.width * viewHeight / im.height) / 2,
            initTop: 0,
            initLeft: (width - im.width * viewHeight / im.height) / 2
          })
        } else if (scan < 1) {
          this.setState({
            top: (height - im.height * viewWidth / im.width) / 2,
            left: 0,
            nowTop: (height - im.height * viewWidth / im.width) / 2,
            nowLeft: 0,
            initTop: (height - im.height * viewWidth / im.width) / 2,
            initLeft: 0
          })
        }
        if (capture) {
          this.setState({
            capture: true
          })
        }
        if (rotate === false) {
          this.setState({
            rotateButton: false
          })
        }

        let canvas = (document.im = document.createElement('canvas'));
        canvas.width = im.width;
        canvas.height = im.height;
        let canvas1Fill = canvas.getContext('2d');
        canvas1Fill.drawImage(im, 0, 0);
        let waterMark = {
          // text: [this.props.userModel.userInfo.realName, this.props.userModel.userInfo.phoneNum.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")],
          text: [this.props.userModel.userInfo.realName, moment(parseInt(timeSamp,10)).format('YYYYMMDDTHHmmss')],
          font: '32px 黑体',
          color: 'rgba(255,255,255,0.2)',
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowX: 1,
          shadowY: 1,
          shadowBlur: 1,
          degree: 45,
          width: im.width / 5,
          height: im.height / 4
        };
        util.addWaterMark(canvas, waterMark);
        let frame = this.props.options.frame
        if (frame && frame.length > 0) {
          
          for (let i = 0; i < frame.length; i++) {
            const item = frame[i];
            let p1 = item.points[0] - item.points[2] * 0.8
            let p2 = item.points[1] - item.points[3] * 1.5
            let p3 = item.points[2] * 2.6
            let p4 = item.points[3] * 3.2
            if (type === 'body') {
              p1 = item.points[0] - item.points[2] * 0.2
              p2 = item.points[1] - item.points[3] * 0.2
              p3 = item.points[2] * 1.4
              p4 = item.points[3] * 1.4
            }

            canvas1Fill.strokeStyle = item.color || 'red'
            canvas1Fill.lineWidth = item.width || 4
            canvas1Fill.save();
            canvas1Fill.moveTo(p1, p2);
            canvas1Fill.lineTo(p1 + p3, p2);
            canvas1Fill.lineTo(p1 + p3, p2 + p4);
            canvas1Fill.lineTo(p1, p2 + p4);
            canvas1Fill.lineTo(p1, p2 - (frame.width / 2 || 2));
            canvas1Fill.restore();
          }
          canvas1Fill.stroke()
        } 

        let url = canvas.toDataURL('image/jpeg', 0.8);
        this.setState({
          coverSpinShow: false,
          imgUrl: url
        });
      }
    })
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseTouchMove)
    document.removeEventListener('mouseup', this.onMouseTouchEnd)
  }

  onViewMouseTouchDown = e => {
    if (e.target !== this.refs.imgmask) {
      return
    }
    e.preventDefault()
    this.mouseDownStatw = true
    const clientPos = getClientPos(e)
    this.setState({
      firstClientPos: clientPos,
      resizeType: ''
    })
  }

  onCropMouseTouchDown = e => {
    e.preventDefault()
    this.mouseDownStatw = true
    const clientPos = getClientPos(e)
    this.setState({
      firstClientPos: clientPos,
      resizeType: e.target === this.refs.box ? 'drag' : 'resize',
      ord: e.target.dataset.ord || 'con'
    })
  }

  onMouseTouchMove = e => {
    if (!this.mouseDownStatw) {
      return
    }
    let {
      firstClientPos,
      resizeType,
      boxWidth,
      boxHeight,
      boxLeft,
      boxTop,
      nowBoxLeft,
      nowBoxTop,
      nowBoxWidth,
      nowBoxHeight,
      ord,
      catureState,
      boxShow,
      nowTop,
      nowLeft,
      rotate,
      left,
      top,
      scale
    } = this.state
    let { width, height } = this.props.options
    const imageOffset = getElementOffset(this.refs.imgmask)
    const clientPos = getClientPos(e)
    let cx = clientPos.x,
      cy = clientPos.y,
      fx = firstClientPos.x,
      fy = firstClientPos.y,
      xPos = cx - fx, //x位移
      yPos = cy - fy //y位移
    if (catureState && boxShow) {
      if (!resizeType) {
        //画框
        if (xPos >= 0) {
          boxWidth = xPos
          boxLeft = fx - imageOffset.left
        } else {
          boxWidth = 0 - xPos
          boxLeft = cx - imageOffset.left
        }
        if (yPos >= 0) {
          boxHeight = yPos
          boxTop = fy - imageOffset.top
        } else {
          boxHeight = 0 - yPos
          boxTop = cy - imageOffset.top
        }
      } else if (resizeType === 'drag') {
        //拖拽框
        boxLeft = nowBoxLeft + xPos
        boxTop = nowBoxTop + yPos
      } else if (resizeType === 'resize') {
        //改变框的大小
        const wInversed = ord === 'nw' || ord === 'w' || ord === 'sw' //左
        const eInversed = ord === 'ne' || ord === 'e' || ord === 'se' //右
        const nInversed = ord === 'nw' || ord === 'n' || ord === 'ne' //上
        const sInversed = ord === 'sw' || ord === 's' || ord === 'se' //下
        if (wInversed) {
          if (nowBoxWidth - xPos >= 0) {
            boxLeft = nowBoxLeft + xPos
            boxWidth = nowBoxWidth - xPos
          } else {
            boxLeft = nowBoxLeft + nowBoxWidth
            boxWidth = xPos - nowBoxWidth
          }
        }
        if (eInversed) {
          if (nowBoxWidth + xPos >= 0) {
            boxWidth = nowBoxWidth + xPos
          } else {
            boxWidth = 0 - (nowBoxWidth + xPos)
            boxLeft = nowBoxLeft + nowBoxWidth + xPos
          }
        }
        if (nInversed) {
          if (nowBoxHeight - yPos >= 0) {
            boxTop = nowBoxTop + yPos
            boxHeight = nowBoxHeight - yPos
          } else {
            boxTop = nowBoxTop + nowBoxHeight
            boxHeight = yPos - nowBoxHeight
          }
        }
        if (sInversed) {
          if (nowBoxHeight + yPos >= 0) {
            boxHeight = nowBoxHeight + yPos
          } else {
            boxHeight = 0 - (nowBoxHeight + yPos)
            boxTop = nowBoxTop + nowBoxHeight + yPos
          }
        }
      }
      //根据选择的角度来限制框选的区域
      rotate = rotate % 360
      let img = this.refs.img,
        imgWidth = img.width,
        imgHeight = img.height,
        imgLeft = left,
        imgTop = top
      if (rotate === 90 || rotate === 270) {
        imgLeft = left + (imgWidth - imgHeight) / 2
        imgTop = top + (imgHeight - imgWidth) / 2
        imgWidth = img.height
        imgHeight = img.width
      }
      let scanWidth = imgWidth * (1 - scale) * 0.5 //相较于为缩放前的宽度差的一半
      let scanHeight = imgHeight * (1 - scale) * 0.5 //相较于为缩放前的高度差的一半
      imgLeft = imgLeft + scanWidth
      imgTop = imgTop + scanHeight
      let ruleLeft = imgLeft >= 0 ? imgLeft : 0
      let ruleTop = imgTop >= 0 ? imgTop : 0

      boxLeft = boxLeft >= ruleLeft ? boxLeft : ruleLeft
      boxTop = boxTop >= ruleTop ? boxTop : ruleTop
      if (resizeType !== 'drag') {
        boxWidth = boxWidth >= imgWidth * scale - boxLeft + imgLeft ? imgWidth * scale - boxLeft + imgLeft : boxWidth
        boxHeight = boxHeight >= imgHeight * scale - boxTop + imgTop ? imgHeight * scale - boxTop + imgTop : boxHeight

        if (boxWidth + boxLeft >= width) {
          boxWidth = width - boxLeft
        }
        if (boxHeight + boxTop >= height) {
          boxHeight = height - boxTop
        }
      } else {
        let ruleWidth = imgLeft + imgWidth - scanWidth * 2 >= width ? width : imgLeft + imgWidth - scanWidth * 2
        let ruleHeight = imgTop + imgHeight - scanHeight * 2 >= height ? height : imgTop + imgHeight - scanHeight * 2
        boxLeft = boxLeft + boxWidth >= ruleWidth ? ruleWidth - boxWidth : boxLeft
        boxTop = boxTop + boxHeight >= ruleHeight ? ruleHeight - boxHeight : boxTop
      }
      /*渲染截图框*/
      this.setState({
        boxLeft,
        boxTop,
        boxWidth,
        boxHeight
      })
    } else {
      this.setState({
        left: nowLeft + xPos,
        top: nowTop + yPos
      })
    }
  }

  onMouseTouchEnd = e => {
    if (!this.mouseDownStatw) {
      return
    }
    this.mouseDownStatw = false
    let { boxLeft, boxTop, boxWidth, boxHeight, left, top } = this.state
    this.setState({
      nowBoxLeft: boxLeft,
      nowBoxTop: boxTop,
      nowBoxWidth: boxWidth,
      nowBoxHeight: boxHeight,
      nowLeft: left,
      nowTop: top
    })
  }

  // 滚轮事件
  handleWheel = e => {
    e.preventDefault()
    this.setScale(e.deltaY / 1000)
  }

  // 下载
  downloadPic = () => {
    let domImg = this.props.options.urlSrc
    const { itemDetail } = this.props
    const time = moment(parseInt(itemDetail.captureTime, 10)).format('YYYY.MM.DD HH:mm:ss')
    const downloadName = itemDetail.cameraName + time
    util.downloadLocalImage(domImg, downloadName)
  }

  // 按钮改变缩放级别
  setScale = v => {
    let scale = this.state.scale
    scale -= v
    message.destroy()
    if (scale < 0.4) {
      message.warn('已缩放到最小级别')
      return
    }
    if (scale > 3.1) {
      message.warn('已缩放到最大级别')
      return
    }
    this.setState({
      scale
    })
  }

  // 旋转
  clockwise = deg => {
    this.setState({
      rotate: this.state.rotate + deg
    })
  }

  // 框选切换到截图
  handleCapture = () => {
    this.setState({
      catureState: true,
      boxShow: true
    })
  }

  // 双击事件
  handleDoubleClick = e => {
    let { initTop, initLeft, catureState, boxShow } = this.state
    if (!boxShow) {
      this.setState({
        top: initTop,
        left: initLeft,
        nowTop: initTop,
        nowLeft: initLeft,
        scale: 1,
        rotate: 0
      })
    } else {
      this.setState({
        catureState: !catureState
      })
    }
  }

  handleGetCapture = () => {
    let { boxTop, boxLeft, boxWidth, boxHeight, top, left, scale, rotate } = this.state
    let canvas = document.createElement('canvas')
    let img = this.refs.img
    let image = new Image()
    image.crossOrigin = 'Anonymous'
    image.src = img.src
    image.onload = () => {
      //计算缩放后的高和和宽的差值,来确保截图的位置正确
      let scan = image.width / (img.width * scale)
      //用于绘制旋转后的图片
      rotate = rotate % 360
      let canvas1 = document.createElement('canvas')
      if (rotate === 0 || rotate === 180) {
        canvas1.width = image.width
        canvas1.height = image.height
      } else if (rotate === 90 || rotate === 270) {
        canvas1.width = image.height
        canvas1.height = image.width
      }
      let canvas1Fill = canvas1.getContext('2d')
      canvas1Fill.translate(canvas1.width / 2, canvas1.height / 2) //设置画布上的(0,0)位置，也就是旋转的中心点
      canvas1Fill.rotate(rotate * Math.PI / 180)
      canvas1Fill.save() //保存状态
      canvas1Fill.drawImage(image, -image.width / 2, -image.height / 2) //把图片绘制在旋转的中心点，
      canvas1Fill.restore() //恢复状态
      let src1 = canvas1.toDataURL('image/jpeg', 0.8)
      let im = new Image()
      im.crossOrigin = 'Anonymous'
      im.src = src1
      let canvasFill = canvas.getContext('2d')
      canvas.width = this.state.boxWidth
      canvas.height = this.state.boxHeight

      //计算旋转缩放后的截图起点位置

      let scanWidth = img.width * (1 - scale) * 0.5 //相较于为缩放前的宽度差的一半
      let scanHeight = img.height * (1 - scale) * 0.5 //相较于为缩放前的高度差的一半
      let startX = boxLeft - left - scanWidth
      let startY = boxTop - top - scanHeight
      setTimeout(() => {
        if (rotate === 0 || rotate === 180) {
          canvasFill.drawImage(im, startX * scan, startY * scan, canvas.width * scan, canvas.height * scan, 0, 0, canvas.width, canvas.height)
        } else if (rotate === 90 || rotate === 270) {
          canvasFill.drawImage(
            im,
            (startX + (img.height - img.width) / 2 * scale) * scan,
            (startY + (img.width - img.height) / 2 * scale) * scan,
            canvas.width * scan,
            canvas.height * scan,
            0,
            0,
            canvas.width,
            canvas.height
          )
        }

        let src = canvas.toDataURL('image/jpeg', 0.8)
        if (src === 'data:,') {
          message.warn('请先框选图片')
          return
        }
        this.props.options.captureCb(src)
        this.handleCancle()
      }, 50)
    }
  }

  // 关闭截图
  handleCancle = () => {
    this.setState({
      boxShow: false,
      catureState: false,
      boxLeft: 0,
      boxTop: 0,
      boxWidth: 0,
      boxHeight: 0,
      nowBoxLeft: 0,
      nowBoxTop: 0,
      nowBoxWidth: 0,
      nowBoxHeight: 0
    })
  }
  fullscreenchange = () => {
    if (!util.isFullscreen()) {
      this.setFullScreen(false);
    }
  }
  // 全屏事件
  setFullScreen = fullScreen => {
    fullScreen = fullScreen === undefined ? !this.state.fullScreen : fullScreen;
    this.setState({
      fullScreen
    });
    if (fullScreen) {
      util.fullScreen(this.fullContainer);
    } else {
      util.exitFullscreen();
    }
  };

  // 本地收藏图片
  storageImg = () => {
    let { itemDetail, storageModel, PassRecordModel, options } = this.props
    const localImgObg = {
      cameraId: itemDetail.cameraId,
      cameraName: itemDetail.cameraName,
      captureTime: Number(itemDetail.captureTime),
      // imgUrl: itemDetail.facePath ? itemDetail.facePath : itemDetail.bodyPath || itemDetail.picUrl.bigPicUrl,
      imgUrl: itemDetail.scenePath || itemDetail.picUrl.bigPicUrl,
      type: 'image',
    }
    PassRecordModel.add(localImgObg).then(() => {
      message.success('添加成功！')
    })
  }

  // 查看原图
  viewOriginPic = showOriginDetail => {
    this.props.viewOriginPic && this.props.viewOriginPic(showOriginDetail)
  }

  toVideo = () => {
    this.props.toVideoView('SCENE-VIDEO')
  }

  render() {
    let {
      coverSpinShow,
      boxWidth,
      boxHeight,
      boxLeft,
      boxTop,
      boxShow,
      top,
      left,
      translatex,
      translatey,
      scale,
      rotate,
      scan,
      catureState,
      viewWidth,
      viewHeight,
      capture,
      rotateButton,
      imgUrl
    } = this.state
    let { isToVideo, classname, isScan, isScale, isRotate, isDownload, isStorage, isOriginPic, showOriginDetail, styles, isHaveFullBtn } = this.props
    let imgWidthStyle = 'auto'
    let imgHeightStyle = 'auto'
    if (scan >= 1) {
      imgHeightStyle = '100%'
    } else {
      imgWidthStyle = '100%'
    }
    return (
      <div className="capture-view hasFull" style={{ width: viewWidth, }}>
        {rotateButton && (
          <ul className={classname ? 'opera-view ' + classname : 'opera-view'} style={styles}>
            {!isScan && (
              <li className="text-right">
                <span onClick={this.handleDoubleClick} className="pointer">
                  <div className="icon">
                    <Icon style={{ fontSize: '18px' }} type="yuanshidaxiao" />
                  </div>
                  <div className="text">原始大小</div>
                </span>
              </li>
            )}
            {
              !isToVideo && (
                <li className='text-right'>
                  <span onClick={this.toVideo.bind(this)} className="pointer">
                    <div className="icon">
                      <Icon type="video-camera" />
                    </div>
                    <div className="text">视频播放</div>
                  </span>
                </li>
              )
            }
            {!isScale && (
              <li className="text-center">
                <div className="icon" onClick={this.setScale.bind(this, -0.1)}>
                  <Icon type="plus" />
                </div>
                <div className="text">{(scale * 100 + '').split('.')[0] + '%'}</div>
                <div className="icon" onClick={this.setScale.bind(this, 0.1)}>
                  <Icon type="minus" />
                </div>
                {!isScale && <div className="text lh16">图片比例</div>}
              </li>
            )}
            {!isRotate && (
              <li className="text-center">
                <div onClick={this.clockwise.bind(this, 270)} className="icon">
                  <Icon type="fanzhuandu1" />
                </div>
                <div className="text">旋转</div>
                <div onClick={this.clockwise.bind(this, 90)} className="icon">
                  <Icon type="fanzhuandu" />
                </div>
              </li>
            )}
            {!isDownload && (
              <li className="text-right">
                <span className="pointer" onClick={this.downloadPic}>
                  <div className="icon">
                    <Icon type="xiazai" />
                  </div>
                  <div className="text">下载图片</div>
                </span>
              </li>
            )}
            {!isStorage && (
              <li className="text-right" onClick={this.storageImg}>
                <span className="pointer">
                  <div className="icon">
                    <Icon style={{ fontSize: '18px' }} type="shoucangtupian" />
                  </div>
                  <div className="text">收藏图片</div>
                </span>
              </li>
            )}

            {capture && (
              <li className="text-right" onClick={boxShow ? this.handleCancle : this.handleCapture}>
                <span className="pointer">
                  <div className="icon">{boxShow ? <Icon type="close" title="取消框选" /> : <Icon type="kuangxuan_" title="开始框选" />}</div>
                  <div className="text">{boxShow ? '取消框选' : '开始框选'}</div>
                </span>
              </li>
            )}
            {capture && (
              <li className="text-right" onClick={this.handleGetCapture}>
                <span className="pointer">
                  <div className="icon">
                    <Icon type="shoucangtupian" title="搜索截图" />
                  </div>
                  <div className="text">搜索截图</div>
                </span>
              </li>
            )}
          </ul>
        )}
        {isHaveFullBtn &&
          <div className='getFullScreen' title={this.state.fullScreen ? '退出全屏' : '全屏'} onClick={() => this.setFullScreen()}>
            <div className='icon'>
              <Icon style={{ fontSize: '18px' }} type={!this.state.fullScreen ? "quanpingx" : 'zuixiaohua-copy'} />
            </div>
            {/* <div className='text'>{this.state.fullScreen ? '退出全屏' : '全屏'}</div> */}
          </div>
        }
        <div
          className="capture-view-plus"
          style={{ width: viewWidth, height: viewHeight }}
          // style={{ width: 650, height: viewHeight }}
          onMouseDown={this.onViewMouseTouchDown}
          onWheel={this.handleWheel}
          onDoubleClick={this.handleDoubleClick}>
          <div className={coverSpinShow ? 'img coverSpin' : 'img'} ref={fullContainer => (this.fullContainer = fullContainer)}>
            <Icon type="close" className={this.state.fullScreen ? 'close_btn_full close_icon' : 'close_icon'} onClick={() => this.setFullScreen(false)}/>
            <div className="imgmask" ref="imgmask" style={{ cursor: catureState ? 'crosshair' : 'move' }} />
            <img
              ref="img"
              src={imgUrl}
              style={{
                top: top,
                left: left,
                //left: 68.222,
                transform: 'scale(' + scale + ')rotate(' + rotate + 'deg)',
                width: imgWidthStyle && imgWidthStyle,
                height: imgHeightStyle && imgHeightStyle
              }}
            />
          </div>
          {boxShow && (
            <div
              className="capture-box"
              ref="box"
              style={{ width: boxWidth, height: boxHeight, left: boxLeft, top: boxTop }}
              onMouseDown={this.onCropMouseTouchDown}>
              <div className="drag-box">
                <div className="drag-bar ord-n" data-ord="n" />
                <div className="drag-bar ord-e" data-ord="e" />
                <div className="drag-bar ord-s" data-ord="s" />
                <div className="drag-bar ord-w" data-ord="w" />
                <div className="drag-handle ord-nw" data-ord="nw" />
                <div className="drag-handle ord-n" data-ord="n" />
                <div className="drag-handle ord-ne" data-ord="ne" />
                <div className="drag-handle ord-e" data-ord="e" />
                <div className="drag-handle ord-se" data-ord="se" />
                <div className="drag-handle ord-s" data-ord="s" />
                <div className="drag-handle ord-sw" data-ord="sw" />
                <div className="drag-handle ord-w" data-ord="w" />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default CaptureViewMinus
