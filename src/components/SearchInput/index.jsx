import React from 'react'
import { Input } from 'antd';
import './index.scss'
const Search = Input.Search
/**
 * props属性
 * size定义input的类型，
 *    default: fontSize:12px, height: 28px; (默认)
 *    lg: fontSize:14px, height: 32px;
 */

export default ({className='', size='default', onSearch, ...rest}) => {
  const sizeClass = size === 'default' ? 'c-search-12' : 'c-search-14'
  return (
    <Search 
      className={`c-search ${sizeClass} ${className}`}
      onSearch={onSearch}
      {...rest}
    />
  )
}
