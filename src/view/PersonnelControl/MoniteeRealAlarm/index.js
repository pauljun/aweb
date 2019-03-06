import React from 'react';
import { Icon, Spin, Button, Tabs, Popover } from 'antd';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { observer } from 'mobx-react';
import AlarmCard from './components/alarmCard/index';
import AlarmOutCard from './components/alarmOutCard/index';
import { withRouter } from 'react-router-dom';
import Socket from '../../../libs/Socket';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import NoData from '../../../components/NoData/index';
import IconFont from 'src/components/IconFont';
import RealAlarmLeft from './components/RealALarmLeft/index';
import LogsComponent from 'src/components/LogsComponent';

import './index.scss';

const TabPane = Tabs.TabPane;

@LogsComponent()
@withRouter
@BusinessProvider('RealAlStore', 'TabStore')
@observer
export default class MoniteeRealAlarm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortType: '1',
      isCollapse: false,
      activeKey: '1',
      KeyPersonAlarmList: [],
      IlegalPeAlarmList: [],
      SpecPersonAlarmList: [],
      show: false,
      showIl: false,
      showSp: false,
      spinShow: false,
      Loading: true
    };
    this.initData();
    this.requestData();
    this.requestIlData();
    this.requestSpData();
  }
  initData() {
    Socket.on('alarm', this.handleAlarm);
    Socket.on('resolveAlarm', this.handleDoneAlarm);
  }
  /**监听推送警情 */
  handleAlarm = result => {
    let {
      KeyPersonAlarmList,
      IlegalPeAlarmList,
      SpecPersonAlarmList
    } = this.state;
    if (result.logType == 1) {
      this.setState({
        KeyPersonAlarmList: [result].concat(KeyPersonAlarmList)
      });
    } else if (result.logType == 2) {
      this.setState({
        IlegalPeAlarmList: [result].concat(IlegalPeAlarmList)
      });
    } else if (result.logType == 5) {
      this.setState({
        SpecPersonAlarmList: [result].concat(SpecPersonAlarmList)
      });
    }
  };
  /**监听处理滤除处理后的警情 */
  handleDoneAlarm = result => {
    const {
      KeyPersonAlarmList,
      IlegalPeAlarmList,
      SpecPersonAlarmList
    } = this.state;
    const index = KeyPersonAlarmList.findIndex(v => v.id === result.id);
    const indexa = IlegalPeAlarmList.findIndex(v => v.id === result.id);
    const indexb = SpecPersonAlarmList.findIndex(v => v.id === result.id);
    if (index > -1) {
      KeyPersonAlarmList.splice(index, 1);
      this.setState({
        KeyPersonAlarmList
      });
    } else if (indexa > -1) {
      IlegalPeAlarmList.splice(indexa, 1);
      this.setState({
        IlegalPeAlarmList
      });
    } else {
      SpecPersonAlarmList.splice(indexb, 1);
      this.setState({
        SpecPersonAlarmList
      });
    }
  };
  /**跳转页面*/
  handlePageJump = id => {
    const { RealAlStore, TabStore, history } = this.props;
    const { activeKey } = this.state;
    const moduleName = 'Detail';
    if (activeKey == 1) {
      let searchData = RealAlStore.ImoptionsPage;
      searchData.pageSize = searchData.page * searchData.pageSize;
      searchData.page = 1;
      const childModuleName = 'faceDetail';
      const data = {
        id: id,
        libType: 1,
        searchData: searchData,
        isRealAlarm: true
      };
      TabStore.goPage({ moduleName, childModuleName, history, state: data });
    }
    if (activeKey == 2) {
      let searchData = RealAlStore.IloptionsPage;
      searchData.pageSize = searchData.page * searchData.pageSize;
      searchData.page = 1;
      const childModuleName = 'outsidersDetail';
      const data = {
        id: id,
        libType: 2,
        searchData: searchData,
        isRealAlarm: true
      };
      TabStore.goPage({ moduleName, childModuleName, history, state: data });
    }
    if (activeKey == 3) {
      let searchData = RealAlStore.IloptionsPage;
      searchData.pageSize = searchData.page * searchData.pageSize;
      searchData.page = 1;
      const childModuleName = 'AIOAlarmsDetail';
      const data = {
        id: id,
        libType: 4,
        searchData: searchData,
        isRealAlarm: true
      };
      TabStore.goPage({ moduleName, childModuleName, history, state: data });
    }
  };
  /**刷新 */
  freshen = () => {
    const { activeKey } = this.state;
    this.setState({
      spinShow: true
    });
    if (activeKey == 1) {
      this.requestData();
    }
    if (activeKey == 2) {
      this.requestIlData();
    }
    if (activeKey == 3) {
      this.requestSpData();
    }
    setTimeout(() => {
      this.setState({
        spinShow: false
      });
    }, 1000);
  };
  componentWillUnmount() {
    Socket.off('alarm', this.handleAlarm);
    Socket.off('resolveAlarm', this.handleDoneAlarm);
  }
  /**监听滚动高度，超出一定高度显示返回一键返回顶部按钮*/
  componentDidMount() {
    window.addEventListener(
      'scroll',
      () => {
        let el = this.refs.scrollH;
        let em = this.refs.scrollI;
        let en = this.refs.scrollJ;
        let scrollTop = el ? el.scrollTop : 0;
        let scrollTopIl = em ? em.scrollTop : 0;
        let scrollTopSp = en ? en.scrollTop : 0;
        if (scrollTop > 1000) {
          this.state.show === false &&
            this.setState({
              show: true
            });
        } else {
          this.state.show === true &&
            this.setState({
              show: false
            });
        }
        if (scrollTopIl > 1000) {
          this.state.showIl === false &&
            this.setState({
              showIl: true
            });
        } else {
          this.state.showIl === true &&
            this.setState({
              showIl: false
            });
        }
        if (scrollTopSp > 1000) {
          this.state.showSp === false &&
            this.setState({
              showSp: true
            });
        } else {
          this.state.showSp === true &&
            this.setState({
              showSp: false
            });
        }
      },
      true
    );
  }
  /**返回顶部 */
  backTop = type => {
    let el = this.refs.scrollH;
    let em = this.refs.scrollI;
    let en = this.refs.scrollJ;
    if (type === 0) {
      el.scrollTop = 0;
    } else if (type === 1) {
      em.scrollTop = 0;
    } else {
      en.scrollTop = 0;
    }
  };
  /**请求滚动条数据 */
  requestData = () => {
    const { RealAlStore } = this.props;
    RealAlStore.getRealList({
      page: 1,
      pageSize: 80,
      alarmOperationType: 2,
      sortType: 1,
      logTypes: '1',
      threshold: '60.0'
    }).then(res => {
      this.setState({
        KeyPersonAlarmList: res
      });
      setTimeout(() => {
        this.setState({
          Loading: false
        });
      }, 1500);
    });
  };
  requestIlData = () => {
    const { RealAlStore } = this.props;
    RealAlStore.getRealList({
      page: 1,
      pageSize: 84,
      alarmOperationType: 2,
      sortType: 1,
      logTypes: '2'
    }).then(res => {
      this.setState({
        IlegalPeAlarmList: res
      });
    });
  };
  requestSpData = () => {
    const { RealAlStore } = this.props;
    RealAlStore.getRealList({
      page: 1,
      pageSize: 84,
      alarmOperationType: 2,
      sortType: 1,
      logTypes: '5',
      threshold: '60.0'
    }).then(res => {
      this.setState({
        SpecPersonAlarmList: res
      });
    });
  };
  handleTableKey = key => {
    this.setState({
      activeKey: key,
      show: false,
      showIl: false,
      showSp: false
    });
  };
  handleButtonClick = type => {
    const { RealAlStore, TabStore, history } = this.props;
    const moduleName = 'PersonnelControl';
    if (type == 1) {
      const childModuleName = 'faceAlarm';
      TabStore.goPage({ moduleName, childModuleName, history });
    } else if (type == 2) {
      const childModuleName = 'outsidersAlarm';
      TabStore.goPage({ moduleName, childModuleName, history });
    } else {
      const childModuleName = 'AIOAlarms';
      TabStore.goPage({ moduleName, childModuleName, history });
    }
  };
  render() {
    const {
      show,
      showIl,
      showSp,
      isCollapse,
      activeKey,
      KeyPersonAlarmList,
      IlegalPeAlarmList,
      SpecPersonAlarmList
    } = this.state;
    let KeyPersonAlarmListHandle = KeyPersonAlarmList.slice(0, 80);
    let IlegalPeAlarmListHandle = IlegalPeAlarmList.slice(0, 84);
    let SpecPersonAlarmListHandle = SpecPersonAlarmList.slice(0, 84);
    return (
      <div className="current_alarm_box">
        <div className={`alarm_left_total ${isCollapse ? 'collapse' : ''}`}>
          <RealAlarmLeft />
        </div>
        <div className="alarm_right_container">
          <div className="alarm-just-button">
            <Button onClick={this.freshen.bind(this)} className="refresh_btn">
              <Icon type="reload" /> 刷新
            </Button>
          </div>
          <div className="ant-popover-get" />
          {KeyPersonAlarmList.length == 0 && this.state.Loading && (
            <div className="real-alarm-spin-bufferPosition">
              <Spin size="large" />
            </div>
          )}
          {this.state.spinShow && (
            <div className="real-alarm-spin-bufferPosition">
              <Spin size="large" />
            </div>
          )}
          {show && (
            <Popover
              content={<span style={{ fontSize: '12px' }}>返回顶部</span>}
              getPopupContainer={() =>
                document.querySelector('.ant-popover-get')
              }
            >
              <div
                className="alarm-scroll-height"
                onClick={this.backTop.bind(this, 0)}
              />
            </Popover>
          )}
          {showIl && (
            <Popover
              content={<span style={{ fontSize: '12px' }}>返回顶部</span>}
              getPopupContainer={() =>
                document.querySelector('.ant-popover-get')
              }
            >
              <div
                className="alarm-scroll-height"
                onClick={this.backTop.bind(this, 1)}
              />
            </Popover>
          )}
          {showSp && (
            <Popover
              content={<span style={{ fontSize: '12px' }}>返回顶部</span>}
              getPopupContainer={() =>
                document.querySelector('.ant-popover-get')
              }
            >
              <div
                className="alarm-scroll-height"
                onClick={this.backTop.bind(this, 2)}
              />
            </Popover>
          )}
          <Tabs
            type="card"
            onChange={this.handleTableKey}
            activeKey={this.state.activeKey}
          >
            <TabPane
              tab={
                <span style={{ fontSize: '16px' }}>
                  <IconFont type={'icon-People_Focus_Main'} />
                  <span style={{ fontSize: '14px' }}>重点人员告警</span>
                </span>
              }
              key="1"
            >
              {KeyPersonAlarmListHandle.length > 0 ? (
                <div className="alarm-tabs-tabscreate other" ref="scrollH">
                  {KeyPersonAlarmListHandle.map((v, index) => (
                    <AlarmCard
                      key={index}
                      data={v}
                      handleJumPage={this.handlePageJump}
                    />
                  ))}
                  <div className="name-real-alarm-none" />
                  <div className="name-real-alarm-none" />
                  <div className="name-real-alarm-none" />
                  <AuthComponent actionName="faceAlarm">
                    <div className="real-alarm-height">
                      <Button onClick={this.handleButtonClick.bind(this, 1)}>
                        查看更多
                      </Button>
                    </div>
                  </AuthComponent>
                </div>
              ) : !this.state.Loading && <NoData />}
            </TabPane>
            <TabPane
              tab={<span style={{ fontSize: '16px' }}>
                  <IconFont type={'icon-People_Other_Main'} />
                  <span style={{ fontSize: '14px' }}>外来人员告警</span>
                </span>
              }
              key="2"
            >
              {IlegalPeAlarmListHandle.length > 0 ? (
                <div className="alarm-tabs-tabscreate" ref="scrollI">
                  {IlegalPeAlarmListHandle.map((v, index) => (
                    <AlarmOutCard
                      key={index}
                      activeKey={activeKey}
                      data={v}
                      handleJumPage={this.handlePageJump}
                    />
                  ))}
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <AuthComponent actionName="outsidersAlarm">
                    <div className="real-alarm-height">
                      <Button onClick={this.handleButtonClick.bind(this, 2)}>
                        查看更多
                      </Button>
                    </div>
                  </AuthComponent>
                </div>
              ) : !this.state.Loading && <NoData />}
            </TabPane>
            <TabPane
              tab={
                <span style={{ fontSize: '16px' }}>
                  <IconFont
                    type={'icon-People_Machine_Main'}
                    theme="outlined"
                  />
                  <span style={{ fontSize: '14px' }}>专网套件告警</span>
                </span>
              }
              key="3"
            >
              {SpecPersonAlarmListHandle.length > 0 ? (
                <div className="alarm-tabs-tabscreate" ref="scrollJ">
                  {SpecPersonAlarmListHandle.map((v, index) => (
                    <AlarmOutCard
                      key={index}
                      activeKey={activeKey}
                      data={v}
                      handleJumPage={this.handlePageJump}
                    />
                  ))}
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <div className="name-real-alarm-none-il" />
                  <AuthComponent actionName="AIOAlarms">
                    <div className="real-alarm-height">
                      <Button onClick={this.handleButtonClick.bind(this, 3)}>
                        查看更多
                      </Button>
                    </div>
                  </AuthComponent>
                </div>
              ) : !this.state.Loading && <NoData />}
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
