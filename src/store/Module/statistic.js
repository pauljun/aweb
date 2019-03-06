import { observable, action } from 'mobx';
import Service from '../../service/StatisticService';

class StatisticStore {
	@observable total = 0;
	@observable
	searchData = {
		begin: null,
		end: null,
		type: 1,
		pageSize: 10,
		currentPage: 1
	};

  initData() {
    this.setData({
      searchData: {
        begin: null,
        end: null,
        type: 1,
        pageSize:10,
        currentPage:1
      }
    })
  }
  /**编辑搜索条件 */
	updateSearchData( options) {
    this.setData( {
      searchData: Object.assign({}, this.searchData, options)
    })
  }
  
	/*搜索*/
	search() {
		const searchData = this.searchData;
		let data = {
			begin: searchData.begin + '.000',
			end: searchData.end + '.000',
			type: searchData.type
		};
		return Service.getList(data);
	}

	downloadExcel() {
		let searchData = this.searchData;
		let options = {
			type: searchData.type,
			startTime: searchData.begin,
			endTime: searchData.end
		};
		return Service.exportStatisticsLog(options);
	}

	/* save */
	save(options) {
		// let saveData = Object.assign({},this.getDataBy().saveData, { ...options })
		return Service.save(options);
	}
	@action
	@action
	setData(json) {
		for (var k in json) {
			this[k] = json[k];
		}
	}
}

export default new StatisticStore();
