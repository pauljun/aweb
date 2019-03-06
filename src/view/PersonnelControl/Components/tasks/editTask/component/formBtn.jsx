// 表单数据提交和取消按钮
import React, { Component } from 'react'
import { Button } from 'antd'
const FormBtn = (props) => {
  return (
    <div className="form-btn-list">
      <Button className="btn-cancle btn" onClick={props.cancleSubmit.bind(this,props.index)}>取消</Button>
      <Button className="btn-sure btn" onClick={props.toSubmit}>确定</Button>
    </div>
  )
}
export default FormBtn