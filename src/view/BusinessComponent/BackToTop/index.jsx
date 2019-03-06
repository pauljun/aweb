import React, { Component } from 'react';
import { BackTop, Tooltip } from 'antd';
import './index.scss';
import { uuid } from 'src/utils';
export default class BackToTop extends Component {
  id = 'tlzj' + uuid();
  onClick =() => {
    this.props.onClick && this.props.onClick()
  }
  render(){
    const { children=null, tip='返回顶部', onClick, height=400, className=''} = this.props;
    return (
      <div className={`container-box-tlzj ${this.id} ${className}`}>
        { children }
        <Tooltip title={tip}>
          <BackTop 
            className='baselib-back-top' 
            target={() => document.querySelector(`.${this.id}`)}
            onClick={this.onClick}
            visibilityHeight={height}
            ref={(ref) => this.backTopRef = ref}
          > 
          </BackTop>  
        </Tooltip>
      </div>
    )
  }
}