import React from 'react'
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import cookie from 'js-cookie'
import { Button, Upload, message, Modal } from 'antd'
import lyService from 'src/service/lyService';
import './Upload.scss'
import Socket from '../../../../../../libs/Socket';
@BusinessProvider('MoniteeLibsStore', 'UserStore')
class uploadComponent extends React.Component {
  state = {
    loading: false,
    status: null,
    visable: false,
    btnLoading: false,
    disabled:false
  }
  /**上传文件格式验证 */
  beforeUpload(file) {
    if (file.type !== 'application/vnd.ms-excel' && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      message.error('请输入excel格式的文件！')
      return false
    }
    this.setState({
      loading: true
    })
    return file
  }
  onChange(e) {
    let res = e.file.response
    if (e.file.status === 'done') {
      this.setState({
        loading: false,
        message: res.message,
        status: res.code,
        visable: true,
        filePath: res.result.filePath || '',
        addList: res.result.addList || [],
        delList: res.result.delList || [],
        updateList: res.result.updateList || [],
        machineName: res.result.machineName || undefined
      })
    }
  }

  /**关闭弹窗 */
  cancel = () => {
    this.setState({
      visable: false
    })
  }
  /**确定 */
  ok() {
    let { addList, delList, updateList } =this.state
    this.cancel()
    if(this.state.status === 200){
      this.setState({
          btnLoading: true
      })
      if(addList.length === 0 && delList.length === 0 && updateList.length === 0){
        this.setState({
          btnLoading: false
        })
          return
      }else{
        //this.props.socketModel.setModal(this.props.storeId)
        this.Modal = Modal.info({
          title: '导入布控库',
          content: (
            <div>
              <p>正在处理中,请稍后...</p>
            </div>
          ),
          onOk() {},
        });
        // this.props.MoniteeLibsStore.saveMachineExcel(this.state.filePath).then(() => {
        //   this.props.UserStore.updateFilePath(this.state.filePath)
        //   this.setState({
        //     btnLoading: false,
        //     visable: false,
        //     disabled:true
        //   })
        // })
        this.props.MoniteeLibsStore.saveMachineExcel({
          fileName: this.state.fileName,
          filePath: this.state.filePath
        }).then(() => {
          this.props.UserStore.updateFilePath(this.state.filePath)
          Socket.once('LIbIMPORTUPDATE',() => {
            this.Modal.destroy()
          })
          this.setState({
            btnLoading: false,
            visable: false,
            disabled:true
          })
        })
      }          
    }
  }
  // 自定义上传
  customRequest = ({ file }) => {
    lyService.uploadImgToLy({file, expiretype: 2}).then(
      ({ file, result }) => {
        let filePath = file.url
        let fileName = file.name
        if(!filePath){
          message.error('文件导入失败，请重试！')
           this.setState({
            loading: false,
          })
          return
        }
        this.props.MoniteeLibsStore.uploadMachineMonitorLibs({fileName,filePath}).then(res => {
          if(res){
            this.setState({
              loading: false,
              message: res.message,
              status: res.code,
              visable: true,
              filePath,
              fileName,
              addList: res.result.addList || [],
              delList: res.result.delList || [],
              updateList: res.result.updateList || [],
              machineName: res.result.machineName || undefined
            })
          }
        },(error) => {
          this.setState({
            loading: false,
          })
        })
      }
    )
  }
  render() {
    const {
      loading,
      visable,
      status,
      messager,
      addList,
      delList,
      updateList,
      btnLoading,
      machineName
    } = this.state
    let messagers = !!messager ? messager.split(',') : ''
    const fileType = 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    return (
      <div>
        <Upload
          headers={{ Authorization: cookie.get('token') }}
          showUploadList={false}
          //action='/api/alarm/uploadMachineMonitorLibs'
          beforeUpload={this.beforeUpload.bind(this)}
          //onChange={this.onChange.bind(this)}
          accept={fileType}
          customRequest={this.customRequest}
        >
          <Button
            icon='16-photo-upload'
            type='primary'
            loading={loading}
            //disabled={disabled}
            //title={disabled?'当前导入未完成，请稍后...':''}
          >
            导入布控库
          </Button>
        </Upload>
        <Modal
          title={status === 200 ? '导入专网布控库成功' : '导入布控库失败'}
          visible={visable}
          width={720}
          wrapClassName='library-modal-wrapper'
          footer={null}
          onCancel={this.cancel}
        >
          <div className='notice'>
            <div className={status === 200 ? 'success' : 'failure'}></div>
          </div>
          {status !== 200 ?
            <div className='error-mes'>
              {messagers && messagers.map((v,i) => <div key={i} >{v}</div>)}
            </div> :
            <div className='success-list'>
              <div className='ul'>
                <div className="ul-tlt">新增布控库：</div>
                <ul>
                  {addList && addList.length ? addList.map((v, k) =>
                    <li key={k}>{v.name}</li>
                  ) : '无'}
                </ul>
              </div>
              <div className='ul'>
                <div className="ul-tlt">删除布控库：</div>
                <ul>
                  {delList && delList.length ? delList.map((v, k) =>
                    <li key={k}>{v.name}</li>
                  ) : '无'}
                </ul>
              </div>
              <div className='ul'>
                <div className="ul-tlt">更新布控库： </div>
                <ul>
                  {updateList && updateList.length ? updateList.map((v, k) =>
                    <li key={k}>{v.name}</li>
                  ) : '无'}
                </ul>
              </div>
              <div className='ul'>
                <div className="ul-tlt">修改一体机名称： </div>
                <ul>
                  <li>{machineName || '无'}</li>
                </ul>
              </div>
            </div>
          }
          <div className='ok-btn'>
            <Button
              style={{marginLeft:'16px'}}
              onClick={this.cancel}
            >
              取消
            </Button>
            <Button
              type='primary'
              onClick={this.ok.bind(this)}
              loading={btnLoading}
            >
              确定
            </Button>
          </div>
        </Modal>
      </div>
    )
  }
}

export default uploadComponent