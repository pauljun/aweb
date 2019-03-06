import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button } from 'antd';
import Socket from 'src/libs/Socket';
import DS from './DeviceSollot';
import DSView from './DeviceSollotView';
import IconFont from 'src/components/IconFont';
import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import '../../style/baseInfo.scss';

@withRouter
@BusinessProvider('TabStore', 'OrgStore')
@observer
export default class DeviceSollot extends React.Component {
	constructor(props) {
		super(props);
		let view=!this.props.location.search.split('isEdit')[1].includes('true')
		this.state = {
			loading: true,
      isView: view,
      type : 1
		};
		Socket.emit('disableTabs',view)
	}
	
	changeType = (type) => {
		if (this.state.type !== type) {
			this.setState({type})
		}
  };
  edit = () => {
		this.setState({ isView: false },() => Socket.emit('disableTabs',this.state.isView));
	}
	cancel=() => {
		this.setState({isView:true},() => Socket.emit('disableTabs',this.state.isView))
	}
	render() {
		let { initData, points, activeId,isCenter } = this.props;
		let { isView,type } = this.state;
		return (
			<div className={`VD-sollot ${!isView&&type === 1?'style-control':''} `}>
				<div className="change_type">
					<Button className={`btn ${type === 1 && 'active'}`} onClick={this.changeType.bind(this, 1)}>
						<IconFont type="icon-List_Tree_Main" />列表模式
					</Button>
					<Button className={`btn ${type === 2 && 'active'}`} onClick={this.changeType.bind(this, 2)}>
						<IconFont type="icon-List_Map_Main" />地图模式
					</Button>
				 {isView && isCenter && <AuthComponent actionName="CenterVillageEdit"><button className='VD-edit-btn' onClick={this.edit}><IconFont type="icon-Edit_Main"/> 编辑</button></AuthComponent> }
				 {!isView && type === 1 && <button className='VD-edit-btn' onClick={this.cancel}><IconFont type="icon-Back_Main"/> 返回</button>}
				</div>
				{isView && <DSView type={type} initData={initData} points={points} activeId={activeId} />}
				{!isView && <DS cancel={this.cancel} typeMode={type} initData={initData} activeId={activeId} />}
			</div>
		);
	}
}
