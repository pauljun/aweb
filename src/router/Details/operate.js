import asyncComponent from '../asyncComponent';
export default [
	{
		id: Math.random(),
		title: '历史告警',
		name: 'Detail',
		isLocal: true,
		isAction: true,
		icon: 'icon-Clock_Main',
		url: 'Detail',
		component:
			process.env.NODE_ENV !== 'production'
				? require('../../view/DetailsView').default
				: asyncComponent(() => require.ensure([], (require) => require('../../view/DetailsView')))
	},
	{
		id: Math.random(),
		parentId: 'detailViewComponent',
		title: '重点人员告警详情',
		name: 'faceDetail',
		isAction: true,
		isLocal: true,
		icon: 'icon-Clock_Main',
		url: 'Detail/faceDetail',
		component:
			process.env.NODE_ENV !== 'production'
				? require('../../view/DetailsView/view/faceAlarm').default
				: asyncComponent(() => require.ensure([], (require) => require('../../view/DetailsView/view/faceAlarm')))
	},
	{
		id: Math.random(),
		parentId: 'detailViewComponent',
		title: '外来人员告警详情',
		name: 'outsidersDetail',
		isAction: true,
		isLocal: true,
		icon: 'icon-Clock_Main',
		url: 'Detail/outsidersDetail',
		component:
			process.env.NODE_ENV !== 'production'
				? require('../../view/DetailsView/view/outsidersAlarm').default
				: asyncComponent(() => require.ensure([], (require) => require('../../view/DetailsView/view/outsidersAlarm')))
	},
	{
		id: Math.random(),
		parentId: 'detailViewComponent',
		title: '专网告警详情',
		name: 'AIOAlarmsDetail',
		isAction: true,
		isLocal: true,
		icon: 'icon-Clock_Main',
		url: 'Detail/AIOAlarmsDetail',
		component:
			process.env.NODE_ENV !== 'production'
				? require('../../view/DetailsView/view/AIOAlarm').default
				: asyncComponent(() => require.ensure([], (require) => require('../../view/DetailsView/view/AIOAlarm')))
	},
	{
		id: Math.random(),
		parentId: 'detailViewComponent',
		title: '魅影提醒详情',
		name: 'PhantomAlarmsDetail',
		isAction: true,
		isLocal: true,
		icon: 'icon-Clock_Main',
		url: 'Detail/PhantomAlarmsDetail',
		component:
			process.env.NODE_ENV !== 'production'
				? require('../../view/DetailsView/view/phantomAlarm').default
				: asyncComponent(() => require.ensure([], (require) => require('../../view/DetailsView/view/phantomAlarm')))
	},
	//社区常住人口详情
	{
		id: Math.random(),
		parentId: 'detailViewComponent',
		title: '常住人口详情',
		name: 'CommunityResidenceDetail',
		isAction: true,
		isLocal: true,
		icon: 'icon-TreeIcon_People_Main',
		url: 'Detail/CommunityResidenceDetail',
		storeName: ['CommunityDetailStore'],
		component:
			process.env.NODE_ENV !== 'production'
				? require('../../view/DetailsView/view/communityResidenceDetail').default
				: asyncComponent(() =>
						require.ensure([], (require) => require('../../view/DetailsView/view/communityResidenceDetail'))
					)
	},
	//社区流动人口详情
	{
		// id: '100001000232',
		id: Math.random(),
		// parentId: '100001010075',
		parentId: 'detailViewComponent',
		title: '流动人口详情',
		name: 'CommunityFlowDetail',
		isAction: true,
		isLocal: true,
		icon: 'icon-People_Other_Main',
		url: 'Detail/CommunityFlowDetail',
		storeName: ['CommunityDetailStore'],
		component:
			process.env.NODE_ENV !== 'production'
				? require('../../view/DetailsView/view/communityFlowDetail').default
				: asyncComponent(() =>
						require.ensure([], (require) => require('../../view/DetailsView/view/communityFlowDetail'))
					)
	},
	// 以下是图库的详情路由
	{
		// 人脸详情
		id: Math.random(),
		parentId: 'detailViewComponent',
		title: '人脸图库详情',
		name: 'DataRepositoryFaceDetail',
		isAction: true,
		isLocal: true,
		icon: 'icon-StructuredFace_Main',
		url: 'Detail/DataRepositoryFaceDetail',
		component:
			process.env.NODE_ENV !== 'production'
				? require('../../view/DetailsView/view/dataRepository/index.jsx').default
				: asyncComponent(() =>
						require.ensure([], (require) => require('../../view/DetailsView/view/dataRepository/index.jsx'))
					)
	},
	{
		// 人体详情
		id: Math.random(),
		parentId: 'detailViewComponent',
		title: '人体图库详情',
		name: 'DataRepositoryBodyDetail',
		isAction: true,
		isLocal: true,
		icon: 'icon-StructuredBody_Main',
		url: 'Detail/DataRepositoryBodyDetail',
		component:
			process.env.NODE_ENV !== 'production'
				? require('../../view/DetailsView/view/dataRepository/index.jsx').default
				: asyncComponent(() =>
						require.ensure([], (require) => require('../../view/DetailsView/view/dataRepository/index.jsx'))
					)
	},
	{
		// 车辆详情
		id: Math.random(),
		parentId: 'detailViewComponent',
		title: '车辆图库详情',
		name: 'DataRepositoryVehicleDetail',
		isAction: true,
		isLocal: true,
		icon: 'icon-Car_Main',
		url: 'Detail/DataRepositoryVehicleDetail',
		component:
			process.env.NODE_ENV !== 'production'
				? require('../../view/DetailsView/view/dataRepository/vehicle/index').default
				: asyncComponent(() =>
						require.ensure([], (require) => require('../../view/DetailsView/view/dataRepository/vehicle/index'))
					)
	},
	{
		// 以图搜图详情
		id: Math.random(),
		parentId: 'detailViewComponent',
		title: '以图搜图详情',
		name: 'DataRepositoryimgSearchDetail',
		isAction: true,
		isLocal: true,
		icon: 'icon-Imge_Main',
		url: 'Detail/DataRepositoryimgSearchDetail',
		component:
			process.env.NODE_ENV !== 'production'
				? require('../../view/DetailsView/view/dataRepository/imgSearch/index').default
				: asyncComponent(() =>
						require.ensure([], (require) => require('../../view/DetailsView/view/dataRepository/imgSearch/index'))
					)
	},
	{
		// 生成轨迹页面
		id: Math.random(),
		parentId: 'detailViewComponent',
		title: '生成轨迹',
		name: 'DataRepositoryimgTrajectory',
		isAction: true,
		isLocal: true,
		icon: 'icon-Trajectory_Main',
		url: 'Detail/DataRepositoryimgTrajectory',
		component:
			process.env.NODE_ENV !== 'production'
				? require('../../view/DetailsView/view/dataRepository/trajectory/index').default
				: asyncComponent(() =>
						require.ensure([], (require) => require('../../view/DetailsView/view/dataRepository/trajectory/index'))
					)
	}
];
