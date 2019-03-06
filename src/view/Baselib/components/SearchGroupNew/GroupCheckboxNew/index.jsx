import React, { Component } from 'react'
import { Checkbox } from 'antd';
import { toJS } from 'mobx'
import IconFont from 'src/components/IconFont'
const CheckboxGroup = Checkbox.Group;
class GroupCheckbox extends Component {

  onCheckAllChange = (e) => {
    const { change, name, data } = this.props
    let checkedValues = []
    if(e.target.checked){
      data.forEach(item => {
        checkedValues.push(item.value)
      })
    }
    change && change({[name]: checkedValues})
  }
  onChange = (checkedValues) => {
    const { change, name } = this.props
    change && change({[name]: checkedValues})
  }
  render(){
    const { label = '标题', iconFont, data, value, showCheckAll=true } = this.props
    return (
      <div className='item'>
      <div className='label-data-repository'>
        {iconFont && <IconFont 
          type={iconFont}
          className="data-repository-icon"/>}
        {label}：
        {showCheckAll && (
          <Checkbox
            indeterminate={value && value.length > 0 && value.length !== data.length}
            onChange={this.onCheckAllChange}
            checked={value && value.length === data.length}
          >
            全选
          </Checkbox>
        )}
      </div> 
      <div className='item-content'>
        {data && <CheckboxGroup 
          value={toJS(value || [])} 
          onChange={this.onChange} 
          >
          {
            data.map((v,index) => {
              return <Checkbox 
              value={v.value} 
              key={v.value}
              >{v.label}</Checkbox>
            })
          }
        </CheckboxGroup>}
      </div>
    </div>
    )
  }
}

export default GroupCheckbox;