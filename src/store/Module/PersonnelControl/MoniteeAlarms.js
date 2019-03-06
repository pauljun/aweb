import { observable, action } from 'mobx';
import _ from 'lodash';
import moment from 'moment';
import AlarmsService from '../../../service/PersonnelControlService/AlarmService';
import eventEmmiter from '../../../libs/Socket';
const timerHandle = (options) => {
	if (options.timeType === 3) {
		options.endTime = new Date().valueOf();
		options.startTime = new Date(moment().subtract(3, 'd')).getTime();
	} else if (options.timeType !== 2) {
		options.endTime = new Date().valueOf();
		options.startTime = new Date().getTime() - options.timeType * 24 * 60 * 1000 * 60;
	}
	if (!options.timeType) {
		options.endTime = options.startTime = '';
	}
	options.timeType = null;
	return options;
};
const searchDataInit = {
	threshold: 60.0,
	startTime: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
	endTime: new Date().valueOf(),
	timeType: null,
	alarmOperationType: null,
	geoAddress: null,
	cameraIds: [],
	taskListIds: null,
	// installationSite: null,
	installationSites: null,
	noInstallationSites: null,
	libIds: [],
	sortType: 1,
	captureUids: '',
	page: 1,
	pageSize: 24
};
class MoniteeAlarms {
	@observable searchData = searchDataInit;

	/**获取初始的查询条件 */
	getInitSearchData() {
		return searchDataInit;
	}

	// 编辑搜索条件
	@action
	editSearchData(options) {
		let params = Object.assign({}, this.searchData, options);
		this.searchData = params;
		return new Promise((resolve) => resolve(true));
	}

	/**初始化查询条件 */
	initData() {
		this.searchData = searchDataInit;
	}

	getAlarmInfoList(params) {
		let searchParams = {
			infoId: params.infoId,
			// threshold: params.threshold.toFixed(1),
			threshold: params.threshold,
			page: params.page || 1,
			pageSize: params.pageSize || 100,
			sortType: 1
		};

		return AlarmsService.getList(searchParams).then((result) => {
			return { alarmInfoList: result.data, alarmInfoTotal: result.total };
		});
	}



	// 根据布控任务id查找相应的警情
	search(libType = 1) {
		let searchData = Object.assign({}, this.searchData);
		searchData = timerHandle(searchData);
		const {
			threshold,
			startTime,
			endTime,
			alarmOperationType,
			geoAddress,
			cameraIds,
			taskListIds,
			libIds,
			sortType,
			captureUids,
			page,
			pageSize,
			dealType,
			installationSite,
			noInstallationSites,
			installationSites
		} = searchData;

		// 处理deviceId，逗号分隔字符串
		const getDeviceId = (list) => {
			let deviceId = [];
			list.map((v) => {
				let item = v.split('/');
				if (item.length > 0) {
					return deviceId.push(item[0]);
				}
			});
			return deviceId.join(',');
		};
		let searchParams = _.pickBy({
			threshold: libType === 1 && threshold.toFixed(1),
			startTime,
			endTime,
			dealType,
			alarmOperationType,
			geoAddress,
			cameraIds: cameraIds.length ? getDeviceId(cameraIds) : null,
			taskListIds,
			libIds: libIds.length ? libIds.join(',') : null,
			sortType,
			captureUids,
			page,
			pageSize,
			installationSite,
			noInstallationSites,
			installationSites
		});
		return AlarmsService.getList(searchParams).then((result) => {
			return { list: result.data, total: result.total };
		});
	}

	/**处理警情 */

	updateItem(data, logData) {
		// eventEmmiter.emit('resolveAlarm', data);
		// return AlarmsService.updateItem(data);
		return AlarmsService.updateItem(data, logData).then((res) => {
		 eventEmmiter.emit('resolveAlarm', data);
		 return res
		})  
	}

  //获取警情详情
  // id: 警情id， 
  // libType 警情类型，保存日志需要
  // isRealAlarm 
	getDetail(options) {
		return AlarmsService.getDetail(options);
	}
	// 详情根据布控任务id查找相应的警情
	detailSearch(searchData, libType = 1) {
		searchData = timerHandle(searchData);
		const {
			threshold,
			startTime,
			endTime,
			alarmOperationType,
			geoAddress,
			cameraIds,
			taskListIds,
			libIds,
			sortType,
			captureUids,
			page,
			logTypes,
			pageSize,
			noInstallationSites,
			dealType
		} = searchData;
		
		// 处理deviceId，逗号分隔字符串
		const getDeviceId = (list) => {
			let deviceId = [];
			list.map((v) => {
				let item = v.split('/');
				if (item.length > 0) {
					return deviceId.push(item[0]);
				}
			});
			return deviceId.join(',');
		};
		let searchParams = undefined;
		if(searchData.logTypes) {
			searchParams = _.pickBy({
				threshold: libType === 1 && Number(threshold).toFixed(1),
				startTime,
				endTime,
				dealType,
				logTypes,
				alarmOperationType,
				geoAddress,
				cameraIds:cameraIds&&cameraIds.length ? getDeviceId(cameraIds) : null,
				taskListIds,
				libIds:libIds&&libIds.length ? libIds.join(',') : null,
				sortType,
				captureUids,
				noInstallationSites,
				page,
				pageSize
			});
		} else {
			searchParams = _.pickBy({
				threshold: libType === 1 && Number(threshold).toFixed(1),
				startTime,
				endTime,
				dealType,
				alarmOperationType,
				geoAddress,
				cameraIds:cameraIds&&cameraIds.length ? getDeviceId(cameraIds) : null,
				taskListIds,
				libIds:libIds&&libIds.length ? libIds.join(',') : null,
				sortType,
				captureUids,
				noInstallationSites,
				page,
				pageSize
			});
		}
		return AlarmsService.getList(searchParams).then((result) => {
			return { list: result.data, total: result.total };
		});
	}

  // 根据人脸或人体id获取结构化信息 
	getCaptureDetailInfoById(options) {
		return AlarmsService.getCaptureDetailInfoById(options);
	}
}

export default new MoniteeAlarms();
