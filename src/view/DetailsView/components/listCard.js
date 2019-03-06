import React from 'react';
import { Checkbox } from 'antd';
import moment from 'moment';
import WaterMark from 'src/components/WaterMarkView';
import IconFont from 'src/components/IconFont';
import { stopPropagation, getSubStr } from '../../../utils';

import './listCard.scss';

class ListCard extends React.Component {
	checkBoxChange = (data, e) => {
		stopPropagation(e);
		let type = e.target.checked;
		if (type) {
			data = Object.assign({}, data, { checked: 1 });
		} else {
			data = Object.assign({}, data, { checked: 0 });
		}
		this.props.checkBoxChange(data);
	};
	render() {
		let { data = {}, handleChangeList, isActive, checkShow, libType } = this.props;
		return (
			<div className={`list_card ${isActive ? 'active_card' : ''}`} onClick={() => handleChangeList(data.id)}>
				<Checkbox
					className={`card_checkbox ${checkShow ? '' : 'card_checkbox_null'}`}
					checked={data.checked !== 0}
					onClick={this.checkBoxChange.bind(this, data)}
				/>
				<div className="lis_card_img_box">
					<WaterMark src={data.facePath} type="face" />
				</div>
				<div className="card_content">
									{libType == 1 && (
						<div className="card_text">
							{data.isHandle === 0 ? <i className="content_cir red" /> : <IconFont className={ data.isEffective === 1 ? 'iconYellow' : 'iconRed' } type={data.isEffective === 1 ? 'icon-YesNo_Yes_Main' : 'icon-YesNo_No_Main'} theme="outlined" /> }
							<p className="content_p">{data.isHandle == 0 ? '未处理' : data.isEffective == 1 ? '有效' : '无效'}</p>
						</div>
					)}
				<div className="card_text">
							<IconFont type={'icon-Like_Main2'} theme="outlined" />
							<p className="content_p">
								相似度 <span className="content_span">{data && Math.floor(data.similarity)}%</span>
							</p>
						</div>
					{libType == 4 && (
						<div className="card_text">
							<IconFont type={'icon-TreeIcon_People_Main2'} theme="outlined" />
							<p className="content_p">{}</p>
						</div>
					)}
					<div className="card_text">
						<IconFont type={'icon-Add_Light'} theme="outlined" />
						<p className="content_p" title={data.cameraName}>{data.cameraName && getSubStr(data.cameraName)}</p>
					</div>
					<div className="card_text">
						<IconFont type={'icon-Clock_Light'} theme="outlined" />
						<p className="content_p">{moment(+data.captureTime).format('YYYY.MM.DD HH:mm:ss')}</p>
					</div>
				</div>
			</div>
		);
	}
}

export default ListCard;
