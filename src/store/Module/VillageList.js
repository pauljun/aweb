import { observable, action } from 'mobx';
import Service from '../../service/Community/VillageService';
import UserService from '../../service/UserService';

class VillageListStore {
	@observable
	searchData = {
		key: '',
		page: 1,
		pageSize: 10
	};

	@action
	initData() {
		this.searchData = {
			key: '',
			page: 1,
			pageSize: 10
		};
	}

	@action
	mergeSearchData(data) {
		this.searchData = Object.assign(this.searchData, { ...data });
	}

	getList() {
		let searchData = this.searchData;
		searchData.keyWord = searchData.key;
		return Service.getVillageList(searchData);
	}

	getUserList() {
		return UserService.queryUserList().then((res) => {
			if (Array.isArray(res.result.list)) {
				return res.result.list.map((item) => {
					return {
						id: item.id,
						parentId: item.organizationId,
						name: item.realName,
						type: 'user',
						title: item.realName
					};
				});
			} else {
				return [];
			}
		});
	}
	//查询小区运营中心列表
	getCentersByVillage(options) {
		return Service.getCentersByVillage(options);
	}
	//查询小区已分配运营中心列表
	getAssignedCentersByPage(options) {
		return Service.getAssignedCentersByPage(options);
	}

	//查询小区未分配运营中心列表
	getUnAssignedCentersByPage(options) {
		return Service.getUnAssignedCentersByPage(options);
	}

	// 平台管理员给小区分配运营中心
	distributionCenterToVillage(options) {
		return Service.distributionCenterToVillage(options);
	}

	assignedByUser(options) {
		return Service.assignedByUser(options);
	}

	/**添加小区 */
	addVillage(options) {
		return Service.addVillage(options);
	}
	/**查询小区已有设备 */
	queryVillageDevices(options) {
		return Service.queryVillageDevices(options);
	}
	/**查询小区未分配设备 */
	queryUnbindedVillageDevices(options) {
		return Service.queryUnbindedVillageDevices(options);
	}
	/**小区绑定设备 */
	updateVillageDevices(options){
		return Service.updateVillageDevices(options)
	}
	/**编辑小区 */
	updateVillage(options) {
		return Service.updateVillage(options);
	}

	/**查询小区 */
	getDetail(id) {
		return Service.assignedVillageDetail(id).then((res) => res.result);
	}

	// 社区数据导入
	UploadCommunityData(option) {
		return Service.UploadCommunityData(option);
	}

	// 查询导入的小区人员信息
	getListCommunityData(option) {
		return Service.getListCommunityData(option);
	}

	// 批量删除小区人员信息
	deleteCommunityPeople(option) {
		return Service.deleteCommunityPeople(option);
	}
	// 查询小区列表
	getCommunityList(option) {
		return Service.getVillageList(option);
	}
}

export default new VillageListStore();
