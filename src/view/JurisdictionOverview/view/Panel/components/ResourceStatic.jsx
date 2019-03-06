import React, { Component } from 'react';
import ItemComponent from './ItemComponent';
import { observer } from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import util from '../middle/util/util';
import { errorBoundary } from 'src/utils/Decorator';

@errorBoundary
@BusinessProvider('JurisdictionOverviewStore')
@observer
class ResourceStatic extends Component {
	state = {
		resourcesStatis: {}
	};

	componentDidMount() {
		this.props.JurisdictionOverviewStore.getResourcesStatis({}).then((res) => {
			this.setState({ resourcesStatis: res.result || {}});
		});
	}
	render() {
		let { resourcesStatis } = this.state;
		return (
			<div className="chart table">
				<div className="alarms-item-wrapper">
					<ItemComponent label="资源总数" icon="icon-List_Main" value={util.splitNum(resourcesStatis.total)} />
					<ItemComponent label="人脸图库" icon="icon-StructuredFace_Main" value={util.splitNum(resourcesStatis.faceNum)} />
					<ItemComponent label="人体图库" icon="icon-StructuredBody_Main" value={util.splitNum(resourcesStatis.bodyNum)} />
					<ItemComponent label="车辆图库" icon="icon-Data___Dark5" value={util.splitNum(resourcesStatis.vehicleNum)} />
				</div>
			</div>
		);
	}
}
export default ResourceStatic;
