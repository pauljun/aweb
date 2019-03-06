import React, { Component } from 'react';
import { Tabs } from 'antd';
import RightTabPart from '../../components/PersonManage/RightTabPart/index';
import AlarmHeadSearch from '../../../PersonnelControl/Components/alarm/components/alarmHeaderSearch';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import CommunityShowLeft from '../../components/PersonManage/CommunityShowLeft/index';
import { withRouter } from 'react-router-dom';
import Socket from '../../../../libs/Socket';
import { observer } from 'mobx-react';
import LogsComponent from 'src/components/LogsComponent';

import './index.scss';

const TabPane = Tabs.TabPane;

@LogsComponent()
@withRouter
@BusinessProvider('LongLivedStore', 'CommunityEntryStore', 'TabStore')
@observer
class LongLivedPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIf: true,
      activeKey: '1',
      longLoading: true,
      specLoading:true,
      LongLiveList: [],
      RegisUnappList: [],
      total: 0,
      UnAppearTotal: 0,
      choseId: undefined,
      popOne: false,
      popTwo: false,
      id: Math.random()
    };
    this.initData();
  }
  /**监听标签及关注变化 */
  initData() {
    Socket.on('updateTag', this.updateState);
    Socket.on('updateAttention', this.updateState);
  }
  componentWillUnmount() {
    Socket.off('updateTag', this.updateState);
    Socket.off('updateAttention', this.updateState);
  }
  updateState = () => {
    setTimeout(() => {
      this.UpdateAttentionAndTag()
    },100)
  }
   /**更新标签与关注状态 */    
   UpdateAttentionAndTag = () => {
    let { activeKey } = this.state;
    let { LongLivedStore } = this.props;
    if (activeKey == 1) {
      LongLivedStore.getListPersonalInformation(
        LongLivedStore.searchOption
      ).then(res => {
        this.setState({
          LongLiveList: res.list
        });
      });
    } else {
      LongLivedStore.getListPersonalInformation(
        LongLivedStore.searchOptionUnappear
      ).then(res => {
        this.setState({
          RegisUnappList: res.list
        });
      });
    }
  }; 
  /**请求人口列表数据 */
  requestData = show => {
    const { LongLivedStore } = this.props;
    if (!show) {
      LongLivedStore.initSearchData(1);
    }
    this.setState({
      longLoading: true
    });
    LongLivedStore.getListPersonalInformation(LongLivedStore.searchOption).then(
      res => {
        this.setState({
          LongLiveList: res.list,
          total: res.total,
          longLoading: false
        });
      }
    );
  };
  requestUnappear = show => {
    const { LongLivedStore } = this.props;
    if (!show) {
      LongLivedStore.initSearchData(2);
    }
    this.setState({
      specLoading: true
    });
    LongLivedStore.getListPersonalInformation(
      LongLivedStore.searchOptionUnappear
    ).then(res => {
      this.setState({
        RegisUnappList: res.list,
        UnAppearTotal: res.total,
        specLoading: false
      });
    });
  };
  FreShen = () => {
    this.requestData(true);
    this.requestUnappear(true);
  };
  onTopTypeChange = option => {
    const { LongLivedStore } = this.props;
    const { activeKey } = this.state;
    if (activeKey == 1) {
      LongLivedStore.editSearchData({ pageSize: option.pageSize, page: 1 }, 1);
      this.requestData(true);
    } else {
      LongLivedStore.editSearchData({ pageSize: option.pageSize, page: 1 }, 2);
      this.requestUnappear(true);
    }
  };
  
  onChange = (currentPage, pageSize) => {
    const { LongLivedStore } = this.props;
    const { activeKey } = this.state;
    if (activeKey == 1) {
      LongLivedStore.editSearchData(
        { page: currentPage, pageSize: pageSize },
        1
      );
      this.requestData(true);
    } else {
      LongLivedStore.editSearchData(
        { page: currentPage, pageSize: pageSize },
        2
      );
      this.requestUnappear(true);
    }
  };
  HandleNoVillageData = () => {
    this.setState({
      LongLiveList: [],
      RegisUnappList: []
    });
  };
  handleTableKey = key => {
    if(key)
    {this.setState({
      activeKey: key,
      popOne: false,
      popTwo: false
    })} else {
      this.setState({
        popOne: false,
        popTwo: false
      })
    }
  };
  /**社区总览跳转小区处理 */
  componentDidMount() {
    const { LongLivedStore, CommunityEntryStore } = this.props;
    LongLivedStore.initImgandVal();
    LongLivedStore.initSearchData(1);
    LongLivedStore.initSearchData(2);
    const id = this.props.location.search.substring(4, 40);
    if (id.length > 0) {
      LongLivedStore.editSearchData({ villageIds: [id] }, 1);
      LongLivedStore.editSearchData({ villageIds: [id] }, 2);
      this.setState({
        choseId: id,
        selectIf: false
      });
     this.requestData(true);
     this.requestUnappear(true);
    } else {
      this.requestData();
      this.requestUnappear();
    }
  }
  handleSelctId = () => {
    this.setState({
      id: Math.random(),
      value: ''
    });
    this.props.LongLivedStore.deleteImgAndVal(1, 1);
    this.props.LongLivedStore.deleteImgAndVal(2, 1);
  };
  /**处理日期选择框是否显示的问题 */
  handlePopShow = type => {
    let { activeKey } = this.state;
    if (activeKey == 1) {
      if (type) {
        this.setState({
          popOne: true
        });
      } else {
        this.setState({
          popOne: false
        });
      }
    } else {
      if (type) {
        this.setState({
          popTwo: true
        });
      } else {
        this.setState({
          popTwo: false
        });
      }
    }
  };
  render() {
    const {selectIf,activeKey,LongLiveList,total,id,choseId,RegisUnappList,
      UnAppearTotal,popOne,popTwo} = this.state;
    const searchData =
      activeKey == 1
        ? this.props.LongLivedStore.searchOption
        : this.props.LongLivedStore.searchOptionUnappear;
    return (
      <div className="community_long_lived_alarm_box">
        <div className="community_left_total">
          <CommunityShowLeft
            handleSelctId={this.handleSelctId}
            type={2}
            HandleNoVillageData={this.HandleNoVillageData}
            requestData={this.requestData}
            requestUnappear={this.requestUnappear}
            choseId={choseId}
            selectIf={selectIf}
          />
        </div>
        <div className="community_right_container">
          <AlarmHeadSearch
            searchData={searchData}
            total={activeKey == 1 ? total : UnAppearTotal}
            onTypeChange={this.onTopTypeChange}
            onChange={this.onChange}
            search={this.FreShen}
          />
          <Tabs type="card" onChange={this.handleTableKey}>
            <TabPane tab="常住居民" key="1">
              <RightTabPart
                LongLiveList={LongLiveList}
                id={id}
                activeKey={activeKey}
                total={total}
                requestData={this.requestData}
                longLoading={this.state.longLoading}
                onChange={this.onChange}
                type={true}
                popOne={popOne}
                handlePopShow={this.handlePopShow}
                handleTableKey={this.handleTableKey}
              />
            </TabPane>
            <TabPane tab="疑似已迁出" key="2">
              <RightTabPart
                RegisUnappList={RegisUnappList}
                id={id}
                activeKey={activeKey}
                total={UnAppearTotal}
                requestUnappear={this.requestUnappear}
                specLoading={this.state.specLoading}
                onChange={this.onChange}
                type={false}
                popTwo={popTwo}
                handlePopShow={this.handlePopShow}
                handleTableKey={this.handleTableKey}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default LongLivedPerson;
/* AttentionHandle = option => {
    let { activeKey, LongLiveList, RegisUnappList } = this.state;
    if (activeKey == 1) {
      let Index = LongLiveList.findIndex(v => v.id == option.peopleId);
      let SelectData = Object.assign({}, LongLiveList[Index], {
        focusType: option.isDeleted ? 0 : 1
      });
      LongLiveList.splice(Index, 1, SelectData);
      this.setState({
        LongLiveList
      });
    } else {
      let Index = RegisUnappList.findIndex(v => v.id == option.peopleId);
      let SelectData = Object.assign({}, RegisUnappList[Index], {
        focusType: option.isDeleted? 0 : 1
      });
      RegisUnappList.splice(Index, 1, SelectData);
      this.setState({
        RegisUnappList
      });
    }
  };
  UpdateTag = option => {
    let { LongLiveList, RegisUnappList, activeKey } = this.state;
    if (activeKey == 1) {
      let Index = LongLiveList.findIndex(v => v.id == option.details.id);
      let data = Object.assign({}, LongLiveList[Index], {
        tagList: option.peopleTags.filter(v => v.isDeleted == false)
      });
      LongLiveList.splice(Index, 1, data);
      this.setState({
        LongLiveList
      });
    } else {
      let Index = RegisUnappList.findIndex(v => v.id == option.details.id);
      let data = Object.assign({}, RegisUnappList[Index], {
        tagList: option.peopleTags.filter(v => v.isDeleted == false)
      });
      RegisUnappList.splice(Index, 1, data);
      this.setState({
        RegisUnappList
      });
    }
  }; */
