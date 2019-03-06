import React from 'react';
import { Modal } from 'antd';
import IconFont from 'src/components/IconFont';
import './index.scss';

class ModalView extends React.Component {
	render() {
		let { visible, view, onOk, onCancel, title, width = 320, iconType, height = 100, loading = false } = this.props;
		return (
			<Modal centered visible={visible} onOk={onOk} onCancel={onCancel} title={title} className="modal_view_content" width={width} okButtonProps={{ loading: loading }} >
			<div>
			{iconType && <IconFont type={iconType} theme="outlined" />}
				<div className="modal_view_text" >
					{view}
				</div>
			</div>
			</Modal>
		);
	}
}

export default ModalView;