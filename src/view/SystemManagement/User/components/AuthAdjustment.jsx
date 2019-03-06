import React from 'react'
import { Modal, DatePicker } from 'antd'
// import CameraTree from 'src/view/monitees/components/cameraTree'

export default class AuthAdjustment extends React.Component {
	constructor(props) {
		super(props);
	}

	/**取消 */
	handleCancel = () => {
		this.props.close();
	}

	/**确定 */
	handleOk = () => {
	}

	onCameraSelected = list => {

	}

	/**时间选择 */
	packerDate(time){

	}

	render() {
		return (
			<Modal
				className="userRoleModal"
				title="权限微调"
				visible={this.props.visible}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
				width={1020}
				okText="确认"
				cancelText="取消"
				destroyOnClose={true}
				wrapClassName='user-camera-tree'
			>
				<DatePicker
					onChange={this.packerDate.bind(this)}
					style={{ width: 358, marginBottom: 10 }}
					placeholder="请选择有效时间"
					format="YYYY.MM.DD hh:mm:ss"
				/>
			</Modal>
		);
	}
}
