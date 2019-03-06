import React from 'react';
import WaterMark from 'src/components/WaterMarkView';
import IconFont from 'src/components/IconFont';
import './nextDetail.scss';

class PreviousDetail extends React.Component {
	constructor(props) {
		super(props);
		this.previousDetail = {};
	}
	changeDetailView = (data) => {
		this.props.changeDetailView(data, false);
	};

	changeCurrentImg = (e) => {
		try {
			if (window.getSelection().focusNode.className.indexOf('detail_header') > -1) {
				return;
			}
		} catch (e) {}
		if (this.previousDetail && e.keyCode === 37) {
			this.changeDetailView(this.previousDetail);
		}
	};
	componentDidMount() {
		document.addEventListener('keydown', this.changeCurrentImg);
	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.changeCurrentImg);
	}
	render() {
		let { detailList = [], data, type = 'face' } = this.props;
		if (detailList.length > 0) {
			let chose = detailList.filter((v) => v.id == data.id)[0];
			let number = detailList.indexOf(chose);
			if (number > -1) {
				this.previousDetail = detailList[number - 1];
			}
		}
		let previousDetail = this.previousDetail;
		return (
			<React.Fragment>
				{previousDetail ? (
					<div className={`imm_left ${type === 'face' ? 'face-style' : ''}`} onClick={this.changeDetailView.bind(this, previousDetail, false)}>
						<div className="imm_img">
							<WaterMark
								background={true}
								type="body"
								src={
									previousDetail[type + 'Path'] ||
									previousDetail.facePath ||
									(previousDetail.picUrl && previousDetail.picUrl.smallPicUrl) ||
									(previousDetail.picUrl && previousDetail.picUrl.bigPicUrl)
								}
							/>
						</div>
						<p className="imm_left_p">
							<IconFont type={'icon-Arrow_Big_Left_Main'} theme="outlined" />
							上一个
						</p>
					</div>
				) : (
					<div className="null_left" />
				)}
			</React.Fragment>
		);
	}
}

export default PreviousDetail;
