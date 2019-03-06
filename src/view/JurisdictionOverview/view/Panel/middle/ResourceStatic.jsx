import React, { Component } from 'react';
import { Select } from 'antd';
import Resource24H from './bottom/Resource24H';
import Device24H from './bottom/Device24H';
const Option = Select.Option;

class ResourceStatic extends Component {
	onChange = (key) => {}
	render() {
		return (
			<div className="reource-static">
				<div className='titleBox'>
                <span className='title'>近24小时资源统计</span>
					{/* <Select defaultValue="1" onChange={this.onChange}>
						<Option value="1">近一天</Option>
						<Option value="7">近一周</Option>
						<Option value="20">近一月</Option>
					</Select> */}
				</div>
				<div className="resource-container">
					<div key="1">
						<Resource24H {...this.props} />
					</div>
					{/* <div key="2">
						<Device24H {...this.props} />
					</div>
					<div key="3">
						<Device24H {...this.props} />
					</div> */}
				</div>
			</div>
		);
	}
}
export default ResourceStatic;
