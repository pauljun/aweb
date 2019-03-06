import { Config } from '../Config';
export default {
  villageModule: {
    code: 107000,
    text: '小区管理',
  },
  enterVillageModule: {
    text: '进入小区管理界面',
    code: 107099,
    parent: 107000,
    moduleName: 'VillageView',
  },
  TABLE_LIST: {
    value: `${Config.api}cloud/community/villageManageListByPage`,
    label: '获取小区列表'
  },
  GET_CENTER_BY_VILLAGE:{
    value:`${Config.api}cloud/community/getCentersByVillage/<id>`,
    label:'获取小区分配的运营中心'
  },
  ASSIGNED_BY_VILLAGE:{
    value:`${Config.api}cloud/community/assignedByVillage`,
    label:'平台管理员给小区分配运营中心'
  },
  ASSIGNED_VILLAGE_DETAIL:{
    value:`${Config.api}cloud/community/getVillage`,
    label:'查看小区详情'
  },
  RESET_VILLAGE:{
    value:`${Config.api}cloud/community/resetVillage`,
    label:'重置小区'
  },
  ASSIGNED_BY_USER:{
    value:`${Config.api}cloud/community/assignedByUser`,
    label:'运营中心管理员给小区分配用户',
    logInfo: [{
      code: 107001,
      parent: 107000,
      text: '编辑小区'
     }]
  },
  villageDevice:{
    value:`${Config.api}villageDevice/queryVillageDevices`,
    label:'查询小区绑定设备'
  },
  villageDeviceUpdate:{
    value:`${Config.api}villageDevice/update`,
    label:'小区绑定设备'
  },
  queryUnbindedVillageDevices:{
    value:`${Config.api}villageDevice/queryUnbindedVillageDevices`,
    label:'查询未分配到小区的设备'
  },
  ADD_VILLAGE:{
    value:`${Config.api}cloud/community/createVillage`,
    label:'新增小区'
  },
  UPDATE_VILLAGE:{
    value:`${Config.api}cloud/community/updateVillage`,
    label:'更新小区'
  },
  VILLAGE_DEVICES:{
    value:`${Config.api}cloud/community/countDeviceByVillage`,
    label:'获取小区已分配设备'
  },
  VILLAGE_CENTER:{
    value:`${Config.api}cloud/community/getAssignedCentersByPage`,
    label:'获取小区已分配运营中心'
  },
  UN_VILLAGE_CENTER:{
    value:`${Config.api}cloud/community/getUnallocatedCentersByPage`,
    label:'获取小区未分配的运营中心'
  },
  ASSIGN_VILLAGE_DSTRIBUTION: {
    value:`${Config.api}cloud/community/assignedByVillage`,
    label:'平台管理员给小区分配运营中心'
  },
  COMMUNITY_IMPORTANT:{
    value:`${Config.api}import/communityData`,
    label:'社区数据导入'
  },
  COMMUNITY_IMPORTANT_DATA:{
    value:`${Config.api}import/listImportCommunityData`,
    label:'查询导入小区人员细信息'
  },
  COMMUNITY_DELETE_PEOPLE:{
    value:`${Config.api}cloud/community/batchDeleteVillagePeoples`,
    label:'批量删除小区人员信息'
  },
  VILLAGES_BY_CENTERID: {
    value: `${Config.api}cloud/community/getVillagesByCenterId`,
    label: '根据运营中心获取已分配和未分配的小区列表'
  },
  ASSIGNED_BY_CENTER: {
    value: `${Config.api}cloud/community/assignedByCenter`,
    label: '平台管理员给运营中心分配小区'
  }
}
