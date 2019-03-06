import { Config } from '../Config';
const { api } = Config;

export default {
	videoSurveillanceModule: {
		code: 103900,
		text: '视频监控',
  },
  enterVideoSurveillanceModule: {
    text: '进入视频监控界面',
    code: 103999,
    parent: 103900,
    moduleName: 'VideoSurveillance',
  },
  deviceModule: {
    code: 104600,
		text: '设备管理'
  },
	enterDeviceModule: {
    text: '进入设备管理界面',
    code: 104699,
    parent: 104600,
    moduleName: 'DeviceView',
	},
	ScreenshotModule: {
		text: '视频截图',
		code: 103905,
		parent: 103900,
	},
	CAMERA_LIST: {
		value: `${api}device/selectDeviceByUserId`,
		label: '查询设备' // 用户总设备列表
	},
	CAMERA_LIST_ORG: {
		value: `${api}device/selectDeviceByOrgIds`,
		label: '根据组织查设备'
	},
	CAMERA_LIST_BY_OC_ID: {
		value: `${api}device/selectDeviceByOperationCenterIds`,
		label: '运营中心总设备列表'
	},
	CAMERA_TOTAL_BY_OCID: {
		value: `${api}device/selectDeviceCountByOperationCenterIds`,
		label: '获取运营中心下设备数量'
	},
	ACCESSCONTROL_LIST: {
		value: `${api}cloud/community/listAccessDevicesByCommunity`,
		label: '查询门禁'
	},
	GATE_LIST: {
		value: `${api}cloud/community/listTollgatesByCommunity`,
		label: '查询门禁'
	},
	WIFI_LIST: {
		value: `${api}cloud/community/listWifiDevicesByCommunity`,
		label: '查询WI-FI'
	},
	LY_TOKEN: {
		value: `${api}device/token/getLyTokenByCameraId/`,
		label: '获取摄像机Token'
	},
	FLV_VIDEO: {
		value: `<lyapi>v2/<cid>/live.flv?client_token=<token>`,
		label: '实时视频',
		logInfo: [
			{
				code: 103901,
				parent: 103900,
				text: '实时视频'
			}
		]
	},
	HLS_VIDEO: {
		value: `<lyapi>v2/<cid>/live.m3u8?client_token=<token>`,
		label: '实时视频',
		logInfo: [
			{
				code: 103901,
				parent: 103900,
				text: '实时视频'
			}
		]
	},
	HISTORY_VIDEO: {
		value: `<lyapi>v2/record/<cameraId>/playlist?client_token=<token>&begin=<begin>&end=<end>`,
		label: '历史视频',
		logInfo: [
			{
				code: 103902,
				parent: 103900,
				text: '查看历史视频'
      }
		]
	},
	DOWNLOAD_VIDEO: {
		value: '<lyapi>v2/record/<cid>/storage/ts?begin=<begin>&end=<end>&client_token=<token>&name=<name>',
		label: '录像下载',
  },
  LAST_SNAPSHOT: {
    value: '<lyapi>snapshots/last_snapshot?access_token=<token>',
		label: '请求某个cid对应的最新的一张截图文件',
  },
	LY_OBJECT_TOKEN: {
		value: `${api}device/token/getLyObjectToken`,
		label: '羚羊token'
	},
	CAMERA_STATUS: {
		value: `${api}device/getCameraStatus`,
		label: '设备状态'
	},
	LINGYANG_ORGS: {
		value: `${api}device/searchDeviceGroupByLY`,
		label: '羚羊云设备分组'
	},
	UPDATE_DEVICE_OCID: {
		value: `${api}device/updateDeviceOcIds`,
		label: '运营中心设备分配'
	},
	DETAIL_DEVICE: {
		value: `${api}device/getCameraInfoByDeviceId/<id>`,
		label: `查看摄像机信息`,
		logInfo: [
			{
				code: 104601,
        parent: 104600,
        text: '查看设备信息'
			}
		]
	},
	UPDATE_DEVICE_CAM: {
		value: `${api}device/updateDeviceByCameraVo`,
		label: '编辑摄像机',
		logInfo: [
			{
				code: 104602,
        parent: 104600,
        text: '编辑设备'
			}
		]
	},
	UPDATE_DEVICE_SOLDIER: {
		value: `${api}device/updateDeviceByCameraVo`,
		label: '编辑单兵',
		logInfo: [
			{
				code: 105502,
        parent: 105500,
        text: '编辑单兵名称'
			}
		]
	},
	UPDATE_DEVICE_GEO: {
		value: `${api}device/updateDeviceGeo`,
		label: '更新设备点位',
		logInfo: [
			{
				code: 104604,
        parent: 104600,
        text: '修改经纬度'
			}
		]
	},
	UPDATE_DEVICE_ORG: {
		value: `${api}device/updateDeviceOrgIds`,
		label: '分配摄像机',
		logInfo: [
			{
				code: 104603,
				parent: 104600,
        text: '分配设备'
			}
		]
	},
	UPDATE_DEVICE_GB_PTZ: {
		value: `<lyapi>cloudeye/v1/devices/<cameraId>/gbptz?client_token=<token>`,
		label: '国标摄像机云台',
	},
	UPDATE_DEVICE_PTZ: {
		value: `<lyapi>cloudeye/v1/devices/<cameraId>/ptz/rotation?client_token=<token>`,
		label: '智能摄像机云台',
	},
	getDeviceById: {
		value: `${api}device/getDeviceById/<id>`,
		babel: '根据ID获取设备信息'
	},
	updateStateByDeviceId: {
		value: `${api}device/updateStateByDeviceId/<deviceId>/<deviceData>`,
		babel: '根据设备ID更新设备状态'
	}
};
