import CommunityService from '../../../service/Community/CommunityService';
import { observable, action } from 'mobx';
import eventEmmiter from '../../../libs/Socket';

let searchDataInit = {
	vids: [],
	currentPage: 1,
	pageType: 0,
	pageSize: 99999,
	timeType: 3,
	startTime: '',
	endTime: ''
};

class CommunityDetail {
	@observable searchData = searchDataInit;
	/**获取初始的查询条件 */
	getInitSearchData() {
		return searchDataInit;
	}

	@action
	setData(json) {
		for (var k in json) {
			if (this.hasOwnProperty(k)) {
				this[k] = json[k];
			}
		}
		return Promise.resolve();
	}
	/**編輯搜索條件 */
	editSearchData(options) {
		return new Promise((resolve) => {
			let params = Object.assign({}, this.searchData, options);
			this.searchData = params;
			// this.setData({ searchData: params });
			resolve();
		});
	}
	/**初始化查询条件 */
	initData() {
		this.searchData = searchDataInit;
	}

	//常住人口列表查询
	getListPersonalInformation(option) {
		return CommunityService.getListPersonalInformation(option).then((res) => res.result);
	}

	//常住人口详情查询（简要）
	getPeopleBasicInfo(option) {
		return CommunityService.getPeopleBasicInfo(option).then((res) => res.result);
	}

	//常住人口近七天抓拍次数（人员维度）
	getCountPeople(option) {
		return CommunityService.getCountPeople(option).then((res) => res.result);
	}
	
	//常口最近一次出现时间及地点以及三天内出现次数
	getPeopleRecentInfo(option) {
		return CommunityService.getPeopleRecentInfo(option).then((res) => res.result);
	}

	//常住人口抓拍数（小区维度）
	getcountPeopleByVillage(option) {
		return CommunityService.getcountPeopleByVillage(option).then((res) => res.result);
	}

	//常住人口分类统计图
	getCountPeopleTypeByVillageIds(option) {
		return CommunityService.getCountPeopleTypeByVillageIds(option).then((res) => res.result);
	}
	// 常住人口活动轨迹查询
	getFaceList() {
		return CommunityService.getFaceList(this.searchData).then((res) => res.result);
	}

	// 流动人口列表查询
	getListFlowFace(option) {
		return CommunityService.getListFlowFace(option).then((res) => res.result);
	}

	// 流动人口详情查询
	getBasicInfoByVid(option) {
		return CommunityService.getBasicInfoByVid(option).then((res) => res.result);
	}
	// 流动人口近七天抓拍次数（人员维度）
	getCountFLowTimesForVid(option) {
		return CommunityService.getCountFLowTimesForVid(option).then((res) => res.result);
	}

	// 流动人口分类统计图
	getCountVidTypeByVillageIds(option) {
		return CommunityService.getCountVidTypeByVillageIds(option).then((res) => res.result);
	}

	// 流动人口近七日抓拍数（小区维度）
	getCountSnappingTimesForVidByVillage(option) {
		return CommunityService.getCountSnappingTimesForVidByVillage(option).then((res) => res.result);
	}

	// 修改人物标签
	updatePeopleTags(option) {
		
		return CommunityService.updatePeopleTags(option).then(() => 
			{eventEmmiter.emit('updateTag', option);}
		);
	}
	// 人员门禁信息
	getAccessList(option) {
		return CommunityService.getAccessList(option).then(res => {
			 return res.result});
	}
	//提取人脸特征
	getFaceFeature(option){
		return CommunityService.getCommunityFaceFeature(option).then(res => {
			return res.result
		})
	}
/**
* 获取电量
* @param {Object} option 
*/
getPower(option) {
	return CommunityService.getPower(option).then((res) => {
    let data =JSON.parse(res.result.replace(/\s/ig,''));
		return data;
	});
}
}

export default new CommunityDetail();
