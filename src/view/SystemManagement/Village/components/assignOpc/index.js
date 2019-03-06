import React from 'react';
import { withRouter } from 'react-router-dom';
import DisCenter from '../DisCenter';
import OpcTable from './OpcTable';
import Socket from 'src/libs/Socket';
import IconFont from 'src/components/IconFont';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import '../../style/baseInfo.scss';

@withRouter
export default class DeviceSollot extends React.Component {
	constructor(props) {
		super(props);
		let view=!this.props.location.search.split('isEdit')[1].includes('true')
		this.state = {
			loading: true,
			isView: view,
		};
		Socket.emit('disableTabs',view)
	}
  edit = () => {
		this.setState({ isView: false },() => Socket.emit('disableTabs',this.state.isView));
	}
	cancel=() => {
		this.setState({isView:true},() => Socket.emit('disableTabs',this.state.isView))
	}
	render() {
		let { activeId,isCenter } = this.props;
		let { isView } = this.state;
		return (
			<div className="VD-sollot">
				<div className="change_type">
				 {isView && isCenter && <AuthComponent actionName="CenterVillageEdit"><button className='VD-edit-btn' onClick={this.edit}><IconFont type="icon-Edit_Main"/> 编辑</button></AuthComponent> }
				 {!isView && <button className='VD-edit-btn' onClick={this.cancel}><IconFont type="icon-Back_Main"/> 返回</button> }
				</div>
				{isView ? <OpcTable villageId={activeId}/> : <DisCenter type='1' villageId={activeId}/>}
			</div>
		);
	}
}
