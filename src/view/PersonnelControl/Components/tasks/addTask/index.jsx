import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
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
@BusinessProvider('MoniteeLibsStore', 'MoniteeTasksStore', 'UserStore' )
@observer
class MoniteeForm extends Component {
  state = {
    taskData: {
      taskType: 101501, //101501-黑名单 101502-未知人员布控 101503-魅影
      name:'', // 布控任务名称
			describe:'', // 布控任务描述
      startTime: moment(new Date()), // 开始时间
			endTime: moment().add('days',3), // 结束时间
			captureStartTime: '00:00:00', // 开始抓拍时间
			captureEndTime: '23:59:59', // 结束抓拍时间
      libId: [], // 布控库id
      device: [], // 布控范围
      alarmMode:['1', '2'], // 报警方式
      repeatMode: '8', // 重复方式
      acceptAlarmUser: [this.props.UserStore.userInfo.id] // 告警接收人员
    },
    errorShow: false,
  }
  componentWillMount() {
    const { MoniteeLibsStore, libType, MoniteeTasksStore } = this.props
    let taskType = 101501
    let libId = []
    let alarmThreshold = 80
    if(libType === 1){
      taskType = 101501
      // 重点人员默认布控阈值为85
      alarmThreshold = 85
    }else if(libType === 2){
      taskType = 101502
      // 外来人员默认布控阈值为80
      alarmThreshold = 80
    }else if(libType === 3){
      taskType = 101503
      // 魅影任务无布控库和阈值字段
      libId = undefined
      alarmThreshold = undefined
    }else if(libType === 4){
      taskType = 101504
      // 魅影任务无布控库和阈值字段
      alarmThreshold = 85
    }
    // 设置当前添加布控任务类型
    let taskData = Object.assign({}, this.state.taskData, {taskType, libId, alarmThreshold})
    this.setState({
      taskData
    })
  }
  /**提交数据前对部分数据进行处理 */
	handleData = (data) => {
		if(data.alarmMode){
			data.alarmMode=data.alarmMode.join(',')
		}
	}
  // 组件数据收集
  changeTasksData = (obj) => {
    let taskData = Object.assign({}, this.state.taskData, obj)
    this.setState({ taskData })
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
      this.handleData(taskData)
      // 对相机id进行处理
      let deviceIds = []
      for(let i = 0; i < taskData.device.length; i++){
        deviceIds.push(taskData.device[i].id)
      }
      taskData.device = deviceIds;
      this.props.MoniteeTasksStore.onSubmit(taskData).then(res => {
        if(res && res.code === 200){
          message.success('添加成功')
          this.props.changeModel(1)
        }
      })
    })
  }
  render() {
    const { taskData, errorShow, selectList } = this.state
    let title = ['新建重点人员布控任务', '新建外来人员告警任务', '新建魅影告警任务', '新建专网套件布控任务']
    let libsTitle = ['重点人员','合规人员','魅影','布控对象']
    return (
      <div className='monitee_tasks_add'>
        <div className="task_top">
          <h1 className='tasks_add_title'>{title[this.props.libType - 1]}</h1>
        </div>
        <Form
        >
          <h2 className='header_step_title'>基本信息</h2>
             <BasicInfo 
            itemDate={taskData}
            changeTasksData={this.changeTasksData}
            form={this.props.form}
            libType={this.props.libType}
           />   
          {this.props.libType !== 3 && <div>
            <h2 className='header_step_title'>{libsTitle[this.props.libType - 1]}</h2>
             <LibsList 
            itemDate={taskData}
            errorShow={errorShow}
            changeTasksData={this.changeTasksData}
            form={this.props.form}
            libType={this.props.libType}
          />   
          </div>}
          <h2 className='header_step_title'>任务范围</h2>
            <TaskScope 
            errorShow={errorShow}
            itemDate={taskData}
            changeTasksData={this.changeTasksData}
            form={this.props.form}
          />  
          <h2 className='header_step_title'>任务接收</h2>
           <TaskReceive 
            itemDate={taskData}
            errorShow={errorShow}
            changeTasksData={this.changeTasksData}
            form={this.props.form}
            libType={this.props.libType}
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
