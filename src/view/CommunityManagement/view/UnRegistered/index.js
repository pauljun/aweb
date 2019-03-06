import React, { Component } from 'react';
import { Tabs } from 'antd';
import AlarmHeadSearch from '../../../PersonnelControl/Components/alarm/components/alarmHeaderSearch';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import CommunityShowLeft from '../../components/PersonManage/CommunityShowLeft';
import { withRouter } from 'react-router-dom';
import Socket from '../../../../libs/Socket';
import { observer } from 'mobx-react';
import LogsComponent from 'src/components/LogsComponent';
import FloatPersonTab from '../UnRegistered/components/FloatPersonTab/index';

import './index.scss';

const TabPane = Tabs.TabPane;
@LogsComponent()
@withRouter
@BusinessProvider('FloatPersonStore', 'CommunityEntryStore', 'TabStore')
@observer
class FloatPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectIf: true,
      NewFaceList: [],
      UnLongExistList: [],
      activeKey: '2',
      realLoading: true,
      floatLoading:true,
      total: 0,
      anotherTotal: 0,
      choseId: undefined,
      popOne: false,
      popTwo: false,
      id: Math.random()
    };
    this.initData();
  }
  initData() {
    Socket.on('updateTag', this.ProcessHandle);
    Socket.on('updateAttention', this.ProcessHandle);
  }
  componentWillUnmount() {
    Socket.off('updateTag', this.ProcessHandle);
    Socket.off('updateAttention', this.ProcessHandle);
  }
  ProcessHandle = () => {
    setTimeout(() => {
      this.UpdateAttentionAndTag()
    },100)
  }
   /**更新标签与关注状态 */
   UpdateAttentionAndTag = () => {
    let { activeKey } = this.state;
    let { FloatPersonStore } = this.props;
    if (activeKey == 1) {
      FloatPersonStore.getListFlowFace(
        FloatPersonStore.FloatsearchOption
      ).then(res => {
        this.setState({
          NewFaceList: res.list
        });
      });
    } else {
      FloatPersonStore.getListFlowFace(
        FloatPersonStore.FloatsearchOptionUnappear
      ).then(res => {
        this.setState({
          UnLongExistList: res.list,
        });
      });
    }
  };
  requestData = show => {
    const { FloatPersonStore } = this.props;
    if (!show) {
      FloatPersonStore.initSearchData(1);
    }
    this.setState({
      floatLoading: true
    });
    FloatPersonStore.getListFlowFace(FloatPersonStore.FloatsearchOption).then(
      res => {
        this.setState({
          NewFaceList: res.list,
          total: res.total,
          floatLoading: false
        });
      }
    );
  };
  requestDataExist = show => {
    const { FloatPersonStore } = this.props;
    if (!show) {
      FloatPersonStore.initSearchData(2);
    }
    this.setState({
      realLoading: true
    });
    FloatPersonStore.getListFlowFace(
      FloatPersonStore.FloatsearchOptionUnappear
    ).then(res => {
      this.setState({
        UnLongExistList: res.list,
        anotherTotal: res.total,
        realLoading: false
      });
    });
  };
  /**刷新 */
  FreShen = () => {
    this.requestData(true);
    this.requestDataExist(true);
  };
  onTopTypeChange = option => {
    const { FloatPersonStore } = this.props;
    const { activeKey } = this.state;
    if (activeKey == 1) {
      FloatPersonStore.editSearchData(
        { page: 1, pageSize: option.pageSize },
        1
      );
      this.requestData(true);
    } else {
      FloatPersonStore.editSearchData(
        { page: 1, pageSize: option.pageSize },
        2
      );
      this.requestDataExist(true);
    }
  };
  /**pagesize筛选 */
  onChange = (currentPage, pageSize) => {
    const { FloatPersonStore } = this.props;
    const { activeKey } = this.state;
    if (activeKey == 1) {
      FloatPersonStore.editSearchData(
        { page: currentPage, pageSize: pageSize },1);
      this.requestData(true);
    } else {
      FloatPersonStore.editSearchData(
        { page: currentPage, pageSize: pageSize },2);
      this.requestDataExist(true);
    }
  };
  handleTableKey = key => {
    if(key)
   { this.setState({
      activeKey: key,
      popOne: false,
      popTwo: false
    });} else {
      this.setState({
        popOne: false,
        popTwo: false
      })
    }
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
  /**处理社区总览跳转选中小区的问题 */
  componentDidMount() {
    const { FloatPersonStore } = this.props;
    const id = this.props.location.search.substring(4, 20);
    FloatPersonStore.initImgandVal();
    FloatPersonStore.initSearchData(1);
    FloatPersonStore.initSearchData(2);
    if (id.length > 0) {
      FloatPersonStore.editSearchData({ villageIds: [id] }, 1);
      FloatPersonStore.editSearchData({ villageIds: [id] }, 2);
      this.setState({
        choseId: id,
        selectIf: false
      });
      this.requestDataExist(true);
      this.requestData(true);
    } else {
      this.requestDataExist();
      this.requestData();
    }
  }
  HandleNoVillageData = () => {
    this.setState({
      NewFaceList: [],
      UnLongExistList: []
    });
  };
  /**处理上传图片与输入的查询内容 */
  handleSelctId = () => {
    this.setState({
      id: Math.random()
    });
    this.props.FloatPersonStore.deleteImgAndVal(1, 1);
    this.props.FloatPersonStore.deleteImgAndVal(2, 1);
  };

  render() {
    const {selectIf,activeKey,NewFaceList,total,UnLongExistList = [],
      anotherTotal,choseId,id,popOne,popTwo} = this.state;
    const searchData =
      activeKey == 1
        ? this.props.FloatPersonStore.FloatsearchOption
        : this.props.FloatPersonStore.FloatsearchOptionUnappear;
    return (
      <div className="community_float_alarm_box">
        <div className="community_left_total">
          <CommunityShowLeft
            handleSelctId={this.handleSelctId}
            type={1}
            HandleNoVillageData={this.HandleNoVillageData}
            requestData={this.requestData}
            requestUnappear={this.requestDataExist}
            choseId={choseId}
            selectIf={selectIf}
          />
        </div>
        <div className="community_right_container">
          <AlarmHeadSearch
            searchData={searchData}
            total={activeKey == 1 ? total : anotherTotal}
            onTypeChange={this.onTopTypeChange}
            onChange={this.onChange}
            search={this.FreShen}
          />
          <Tabs type="card" onChange={this.handleTableKey}>
            <TabPane tab="疑似新居民" key="2">
              <FloatPersonTab
                UnLongExistList={UnLongExistList}
                total={anotherTotal}
                requestDataExist={this.requestDataExist}
                onChange={this.onChange}
                activeKey={activeKey}
                realLoading={this.state.realLoading}
                id={id}
                type={true}
                popTwo={popTwo}
                handlePopShow={this.handlePopShow}
                handleTableKey={this.handleTableKey}
              />
            </TabPane>
            <TabPane tab="新面孔" key="1">
              <FloatPersonTab
                NewFaceList={NewFaceList}
                total={total}
                requestData={this.requestData}
                onChange={this.onChange}
                activeKey={activeKey}
                floatLoading={this.state.floatLoading}
                id={id}
                type={false}
                popOne={popOne}
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
export default FloatPerson;

/* UpdateTag = option => {
    let { NewFaceList, UnLongExistList, activeKey } = this.state;
    if (activeKey == 1) {
      let Index = NewFaceList.findIndex(v => v.vid == option.details.vid);
      let data = Object.assign({}, NewFaceList[Index], {
        tagList: option.peopleTags.filter(v => v.isDeleted == false)
      });
      NewFaceList.splice(Index, 1, data);
      this.setState({
        NewFaceList
      });
    } else {
      let Index = UnLongExistList.findIndex(v => v.vid == option.details.vid);
      let data = Object.assign({}, UnLongExistList[Index], {
        tagList: option.peopleTags.filter(v => v.isDeleted == false)
      });
      UnLongExistList.splice(Index, 1, data);
      this.setState({
        UnLongExistList
      });
    }
  };
  AttentionHandle = option => {
    let { activeKey, NewFaceList, UnLongExistList } = this.state;
    if (activeKey == 1) {
      let Index = NewFaceList.findIndex(v => v.vid == option.vid);
      let SelectData = Object.assign({}, NewFaceList[Index], {
        focusType: option.isDeleted ? 0 : 1
      });
      NewFaceList.splice(Index, 1, SelectData);
      this.setState({
        NewFaceList
      });
    } else {
      let Index = UnLongExistList.findIndex(v => v.vid == option.vid);
      let SelectData = Object.assign({}, UnLongExistList[Index], {
        focusType: option.isDeleted ? 0 : 1
      });
      UnLongExistList.splice(Index, 1, SelectData);
      this.setState({
        UnLongExistList
      });
    }
  }; */
  /**请求列表数据 */