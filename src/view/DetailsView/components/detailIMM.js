import React from 'react';
import PlayComponent from '../../BusinessComponent/PlayComponent';
import View from 'src/components/pictureCanvas';
import { withRouter } from 'react-router-dom';
import IconFont from 'src/components/IconFont';
import MapComponent from 'src/components/Map/MapComponent';
import DownloadVideo from 'src/utils/DownloadVideo';
import PathSimplifier from 'src/components/Map/MapComponent/component/PathSimplifier';
import { observer } from 'mobx-react';
import { BusinessProvider } from '../../../utils/Decorator/BusinessProvider';
import MapPointLabel from '../../BusinessComponent/MapPointLabel/MapPointLabelView';

import './detailIMM.scss';

// @errorBoundary
@withRouter
@BusinessProvider('MoniteeAlarmsStore', 'DeviceStore', 'TabStore', 'UserStore')
@observer
class DetailIMM extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			IMMType: 0,
			PathCurrent: {},
			movieTrue: false,
			fileData: undefined
		};
		this.Map = null;
		this.walking = null;
		this.pathing = null;
		this.movieTime = null;
		this.getUserTime();
	}
	
	videoImgChange = () => {
		let { imgVideoChange } = this.state;
		this.setState({
			imgVideoChange: !imgVideoChange
		});
	};

	componentWillReceiveProps() {
	}

	getUserTime = () => {
		let { UserStore,data } = this.props;
		UserStore.getSystemTime().then(res => {
			if(res - data.captureTime > 60000) {
				this.setState({
					movieTrue: true
				})
			} else {
				this.movieTime = setTimeout(() => {
					this.setState({
						movieTrue: true
					})
				},res - data.captureTime)
			}
		})
	}

	componentWillMount() {
		clearTimeout(this.movieTime);
		this.Map = null;
		this.walking = null;
		this.pathing = null;
	}

	getTrajectory = (options) => {
		options = options || [];
		if (options.length < 1) {
			return;
		}
		let arr = [];
		options.map(v => {
			if(v.longitude && v.latitide) {
				arr.push({
					facePath: v.facePath,
					captureTime: v.captureTime,
					cameraId: v.cameraId,
					dataId: v.captureId,
					cameraName: v.cameraName,
					position: [v.longitude, v.latitide],
					imagePath:v.facePath,
					title: v.cameraName
				})
			}
		})
		this.pathing.setData(arr);
	};

	handleChangeIMM = (type) => {
		const { switchCheck, data } = this.props;
		let { movieTrue } = this.state;
		if(!movieTrue && type === 1) {
			return
    }
		switchCheck && switchCheck(type);
		if (type === 1) {
			let option = {
        cameraId: data.cameraId || data.deviceId,
        cameraName: data.cameraName || data.deviceName,
				startTime: (data.captureTime || data.passTime)/ 1000 - 15 ,
        endTime: (data.captureTime || data.passTime) / 1000 + 15,
			};
			this.getHistoryMovie(option);
		}
		this.setState({
			IMMType: type
		});
	};

	initMap = (Map) => {
		this.Map = Map;
	};
	walkInit = (walking) => {
		this.walking = walking;
	};
	PathInit = (pathing) => {
		this.pathing = pathing;
		this.getTrajectory(this.props.points);
	};

	// 获取历史视频
	getHistoryMovie = (option) => {
		let { DeviceStore } = this.props;
		if(this.state.fileData) {
			return
		}
		DeviceStore.asyncGetHistoryVideo(option).then((item) => {
			let res = DeviceStore.queryCameraById(option.cameraId || option.deviceId);
			let fileDatas = Object.assign({}, res, {
				historyList: item,
				isLiving: false,
				timeRange: {
					startTime: option.startTime * 1000,
					endTime: option.endTime * 1000
				}
			});
			this.setState({
				fileData: fileDatas
			});
		});
	};

	// 以图搜图
	handleSearchPic = (type) => {
		const { TabStore, history, data } = this.props;
		let option = { id: data.id };
		if (type === 'body') {
			option.model = 2;
		} else {
			option.model = 13;
		}
		TabStore.goPage({
			moduleName: 'baselib',
			childModuleName: 'imgSearch',
			history,
			state: option
		});
	};

	render() {
		let { IMMType, PathCurrent, movieTrue, fileData } = this.state;
		let { data, maptype, type, DeviceStore, searchData = {}, handleArray = [ 'pic', 'video', 'map' ] } = this.props;
		let mapPointInfo = DeviceStore.queryCameraById(data.cameraId || data.deviceId);
		return (
			<div className="alarm_detail_imm">
				<div className="imm_content">
					<div className={`imm_content_box ${IMMType == 0 && 'imm_content_box_active'} `}>
						<View
							name={data.cameraName}
							imgUrl={data && (data.scenePath || (data.picUrl && data.picUrl.bigPicUrl))}
							data={data}
							handleSearchPic={this.handleSearchPic}
							type={type}
						/>
					</div>
					<div className={`imm_content_box ${IMMType == 1 && 'imm_content_box_active'} `}>
						{IMMType == 1 && fileData && (
							<PlayComponent
								isLiving={false}
								hasLiving={false}
								fileData={fileData}
								method={{
									downloadVideo: (options) => DownloadVideo({ fileData, ...options })
								}}
							/>
						)}
					</div>
					<div className={`imm_content_box ${IMMType == 2 && 'imm_content_box_active'} `}>
						{IMMType == 2 && maptype ? (
							<MapComponent initMap={this.initMap}>
								<PathSimplifier init={this.PathInit} />
							</MapComponent>
						) : (
							<MapPointLabel point={mapPointInfo} />
						)}
					</div>
					<div className="imm_switch">
						{handleArray.indexOf('pic') > -1 && (
							<div
								className={`switch_box ${IMMType == 0 && 'switch_box_active'}`}
								onClick={this.handleChangeIMM.bind(this, 0)}
							>
								<IconFont type={'icon-Imge_Main'} theme="outlined" />
								看图片
							</div>
						)}
						{handleArray.indexOf('video') > -1 && (
							<div
								className={`switch_box ${IMMType == 1 && 'switch_box_active'} ${movieTrue ? '' : 'switch_box_dis'}`}
								onClick={this.handleChangeIMM.bind(this, 1)} title={`${!movieTrue ? '视频生成中，请稍后再试':''}`}
							>
								<IconFont type={'icon-Video_Main'} theme="outlined" />
								看视频
							</div>
						)}
						{handleArray.indexOf('map') > -1 && (
							<div
								className={`switch_box ${IMMType == 2 && 'switch_box_active'}`}
								onClick={this.handleChangeIMM.bind(this, 2)}
							>
								<IconFont type={maptype ? 'icon-Trajectory_Main' : 'icon-List_Map_Main'} theme="outlined" />
								{maptype ? '看轨迹' : '看地图'}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default DetailIMM;
