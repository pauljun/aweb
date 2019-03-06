import React from 'react';
import { Icon } from 'antd';
import IconFont from 'src/components/IconFont';
import './style.scss';

export default ({ label, subLabel1, subLabel2, icon, value1, value2,color }) => (
	<div className="resource-item-copy">
		<div className="col">
			<div className="nameTitel">{label}</div>
			<IconFont type={`${icon}`} />
		</div>
		<div className="col">
			<div className="name">{subLabel1}</div>
			<div className="font-resource-normal">{value1}<span>TB</span></div>
		</div>
		<div className="col">
			<div className="name">{subLabel2}</div>
			<div className="font-resource-normal" style={{color:color}}>{value2}<span>TB</span></div>
		</div>
	</div>
);
