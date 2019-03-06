import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {BusinessProvider}from 'src/utils/Decorator/BusinessProvider'
import NoData from 'src/components/NoData/index'
import { withRouter } from 'react-router-dom';
import { 
  escapeUrl as Util_escapeUrl
} from 'src/utils'
import { Spin, message } from 'antd';
import SearchView from './search';
import ListView from '../components/List'
import RightHeader from './RightHeader';
import './index.scss'
import LogsComponent from 'src/components/LogsComponent';
import BackTopComponent from '../../BusinessComponent/BackToTop/index'

@LogsComponent()
@withRouter
@BusinessProvider('imgSearchStore')
@observer
class ImgSearchView extends Component{

	state = {
		loading: false,
    list:[], // 所有图片集合
    total: 0, // 图片总数
		checkList:[], // 选中图片id集合
		isCheckAll: false, // 全选状态
    ischeckInverse: false, // 反选状态
    showSwitch: true, // 显示人脸人体切换按钮
	}
  checkedIds = []; // 

	componentWillMount(){
    const { imgSearchStore, location } = this.props;
    const pageState = location.state && location.state.pageState;
    this.suffix = location.pathname.split('/')[1];
    if(pageState){
      let { type, url, model, id, feature } = pageState;
      if(type){
        url = unescape(Util_escapeUrl(url, false)); 
        // this.setState({ showSwitch: false })
        this.type = type;
        let searchDataOptions = { type }
        if(pageState.startTime && pageState.endTime){
          searchDataOptions.startTime = pageState.startTime
          searchDataOptions.endTime = pageState.endTime
        }
        this.pageState = pageState
        imgSearchStore.editSearchData(searchDataOptions)
        switch (model*1) {
          case 1:			//根据人体url搜图
            this.getFeature({ url }, 'bodyUrl')
            break;
          case 2:			//人体带id, (人体以图搜图， 关联人体查询)
            this.getFeature({ id }, 'bodyId');
            break;
          case 11:		//根据人脸url搜图
            this.getFeature({ url }, 'faceUrl')
            break;
          case 12:		//人脸带特征值查询
            imgSearchStore.editSearchData({ url, feature })
            this.handleSearch()
            break;
          case 13:		//人脸带id, (人脸以图搜图， 关联人脸查询)
            this.getFeature({ id }, 'faceId')
            break;
          default:
            break;
        }
      }
    }
  }
  
  componentDidMount() {
    const { imgSearchStore } = this.props;
    imgSearchStore.getImgStyle()
  }

  // 设置图片显示样式
  handleImgStyleChange = (value) => {
    const { imgSearchStore } = this.props;
    imgSearchStore.setImgStyle(value)
  }

	// 根据url或者id提取人脸人体特征
  // options: { id, url }, type: face, body
  getFeature = async (options, type) => {
    this.setState({ loading: true });
    const { imgSearchStore } = this.props;
    const params = options['id'] || options['url'];
    const funcName = {
      faceId: 'getFaceFeatureById',
      faceUrl: 'getFaceFeatureByUrl',
      bodyId: 'getBodyFeatureById',
      bodyUrl: 'getBodyFeatureByUrl',
    }
    const feature = await imgSearchStore[funcName[type]](params);
    if(feature){
      this.handleSearch();
    } else {
      this.setState({ list: [], total: 0, loading: false })
    }
  }

	/**上传图片 */
	uploadDone = url => {
    if(url){
      const { type } = this.props.imgSearchStore.searchData;
      this.getFeature({ url }, `${type}Url`);
    }else{
      this.setState({ list: [], total: 0 })
    }
	}

	// 搜索 refresh： true: 跳转第一页搜索， false: 保持当前页码
	handleSearch = (refresh=true) => {
    const { imgSearchStore } = this.props;
    const { searchData } = imgSearchStore;
		if (searchData.url && searchData.feature && searchData.feature.length>0) {
      this.setState({ loading:true })
      if(refresh){ // 刷新从第一页开始搜索
        this.searchDataChange({ current:1 })
      }
			imgSearchStore.getImgSearchList().then(({ list, total}) => {
				this.setState({
          loading:false,
          list,
          total
				})
			})
		}else{
			message.error('请上传具有人脸或人体特征的图片！')
		}
	}

	// 查看人脸详情
	openDiaDetail = (item, k) => {
		const { TabStore, history, imgSearchStore } = this.props;
    const searchData = Object.assign({}, imgSearchStore.searchData)
    const moduleName = 'Detail';
    const childModuleName = 'DataRepositoryimgSearchDetail'
		const list = this.state.list
		const uploadImgUrl = searchData.url
		const type = searchData.type
    const data = {
      item,
      list,
      idx: k,
      searchData,
			uploadImgUrl,
			type
    }
    console.log(searchData, '155555')
    TabStore.goPage({ moduleName, childModuleName, history, state: data });
	}

	// 搜索条件选择
	searchDataChange = (options) => {
		return this.props.imgSearchStore.editSearchData(options)
  }

	// 生成轨迹
	setTraject = () => {
    let hadCheckedList = [];
    const { list } = this.state;
		if (!this.checkedIds || !this.checkedIds.length){
			message.warning('请选择需要生成轨迹的图片！')
			return
		}
		// this.checkedIds = this.filterData(this.checkedIds)
		this.checkedIds.map( v => {
			let arr = list.filter( v1 => v1.id === v)
			arr.map(v1 => {
				v1.longitude = parseFloat(v1.longitude)
				v1.latitide = parseFloat(v1.latitide)
				hadCheckedList.push(v1)
				return v1
			})
			return v
		})
		// 路由跳转 --- 生成轨迹页面
		const { history, TabStore } = this.props;
    const moduleName = 'Detail';
		const childModuleName = 'DataRepositoryimgTrajectory'
		const type = this.props.imgSearchStore.searchData.type
    const data = {
			list: hadCheckedList,
			type
    }
    TabStore.goPage({ moduleName, childModuleName, history, state: data });
	}
	
	// 对选中的数据进行过滤,去掉数据中经度纬度不同时存在的数据
	filterData = (data) => {
    return data.filter(v => v.latitide && v.longitude)
	}

	//	复选框改变事件（选中列表删除事件）
	checkedChange = values => {
    this.checkedIds = values
		this.setState({
      checkList: values
    })
		this.changeCheckAllState();
  }
  
  // 获取当前页面的所有id
  getCurrentPageIds = (listData) => {
    if(!listData){
      const { list } = this.state;
      const { current, pageSize } =this.props.imgSearchStore.searchData;
      listData = this.getListData(list, current, pageSize)
    }
    const data = this.filterData(listData);
    const currentPageIds = data.map(v => v.id);
    return currentPageIds;
  }
	// 计算全选状态
	changeCheckAllState = (currentPageIds) => {
    currentPageIds = currentPageIds ? currentPageIds : this.getCurrentPageIds();
		let flag = true
		currentPageIds.every(item => {
			if(this.checkedIds.indexOf(item) === -1){
        flag = false
        return false
      }
      return true
		})
    this.setState({
      isCheckAll: flag
    })
	}

  // 全选（当前页的全选）
	checkAll = (listData, e) => {	
    let currentPageIds = this.getCurrentPageIds(listData);
    let isCheckAll;
		//筛选
		if(e.target.checked){// 选中 合并数组
			currentPageIds.forEach(item => {
				if(this.checkedIds.indexOf(item) === -1){
					this.checkedIds.push(item)
				}
			})
      isCheckAll = true
		}else{
			for(let i = this.checkedIds.length - 1; i >= 0; i--){
				if(currentPageIds.indexOf(this.checkedIds[i]) !== -1){
					this.checkedIds.splice(i, 1)
				}
      }
      isCheckAll = false
		}
		let checkedIds = [].concat(this.checkedIds)
		this.setState({
      checkList: checkedIds,
      isCheckAll
		})
	}

  // 反选（当前页的反选）
	checkInverse = (listData) => {
    let checkedIdsShould = [];
    const currentPageIds = this.getCurrentPageIds(listData);
		currentPageIds.forEach(item => {
			if(this.checkedIds.indexOf(item) === -1){
				checkedIdsShould.push(item)
			}
		})
		for(let i = this.checkedIds.length - 1; i >= 0; i--){
			if(currentPageIds.indexOf(this.checkedIds[i]) !== -1){
				this.checkedIds.splice(i,1)
			}
		}
		this.checkedIds = this.checkedIds.concat(checkedIdsShould)
		let checkList = [].concat(this.checkedIds)
		this.setState({
			checkList
		})
		this.changeCheckAllState(currentPageIds)
	}

  // 切换搜图类型
	changeType = type => {
		this.props.imgSearchStore.editSearchData({
			type
		})		
  }
  
  // 获取展示列表数据
  getListData = (list, current, pageSize) => {
    const startIdx = pageSize*(current - 1);
    const endIdx = pageSize*current;
    const listData = list.slice(startIdx, endIdx);
    return listData
  }

  // 前端分页事件
  handlePageChange = (current, pageSize) => {
    const { searchData } = this.props.imgSearchStore;
    if (pageSize !== searchData.pageSize) { // pageSize改变
      this.searchDataChange({ current: 1, pageSize })
    } 
    if (current !== searchData.current) { // 翻页事件
      this.searchDataChange({ current, pageSize })
      // 全选和反选的更改
      this.changeCheckAllState();
    }
  }

	render(){
    const { imgSearchStore } = this.props;
		let { 
      loading,
      checkList, 
      showSwitch,
      list, total, isCheckAll, ischeckInverse,
    } = this.state
    const { type, pageSize, current } = imgSearchStore.searchData;
		const listData = this.getListData(list, current, pageSize)
    return (
      <div className='c-module-wrapper img-search-wrapper'>
        <div className='module-header-warpper'>
          <div className='module-title'>以图搜图</div>
          <div className='module-header'>
            <div></div>
            <RightHeader
              total={total}
              isCheckAll={isCheckAll}
              checkAll={(e) => this.checkAll(listData, e)}
              ischeckInverse={ischeckInverse}
              checkInverse={() => this.checkInverse(listData)}
              listAll={list}
              checkList={checkList}
              openDiaDetail={this.openDiaDetail}
              setTraject={this.setTraject}
              checkedChange={this.checkedChange}
              suffix={this.suffix}
              onImgStyleChange={this.handleImgStyleChange}
              imgStyle={imgSearchStore.imgStyle}
            />
          </div>
        </div>
        <div className='module-content-wrapper'>
          <SearchView
            searchDataChange={this.searchDataChange}
						search={this.handleSearch}
						showSwitch={showSwitch}
						changeType={this.changeType}
						uploadDone={this.uploadDone}
            clearCheckList={this.checkedChange}
            pageState={this.pageState}
					/>
        <BackTopComponent>
          <Spin spinning={loading}>
              {list.length 
                ? <ListView
                    imgStyle={imgSearchStore.imgStyle}
                    listData={listData}
                    type={type}
                    checkable={true}
                    onChange={this.checkedChange}
                    openDiaDetail={this.openDiaDetail}
                    checkList={checkList}
                    searchData={imgSearchStore.searchData}
                    customPagenation={false}
                    onPageChange={this.handlePageChange}
                    current={current}
                    pageSize={pageSize}
                    total={total}
                  />
                : <NoData imgType={4} title='以图搜图资源，请在左边上传图片搜索'/>
              }
            </Spin>
        </BackTopComponent>
        </div>
      </div>
    )
	}
}

export default ImgSearchView;
