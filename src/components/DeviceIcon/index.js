import React from 'react';
import IconFont from '../IconFont';
import { getCameraTypeIcon } from 'src/libs/Dictionary/mapIcon';
import PropTypes from 'prop-types';
import './index.scss';
export default function DeviceIcon({
  type,
  status,
  onlineClass = 'online-device',
  offlineClass = 'offline-device',
  className,
  ...props
}) {
  const options = getCameraTypeIcon(type, status);
  const onLine = status * 1 === 1;
  let iconClassName = onLine ? onlineClass : offlineClass;
  return (
    <IconFont
      type={options.icon}
      className={`${iconClassName} ${className ? className : ''}`}
      {...props}
    />
  );
}

DeviceIcon.propTypes = {
  type: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  status: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
