import React from 'react'

import AuthComponent from 'src/view/BusinessComponent/AuthComponent';
import IconSpan from 'src/components/IconSpan';
import LibHeader from '../LibHeader';
import MachineInfo from './machineInfo';

import './machineDetail.scss';

class MachineDetail extends React.Component {

  render() {
    let { libDetail, onEdit, actionName } = this.props

    return (
      <div className='monitee-lib-info-wrapper'>
        <LibHeader title={'专网库详情'}>
          <div className='lib-info-edit'>
            <AuthComponent actionName={actionName}>
              <IconSpan 
                className='span-btn'  
                mode='inline'
                icon="icon-Edit_Main" 
                onClick={onEdit} 
                label='编辑' 
              />
            </AuthComponent>
          </div>
        </LibHeader>
        <MachineInfo 
          libDetail={libDetail}
        />
      </div> 
    )
  }
}

export default MachineDetail