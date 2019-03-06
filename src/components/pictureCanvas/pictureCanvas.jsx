import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import FullScreenLayout from '../FullScreenLayout';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { downloadLocalImage, uuid } from '../../utils';
import { exitFullscreen } from '../../utils/FullScreen';
import AuthComponent from '../../view/BusinessComponent/AuthComponent/';
import MoveContent from 'src/components/MoveContent';
import IconFont from '../../components/IconFont';
import { OTHER } from 'src/service/RequestUrl';
import imgBase64 from './imgBase64';
import PropTypes from 'prop-types'

@withRouter
@BusinessProvider('UserStore', 'MediaLibStore', 'TabStore')
@observer
class view extends React.Component {
  static contextTypes = {
    searchData: PropTypes.object
  }  
  constructor(props) {
    super(props);
    this.rndRef = React.createRef();
    this.containerRef = React.createRef();
    this.randomClass = 'canvas-img-container-' + uuid();
    this.position = {
      x: 0,
      y: 0
    };
  }
  state = {
    top: 0,
    left: 0,
    scale: 1,
    rotate: 0,
    fullScreen: false,
    imgUrl: this.props.url,
    isFull: false
  };

  componentDidMount() {
    this.rndRef.current.updatePosition({ x: 0, y: 0 });
  }
  componentWillUnmount() {
    this.rndRef = null;
    this.containerRef = null;
    this.randomClass = null;
    this.position = null;
  }
  // 滚轮事件
  handleWheel = e => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      this.setScale(e.deltaY / 1000);
    }
  };

  /**图片转base64 打水印*/
  async getImgurl() {
    let { UserStore } = this.props;
    let timeSamp = await UserStore.getSystemTime();
    imgBase64(
      this.props,
      moment(parseInt(timeSamp, 10)).format('YYYYMMDDTHHmmss'),
      imgUrl => {
        this.setState({ imgUrl });
      }
    );
  }

  /**缩放 */
  setScale(value) {
    let { scale } = this.state;
    if (value === 1) {
      scale = 1;
      this.rndRef.current.updatePosition({ x: 0, y: 0 });
    } else {
      scale -= value;
      if (scale <= 1) {
        scale = 1;
      }
      if (scale > 3) {
        scale = 3;
      }
    }
    this.setState({ scale }, () => this.onDragStop(null, this.position));
  }
  /**旋转 */
  setRotate(type) {
    if (type == 0) {
      this.setState({
        rotate: 0
      });
      this.rndRef.current.updatePosition({ x: 0, y: 0 });
    } else {
      this.setState({
        rotate: this.state.rotate + 90 * type
      });
    }
  }
  componentWillMount() {
    this.getImgurl();
  }

  // 下载
  downloadPic() {
    const { url, name, data = {} } = this.props;
    const time = data.captureTime || data.passTime;
    downloadLocalImage(
      url,
      `${name}_${moment(+time || time).format('YYYYMMDDTHHmmss')}`
    );
    let logInfo = {
      ...OTHER.downloadImg,
      description: `下载点位【${name}】 ${moment(+time || time).format(
        'YYYY.MM.DD HH:mm:ss'
      )}的图片`
    };
    GlobalStore.LoggerStore.save(logInfo);
  }

  /**收藏 */
  storageImg() {
    let { url, data = {}, MediaLibStore } = this.props;
    const localImgObg = {
      cameraId: data.cameraId || data.deviceId,
      cameraName: data.cameraName || data.deviceName,
      captureTime: Number(data.captureTime || data.passTime),
      imgUrl: url,
      type: 'image'
    };
    MediaLibStore.add(localImgObg).then(() => {
      message.config({
        getContainer: () => this.containerRef.current
      });
      message.success('添加成功！').then(() => {
        message.destroy()
      });
    });
  }

  handleSearchPic = type => {
    exitFullscreen();
    const item = this.props.data;
    const data = {
      type,
      id: item.id,
      model: 2
    };
    if (type === 'face') {
      data.model = 13;
    }
    this.jumpUrl(data, type);
  };
  /**人体人脸关联查询 */
  searchFaceBody = cType => {
    exitFullscreen();
    const item = this.props.data;
    const data = { type: cType };
    if (cType === 'body') {
      data.id = item.bodyId;
      data.model = 2;
    } else {
      data.id = item.faceId;
      data.model = 13;
    }
    this.jumpUrl(data, cType);
  };
  // 跳转以图搜图
  jumpUrl = data => {
    const { TabStore, history } = this.props;
    const { searchData = {} } = this.context;
    if(searchData.startTime && searchData.endTime){
      data.startTime = searchData.startTime
      data.endTime = searchData.endTime
    }
    TabStore.goPage({
      moduleName: 'baselib',
      childModuleName: 'imgSearch',
      history,
      state: data
    });
  };

  onDragStop = (event, data, callback) => {
    const { scale } = this.state;
    const ele = this.containerRef.current;
    const w = ele.offsetWidth;
    const h = ele.offsetHeight;
    if (scale === 1) {
      callback && callback({ w, h }, this.position);
      this.rndRef.current.updatePosition({ x: 0, y: 0 });
      return;
    }
    const lx = (w * (scale - 1)) / 2;
    const ly = (h * (scale - 1)) / 2;
    let x, y;
    if (data.x >= 0 && data.x > lx) {
      x = lx;
    }
    if (data.x >= 0 && data.x < lx) {
      x = data.x;
    }

    if (data.x < 0 && data.x < -lx) {
      x = -lx;
    }
    if (data.x < 0 && data.x > -lx) {
      x = data.x;
    }

    if (data.y >= 0 && data.y > ly) {
      y = ly;
    }
    if (data.y >= 0 && data.y < ly) {
      y = data.y;
    }

    if (data.y < 0 && data.y < -ly) {
      y = -ly;
    }
    if (data.y < 0 && data.y > -ly) {
      y = data.y;
    }
    this.position = { x, y };
    if (x !== data.x || y !== data.y) {
      this.rndRef.current.updatePosition(this.position);
    }
    callback && callback({ w, h }, this.position);
  };

  fullScreenChange() {
    setTimeout(() => {
      this.onDragStop(null, this.position, size => {
        this.rndRef.current.updateSize({ width: size.w, height: size.h });
      });
    }, 100);
  }

  render() {
    const defaultOperations = {
      download: true,
      storage: true
    };
    const { scale, rotate, imgUrl } = this.state;
    const { data, type, operations = defaultOperations } = this.props;
    let cType;
    if (type === 'face' || type === 'body') {
      cType = type === 'face' ? 'body' : 'face';
    }
    const relatedFlag = cType && data[cType + 'Id'];
    return (
      <div
        className={`canvas-img-container ${this.randomClass}`}
        onWheel={this.handleWheel}
        ref={this.containerRef}
      >
        <FullScreenLayout
          className="footer_window"
          getContainer={() => this.containerRef.current}
          fullScreenChange={(...args) => this.fullScreenChange(...args)}
        >
          {isFullscreen => (
            <IconFont
              title={!isFullscreen ? '全屏' : '退出全屏'}
              type={!isFullscreen ? 'icon-Full_Main' : 'icon-ExitFull_Main'}
              theme="outlined"
            />
          )}
        </FullScreenLayout>
        <MoveContent
          ref={this.rndRef}
          onDragEnd={(event, data) => this.onDragStop(event, data)}
        >
          <img
            className="wrapper-img"
            onKeyDown={this.handlePressEsc}
            src={imgUrl}
            style={{
              transform: `scale(${scale}) rotate(${rotate}deg)`
            }}
          />
        </MoveContent>
        <div className="left-content-footer">
          <div className="footer_narrow">
            <div
              className={`narrow_left narrow ${
                scale == 1 ? 'narrow_disable' : ''
              }`}
              onClick={this.setScale.bind(this, 0.2)}
            >
              <IconFont type={'icon-ZoomOut_Main'} theme="outlined" />
              <p className="narrow_p">缩小</p>
            </div>

            <div
              className="narrow_center narrow"
              onClick={this.setScale.bind(this, 1)}
            >
              <IconFont type={'icon-ZoomDefault_Main'} theme="outlined" />
              <p className="narrow_p">原始大小</p>
            </div>

            <div
              className={`narrow_left narrow ${
                scale == 3 ? 'narrow_disable' : ''
              }`}
              onClick={this.setScale.bind(this, -0.2)}
            >
              <IconFont type={'icon-ZoomIn_Main'} theme="outlined" />
              <p className="narrow_p">放大</p>
            </div>
          </div>
          <div className="footer_rotate">
            <div
              className="rotate_left narrow"
              onClick={this.setRotate.bind(this, -1)}
            >
              <IconFont type={'icon-Left_Main'} theme="outlined" />
              <p className="narrow_p">向左</p>
            </div>

            <div
              className="rotate_center narrow"
              onClick={this.setRotate.bind(this, 0)}
            >
              <IconFont type={'icon-Middle_Main'} theme="outlined" />
              <p className="narrow_p">复位</p>
            </div>

            <div
              className="rotate_right narrow"
              onClick={this.setRotate.bind(this, 1)}
            >
              <IconFont type={'icon-Right_Main'} theme="outlined" />
              <p className="narrow_p">向右</p>
            </div>
          </div>

          <div className="footer_down">
            {operations.download && (
              <AuthComponent actionName="BaselibImgDownload">
                <div
                  className="down_left narrow"
                  onClick={this.downloadPic.bind(this)}
                >
                  <IconFont type={'icon-Download_Main'} theme="outlined" />
                  <p className="narrow_p">下载</p>
                </div>
              </AuthComponent>
            )}
            {operations.storage && (
              <div
                className="down_right narrow"
                onClick={this.storageImg.bind(this)}
              >
                <IconFont type={'icon-Keep_Main'} theme="outlined" />
                <p className="narrow_p">收藏</p>
              </div>
            )}
          </div>
          {type && (
            <div className="footer_search">
              {/* 关联人体搜图 */}
              {type === 'face' && relatedFlag && (
                <AuthComponent actionName={'BaselibImgSearch'}>
                  <div
                    className={`search_left narrow ${
                      relatedFlag ? '' : 'narrow_disable'
                    }`}
                    onClick={e => this.searchFaceBody('body', e)}
                  >
                    <IconFont type={'icon-Body_Light'} theme="outlined" />
                    <p className="narrow_p">关联人体</p>
                  </div>
                </AuthComponent>
              )}
              {/* 直接人脸搜图 */}
              {type === 'face' && (
                <AuthComponent actionName={'BaselibImgSearch'}>
                  <div
                    className="search_right narrow"
                    onClick={() => this.handleSearchPic('face')}
                  >
                    <IconFont
                      type={'icon-ImageSearch_Light'}
                      theme="outlined"
                    />
                    <p className="narrow_p">以图搜图</p>
                  </div>
                </AuthComponent>
              )}
              {/* 关联人脸搜图 */}
              {type === 'body' && relatedFlag && (
                <AuthComponent actionName={'BaselibImgSearch'}>
                  <div
                    className={`search_left narrow ${
                      relatedFlag ? '' : 'narrow_disable'
                    }`}
                    onClick={e => this.searchFaceBody('face', e)}
                  >
                    <IconFont type={'icon-Face_Light'} theme="outlined" />
                    <p className="narrow_p">关联人脸</p>
                  </div>
                </AuthComponent>
              )}
              {/* 直接人体以图搜图 */}
              {type === 'body' && (
                <AuthComponent actionName={'BaselibImgSearch'}>
                  <div
                    className="search_right narrow"
                    onClick={() => this.handleSearchPic('body')}
                  >
                    <IconFont
                      type={'icon-ImageSearch_Light'}
                      theme="outlined"
                    />
                    <p className="narrow_p">以图搜图</p>
                  </div>
                </AuthComponent>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default view;
