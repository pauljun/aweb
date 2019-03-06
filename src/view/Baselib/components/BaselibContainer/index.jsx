import React, { Component } from 'react';
import {withRouter}from 'react-router-dom'
import { toJS } from 'mobx';
import { Spin, message } from 'antd'
import ModuleWrapper from '../ModuleWrapper';
import ListView from '../List'
import FaceSearchView from '../../faceLibrary/searchNew';
import BodySearchView from '../../bodyLibrary/searchNew';
import NoData from '../../../../components/NoData/index'
import {BusinessProvider}from '../../../../utils/Decorator/BusinessProvider'
import BackTopComponent from '../../../BusinessComponent/BackToTop/index'
import LogsComponent from 'src/components/LogsComponent';
import getTimeRange from '../SearchGroupNew/timeRadioUtil';

const BaselibContent = [
  { type: 'face', title: '人脸图库', SearchComponent: FaceSearchView},
  { type: 'body', title: '人体图库', SearchComponent: BodySearchView},
]
const DataRepositoryChildModule = {
  face: 'DataRepositoryFaceDetail',
  body: 'DataRepositoryBodyDetail'
}

@LogsComponent()
@withRouter
@BusinessProvider('TabStore') 
export default class BaselibContainer extends Component {
  
  state = {
    loading: true,
    list: [],
    current: 1,
    total: 0,
    timeRadio: 3,
  }

  componentWillMount() {
    const { BaselibStore, location: { state } } = this.props;
    BaselibStore.initData()
    const cameraList = state && state.pageState && state.pageState.cameraList;
    if (cameraList) {
      BaselibStore.editSearchData({
        cameraIds: cameraList
      })
    }
  }

  componentDidMount() {
    this.handleReload();
    const { BaselibStore, baselibType } = this.props;
    BaselibStore.getImgStyle(baselibType);
  }
  
  // 路由跳转
  jumpUrl = (data) => {
    const { TabStore, history, BaselibStore } = this.props;
    const searchData = Object.assign({}, toJS(BaselibStore.searchData))
    TabStore.goPage({
      moduleName: 'baselib',
      childModuleName: 'imgSearch',
      history,
      state: data
    })
  }

  // 查看人体详情
  openDiaDetail = (item, k) => {
    const { TabStore, history, baselibType, BaselibStore } = this.props;
    const searchData = Object.assign({}, toJS(BaselibStore.searchData))
    const moduleName = 'Detail';
    const childModuleName = DataRepositoryChildModule[baselibType]
    const list = this.state.list
    const data = {
      item,
      list,
      idx: k,
      searchData,
      baselibType
    }
    TabStore.goPage({ moduleName, childModuleName, history, state: data });
  }

  // 获取资源总数
  getTotal = async () => {
    const { BaselibStore, baselibType } = this.props;
    const result = await BaselibStore.getTotal(baselibType);
    this.setState({
      total: result.count
    })
  }

  // 查询列表
  handleSearch = async (options={}, current=1) => {
    const { BaselibStore, baselibType } = this.props;
    await BaselibStore.editSearchData(options);
    this.setState({ loading: true });
    this.getTotal();    
    const { list } = await BaselibStore.getList(baselibType);
    this.setState({ 
      loading: false,
      list,
      current
    })
  }

  // 刷新列表 
  handleReload = (options={}) => {
    const { timeRadio } = this.state;
    const timeRange = timeRadio === 2 ? {} : getTimeRange(timeRadio);
    let pageType = 0, maxId, minId;
    const searchData = Object.assign({}, { pageType, maxId, minId }, timeRange, options)
    this.handleSearch(searchData)
  }

  // 翻页事件
  handlePageChange = (current, pageSize, type) => {
    if(type){
      const { list } = this.state;
      let pageType, minId, maxId;
      if(type === 'prev'){ // 上一页
        pageType = 1;
        maxId = list[0].id
      } else { // 下一页
        pageType = 2;
        minId = list[list.length - 1].id
      } 
      this.handleSearch({ pageSize, pageType, maxId, minId }, current)
    } else {
      this.handleReload({ pageSize });
    }
  }

  // 图片上传
  handleUpload = (file) => {
    if(!file.url) {
      return message.error('图片上传失败')
    } 
    const { baselibType } = this.props;
    const data = {
      url: escape(file.url),
      type: baselibType,
      model: baselibType === 'face' ? 11 : 1,
    }
    this.jumpUrl(data);
  }

  // 设置图片显示样式
  handleImgStyleChange = (value) => {
    const { baselibType, BaselibStore } = this.props;
    BaselibStore.setImgStyle(baselibType, value).then(res => {
      if(res){
        // 更新视图
        this.setState({})
      }
    });
  }

  // 设置时间radio值
  setTimeRadioValue = (timeRadio, callback) => {
    this.setState({
      timeRadio
    }, () => callback&&callback())
  }

  handleDateChange = (options) => {
    const { BaselibStore } = this.props;
    BaselibStore.editSearchData(options)
  }

  render() {
    const { BaselibStore, history, baselibType } = this.props;
    const { loading, total, list, current, timeRadio } = this.state;
    const { pageSize } = BaselibStore.searchData || {};
    const { title, SearchComponent } = BaselibContent.find(v => v.type === baselibType);
    return (
      <ModuleWrapper
        title={title}
        total={total}
        current={current}
        pageSize={pageSize}
        onReload={this.handleReload}
        // onUpload={this.handleUpload}
        onPageChange={this.handlePageChange}
        imgStyle={BaselibStore.imgStyle}
        onImgStyleChange={this.handleImgStyleChange}
      >
        <SearchComponent 
          timeRadioValue={timeRadio}
          setTimeRadioValue={this.setTimeRadioValue}
          handleDateChange={this.handleDateChange}
          searchDataChange={this.handleReload} 
          history={history}
          onUpload={this.handleUpload}
        />
        <BackTopComponent>
          <Spin spinning={loading}>
            {((list && list.length) || loading) 
              ? <ListView 
                  imgStyle={BaselibStore.imgStyle}
                  type={baselibType} 
                  listData={list} 
                  searchData={BaselibStore.searchData}
                  current={current}
                  pageSize={pageSize}
                  total={total}
                  onPageChange={this.handlePageChange}
                  openDiaDetail={this.openDiaDetail}
                /> 
              : <NoData />
            }  
          </Spin>
        </BackTopComponent>
      </ModuleWrapper>
    )
  }
}
