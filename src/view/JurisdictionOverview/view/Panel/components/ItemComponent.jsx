import React from 'react'
import {
    Icon
} from 'antd'
import IconFont from 'src/components/IconFont'

export default ({
    label,
    icon,
    value
}) => <div className='resource-item'>
    <IconFont type={`${icon}`} />
    <span className='name'>{label}</span>
    <span className='font-resource-normal'>{value}</span>
</div>