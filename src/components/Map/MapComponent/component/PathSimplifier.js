import React from 'react';
import PropTypes from 'prop-types';
import MakerPoints from './MakerPoints';
import InfoWindow from './InfoWindow';
import { errorBoundary } from '../../../../utils/Decorator';
import { map } from '../mapContext';
import IconFont from '../../../../components/IconFont';
import { Switch } from 'antd';
import { uuid } from '../../../../utils';
import moment from 'moment';
import Image from 'src/components/Image';
import WaterMark from 'src/components/WaterMarkView';
import MapDetailModal from '../../../../view/BusinessComponent/MapDetailModal';
import '../style/map-path-tools.scss';

@errorBoundary
@map
export default class PathSimplifier extends React.Component {
  constructor(props) {
    super(props);
    this.pathSimplifier = null;
    this.pathNavigator = null;
    this.data = [];
    this.pointIndex = -1;
    this.MakerPoints = null;
    this.infoWindow = null;
    this.state = {
      center: [0, 0],
      visible: true,
      status: 'resume', //'resume' : 'pause'
      isClear: true,
      current: null,
      detailModalVisible: false
    };
  }
  initWinInfoAction = infoWindow => {
    this.infoWindow = infoWindow;
    if (!this.pathSimplifier) {
      this.initPathSimplifier(() => {
        this.props.init && this.props.init(this);
      });
    }
  };
  componentWillUnmount() {
    this.clearPathNavigators();
    this.pathSimplifier = null;
    this.pathNavigator = null;
    this.data = null;
    this.pointIndex = null;
    this.MakerPoints = null;
    this.infoWindow = null;
  }

  createMarkers() {
    if (this.MakerPoints) {
      this.MakerPoints.createIndexMarkers({
        points: this.data,
        options: {},
        color: '#17bc84'
      });
    }
  }
  initPathSimplifier(callback) {
    const { map } = this.props;
    AMapUI.loadUI(['misc/PathSimplifier'], PathSimplifier => {
      this.pathSimplifier = new PathSimplifier(this.createOptions(map));
      callback && callback();
    });
  }
  createOptions = map => {
    return {
      map,
      zIndex: 101,
      clickToSelectPath: false,
      renderOptions: {
        eventSupport: false,
        eventSupportInvisible: false,
        pathTolerance: 0,
        //轨迹线的样式
        pathLineStyle: {
          strokeStyle: '#f7a319',
          lineWidth: 6,
          dirArrowStyle: true,
          eventSupportInvisible: false
        },
        pathLineHoverStyle: {
          strokeStyle: 'orange',
          lineWidth: 6,
          dirArrowStyle: true,
          eventSupportInvisible: false
        }
      },
      getPath: function(pathData, pathIndex) {
        //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
        return pathData.path;
      },
      getHoverTitle() {
        return false;
      }
    };
  };

  /**
   * @desc 生成轨迹记录id，初始化数据
   * @param {array} data
   */
  setDataInfo(data) {
    this.data = data;
    for (let i = 0, l = this.data.length; i < l; i++) {
      let item = this.data[i];
      let id = uuid();
      item.id = `path-${item.cameraId}-${id}`;
      item.deviceName = item.cameraName;
    }
    this.data.length > 0 && this.createMarkers();
  }

  /**
   * @desc 设置轨迹
   * @param {array} arr
   */
  setData(arr) {
    this.clearPathNavigators();
    this.clearOtherInfo();
    if (!Array.isArray(arr) || arr.length === 0) {
      this.hide();
      this.setState({ isClear: true });
      return false;
    }
    this.setDataInfo(arr);
    this.show();
    const data = this.data.map(v => v.position);
    this.pathSimplifier.setData([{ path: data }]);
    this.createStart();
    if (this.data.length === 1) {
      this.setState({
        current: this.data[0],
        center: this.data[0].position,
        visible: true
      });
      this.props.changePointIndex &&
        this.props.changePointIndex(0, this.data[0]);
    }
  }

  /**
   * @desc 清除巡航器
   */
  clearPathNavigators() {
    if (this.pathNavigator) {
      this.pathNavigator.off('move', this.moveAction);
      this.pathNavigator.off('pause', this.stopAction);
      this.pathNavigator.destroy();
    }
    this.pathSimplifier && this.pathSimplifier.clearPathNavigators();
  }

  /**
   * @desc 清理点位和图片信息
   */
  clearOtherInfo() {
    this.MakerPoints && this.MakerPoints.removeAllMarker();
    this.infoWindow && this.infoWindow.close();
  }

  /**
   * @desc 开始一个轨迹
   */
  createStart() {
    //创建一个巡航器
    this.pointIndex = -1;
    this.pathNavigator = this.pathSimplifier.createPathNavigator(0, {
      loop: false,
      speed: 10
    });
    this.pathNavigator.on('move', this.moveAction);
    this.pathNavigator.on('pause', this.stopAction);
    this.pathNavigator.start();
    this.setState({ status: 'resume', isClear: false });
  }

  /**
   * @desc 监听轨迹move事件
   */
  moveAction = event => {
    const { idx } = event.target.getCursor();
    if (idx !== this.pointIndex) {
      this.pointIndex = idx;
      const current = this.data[this.pointIndex];
      const next = this.data[this.pointIndex + 1];
      if (current && next) {
        const dis = AMap.GeometryUtil.distance(current.position, next.position);
        dis > 10 && event.target.setSpeed(dis / 3 / (1000 / 3600));
      }
      setTimeout(() => {
        this.setState({
          current,
          center: current.position
        });
        this.setCurrentPoint(current);
      }, 10);
      this.props.changePointIndex &&
        this.props.changePointIndex(this.pointIndex, current);
    }
  };

  /**
   * @desc 监听轨迹停止事件
   */
  stopAction = event => {
    this.setState({ status: 'repeat' });
  };

  /**
   * @desc 生产轨迹的点位
   * @param {object} data
   */
  setCurrentPoint(data) {
    for (let i = 0, l = this.data.length; i < l; i++) {
      let item = this.data[i];
      this.MakerPoints.updateIndexMarkersIcon({
        id: item.id,
        color: '#17bc84',
        active: item.id === data.id,
        index: i + 1
      });
    }
  }

  /**
   * @desc 初始化加点位组件，用户辅助轨迹
   */
  initPoints = MakerPoints => {
    this.MakerPoints = MakerPoints;
  };
  hide() {
    if (this.pathSimplifier) {
      !this.pathSimplifier.isHidden() && this.pathSimplifier.hide();
    }
  }
  show() {
    if (this.pathSimplifier) {
      this.pathSimplifier.isHidden() && this.pathSimplifier.show();
    }
  }
  changeIndex = index => {
    this.pathNavigator.pause();
    this.setState({ status: 'pause' });
    const current = this.data[index];
    setTimeout(() => {
      this.setState({
        current,
        center: current.position
      });
      this.setCurrentPoint(current);
    }, 10);
  };

  /**
   * @desc 修改当前轨迹的点位
   */
  changeCurrent = (key = 'dataId', value) => {
    let index = this.data.findIndex(v => v[key] && v[key] === value);
    index > -1 && this.changeIndex(index);
  };
  navClk(status) {
    const currentStatus = this.pathNavigator.getNaviStatus();
    if (status === 'repeat' || status === 'stop') {
      this.pathNavigator.start();
      this.setState({ status: 'resume' });
      return false;
    }
    if (currentStatus === 'moving') {
      this.pathNavigator.pause();
      this.setState({ status: 'pause' });
      return false;
    }
    if (currentStatus === 'pause') {
      this.pathNavigator.resume();
      this.setState({ status: 'resume' });
      return false;
    }
  }
  prev() {
    if (this.pointIndex > 0) {
      this.pathNavigator.moveToPoint(this.pointIndex - 1, 1);
    }
  }
  next() {
    if (this.pointIndex < this.data.length) {
      this.pathNavigator.moveToPoint(this.pointIndex + 1, 1);
    }
  }
  onCheck(flag) {
    this.setState({ visible: flag });
  }
  onClickPicture = () => {
    this.pathNavigator.pause();
    this.setState({
      detailModalVisible: true,
      status: 'pause'
    })
  }
  onCanCelModal =() => {
    this.pathNavigator.resume();
    this.setState({
      detailModalVisible: false,
      status: 'resume'
    })
  }
  render() {
    const { center, status, visible, isClear, current, detailModalVisible } = this.state;
    const { content, className='', imgType } = this.props;
    const isMove = status === 'resume';
    const Content = () =>
      visible && !isClear ? (
        content ? (
          content
        ) : (
          <TrajectoryContent imgType={imgType} className={className} data={current} onClickPicture={this.onClickPicture} visible = {detailModalVisible} onCancel={this.onCanCelModal} />
        )
      ) : null;
    return (
      <React.Fragment>
        <MakerPoints init={this.initPoints} />
        <InfoWindow
          init={this.initWinInfoAction}
          center={center}
          content={<Content />}
          visible={visible}
          notMove={true}
        />
        <div className="map-path-tools">
          <div
            className="tool-item"
            onClick={this.navClk.bind(this, isMove ? 'pause' : status)}
          >
            <IconFont
              type={!isMove ? 'icon-Play_Main' : 'icon-Pause_Main'}
              title={!isMove ? '开始' : '暂停'}
            />
          </div>

          <div className="tool-item" onClick={this.navClk.bind(this, 'repeat')}>
            <IconFont type={'icon-Reset_Dark'} title="复位" />
          </div>

          <div className="tool-item" onClick={this.prev.bind(this)}>
            <IconFont type={'icon-Forward_Main'} title="上一个" />
          </div>
          <div className="tool-item next-btn" onClick={this.next.bind(this)}>
            <IconFont type={'icon-Backward_Main'} title="下一个" />
          </div>
          <div className="tool-item">
            <Switch
              checked={visible}
              onChange={this.onCheck.bind(this)}
              title={`${visible ? '关闭' : '开启'}图片`}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function TrajectoryContent({ data, className = '', onClickPicture, visible, onCancel, imgType }) {
  if (!data) {
    return null;
  }
  let item = {
    id: data.dataId || data.captureId
  }
  return (
    <React.Fragment>
       <div className="map-trajectory-list-li" onClick={() => onClickPicture(data)}>
       <div className="map-img-box">
       <WaterMark
        key={data.id}
        className={'box_img'}
        background={true}
        type={imgType === 2 ? 'body' : 'face'}
        src={data.imagePath}
      />
       </div>
      
        {/* <Image src={data.imagePath} /> */}
        <div className="map-img-box-text" title={data.title}>{data.title}</div>   
        <div className="map-img-box-text">
          {moment(+data.captureTime).format('YYYY.MM.DD HH:mm:ss')}
        </div>
      </div>
      {visible && <MapDetailModal className={className} visible={visible} data={item} onCancel={onCancel} imgType={imgType} />}
    </React.Fragment>
  );
}
