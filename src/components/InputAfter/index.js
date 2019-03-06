import React from 'react';
import { Input } from 'antd';
import IconFont from 'src/components/IconFont';
import './index.scss';

/**
 * props属性
 * size定义input的类型，
 *    default: fontSize:12px, height: 28px; (默认)
 *    lg: fontSize:14px, height: 32px;
 */

export default ({ value, onChange, onCancel, className = '', size = 'default', ...rest }) => {
	const sizeClass = size === 'default' ? 'after-search-12' : 'after-search-14';
	return (
		<Input
			className={`after-search ${sizeClass} ${className}`}
			onChange={onChange}
			value={value}
			{...rest}
			prefix={
				<IconFont type={'icon-Search_Main'} theme="outlined" style={{ fontSize: '16px', color: 'rgba(0,0,0,.5)' }} />
			}
			suffix={
				value && <IconFont onClick={onCancel} type={'icon-Close_Main1'} theme="outlined" style={{ fontSize: '16px' }} />
			}
		/>
	);
};
