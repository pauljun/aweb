import React from 'react';
import { Button } from 'antd';

import '../../index.scss';

export default ({ handleSave, handleCancel }) => (
	<React.Fragment>
		<div className="setting-edit-btns role-btn">
			<Button
				className="cancel-btn ant-btn"
				name="cancel-btn"
				onClick={() => handleCancel()}
				style={{ display: 'inline-block' }}
			>
				{'取消'}
			</Button>
			<Button
				className="save-btn ant-btn"
				type="primary"
				name="save-btn"
				onClick={() => handleSave()}
				style={{ display:'inline-block' }}
			>
				{'保存'}
			</Button>
		</div>
	</React.Fragment>
);
