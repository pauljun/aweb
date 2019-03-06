import { Config } from '../Config';
const { api } = Config;

export default {
	comEntryModule: {
		code: 106700,
		text: '社区管理',
  },
  enterComEntryModule: {
    code: 106799,
    parent: 106700,
		text: '进入社区管理界面',
		moduleName: 'commmuityEntry'
	},
	comResdModule: {
		code: 106800,
		text: '常住人口管理',
  },
  enterComResdModule: {
    code: 106899,
    parent: 106800,
		text: '进入常住人口管理界面',
		moduleName: 'CommunityRegistered'
	},
	comFlowModule: {
		code: 106900,
		text: '流动人口管理',
  },
  enterComFlowModule: {
    code: 106999,
    parent: 106900,
		text: '进入流动人口管理界面',
		moduleName: 'CommunityUnRegistered'
	},
	PRESON_LIST: {
		value: `${api}cloud/community/listPersonalInformation`,
		label: '常住人口列表查询',
		logInfo: [
			{
				code: 106801,
				parent: 106800,
				text: '查看常住人口信息'
			}
		]
	},
	PERSON_DETAIL: {
		value: `${api}cloud/community/getPersonalInformationById`,
		label: '常住人口详情查询',
		logInfo: [
			{
				code: 106802,
				parent: 106800,
				text: '查看常住人口详情'
			}
		]
	},
	// 简要版
	PERSON_DETAIL_SIMPLE: {
		value: `${api}cloud/community/getPeopleBasicInfo`,
		label: '常住人口详情查询',
		logInfo: [
			{
				code: 106802,
				parent: 106800,
				text: '查看常住人口详情'
			}
		]
	},
	PERSON_DETAIL_THREE_CAPRE: {
		value: `${api}cloud/community/getPeopleRecentInfo`,
		label: '常口最近一次出现时间及地点以及三天内出现次数',
	},
	PERSON_COUNT: {
		value: `${api}cloud/community/countSnappingTimesForPeople`,
		label: '常住人口近七天抓拍次数（人员维度）'
	},
	PERSON_COUNT_NUMBR: {
		value: `${api}cloud/community/countSnappingTimesForPeopleByVillage`,
		label: '常住人口抓拍数（小区维度）'
	},
	PERSON_COUNT_TYPE: {
		value: `${api}cloud/community/countPeopleTypeByVillageIds`,
		label: '常住人口分类统计图'
	},
	PERSON_FACE_LIST: {
		value: `${api}cloud/community/faceList`,
		label: '常住人口活动轨迹查询'
	},
	FLOW_LIST: {
		value: `${api}cloud/community/listFlowFace`,
    label: '流动人口列表查询',
    logInfo: [
			{
				code: 106901,
				parent: 106900,
				text: '查看流动人口信息'
			}
		]
	},
	FLOW_DETAIL: {
		value: `${api}cloud/community/getBasicInfoByVid`,
    label: '流动人口详情查询',
    logInfo: [
			{
				code: 106902,
				parent: 106900,
				text: '查看流动人口详情'
			}
		]
	},
	FLOW_COUNT: {
		value: `${api}cloud/community/countSnappingTimesForVid`,
		label: '流动人口近七天抓拍次数（人员维度）'
	},
	FLOW_COUNT_TYPE: {
		value: `${api}cloud/community/countVidTypeByVillageIds`,
		label: '流动人口分类统计图'
	},
	FLOW_COUNT_NUMBR: {
		value: `${api}cloud/community/countSnappingTimesForVidByVillage`,
		label: '流动人口近七日抓拍数（小区维度）'
	},
	PEOPLE_TAGS: {
		value: `${api}cloud/community/updatePeopleTags`,
		label: '修改标签',
		logInfo: [
			{
        type: 'residence',
				code: 106803,
				parent: 106800,
				text: '给常住人口打标签'
			},
			{
        type:'flow',
				code: 106903,
				parent: 106900,
				text: '给流动人口打标签'
			}
		]
	},

	// 小区
	COMMUNITY_LIST: {
		value: `${api}cloud/community/villagesOverviewListByPage`,
		label: '小区总览列表查询'
	},
	// 小区
	COMMUNITY_SIMPLE_LIST: {
		value: `${api}cloud/community/getVillagesForShortInfo`,
		label: '小区总览列表查询(简要)'
	},
	COMMUNITY_PERSON_IDS: {
		value: `${api}cloud/community/getPermanentInfoByVillageIds`,
		label: '根据小区id获取小区常驻人口数以及平均每天抓拍数'
	},
	COMMUNITY_FLOWPERSON_IDS: {
		value: `${api}cloud/community/getFlowInfoByVillageIds`,
		label: '根据小区id获取小区流动人口数以及平均每天抓拍数'
	},
	COMMUNITY_PEOPLE_COUNT: {
		value: `${api}cloud/community/countPeopleByVillageIds`,
		label: '已登记、未登记人口数量统计'
	},
	COMMUNITY_DEVICES: {
		value: `${api}villageDevice/queryVillageDevices`,
		label: '查询小区绑定设备'
	},
	COMMUNITY_SOLIDDATA: {
		value: `${api}cloud/community/countVillageSolidData`,
		label: '小区数据统计面板'
	},
	COMMUNITY_DEVICECOUNT: {
		value: `${api}cloud/community/countDeviceByVillage`,
		label: '小区实有设备统计'
	},
	COMMUNITY_SELECT_DEVICE: {
		value: `${api}cloud/community/selectCommunityDeviceByUserId`,
		label: '查询用户权限下的所有小区设备列表'
	},
	COMMUNITY_ACCESS: {
		value: `${api}cloud/community/listAccessRecordByPeopleId`,
		label: '获取门禁信息'
	},
	COMMUNITY_FACEFEATURE: {
		value:`${api}largeData/face`,
		label:'提取人脸特征'
	},
	HOUSE_POWER: {
		value:`${api}cloud/community/selectElectricDetailDatas`,
		label:'获取电费信息'
	},
	PERSON_FOCUS:{
	 value:`${api}cloud/community/updatePeopleFocus`,
	 label:'添加取消关注'
	}
}
  