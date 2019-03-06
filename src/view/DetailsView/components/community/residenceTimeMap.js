import React from 'react';
import ResidenceTime from './residenceTime';
import MapComponent from 'src/components/Map/MapComponent';
import PathSimplifier from 'src/components/Map/MapComponent/component/PathSimplifier';
import { BusinessProvider } from '../../../../utils/Decorator/BusinessProvider';
import './residenceTimeMap.scss';

@BusinessProvider('CommunityEntryStore')
class ResidenceTimeMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current: {},
			mDvisible: true
		};
		this.pathList = [];
		this.Map = null;
		this.walking = null;
		this.pathing = null;
	}

	getTrajectory = (faceList = []) => {
		let arr = [];
		faceList.map((v) => {
			if (v.longitude && v.latitide) {
				arr.unshift({
					dataId: v.id,
					facePath: v.facePath,
					captureTime: v.captureTime,
					cameraId: v.cameraId,
					cameraName: v.cameraName,
					position: [ v.longitude, v.latitide ],
					title:v.cameraName,
					imagePath:v.facePath
				});
			}
		});
		this.pathing && this.pathing.setData(arr);
	};
	componentWillReceiveProps(nextProps) {
		if (nextProps.faceList !== this.props.faceList) {
			this.pathList = nextProps.faceList;
			this.getTrajectory(this.pathList);
		}
	}
	componentWillUnmount() {
		this.pathList = null;
		this.Map = null;
		this.walking = null;
		this.pathing = null;
	}
	initMap = (Map) => {
		this.Map = Map;
	};
	walkInit = (walking) => {
		this.walking = walking;
	};
	PathInit = (pathing) => {
		this.pathing = pathing;
		this.props.faceList.length > 0 && this.getTrajectory(this.props.faceList);
	};
	changePointIndex = (index, current) => {
		let data = this.pathList.filter((v) => v.id === current.dataId)[0];
		this.setState({ current: data });
	};
	changeIndex = (index, item) => {
		this.pathing.changeCurrent('dataId', item.id);
		this.setState({ current: item });
	};

	render() {
		let { faceList = [] } = this.props;
		let { current } = this.state;
		return (
			<div className="residence_time_map">
				<div className="residence_map">
					<MapComponent initMap={this.initMap}>
						<PathSimplifier className='residence-map-path' init={this.PathInit} changePointIndex={this.changePointIndex} />
					</MapComponent>
				</div>
				<ResidenceTime currentId={current.id} faceList={faceList} changeIndex={this.changeIndex} />
			</div>
		);
	}
}

export default ResidenceTimeMap;
