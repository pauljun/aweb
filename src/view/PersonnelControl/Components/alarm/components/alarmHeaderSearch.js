import React from 'react';
import { Button, Select } from 'antd';
import IconFont from 'src/components/IconFont';
import './alarmHeaderSearch.scss';

const Option = Select.Option;

class AlarmHeaderSearch extends React.Component {
	constructor(props) {
		super(props);
	}

	onChangeType = (type) => {
		let { onChange, searchData, total } = this.props;
		let res = searchData;
		let page = res.page;
		if (type == 1) {
			if (page > 1) {
				page = page - 1;
				onChange(page, res.pageSize);
			} else {
				return;
			}
		}
		if (type == 2 && Math.ceil(total / searchData.pageSize) !== searchData.page&&Math.ceil(total / searchData.pageSize) !== 0) {
			page = page + 1;
			onChange(page, res.pageSize);
		}
	};

	// 顶部小型分页选择
	littePagtionChange = (value) => {
		this.props.onTypeChange({page: 1, pageSize: parseInt(value, 10) });
	};
	thousand(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
 }
	render() {
		let { search, total, searchData={} } = this.props;
		return (
			<div className="alarm-container-header-search">
				<div className="header-text" style={{ paddingLeft: '5px' }}>
					共显示
					<b className="text-red"> {total && this.thousand(+total)} </b>
					条资源
				</div>
				<div className="header-pagtion-top">
					<Select
						onChange={this.littePagtionChange}
						value={searchData.pageSize}
						style={{ width: 98 }}
						defaultValue={searchData.pageSize}
						dropdownClassName={'little-pagtion-down'}
					>
						<Option value={24}>24条/页</Option>
						<Option value={36}>36条/页</Option>
						<Option value={48}>48条/页</Option>
						<Option value={72}>72条/页</Option>
						<Option value={96}>96条/页</Option>
					</Select>
				</div>
				<div className="header-input-people">
					<div className="pagtion_Paging">
						<div className={`paging_left ${searchData.page == 1 ? 'paging_left_No': ''}`} onClick={this.onChangeType.bind(this, 1)}>
							<IconFont type={'icon-Arrow_Big_Left_Main'} theme="outlined" />
						</div>
						<p className="paging_number">
							第<span>{searchData.page && this.thousand(+searchData.page)}</span>页
						</p>
						<div className={`paging_left ${Math.ceil(total / searchData.pageSize) == searchData.page||Math.ceil(total / searchData.pageSize)==0 ? 'paging_left_No': ''}`} onClick={this.onChangeType.bind(this, 2)}>
							<IconFont type={'icon-Arrow_Big_Right_Main'} theme="outlined" />
						</div>
					</div>
				</div>
				<div className="header-button">
					<Button block={true} type="primary" onClick={search}>
						<IconFont type={'icon-Left_Main'} theme="outlined" />刷新
					</Button>
				</div>
				{/* <div className="header-button">
        <Button
          block={true}
          type="primary"
          onClick={changeSearchView}
        >
          <Icon type="search" />高级搜索
        </Button>
      </div> */}
			</div>
		);
	}
}

export default AlarmHeaderSearch;
