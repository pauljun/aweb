import React, { Component } from 'react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import Header from '../component/headerImgSearch/index'
import DetailIMM from '../../../components/detailIMM';
import PreviousDetail from '../../../components/previousDetail';
import NextDetail from '../../../components/nextDetail';
import DetailList from '../component/detailList/index'
import { message } from 'antd'
import NoData from 'src/components/NoData';

@withRouter
@BusinessProvider('TabStore', 'DeviceStore', 'UserStore', 'imgSearchStore')
@observer
class VehicleDetail extends Component {
  constructor(props) {
    super(props);
    let { TabStore, history } = this.props;
    let pageState, item;
    try{
      pageState = history.location.state.pageState;
      item = pageState.item
			this.hasData = true;
		} catch(e){
			this.hasData = false
			pageState = {}
    }
    if(this.hasData){
      this.moduleStore = this.props.imgSearchStore
      this.searchData = pageState.searchData
      this.state = {
        item: pageState.item, // 当前页选中的元素
        list: pageState.list, // 传入的所有的数据
        fileData: {},
        activeIndex: pageState.idx,
        pageSize: 6,
        renderData: [],
        all: 1, // 总页数
        cur: 1, // 当前页
        uploadImgUrl: pageState.uploadImgUrl, // 上传的图片url
        type: pageState.type, // 搜索的是人体还是人脸
      }
    }
  }
  static childContextTypes = {
    searchData: PropTypes.object,
	}	  
  getChildContext () {
    return {
      searchData: this.searchData
    }
  }	  
  async componentDidMount() {
    if(this.hasData){
      const { list, activeIndex, pageSize } = this.state
      // console.log(this.moduleStore,'-----------------')
      //let listAjax = (await this.moduleStore.getList('vehicle', this.searchData)).list
      // console.log(listAjax,77777777)
      let all = Math.ceil(list.length / pageSize)
      let cur = Math.ceil((activeIndex + 1) / pageSize)
      let startIndex = (cur - 1) * pageSize
      let endIndex = startIndex + pageSize
      let renderData = list.slice(startIndex, endIndex)
      this.setState({
        renderData,
        all,
        cur
      }, () => {
        // 获取视频			
        // this.getHistoryMovie(this.state.item)
      })
    }
  }
  // 获取历史视频
  // getHistoryMovie = (item) => {
  //   const time = Math.ceil(item.captureTime / 1000);
  //   const startTime = time - 15;
  //   const endTime = time + 15;
	// 	let option = {
	// 		cameraId: item.cameraId,
	// 		startTime,
	// 		endTime
	// 	};
	// 	let { DeviceStore } = this.props;
	// 	DeviceStore.asyncGetHistoryVideo(option).then((item) => {
  //     let res = DeviceStore.queryCameraById(option.cameraId);
  //     delete option.cameraId;
	// 		let fileData = Object.assign({}, res, {
	// 			historyList: item,
  //       isLiving: false,
  //       timeRange: option
	// 		});
	// 		this.setState({
	// 			fileData: fileData
	// 		})
	// 	});
	// };
  // 单击上一条或者下一条
  changeDetailView = (data, isNext) => {
    // 判断当前元素(item)是否为当前列表（listNow）渲染的元素之一
		let flag = false
		this.state.renderData.forEach(item => {
			if(item.id === data.id){
				flag = true
			}
    })
		if(flag){
			this.setState({
				item: data
			}, () => {
        // 获取视频			
			  // this.getHistoryMovie(this.state.item)
      })
		}else{
			if(isNext){
			// 点击下一个
			this.getNextPage()
			}else{
				// 点击上一个
				this.getPrePage(true)
			}
		}
  }
  // 点击改变当前选中
  changeItem = (item) => {
    this.setState({
      item
    }, () => {
      // 获取视频			
			// this.getHistoryMovie(this.state.item)
    })
  }
  // 上一页 isPreBtn---代表是点击的上一页造成的翻页，应该选中当前页的最后一个元素
  getPrePage = (isPreBtn = false) => {
    let cur = this.state.cur
    if (cur === 1) {
      message.warn('已经是第一页了')
    } else {
      this.setState({
        cur: cur - 1
      }, () => {
        this.renderPage(isPreBtn)
      })
    }
  }
  /* 展示的图片列表 */
  renderPage = (isPreBtn) => {
    let { cur, pageSize, list } = this.state
    let startIndex = (cur - 1) * pageSize;
    let endIndex = startIndex + pageSize;
    let renderData = list.slice(startIndex, endIndex);
    this.setState({
      renderData,
      item: isPreBtn === true ? renderData[renderData.length - 1] : renderData[0],
    }, () => {
      // 获取视频			
			// this.getHistoryMovie(this.state.item)
    })
  }
  // 下一页
  getNextPage = () => {
    let { cur, all } = this.state
    if (cur === all) {
      message.warn('已经是最后一页了')
    } else {
      this.setState({
        cur: cur + 1
      }, () => {
        this.renderPage()
      })
    }
  }
  render() {
    if(!this.hasData){
			return <NoData></NoData>
		}
    const { item, list, fileData, renderData, uploadImgUrl, type } = this.state
    const { realName } = this.props.UserStore.userInfo
    return (
      <div className="history_alarm_detail_view">
         <Header 
          uploadImgUrl={uploadImgUrl}
          item={item} 
          type={type}
          realName={realName}
         /> 
        <div className="detail_imm">
          <PreviousDetail
            data={item}
            type={type}
            detailList={list}
            realName={realName}
            changeDetailView={this.changeDetailView} />
          <DetailIMM
            //points={points}
            data={item}
            type={type}
            fileData={fileData}
            key={item.id}
            handleArray={['pic', 'video']} 
          />
          <NextDetail
            data={item}
            detailList={list}
            type={type}
            realName={realName}
            changeDetailView={this.changeDetailView} />
        </div>
        <DetailList
          renderData={renderData}
          itemActive={item}
          changeItem={this.changeItem}
          type={type}
          getPrePage={this.getPrePage}
          getNextPage={this.getNextPage}
          similarInfo={true}
        />
      </div>
    )
  }
}

export default VehicleDetail;