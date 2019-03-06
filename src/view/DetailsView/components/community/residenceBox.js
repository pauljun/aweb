import React from 'react';
import moment from 'moment';
import './residenceBox.scss';

class ResidenceBox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let { data, onClick, currentId } = this.props;
		data = data || [];
		return (
			<div className="residence_box">
				<i className="header_i" />
				<div className="box_info">
					<div className="box_header">
						<span className="header_title">{data.key}</span>
					</div>
					<div className="box_content">
						{data.value.map((item, index) => {
							return (
								<div className={`box_img_box ${currentId === item.id ? 'active_index' : ''}`} key={index} onClick={() => onClick(index,item)}>
                  <div className="box_item">
									  <img className="box_img" src={item.facePath} alt="" />
                  </div>
									<div className="box_message">
										<p className="message_name">{item.cameraName}</p>
										<p className="meaage_time">{item.captureTime && moment(+item.captureTime).format('YYYY.MM.DD HH:mm:ss')}</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default ResidenceBox;
