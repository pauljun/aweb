import { observable } from 'mobx';
import TasksService from '../../../service/PersonnelControlService/TasksService';

class MoniteeTasks {
  @observable  
  searchData = {
      name: '',
      pageSize: 500,
      listType: 2, //2-布控任务列表 告警列表类型: 1-全部任务（默认）  2-布控任务列表（自己创建） 3-指派任务 4-本地任务
      taskType: 101501 //101501-黑名单 101502-未知人员布控
  }
  /**初始化查询条件 */
  initData(){
    this.searchData = {
      name: '',
      pageSize: 500,
      listType: 2, // 2-布控任务列表 告警列表类型: 1-全部任务（默认）  2-布控任务列表（自己创建） 3-指派任务 4-本地任务
      taskType: 101501 //101501-黑名单 101502-未知人员布控 101503-魅影

    }
  }
  /**编辑查询条件 */
   editSearchData(options) {
    return new Promise(resolve => {
      let params = Object.assign({}, this.searchData, { ...options })
      this.searchData = params
      resolve()
    })
  }
  /**获取布控任务 */
  getList(option) {
    let searchData = Object.assign({},this.searchData,option)
    return TasksService.getList(searchData).then(res => {
      return res.list
    })
  }
  /**根据id获取布控任务详情 */
  getDetailById(id) {
    return TasksService.getTaskDetail(id).then(item => {
      return item
    })
  }
  /**根据id开始或暂停任务 */
  onStartPause({id, type, taskType, taskName}) {
    return TasksService.startPause({id, type, taskType, taskName})
  }
  /**添加/编辑布控任务 */
  onSubmit(values, taskType) {
    return TasksService.submit(values, taskType).then(data => {
      if (data) {
        return data
      } else {
        console.log('error')
        return Promise.reject()
      }
    })
  }
  /**根据id删除布控任务 */
  delItemById(id){
    return TasksService.delItemById(id)
  }
  /**设置忽略/取消忽略他人授权的布控任务报警 */
  setWhetherIgnoreAlarm(options){
    return TasksService.setWhetherIgnoreAlarm(options)
  }
}
export default new MoniteeTasks();