import React,{ Component } from 'react';
import { Slider, InputNumber } from 'antd';
import './index.scss'

class ScoreSlider extends Component {
  change = data => {
    const { name, onChange } = this.props
    onChange(data)
  }
  render(){
    return (
      <div className={`score-slider ${this.props.libType === 2 ? 'outersider-style' : ''}`}>
        <InputNumber min={60} max={99} value={parseInt(this.props.value, 10)} onChange={this.change} style={{height:'32px'}}/>
        <div className="slider">
          <div className='min'>60</div>
          <Slider
            value={parseInt(this.props.value, 10)}
            min={60}
            max={99}
            onChange={this.change}
          />
          <div className='max'>99</div>
        </div>
        <div className="tip">{this.props.libType === 2 && '（相似度小于此阈值即触发告警）'}</div>
      </div>
    )
  }
}

export default ScoreSlider;
