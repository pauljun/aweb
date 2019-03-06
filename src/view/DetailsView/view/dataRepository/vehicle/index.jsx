import React, { Component } from 'react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import Header from '../component/headerVehicle/index'
import DetailIMM from '../../../components/detailIMM';
import PreviousDetail from '../../../components/previousDetail';
import NextDetail from '../../../components/nextDetail';
import DetailList from '../component/detailList/index'
import NoData from 'src/components/NoData';
import { message, Spin } from 'antd'
import baselib from 'src/service/RequestUrl/baselib';
import moment from 'moment';

@withRouter
@BusinessProvider('TabStore', 'DeviceStore', 'UserStore', 'vehicleStore')
@observer
class VehicleDetail extends Component {
  constructor(props) {
    super(props);
    let { TabStore, history } = this.props;
    let pageState, searchData;
    try{
      pageState = history.location.state.pageState;
      searchData = pageState.searchData
			this.hasData = true;
		} catch(e){
			this.hasData = false
			pageState = {}
    }
    if(this.hasData){
      this.moduleStore = this.props.vehicleStore
      this.searchData = pageState.searchData
      this.getlog(pageState.item.passTime, pageState.item.deviceName)
      this.state = {
        item: pageState.item, // 当前页选中的元素
        list: [], // 传入的所有的数据
        fileData: {},
        activeIndex: pageState.idx,
        pageSize: 6,
        renderData: [],
        all: 1, // 总页数
        cur: 1, // 当前页
        loading: true
      }
    }
  }
  async componentDidMount() {
    if(this.hasData){
      let list = (await this.moduleStore.getList('vehicle', this.searchData)).list
      const { activeIndex, pageSize } = this.state
      let all = Math.ceil(list.length / pageSize)
      let cur = Math.ceil((activeIndex + 1) / pageSize)
      let startIndex = (cur - 1) * pageSize
      let endIndex = startIndex + pageSize
      let renderData = list.slice(startIndex, endIndex)
      this.setState({
        renderData,
        all,
        cur,
        list,
        loading: false
      },() => {
        // 获取视频			
        // this.getHistoryMovie(this.state.item)
      })
    }
  }
  getlog(time, cameraName) {
		let logInfo = {
			...baselib.carDetailModule,
			description: `查看点位【${cameraName}】${moment(+time).format('YYYY.MM.DD HH:mm:ss')}的车辆抓拍照片`
		};
		GlobalStore.LoggerStore.save(logInfo);
  }
  
  // 获取历史视频
  // getHistoryMovie = (item) => {
  //   let { DeviceStore } = this.props;
  //   const startTime = item.passTime / 1000 - 15;
  //   const endTime = item.passTime / 1000 + 15;
  //   let option = {
	// 		cameraId: item.deviceId,
	// 		startTime,
	// 		endTime
	// 	};
  //   DeviceStore.asyncGetHistoryVideo(option).then((item) => {
  //     let res = DeviceStore.queryCameraById(option.cameraId);
  //     let fileData = Object.assign({}, res, {
  //       historyList: item,
  //       isLiving: false,
  //       tiemRange: {
  //         startTime: startTime*1000,
	// 		    endTime: endTime*1000
  //       }
  //     });
  //     this.setState({
  //       fileData: fileData
  //     });
  //   });
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
			},() => {
        this.getlog(this.state.item.passTime, this.state.item.deviceName)
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
    },() => {
      this.getlog(this.state.item.passTime, this.state.item.deviceName)
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
      this.getlog(this.state.item.passTime, this.state.item.deviceName)
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
    const { item, list, fileData, renderData, loading } = this.state
    const { realName } = this.props.UserStore.userInfo
    return (
      <Spin spinning={loading}>
      <div className="history_alarm_detail_view">
        <Header item={item} />
        <div className="detail_imm">
          <PreviousDetail
            data={item}
            detailList={list}
            realName={realName}
            changeDetailView={this.changeDetailView} />
          <DetailIMM
            //points={points}
            data={item}
            fileData={fileData}
            type='vehicle'
            key={item.id}
          />
          <NextDetail
            data={item}
            detailList={list}
            realName={realName}
            changeDetailView={this.changeDetailView} />
        </div>
        <DetailList
          renderData={renderData}
          itemActive={item}
          changeItem={this.changeItem}
          type={'vehicle'}
          getPrePage={this.getPrePage}
          getNextPage={this.getNextPage}
        />
      </div>
      </Spin>
    )
  }
}

export default VehicleDetail;