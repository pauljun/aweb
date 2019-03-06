import React from 'react'
import { Modal, message } from 'antd'
import Upload from '../../../../components/Upload'
import { observer, inject } from 'mobx-react'
import { Form, Input } from 'antd-form-component'
import '../style/SystemLogo.scss'

@Form.create()
@inject('UserManagementStore')
@observer
class view extends React.Component{
  state = {
    systemLogo: ''
  }
  onOk = () => {
    let {form,UserManagementStore,cancel,userId} =this.props
    form.validateFields((err, values) => {
      if(err){
        return
      }
      UserManagementStore.setSystemMes(values,userId).then(res => {
        if(res.code === 200){
          message.success('添加成功')
          cancel()
        }else{
          message.error('添加失败，请重新上传')
        }
      })
    })
  }

  // 上传图片
  uploadDone(file){
    this.props.form.setFieldsValue({
      systemLogo: file
    })
  }

  render(){
    let {
      cancel
    } = this.props
    return (
      <Modal
        visible={true}
        title='添加'
        onOk={this.onOk.bind(this)}
        onCancel={cancel}
      >
        <div className='user-system-modal'>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Input
              label='系统名称'
              type='text'
              required
              name='systemName'
              placeholder='请输入系统名称'
              rules={[
                {
                  max: 11, message: `系统名称不超过${11}个字`
                }
              ]}
            />
            <Upload
              title="上传图片"
              icon="inbox"
              disabled={false}
              changeheadImg={this.uploadDone.bind(this)}
              imageUrl={this.state.systemLogo}
              className="systemLogoUpload"
            />            
             <Input 
              name='systemLogo'
              type='hidden'
              required
            /> 
          </Form>
        </div>
      </Modal>
    )
  }
}

export default view