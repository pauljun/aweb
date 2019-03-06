import React, { Component } from 'react';
import { Icon, Spin, Select, Popover, BackTop, Button } from 'antd';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import AlarmNum from './components/alarmNum';
import AlarmType from './components/alarmType';
import AlarmState from './components/alarmState';
import NoData from '../../../components/NoData/index';
import AlarmMCard from '../../PersonnelControl/MoniteeRealAlarm/components/alarmOutCard/index';
import IconFont from 'src/components/IconFont';
import Socket from '../../../libs/Socket';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import chart from '../../../assets/img/monitees/realalarm/ColumnChart_Main.svg';
import circle from '../../../assets/img/monitees/realalarm/PieChart_Main.svg';
import AlarmWordMention from './components/alarmWordMention/index';
import LogsComponent from 'src/components/LogsComponent';

import './index.scss';
const splitNum = (data = 0) => {
	return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
@LogsComponent()
@withRouter
@BusinessProvider('RealAlStore', 'TabStore')
@observer
class BodyCurrentAlarm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortType: '1',
      isCollapse: false,
      GostAlarmList: [],
      show: false,
      Loading: true,
      circleList: { effectiveNum: 0, ineffectiveNum: 0, unHandledNum: 0 },
      chartList: [],
      showSpin: false,
      showLoading: false
    };
    this.getDataTypeCount();
    this.getDataByDay();
    this.initData();
  }
  backTopRef = React.createRef();
  initData() {
    Socket.on('alarm', this.handleAlarmBody);
    Socket.on('resolveAlarm', this.handleDoneAlarm);
  }
  handleAlarmBody = result => {
    let { GostAlarmList } = this.state;
    if (result.logType == 3) {
      this.setState({
        GostAlarmList: [result].concat(GostAlarmList)
      });
    }
  };
  /**监听滤除处理后的警情 */
  handleDoneAlarm = result => {
    const { GostAlarmList } = this.state;
    const index = GostAlarmList.findIndex(v => v.id === result.id);
    if (index > -1) {
      GostAlarmList.splice(index, 1);
      this.setState({
        GostAlarmList
      });
    }
    this.getDataTypeCount();
  };
  componentWillUnmount() {
    Socket.off('alarm', this.handleAlarmBody);
    Socket.off('resolveAlarm', this.handleDoneAlarm);
  }
  /**跳转详情页面 */
  handleJumPage = id => {
    const { RealAlStore, TabStore, history } = this.props;
    let searchData = RealAlStore.optionPage;
    searchData.pageSize = searchData.page * searchData.pageSize;
    searchData.page = 1;
    const moduleName = 'Detail';
    const childModuleName = 'PhantomAlarmsDetail';
    const data = {
      id: id,
      libType: 3,
      searchData: searchData,
      isRealAlarm: true
    };
    TabStore.goPage({ moduleName, childModuleName, history, state: data });
  };

  componentWillMount() {
    const { RealAlStore } = this.props;
    RealAlStore.optionPage.page = 0;
  }
  componentDidMount() {
    this.requestData(true);
  }
  /**请求列表数据 */
  requestData(iscover, type) {
    const { RealAlStore } = this.props;
    //this.options.page++;
    RealAlStore.optionPage.page++;
    if (type == 1) {
      RealAlStore.optionPage.page = 1;
    }
    RealAlStore.getRealList(RealAlStore.optionPage).then(res => {
      const { GostAlarmList } = this.state;
      this.setState({
        showLoading: false,
        Loading:false,
        GostAlarmList:
          iscover === true
            ? res /* && res.data */
            : GostAlarmList.concat(res /* .data */)
      });
    });
  }
  /**请求报警统计饼状图数据*/
  getDataTypeCount = () => {
    const { RealAlStore } = this.props;
    RealAlStore.getTypeStaticCounts({ logTypes: ['3'] }).then(res => {
      if(Object.keys(res).length==0){
        return
      }
      this.setState({
        circleList: res
      });
    });
  };
  /**七日报警数据统计 */
  getDataByDay = () => {
    const { RealAlStore } = this.props;
    RealAlStore.getSevenStatistics().then(res => {
      this.HandleData(res);
    });
  };
  /**处理7天报警数据 */
  HandleData = data => {
    if(Object.keys(data).length==0){
      return
    }
    let arr = [];
    for (let i = 0; i < 7; i++) {
      let PRO = {
        event: data.eventAlarm[i]
      };
      arr.push(PRO);
    }
    this.setState({
      chartList: arr
    });
  };
 
  /**刷新 */
  freshen = () => {
    this.setState({
      showSpin: true
    });
    this.requestData(true, 1);
    setTimeout(() => {
      this.setState({
        showSpin: false
      });
    }, 1500);
  };
  handleJumpMore = () => {
    const { history, TabStore } = this.props;
    const moduleName = 'EventControl';
    const childModuleName = 'PhantomAlarms';
    TabStore.goPage({ moduleName, childModuleName, history });
  };
  render() {
    const {
      isCollapse,
      GostAlarmList,
      show,
      circleList,
      showLoading
    } = this.state;
    const { effectiveNum, ineffectiveNum, unHandledNum } = circleList;
    return (
      <div className="current_alarm_box_another">
        <div className={`alarm_left_total ${isCollapse ? 'collapse' : ''}`}>
          <div className="alarm-title-real" style={{ margin: 0 }}>
            事件提醒
          </div>
          <div className="out-scroll-div">
            <div className="alarm_all_total_num">
              <div className="title">
                <IconFont type={'icon-Alarm_Main'} theme="outlined" />
                <span style={{ color: '#333333', paddingLeft: '4px' }}>
                  事件提醒总量统计
                </span>
              </div>
              <div className="circle-word">
                <div className="circle-word-count">
                  <div>事件总量</div>
                  <div className="font-resource-normal">
                    {splitNum(effectiveNum + ineffectiveNum + unHandledNum)}
                  </div>
                </div>
                <div className="circle-nohandle-count">
                  <div>待处理事件总量</div>
                  <div className="font-resource-normal">{splitNum(unHandledNum)}</div>
                </div>
              </div>
              <div className="content">
                <AlarmNum circleList={circleList} />
              </div>
            </div>
            <div className="alarm_type_total_num">
              <div className="title">
                <img src={circle} alt="" style={{ marginTop: '-2px' }} />
                <span style={{ color: '#333333', paddingLeft: '4px' }}>
                  有效事件统计
                </span>
              </div>
              <div className="content">
                <AlarmType dataAlarmType={circleList} />
              </div>
              <AlarmWordMention circleList={circleList} />
            </div>
            <div className="alarm_change_total_num">
              <div className="title">
                <img src={chart} />
                <span style={{ color: '#333333', paddingLeft: '4px' }}>
                  近七日事件统计
                </span>
              </div>
              <div className="content">
                {<AlarmState resourcesTrendStatis={this.state.chartList} />}
              </div>
            </div>
          </div>
        </div>
        <div className="alarm_right_container">
          <div className="alarm-top-tab">
            <div className="alarm-top-left" style={{ fontSize: '16px' }}>
              <IconFont type={'icon-People_All_Main'} theme="outlined" />
              <span style={{ paddingLeft: '2px', fontSize: '15px' }}>
                魅影布防
              </span>
            </div>
            <div
              className="alarm-just-button"
            >
              <Button onClick={this.freshen.bind(this)} className="refresh_btn">
                <Icon type="reload" /> 刷新
              </Button>
            </div>
          </div>
          <div className="ant-pop-alarm" />
          {show && (
            <Popover
              content={<span style={{ fontSize: '12px' }}>返回顶部</span>}
              getPopupContainer={() => document.querySelector('.ant-pop-alarm')}
            >
              <div className="alarm-scroll-height" onClick={this.backTop} />
            </Popover>
          )}
          {<div
              style={{
                position: 'absolute',
                top: '42%',
                left: '50%',
                zIndex: '10'
              }}
            >
              {GostAlarmList.length == 0 &&
                this.state.Loading && <Spin size="large" />}
              {this.state.showSpin && <Spin size="large" />}
            </div>
          }
          <div className="alart_list_item" ref={this.backTopRef}>
            <div className="spin-loading-bottom">
              <Spin spinning={showLoading} />
            </div>
            {GostAlarmList.length > 0 ? (
              <React.Fragment>
                {GostAlarmList.map((v, i) => (
                  <AlarmMCard
                    type="another"
                    activeKey={2}
                    data={v}
                    handleJumPage={this.handleJumPage}
                    key={i}
                  />
                ))}
                <div className="event-real-alarm-just" />
                <div className="event-real-alarm-just" />
                <div className="event-real-alarm-just" />
                <div className="event-real-alarm-just" />
                <div className="event-real-alarm-just" />
                <AuthComponent actionName="PhantomAlarms">
                  <div className="bottom-button-jump">
                    <Button onClick={this.handleJumpMore}>查看更多</Button>
                  </div>
                </AuthComponent>
              </React.Fragment>
            ) : (
              <div style={{ height: '100%', width: '100%' }}>
                {!this.state.Loading && <NoData />}
              </div>
            )}
          </div>
          <Popover
            content={<span style={{ fontSize: '12px' }}>返回顶部</span>}
            getPopupContainer={() => document.querySelector('.ant-pop-alarm')}
          >
            <BackTop target={() => this.backTopRef.current} />
          </Popover>
        </div>
      </div>
    );
  }
}
export default BodyCurrentAlarm;
