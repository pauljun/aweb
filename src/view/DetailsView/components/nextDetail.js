import React from 'react';
import WaterMark from 'src/components/WaterMarkView';
import IconFont from 'src/components/IconFont';
import './nextDetail.scss';

class NextDetail extends React.Component {
	constructor(props) {
		super(props);
		this.nextDetail = {};
	}
	isFocus = false;
	changeDetailView = (data) => {
		this.props.changeDetailView(data, true);
	};
	changeCurrentImg = (e) => {
		try {
			if (window.getSelection().focusNode.className.indexOf('detail_header') > -1) {
				return;
			}
		} catch (e) {}
		if (this.nextDetail && e.keyCode === 39) {
			this.changeDetailView(this.nextDetail);
		}
	};
	componentDidMount() {
		document.addEventListener('keydown', this.changeCurrentImg);
	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.changeCurrentImg);
	}
	render() {
		let { type = 'face', data, detailList = [] } = this.props;
		if (detailList.length > 0) {
			let chose = detailList.filter((v) => v.id == data.id)[0];
			let number = detailList.indexOf(chose);
			if (number < detailList.length && number > -1) {
				this.nextDetail = detailList[number + 1];
			}
		}
		let nextDetail = this.nextDetail;
		return (
			<React.Fragment>
				{nextDetail ? (
					<div className={`imm_left ${type === 'face' ? 'face-style' : ''}`} onClick={this.changeDetailView.bind(this, nextDetail, true)}>
						<div className="imm_img">
							<WaterMark
								type="body"
								src={
									nextDetail &&
									(nextDetail[type + 'Path'] ||
										nextDetail.facePath ||
										(nextDetail.picUrl && nextDetail.picUrl.smallPicUrl) ||
										(nextDetail.picUrl && nextDetail.picUrl.bigPicUrl))
								}
							/>
						</div>
						<p className="imm_left_p">
							下一个<IconFont type={'icon-Arrow_Big_Right_Main'} theme="outlined" />
						</p>
					</div>
				) : (
					<div className="null_left" />
				)}
			</React.Fragment>
		);
	}
}

export default NextDetail;
