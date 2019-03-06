import React from 'react';
import { List, Checkbox } from 'antd';
import InputSearch from 'src/components/SearchInput';
import '../style/LeftList.scss';

export default class RightList extends React.Component {
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
		let { data, getChoseCenterList } = this.props;
		if (e.target.checked) {
			this.setState({
					checkAll: e.target.checked
				},
				() => {
					getChoseCenterList(data.map((v) => v[this.defaultId]));
				}
			);
		} else {
			this.setState({
					checkAll: e.target.checked
				},
				() => {
					getChoseCenterList();
				}
			);
		}
	};

	checkHandle = (item, e) => {
		let { data, getChoseCenterList, choseList } = this.props;
		if (e.target.checked === true) {
			choseList.push(item[this.defaultId]);
		} else {
			choseList = choseList.filter((v) => v !== item[this.defaultId]);
		}
		if (choseList.length === 0) {
			this.setState({
				checkAll: false
			});
		}
		if (choseList.length > 0 && choseList.length < data.length) {
			this.setState({
				checkAll: false
			});
		}
		if (choseList.length === data.length) {
			this.setState({
				checkAll: true
			});
		}
		getChoseCenterList(choseList);
	};
	
	render() {
		let { checkAll } = this.state;
		let { data, choseList, name, onSearch } = this.props;
		if(data.length === 0 || choseList.length !== data.length) {
			checkAll = false
		}
		return (
			<div className="dis-left-list">
				<div className="list-header">已分配{name}</div>
				{name !== '小区' && <div className="list-filter">
					<InputSearch placeholder='请输入运营中心名称搜索' onSearch={(v) => onSearch(v, 1)}/>
				</div> }
				<div className="list-content">
					<div className="header">
						<Checkbox
							indeterminate={choseList.length === 0 || choseList.length === data.length ? false : true}
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
									checked={choseList.indexOf(item[this.defaultId]) > -1}
									onChange={this.checkHandle.bind(this, item)}
								>
								{item[this.defaultName]}</Checkbox>
							</List.Item>
						)}
					/>
				</div>
			</div>
		);
	}
}
