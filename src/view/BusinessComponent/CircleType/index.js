import React from 'react';
const splitNum = (data = 0) => {
	return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
export default class CircleComponent extends React.Component {
	constructor(props) {
		super(props);
		this.canvas = React.createRef();
		this.ctx = null;
		this.animate = null;
	}
	endValue = 0;
	animate = null;
	width = 100;
	height = 100;
	lineWidth = 10;
	hasText = true;
	componentDidMount() {
		this.init(this.props);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.value !== nextProps.value) {
			this.init(nextProps);
		}
	}
	init(props) {
		let { width, height, lineWidth, hasText, startColor, endColor } = props;
		this.width = width || 100;
		this.height = height || 100;
		this.lineWidth = lineWidth || 10;
		this.hasText = hasText || true;
		this.startColor = startColor || '#FF8800';
		this.endColor = endColor || '#FFAA00';
		this.renderCircle();
	}
	componentWillUnmount() {
		window.cancelAnimationFrame(this.animate);
		this.canvas = null;
		this.ctx = null;
	}
	renderCircle() {
		let canvas = this.canvas.current;
		this.ctx = canvas.getContext('2d');
		this.ctx.canvas.width = this.width;
		this.ctx.canvas.height = this.height;
		this.animate = window.requestAnimationFrame(this.drawOutCircle.bind(this));
	}

	drawOutCircle(timestamp) {
		let { hasText } = this.props;
		this.ctx.clearRect(0, 0, this.width, this.height);

		this.drawInCircle();

		//绘制根据百分比变动的环
		this.ctx.beginPath();
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.lineCap = 'round';
		let linearGradient = this.ctx.createLinearGradient(this.width, this.width / 2, 0, this.height);
		linearGradient.addColorStop(
			0,
			this.startColor
		);
		linearGradient.addColorStop(
			1,
			this.endColor
		);
		this.ctx.strokeStyle = linearGradient;

		//设置开始处为0点钟方向（-90*Math.PI/180）
		//x为百分比值（0-100）
		this.ctx.arc(
			this.width / 2,
			this.height / 2,
			this.width / 2 - this.lineWidth,
			-90 * Math.PI / 180,
			(this.endValue * 3.6 - 90) * Math.PI / 180
		);

		this.ctx.stroke();

		//showdom
		this.ctx.beginPath();
		// this.ctx.strokeStyle = linearGradient;
		//设置开始处为0点钟方向（-90*Math.PI/180）
		//x为百分比值（0-100）
		let angle1 = (this.endValue * 3.6 - 90) * Math.PI;

		let x1 = this.width / 2 + (this.width / 2 - this.lineWidth) * Math.cos(angle1 / 180);
		let y1 = this.height / 2 + (this.height / 2 - this.lineWidth) * Math.sin(angle1 / 180);
		this.ctx.arc(x1, y1, 6, 0, 2 * Math.PI);
		this.ctx.fillStyle = 'rgba(255,255,255,1)';
		this.ctx.fill();

		//绘制中间的文字
		let top1=this.height / 2 - 6 * this.width / 100
		this.drawText(this.props.tatol,top1, '#8899BB');
		this.ctx.font = `400 12px ResourceNormal`;
		this.ctx.fillStyle = '#333';
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';
		this.ctx.fillText(hasText ? this.props.textTop : '', this.width / 2, this.height / 2 - 18 * this.width / 100);
		if (this.endValue < this.props.percent) {
			this.endValue += 2;
			if (this.endValue > this.props.percent) {
				this.endValue = this.props.percent;
			}
			this.animate = window.requestAnimationFrame(this.drawOutCircle.bind(this));
		}
		//设置开始处为0点钟方向（-90*Math.PI/180）
		//x为百分比值（0-100）
		let angle2 = (this.endValue * 3.6 - 90) * Math.PI;
		let x2 = this.width / 2 + (this.width / 2 - this.lineWidth) * Math.cos(angle2 / 180);
		let y2 = this.height / 2 + (this.height / 2 - this.lineWidth) * Math.sin(angle2 / 180);
		this.ctx.arc(x2, y2, 6, 0, 2 * Math.PI);
		this.ctx.fillStyle = 'rgba(255,255,255,1)';
		this.ctx.fill();
		//绘制中间的文字
		this.ctx.font = `400 12px ResourceNormal`;
		this.ctx.fillStyle = '#333';
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';
		this.ctx.fillText(hasText ? this.props.textBottom : '', this.width / 2, this.height / 2 + 7 * this.width / 100);
		
		let top2=this.height / 2 + 18 * this.width / 100
		this.drawText(splitNum(this.props.value),top2, '#FF8800');
	}

	drawInCircle() {
		//起始一条路径
		this.ctx.beginPath();
		//设置当前线条的宽度
		this.ctx.lineWidth = this.lineWidth; //10px
		// this.ctx.shadowBlur = 6;
		// this.ctx.shadowColor = '#0A0A0D';
		//设置笔触的颜色
		this.ctx.strokeStyle = '#d7dbe6';
		//arc()方法创建弧/曲线（用于创建圆或部分圆）arc(圆心x,圆心y,半径,开始角度,结束角度)
		this.ctx.arc(this.width / 2, this.height / 2, this.width / 2 - this.lineWidth, 0, 2 * Math.PI);
		//绘制已定义的路径
		this.ctx.stroke();
		// shawdom
		// this.ctx.beginPath()
		// this.ctx.lineWidth = 10 //10px
		// //设置笔触的颜色
		// this.ctx.strokeStyle = 'rgb(54,62,93)'
		// //arc()方法创建弧/曲线（用于创建圆或部分圆）arc(圆心x,圆心y,半径,开始角度,结束角度)
		// this.ctx.arc(
		//     this.width / 2,
		//     this.height / 2,
		//     this.width / 2 - 5,
		//     0,
		//     360
		// )
		// //绘制已定义的路径
		// this.ctx.stroke()
	}

	drawText(value,top, color = '#000') {
		this.ctx.font = `27px ResourceNormal`;
		this.ctx.fillStyle = color;
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'center';
		this.ctx.fillText(splitNum(value),this.width / 2, top);

		this.ctx.font = `${10 * this.width / 100}px ResourceNormal`;
		this.ctx.fillStyle = '#eee';
		this.ctx.textBaseline = 'hanging';
		this.ctx.textAlign = 'center';
		// this.ctx.fillText(
		//     '%',
		//     this.width / 2 + 18 * this.width / 100,
		//     this.height / 2 + 10 * this.width / 100
		// )
	}
	render() {
		return <canvas ref={this.canvas} />;
	}
}
