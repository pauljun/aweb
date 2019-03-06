import React from 'react';
import MapComponent from 'src/components/Map/MapComponent';
import ClusterMarker from 'src/components/Map/MapComponent/component/ClusterMarker';
import MapSearch from 'src/components/Map/MapComponent/component/MapSearch';
import CommunityPolygon from 'src/components/Map/MapComponent/component/CommunityPolygon';
import MapResetTools from 'src/components/Map/MapComponent/component/MapResetTools';
import MouseTool from 'src/components/Map/MapComponent/component/MouseTool';
import IconFont from 'src/components/IconFont';
import Socket from 'src/libs/Socket';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';

import '../style/baseInfo.scss';

@BusinessProvider('DeviceStore')
class EditMap extends React.Component {
	constructor(props) {
		super(props);
		this.clusterMarker = null;
		this.state = {
			mapSelectPoints: [],
			bind: true,
			unbind: true,
			rangeCoordinates: [],
			onDraw: false
		};
		Socket.on('closeDraw', this.clearDraw);
	}

	componentWillUnmount() {
		Socket.off('closeDraw', this.clearDraw);
		this.map = null;
		this.clusterMarker = null;
		this.mouseTool = null;
	}

	initMap = (map) => {
		this.map = map;
	};

	initClusterMarker = (clusterMarker) => {
		this.clusterMarker = clusterMarker;
		this.forceUpdate();
	};
	initMouseTools(mouseTool) {
		this.mouseTool = mouseTool;
	}
	startDrawPolygon() {
		this.setState({ onDraw: true });
		const { mapMethods } = this.mouseTool.props;
		this.cursor = mapMethods.getDefaultCursor();
		mapMethods.setDefaultCursor('crosshair');
		this.mouseTool.polygon();
	}

	drawEnd(path) {
		const { mapMethods } = this.mouseTool.props;
		this.mouseTool.close();
		mapMethods.setDefaultCursor(this.cursor);
		//rangeCoordinates: "[[115.841591,28.677649],[115.843484,28.676774],[115.844324,28.676327],[115.845024,28.677541],[115.844844,28.677645],[115.844957,28.677878],[115.843951,28.678311],[115.842588,28.678868],[115.842272,28.678209],[115.84195,28.678358],[115.841591,28.677649]]"
		let points = [];
		path.map((v) => {
			points.push([ v.lng, v.lat ]);
		});
		this.props.savePoints && this.props.savePoints(points);
		this.setState({ rangeCoordinates: points });
	}

	clearDraw = () => {
		if(this.state.onDraw){
			this.mouseTool.close(true);
			this.setState({ rangeCoordinates: [], onDraw: false });

		}
	};
	// showMarker = (type) => {
	// 	let { bind, unbind } = this.state;
	// 	if (type === 1) {
	// 		this.setState({ bind: !bind });
	// 		console.log('bind', bind);
	// 	} else {
	// 		this.setState({ unbind: !unbind });
	// 		console.log('unbind', unbind);
	// 	}
	// };

	//定位到小区中心
	onSelectPoi = (option) => {
		this.map.setZoomAndCenter(18, option.position);
	};
	renderMapTool = () => {
		let { onDraw } = this.state;
		return onDraw ? (
			<div className="village-tools-draw" onClick={() => this.clearDraw()}>
				<IconFont type="icon-Close_Main1" theme="outlined" />
				清除绘制
			</div>
		) : (
			<div className="village-tools-draw" onClick={() => this.startDrawPolygon()}>
				<IconFont type="icon-Choose__Main2" theme="outlined" />
				绘制边界
			</div>
		);
	};

	render() {
		let { initData, points, unbindPoint, allPoints, isVD, children, bind, unbind, isView, onDraw ,click} = this.props;
		return (
			<React.Fragment>
				{!isVD && <div className="map-label">小区边界:</div>}
				<MapComponent initMap={this.initMap}>
					<MapResetTools hideReset={true} click={() => click()} />
					<CommunityPolygon villages={[ initData ]} ref={this.props.forwardRef} />
					{!!isVD && (
						<ClusterMarker
							excludeTypes={[ '100605' ]}
							points={points}
							filterResource={true}
							init={this.initClusterMarker}
						>
							{/* <div className="type-part">
							<div className="type-name">分配状态：</div>
							<div className="type-content">
								<div className={`type-item ${bind ? 'active' : ''} `} onClick={() => this.showMarker(1)}>
									<span className="icon">
										<IconFont type="icon-Allocation_Yes_Dark" theme="outlined" />
									</span>
									<span className="lable-text">已分配</span>
								</div>
								<div className={`type-item ${unbind ? 'active' : ''} `} onClick={() => this.showMarker(2)}>
									<span className="icon">
										<IconFont type="icon-Allocation_No_Dark" theme="outlined" />
									</span>
									<span className="lable-text">未分配</span>
								</div>
							</div>
						</div> */}
						</ClusterMarker>
					)}
					{!isVD && (
						<div>
							<ClusterMarker points={points} />
							<div style={{ display: !isView ? 'block' : 'none' }}>
								{!isView && <MapSearch onSelectPoi={this.onSelectPoi} />}
								{this.renderMapTool()}
								<MouseTool
									init={(mouseTool) => this.initMouseTools(mouseTool)}
									drawEnd={(path) => this.drawEnd(path)}
								/>
							</div>
						</div>
					)}
				</MapComponent>
			</React.Fragment>
		);
	}
}
export default React.forwardRef((props, ref) => <EditMap {...props} forwardRef={ref} />);
