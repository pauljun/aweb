import React from 'react';
import IconFont from 'src/components/IconFont';
import '../style/infoCard.scss';

export default class InfoCard extends React.Component {
	render() {
		let { data = {}, onChoseVillage, villageId } = this.props;
		return (
			<div
				className={`info-card ${villageId === data.villageId ? 'info-card-active' : ''}`}
				onClick={() => {
					onChoseVillage(data);
				}}
			>
				<div className="card-left">
					{data.picUrl ? (
						<img className="left-img" src={data.picUrl} alt="" />
					) : (
						<IconFont style={{ fontSize: '80px', color: '#D8DCE3' }} type={'icon-Dataicon__Dark4'} theme="outlined" />
					)}
				</div>
				<div className="card-right">
					<p className="title">{data.villageName}</p>
					<p className="address">
						{(data.provinceName ? data.provinceName : '') +
							(data.cityName ? data.cityName : '') +
							(data.districtName ? data.districtName : '') +
							(data.villageName ? data.villageName : '')}
					</p>
				</div>
			</div>
		);
	}
}
