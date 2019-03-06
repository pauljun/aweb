import React from 'react'
import { Input } from 'antd';
import IconFont from 'src/components/IconFont'
import './indexOnChange.scss'
// const Search = Input.Search
/**
 * props属性
 * size定义input的类型，
 *    default: fontSize:12px, height: 28px; (默认)
 *    lg: fontSize:14px, height: 32px;
 */
export default class SearchInput extends React.Component {
  state = {
    value: ''
  }
  timer = null;
  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }
  // 增加防抖
  onChange = event => {
    clearTimeout(this.timer);
    let value = event.target.value;
    //this.forceUpdate();
    this.setState({
      value
    })
    this.timer = setTimeout(() => {
      this.props.onChange && this.props.onChange(value);
    }, 500);
  }
  clickSuffix = () => {
    this.onChange({
      target:{
        value: ''
      }
    })
  }
  render(){
    const {className='', size='default', onChange, ...rest} = this.props
    const sizeClass = size === 'default' ? 'c-search-12' : 'c-search-14'
    const IconState = this.state.value ? <IconFont type="icon-Close_Main1" onClick={this.clickSuffix}/> : null
    return (
      <Input 
        {...rest}
        className={`cc-search ${sizeClass} ${className}`}
        onChange={this.onChange}
        prefix={<IconFont type="icon-Search_Main"/>}
        suffix={IconState}
        value={this.state.value}
      />
    )
  }
}
