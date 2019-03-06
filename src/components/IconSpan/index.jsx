import React from 'react';
import { Tooltip, Icon } from 'antd';
import IconFont from '../IconFont';
import './index.scss';

/**
 * mode: horizontal(水平) vertical(默认上下)
 */
const IconSpan = ({
  onClick = null,
  icon = '',
  title = '', // Icon的title
  label = '', // 显示文本
  className = '',
  mode = 'vertical',
  children = null,
  disabled = false,
  detail,
  placement = 'bottom',
  type,
  ...rest
}) => {
  const CurrentIcon = type === 'antd' ? Icon : IconFont;
  const modeClass =
    mode === 'vertical' ? 'icon-span-vertical' : 'icon-span-horizontal';
  const disabledClass = disabled ? 'disabled' : '';
  const content = (
    <span
      className={`icon-span ${disabledClass} ${modeClass} ${className}`}
      onClick={!disabled ? onClick : null}
      {...rest}
    >
      {icon && <CurrentIcon title={title} type={icon} />}
      {label && <span>{label}</span>}
      {children}
    </span>
  );
  if (!detail) {
    return content;
  }
  return (
    <Tooltip placement={placement} title={detail}>
      {content}
    </Tooltip>
  );
};

export default IconSpan;
