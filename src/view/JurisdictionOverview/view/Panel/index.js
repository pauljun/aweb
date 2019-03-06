import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import LogsComponent from 'src/components/LogsComponent';
import MapComponent from 'src/components/Map/MapComponent/index.js';
import ClusterMarker from 'src/components/Map/MapComponent/component/ClusterMarker';
import ChartCard from '../../components/ChartCard/ChartCard.jsx';
import { exitFullscreen ,fullscreen} from 'src/utils/FullScreen';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import enquire from 'enquire.js';
import Socket from '../../../../libs/Socket';
import * as _ from 'lodash';

import Title from './components/Title';
import ToolsView from './components/Tools';
import ResourceModule from '../../ResourceModule';
import KvServer from 'src/service/KVService';

import ResourceStatic from './middle/ResourceStatic';
import './index.scss';

@LogsComponent()
@withRouter
@BusinessProvider('JurisdictionOverviewStore', 'TabStore', 'DeviceStore', 'UserStore')
@observer
class Panel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 300,
			spacing: 20,
			fullScreenState:false,
			ids: []
		};
		// 监听面板编辑完成
		Socket.on('panelEdit', this.checkcards);
	}
	AMap = null;
	clusterMarker = null;
	initClusterMarker = (clusterMarker) => {
		this.clusterMarker = clusterMarker;
	};
	componentWillUnmount() {
		Socket.off('panelEdit', this.checkcards);
		this.fontSizeUnmount();
		this.clusterMarker = null;
		this.AMap = null;
	}

	componentDidMount() {
		this.fontSizeInit();
		this.initData();
	}
	//初始化数据
	initData = () => {
		let { JurisdictionOverviewStore, UserStore } = this.props;
		Promise.all([
			JurisdictionOverviewStore.getDeviceCount({ deviceTypes: [] }),
			KvServer.getKVStore(UserStore.userInfo.id, 'PANELSETTING')
		]).then((resArr) => {
			let deviceCount = 0;
			resArr[0].result &&
				resArr[0].result.map((v) => {
					deviceCount += v.totalCount;
				});
			this.setState({
				deviceCount,
				ids: resArr[1] ? resArr[1] : [ 10, 2, 3, 1, 9, 6 ]
			});
		});
	};

	setSpacing1920 = {
		match: () => this.setState({ spacing: 20 })
	};
	setSpacing1600 = {
		match: () => this.setState({ spacing: 15 })
	};
	setSpacing1366 = {
		match: () => this.setState({ spacing: 10 })
	};
	setSpacing1024 = {
		match: () => this.setState({ spacing: 6 })
	};

	//兼容分辨率
	fontSizeInit = () => {
		enquire
			.register('screen and (max-width:1921px) and (min-width:1601px)', this.setSpacing1920)
			.register('screen and (max-width:1601px) and (min-width:1441px)', this.setSpacing1600)
			.register('screen and (max-width:1441px) and (min-width:1025px)', this.setSpacing1366)
			.register('screen and (max-width:1025px)', this.setSpacing1024);
	};

	fontSizeUnmount = () => {
		enquire
			.unregister('screen and (max-width:1921px) and (min-width:1601px)', this.setSpacing1920)
			.unregister('screen and (max-width:1601px) and (min-width:1441px)', this.setSpacing1600)
			.unregister('screen and (max-width:1441px) and (min-width:1025px)', this.setSpacing1366)
			.unregister('screen and (max-width:1025px)', this.setSpacing1024);
		this.setSpacing1920 = null;
		this.setSpacing1600 = null;
		this.setSpacing1366 = null;
		this.setSpacing1024 = null;
	};

	//卡片换位
	checkcards = (ids) => {
		this.setState({ ids: ids });
	};
	//初始化地图
	initMap = (AMap) => {
		this.AMap = AMap;
	};
	resetMap = () => {
		let { systemConfig } = this.props.UserStore;
		let { centerPoint, zoomLevelCenter } = systemConfig;
		this.AMap.setZoomAndCenter(zoomLevelCenter || 5, centerPoint && centerPoint.split(','));
	};

	//渲染card
	renderCards = (t) => {
		const { ids, spacing } = this.state;
		if (!ids.length) {
			return;
		}
		let left = ids.slice(0, 3);
		let right = ids.slice(3, 6);
		return (t === 'left' ? left : right).map((v, i) => {
			const Module = ResourceModule.filter((m) => m.id === v)[0];
			return Module ? (
				<ChartCard title={Module.title} type={'charts'} key={`${t}${i}p`} name={`${t}${i}`}>
					{Module.component && <Module.component spacings={spacing} decoration={t} />}
				</ChartCard>
			) : (
				<ChartCard title={''} type={'charts'} key={`${t}${i}p`} name={`${t}${i}`} decoration={t}>
					{<div style={{ margin: '20px auto', textAlign: 'center' }}>此模块暂时移除，请重新编辑面板</div>}
				</ChartCard>
			);
		});
	};
	//渲染Cards模块
	renderCardsDom = () => {
		return (
			<React.Fragment>
				<div className="home-left">{this.renderCards('left')}</div>
				<div className="home-right">
					{this.renderCards('right')}
				</div>
			</React.Fragment>
		);
	};

	checkOutScreen =() => {
		let {fullScreenState} = this.state
		if(fullScreenState){
			this.setState({fullScreenState:false},() => exitFullscreen())
		}else{
			this.setState({fullScreenState:true},() => fullscreen(this.Panel))
		}
		
	}

	render() {
		let { spacing, deviceCount ,ids,fullScreenState} = this.state;
		let { DeviceStore, UserStore} = this.props;
		const dayResouecesStatis = [];
		const deviceStateStatis = [];
    let cameraList = DeviceStore.deviceArray;
    const excludeTypes = window.webConfig.wifiDevice == "0" ? ["118901"] : [];
		return (
			<React.Fragment>
				<div className="home-main" ref={(Panel) => (this.Panel = Panel)}>
					<Title total={deviceCount} title={UserStore.centerInfo.systemName} />
					<div className="home-bg">
						<MapComponent initMap={this.initMap} centerIsCity={true}>
							<ToolsView
							spacing={spacing}
							resetMap={this.resetMap}
							ids={ids}
							clusterMarker={this.clusterMarker}
							fullStatus={fullScreenState}
							fullEvent={this.checkOutScreen}
						/>
							<ClusterMarker excludeTypes={excludeTypes} filterResource={true} points={cameraList} init={this.initClusterMarker} />
						</MapComponent>
					</div>
					{this.renderCardsDom()}
					<div className="home-bottom">
						<ResourceStatic dayResouecesStatis={dayResouecesStatis} deviceStateStatis={deviceStateStatis} />
					</div>
				</div>
				<style jsx="true">{`
						.home-left,
						.home-right,
						.home-bg .tools-resource-layer,
						.tools-wrapper
						 {
							transform: scale(${spacing === 20 ? '1,1' : spacing === 10 ? '.7,.7' : spacing === 15 ? '.8,.8' : '.6,.6'});
						}
						.tools-wrapper{
							top:${spacing >= 20 ? 10 : spacing >= 5 ? 5 : 5}px;
							right:${spacing === 20 ? '20' : spacing === 10 ? '-25' : spacing === 15 ? '-12' : '-60'}px!important;
						}
						.home-bg .tools-resource-layer{
							background:transparent;
							top:${spacing >= 20 ? 9 : spacing >= 5 ? 5 : 5}px;
							right:${spacing === 20 ?( fullScreenState?155:156) : spacing === 10 ? ( fullScreenState?100:100) : spacing === 15 ? ( fullScreenState?130:120) : '-60'}px!important;
						}
						.home-left{
							// top:${spacing >= 20 ? 50 : spacing >= 10 ? 40 : 50}px!important;
							height:calc(${spacing === 20
								? '100% - 44px'
								: spacing === 10 ? '100% + 220px' : spacing === 15 ? '100% + 96px' : '100% + 196px'})!important;
							left:${spacing === 20 ? '0' : spacing === 10 ? '-40' : spacing === 15 ? '-28' : '-60'}px;
						}
						.home-right{
							// top:${spacing >= 20 ? 0 : spacing >= 10 ? 0 : 50}px!important;
							height:calc(${spacing === 20
								? '100% - 44px'
								: spacing === 10 ? '100% + 220px' : spacing === 15 ? '100% + 96px' : '100% + 196px'})!important;
							right:${spacing === 20 ? '0' : spacing === 10 ? '-40' : spacing === 15 ? '-28' : '-60'}px!important;
						}
						.home-bottom{
							transform:scale(${spacing >= 20 ? '1,1' : spacing >= 10 ? '.7,.7' : '.60,.60'});
							width:calc(${spacing >= 20 ? '100% - 600px' : spacing >= 10 ? '100% - 80px' : '100% + 20px'})!important;
							left:${spacing >= 20 ? 300 : spacing >= 10 ? 40 : -10}px!important;
							height:${spacing === 20 ? 230 : spacing === 10 ? 200 : spacing === 15 ? 220 : 200}px!important;
						}
						.submit-container{
							bottom:${spacing >= 20 ? 255 : spacing >= 10 ? 155 : 200}px!important;
						}
				`}</style>
			</React.Fragment>
		);
	}
}
export default Panel;
