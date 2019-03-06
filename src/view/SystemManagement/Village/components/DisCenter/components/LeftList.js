import React from 'react';
import { List, Checkbox } from 'antd';
import InputSearch from 'src/components/SearchInput';
import '../style/LeftList.scss';

export default class LeftList extends React.Component {
	constructor(props) {
		super(props);
		this.defaultId = 'centerId';
		this.defaultName = 'centerName';
		if(props.name === '小区'){
			this.defaultId = 'villageId';
			this.defaultName = 'villageName';
		}
		this.state = {
			checkAll: false
		};
	}

	onCheckAllChange = (e) => {
		let { data, getUnChoseCenterList } = this.props;
		if (e.target.checked) {
			this.setState(
				{
					checkAll: e.target.checked
				},
				() => {
					getUnChoseCenterList(data.map((v) => v[this.defaultId]));
				}
			);
		} else {
			this.setState(
				{
					checkAll: e.target.checked
				},
				() => {
					getUnChoseCenterList();
				}
			);
		}
	};

	checkHandle = (item, e) => {
		let { data, getUnChoseCenterList, unChoseList } = this.props;
		if (e.target.checked === true) {
			unChoseList.push(item[this.defaultId]);
		} else {
			unChoseList = unChoseList.filter((v) => v !== item[this.defaultId]);
		}
		if (unChoseList.length === 0) {
			this.setState({
				checkAll: false
			});
		}
		if (unChoseList.length > 0 && unChoseList.length < data.length) {
			this.setState({
				checkAll: false
			});
		}
		if (unChoseList.length === data.length) {
			this.setState({
				checkAll: true
			});
		}
		getUnChoseCenterList(unChoseList);
	};

	render() {
		let { checkAll } = this.state;
		let { data, unChoseList, name, onSearch } = this.props;
		if(data.length === 0 || unChoseList.length !== data.length) {
			checkAll = false
		}
		return (
			<div className="dis-left-list">
				<div className="list-header">
					未分配{name}
				</div>
				{name !== '小区' && <div className="list-filter">
					<InputSearch 
						placeholder='请输入运营中心名称搜索'
						onSearch={(v) => onSearch(v, 0)}
					/>
				</div> }
				<div className="list-content">
					<div className="header">
						<Checkbox
							indeterminate={unChoseList.length === 0 || unChoseList.length === data.length ? false : true}
							onChange={this.onCheckAllChange.bind(this)}
							checked={checkAll}
						/>{name}名称
					</div>
					<List
						dataSource={data}
						split={false}
						size={'small'}
						renderItem={(item) => (
							<List.Item>
								<Checkbox
									checked={unChoseList.indexOf(item[this.defaultId]) > -1}
									onChange={this.checkHandle.bind(this, item)}
								>
									{item[this.defaultName]}
								</Checkbox>
							</List.Item>
						)}
					/>
				</div>
			</div>
		);
	}
}
