import { httpRequest } from '../../utils/HttpUtil';
import { TASKS } from '../RequestUrl';
import { message } from 'antd';

const taskTypeDict = [
  {type: 101501, logType: 'faceTask', text: '重点人员布控任务'},
  {type: 101502, logType: 'outsidersTask', text: '外来人员布控任务'},
  {type: 101503, logType: 'phantomTask', text: '魅影布防布控任务'},
  {type: 101504, logType: 'AIOTask', text: '专网套员布控任务'},
]

@httpRequest
class TasksService {
  /**获取布控任务列表 */
  getList(data = {}) {
    return this.$httpRequest({
      url: TASKS.getTaskList.value,
      method: 'post',
      data,
    }).then(res => {
      if (res && res.code === 200) {
        return res.result
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    });
  }
  /**设置忽略/取消忽略他人授权的布控任务报警 */
  setWhetherIgnoreAlarm(data = {}) {
    return this.$httpRequest({
      url: TASKS.setWhetherIgnoreAlarm.value,
      method: 'post',
      data
    }).then(res => {
      if (res && res.code === 200) {
        message.success('设置成功')
        return true
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    })
  }
  /**根据id删除布控库 */
  delItemById(id){
    return this.$httpRequest({
      url: `${TASKS.delete.value}${id}`,
      method: 'GET',
    }).then(res => {
      if(res && res.code === 200){
        message.success('删除成功')
        return res
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    })
  }
  /**添加、编辑布控任务 */
  submit(options, taskType) {
    const urlType = options.id ? 'editTask' : 'addTask';
    const taskInfo = taskTypeDict.find(v => v.type === (taskType || options.taskType));
    const logInfo = {
      description: `${options.id?'编辑':'添加'}${taskInfo.text}【${options.name}】`,
      ...TASKS[urlType].logInfo.find(v => v.type === taskInfo.logType)
    }
    return this.$httpRequest({
      url: TASKS[urlType]['value'],
      method: 'post',
      data: options,
      logInfo
    }).then(res => {
      if (res && res.code === 200) {
        return res
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    })
  }
  /**开始暂停任务 */
  startPause({id, type, taskType, taskName}) {
    const taskInfo = taskTypeDict.find(v => v.type === taskType);
    const logInfo = {
      description: `${type==='1'?'开启':'暂停'}${taskInfo.text}【${taskName}】`,
      ...TASKS.startPause.logInfo.find(v => v.type === taskInfo.logType)
    }
    return this.$httpRequest({
      url: TASKS.startPause.value,
      method: 'post',
      data: { ids: id, type },
      logInfo
    }).then(res => {
      if (res && res.code === 200) {
        return res
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    })
  }
  /**根据id获取布控任务详情 */
  getTaskDetail(id){
    return this.$httpRequest({
      url: `${TASKS.taskDetailUrl.value}${id}`,
      method: 'get'
    }).then(res => {
      if (res && res.code === 200) {
        return res.result
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    })
  }
}
export default new TasksService();
