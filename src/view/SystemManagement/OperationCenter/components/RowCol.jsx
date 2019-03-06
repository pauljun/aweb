import React from 'react'
import {
  Form,
} from 'antd'

export default ({
  wrapperCol,
  label,
  labelCol,
  ...props
}) => {
  return (
    <Form.Item
      label={label}
      labelCol={labelCol}
      wrapperCol={{
        span: wrapperCol.span,
        offset: !label ? labelCol.span : 0
      }}
      {...props}
    >
      {props.children}
    </Form.Item>
  )
}