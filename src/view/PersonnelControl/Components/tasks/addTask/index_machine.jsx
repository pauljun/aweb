import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import { message, Popconfirm, Button } from 'antd'
import moment from 'moment'
import { BusinessProvider } from '../../../../../utils/Decorator/BusinessProvider';
//-基本信息--布控库添加--任务范围--任务接收
import BasicInfo from '../components/basicInfo'
import LibsList from '../components/libsList'
import TaskScope from '../components/tasksScope'
import TaskReceive from '../components/tasksReceive'
import { Input, Form } from 'antd-form-component'
import './index.scss'
@Form.create()
@BusinessProvider('MoniteeLibsStore', 'MoniteeTasksStore' )
@observer
class MoniteeForm extends Component {
  state = {
    taskData: {
      taskType: 101504, // 101504 - 一体机
      name:'', // 布控任务名称
			describe:'', // 布控任务描述
      startTime: moment(new Date()), // 开始时间
			endTime: moment().add('days',3), // 结束时间
			captureStartTime: '00:00:00', // 开始抓拍时间
			captureEndTime: '23:59:59', // 结束抓拍时间
      libId: [], // 布控库id
      device: [], // 布控范围
      alarmMode:"1,2,3", // 报警方式-一体机默认值 3-代表推动给一体机
      repeatMode: '8', // 重复方式-一体机默认值
      alarmThreshold: 85,
      acceptAlarmUser: null
    },
    errorShow: false,
    machineLibs:{}
  }
  // 组件数据收集
  changeTasksData = (obj) => {
    let taskData = Object.assign({}, this.state.taskData, obj)
    this.setState({ taskData })
  }
  //存储一体机布控库任务
	changeLibs=(v) => {
    this.setState({machineLibs:v})
    
	}
  onSubmit = () => {
    const { form } = this.props
    form.validateFields((err,data) => {
      if(err){
        this.setState({
          errorShow: true
        })
        return message.error('表单验证失败')
      }
      let taskData = Object.assign({}, this.state.taskData, data)
      //对收集的数据进行处理
      taskData.startTime = taskData.startTime * 1
			taskData.endTime = taskData.endTime * 1
      // 对相机id进行处理
      let deviceIds = []
      for(let i = 0; i < taskData.device.length; i++){
        deviceIds.push(taskData.device[i].id)
      }
      taskData.device = deviceIds
      this.props.MoniteeTasksStore.onSubmit(taskData).then(res => {
        if(res && res.code === 200){
          message.success('添加成功')
          this.props.changeModel(1)
        }
      })
    })
  }
  render() {
    const { taskData, errorShow, machineLibs } = this.state
    return (
      <div className='monitee_tasks_add'>
        <h1 className='tasks_add_title'>新建一体机布控任务</h1>
        <Form
        >
          <h2 className='header_step_title'>基本信息</h2>
          <BasicInfo 
            itemDate={taskData}
            changeTasksData={this.changeTasksData}
            form={this.props.form}
           /> 
          <h2 className='header_step_title'>重点人员</h2>
          <LibsList 
            itemDate={taskData}
            errorShow={errorShow}
            changeTasksData={this.changeTasksData}
            form={this.props.form}
            libType={this.props.libType}
            machineLibs={machineLibs}
            changeLibs={this.changeLibs}
          />
          <h2 className='header_step_title'>任务范围</h2>
          <TaskScope
            errorShow={errorShow}
            itemDate={taskData}
            changeTasksData={this.changeTasksData}
            form={this.props.form}
          />
          <div className='form-submit-btn'> 
            <Popconfirm
              title="确定放弃编辑吗？"
              onConfirm={() => this.props.changeModel(1)} 
              okText="确定" cancelText="取消"
            >
              <Button type="cancel">取消</Button>
            </Popconfirm>
            <Button
              type="primary"
              onClick={this.onSubmit}
            >
              确定
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default MoniteeForm
