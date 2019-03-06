import React from 'react';
import Submit from '../../../submit';
import * as _ from 'lodash';
import Socket from 'src/libs/Socket';
import CommunityMap from 'src/view/BusinessComponent/CommunityBounds';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { Spin, message } from 'antd';
import { CommunityDeviceType } from 'src/libs/DeviceLib';

import '../index.scss';
const deviceTypesAll = _.flattenDeep(CommunityDeviceType.filter(v => v.value && v.value !== '-1').map(v => v.value.split(',')))

@BusinessProvider('VillageListStore')
export default class MapView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			points: [],
			selectPoints: [],
			initPoints: [],
			loading: true
		};
	}
	//添加id
	addId=(points) => {
		points.forEach((v) => {
			v.id = v.deviceId;
		});
	}
	componentDidMount() {
		const { VillageListStore,village } = this.props;
		Promise.all([ 
			VillageListStore.queryUnbindedVillageDevices({deviceTypes:deviceTypesAll}),
			VillageListStore.queryVillageDevices({ villageId: village.id })
		 ]).then((res) => {
			let points=res[0].result.resultList
			let initPoints=res[1].result.resultList
			this.addId(points)
			this.addId(initPoints)
			let pointss= _.concat(points,initPoints)
			this.setState({
				initPoints:_.cloneDeep(initPoints),
				selectPoints:initPoints,
				points: pointss|| [],
				loading: false
			});
		});
	}
	click(point, event) {
		const { selectPoints } = this.state;
		const index = selectPoints.findIndex((v) => v.id === point.id);
		if (index > -1) {
			selectPoints.splice(index, 1);
		} else {
			selectPoints.push(point);
		}
		this.setState({ selectPoints });
	}
	assignedList = (points) => {
		let { selectPoints } = this.state;
		let arr = [].concat(selectPoints, points);
		selectPoints = [ ...new Set([ ...arr ]) ];
		this.setState({ selectPoints });
	};
	unAllotPoint = (point) => {
		const { selectPoints } = this.state;
		const index = selectPoints.findIndex((v) => v.id === point.id);
		if (index > -1) {
			selectPoints.splice(index, 1);
			this.setState({ selectPoints });
		}
	};
	ok = () => {
		let { selectPoints, initPoints } = this.state;
    let { VillageListStore, village, cancel } = this.props;
    let selectPointss=selectPoints.map(v => v.id)
    let initPointss=initPoints.map(v => v.id)
		let bindPoints = _.difference(selectPointss, initPointss);
    let unBindPoints = _.difference(initPointss, selectPointss);
    // console.log('bindPoints',bindPoints)
    // console.log('unBindPoints',unBindPoints)
		let option = {
			villageId: village.id,
			bindDeviceIds: bindPoints,
			unbindDeviceIds: unBindPoints
    };
		VillageListStore.updateVillageDevices(option).then((res) => {
			if (res.code === 200) {
        Socket.emit('updateVillageDevices');
        message.success('更新成功');
				cancel();
			} else {
				message.error('更新失败');
			}
		});
	};

	render() {
		const { village, cancel } = this.props;
		const { points, selectPoints, loading } = this.state;
		return (
			<React.Fragment>
				<Spin spinning={loading} style={{ position: 'fixed', top: '40%', left: '50%' }} />
				<div className="Map-view">
					<CommunityMap
						points={points}
						hideReset={true}
						village={village}
						selectPoints={selectPoints}
						autoAssignedPints={this.assignedList}
						unAllotPoint={this.unAllotPoint}
						options={{ click: (...args) => this.click(...args) }}
					/>
				</div>
				<Submit handleSave={this.ok} handleCancel={cancel} />
			</React.Fragment>
		);
	}
}
