import React from 'react';
import { Modal } from 'antd';

import './index.scss';

export default class ModalTest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false
		};
	}

	handleModalShow = () => {
		this.setState({
			modalVisible: true
		});
	};

	handleModalCancel = () => {
		this.setState({
			modalVisible: false
		});
	};
	 handleModalOnOK = () => {
		this.setState({
			modalVisible: false
        });
    if (this.props.onHandleJump) { 
			this.props.onHandleJump();
		 } 
	} 
	render() {
		let { cancelText, okText, width,onHandleJump} = this.props;
		cancelText = cancelText || '取消';
		okText = okText || '确定';
		return (
			<Modal
				visible={this.state.modalVisible}
                 onOk={this.handleModalOnOK.bind(this)} 
               
				onCancel={this.handleModalCancel}
				centered
				width={width}
				cancelText={cancelText}
				okText={okText}
				wrapClassName={'libs-modal'}
			>
				{ this.props.children } 
			</Modal>
		);
	}
}