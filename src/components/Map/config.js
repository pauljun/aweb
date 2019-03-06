export const AMapConfig = {
  resizeEnable: true,
  features: ['bg', 'road', 'building', 'point'],
  showBuildingBlock: true,
  // zooms: [3, 18],
  // viewMode: '3D',
  // center: [114.305215, 30.592935],
  // pitch: 75
  // mapStyle: 'amap://styles/5c0128931903683aaa757ee6b0273348'//样式URL
  showIndoorMap: false
};

/*地图聚合大小样式切换*/
export const IbsAMapStyles = [
  {
    url: 'https://webapi.amap.com/theme/v1.3/m1.png',
    size: new AMap.Size(53, 52),
    textColor: '#fff',
    offset: new AMap.Pixel(-26, -26)
  },
  {
    url: 'https://webapi.amap.com/theme/v1.3/m2.png',
    size: new AMap.Size(56, 55),
    textColor: '#fff',
    offset: new AMap.Pixel(-28, -27)
  },
  {
    url: 'https://webapi.amap.com/theme/v1.3/m3.png',
    size: new AMap.Size(66, 65),
    textColor: '#fff',
    offset: new AMap.Pixel(-33, -32)
  },
  {
    url: 'https://webapi.amap.com/theme/v1.3/m4.png',
    size: new AMap.Size(78, 77),
    textColor: '#fff',
    offset: new AMap.Pixel(-39, -38)
  },
  {
    url: 'https://webapi.amap.com/theme/v1.3/m5.png',
    size: new AMap.Size(90, 89),
    textColor: '#fff',
    offset: new AMap.Pixel(-45, -45)
  }
];

/*地图聚合大小样式切换*/
export const IbsAMapCustomStyles = [
  {
    url: require('../../assets/img/mapicon/POP_1_1~100_Normal.svg'),
    size: new AMap.Size(34, 34),
    textColor: '#000',
    offset: new AMap.Pixel(-18, -18)
  },
  {
    url: require('../../assets/img/mapicon/POP_2_100~200_Normal.svg'),
    size: new AMap.Size(40, 40),
    textColor: '#000',
    offset: new AMap.Pixel(-16, -16)
  },
  {
    url: require('../../assets/img/mapicon/POP_3_200~500_Normal.svg'),
    size: new AMap.Size(46, 46),
    textColor: '#000',
    offset: new AMap.Pixel(-18, -18)
  },
  {
    url: require('../../assets/img/mapicon/POP_4_500~1000_Normal.svg'),
    size: new AMap.Size(56, 56),
    textColor: '#000',
    offset: new AMap.Pixel(-20, -20)
  },
  {
    url: require('../../assets/img/mapicon/POP_5_＞1000_Normal.svg'),
    size: new AMap.Size(66, 66),
    textColor: '#000',
    offset: new AMap.Pixel(-24, -24)
  },
  {
    url: require('../../assets/img/mapicon/POP_5_＞1000_Normal.svg'),
    size: new AMap.Size(66, 66),
    textColor: '#000',
    offset: new AMap.Pixel(-24, -24)
  }
];
