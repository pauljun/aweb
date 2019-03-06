import React from 'react';
import { Progress,Switch } from 'antd';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import IconFont from 'src/components/IconFont';
import location from '../../../../../assets/img/monitees/realalarm/Add_Dark.svg';
import time from '../../../../../assets/img/monitees/realalarm/Clock_Dark.svg';
import monit from '../../../../../assets/img/monitees/realalarm/Layer_Dark.svg';
import WaterMark from 'src/components/WaterMarkView';
import people from '../../../../../assets/img/monitees/realalarm/TreeIcon_People_Dark.svg';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import './index.scss';

@withRouter
@BusinessProvider('TabStore', 'MoniteeAlarmsStore', 'UserStore')
export default class AlarmCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchData: {}
    };
  }
  handlePageJump = (id, libType) => {
    this.props.handleJumPage && this.props.handleJumPage(id, libType);
  };
  render() {
    let { data = {}, type = undefined, libType, UserStore } = this.props;
    let realName = UserStore.userInfo && UserStore.userInfo.realName;
    let {
      imageUrl,
      facePath,
      similarity,
      cameraName,
      objectMainJson,
      captureTime,
      libName,
      isEffective,
      isHandle,
      id
    } = data;
    return (
      <div
        className="alarm-card-out"
        onClick={this.handlePageJump.bind(this, id, libType)}
      >
        <div className="alarm-card-top">
          <div className="alarm-img-flex">
            <div className="item-pic">
              <WaterMark type="face" src={imageUrl} />
            </div>
            <div className="alarm-img-text">布控图片</div>
          </div>
          <div className="alarm-img-flex">
            <div className="item-pic">
              <WaterMark type="face" src={facePath} />
            </div>
            <div className="alarm-img-text">抓拍图片</div>
          </div>
        </div>
        <div className="alarm-progress">
          <div className="alarm-simi">相似度</div>
          <Progress
            percent={similarity && Math.floor(similarity)}
            size="small"
            strokeColor="#FFAA00"
            status="active"
          />
        </div>
        <div className="alarm-bottom-word">
          <p>
            <img src={people} />
             <span
              style={{ paddingLeft: 5, fontSize: '14px', color: '#FF8800' }}
              title={objectMainJson?
                (objectMainJson.name &&
                objectMainJson.name.length > 15
                  ? objectMainJson.name
                  : ''):''
              }
            >
              {objectMainJson?
              (objectMainJson.name &&
              objectMainJson.name.length > 15
                ? objectMainJson.name.substring(0, 15) + '...'
                : objectMainJson.name):''}
            </span>
          </p>
          <p>
            <img src={location} />
            <span
              style={{ paddingLeft: 5 }}
              title={cameraName && cameraName.length > 15 ? cameraName : ''}
            >
              {cameraName && cameraName.length > 15
                ? cameraName.substring(0, 15) + '...'
                : cameraName}
            </span>
          </p>
          <p className="fs12">
            <img src={time} />
            <span style={{ paddingLeft: 5 }}>
              {moment(parseInt(captureTime, 10)).format('YYYY.MM.DD HH:mm:ss')}
            </span>
          </p>
          <p className="fs12">
            <img src={monit} />
            <span
              style={{ paddingLeft: 5 }}
              title={libName && libName.length > 10 ? libName : ''}
            >
              {libName && libName.length > 10
                ? libName.substring(0, 10) + '...'
                : libName}
            </span>
          </p>
          {type &&
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
        </div>
        {type &&
          isHandle == 1 && (
            <div
              className={`alam-rotate ${
                isEffective == 1 ? 'alarm-rotate-yes' : 'alarm-rotate-no'
              }`}
            />
          )}
      </div>
    );
  }
}
