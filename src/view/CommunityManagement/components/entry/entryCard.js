import React, { Component } from 'react';
import IconFont from 'src/components/IconFont';
import { Button } from 'antd';
import './entryCard.scss';
class EntryCard extends Component {
	constructor(props) {
		super(props);
	}

	render() {
    let {residenceHandle, data = {},clickCommunity, currentId} = this.props;
		return (
			<div className={`community_entry_card ${currentId == data.id ? 'community_entry_card_active': ''}`} onClick={() => clickCommunity(data)}>
				<div className="card_header">
					<div className="card_img_box">
						{data.picUrl ? <img className="card_img" src={data.picUrl} alt="" /> : <IconFont style={{fontSize: '80px', color:'#D8DCE3'}} type={'icon-Dataicon__Dark4'} theme="outlined" /> }
					</div>
					<div className="card_title_box">
						<p className="card_title">{data.villageName}</p>
						<span className="card_adress">{(data.provinceName ? data.provinceName : '') + (data.cityName ? data.cityName : '') + (data.districtName ? data.districtName : '') + (data.villageName ? data.villageName : '')}</span>
					</div>
				</div>
				<div className="card_content">
					<div className="content_people">
						<div className="content_people_left">
							<IconFont type={'icon-Often_Dark'} theme="outlined" />
							<span className="left_title">小区登记人口</span>
						</div>
						<div className="content_people_right font-resource-normal">
							{data.permanentCount === undefined ? '-' : data.permanentCount} <span className="right_span">人</span>
						</div>
					</div>
					<div className="content_people">
						<div className="content_people_left">
							<IconFont type={'icon-_Camera__Main2'} theme="outlined" />
							<span className="left_title">小区实有设备</span>
						</div>
						<div className="content_people_right font-resource-normal">
							{data.deviceCount === undefined ? '-' : data.deviceCount} <span className="right_span">台</span>
						</div>
					</div>
					{/* <div className="content_people">
						<div className="content_people_left">
							<IconFont type={'icon-Control_White_Main'} theme="outlined" />
							<span className="left_title">24小时人脸采集数</span>
						</div>
						<div className="content_people_right">
							2754 <span className="right_span">张</span>
						</div>
					</div> */}
				</div>
				<div className="card_footer">
					<Button onClick={(event) => residenceHandle(0, data.id,event)}>
						<IconFont type={'icon-People_Light'} theme="outlined" />
						常住人口
					</Button>
					<Button onClick={(event) => residenceHandle(1, data.id,event)}>
						<IconFont type={'icon-People_Other_Main'} theme="outlined" />
						流动人口
					</Button>
				</div>
			</div>
		);
	}
}

export default EntryCard;
