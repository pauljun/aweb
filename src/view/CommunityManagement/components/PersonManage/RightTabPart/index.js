import React from 'react';
import { Tooltip, Spin,message,Modal } from 'antd';
import { observer } from 'mobx-react';
import AlarmHeaderFilter from '../../PersonManage/TopSelect/alarmHeaderFilter';
import Upload from '../../../../../components/UploadInput/index';
import CommunityCard from '../../PersonManage/CommunityCard/index';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import Pagination from '../../../../../components/Pagination/index';
import NoData from '../../../../../components/NoData/index';
import { withRouter } from 'react-router-dom';
import { stopPropagation } from 'src/utils/index'
import ModalComponent from '../../../../../components/ModalView/index';
import AddAndchangeTag from '../AddAndChangeTag/index'

@BusinessProvider('LongLivedStore', 'CommunityEntryStore', 'TabStore')
@withRouter
@observer
export default class RightTabPart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTopOne: false,
      showTopTwo: false,
      visible:false,
      focus:false,
      tipVisible:false,
      personnelList:[],
      behaviorList:[],
      personvalue:'',
      actionvalue:'',
      id:Math.random(),
      datails:{},
      peopleId:'',
    };
  }
  /**条件查询列表 */
  onTypeChange = option => {
    let { activeKey } = this.props;
    if (activeKey == 1) {
      this.props.requestData(true);
    }
    if (activeKey == 2) {
      this.props.requestUnappear(true);
    }
  };
  handlePageJump = data => {
    const { TabStore, history,activeKey} = this.props;
    const moduleName = 'Detail';
    const childModuleName = 'CommunityResidenceDetail';
    this.props.handleTableKey();
   if(activeKey==1)
    {const state = { data,type:true};
    TabStore.goPage({ moduleName, childModuleName, history, state });}
    else {
      const state = { data,type:false};
      TabStore.goPage({ moduleName, childModuleName, history, state });
    }
  };
  /**原生监听页面滚动高度 */
  componentWillMount() {
    window.addEventListener(
      'scroll',
      () => {
        let ell = this.refs.backonereal;
        let eml = this.refs.backtworeal;
        let scrollTop = ell ? ell.scrollTop : 0;
        let scrollTopTwo = eml ? eml.scrollTop : 0;
        if (scrollTop > 1000) {
          !this.state.showTopOne &&
            this.setState({
              showTopOne: true
            });
        } else {
          this.state.showTopOne &&
            this.setState({
              showTopOne: false
            });
        }
        if (scrollTopTwo > 1000) {
          !this.state.showTopTwo &&
            this.setState({
              showTopTwo: true
            });
        } else {
          this.state.showTopTwo &&
            this.setState({
              showTopTwo: false
            });
        }
      },
      true
    );
  }
  /**获取图片结构化信息 */
  getFeature = feature => {
    const { activeKey } = this.props;
    const { LongLivedStore } = this.props;
    if (activeKey == 1) {
      LongLivedStore.editSearchData({ faceFeature: feature }, 1);
    } else {
      LongLivedStore.editSearchData({ faceFeature: feature }, 2);
    }
  };
  deleteImg = type => {
    const { activeKey } = this.props;
    const { LongLivedStore } = this.props;
    if (activeKey == 1) {
      LongLivedStore.editSearchData(
        { faceFeature: null, fuzzyContent: null, page: 1 },
        1
      );
    } else {
      LongLivedStore.editSearchData(
        { faceFeature: null, fuzzyContent: null, page: 1 },
        2
      );
    }
    if (!type) {
      this.onTypeChange();
    }
  };
  /**返回顶部 */
  backTop = type => {
    let ell = this.refs.backonereal;
    let eml = this.refs.backtworeal;
    if (type == 0) {
      ell.scrollTop = 0;
    } else {
      eml.scrollTop = 0;
    }
  };
  /**以图搜图搜索 */
  onTypeChangeAnother = () => {
    const { activeKey } = this.props;
    const { LongLivedStore } = this.props;
    if (activeKey == 1) {
      LongLivedStore.editSearchData({ page: 1 }, 1);
    } else {
      LongLivedStore.editSearchData({ page: 1 }, 2);
    }
    this.onTypeChange();
  };
  onChange = (currentPage, pageSize) => {
    this.props.onChange && this.props.onChange(currentPage, pageSize);
  };
  onOk = (e) => {
   let {peopleId,focus}=this.state;
   this.props.CommunityEntryStore.UpdatePeopleFocusById({peopleId,isDeleted:!focus}).then(() => {
    this.setState({
      visible: false
    });
    message.info('修改关注状态成功');
   })
  };
  onCancel = (e) => {
    this.setState({
      visible: false
    });
  };
  handleModalShow = (type,id,e) => {
    stopPropagation(e);
    this.setState({
     focus:!type,
      visible:true,
      peopleId:id
    })
  }
  handleTagModal = (a,b,c,d,e,f,g) => {
    stopPropagation(g);
     this.setState({
      personnelList:a,
      behaviorList:b,
      personvalue:c,
      actionvalue:d,
      id:Math.random(),
      details:e,
    })
   setTimeout(() => this.setState({
      tipVisible:true
    }),10)
  }
  onCancelTag = () => {
    this.setState({
      tipVisible:false
    })
  }
  render() {
    let {activeKey,total,LongLiveList,RegisUnappList,id,longLoading,
      specLoading,type,handlePopShow,popOne,popTwo} = this.props;
    let {personnelList,behaviorList,personvalue,actionvalue}=this.state;
    let searchData =
    activeKey == 1
        ? this.props.LongLivedStore.searchOption
        : this.props.LongLivedStore.searchOptionUnappear;
    return (
      <React.Fragment>
        {this.state.showTopOne && (
          <Tooltip title="返回顶部">
            <div
              className="alarm-scroll-height"
              onClick={this.backTop.bind(this, 0)}
            />
          </Tooltip>
        )}
        {this.state.showTopTwo && (
          <Tooltip title="返回顶部">
            <div
              className="alarm-scroll-height"
              onClick={this.backTop.bind(this, 1)}
            />
          </Tooltip>
        )}
        {type ? (
          <React.Fragment>
            <div className="float-community">
              <AlarmHeaderFilter
                onTypeChange={this.onTypeChange}
                activeKey={activeKey}
                id={id}
                popOne={popOne}
                handlePopShow={handlePopShow}
              />
              <Upload
                getFeature={this.getFeature.bind(this)}
                search={this.onTypeChangeAnother}
                activeKey={activeKey}
                deleteImg={this.deleteImg}
                isCover={true}
                Loadtype={1}
              />
            </div>
            <div className="float-communty-tab-scroll" ref="backonereal">
              {LongLiveList && LongLiveList.length > 0 ? (
                <Spin spinning={longLoading} size="large">
                  <div className="back-top-register">
                    {LongLiveList.map((v, i) => (
                      <CommunityCard
                      handleTagModal={this.handleTagModal}
                        handleModalShow={this.handleModalShow}
                        data={v}
                        handlePageJump={this.handlePageJump.bind(this, v)}
                        key={`${v.id}-${i}`}
                      />
                    ))}
                    {[1, 2, 3, 4].map((v, i) => (<div key={i} style={{ 
                          width: '348px',
                          height: '0',
                          marginLeft: '20px'
                        }}
                      />
                    ))}
                    <div className="community-footer-page">
                      <Pagination
                        total={total}
                        onChange={this.onChange}
                        onShowSizeChange={this.onChange}
                        current={searchData.page}
                        pageSize={searchData.pageSize}
                        pageSizeOptions={['24', '36', '48', '72', '96']}
                      />
                    </div>
                  </div>
                </Spin>
              ) : (
                <React.Fragment>
                  {longLoading ? (<div style={{ position: 'absolute', left: '48%', top: '13%' }}>
                      <Spin size="large" />
                             </div>
                  ) : (<NoData />)}
                </React.Fragment>)}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="float-community">
              <AlarmHeaderFilter
                onTypeChange={this.onTypeChange}
                activeKey={activeKey}
                id={id}
                popTwo={popTwo}
                handlePopShow={handlePopShow}
                showSelsect={true}
              />
               <Upload
                getFeature={this.getFeature.bind(this)}
                search={this.onTypeChangeAnother}
                activeKey={activeKey}
                deleteImg={this.deleteImg}
                isCover={true}
                Loadtype={2}
              />
            </div>
            <div className="float-communty-tab-scroll" ref="backtworeal">
              {RegisUnappList && RegisUnappList.length > 0 ? (
                <Spin spinning={specLoading} size="large">
                  <div className="back-top-register">
                    {RegisUnappList.map((v, i) => (
                      <CommunityCard
                      handleModalShow={this.handleModalShow}
                        handleTagModal={this.handleTagModal}
                        data={v}
                        handlePageJump={this.handlePageJump.bind(this, v)}
                        key={`${v.id}-${i}`}
                        type={1}
                      />
                    ))}
                    {[1, 2, 3].map((v, i) => ( <div key={i} 
                    style={{width: '348px',height: '0',marginLeft: '20px' }}/>))}
                    <div className="community-footer-page">
                      <Pagination
                        total={total}
                        onChange={this.onChange}
                        onShowSizeChange={this.onChange}
                        current={searchData.page}
                        pageSize={searchData.pageSize}
                        pageSizeOptions={['24', '36', '48', '72', '96']}
                      />
                    </div>
                  </div>
                </Spin>
              ) : (
                <React.Fragment>
                  {specLoading ? (<div style={{ position: 'absolute', left: '48%', top: '13%' }}>
                      <Spin size="large" />
                             </div>
                  ) : (<NoData />)}
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}
        <AddAndchangeTag 
        tipVisible={this.state.tipVisible}
        personnelList={personnelList}
        behaviorList={behaviorList}
        personvalue={personvalue}
        actionvalue={actionvalue}
        onCancel={this.onCancelTag}
        key={this.state.id}
        details={this.state.details}
        />
        <ModalComponent
          visible={this.state.visible}
          onOk={this.onOk}
          onCancel={this.onCancel}
          title={this.state.focus ? '关注确认' : '取消关注确认'}
          iconType={''}
          view={
						<div>
							点击“确定”{!this.state.focus ? '取消关注' : '关注'}此人？
						</div>
					}
        />
      </React.Fragment>
    );
  }
}
