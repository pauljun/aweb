import React from 'react';
import { Row, Col, Input, Button, Select } from 'antd';

const Search = Input.Search;
const Option = Select.option;
export default (option) => {
	return (
		<React.Fragment>
			<Row justify='space-between' className="searchGroup">
				<Col span={8}>
					设备类型：
					<Select defaultValue='112' onChange={option.change}>
						<option value="112">11</option>
						<option value="212">12</option>
					</Select>
				</Col>
				<Col span={8}>
					场所类型：
					<Select>
						<option value="112">11</option>
						<option value="212">12</option>
					</Select>
				</Col>
				<Col span={8}>
					分组信息：
					<Select>
						<option value="112">11</option>
						<option value="212">12</option>
					</Select>
				</Col>
			</Row>
			<Row className="searchGroup">
      <Col span={8} push={16}>
				<Search
					placeholder="请输入您想搜索的内容"
					enterButton
					// defaultValue={value}
					// onSearch={(value) =>
					// 	onChange({
					// 		key: value
					// 	})}
				/>
        </Col>
			</Row>
		</React.Fragment>
	);
};
