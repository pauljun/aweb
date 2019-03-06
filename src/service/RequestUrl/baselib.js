import { Config } from '../Config';
const { api } = Config;

export default {
	faceLibModule: {
		code: 104100,
		text: '人脸图库'
  },
  enterFaceLibModule: {
    text: '进入人脸图库界面',
    code: 104199,
    parent: 104100,
    moduleName: 'faceLibrary',
  },
	bodyLibModule: {
		code: 104200,
		text: '人体图库'
  },
  enterBodyLibModule: {
    text: '进入人体图库界面',
    code: 104299,
    parent: 104200,
    moduleName: 'bodyLibrary',
  },
	vehicleLibModule: {
	  text: '车辆图库',
	  code: 105600,
	},
	// wifiLibModule: {
	//   text: 'wifi资源库',
	//   code: 105600,
	// },
	// enterWifiLibModule: {
  //   text: '进入wifi资源库',
  //   code: 105699,
  //   parent: 105600,
  //   moduleName: 'bodyLibrary',
  // },
  enterVehicleLibModule: {
    text: '进入车辆图库界面',
    code: 105699,
    parent: 105600,
    moduleName: 'bodyLibrary',
  },
  imgSearchModule: {
	  text: '以图搜图',
	  code: 105700,
  },
  enterImgSearchModule: {
    text: '进入以图搜图界面',
    code: 105799,
    parent: 105700,
    moduleName: 'imgSearch',
	},
	faceDetailModule: {
		code: 104105,
		parent: 104100,
		text: '查看人脸抓拍照片',
	},
	carDetailModule: {
		code: 105601,
		parent: 105600,
		text: '查看车辆抓拍图片',
	},
	// jumpfaceModule: {
	// 	code: 104103,
	// 	parent: 104100,
	// 	text: '人脸图库以图搜图',
	// },
	// jumpBodyModule: {
	// 	code: 104203,
	// 	parent: 104200,
	// 	text: '人体图库以图搜图',
	// },
	faceList: {
		value: `${api}largeData/faceList`,
		label: '人脸图库列表'
	},
	bodyList: {
		value: `${api}largeData/bodyList`,
		label: '人体图库列表'
	},
	vehicleList: {
		value: `${api}vehicle/getVehiclePassRecordsByFilterV2`,
		label: '车辆图库列表'
	},
	faceListSize: {
		value: `${api}largeData/faceListSize`,
		label: '人脸图库总数'
	},
	bodyListSize: {
		value: `${api}largeData/bodyListSize`,
		label: '人体图库总数'
	},
	faceFeatureList: {
		value: `${api}largeData/getFaceListByFeature`,
    label: '人脸以图搜图列表',
    logInfo: [
			{
        code: 105701,
				parent: 105700,
        text: '人脸照片以图搜图',
			}
		]
	},
	bodyFeatureList: {
		value: `${api}largeData/geBodyListByFeature`,
    label: '人体以图搜图列表',
    logInfo: [
			{
				code: 105702,
				parent: 105700,
        text: '人体照片以图搜图',
			}
		]
	},
	faceFeatureUrl: {
		value: `${api}largeData/face`,
		label: '通过Url获取人脸特征',
	},
	faceIdFeatureList: {
		value: `${api}largeData/getCaptureFaceInfoById`,
		label: '通过人脸id获取人脸信息',
	},
	bodyFeatureUrl: {
		value: `${api}largeData/pic`,
		label: '通过Url获取人体特征',
	
	},
	bodyIdFeatureList: {
		value: `${api}largeData/getBodyFeatruByEntity`,
		label: '通过id获取人体特征',
	},
	wifiDeviceList:{
		value: `${api}wifi/listWifiCaptureDevice`,
		label: '通过id获取人体特征',
	},
	wifiDataList:{
		value: `${api}wifi/listWifiDevice`,
		label: '通过id获取人体特征',
	}
	// wifiDataList:{
	// 	value: `http://result.eolinker.com/PUhaniK6b13706eb5f32032f296c385160fa358cbe9daf0?uri=mock/wifiList`,
	// 	label: '通过id获取人体特征',
	// },
	// wifiDeviceList:{
	// 	value: `http://result.eolinker.com/PUhaniK6b13706eb5f32032f296c385160fa358cbe9daf0?uri=mock/device/listWifiCaptureDevice`,
	// 	label: '通过id获取人体特征',
	// },
};
