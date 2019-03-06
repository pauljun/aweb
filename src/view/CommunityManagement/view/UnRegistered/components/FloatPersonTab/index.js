import React from 'react';
import { Spin, Tooltip,message } from 'antd';
import AddAndchangeTag from '../../../../components/PersonManage/AddAndChangeTag/index'
import AlarmHeaderFilter from '../../../../components/PersonManage/TopSelect/alarmHeaderFilter';
import { stopPropagation } from 'src/utils/index'
//import Upload1 from '../../../../components/PersonManage/UploadInput/index';
import Upload from '../../../../../../components/UploadInput/index';
import CommunityCard from '../RegisButNoCard/index';
import { withRouter } from 'react-router-dom';
import Pagination from '../../../../../../components/Pagination/index';
import { observer } from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import ModalComponent from '../../../../../../components/ModalView/index';
import NoData from '../../../../../../components/NoData/index';

@withRouter
@BusinessProvider('FloatPersonStore', 'CommunityEntryStore', 'TabStore')
@observer
export default class FloatPersonTab extends React.Component {
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
  /**条件筛选 */
  onTypeChange = option => {
    let { activeKey } = this.props;
    if (activeKey == 1) {
      this.props.requestData(true);
    }
    if (activeKey == 2) {
      this.props.requestDataExist(true);
    }
  };
  /**监听页面滚动高度 */
  componentWillMount() {
    window.addEventListener(
      'scroll',
      () => {
        let el = this.refs.backone;
        let em = this.refs.backtwo;
        let scrollTop = el ? el.scrollTop : 0;
        let scrollTopTwo = em ? em.scrollTop : 0;
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
  /**返回顶部 */
  backTop = type => {
    let el = this.refs.backone;
    let em = this.refs.backtwo;
    if (type == 0) {
      el.scrollTop = 0;
    } else {
      em.scrollTop = 0;
    }
  };
  getFeature = feature => {
    const { activeKey } = this.props;
    const { FloatPersonStore } = this.props;
    if (activeKey == 1) {
      FloatPersonStore.editSearchData({ faceFeature: feature }, 1);
    } else {
      FloatPersonStore.editSearchData({ faceFeature: feature }, 2);
    }
  };
  /**详情跳转 */
  handlePageJump = data => {
    const { TabStore, history } = this.props;
    const moduleName = 'Detail';
    const childModuleName = 'CommunityFlowDetail';
    const state = { data };
    TabStore.goPage({ moduleName, childModuleName, history, state });
    this.props.handleTableKey();
  };
  deleteImg = type => {
    const { activeKey } = this.props;
    const { FloatPersonStore } = this.props;
    if (activeKey == 1) {
      FloatPersonStore.editSearchData(
        { faceFeature: null, fuzzyContent: null, page: 1 },
        1
      );
    } else {
      FloatPersonStore.editSearchData(
        { faceFeature: null, fuzzyContent: null, page: 1 },
        2
      );
    }
    if (!type) {
      this.onTypeChange();
    }
  };
  onTypeChangeAnother = () => {
    const { activeKey } = this.props;
    const { FloatPersonStore } = this.props;
    if (activeKey == 1) {
      FloatPersonStore.editSearchData({ page: 1 }, 1);
    } else {
      FloatPersonStore.editSearchData({ page: 1 }, 2);
    }
    this.onTypeChange();
  };
  onChange = (currentPage, pageSize) => {
    this.props.onChange && this.props.onChange(currentPage, pageSize);
  };
  onOk = (e) => {
    let {peopleId,focus}=this.state;
    this.props.CommunityEntryStore.UpdatePeopleFocusById({vid:peopleId,isDeleted:!focus}).then(() => {
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
  /**接收标签信息*/
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
    }),50)
  }
  onCancelTag = () => {
    this.setState({
      tipVisible:false
    })
  }
  handleModalShow = (type,id,e) => {
    stopPropagation(e);
    this.setState({
     focus:!type,
      visible:true,
      peopleId:id
    })
  }
  render() {
    let {realLoading,floatLoading,activeKey,UnLongExistList,id,total,NewFaceList,
         type,popOne,popTwo,handlePopShow} = this.props;
         let {personnelList,behaviorList,personvalue,actionvalue}=this.state;
    const searchData =
      activeKey == 1
        ? this.props.FloatPersonStore.FloatsearchOption
        : this.props.FloatPersonStore.FloatsearchOptionUnappear;
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
            <div className="float-community-unregistered">
              <AlarmHeaderFilter
                popTwo={popTwo}
                handlePopShow={handlePopShow}
                onTypeChange={this.onTypeChange}
                activeKey={activeKey}
                id={id}
                type={1}
              />
               <Upload
                getFeature={this.getFeature}
                deleteImg={this.deleteImg}
                search={this.onTypeChangeAnother}
                activeKey={activeKey}
                isCover={false}
                Loadtype={2}
                />
            </div>
            <div className="float-communty-tab-scroll-unregister" ref="backtwo">
              {UnLongExistList && UnLongExistList.length > 0 ? (
                <Spin spinning={realLoading} size="large">
                  <div className="query-backTop">
                    {UnLongExistList.map((v, i) => (
                      <CommunityCard
                      handleTagModal={this.handleTagModal}
                        data={v}
                        handlePageJump={this.handlePageJump.bind(this, v)}
                        key={i}
                        handleModalShow={this.handleModalShow}
                      />
                    ))}
                    {[1, 2, 3, 4].map((v, i) => (
                      <div key={i} className="filling-community" />
                    ))}
                    <div className="community-footer-page">
                      <Pagination
                        total={total}
                        onChange={this.onChange}
                        onShowSizeChange={this.onChange}
                        current={searchData.page}
                        pageSize={searchData.pageSize}
                        pageSizeOptions={['24', '36', '48', '72', '96']}/>
                    </div>
                  </div>
                </Spin>
              ) : (
                <React.Fragment>
                  {realLoading ? (
                    <div style={{ position: 'absolute', left: '48%', top: '23%' }}>
                      <Spin size="large" />
                    </div>
                  ) : (
                   <NoData />
                  )}
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="float-community-unregistered">
              <AlarmHeaderFilter
                popOne={popOne}
                handlePopShow={handlePopShow}
                onTypeChange={this.onTypeChange}
                activeKey={activeKey}
                type={1}
                id={id}/>
              <Upload
                getFeature={this.getFeature}
                deleteImg={this.deleteImg}
                search={this.onTypeChangeAnother}
                activeKey={activeKey}
                isCover={false}
                Loadtype={1}
                />
            </div>
            <div className="float-communty-tab-scroll-unregister" ref="backone">
              {NewFaceList && NewFaceList.length > 0 ? (
                <Spin spinning={floatLoading} size="large">
                  <div className="query-backTop">
                    {NewFaceList.map((v, i) => (
                      <CommunityCard
                      handleTagModal={this.handleTagModal}
                        key={i}
                        data={v}
                        handlePageJump={this.handlePageJump.bind(this, v)}
                        handleModalShow={this.handleModalShow}
                      />
                    ))}
                    {[1, 2, 3, 4].map((v, i) => (
                      <div key={i} className="filling-community" />
                    ))}
                    <div className="community-footer-page">
                      <Pagination
                        total={total}
                        onChange={this.onChange}
                        onShowSizeChange={this.onChange}
                        current={searchData.page}
                        pageSize={searchData.pageSize}
                        pageSizeOptions={['24', '36', '48', '72', '96']}/>
                    </div>
                  </div>
                </Spin>
              ) : (
                <React.Fragment>
                  {floatLoading ? (
                    <div style={{ position: 'absolute', left: '48%', top: '23%' }}>
                      <Spin size="large" />
                    </div>
                  ) : (
                    <NoData />
                  )}
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
        personType={true}
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
