import React from 'react';
import MapMode from './components/MapMode';
import TableMode from './assignDevices/index'
import './index.scss';

class view extends React.Component {
	render() {
		const { typeMode, initData,cancel } = this.props;
		return (
			<React.Fragment>
						<div className="device-sollot-wrapper" key="device-sollot">
							{typeMode === 1 ? 
							<TableMode 
							villageId={this.props.activeId}
							/> : <MapMode village={initData} cancel={cancel} />}
						</div>
			</React.Fragment>
		);
	}
}

export default view;
