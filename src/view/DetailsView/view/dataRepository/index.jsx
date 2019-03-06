import React, { Component } from 'react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import Header from './component/header/index';
import DetailIMM from '../../components/detailIMM';
import PreviousDetail from '../../components/previousDetail';
import NextDetail from '../../components/nextDetail';
import DetailList from './component/detailList/index';
import { message, Spin } from 'antd';
import NoData from 'src/components/NoData';
import moment from 'moment';
import baselib from 'src/service/RequestUrl/baselib';

@withRouter
@BusinessProvider('TabStore', 'DeviceStore', 'UserStore', 'bodyStore', 'faceStore')
@observer
class FaceDetail extends Component {
  static childContextTypes = {
    searchData: PropTypes.object,
	}	
  getChildContext () {
    return {
      searchData: this.searchData
    }
  }	
	constructor(props) {
		super(props);
		let { TabStore, history } = this.props;
		let pageState = {},
			baselibType;
		try {
			pageState = history.location.state.pageState;
			baselibType = pageState.baselibType;
			this.hasData = true;
		} catch (e) {
			this.hasData = false;
			pageState = {};
		}
		if (this.hasData) {
			this.baselibType = pageState.baselibType; // string face body
			this.moduleStore = this.props[this.baselibType + 'Store']; // 传入进来的modul - faceStore bodyStore
			pageState.searchData.pageSize = 6;
			this.searchData = pageState.searchData;
			this.getlog(pageState.item.captureTime, pageState.item.cameraName);
			this.state = {
				item: pageState.item, // 当前页选中的元素
				listAll: [], // 上一页，当前页， 下一页数据集合
				listNow: [], // 当前页数据
				fileData: {},
				idx: pageState.idx,
				loading: true
			};
		}
	}
	// 设置loading状态
	changeLoadingState = (isloading = true) => {
		this.setState({
			loading: isloading
		});
	};
	getlog(time, cameraName) {
		let logInfo = {
			...baselib.faceDetailModule,
			description: `查看点位【${cameraName}】 ${moment(+time).format('YYYY.MM.DD HH:mm:ss')}的人${this.baselibType === 'face'? '脸': '体'}抓拍照片`
		};
		GlobalStore.LoggerStore.save(logInfo);
	}
	async componentDidMount() {
		if (this.hasData) {
			let idNew = this.state.item.id;
			let pageType = 2; // 下一页
			let searchData = Object.assign({}, this.searchData, { pageSize: 5, pageType, minId: idNew });
			let list = (await this.moduleStore.getList(this.baselibType, searchData)).list;
			let listNow = [].concat([ this.state.item ], list);
			if (list.length < 5) {
				// 没有下一页数据
				this.listNext = [];
			} else {
				// 还可能有下一页数据--- 继续向下请求一页数据
				let id = list[list.length - 1].id;
				let search = Object.assign({}, this.searchData, { pageType, minId: id });
				this.listNext = (await this.moduleStore.getList(this.baselibType, search)).list;
			}
			// 请求上一页数据
			searchData = Object.assign({}, this.searchData, { pageType: 1, maxId: idNew });
			this.listPre = (await this.moduleStore.getList(this.baselibType, searchData)).list;
			let listAll = [].concat(this.listPre, listNow, this.listNext);
			this.setState(
				{
					listAll,
					listNow,
					loading: false
				},
				() => {
					// 获取视频
					// this.getHistoryMovie(this.state.item);
				}
			);
		}
	}
	// 获取历史视频
	// getHistoryMovie = (item) => {
	// 	let option = {
	// 		cameraId: item.cameraId,
	// 		startTime: item.captureTime / 1000 - 15,
	// 		endTime: item.captureTime / 1000 + 15
	// 	};
	// 	let { DeviceStore } = this.props;
	// 	DeviceStore.asyncGetHistoryVideo(option).then((item) => {
	// 		let res = DeviceStore.queryCameraById(option.cameraId);
	// 		let fileData = Object.assign({}, res, {
	// 			historyList: item,
	// 			isLiving: false,
	// 			timeRange: {
	// 				startTime: option.startTime * 1000,
	// 				endTime: option.endTime * 1000
	// 			}
	// 		});
	// 		this.setState({
	// 			fileData: fileData
	// 		});
	// 	});
	// };
	// 点击上一条和下一条的数据切换
	changeDetailView = (data, isNext) => {
		// 判断当前元素(item)是否为当前列表（listNow）渲染的元素之一
		let flag = false;
		this.state.listNow.forEach((item) => {
			if (item.id === data.id) {
				flag = true;
			}
		});
		if (flag) {
			this.setState(
				{
					item: data
				},
				() => {
					this.getlog(this.state.item.captureTime, this.state.item.cameraName)
					// 获取视频
					// this.getHistoryMovie(this.state.item);
				}
			);
		} else {
			if (isNext) {
				// 点击下一个
				this.getNextPage();
			} else {
				// 点击上一个
				this.getPrePage(true);
			}
		}
	};
	// 切换选中的item
	changeItem = (item) => {
		this.setState(
			{
				item
			},
			() => {
				this.getlog(this.state.item.captureTime, this.state.item.cameraName)
				// 获取视频
				// this.getHistoryMovie(this.state.item);
			}
		);
	};
	// 上一页 isPreBtn---代表是点击的上一页造成的翻页，应该选中当前页的最后一个元素
	getPrePage = async (isPreBtn = false) => {
		if (this.listPre.length === 0) {
			message.info('没有上一页数据');
			return;
		}
		this.changeLoadingState(true);
		let id = this.listPre[0].id;
		let pageType = 1; // 下一页
		let searchData = Object.assign({}, this.searchData, { pageType, maxId: id });
		let listPreNew = (await this.moduleStore.getList(this.baselibType, searchData)).list;
		// 重置数据 上一页 当前页 下一页 所有数据
		let listAll = [].concat(listPreNew, this.listPre, this.state.listNow);
		this.listNext = this.state.listNow; // 下一页为当前页
		this.setState(
			{
				listNow: this.listPre, // 当前页为上一页
				item: isPreBtn === true ? this.listPre[this.listPre.length - 1] : this.listPre[0],
				listAll,
				loading: false
			},
			() => {
				this.listPre = listPreNew; // 上一页为现在请求到的数据
				this.getlog(this.state.item.captureTime, this.state.item.cameraName)
				// 获取视频
				// this.getHistoryMovie(this.state.item);
			}
		);
	};
	// 下一页
	getNextPage = async () => {
		if (this.listNext.length === 0) {
			message.info('没有下一页数据');
			return;
		}
		this.changeLoadingState(true);
		let id = this.listNext[this.listNext.length - 1].id;
		let pageType = 2; // 下一页
		let searchData = Object.assign({}, this.searchData, { pageType, minId: id });
		let listNextNew = (await this.moduleStore.getList(this.baselibType, searchData)).list; // 下一页数据
		// 重置数据 上一页 当前页 下一页 所有数据
		let listAll = [].concat(this.state.listNow, this.listNext, listNextNew);
		this.listPre = this.state.listNow; // 上一页为当前页
		this.setState(
			{
				listNow: this.listNext, // 当前页为之前的下一页
				item: this.listNext[0],
				listAll,
				loading: false
			},
			() => {
				this.listNext = listNextNew; // 下一页为现在请求的数据
				// 获取视频
				this.getlog(this.state.item.captureTime, this.state.item.cameraName)
				// this.getHistoryMovie(this.state.item);
			}
		);
	};
	render() {
		if (!this.hasData) {
			return <NoData />;
		}
		const { item, listNow, listAll, fileData, idx, loading } = this.state;
		const { realName } = this.props.UserStore.userInfo;
		return (
			<Spin spinning={loading}>
				<div className="history_alarm_detail_view">
					<Header item={item} />
					<div className="detail_imm">
						<PreviousDetail
							data={item}
							type={this.baselibType}
							detailList={listAll}
							realName={realName}
							changeDetailView={this.changeDetailView}
						/>
						<DetailIMM
							//points={points}
							data={item}
							fileData={fileData}
							type={this.baselibType}
							key={item.id}
						/>
						<NextDetail
							data={item}
							type={this.baselibType}
							detailList={listAll}
							realName={realName}
							changeDetailView={this.changeDetailView}
						/>
					</div>
					{/* <DetailList
					data={alarmInfoList}
					id={data && data.id}
					handleChangeList={this.handleChangeList}
					checkBoxChange={this.checkBoxChange}
				/> */}
					<DetailList
						renderData={listNow}
						itemActive={item}
						activeIndex={idx}
						changeItem={this.changeItem}
						type={this.baselibType}
						getPrePage={this.getPrePage}
						getNextPage={this.getNextPage}
					/>
				</div>
			</Spin>
		);
	}
}

export default FaceDetail;
