export default [
  {
    id: 1231561518661,
    title: '组件演示',
    name: 'Technology',
    isLocal: true,
    icon: 'icon-_Judgment',
    storeName: ['TechnologyStore'],
    url: 'Technology',
    component: require('../../view/Technology').default
  },
  {
    id: 22222211111,
    parentId: 1231561518661,
    title: '测试3级路由',
    name: 'Test3level',
    isLocal: true,
    icon: 'Test3level',
    storeName: ['TechnologyStore'],
    url: 'Technology/Test3level',
    component: require('../../view/Technology/view/Test3level').default
  },
  {
    id: 54325432543,
    parentId: 1231561518661,
    title: '地图组件',
    name: 'mapview',
    isLocal: true,
    storeName: ['TechnologyStore'],
    icon: 'mapview',
    url: 'Technology/mapview',
    component: require('../../view/Technology/view/map').default
  },
  {
    id: 521342532132543,
    parentId: 1231561518661,
    title: '地图选择设备',
    name: 'mapSelect',
    isLocal: true,
    storeName: ['TechnologyStore'],
    icon: 'mapSelect',
    url: 'Technology/mapSelect',
    component: require('../../view/Technology/view/mapSelect').default
  },
  {
    id: 4442211111,
    parentId: 22222211111,
    title: '测试3级子路由',
    name: 'Test3levelChild',
    storeName: ['TechnologyStore'],
    isLocal: true,
    icon: 'Test3levelChild',
    url: 'Technology/Test3level/Test3levelChild',
    component: require('../../view/Technology/view/Test3levelChild').default
  }
  ,
  {
    id: 432435432,
    parentId: 1231561518661,
    title: '地图缩放级别和中心点',
    name: 'mapZoomAndLevel',
    storeName: ['TechnologyStore'],
    isLocal: true,
    icon: 'mapZoomAndLevel',
    url: 'Technology/mapZoomAndLevel',
    component: require('../../view/Technology/view/mapZoomAndLevel').default
  },
  {
    id: 542342,
    parentId: 1231561518661,
    title: 'svg',
    name: 'svg',
    storeName: ['TechnologyStore'],
    isLocal: true,
    icon: 'mapZoomAndLevel',
    url: 'Technology/svg',
    component: require('../../view/Technology/view/svg').default
  },
  {
    id: 11231312313131,
    parentId: 1231561518661,
    title: 'face',
    name: 'face',
    storeName: ['TechnologyStore'],
    isLocal: true,
    icon: 'mapZoomAndLevel',
    url: 'Technology/face',
    component: require('../../view/Technology/view/face').default
  },
  {
    id: 12312312341,
    parentId: 1231561518661,
    title: 'faceContrast',
    name: 'faceContrast',
    storeName: ['TechnologyStore'],
    isLocal: true,
    icon: 'mapZoomAndLevel',
    url: 'Technology/faceContrast',
    component: require('../../view/Technology/view/faceContrast').default
  }
];
