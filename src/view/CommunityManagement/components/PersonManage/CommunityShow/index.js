import React from 'react';
import LiveDetail from '../LiveDetail/index';
import AlarmState from '../alarmState';
import IconFont from 'src/components/IconFont';
import CameraShow from '../CarmaShow/index';
import * as _ from 'lodash';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import './index.scss';
@BusinessProvider(
  'LongLivedStore',
  'CommunityEntryStore',
  'TabStore',
  'FloatPersonStore',
  'CommunityDetailStore'
)
export default class CommunityShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showface: false,
      showcam: false,
      LongLiveTotal: 0,
      ReUnAppearTotal: 0,
      DataByDaysList: [],
      CameraList: []
    };
  }
  handle = id => {
    const { LongLivedStore, FloatPersonStore,type} = this.props;
    this.setState({
      show: !this.state.show
    });
    if (type == 2) {
      !this.state.show &&
        LongLivedStore.getListPersonalInformation({
          villageIds: [id],
          page: 1,
          pageSize: 10,
          collectionType: 1,
          peroidType: 0
        }).then(res => {
          this.setState({
            LongLiveTotal: res.total
          });
        });
      !this.state.show &&
        LongLivedStore.getListPersonalInformation({
          villageIds: [id],
          page: 1,
          pageSize: 10,
          collectionType: 0,
          peroidType: 0
        }).then(res => {
          this.setState({
            ReUnAppearTotal: res.total
          });
        });
    } else {
      !this.state.show &&
        FloatPersonStore.getListFlowFace({
          villageIds: [id],
          page: 1,
          pageSize: 10,
          floatingPeopleType: 0,
          peroidType: 0
        }).then(res => {
          this.setState({
            ReUnAppearTotal: res.total
          });
        });
      !this.state.show &&
        FloatPersonStore.getListFlowFace({
          villageIds: [id],
          page: 1,
          pageSize: 10,
          floatingPeopleType: 1,
          peroidType: 0
        }).then(res => {
          this.setState({
            LongLiveTotal: res.total
          });
        });
    }
  };
  handleFace = id => {
    const { CommunityDetailStore, type } = this.props;
    const { DataByDaysList } = this.state;
    this.setState({
      showface: !this.state.showface
    });
    if (type == 2) {
      !this.state.showface &&
        DataByDaysList.length == 0 &&
        CommunityDetailStore.getcountPeopleByVillage({
          villageId: id,
          days: '7'
        }).then(res => {
          this.setState({
            DataByDaysList: res
          });
        });
    } else {
      !this.state.showface &&
        DataByDaysList.length == 0 &&
        CommunityDetailStore.getCountSnappingTimesForVidByVillage({
          villageId: id,
          days: '7'
        }).then(res => {
          this.setState({
            DataByDaysList: res
          });
        });
    }
  };
  handleCam = id => {
    const { CommunityEntryStore } = this.props;
    this.setState({
      showcam: !this.state.showcam
    });
    !this.state.showcam &&
      CommunityEntryStore.getCountDeviceByVillage({ villageId: id }).then(
        res => {
          this.setState({
            CameraList: res
          });
        }
      );
  };
  handleOnSelect = id => {
    this.props.handleVillageSelect(id);
  };
  render() {
    const {
      villageName,
      deviceCount,
      address,
      id,
      picUrl,
      permanentCount,
      flowCount,
      shotPermanentNumPerDay,
      shotFloatNumPerDay
    } = this.props.data || {};
    const {
      LongLiveTotal,
      ReUnAppearTotal,
      DataByDaysList,
      show,
      showcam,
      showface
    } = this.state;
    let { choseId, type,otherData} = this.props;
    let judge = choseId == id;
    return (
      <div className={`left-community ${judge ? 'back' : ''}`}>
        <div
          className="left-community-top"
          onClick={this.handleOnSelect.bind(this, id)}
        >
          <div className="community-img">
            {picUrl ? (
              <img src={picUrl} />
            ) : (
              <IconFont
                style={{ fontSize: '80px', color: '#D8DCE3' }}
                type={'icon-Dataicon__Dark4'}
                theme="outlined"
              />
            )}
          </div>
          <div className="flex-community">
            <span>{villageName}</span>
            <div className="community-word">{address}</div>
          </div>
        </div>
        <div className="card-mas-community">
          <div className="card-one" onClick={this.handle.bind(this, id)}>
            <span>
              <IconFont type={'icon-Often_Dark'} theme="outlined" />
              <span>
                小区
                {type == 1 ? '流动' : '常住'}
                人口
              </span>
            </span>
            <span>人</span>
            <span className="font-resource-normal">
              {type == 1
                ? otherData[0]?parseFloat(otherData[0].flowCount).toLocaleString():'/'
                : otherData[0]?parseFloat(otherData[0].permanentCount).toLocaleString():'/'}
            </span>
            <span className="plus-community">
              {!show ? (
                <IconFont type={'icon-_Main1'} theme="outlined" />
              ) : (
                <IconFont type={'icon--_Main'} theme="outlined" />
              )}
            </span>
          </div>
          {show && (
            <div className={`community-count ${show ? 'show' : ''} `}>
              <LiveDetail
                LongLiveTotal={LongLiveTotal}
                ReUnAppearTotal={ReUnAppearTotal}
                type={type}
              />
            </div>
          )}
          <div className="card-one two" onClick={this.handleCam.bind(this, id)}>
            <span>
              <IconFont type={'icon-Camera_Main'} theme="outlined" />
              <span>小区实有设备</span>
            </span>
            <span>台</span>
            <span className="font-resource-normal">{deviceCount}</span>
            <span className="plus-community">
              {!showcam ? (
                <IconFont type={'icon-_Main1'} theme="outlined" />
              ) : (
                <IconFont type={'icon--_Main'} theme="outlined" />
              )}
            </span>
          </div>
          {showcam && (
            <div className={`community-content ${showcam ? 'showcam' : ''}`}>
              <CameraShow CameraList={this.state.CameraList} />
            </div>
          )}
          <div
            className="card-one three"
            onClick={this.handleFace.bind(this, id)}
          >
            <span>
              <IconFont type={'icon-Control_White_Main'} theme="outlined" />
              <span>平均每天人脸抓拍数</span>
            </span>
            <span>张</span>
            <span className="font-resource-normal">
              {type == 2
                ? otherData[0]?parseFloat(otherData[0].shotPermanentNumPerDay).toLocaleString():'/'
                :otherData[0]?parseFloat(otherData[0].shotFloatNumPerDay).toLocaleString():'/'}
            </span>
            <span className="plus-community">
              {!showface ? (
                <IconFont type={'icon-_Main1'} theme="outlined" />
              ) : (
                <IconFont type={'icon--_Main'} theme="outlined" />
              )}
            </span>
          </div>
          {showface && (
            <div
              className={`community-face-count  ${showface ? 'showface' : ''}`}
            >
              <AlarmState DataByDaysList={DataByDaysList} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
