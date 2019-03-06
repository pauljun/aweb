import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import {BusinessProvider}from 'src/utils/Decorator/BusinessProvider'
import { Spin } from 'antd'
import NoData from 'src/components/NoData/index'
import ModuleWrapper from '../components/ModuleWrapper';
import ListView from '../components/List'
import SearchViewNew from './searchNew'
import BackTopComponent from '../../BusinessComponent/BackToTop/'
import LogsComponent from 'src/components/LogsComponent';
import getTimeRange from '../components/SearchGroupNew/timeRadioUtil';

@LogsComponent()
@withRouter
@BusinessProvider('vehicleStore') 
@observer
class VehicleView extends Component {

  state = {
    loading: true,
    list: [],
    total: 0,
    timeRadio: 3,
    searchValue: '',
  }

  timeRadio = 3

  baselibType='vehicle'

  componentDidMount() {
    this.handleReload();
    const { vehicleStore } = this.props;
    vehicleStore.getImgStyle(this.baselibType)
  }
  
  // 路由跳转
  jumpUrl = (data) => {
    const { TabStore, history } = this.props;
    TabStore.goPage({
      moduleName: 'baselib',
      childModuleName: 'imgSearch',
      history,
      data
    })
  }

  // 查看车辆详情
  openDiaDetail = (item, k) => {
    const { TabStore, history } = this.props;
    const searchData = Object.assign({}, toJS(this.props.vehicleStore.searchData))
    const moduleName = 'Detail';
    const childModuleName = 'DataRepositoryVehicleDetail'
    const list = this.state.list
    const data = {
      item,
      //list,
      idx: k,
      searchData,
      baselibType:'vehicleStore'
    }
    TabStore.goPage({ moduleName, childModuleName, history, state: data });
  }

  // 查询列表
  handleSearch = async (options={}) => {
    const { vehicleStore } = this.props;
    if(Object.keys(options).length){
      await vehicleStore.editSearchData(options);
    }
    this.setState({ loading: true });
    const { list, total } = await vehicleStore.getList(this.baselibType);
    this.setState({ 
      loading: false,
      list,
      total
    })
  }
  
  // 刷新列表
  handleReload = (options={}, clearSearchValue) => {
    const timeRadio = this.timeRadio;
    const timeRange = timeRadio === 2 ? {} : getTimeRange(timeRadio);
    const serachData = Object.assign({}, options, timeRange, {page: 1})
    this.handleSearch(serachData)
    if(clearSearchValue){
      this.setState({
        searchValue: ''
      })
    }
  }

  // 翻页事件
  handlePageChange = (page, pageSize, type) => {
    this.handleSearch({ pageSize, page })
  }

  handleSearchChange = (e) => {
    this.setState({
      searchValue: e.target.value
    })
  }

  // 设置时间radio值
  setTimeRadioValue = (timeRadio, callback) => {
    // 直接用this.timeRadio 解决 state 更新不及时导致请求参数 不正确的bug
    this.timeRadio = timeRadio;
    // state.timeRadio 用来刷新页面
    this.setState({
      timeRadio
    }, () => callback&&callback())
  }

  handleDateChange = (options) => {
    const { vehicleStore } = this.props;
    vehicleStore.editSearchData(options)
  }

  // 设置图片显示样式
  handleImgStyleChange = (value) => {
    const { vehicleStore } = this.props;
    vehicleStore.setImgStyle(this.baselibType, value)
  }

  render() {
    const { vehicleStore, history } = this.props;
    const { loading, total, list, timeRadio, searchValue } = this.state;
    const { pageSize, page } = vehicleStore.searchData || {};

    return (
      <ModuleWrapper
        title='车辆图库'
        total={total}
        current={page}
        pageSize={pageSize}
        onReload={this.handleReload}
        // searchValue={searchValue}
        // onSearchChange={this.handleSearchChange}
        // onSearch={(plateNo) => this.handleReload({plateNo})}
        // placeholder='请输入车牌号'
        onPageChange={this.handlePageChange}
        imgStyle={vehicleStore.imgStyle}
        onImgStyleChange={this.handleImgStyleChange}
      >
        <SearchViewNew 
          search={this.search} 
          history={history}
          searchDataChange={this.handleReload} 
          timeRadioValue={timeRadio}
          handleDateChange={this.handleDateChange}
          setTimeRadioValue={this.setTimeRadioValue}
          searchValue={searchValue}
          onSearchChange={this.handleSearchChange}
          onSearch={(plateNo) => this.handleReload({plateNo})}
          placeholder='请输入车牌号搜索'
        />
        <BackTopComponent>
          <Spin spinning={loading}>
          {(!!(list && list.length) || loading)
            ? <ListView
                imgStyle={vehicleStore.imgStyle}
                type={this.baselibType} 
                listData={list} 
                current={page}
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

export default VehicleView
