import { observable, action } from 'mobx';
import { Promise } from 'core-js';
import LoggerService from '../../service/loggerService';

const initSearch = {
	userAgent:undefined,
	userName: undefined,
	module: undefined,
	function: undefined,
	organizationCode: undefined,
	current: 1,
	pageNum: 1,
	pageSize: 10,
	startTime: undefined,
	endTime: undefined,
	centerId: '',
} 

class LogManagementStore {
	/**搜索条件 */
	@observable
	searchData = initSearch

  // 初始化查询条件
  initData(searchData={}){
    return this.setData({
      searchData: Object.assign({}, initSearch, searchData)
    })
	}

	/**編輯搜索條件 */
	editSearchData(options) {
		let searchData = Object.assign({}, this.searchData, options);
		return this.setData({ searchData });
	}
	//日志查询
	searchLogList() {
		let searchData = this.searchData;
		return LoggerService.searchLoggerList(searchData).then(res => {
      return res.result;
    })
	}

	@action
	setData(json) {
		for (var k in json) {
			this[k] = json[k];
		}
		return Promise.resolve()
	}
}

export default new LogManagementStore();
