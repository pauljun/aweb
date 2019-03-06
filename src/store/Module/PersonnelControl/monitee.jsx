import { observable, action } from 'mobx';

class Monitee {
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
  
}
export default new Monitee();