import { httpRequest } from '../../utils/HttpUtil';
import { COMMUNITY } from '../RequestUrl';

@httpRequest
class CommunityService {
	//人员门禁信息
	getAccessList(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.COMMUNITY_ACCESS.value,
			method: 'POST',
			data: options
		});
	}
	//常住人口列表查询
	getListPersonalInformation(options = {}) {
		let logInfo = {
			...COMMUNITY.PRESON_LIST.logInfo[0]
		};
		return this.$httpRequest({
			url: COMMUNITY.PRESON_LIST.value,
			method: 'POST',
			data: options,
			logInfo
		});
	}

	//常住人口详情查询
	getPersonalInformationById(options = {}) {
		let logInfo = {
			description: `查看常住人口【${options.name}】的信息详情`,
			...COMMUNITY.PERSON_DETAIL.logInfo[0]
		};
		return this.$httpRequest({
			url: COMMUNITY.PERSON_DETAIL.value,
			method: 'POST',
			data: { id: options.id },
			logInfo
		});
	}

	//常住人口详情查询(简要)
	getPeopleBasicInfo(options = {}) {
		let logInfo = {
			description: `查看常住人口【${options.name}】的信息详情`,
			...COMMUNITY.PERSON_DETAIL_SIMPLE.logInfo[0]
		};
		return this.$httpRequest({
			url: COMMUNITY.PERSON_DETAIL_SIMPLE.value,
			method: 'POST',
			data: { id: options.id },
			logInfo
		});
	}

	//常口最近一次出现时间及地点以及三天内出现次数
	getPeopleRecentInfo(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.PERSON_DETAIL_THREE_CAPRE.value,
			method: 'POST',
			data: options
		});
	}

	//常住人口近七天抓拍次数（人员维度）
	getCountPeople(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.PERSON_COUNT.value,
			method: 'POST',
			data: options
		});
	}
	// 常住人口抓拍数（小区维度）
	getcountPeopleByVillage(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.PERSON_COUNT_NUMBR.value,
			method: 'POST',
			data: options
		});
	}

	// 常住人口分类统计图
	getCountPeopleTypeByVillageIds(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.PERSON_COUNT_TYPE.value,
			method: 'POST',
			data: options
		});
	}

	// 常住人口活动轨迹查询
	getFaceList(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.PERSON_FACE_LIST.value,
			method: 'POST',
			data: options
		});
	}

	// 流动人口列表查询
	getListFlowFace(options = {}) {
		let logInfo = {
			...COMMUNITY.FLOW_LIST.logInfo[0]
		};
		return this.$httpRequest({
			url: COMMUNITY.FLOW_LIST.value,
			method: 'POST',
			data: options,
			logInfo
		});
	}

	// 流动人口详情查询
	getBasicInfoByVid(options = {}) {
		let logInfo = {
			description: `查看流动人口【${options.vid}】的信息详情`,
			...COMMUNITY.FLOW_DETAIL.logInfo[0]
		};
		return this.$httpRequest({
			url: COMMUNITY.FLOW_DETAIL.value,
			method: 'POST',
			data: { vid: options.vid },
			logInfo
		});
	}
	// 流动人口近七天抓拍次数（人员维度）
	getCountFLowTimesForVid(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.FLOW_COUNT.value,
			method: 'POST',
			data: options
		});
	}

	// 流动人口分类统计图
	getCountVidTypeByVillageIds(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.FLOW_COUNT_TYPE.value,
			method: 'POST',
			data: options
		});
	}
	// 流动人口近七日抓拍数（小区维度）
	getCountSnappingTimesForVidByVillage(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.FLOW_COUNT_NUMBR.value,
			method: 'POST',
			data: options
		});
	}
	//修改人物标签
	updatePeopleTags(options = {}) {
		 let logInfo = {},
			option = {},
			choseList = [];
		if (options.peopleTags) {
			choseList = options.peopleTags.filter((v) => v.isDeleted === false);
		}
		let arr = [];
		for (let i = 0; i < choseList.length; i++) {
			arr.push(choseList[i].tagName);
		}
		option.peopleTags = options.peopleTags;
		if (options.type == 'flow') {
			option.vid = options.details.vid;
			logInfo = {
				description: `将流动人口【${options.details.vid}】标记为${arr.map(v => `【${v}】`)}`,
				...COMMUNITY.PEOPLE_TAGS.logInfo[1]
			};
		} else {
			option.peopleId = options.details.id;
			logInfo = {
				description: `将常住人口【${options.details.name}】标记为${arr.map(v => `【${v}】`)}`,
				...COMMUNITY.PEOPLE_TAGS.logInfo[0]
			};
		} 
		return this.$httpRequest({
			url: COMMUNITY.PEOPLE_TAGS.value,
			method: 'POST',
			data: option,
		  logInfo 
		});
	}

	//小区总览列表查询
	searchCommunityList(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.COMMUNITY_LIST.value,
			method: 'POST',
			data: options
		});
	}

	//小区总览列表查询(简要版)
	getVillagesForShortInfo(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.COMMUNITY_SIMPLE_LIST.value,
			method: 'POST',
			data: options
		});
	}

	//根据小区id获取小区常驻人口数以及平均每天抓拍数
	getPermanentInfoByVillageIds(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.COMMUNITY_PERSON_IDS.value,
			method: 'POST',
			data: options
		});
	}

	//根据小区id获取小区流动人口数以及平均每天抓拍数
	getFlowInfoByVillageIds(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.COMMUNITY_FLOWPERSON_IDS.value,
			method: 'POST',
			data: options
		});
	}

	//已登记、未登记人口数量统计
	getCountPeopleByVillIds(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.COMMUNITY_PEOPLE_COUNT.value,
			method: 'POST',
			data: options
		});
	}

	//查询小区绑定设备
	getvillageDevices(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.COMMUNITY_DEVICES.value,
			method: 'POST',
			data: options
		});
	}

	//小区数据统计面板
	getCountVillageSolidData(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.COMMUNITY_SOLIDDATA.value,
			method: 'POST',
			data: options
		});
	}

	//小区实有设备统计
	getCountDeviceByVillage(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.COMMUNITY_DEVICECOUNT.value,
			method: 'POST',
			data: options
		});
	}
	//查询用户权限下的所有小区设备列表
	selectCommunityDeviceByUserId(options = {}) {
		return this.$httpRequest({
			url: COMMUNITY.COMMUNITY_SELECT_DEVICE.value,
			method: 'POST',
			data: options
		});
	}
	//提取人脸特征
	getCommunityFaceFeature(options){
		return this.$httpRequest({
			url: COMMUNITY.COMMUNITY_FACEFEATURE.value,
			method: 'POST',
			data: options
		});	
	}
	//电量信息
	getPower(option) {
		return this.$httpRequest({
			url: COMMUNITY.HOUSE_POWER.value,
			method: 'post',
			data: option
		});
	}
//添加取消关注
UpdatePeopleFocus(option){
	return this.$httpRequest({
		url:COMMUNITY.PERSON_FOCUS.value,
		method:'post',
		data:option
	})
}
}

export default new CommunityService();
