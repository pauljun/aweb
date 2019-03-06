import React from 'react';
import moment from 'moment';
import location from '../../../../../assets/img/monitees/realalarm/Add_Dark.svg';
import time from '../../../../../assets/img/monitees/realalarm/Clock_Dark.svg';
import monit from '../../../../../assets/img/monitees/realalarm/Layer_Dark.svg';
import IconFont from 'src/components/IconFont';
import { withRouter } from 'react-router-dom';
import WaterMark from 'src/components/WaterMarkView';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { CircleProgressAnimatem } from '../../../../../components/CircleProgress/circle';
import './index.scss';
@withRouter
@BusinessProvider('TabStore', 'MoniteeAlarmsStore', 'UserStore')
export default class AlarmOutCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchData: {}
    };
  }
  handleJumPage = (id, libType) => {
    this.props.handleJumPage && this.props.handleJumPage(id, libType);
  };
  /*  handleJumPage = id => {
    const {
      TabStore,
      history,
      activeKey,
      libType,
      MoniteeAlarmsStore
    } = this.props;
    let searchDatas = toJS(MoniteeAlarmsStore.searchData);
    const moduleName = 'Detail';
    let childModuleName = 'outsidersDetail';
    let data = { id: id, libType: activeKey == 3 ? 4 : 2 };
    if (libType) {
      data.libType = libType;
    }
    if(activeKey == 3) {
      childModuleName = 'AIOAlarmsDetail'
    }
    if(libType === 3) {
      childModuleName = 'PhantomAlarmsDetail'
    }
    this.setState(
      {
        searchData: searchDatas
      },
      () => {
        data.searchData = this.state.searchData;
        TabStore.goPage({ moduleName, childModuleName, history, state: data });
      }
    );
  }; */
  render() {
    const { activeKey, data = {}, libType, UserStore, type } = this.props;
    let realName = UserStore.userInfo && UserStore.userInfo.realName;
    const Circle = CircleProgressAnimatem;
    let {
      imageUrl,
      isEffective,
      facePath,
      similarity,
      cameraName,
      objectMainJson,
      captureTime,
      libName,
      isHandle,
      taskName,
      id
    } = data;
    const similarties = similarity || 1;
    return (
      <div
        className={`alarm-out-card ${activeKey == 2 ? 'twice' : ''} ${
          activeKey == 3 ? 'third' : ''
        }`}
        onClick={this.handleJumPage.bind(this, id, libType)}
      >
        <div
          className="alarm-card-image"
        >
          <div className="alarm-card-image-box">
            <WaterMark
              className={'info-img'}
              background={true}
              type={type !== 'another' ? 'face' : 'body'}
              src={facePath}
            />
          </div>
        </div>
        <div className="alarm-peo-mes">
          {(activeKey == 3 || libType == 4) && (
            <div className="alarm-progress">
              <Circle
                hasText={false}
                lineWidth={2}
                width={17}
                height={17}
                value={similarties}
              />
              <span className="peo-mes-span another">
                相似度 &nbsp;
                <span style={{color:"#ff8800",fontSize:'14px',paddingTop:'2px'}}>{similarity ? Math.floor(similarity) : 0}%</span>
              </span>
            </div>
          )}
          <p className="peo-mes-text">
            <img className="peo-mes-img" src={location} />
            <span
              className="peo-mes-span"
              title={cameraName && cameraName.length > 8 ? cameraName : ''}
            >
              {cameraName && cameraName.length > 8
                ? cameraName.substring(0, 8) + '...'
                : cameraName}
            </span>
          </p>
          <p className="peo-mes-text">
            <img className="peo-mes-img" src={time} />
            <span className="peo-mes-span another">
              {moment(parseInt(captureTime, 10)).format('YYYY.MM.DD HH:mm:ss')}
            </span>
          </p>
          <p className="peo-mes-text">
            <img className="peo-mes-img" src={monit} />
            <span className="peo-mes-span another" title={(libName && libName.length > 8?libName:'')||(taskName && taskName.length>8?taskName:'')}>
              {(libName && libName.length > 8
                ? libName.substring(0, 8) + '...'
                : libName) ||
                (taskName && taskName.length>8?taskName.substring(0,8)+'...':taskName)}
            </span>
          </p>
          {libType &&
            libType !== 4 &&
            isHandle !== 1 && (
              <div className="alarm-Handle">
                <div
                  className="handle handle-no"
                  onClick={
                    this.props.handleChangeYN &&
                    this.props.handleChangeYN.bind(this, data, 0)
                  }
                >
                  <IconFont type={'icon-YesNo_No_Main'} theme="outlined" />
                  无效
                </div>
                <div
                  className="handle handle-yes"
                  onClick={
                    this.props.handleChangeYN &&
                    this.props.handleChangeYN.bind(this, data, 1)
                  }
                >
                  <IconFont type={'icon-YesNo_Yes_Main'} theme="outlined" />
                  有效
                </div>
              </div>
            )}
          {libType &&
            isHandle == 1 && (
              <div
                className={`alam-rotate ${
                  isEffective == 1 ? 'alarm-rotate-yes' : 'alarm-rotate-no'
                }`}
              />
            )}
        </div>
      </div>
    );
  }
}
