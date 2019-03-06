import { httpRequest } from '../../utils/HttpUtil';
import { VILLAGE } from '../RequestUrl';

@httpRequest
class VillageService {
	/**
   * 小区列表
   * @param {Object} options
   */
	getVillageList(options) {
		return this.$httpRequest({
			url: VILLAGE.TABLE_LIST.value,
			method: 'POST',
			data: options
		});
	}

	/**
   *
   * @param {Object} options
   */
	getCentersByVillage(id) {
		return this.$httpRequest({
			url: VILLAGE.GET_CENTER_BY_VILLAGE.value.replace('<id>', id),
			method: 'GET'
		});
	}
	/**
   *获取小区已分配的运营中心
   * @param {Object} options
   */
	getAssignedCentersByPage(options) {
		return this.$httpRequest({
			url: VILLAGE.VILLAGE_CENTER.value,
			method: 'POST',
			data: options
		});
	}
	/**
   *	获取小区未分配的运营中心
   * @param {Object} options
   */
	getUnAssignedCentersByPage(options) {
		return this.$httpRequest({
			url: VILLAGE.UN_VILLAGE_CENTER.value,
			method: 'POST',
			data: options
		});
	}
	/**
   *	平台管理员给小区分配运营中心
   * @param {Object} options
   */
	distributionCenterToVillage(options) {
		return this.$httpRequest({
			url: VILLAGE.ASSIGN_VILLAGE_DSTRIBUTION.value,
			method: 'POST',
			data: options
		});
	}
	/**
   *
   * @param {Object} options
   */
	assignedByVillage(options) {
		return this.$httpRequest({
			url: VILLAGE.ASSIGNED_BY_VILLAGE.value,
			method: 'POST',
			data: options
		});
	}
	/**
   *
   * @param {Object} options
   */
	resetVillage(options) {
		return this.$httpRequest({
			url: VILLAGE.RESET_VILLAGE.value,
			method: 'POST',
			data: options
		});
	}
	/**
   *
   * @param {Object} options
   */
	addVillage(options) {
		return this.$httpRequest({
			url: VILLAGE.ADD_VILLAGE.value,
			method: 'POST',
			data: options
		});
	}
	/**
   *
   * @param {Object} options
   */
	updateVillage(options) {
		return this.$httpRequest({
			url: VILLAGE.UPDATE_VILLAGE.value,
			method: 'POST',
			data: options
		});
	}
	/**
   *
   * @param {Object} options
   */
	assignedByUser(options, description = '编辑小区') {
		let logInfo = {
			description,
			...VILLAGE.ASSIGNED_BY_USER.logInfo[0]
		};
		return this.$httpRequest({
			url: VILLAGE.ASSIGNED_BY_USER.value,
			method: 'POST',
			data: options,
			logInfo
		});
	}
	assignedVillageDetail(id) {
		return this.$httpRequest({
			url: `${VILLAGE.ASSIGNED_VILLAGE_DETAIL.value}/${id}`,
			method: 'get'
		});
	}

	// 获取小区已分配运营中心
	queryVillageDevices(options) {
		return this.$httpRequest({
			url: VILLAGE.villageDevice.value,
			method: 'POST',
			data: options
		});
	}

	updateVillageDevices(options) {
		return this.$httpRequest({
			url: VILLAGE.villageDeviceUpdate.value,
			method: 'POST',
			data: options
		});
	}
	queryUnbindedVillageDevices(options) {
		return this.$httpRequest({
			url: VILLAGE.queryUnbindedVillageDevices.value,
			method: 'POST',
			data: options
		});
	}

	// 小区人口信息导入
	/**
   *
   * @param {Object} options
   */
	UploadCommunityData(options) {
		return this.$httpRequest({
			url: VILLAGE.COMMUNITY_IMPORTANT.value,
			method: 'POST',
			data: options
		});
	}

	// 查询小区人口信息列表
	/**
   *
   * @param {Object} options
   */
	getListCommunityData(options) {
		return this.$httpRequest({
			url: VILLAGE.COMMUNITY_IMPORTANT_DATA.value,
			method: 'POST',
			data: options
		});
	}

	// 批量删除小区人员信息
	/**
   *
   * @param {Object} options
   */
	deleteCommunityPeople(options) {
		return this.$httpRequest({
			url: VILLAGE.COMMUNITY_DELETE_PEOPLE.value,
			method: 'POST',
			data: options
		});
	}

	/**获取运营中心已分配和未分配的小区列表 */
	getVillagesByCenterId(centerId){
		return this.$httpRequest({
			url: `${VILLAGE.VILLAGES_BY_CENTERID.value}/${centerId}`
		})
	}

	/**给运营中心分配小区 */
	assignedByCenter(options){
		return this.$httpRequest({
			url: VILLAGE.ASSIGNED_BY_CENTER.value,
			method: 'POST',
			data:options
		})
	}
}

export default new VillageService();
