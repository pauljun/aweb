import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import EidtMap from './editMap';
import EditForm from './editForm';
import IconFont from 'src/components/IconFont';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import Socket from 'src/libs/Socket';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import '../style/baseInfo.scss';

@withRouter
@BusinessProvider('VillageListStore', 'TabStore', 'OrgStore')
@observer
export default class VillageListEdit extends React.Component {
	constructor(props) {
		super(props);
		let view=!this.props.location.search.split('isEdit')[1].includes('true')
		this.state = {
			loading: true,
			isView: view,
			mapData: []
		};
		this.communityRef = React.createRef();
		Socket.emit('disableTabs',view)
	}
	jump = (activeId) => {
		this.communityRef.current.jumpCommunity(activeId);
	};
	componentDidMount() {
		let { activeId } = this.props;
		setTimeout(() => {
			activeId && this.jump(activeId);
		}, 300);
	}
	edit = () => {
		let { activeId } = this.props;
		activeId && this.jump(activeId);
		this.setState({ isView: false },() => Socket.emit('disableTabs',this.state.isView));
	};
	savePoints = (option) => {
		this.setState({ mapData: option });
	};
	// 取消操作
	handleCancel = () => {
		Socket.emit('updateVillageDevices');
		Socket.emit('closeDraw');
		this.setState({ isView: true },() => Socket.emit('disableTabs',this.state.isView));
	};
	render() {
		let { initData, points, allPoints, unbindPoint ,isCenter,activeId} = this.props;
		let { isView, mapData } = this.state;
		return (
			<div className="VD-base">
				{isView && isCenter && (
					<AuthComponent actionName="CenterVillageEdit">
					<div className='change_type'>
						<button className="VD-edit-btn" onClick={this.edit}>
							<IconFont type="icon-Edit_Main" />编辑
						</button></div>
					</AuthComponent>
				)}
				<EditForm isView={isView} initData={initData} mapData={mapData} handleCancel={this.handleCancel} />
				<div className="edit-village-map">
					<EidtMap
						key={'baseMap'}
						isView={isView}
						points={points}
						click={() => this.jump(activeId)}
						unbindPoint={unbindPoint}
						allPoints={allPoints}
						initData={initData}
						savePoints={this.savePoints}
						ref={this.communityRef}
					/>
				</div>
				<style jsx='true'>{`
				.edit-village-map .ibs-amap-wrapper{
					margin-bottom: ${isView? 0 : 80}px;
				}
				`}</style>
			</div>
		);
	}
}
