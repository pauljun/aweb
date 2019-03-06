import React from 'react'
import { Input } from 'antd'

import './index.scss';

const TextArea = Input.TextArea
class MachineInfo extends React.Component {
  state = {
    value: this.props.libDetail.describe,
    errorShow: false
  }
  onSubmit = () => {
    return Promise.resolve({
      describe: this.describe,
      errorShow: this.state.errorShow
    })
  }

  handleDescChange = (e) => {
    this.describe = e.target.value;
    this.setState({
      value: e.target.value,
      errorShow: e.target.value.length > 200 ? true : false
    })
  }

  componentWillMount(){
    const { viewRef, libDetail } = this.props;
    this.describe = libDetail.describe
    viewRef && viewRef(this)
  }

  render() {
    const { libDetail, isEdit=false } = this.props;
    const { errorShow, value } = this.state
    return (
      <div className='lib-info-container'>
        <div className='lib-info'>
          <span className='info-label'>{'布控库互联网名称：'}</span><br/>
          <span className='info-value'>{libDetail.name}</span>
        </div>
        <div className='lib-info'>
          <span className='info-label'>{'一体机设备名：'}</span><br/>
          <span className='info-value'>{libDetail.machineName}</span>
        </div>
        <div className='lib-info'>
          <span className='info-label'>{'一体机SN码：'}</span><br/>
          <span className='info-value'>{libDetail.machineSn}</span>
        </div>
        <div className='lib-info'>
          <span className='info-label'>{'布控对象：'}</span><br/>
          <span className='info-value'>
            已选人员 <span className='highlight'>{libDetail.personCount}</span> 人
          </span>
        </div>
        <div className='lib-info machine-desc'>
          <span className='info-label'>{'描述：'}</span><br/>
          {!isEdit
            ? <span className='info-value'>
                {libDetail.describe || '-- 暂无描述 --'}
              </span>
            : <TextArea
                className='info-value'
                rows={4}
                //defaultValue={libDetail.describe}
                value={value}
                onChange={this.handleDescChange}
                placeholder='请输入专网库描述文字'
              />
          }
        </div>
        {isEdit && errorShow && <div className='lib-info'>
          <span className='info-label'></span><br/>
          <span className='info-value' style={{
            color: 'red',
            fontSize: '12px'
          }}>
            专网库描述不超过200个字
          </span>
        </div>} 
      </div>
    )
  }
}

export default MachineInfo