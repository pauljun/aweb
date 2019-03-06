const cameraOrientation = [
  { value: '112901', label: '正东朝向', score: 90 },
  { value: '112903', label: '正南朝向', score: 180 },
  { value: '112902', label: '正西朝向', score: 270 },
  { value: '112904', label: '正北朝向', score: 0 },
  { value: '112905', label: '东南朝向', score: 135 },
  { value: '112906', label: '东北朝向', score: 45 },
  { value: '112907', label: '西南朝向', score: 225 },
  { value: '112908', label: '西北朝向', score: 315 }
];
/*字典*/
/*性别*/
const sex = [
  { value: null, label: '全部' },
  { value: '100001', label: '男' },
  { value: '100002', label: '女' }
  // { value: '100003', label: '双性' },
  // { value: '100004', label: '未知' }
];

/*婚姻状态*/
const marital = [
  { value: '115001', label: '未婚' },
  { value: '115002', label: '已婚' },
  { value: '115003', label: '丧偶' },
  { value: '115004', label: '离异' }
];
/* 门禁卡类型 */
const cardType = [
  { value: '113401', label: '正常' },
  { value: '113402', label: '禁用' },
  { value: '113403', label: '卡已过期' },
  { value: '113404', label: '卡已注销' }
];

/* 证件类型 */
const identifyType = [
  { value: '101301', label: '身份证' },
  { value: '101302', label: '军人证' },
  { value: '101303', label: '护照' },
  { value: '101304', label: '台胞证' },
  { value: '101305', label: '港澳通行证' },
  { value: '101306', label: '驾驶证' },

];

/* 人物标签 */
const peopleTitle = [
  { value: '118201', label: '昼伏夜出' },
  { value: '118202', label: '高龄老人' },
  { value: '118203', label: '常驻人口' },
  { value: '118204', label: '流动人口' },
  { value: '118205', label: '群居人员' }
];

/* 同屋关系 */
const roomMateType = [
  { value: '114501', label: '业主' },
  { value: '114502', label: '代理人' },
  { value: '114503', label: '家人' },
  { value: '114504', label: '租客' },
  { value: '114505', label: '临时客人' }
];

/* 民族 */
const nation = [
  // { value: '106900', label: '民族' },
  { value: '106901', label: '汉' },
  { value: '106902', label: '壮' },
  { value: '106903', label: '满' },
  { value: '106904', label: '回' },
  { value: '106905', label: '苗' },
  { value: '106906', label: '维吾尔' },
  { value: '106907', label: '土家' },
  { value: '106908', label: '彝' },
  { value: '106909', label: '蒙古' },
  { value: '106910', label: '藏' },
  { value: '106911', label: '布依' },
  { value: '106912', label: '侗' },
  { value: '106913', label: '瑶' },
  { value: '106914', label: '朝鲜' },
  { value: '106915', label: '白' },
  { value: '106916', label: '哈尼' },
  { value: '106917', label: '哈萨克' },
  { value: '106918', label: '黎' },
  { value: '106919', label: '傣' },
  { value: '106920', label: '畲' },
  { value: '106921', label: '傈僳' },
  { value: '106922', label: '仡佬' },
  { value: '106923', label: '东乡' },
  { value: '106924', label: '高山' },
  { value: '106925', label: '拉祜族' },
  { value: '106926', label: '水' },
  { value: '106927', label: '佤' },
  { value: '106928', label: '纳西' },
  { value: '106929', label: '羌' },
  { value: '106930', label: '土' },
  { value: '106931', label: '仫佬' },
  { value: '106932', label: '锡伯' },
  { value: '106933', label: '柯尔克孜' },
  { value: '106934', label: '达斡尔' },
  { value: '106935', label: '景颇' },
  { value: '106936', label: '毛南' },
  { value: '106937', label: '撒拉' },
  { value: '106938', label: '布朗' },
  { value: '106939', label: '塔吉克' },
  { value: '106940', label: '阿昌' },
  { value: '106941', label: '普米' },
  { value: '106942', label: '鄂温克' },
  { value: '106943', label: '怒' },
  { value: '106944', label: '京' },
  { value: '106945', label: '基诺' },
  { value: '106946', label: '德昂' },
  { value: '106947', label: '保安' },
  { value: '106948', label: '俄罗斯' },
  { value: '106949', label: '裕固' },
  { value: '106950', label: '乌孜别克' },
  { value: '106951', label: '门巴' },
  { value: '106952', label: '鄂伦春' },
  { value: '106953', label: '独龙' },
  { value: '106954', label: '塔塔尔' },
  { value: '106955', label: '赫哲' },
  { value: '106956', label: '珞巴' },
  { value: '106957', label: '其他' }
];
/* 车辆码表 */
//车身颜色
// const vehicleColor = [
//   { value: null, label: '全部', text: '全部' },
//   { value: 117702, label: '#ffffff', text: '白色' },
//   { value: 117703, label: '#B5BBC7', text: '灰色' },
//   { value: 117701, label: '#000000', text: '黑色' },
//   { value: 117704, label: '#0099FF', text: '蓝色' },
//   { value: 117705, label: '#FFDD00', text: '黄色' },
//   { value: 117706, label: '#FF8800', text: '橙色' },
//   { value: 117707, label: '#B36D57', text: '棕色' },
//   { value: 117708, label: '#00FF33', text: '绿色' },
//   { value: 117709, label: '#9900FF', text: '紫色' },
//   { value: 117711, label: '#d82b8f', text: '粉色' },
//   { value: 117714, label: '#FF0000', text: '红色' },
//   { value: 117715, label: '#c0c0c0', text: '银色' },
//   { value: 117713, label: '其他', text: '其他' }
// ];
const vehicleColor = [
  {
    value: null,
    label: '全部',
    text: '全部'
  },
  {
    value: 117702,
    label: '#ffffff',
    text: '白色'
  },
  {
    value: 117701,
    label: '#000000',
    text: '黑色'
  },
  {
    value: 117703,
    label: '#B5BBC7',
    text: '灰色'
  },
  {
    value: 117704,
    label: '#0099FF',
    text: '蓝色'
  },
  {
    value: 117705,
    label: '#FFDD00',
    text: '黄色'
  },
  {
    value: 117706,
    label: '#FF8800',
    text: '橙色'
  },
  {
    value: 117707,
    label: '#B36D57',
    text: '棕色'
  },
  {
    value: 117708,
    label: '#00FF33',
    text: '绿色'
  },
  {
    value: 117709,
    label: '#9900FF',
    text: '紫色'
  },
  {
    value: 117711,
    label: '#d82b8f',
    text: '粉色'
  },
  // {
  //   value: 117712,
  //   label: '#d82b8f',
  //   text: '透明'
  // },
  {
    value: 117714,
    label: '#FF0000',
    text: '红色'
  },
  {
    value: 117715,
    label: '#c0c0c0',
    text: '银色'
  },
  {
    value: 117713,
    label: '其他',
    text: '其他'
  }
];
//车牌颜色
// const plateColor = [
//   { value: null, text: '全部' },
//   { value: 117752, label: 1, text: '白--色' },
//   { value: 117751, label: 2, text: '黑色' },
//   { value: 117753, label: 3, text: '黄色' },
//   { value: 117754, label: 4, text: '蓝色' },
//   { value: 117755, label: 5, text: '绿色' },
//   { value: 117713, text: '其他' }
// ];
const plateColor = [
  { value: null, text: '全部' },
  { value: 117752, label: 1, text: '白色' },
  { value: 117751, label: 2, text: '黑色' },
  { value: 117753, label: 3, text: '黄色' },
  { value: 117754, label: 4, text: '蓝色' },
  { value: 117755, label: 5, text: '绿色' },
  { value: 117756, label: 6, text: '黄绿色' },
  { value: 117757, text: '其他' }
];
//车辆品牌
// const vehicleBrand = [
//   { value: null, label: '全部' },
//   { value: 117102, label: '大众' },
//   { value: 117103, label: '别克' },
//   { value: 117104, label: '宝马' },
//   { value: 117105, label: '本田' },
//   { value: 117106, label: '标志' },
//   { value: 117107, label: '丰田' },
//   { value: 117108, label: '福特' },
//   { value: 117109, label: '日产' },
//   { value: 117110, label: '奥迪' },
//   { value: 117111, label: '马自达' },
//   { value: 117112, label: '雪佛兰' },
//   { value: 117113, label: '雪铁龙' },
//   { value: 117114, label: '现代' },
//   { value: 117115, label: '奇瑞' },
//   { value: 117116, label: '起亚' },
//   { value: 117117, label: '荣威' },
//   { value: 117118, label: '三菱' },
//   { value: 117119, label: '斯柯达' },
//   { value: 117120, label: '吉利' },
//   { value: 117121, label: '中华' },
//   { value: 117122, label: '沃尔沃' },
//   { value: 117123, label: '雷克萨斯' },
//   { value: 117124, label: '菲亚特' },
//   { value: 117125, label: '吉利帝豪' },
//   { value: 117126, label: '东风' },
//   { value: 117127, label: '比亚迪' },
//   { value: 117128, label: '铃木' },
//   { value: 117129, label: '金杯' },
//   { value: 117130, label: '海马' },
//   { value: 117131, label: '五菱' },
//   { value: 117132, label: '江淮' },
//   { value: 117133, label: '斯巴鲁' },
//   { value: 117134, label: '英伦' },
//   { value: 117135, label: '长城' },
//   { value: 117136, label: '哈飞' },
//   { value: 117137, label: '庆铃(五十铃)' },
//   { value: 117138, label: '东南' },
//   { value: 117139, label: '长安' },
//   { value: 117140, label: '福田' },
//   { value: 117141, label: '夏利' },
//   { value: 117142, label: '奔驰' },
//   { value: 117143, label: '一汽' },
//   { value: 117144, label: '依维柯' },
//   { value: 117145, label: '力帆' },
//   { value: 117146, label: '一汽奔腾' },
//   { value: 117147, label: '皇冠' },
//   { value: 117148, label: '雷诺' },
//   { value: 117149, label: 'JMC' },
//   { value: 117150, label: 'MG名爵' },
//   { value: 117151, label: '凯马' },
//   { value: 117152, label: '众泰' },
//   { value: 117153, label: '昌河' },
//   { value: 117154, label: '厦门金龙' },
//   { value: 117155, label: '上海汇众' },
//   { value: 117156, label: '苏州金龙' },
//   { value: 117157, label: '海格' },
//   { value: 117158, label: '宇通' },
//   { value: 117159, label: '中国重汽' },
//   { value: 117160, label: '北奔重卡' },
//   { value: 117161, label: '华菱星马汽车' },
//   { value: 117162, label: '跃进汽车' },
//   { value: 117163, label: '黄海汽车' },
//   { value: 117164, label: '保时捷' },
//   { value: 117165, label: '凯迪拉克' },
//   { value: 117166, label: '英菲尼迪' },
//   { value: 117167, label: '吉利全球鹰' },
//   { value: 117168, label: '吉普' },
//   { value: 117169, label: '路虎' },
//   { value: 117170, label: '长丰猎豹' },
//   { value: 117171, label: '时代汽车' },
//   { value: 117172, label: '长安轿车' },
//   { value: 117173, label: '陕汽重卡' },
//   { value: 117174, label: '安凯' },
//   { value: 117175, label: '申龙' },
//   { value: 117176, label: '大宇' },
//   { value: 117177, label: '中通' },
//   { value: 117178, label: '宝骏' },
//   { value: 117179, label: '北汽威旺' },
//   { value: 117180, label: '广汽传祺' },
//   { value: 117181, label: '陆风' },
//   { value: 117182, label: '北京' },
//   { value: 117183, label: '威麟' },
//   { value: 117184, label: '欧宝' },
//   { value: 117185, label: '开瑞' },
//   { value: 117186, label: '华普' },
//   { value: 117187, label: '讴歌' },
//   { value: 117188, label: '启辰' },
//   { value: 117189, label: '北汽制造' },
//   { value: 117190, label: '纳智捷' },
//   { value: 117191, label: '野马' },
//   { value: 117192, label: '中兴' },
//   { value: 117193, label: '克莱斯勒' },
//   { value: 117194, label: '广汽吉奥' },
//   { value: 117195, label: '瑞麟' },
//   { value: 117196, label: '捷豹' },
//   { value: 117197, label: '唐骏欧铃' },
//   { value: 117198, label: '福迪' },
//   { value: 117199, label: '莲花' },
//   { value: 117200, label: '双环' },
//   { value: 117201, label: '水源' },
//   { value: 117202, label: '江南' },
//   { value: 117203, label: '道奇' },
//   { value: 117204, label: '大运汽车' },
//   { value: 117205, label: '北方客车' },
//   { value: 117206, label: '九龙' },
//   { value: 117207, label: '宾利' },
//   { value: 117208, label: '舒驰客车' },
//   { value: 117209, label: '红旗' },
//   { value: 117101, label: '其他' }
// ];
const vehicleBrands = [
  {
    value: null,
    label: '全部'
  },
  {
    value: 117102,
    label: '大众'
  },
  {
    value: 117103,
    label: '别克'
  },
  {
    value: 117104,
    label: '宝马'
  },
  {
    value: 117105,
    label: '本田'
  },
  {
    value: 117106,
    label: '标致'
  },
  {
    value: 117107,
    label: '丰田'
  },
  {
    value: 117108,
    label: '福特'
  },
  {
    value: 117109,
    label: '日产'
  },
  {
    value: 117110,
    label: '奥迪'
  },
  {
    value: 117111,
    label: '马自达'
  },
  {
    value: 117112,
    label: '雪佛兰'
  },
  {
    value: 117113,
    label: '雪铁龙'
  },
  {
    value: 117114,
    label: '现代'
  },
  {
    value: 117115,
    label: '奇瑞'
  },
  {
    value: 117116,
    label: '起亚'
  },
  {
    value: 117117,
    label: '荣威'
  },
  {
    value: 117118,
    label: '三菱'
  },
  {
    value: 117119,
    label: '斯柯达'
  },
  {
    value: 117120,
    label: '吉利'
  },
  {
    value: 117121,
    label: '中华'
  },
  {
    value: 117122,
    label: '沃尔沃'
  },
  {
    value: 117123,
    label: '雷克萨斯'
  },
  {
    value: 117124,
    label: '菲亚特'
  },
  {
    value: 117125,
    label: '吉利帝豪'
  },
  {
    value: 117126,
    label: '东风'
  },
  {
    value: 117127,
    label: '比亚迪'
  },
  {
    value: 117128,
    label: '铃木'
  },
  {
    value: 117129,
    label: '金杯'
  },
  {
    value: 117130,
    label: '海马'
  },
  {
    value: 117131,
    label: '五菱'
  },
  {
    value: 117132,
    label: '江淮'
  },
  {
    value: 117133,
    label: '斯巴鲁'
  },
  {
    value: 117134,
    label: '英伦'
  },
  {
    value: 117135,
    label: '长城'
  },
  {
    value: 117136,
    label: '哈飞'
  },
  {
    value: 117137,
    label: '庆铃(五十铃)'
  },
  {
    value: 117138,
    label: '东南'
  },
  {
    value: 117139,
    label: '长安'
  },
  {
    value: 117140,
    label: '福田'
  },
  {
    value: 117141,
    label: '夏利'
  },
  {
    value: 117142,
    label: '奔驰'
  },
  {
    value: 117143,
    label: '一汽'
  },
  {
    value: 117144,
    label: '依维柯'
  },
  {
    value: 117145,
    label: '力帆'
  },
  {
    value: 117146,
    label: '一汽奔腾'
  },
  {
    value: 117147,
    label: '皇冠'
  },
  {
    value: 117148,
    label: '雷诺'
  },
  {
    value: 117149,
    label: 'JMC'
  },
  {
    value: 117150,
    label: 'MG名爵'
  },
  {
    value: 117151,
    label: '凯马'
  },
  {
    value: 117152,
    label: '众泰'
  },
  {
    value: 117153,
    label: '昌河'
  },
  {
    value: 117154,
    label: '厦门金龙'
  },
  {
    value: 117155,
    label: '上海汇众'
  },
  {
    value: 117156,
    label: '苏州金龙'
  },
  {
    value: 117157,
    label: '海格'
  },
  {
    value: 117158,
    label: '宇通'
  },
  {
    value: 117159,
    label: '中国重汽'
  },
  {
    value: 117160,
    label: '北奔重卡'
  },
  {
    value: 117161,
    label: '华菱星马汽车'
  },
  {
    value: 117162,
    label: '跃进汽车'
  },
  {
    value: 117163,
    label: '黄海汽车'
  },
  {
    value: 117164,
    label: '保时捷'
  },
  {
    value: 117165,
    label: '凯迪拉克'
  },
  {
    value: 117166,
    label: '英菲尼迪'
  },
  {
    value: 117167,
    label: '吉利全球鹰'
  },
  {
    value: 117168,
    label: '吉普'
  },
  {
    value: 117169,
    label: '路虎'
  },
  {
    value: 117170,
    label: '长丰猎豹'
  },
  {
    value: 117171,
    label: '时代汽车'
  },
  {
    value: 117172,
    label: '长安轿车'
  },
  {
    value: 117173,
    label: '陕汽重卡'
  },
  {
    value: 117174,
    label: '安凯'
  },
  {
    value: 117175,
    label: '申龙'
  },
  {
    value: 117176,
    label: '大宇'
  },
  {
    value: 117177,
    label: '中通'
  },
  {
    value: 117178,
    label: '宝骏'
  },
  {
    value: 117179,
    label: '北汽威旺'
  },
  {
    value: 117180,
    label: '广汽传祺'
  },
  {
    value: 117181,
    label: '陆风'
  },
  // {
  //   value: 117182,
  //   label: '北京'
  // },
  {
    value: 117183,
    label: '威麟'
  },
  {
    value: 117184,
    label: '欧宝'
  },
  {
    value: 117185,
    label: '开瑞'
  },
  {
    value: 117186,
    label: '华普'
  },
  {
    value: 117187,
    label: '讴歌'
  },
  {
    value: 117188,
    label: '启辰'
  },
  {
    value: 117189,
    label: '北汽制造'
  },
  {
    value: 117190,
    label: '纳智捷'
  },
  {
    value: 117191,
    label: '野马'
  },
  {
    value: 117192,
    label: '中兴'
  },
  {
    value: 117193,
    label: '克莱斯勒'
  },
  {
    value: 117194,
    label: '广汽吉奥'
  },
  {
    value: 117195,
    label: '瑞麟'
  },
  {
    value: 117196,
    label: '捷豹'
  },
  {
    value: 117197,
    label: '唐骏欧铃'
  },
  {
    value: 117198,
    label: '福迪'
  },
  {
    value: 117199,
    label: '莲花'
  },
  {
    value: 117200,
    label: '双环'
  },
  {
    value: 117201,
    label: '水源'
  },
  {
    value: 117202,
    label: '江南'
  },
  {
    value: 117203,
    label: '道奇'
  },
  {
    value: 117204,
    label: '大运汽车'
  },
  {
    value: 117205,
    label: '北方客车'
  },
  {
    value: 117206,
    label: '九龙'
  },
  {
    value: 117207,
    label: '宾利'
  },
  {
    value: 117208,
    label: '舒驰客车'
  },
  {
    value: 117209,
    label: '红旗'
  },

  {
    value: 117210,
    label: '北京汽车'
  },
  {
    value: 117211,
    label: '北京'
  },
  {
    value: 117212,
    label: '陕汽'
  },
  {
    value: 117213,
    label: 'DS'
  },
  {
    value: 117214,
    label: 'JEEP'
  },
  {
    value: 117215,
    label: 'MINI'
  },
  {
    value: 117216,
    label: 'smart'
  },
  {
    value: 117217,
    label: 'smart_fortwo'
  },
  {
    value: 117218,
    label: 'ABT'
  },
  {
    value: 117219,
    label: 'AC_Schnitzer'
  },
  {
    value: 117220,
    label: 'Agile_Automotive'
  },
  {
    value: 117221,
    label: 'ALPINA'
  },
  {
    value: 117222,
    label: 'Apollo'
  },
  {
    value: 117223,
    label: 'Arash'
  },
  {
    value: 117224,
    label: 'ARCFOX'
  },
  {
    value: 117225,
    label: 'ATS'
  },
  {
    value: 117226,
    label: 'BAC'
  },
  {
    value: 117227,
    label: 'Caterham'
  },
  {
    value: 117228,
    label: 'Conquest'
  },
  {
    value: 117229,
    label: 'Dacia'
  },
  {
    value: 117230,
    label: 'Datsun'
  },
  {
    value: 117231,
    label: 'DMC'
  },
  {
    value: 117232,
    label: 'Donkervoort'
  },
  {
    value: 117233,
    label: 'Elementa'
  },
  {
    value: 117234,
    label: 'Faraday_Future'
  },
  {
    value: 117235,
    label: 'Fisker'
  },
  {
    value: 117236,
    label: 'FM_Auto'
  },
  {
    value: 117237,
    label: 'GAZ'
  },
  {
    value: 117238,
    label: 'GLM'
  },
  {
    value: 117239,
    label: 'GMC'
  },
  {
    value: 117240,
    label: 'GTA'
  },
  {
    value: 117241,
    label: 'Gumpert'
  },
  {
    value: 117242,
    label: 'Hennessey'
  },
  {
    value: 117243,
    label: 'Inferno'
  },
  {
    value: 117244,
    label: 'KTM'
  },
  {
    value: 117245,
    label: 'LeSEE'
  },
  {
    value: 117246,
    label: 'LOCAL_MOTORS'
  },
  {
    value: 117247,
    label: 'Lorinser'
  },
  {
    value: 117248,
    label: 'Lucid'
  },
  {
    value: 117249,
    label: 'Mazzanti'
  },
  {
    value: 117250,
    label: 'MELKUS'
  },
  {
    value: 117251,
    label: 'nanoFLOWCELL'
  },
  {
    value: 117252,
    label: 'NEVS'
  },
  {
    value: 117253,
    label: 'Noble'
  },
  {
    value: 117254,
    label: 'Polestar'
  },
  {
    value: 117255,
    label: 'RENOVO'
  },
  {
    value: 117256,
    label: 'Rezvani'
  },
  {
    value: 117257,
    label: 'Rimac'
  },
  {
    value: 117258,
    label: 'Rinspeed'
  },
  {
    value: 117259,
    label: 'Scion'
  },
  {
    value: 117260,
    label: 'SPIRRA'
  },
  {
    value: 117261,
    label: 'SSC'
  },
  {
    value: 117262,
    label: 'SWM斯威'
  },
  {
    value: 117263,
    label: 'Tramontana'
  },
  {
    value: 117264,
    label: 'TVR'
  },
  {
    value: 117265,
    label: 'Venturi'
  },
  {
    value: 117266,
    label: 'VLF_Automotive'
  },
  {
    value: 117267,
    label: 'W_Motors'
  },
  {
    value: 117268,
    label: 'WEY'
  },
  {
    value: 117269,
    label: 'YAMAHA'
  },
  {
    value: 117270,
    label: 'Zenvo'
  },
  {
    value: 117271,
    label: '阿尔法·罗密欧'
  },
  {
    value: 117272,
    label: '阿斯顿·马丁'
  },
  {
    value: 117273,
    label: '艾康尼克'
  },
  {
    value: 117274,
    label: '安凯客车'
  },
  {
    value: 117275,
    label: '巴博斯'
  },
  {
    value: 117276,
    label: '宝沃'
  },
  {
    value: 117277,
    label: '保斐利'
  },
  {
    value: 117278,
    label: '北汽 '
  },
  {
    value: 117279,
    label: '北汽道达'
  },
  {
    value: 117280,
    label: '北汽幻速'
  },
  {
    value: 117281,
    label: '北汽绅宝'
  },
  {
    value: 117282,
    label: '北汽新能源'
  },
  {
    value: 117283,
    label: '奔马龙'
  },
  {
    value: 117284,
    label: '奔腾'
  },
  {
    value: 117285,
    label: '比速'
  },
  {
    value: 117286,
    label: '宾尼法利纳'
  },
  {
    value: 117287,
    label: '布加迪'
  },
  {
    value: 117288,
    label: '常隆'
  },
  {
    value: 117289,
    label: '昶洧'
  },
  {
    value: 117290,
    label: '成功'
  },
  {
    value: 117291,
    label: '达夫'
  },
  {
    value: 117292,
    label: '大发'
  },
  // {
  //   value: 117293,
  //   label: '代'
  // },
  {
    value: 117294,
    label: '电咖'
  },
  {
    value: 117295,
    label: '东方红'
  },
  {
    value: 117296,
    label: '东风风度'
  },
  {
    value: 117297,
    label: '东风风光'
  },
  {
    value: 117298,
    label: '东风风行'
  },
  {
    value: 117299,
    label: '东风风尚'
  },
  {
    value: 117300,
    label: '东风风神'
  },
  {
    value: 117301,
    label: '东风俊风'
  },
  {
    value: 117302,
    label: '东风柳汽'
  },
  {
    value: 117303,
    label: '东风皮卡'
  },
  {
    value: 117304,
    label: '东风神宇'
  },
  {
    value: 117305,
    label: '东风特汽'
  },
  {
    value: 117306,
    label: '东风特商'
  },
  {
    value: 117307,
    label: '东风小康'
  },
  {
    value: 117308,
    label: '东风裕隆'
  },
  {
    value: 117309,
    label: '法拉利'
  },
  {
    value: 117310,
    label: '飞碟'
  },
  {
    value: 117311,
    label: '弗那萨利'
  },
  {
    value: 117312,
    label: '福汽启腾'
  },
  {
    value: 117313,
    label: '福汽新龙马'
  },
  {
    value: 117314,
    label: '福田乘用车'
  },
  {
    value: 117315,
    label: '富仕达'
  },
  {
    value: 117316,
    label: '观致'
  },
  {
    value: 117317,
    label: '光冈'
  },
  {
    value: 117318,
    label: '广汽日野'
  },
  {
    value: 117319,
    label: '广通客车'
  },
  {
    value: 117320,
    label: '桂林'
  },
  {
    value: 117321,
    label: '国金'
  },
  {
    value: 117322,
    label: '哈弗'
  },
  {
    value: 117323,
    label: '汉腾'
  },
  {
    value: 117324,
    label: '悍马'
  },
  {
    value: 117325,
    label: '行友'
  },
  {
    value: 117326,
    label: '黑豹'
  },
  {
    value: 117327,
    label: '恒天'
  },
  {
    value: 117328,
    label: '衡山'
  },
  {
    value: 117329,
    label: '红岩'
  },
  {
    value: 117330,
    label: '华凯'
  },
  {
    value: 117331,
    label: '华利'
  },
  {
    value: 117332,
    label: '华骐'
  },
  {
    value: 117333,
    label: '华颂'
  },
  {
    value: 117334,
    label: '华泰'
  },
  {
    value: 117335,
    label: '华泰新能源'
  },
  {
    value: 117336,
    label: '华夏'
  },
  {
    value: 117337,
    label: '华中'
  },
  {
    value: 117338,
    label: '霍顿'
  },
  {
    value: 117339,
    label: '江铃'
  },
  {
    value: 117340,
    label: '江铃集团轻汽'
  },
  {
    value: 117341,
    label: '江铃集团新能源'
  },
  {
    value: 117342,
    label: '江苏常隆'
  },
  {
    value: 117343,
    label: '金龙'
  },
  {
    value: 117344,
    label: '金旅'
  },
  {
    value: 117345,
    label: '金马'
  },
  {
    value: 117346,
    label: '精功'
  },
  {
    value: 117347,
    label: '君马'
  },
  // {
  //   value: 117348,
  //   label: '卡车'
  // },
  {
    value: 117349,
    label: '卡尔森'
  },
  {
    value: 117350,
    label: '卡升'
  },
  {
    value: 117351,
    label: '卡威'
  },
  {
    value: 117352,
    label: '凯佰赫'
  },
  {
    value: 117353,
    label: '凯翼'
  },
  {
    value: 117354,
    label: '康迪全球鹰'
  },
  {
    value: 117355,
    label: '科尼赛克'
  },
  // {
  //   value: 117356,
  //   label: '客车'
  // },
  {
    value: 117357,
    label: '拉达'
  },
  {
    value: 117358,
    label: '兰博基尼'
  },
  {
    value: 117359,
    label: '蓝旗亚'
  },
  {
    value: 117360,
    label: '朗世'
  },
  {
    value: 117361,
    label: '劳斯莱斯'
  },
  {
    value: 117362,
    label: '雷丁'
  },
  {
    value: 117363,
    label: '雷诺三星'
  },
  {
    value: 117364,
    label: '理念'
  },
  {
    value: 117365,
    label: '联合卡车'
  },
  {
    value: 117366,
    label: '猎豹'
  },
  {
    value: 117367,
    label: '林肯'
  },
  {
    value: 117368,
    label: '领克'
  },
  {
    value: 117369,
    label: '领志'
  },
  {
    value: 117370,
    label: '陆地方舟'
  },
  {
    value: 117371,
    label: '路特斯'
  },
  {
    value: 117372,
    label: '玛莎拉蒂'
  },
  {
    value: 117373,
    label: '迈巴赫'
  },
  {
    value: 117374,
    label: '迈凯伦'
  },
  {
    value: 117375,
    label: '曼'
  },
  {
    value: 117376,
    label: '曼恩'
  },
  {
    value: 117377,
    label: '名爵'
  },
  {
    value: 117378,
    label: '摩根'
  },
  {
    value: 117379,
    label: '南京金龙'
  },
  {
    value: 117380,
    label: '南骏'
  },
  {
    value: 117381,
    label: '欧朗'
  },
  {
    value: 117382,
    label: '帕加尼'
  },
  {
    value: 117383,
    label: '佩奇奥'
  },
  {
    value: 117384,
    label: '奇点'
  },
  {
    value: 117385,
    label: '祺智'
  },
  {
    value: 117386,
    label: '前途'
  },
  {
    value: 117387,
    label: '乔治·巴顿'
  },
  {
    value: 117388,
    label: '乔治亚罗'
  },
  {
    value: 117389,
    label: '青年'
  },
  {
    value: 117390,
    label: '日野'
  },
  {
    value: 117391,
    label: '如虎'
  },
  {
    value: 117392,
    label: '萨博'
  },
  {
    value: 117393,
    label: '赛麟'
  },
  {
    value: 117394,
    label: '三环'
  },
  {
    value: 117395,
    label: '三江航天'
  },
  {
    value: 117396,
    label: '三一重工'
  },
  {
    value: 117397,
    label: '山地牌'
  },
  {
    value: 117398,
    label: '山东时风'
  },
  {
    value: 117399,
    label: '陕汽通家'
  },
  {
    value: 117400,
    label: '上海'
  },
  {
    value: 117401,
    label: '上海申沃'
  },
  {
    value: 117402,
    label: '上汽大通'
  },
  {
    value: 117403,
    label: '少林'
  },
  {
    value: 117404,
    label: '世爵'
  },
  {
    value: 117405,
    label: '首望'
  },
  {
    value: 117406,
    label: '双龙'
  },
  {
    value: 117407,
    label: '双星'
  },
  {
    value: 117408,
    label: '思铭'
  },
  {
    value: 117409,
    label: '斯达泰克'
  },
  {
    value: 117410,
    label: '斯堪尼亚'
  },
  {
    value: 117411,
    label: '斯太尔'
  },
  {
    value: 117412,
    label: '塔塔'
  },
  {
    value: 117413,
    label: '泰卡特'
  },
  {
    value: 117414,
    label: '泰克鲁斯·腾风'
  },
  {
    value: 117415,
    label: '特斯拉'
  },
  {
    value: 117416,
    label: '腾势'
  },
  {
    value: 117417,
    label: '万达'
  },
  {
    value: 117418,
    label: '万佛'
  },
  {
    value: 117419,
    label: '威马'
  },
  {
    value: 117420,
    label: '威兹曼'
  },
  {
    value: 117421,
    label: '潍柴英致'
  },
  {
    value: 117422,
    label: '蔚来'
  },
  {
    value: 117423,
    label: '沃克斯豪尔'
  },
  {
    value: 117424,
    label: '五十铃'
  },
  {
    value: 117425,
    label: '五征'
  },
  {
    value: 117426,
    label: '西雅特'
  },
  {
    value: 117427,
    label: '小鹏'
  },
  {
    value: 117428,
    label: '新凯'
  },
  {
    value: 117429,
    label: '新龙马'
  },
  {
    value: 117430,
    label: '鑫源'
  },
  {
    value: 117431,
    label: '徐工'
  },
  {
    value: 117432,
    label: '亚星'
  },
  {
    value: 117433,
    label: '扬子江'
  },
  {
    value: 117434,
    label: '一汽解放'
  },
  {
    value: 117435,
    label: '一汽青岛解放'
  },
  {
    value: 117436,
    label: '一汽通用'
  },
  {
    value: 117437,
    label: '英田'
  },
  {
    value: 117438,
    label: '永源'
  },
  {
    value: 117439,
    label: '游侠'
  },
  {
    value: 117440,
    label: '友谊'
  },
  {
    value: 117441,
    label: '宇通客车'
  },
  {
    value: 117442,
    label: '驭胜'
  },
  {
    value: 117443,
    label: '御捷'
  },
  {
    value: 117444,
    label: '裕路'
  },
  {
    value: 117445,
    label: '云度'
  },
  {
    value: 117446,
    label: '长安跨越'
  },
  {
    value: 117447,
    label: '长安欧尚'
  },
  {
    value: 117448,
    label: '长安轻型车'
  },
  {
    value: 117449,
    label: '长江EV'
  },
  {
    value: 117450,
    label: '振兴'
  },
  {
    value: 117451,
    label: '正道'
  },
  {
    value: 117452,
    label: '之诺'
  },
  {
    value: 117453,
    label: '知豆'
  },
  {
    value: 117454,
    label: '中顺'
  },
  {
    value: 117455,
    label: '重汽王牌'
  },
  {
    value: 117101,
    label: '其他'
  }
];
//车辆类型
// const vehicleClass = [
//   { value: null, label: '全部' },
//   { value: 117501, label: '大型客车' },
//   { value: 117502, label: '大型普通客车' },
//   { value: 117503, label: '大型双层客车' },
//   { value: 117504, label: '大型卧铺客车' },
//   { value: 117505, label: '大型铰接客车' },
//   { value: 117506, label: '大型越野客车' },
//   { value: 117507, label: '大型轿车' },
//   { value: 117508, label: '大型专用客车' },
//   { value: 117509, label: '中型客车' },
//   { value: 117510, label: '中型普通客车' },
//   { value: 117511, label: '中型双层客车' },
//   { value: 117512, label: '中型卧铺客车' },
//   { value: 117513, label: '中型铰接客车' },
//   { value: 117514, label: '中型越野客车' },
//   { value: 117515, label: '中型专用客车' },
//   { value: 117516, label: '小型客车' },
//   { value: 117517, label: '小型普通客车' },
//   { value: 117518, label: '小型越野客车' },
//   { value: 117519, label: '小型轿车' },
//   { value: 117520, label: '小型专用客车' },
//   { value: 117521, label: '微型客车' },
//   { value: 117522, label: '微型普通客车' },
//   { value: 117523, label: '微型越野客车' },
//   { value: 117524, label: '微型轿车' },
//   { value: 117525, label: '重型货车' },
//   { value: 117526, label: '重型普通货车' },
//   { value: 117527, label: '重型厢式货车' },
//   { value: 117528, label: '重型封闭货车' },
//   { value: 117529, label: '重型罐式货车' },
//   { value: 117530, label: '重型平板货车' },
//   { value: 117531, label: '重型集装厢车' },
//   { value: 117532, label: '重型自卸货车' },
//   { value: 117533, label: '重型特殊结构货车' },
//   { value: 117534, label: '重型仓栅式货车' },
//   { value: 117535, label: '中型货车' },
//   { value: 117536, label: '中型普通货车' },
//   { value: 117537, label: '中型厢式货车' },
//   { value: 117538, label: '中型封闭货车' },
//   { value: 117539, label: '中型罐式货车' },
//   { value: 117540, label: '中型平板货车' },
//   { value: 117541, label: '中型集装厢车' },
//   { value: 117542, label: '中型自卸货车' },
//   { value: 117543, label: '中型特殊结构货车' },
//   { value: 117544, label: '中型仓栅式货车' },
//   { value: 117545, label: '轻型货车' },
//   { value: 117546, label: '轻型普通货车' },
//   { value: 117547, label: '轻型厢式货车' },
//   { value: 117548, label: '轻型封闭货车' },
//   { value: 117549, label: '轻型罐式货车' },
//   { value: 117550, label: '轻型平板货车' },
//   { value: 117551, label: '轻型自卸货车' },
//   { value: 117552, label: '轻型特殊结构货车' },
//   { value: 117553, label: '轻型仓栅式货车' },
//   { value: 117554, label: '微型货车' },
//   { value: 117555, label: '微型普通货车' },
//   { value: 117556, label: '微型厢式货车' },
//   { value: 117557, label: '微型封闭货车' },
//   { value: 117558, label: '微型罐式货车' },
//   { value: 117559, label: '微型自卸货车' },
//   { value: 117560, label: '微型特殊结构货车' },
//   { value: 117561, label: '微型仓栅式货车' },
//   { value: 117562, label: '低速货车' },
//   { value: 117563, label: '普通低速货车' },
//   { value: 117564, label: '厢式低速货车' },
//   { value: 117565, label: '罐式低速货车' },
//   { value: 117566, label: '自卸低速货车' },
//   { value: 117567, label: '仓栅式低速货车' },
//   { value: 117568, label: '重型牵引车' },
//   { value: 117569, label: '重型半挂牵引车' },
//   { value: 117570, label: '重型全挂牵引车' },
//   { value: 117571, label: '中型牵引车' },
//   { value: 117572, label: '中型半挂牵引车' },
//   { value: 117573, label: '中型全挂牵引车' },
//   { value: 117574, label: '轻型牵引车' },
//   { value: 117575, label: '轻型半挂牵引车' },
//   { value: 117576, label: '轻型全挂牵引车' },
//   { value: 117577, label: '大型专项作业车' },
//   { value: 117578, label: '中型专项作业车' },
//   { value: 117579, label: '小型专项作业车' },
//   { value: 117580, label: '微型专项作业车' },
//   { value: 117581, label: '重型专项作业车' },
//   { value: 117582, label: '轻型专项作业车' },
//   { value: 117583, label: '无轨电车' },
//   { value: 117584, label: '有轨电车' },
//   { value: 117585, label: '三轮摩托车' },
//   { value: 117586, label: '普通正三轮摩托车' },
//   { value: 117587, label: '轻便正三轮摩托车' },
//   { value: 117588, label: '正三轮载客摩托车' },
//   { value: 117589, label: '正三轮载货摩托车' },
//   { value: 117590, label: '侧三轮摩托车' },
//   { value: 117591, label: '二轮摩托车' },
//   { value: 117592, label: '普通二轮摩托车' },
//   { value: 117593, label: '轻便二轮摩托车' },
//   { value: 117594, label: '三轮汽车' },
//   { value: 117595, label: '大型轮式拖拉机' },
//   { value: 117596, label: '小型拖拉机' },
//   { value: 117597, label: '小型轮式拖拉机' },
//   { value: 117598, label: '手扶拖拉机' },
//   { value: 117599, label: '手扶变形运输机' },
//   { value: 117600, label: '轮式装载机械' },
//   { value: 117601, label: '轮式挖掘机械' },
//   { value: 117602, label: '轮式平地机械' },
//   { value: 117603, label: '重型全挂车' },
//   { value: 117604, label: '重型普通全挂车' },
//   { value: 117605, label: '重型厢式全挂车' },
//   { value: 117606, label: '重型罐式全挂车' },
//   { value: 117607, label: '重型平板全挂车' },
//   { value: 117608, label: '重型集装箱全挂车' },
//   { value: 117609, label: '重型自卸全挂车' },
//   { value: 117610, label: '重型仓栅式全挂车' },
//   { value: 117611, label: '重型旅居全挂车' },
//   { value: 117612, label: '重型专项作业全挂车' },
//   { value: 117613, label: '中型全挂车' },
//   { value: 117614, label: '中型普通全挂车' },
//   { value: 117615, label: '中型厢式全挂车' },
//   { value: 117616, label: '中型罐式全挂车' },
//   { value: 117617, label: '中型平板全挂车' },
//   { value: 117618, label: '中型集装箱全挂车' },
//   { value: 117619, label: '中型自卸全挂车' },
//   { value: 117620, label: '中型仓栅式全挂车' },
//   { value: 117621, label: '中型旅居全挂车' },
//   { value: 117622, label: '中型专项作业全挂车' },
//   { value: 117623, label: '轻型全挂车' },
//   { value: 117624, label: '轻型普通全挂车' },
//   { value: 117625, label: '轻型厢式全挂车' },
//   { value: 117626, label: '轻型罐式全挂车' },
//   { value: 117627, label: '轻型平板全挂车' },
//   { value: 117628, label: '轻型自卸全挂车' },
//   { value: 117629, label: '轻型仓栅式全挂车' },
//   { value: 117630, label: '轻型旅居全挂车' },
//   { value: 117631, label: '轻型专项作业全挂车' },
//   { value: 117632, label: '重型半挂车' },
//   { value: 117633, label: '重型普通半挂车' },
//   { value: 117634, label: '重型厢式半挂车' },
//   { value: 117635, label: '重型罐式半挂车' },
//   { value: 117636, label: '重型平板半挂车' },
//   { value: 117637, label: '重型集装箱半挂车' },
//   { value: 117638, label: '重型自卸半挂车' },
//   { value: 117639, label: '重型特殊结构半挂车' },
//   { value: 117640, label: '重型仓栅式半挂车' },
//   { value: 117641, label: '重型旅居半挂车' },
//   { value: 117642, label: '重型专项作业半挂车' },
//   { value: 117643, label: '重型低平板半挂车' },
//   { value: 117644, label: '中型半挂车' },
//   { value: 117645, label: '中型普通半挂车' },
//   { value: 117646, label: '中型厢式半挂车' },
//   { value: 117647, label: '中型罐式半挂车' },
//   { value: 117648, label: '中型平板半挂车' },
//   { value: 117649, label: '中型集装箱半挂车' },
//   { value: 117650, label: '中型自卸半挂车' },
//   { value: 117651, label: '中型特殊结构半挂车' },
//   { value: 117652, label: '中型仓栅式半挂车' },
//   { value: 117653, label: '中型旅居半挂车' },
//   { value: 117654, label: '中型专项作业半挂车' },
//   { value: 117655, label: '中型低平板半挂车' },
//   { value: 117656, label: '轻型半挂车' },
//   { value: 117657, label: '轻型普通半挂车' },
//   { value: 117658, label: '轻型厢式半挂车' },
//   { value: 117659, label: '轻型罐式半挂车' },
//   { value: 117660, label: '轻型平板半挂车' },
//   { value: 117661, label: '轻型自卸半挂车' },
//   { value: 117662, label: '轻型仓栅式半挂车' },
//   { value: 117663, label: '轻型旅居半挂车' },
//   { value: 117664, label: '轻型专项作业半挂车' },
//   { value: 117665, label: '轻型低平板半挂车' },
//   { value: 117666, label: '其他' }
// ];
const vehicleClasses = [
  {
    value: null,
    label: '全部',
    ids: null
  },
  {
    value: 'b',
    label: '轿车',
    ids: [117669]
  },
  {
    value: 'c',
    label: '面包车',
    ids: [117670]
  },
  {
    value: 'd',
    label: '越野车/SUV',
    ids: [117674]
  },
  {
    value: 'e',
    label: '皮卡',
    ids: [117671]
  },
  {
    value: 'f',
    label: '商务车/MPV',
    ids: [117672]
  },
  {
    value: 'g',
    label: '三轮车',
    ids: [117667, 117594]
  },
  {
    value: 'h',
    label: '摩托车',
    ids: [
      117585,
      117586,
      117587,
      117588,
      117589,
      117590,
      117591,
      117592,
      117593
    ]
  },
  {
    value: 'i',
    label: '货车',
    ids: [
      117525,
      117526,
      117527,
      117528,
      117529,
      117530,
      117531,
      117532,
      117533,
      117534,
      117535,
      117536,
      117537,
      117538,
      117539,
      117540,
      117541,
      117542,
      117543,
      117544,
      117545,
      117546,
      117547,
      117548,
      117549,
      117550,
      117551,
      117552,
      117553,
      117554,
      117555,
      117556,
      117557,
      117558,
      117559,
      117560,
      117561,
      117562,
      117563,
      117564,
      117565,
      117566,
      117567,
      117675,
      117676
    ]
  },
  {
    value: 'j',
    label: '客车',
    ids: [
      117501,
      117502,
      117503,
      117504,
      117505,
      117506,
      117507,
      117508,
      117509,
      117510,
      117511,
      117512,
      117513,
      117514,
      117515,
      117516,
      117517,
      117518,
      117519,
      117520,
      117521,
      117522,
      117523,
      117524
    ]
  },
  {
    value: 'k',
    label: '公交车',
    ids: [117668]
  },
  {
    value: 'l',
    label: '校车',
    ids: [117673]
  },
  {
    value: 'm',
    label: '电车',
    ids: [117583, 117584]
  },
  {
    value: 'n',
    label: '拖拉机',
    ids: [117595, 117596, 117597, 117598, 117599]
  },
  {
    value: 'o',
    label: '牵引车',
    ids: [
      117568,
      117569,
      117570,
      117571,
      117572,
      117573,
      117574,
      117575,
      117576
    ]
  },
  {
    value: 'p',
    label: '专项作业车',
    ids: [117577, 117578, 117579, 117580, 117581, 117582]
  },
  {
    value: 'q',
    label: '轮式机械',
    ids: [117600, 117601, 117602]
  },
  {
    value: 'r',
    label: '全挂车',
    ids: [
      117603,
      117604,
      117605,
      117606,
      117607,
      117608,
      117609,
      117610,
      117611,
      117612,
      117613,
      117614,
      117615,
      117616,
      117617,
      117618,
      117619,
      117620,
      117621,
      117622,
      117623,
      117624,
      117625,
      117626,
      117627,
      117628,
      117629,
      117630,
      117631
    ]
  },
  {
    value: 's',
    label: '半挂车',
    ids: [
      117632,
      117633,
      117634,
      117635,
      117636,
      117637,
      117638,
      117639,
      117640,
      117641,
      117642,
      117643,
      117644,
      117645,
      117646,
      117647,
      117648,
      117649,
      117650,
      117651,
      117652,
      117653,
      117654,
      117655,
      117656,
      117657,
      117658,
      117659,
      117660,
      117661,
      117662,
      117663,
      117664,
      117665
    ]
  },
  {
    value: 't',
    label: '其他',
    ids: [117666]
  }
];
// const vehicleClass = [{
//     value: null,
//     label: '全部'
//   },
//   {
//     value: 117501,
//     label: '大型客车'
//   },
//   {
//     value: 117502,
//     label: '大型普通客车'
//   },
//   {
//     value: 117503,
//     label: '大型双层客车'
//   },
//   {
//     value: 117504,
//     label: '大型卧铺客车'
//   },
//   {
//     value: 117505,
//     label: '大型铰接客车'
//   },
//   {
//     value: 117506,
//     label: '大型越野客车'
//   },
//   {
//     value: 117507,
//     label: '大型轿车'
//   },
//   {
//     value: 117508,
//     label: '大型专用客车'
//   },
//   {
//     value: 117509,
//     label: '中型客车'
//   },
//   {
//     value: 117510,
//     label: '中型普通客车'
//   },
//   {
//     value: 117511,
//     label: '中型双层客车'
//   },
//   {
//     value: 117512,
//     label: '中型卧铺客车'
//   },
//   {
//     value: 117513,
//     label: '中型铰接客车'
//   },
//   {
//     value: 117514,
//     label: '中型越野客车'
//   },
//   {
//     value: 117515,
//     label: '中型专用客车'
//   },
//   {
//     value: 117516,
//     label: '小型客车'
//   },
//   {
//     value: 117517,
//     label: '小型普通客车'
//   },
//   {
//     value: 117518,
//     label: '小型越野客车'
//   },
//   {
//     value: 117519,
//     label: '小型轿车'
//   },
//   {
//     value: 117520,
//     label: '小型专用客车'
//   },
//   {
//     value: 117521,
//     label: '微型客车'
//   },
//   {
//     value: 117522,
//     label: '微型普通客车'
//   },
//   {
//     value: 117523,
//     label: '微型越野客车'
//   },
//   {
//     value: 117524,
//     label: '微型轿车'
//   },
//   {
//     value: 117525,
//     label: '重型货车'
//   },
//   {
//     value: 117526,
//     label: '重型普通货车'
//   },
//   {
//     value: 117527,
//     label: '重型厢式货车'
//   },
//   {
//     value: 117528,
//     label: '重型封闭货车'
//   },
//   {
//     value: 117529,
//     label: '重型罐式货车'
//   },
//   {
//     value: 117530,
//     label: '重型平板货车'
//   },
//   {
//     value: 117531,
//     label: '重型集装厢车'
//   },
//   {
//     value: 117532,
//     label: '重型自卸货车'
//   },
//   {
//     value: 117533,
//     label: '重型特殊结构货车'
//   },
//   {
//     value: 117534,
//     label: '重型仓栅式货车'
//   },
//   {
//     value: 117535,
//     label: '中型货车'
//   },
//   {
//     value: 117536,
//     label: '中型普通货车'
//   },
//   {
//     value: 117537,
//     label: '中型厢式货车'
//   },
//   {
//     value: 117538,
//     label: '中型封闭货车'
//   },
//   {
//     value: 117539,
//     label: '中型罐式货车'
//   },
//   {
//     value: 117540,
//     label: '中型平板货车'
//   },
//   {
//     value: 117541,
//     label: '中型集装厢车'
//   },
//   {
//     value: 117542,
//     label: '中型自卸货车'
//   },
//   {
//     value: 117543,
//     label: '中型特殊结构货车'
//   },
//   {
//     value: 117544,
//     label: '中型仓栅式货车'
//   },
//   {
//     value: 117545,
//     label: '轻型货车'
//   },
//   {
//     value: 117546,
//     label: '轻型普通货车'
//   },
//   {
//     value: 117547,
//     label: '轻型厢式货车'
//   },
//   {
//     value: 117548,
//     label: '轻型封闭货车'
//   },
//   {
//     value: 117549,
//     label: '轻型罐式货车'
//   },
//   {
//     value: 117550,
//     label: '轻型平板货车'
//   },
//   {
//     value: 117551,
//     label: '轻型自卸货车'
//   },
//   {
//     value: 117552,
//     label: '轻型特殊结构货车'
//   },
//   {
//     value: 117553,
//     label: '轻型仓栅式货车'
//   },
//   {
//     value: 117554,
//     label: '微型货车'
//   },
//   {
//     value: 117555,
//     label: '微型普通货车'
//   },
//   {
//     value: 117556,
//     label: '微型厢式货车'
//   },
//   {
//     value: 117557,
//     label: '微型封闭货车'
//   },
//   {
//     value: 117558,
//     label: '微型罐式货车'
//   },
//   {
//     value: 117559,
//     label: '微型自卸货车'
//   },
//   {
//     value: 117560,
//     label: '微型特殊结构货车'
//   },
//   {
//     value: 117561,
//     label: '微型仓栅式货车'
//   },
//   {
//     value: 117562,
//     label: '低速货车'
//   },
//   {
//     value: 117563,
//     label: '普通低速货车'
//   },
//   {
//     value: 117564,
//     label: '厢式低速货车'
//   },
//   {
//     value: 117565,
//     label: '罐式低速货车'
//   },
//   {
//     value: 117566,
//     label: '自卸低速货车'
//   },
//   {
//     value: 117567,
//     label: '仓栅式低速货车'
//   },
//   {
//     value: 117568,
//     label: '重型牵引车'
//   },
//   {
//     value: 117569,
//     label: '重型半挂牵引车'
//   },
//   {
//     value: 117570,
//     label: '重型全挂牵引车'
//   },
//   {
//     value: 117571,
//     label: '中型牵引车'
//   },
//   {
//     value: 117572,
//     label: '中型半挂牵引车'
//   },
//   {
//     value: 117573,
//     label: '中型全挂牵引车'
//   },
//   {
//     value: 117574,
//     label: '轻型牵引车'
//   },
//   {
//     value: 117575,
//     label: '轻型半挂牵引车'
//   },
//   {
//     value: 117576,
//     label: '轻型全挂牵引车'
//   },
//   {
//     value: 117577,
//     label: '大型专项作业车'
//   },
//   {
//     value: 117578,
//     label: '中型专项作业车'
//   },
//   {
//     value: 117579,
//     label: '小型专项作业车'
//   },
//   {
//     value: 117580,
//     label: '微型专项作业车'
//   },
//   {
//     value: 117581,
//     label: '重型专项作业车'
//   },
//   {
//     value: 117582,
//     label: '轻型专项作业车'
//   },
//   {
//     value: 117583,
//     label: '无轨电车'
//   },
//   {
//     value: 117584,
//     label: '有轨电车'
//   },
//   {
//     value: 117585,
//     label: '三轮摩托车'
//   },
//   {
//     value: 117586,
//     label: '普通正三轮摩托车'
//   },
//   {
//     value: 117587,
//     label: '轻便正三轮摩托车'
//   },
//   {
//     value: 117588,
//     label: '正三轮载客摩托车'
//   },
//   {
//     value: 117589,
//     label: '正三轮载货摩托车'
//   },
//   {
//     value: 117590,
//     label: '侧三轮摩托车'
//   },
//   {
//     value: 117591,
//     label: '二轮摩托车'
//   },
//   {
//     value: 117592,
//     label: '普通二轮摩托车'
//   },
//   {
//     value: 117593,
//     label: '轻便二轮摩托车'
//   },
//   {
//     value: 117594,
//     label: '三轮汽车'
//   },
//   {
//     value: 117595,
//     label: '大型轮式拖拉机'
//   },
//   {
//     value: 117596,
//     label: '小型拖拉机'
//   },
//   {
//     value: 117597,
//     label: '小型轮式拖拉机'
//   },
//   {
//     value: 117598,
//     label: '手扶拖拉机'
//   },
//   {
//     value: 117599,
//     label: '手扶变形运输机'
//   },
//   {
//     value: 117600,
//     label: '轮式装载机械'
//   },
//   {
//     value: 117601,
//     label: '轮式挖掘机械'
//   },
//   {
//     value: 117602,
//     label: '轮式平地机械'
//   },
//   {
//     value: 117603,
//     label: '重型全挂车'
//   },
//   {
//     value: 117604,
//     label: '重型普通全挂车'
//   },
//   {
//     value: 117605,
//     label: '重型厢式全挂车'
//   },
//   {
//     value: 117606,
//     label: '重型罐式全挂车'
//   },
//   {
//     value: 117607,
//     label: '重型平板全挂车'
//   },
//   {
//     value: 117608,
//     label: '重型集装箱全挂车'
//   },
//   {
//     value: 117609,
//     label: '重型自卸全挂车'
//   },
//   {
//     value: 117610,
//     label: '重型仓栅式全挂车'
//   },
//   {
//     value: 117611,
//     label: '重型旅居全挂车'
//   },
//   {
//     value: 117612,
//     label: '重型专项作业全挂车'
//   },
//   {
//     value: 117613,
//     label: '中型全挂车'
//   },
//   {
//     value: 117614,
//     label: '中型普通全挂车'
//   },
//   {
//     value: 117615,
//     label: '中型厢式全挂车'
//   },
//   {
//     value: 117616,
//     label: '中型罐式全挂车'
//   },
//   {
//     value: 117617,
//     label: '中型平板全挂车'
//   },
//   {
//     value: 117618,
//     label: '中型集装箱全挂车'
//   },
//   {
//     value: 117619,
//     label: '中型自卸全挂车'
//   },
//   {
//     value: 117620,
//     label: '中型仓栅式全挂车'
//   },
//   {
//     value: 117621,
//     label: '中型旅居全挂车'
//   },
//   {
//     value: 117622,
//     label: '中型专项作业全挂车'
//   },
//   {
//     value: 117623,
//     label: '轻型全挂车'
//   },
//   {
//     value: 117624,
//     label: '轻型普通全挂车'
//   },
//   {
//     value: 117625,
//     label: '轻型厢式全挂车'
//   },
//   {
//     value: 117626,
//     label: '轻型罐式全挂车'
//   },
//   {
//     value: 117627,
//     label: '轻型平板全挂车'
//   },
//   {
//     value: 117628,
//     label: '轻型自卸全挂车'
//   },
//   {
//     value: 117629,
//     label: '轻型仓栅式全挂车'
//   },
//   {
//     value: 117630,
//     label: '轻型旅居全挂车'
//   },
//   {
//     value: 117631,
//     label: '轻型专项作业全挂车'
//   },
//   {
//     value: 117632,
//     label: '重型半挂车'
//   },
//   {
//     value: 117633,
//     label: '重型普通半挂车'
//   },
//   {
//     value: 117634,
//     label: '重型厢式半挂车'
//   },
//   {
//     value: 117635,
//     label: '重型罐式半挂车'
//   },
//   {
//     value: 117636,
//     label: '重型平板半挂车'
//   },
//   {
//     value: 117637,
//     label: '重型集装箱半挂车'
//   },
//   {
//     value: 117638,
//     label: '重型自卸半挂车'
//   },
//   {
//     value: 117639,
//     label: '重型特殊结构半挂车'
//   },
//   {
//     value: 117640,
//     label: '重型仓栅式半挂车'
//   },
//   {
//     value: 117641,
//     label: '重型旅居半挂车'
//   },
//   {
//     value: 117642,
//     label: '重型专项作业半挂车'
//   },
//   {
//     value: 117643,
//     label: '重型低平板半挂车'
//   },
//   {
//     value: 117644,
//     label: '中型半挂车'
//   },
//   {
//     value: 117645,
//     label: '中型普通半挂车'
//   },
//   {
//     value: 117646,
//     label: '中型厢式半挂车'
//   },
//   {
//     value: 117647,
//     label: '中型罐式半挂车'
//   },
//   {
//     value: 117648,
//     label: '中型平板半挂车'
//   },
//   {
//     value: 117649,
//     label: '中型集装箱半挂车'
//   },
//   {
//     value: 117650,
//     label: '中型自卸半挂车'
//   },
//   {
//     value: 117651,
//     label: '中型特殊结构半挂车'
//   },
//   {
//     value: 117652,
//     label: '中型仓栅式半挂车'
//   },
//   {
//     value: 117653,
//     label: '中型旅居半挂车'
//   },
//   {
//     value: 117654,
//     label: '中型专项作业半挂车'
//   },
//   {
//     value: 117655,
//     label: '中型低平板半挂车'
//   },
//   {
//     value: 117656,
//     label: '轻型半挂车'
//   },
//   {
//     value: 117657,
//     label: '轻型普通半挂车'
//   },
//   {
//     value: 117658,
//     label: '轻型厢式半挂车'
//   },
//   {
//     value: 117659,
//     label: '轻型罐式半挂车'
//   },
//   {
//     value: 117660,
//     label: '轻型平板半挂车'
//   },
//   {
//     value: 117661,
//     label: '轻型自卸半挂车'
//   },
//   {
//     value: 117662,
//     label: '轻型仓栅式半挂车'
//   },
//   {
//     value: 117663,
//     label: '轻型旅居半挂车'
//   },
//   {
//     value: 117664,
//     label: '轻型专项作业半挂车'
//   },
//   {
//     value: 117665,
//     label: '轻型低平板半挂车'
//   },{
//     value: 117667,
//     label: '三轮车'
//   },
//   {
//     value: 117668,
//     label: '公交车'
//   },
//   {
//     value: 117669,
//     label: '轿车'
//   },{
//     value: 117670,
//     label: '面包车'
//   },
//   {
//     value: 117671,
//     label: '皮卡'
//   },
//   {
//     value: 117672,
//     label: '商务车/MPV'
//   },
//   {
//     value: 117673,
//     label: '校车'
//   },
//   {
//     value: 117674,
//     label: '越野车/SUV'
//   },
//   {
//     value: 117675,
//     label: ' 大型货车'
//   },
//   {
//     value: 117676,
//     label: ' 集装箱车'
//   },{
//     value: 117666,
//     label: '其他'
//   }
// ]
// 开门方式
const openType = [
  { value: '117801', label: 'IC卡开门' },
  { value: '117802', label: 'NFC开门' },
  { value: '117803', label: '手机蓝牙开门' },
  { value: '117804', label: '出门按钮开门' },
  { value: '117805', label: '锁具旋钮开门' },
  { value: '117806', label: '键盘密码开门' },
  { value: '117807', label: '机械钥匙开门' },
  { value: '117808', label: '访客呼叫开门' },
  { value: '117809', label: '二代证刷卡' },
  { value: '117810', label: '其它证刷卡' },
  { value: '117811', label: 'app密码开门' },
  { value: '117812', label: '人脸识别开门' },
  { value: '117813', label: '指纹识别开门' },
  { value: '117814', label: 'APP远程开门' },
  { value: '117815', label: 'DTMF开门' },
  { value: '117816', label: '微信开门' },
  { value: '117817', label: 'IOS钥匙包' },
  { value: '117818', label: 'APP查看视频' },
  { value: '117819', label: 'APP呼叫接听' },
  { value: '117820', label: 'APP呼叫' },
  { value: '117821', label: '呼叫未开门' },
  { value: '117822', label: '密码开门' },
  { value: '117823', label: '工程助手' },
  { value: '117824', label: '工程助手查看视频' },
  { value: '117825', label: '工程助手密码' },
  { value: '117826', label: '警务助手房东' },
  { value: '117827', label: '呼叫物管机接听' },
  { value: '117828', label: '呼叫物管机' },
  { value: '117829', label: '物管机查看视频' },
  { value: '117830', label: '呼叫室内机接听' },
  { value: '117831', label: '呼叫室内机' },
  { value: '117832', label: '室内机查看视频' },
  { value: '117833', label: '室内机密码' },
  { value: '117834', label: 'AP热点' },
  { value: '117835', label: '蓝牙设备' },
  { value: '117836', label: '手机蓝牙' },
  { value: '117837', label: '系统开门' },
  { value: '117838', label: '86盒刷卡' },
  { value: '117839', label: '86盒密码' },
  { value: '117840', label: '人脸识别' },
  { value: '117841', label: 'TOTP密码' },
  { value: '117842', label: '身份证卡' },
  { value: '117843', label: '二维码' },
  { value: '117844', label: '门磁开门' },
  { value: '117845', label: '人证合一开门' },
  { value: '117846', label: '呼叫人证开门' },
  { value: '117847', label: 'ic卡' },
  { value: '117848', label: '银行卡' },
  { value: '117849', label: '居住证卡' },
  { value: '117850', label: '羊城通卡' },
  { value: '117851', label: '其它卡' },
  { value: '117852', label: '临时密码' },
  { value: '117853', label: '转接电话开门' }
];

/*摄像机状态*/
const deviceState = [
  { value: null || '', label: '未知' },
  { value: '100501', label: '离线' },
  { value: '100502', label: '就绪' }, //就绪
  { value: '100503', label: '获取转发中' }, //获取转发中
  { value: '100504', label: '连接转发中' }, //连接转发中
  { value: '100505', label: '推流中' }, //推流中
  { value: '100506', label: '断开转发中' } //断开转发中
];

/* 摄像机类型 */
const deviceType = [
  { value: null || '' || '100604', label: '智能枪机' },
  { value: '100602', label: '球机' },
  { value: '100603', label: '抓拍机' },
  { value: '100605', label: '单兵' },
  { value: '103406', label: '门禁' },
  { value: '100607', label: '闸机' },
  { value: '118901', label: 'wifi探针' }
];

/* 存储方式 */
const storeType = [
  { value: null || '', label: '未知' },
  { value: '101401', label: '不存储' },
  { value: '101402', label: '事件存储' },
  { value: '101403', label: '循环存储' }
];
/* 夜视与曝光 */
const nightVision = [
  { value: null || '', label: '未知' },
  { value: '111401', label: '自动' },
  { value: '111402', label: '开启夜视' },
  { value: '111403', label: '关闭夜视' }
];

/* 清晰度 */
const videoQuality = [
  { value: null || '', label: '未知' },
  { value: '100151', label: '流畅' },
  { value: '100152', label: '高清' },
  { value: '100153', label: '超清' }
];

/* 清晰度 */
const resolution = [
  { value: null || '', label: '未知' },
  { value: '110401', label: '1080P' },
  { value: '110402', label: '720P' }
];

/* 设备品牌 */
const brand = [
  { value: null || '', label: '未知' },
  { value: '107401', label: '萤石' },
  { value: '107402', label: '爱耳目' },
  { value: '107403', label: '海康' },
  { value: '107404', label: '大华' },
  { value: '107405', label: '宇视' },
  { value: '107406', label: '同为' },
  { value: '107407', label: '科宁' }
];
/* 云录像*/
const cloudVideo = [{ value: null || '', label: '未知' }];
/*云台 */
const platform = [
  { value: null || '', label: '未知' },
  { value: '0', label: '否' },
  { value: '1', label: '是' }
];

/* 存储方式 */
const installMethod = [
  { value: '101801', label: '支架' },
  { value: '101802', label: '吊顶' },
  { value: '101803', label: '壁装' },
  { value: '101804', label: '立杆（大于8米）' },
  { value: '101805', label: '立杆（6~8米）' },
  { value: '101806', label: '立杆（小于6米）' },
  { value: '101807', label: '悬臂托装' },
  { value: '101808', label: '悬臂吊装' }
];

/*安装区域*/
const geoAddress = [
  //{ value: null, label: '不限' },
  { value: '102401', label: '社区' },
  { value: '102402', label: '网吧' },
  { value: '102403', label: '酒店' },
  { value: '102404', label: '餐厅' },
  { value: '102405', label: '商场' },
  { value: '102406', label: '重点区域' },
  { value: '102407', label: '重点商铺' },
  { value: '102408', label: '停车棚' },
  { value: '102409', label: '其他' }
];

/* 图库-人脸特征 */
const eyeGlass = [
  // { value: '112800', label: '是否戴眼镜' },
  { value: null, label: '全部' },
  { value: '112801', label: '戴眼镜' },
  { value: '-112801', label: '没戴眼镜' }
  // 此处与大数据及后台开发人员协调，具体可以联系 郑刚
];

/* 人体特征 */
const bodyClass = [{ value: null, label: '全部' }];

/* 头部特征 */
const head = [
  { value: null, label: '全部' },
  { value: '112001', label: '戴眼镜' },
  { value: '112002', label: '戴帽子' },
  { value: '112003', label: '戴头盔' },
  { value: '112004', label: '戴口罩' }
];

/* 随身物品 */
const goods = [
  { value: null, label: '全部' },
  { value: '112301', label: '双肩包' },
  { value: '112302', label: '手提包' },
  { value: '112303', label: '拎物品' },
  // { value: '112304', label: '单肩包或斜跨包' },
  { value: '112304', label: '单肩包' },
  { value: '112305', label: '婴儿车' },
  { value: '112306', label: '行李箱' }
  // { value: '103207', label: '未知' }
];
/* 上身纹理 */
const upperTexture = [
  { value: null, label: '全部' },
  { value: '112101', label: '格子' },
  { value: '112102', label: '花纹' },
  { value: '112103', label: '纯色' },
  { value: '112104', label: '条纹' }
];

/* 下身纹理 */
const lowerTexture = [
  { value: null, label: '全部' },
  { value: '112201', label: '短裤' },
  { value: '112202', label: '裙子' },
  { value: '112203', label: '长裤' }
  // { value: '112204', label: '未知' }
];
/*抓拍时间*/
const captureTime = [
  // { value: null, label: '不限' },
  { value: 1, label: '24小时' },
  { value: 3, label: '三天' },
  { value: 7, label: '一周' },
  { value: 30, label: '一个月' }
];

/**白色 灰色 黑色 绿色 蓝色 红色 紫色 黄色 粉色 橙色 棕色 花色 */

/*上身颜色*/
const upperColor = [
  { value: null, label: '全部', text: '全部' },
  { value: '112401', label: '#ffffff', text: '白色' },
  { value: '112402', label: '#B5BBC7', text: '灰色' },
  { value: '112403', label: '#000000', text: '黑色' },
  { value: '112404', label: '#00FF33', text: '绿色' },
  { value: '112405', label: '#0099FF', text: '蓝色' },
  { value: '112406', label: '#FF0000', text: '红色' },
  { value: '112407', label: '#9900FF', text: '紫色' },
  { value: '112408', label: '#FFDD00', text: '黄色' },
  { value: '112409', label: '#d82b8f', text: '粉色' },
  { value: '112410', label: '#FF8800', text: '橙色' },
  { value: '112411', label: '#B36D57', text: '棕色' },
  { value: '112412', label: '花色', text: '花色' }
];

/*下身颜色*/
const lowerColor = [
  { value: null, label: '全部', text: '全部' },
  { value: '112501', label: '#ffffff', text: '白色' },
  { value: '112502', label: '#B5BBC7', text: '灰色' },
  { value: '112503', label: '#000000', text: '黑色' },
  { value: '112504', label: '#00FF33', text: '绿色' },
  { value: '112505', label: '#0099FF', text: '蓝色' },
  { value: '112506', label: '#FF0000', text: '红色' },
  { value: '112507', label: '#9900FF', text: '紫色' },
  { value: '112508', label: '#FFDD00', text: '黄色' },
  { value: '112509', label: '#d82b8f', text: '粉色' },
  { value: '112510', label: '#FF8800', text: '橙色' },
  { value: '112511', label: '#B36D57', text: '棕色' },
  { value: '112512', label: '花色', text: '花色' }
];

/*置信度*/
const confidence = [
  { value: 0.6, label: '60' },
  { value: 0.65, label: '65' },
  { value: 0.7, label: '70' },
  { value: 0.75, label: '75' },
  { value: 0.8, label: '80' },
  { value: 0.85, label: '85' },
  { value: 0.9, label: '90' },
  { value: 0.95, label: '95' }
];

/* 部门类型 */
const departmentType = [
  { value: 1008000, label: '政府部门' },
  { value: 1008001, label: '社群小区' }
];

/*日期格式*/
const timeFormat = [
  { value: 111601, label: 'XXXX-XX-XX（年月日）' },
  { value: 111602, label: 'XX-XX-XXXX（月日年）' },
  { value: 111603, label: 'XX-XX-XXXX（日月年）' },
  { value: 111604, label: 'XX/XX/XXXX（月日年）' },
  { value: 111605, label: 'XXXX/XX/XX（年月日）' },
  { value: 111606, label: 'XX/XX/XXXX（日月年）' }
];

const is24Or12Hour = [
  { value: 111701, label: '12小时' },
  { value: 111702, label: '24小时' }
];

const userGrade = [
  { value: 60, label: '市局' },
  { value: 40, label: '分局' },
  { value: 20, label: '派出所' }
];

const robotStatus = [
  { value: 'online', label: '在线' },
  { value: 'offline', label: '离线' }
];

/**
 * 机器人状态码
 */
const robotRealtimeStatus = [
  { value: 'dleState', label: '空闲态' },
  { value: 'offline', label: '离线' },
  { value: 'remoteControlState', label: '遥控中' },
  { value: 'navigationState', label: '导航中' },
  { value: 'chargeState', label: '充电中' },
  { value: 'violenceState', label: '制暴态' },
  { value: 'emergencyStopState', label: '急停态' },
  { value: 'upgradeState', label: '升级态' },
  { value: 'chargeNav', label: '寻充态' },
  { value: 'mappingState', label: '建图态' },
  { value: 'initState', label: '初始态' },
  { value: 'patrol', label: '巡逻' },
  { value: 'fault', label: '故障' },
  { value: 'sosStatus', label: 'Sos状态' },
  { value: 'unknown', label: '未知' },
  { value: 'online', label: '在线' }
];

/**
 * 弹窗、告警
 */
const sosWarnOptions = [
  { label: '弹窗', value: 'bounced' },
  { label: '告警声', value: 'voice' }
];

/**
 * 告警的音乐列表
 */
const musicList = [
  { label: 'Apple', value: 1 },
  { label: 'Pear', value: 2 },
  { label: 'Orange', value: 3 }
];

/* 碰撞模式 */
const CollisionMode = [
  { value: 0, label: '普通模式' },
  { value: 1, label: '安全模式' }
];

/* 灯带亮度 */
const lightList = [
  { value: 0, label: '1' },
  { value: 1, label: '2' },
  { value: 2, label: '3' },
  { value: 3, label: '4' },
  { value: 4, label: '5' },
  { value: 5, label: '6' }
];
/* 灯闪速度 */
const lightSpeedList = [{ value: 0, label: '快' }, { value: 1, label: '慢' }];

/* 码流画质 */
const streamList = [
  { value: 1, label: '低' },
  { value: 2, label: '中' },
  { value: 3, label: '高' }
];
/*行为识别 */
const behavitor = [
  { value: 'VCA_RUN', label: '奔跑' },
  { value: 'VCA_HIGHT_DENSITY', label: '区域内人员密度' },
  { value: 'VCA_FALL_DOWN', label: '倒地检测' },
  { value: 'VCA_VIOLENT_MOTION', label: '剧烈运动' }
];

// 分屏下拉菜单设置
const screenSplitMap = [
  {
    label: '单屏',
    value: 1,
    icon: 'danfenping',
    width: '100%',
    height: '100%'
  },
  { label: '4分屏', value: 4, icon: 'sifenping', width: '50%', height: '50%' },
  {
    label: '9分屏',
    value: 9,
    icon: 'jiufenping',
    width: '33.33%',
    height: '33.33%'
  },
  {
    label: '16分屏',
    value: 16,
    icon: 'shiliufenping',
    width: '25%',
    height: '25%'
  }
];
// 图库人体特征
const bodyTags = [
  { value: '112001', label: '眼镜' },
  { value: '112002', label: '帽子' },
  { value: '112003', label: '头盔' },
  { value: '112004', label: '口罩' },
  { value: '112301', label: '双肩包' },
  { value: '112302', label: '手提包' },
  { value: '112303', label: '拎物品' },
  { value: '112304', label: '单肩包或斜跨包' },
  { value: '112305', label: '婴儿车' },
  { value: '112306', label: '行李箱' },
  { value: '112101', label: '格子上身' },
  { value: '112102', label: '花纹上身' },
  { value: '112103', label: '纯色上身' },
  { value: '112104', label: '条纹上身' },
  { value: '112201', label: '短裤' },
  { value: '112202', label: '短裙' },
  { value: '112203', label: '长裤' },
  { value: '112801', label: '戴眼镜' }
];

/*根据键值读取值*/
const getKeyValue = (code, key) => {
  let lable;
  try {
    let temp = eval(code).filter(v => v.value == key);
    lable = temp.length > 0 ? temp[0]['label'] : '未知';
  } catch (e) {
    console.error(e);
    lable = '未知';
  }
  return lable;
};

/*根据键值读取对象*/
const getKeyLable = (code, key) => {
  let label;
  try {
    label = eval(code).filter(v => v.value == key);
    label = label.length > 0 ? label[0] : null;
  } catch (e) {
    console.error(e);
    label = null;
  }
  return label;
};

/* 报警处置 */
const alarmOperationType = [
  {
    value: null || '',
    label: '不限'
  },
  {
    value: '1',
    label: '已处理'
  },
  {
    value: '2',
    label: '未处理'
  },
  {
    value: '3',
    label: '有效'
  },
  {
    value: '4',
    label: '无效'
  }
];

/* 三级菜单 */
const actionModelType = [
  {
    value: null,
    label: '全部'
  },
  {
    value: '103900',
    label: '视频监控',
    parent: '103900'
  },
  // {
  //   value: '104000',
  //   label: '实时监控',
  //   parent: '104000'
  // },
  {
    value: '104100',
    label: '人脸图库',
    parent: '104100'
  },
  {
    value: '104200',
    label: '人体图库',
    parent: '104100'
  },
  {
    value: '104300',
    label: '组织管理',
    parent: '104300'
  },
  {
    value: '104400',
    label: '用户管理',
    parent: '104300'
  },
  {
    value: '104500',
    label: '角色管理',
    parent: '104300'
  },
  {
    value: '104600',
    label: '设备管理',
    parent: '104300'
  },
  {
    value: '104700',
    label: '日志管理',
    parent: '104300'
  },
  {
    value: '105500',
    label: '单兵管理',
    parent: '104300'
  },
  {
    value: '105000',
    label: '布控库',
    parent: '105000'
  },
  {
    value: '105100',
    label: '布控任务',
    parent: '105000'
  },
  {
    value: '105200',
    label: '警情处理',
    parent: '105000'
  },
  {
    value: '104800',
    label: '极光推送',
    parent: '104800'
  },
  {
    value: '104900',
    label: '火眼金睛',
    parent: '104800'
  }
  // {
  //   value: '105300',
  //   label: '新闻列表',
  //   parent: '105300'
  // },
  // {
  //   value: '105400',
  //   label: '线索列表',
  //   parent: '105300'
  // }
];

/* 操作功能 */
const actionFeaturnType = [
  {
    value: null,
    label: '全部'
  },
  // {
  //   value: '103900',
  //   label: '进入视频查看页面',
  //   parent: '103900'
  // },
  {
    value: '103901',
    label: '实时视频查看',
    parent: '103900'
  },
  {
    value: '103902',
    label: '历史录像查看',
    parent: '103900'
  },
  {
    value: '103903',
    label: '历史录像下载',
    parent: '103900'
  },
  {
    value: '103904',
    label: '云台控制',
    parent: '103900'
  },
  {
    value: '103905',
    label: '监控截屏',
    parent: '103900'
  },
  // {
  //   value: '104000',
  //   label: '进入实时监控页面',
  //   parent: '104000'
  // },
  // {
  //   value: '104001',
  //   label: '摄像机展示',
  //   parent: '104000'
  // },
  // {
  //   value: '104002',
  //   label: '实时结构化',
  //   parent: '104000'
  // },
  // {
  //   value: '104003',
  //   label: '实时视频',
  //   parent: '104000'
  // },
  // {
  //   value: '104004',
  //   label: '历史视频',
  //   parent: '104000'
  // },
  // {
  //   value: '104005',
  //   label: '报警截屏',
  //   parent: '104000'
  // },
  // {
  //   value: '104100',
  //   label: '进入人脸图库页面',
  //   parent: '104100'
  // },
  {
    value: '104101',
    label: '人脸库查询',
    parent: '104100',
    url: '/largeData/faceList'
  },
  {
    value: '104102',
    label: '人脸以图搜图',
    parent: '104100',
    url: '/largeData/face'
  },
  {
    value: '104103',
    label: '人脸图库搜图',
    parent: '104200'
  },
  {
    value: '104104',
    label: '人脸上传搜图',
    parent: '104200'
  },
  // {
  //   value: '104200',
  //   label: '进入人体图库页面',
  //   parent: '104200'
  // },
  {
    value: '104201',
    label: '人体库查询',
    parent: '104200',
    url: '/largeData/bodyList'
  },
  {
    value: '104202',
    label: '人体以图搜图',
    parent: '104200',
    url: '/largeData/pic'
  },
  {
    value: '104203',
    label: '人体图库搜图',
    parent: '104200'
  },
  {
    value: '104204',
    label: '人体上传搜图',
    parent: '104200'
  },
  // {
  //   value: '104300',
  //   label: '进入组织页面',
  //   parent: '104300'
  // },
  {
    value: '104301',
    label: '查看组织信息',
    parent: '104300',
    url: '/org/queryOrgList'
  },
  {
    value: '104302',
    label: '新增组织',
    parent: '104300',
    url: '/org/addOrg'
  },
  {
    value: '104303',
    label: '编辑组织',
    parent: '104300',
    url: '/user/changeUser'
  },
  {
    value: '104304',
    label: '删除组织',
    parent: '104300',
    url: '/org/orgDel'
  },
  // {
  //   value: '104400',
  //   label: '进入用户页面',
  //   parent: '104400'
  // },
  {
    value: '104401',
    label: '查看用户信息',
    parent: '104400',
    url: '/user/queryUserByOrgId'
  },
  {
    value: '104402',
    label: '新增用户',
    parent: '104400',
    url: '/user/add0User'
  },
  {
    value: '104403',
    label: '编辑用户',
    parent: '104400',
    url: '/user/changeUser'
  },
  {
    value: '104404',
    label: '删除用户',
    parent: '104400',
    url: '/user/delUser'
  },
  {
    value: '104405',
    label: '停用/启用用户',
    parent: '104400',
    url: '/user/changeUserStatus'
  },
  {
    value: '104406',
    label: '用户登录',
    parent: '104400',
    url: '/user/changeUserStatus'
  },
  {
    value: '104407',
    label: '退出登录',
    parent: '104400',
    url: '/user/changeUserStatus'
  },
  // {
  //   value: '104500',
  //   label: '进入角色页面',
  //   parent: '104500'
  // },
  {
    value: '104501',
    label: '查看角色信息',
    parent: '104500',
    url: '/user/queryRoleList'
  },
  {
    value: '104502',
    label: '新增角色',
    parent: '104500',
    url: '/user/addRole'
  },
  {
    value: '104503',
    label: '编辑角色',
    parent: '104500',
    url: '/user/changeRole'
  },
  {
    value: '104504',
    label: '删除角色',
    parent: '104500',
    url: '/user/delRole/{roleId}'
  },
  // {
  //   value: '104600',
  //   label: '进入设备页面',
  //   parent: '104600'
  // },
  {
    value: '104601',
    label: '查看摄像机信息',
    parent: '104600',
    url: '/device/getCameraInfoByDeviceId/'
  },
  {
    value: '104602',
    label: '编辑摄像机',
    parent: '104600',
    url: '/device/updateDeviceByCameraVo'
  },
  {
    value: '104603',
    label: '分配摄像机',
    parent: '104600'
  },
  // {
  //   value: '104700',
  //   label: '进入日志页面',
  //   parent: '104700'
  // },
  {
    value: '104701',
    label: '日志查看',
    parent: '104700'
  },
  {
    value: '104702',
    label: '导出日志信息',
    parent: '104700'
  },
  {
    value: '104801',
    label: '极光推送',
    parent: '104800'
  },
  {
    value: '104901',
    label: '人脸图库比对',
    parent: '104900'
  },
  {
    value: '104902',
    label: '人员轨迹分析',
    parent: '104900'
  },
  // {
  //   value: '105500',
  //   label: '进入单兵页面',
  //   parent: '105500'
  // },
  {
    value: '105501',
    label: '新增单兵',
    parent: '105500',
    url: '/device/registerSolosCamera'
  },
  {
    value: '105502',
    label: '编辑单兵名称',
    parent: '105500',
    url: '/device/updateDeviceByCameraVo'
  },
  {
    value: '105503',
    label: '绑定单兵',
    parent: '105500',
    url: '/device/bindUserSolosDevice'
  },
  {
    value: '105504',
    label: '解绑单兵',
    parent: '105500',
    url: '/device/removeBindUserSolosDevice'
  },
  // {
  //   value: '105000',
  //   label: '进入布控库页面',
  //   parent: '105000'
  // },
  {
    value: '105001',
    label: '查询列表',
    parent: '105000',
    url: '/alarm/selectBlacklist'
  },
  {
    value: '105002',
    label: '新建布控库',
    parent: '105000'
  },
  {
    value: '105003',
    label: '删除布控库',
    parent: '105000',
    url: '/alarm/deleteBlackList/'
  },
  {
    value: '105004',
    label: '修改布控库',
    parent: '105000'
  },
  // {
  //   value: '105005',
  //   value: '查询布控库详情',
  //   parent: '105000'
  // },
  {
    value: '105006',
    label: '本地添加布控人员',
    parent: '105000'
  },
  {
    value: '105007',
    label: '社区添加布控人员',
    parent: '105000',
    url: '/alarm/saveObjectInfoBatch'
  },
  {
    value: '105008',
    label: '批量添加布控人员',
    parent: '105000'
  },
  {
    value: '105009',
    label: '修改布控人员信息',
    parent: '105000'
  },
  {
    value: '105010',
    label: '删除布控人员',
    parent: '105000',
    url: '/alarm/deleteObjectMain'
  },
  // {
  //   value: '105100',
  //   label: '进入布控任务页面',
  //   parent: '105100'
  // },
  {
    value: '105101',
    label: '列表查询',
    parent: '105100',
    url: '/alarm/selectTaskList'
  },
  {
    value: '105102',
    label: '新建布控任务',
    parent: '105100'
  },
  {
    value: '105103',
    label: '删除布控任务',
    parent: '105100',
    url: '/alarm/deleteTaskList/'
  },
  {
    value: '105104',
    label: '修改布控任务',
    parent: '105100'
  },
  // {
  //   value: '105105',
  //   value: '查询布控详情',
  //   parent: '105100'
  // },
  {
    value: '105106',
    label: '修改任务状态',
    parent: '105100',
    url: '/alarm/changeTaskListType'
  },
  // {
  //   value: '105200',
  //   label: '进入警情处理页面',
  //   parent: '105200'
  // },
  {
    value: '105201',
    label: '查询列表',
    parent: '105200'
    // url: '/alarm/selectHistoryAlarmResult'
  },
  {
    value: '105202',
    label: '警情设置处理结果',
    parent: '105200',
    url: '/alarm/saveHistoryAlarmResult'
  },
  {
    value: '105203',
    label: '查询详情',
    parent: '105200',
    url: '/alarm/selectHistoryAlarmResultDetail'
  }
  // {
  //   value: '105300',
  //   label: '进入新闻页面',
  //   parent: '105300'
  // },
  // {
  //   value: '105301',
  //   label: '查询列表',
  //   parent: '105300'
  // },
  // {
  //   value: '105302',
  //   label: '新闻发布',
  //   parent: '105300',
  //   url: '/v1/cmsMessageQueueTest'
  // },
  // {
  //   value: '105303',
  //   label: '删除新闻',
  //   parent: '105300'
  // },
  // {
  //   value: '105304',
  //   label: '查询详情',
  //   parent: '105300'
  // },
  // {
  //   value: '105400',
  //   label: '进入线索页面',
  //   parent: '105400'
  // },
  // {
  //   value: '105401',
  //   label: '查询列表',
  //   parent: '105400'
  // },
  // {
  //   value: '105402',
  //   label: '线索处理',
  //   parent: '105400',
  //   url: '/cms/v1/updateTipValued'
  // },
  // {
  //   value: '105403',
  //   label: '删除线索',
  //   parent: '105400'
  // },
  // {
  //   value: '105404',
  //   label: '查询详情',
  //   parent: '105400'
  // },
  // {
  //   value: '105405',
  //   label: '线索导出',
  //   parent: '105400',
  //   url: '/cms/v1/export1'
  // }
];
const appList= [{
	"code": 103800,
	"text": "登录"
	}, {
	"code": 103900,
	"text": "视频监控"
	},{
	"code": 105200,
	"text": "告警处理"
	}, {
	"code": 104100,
	"text": "人脸图库"
	},{
	"code": 107400,
	"text": "资源下载"
	},{
    "code": 107500,
    "text": "人员追踪管理"
  },{
    "code": 104200,
    "text": "人体图库"
  },{
		"code": 105600,
    "text": "车辆图库"
	},{
  "code": 105700,
  "text": "以图搜图"
  },{
		"text": "登录系统",
		"code": 103801,
		"parent": 103800
		}, {
		"code": 103901,
		"parent": 103900,
		"text": "查看实时视频"
		}, {
		"code": 103902,
		"parent": 103900,
		"text": "查看历史视频"
		}, {
		"code": 105299,
		"parent": 105200,
		"text": "进入警情列表界面"
		}, {
		"code": 105203,
		"parent": 105200,
		"text": "查看告警信息"
		}, {
		"text": "进入人脸图库界面",
		"code": 104199,
		"parent": 104100
		}, {
		"text": "查看人脸抓拍照片",
		"code": 104105,
		"parent": 104100
		}, {
		"code": 107401,
		"parent": 107400,
		"text": "下载照片"
		}, {
		"code": 107501,
		"parent": 107500,
		"text": "新建任务"
		}, {
		"code": 104299,
		"parent": 104200,
		"text": "进入人体图库界面"
		},{
    "text": "查看人体抓拍照片",
    "code": 104205,
    "parent": 104200
    },{
    "code": 105699,
    "parent": 105600,
    "text": "进入车辆图库界面"
    }, {
    "code": 105601,
    "parent": 105600,
    "text": "查看车辆抓拍图片"
    },{
    "code": 105700,
    "parent": 105700,
    "text": "进入以图搜图界面"
    }, {
    "code": 105701,
    "parent": 105700,
    "text": "人脸照片以图搜图"
    }, {
    "code": 105702,
    "parent": 105700,
    "text": "人体照片以图搜图"
    }, {
    "code": 107599,
    "parent": 107500,
    "text": "进入人员追踪界面"
    }, {
    "code": 107502,
    "parent": 107500,
    "text": "删除任务"
    }, {
    "code": 107503,
    "parent": 107500,
    "text": "开始/暂停任务"
    }, {
    "code": 107504,
    "parent": 107500,
    "text": "重新布控任务"
    }, {
    "code": 107505,
    "parent": 107500,
    "text": "布控任务编辑"
		}]
export {
  screenSplitMap,
  behavitor,
  streamList,
  lightSpeedList,
  lightList,
  CollisionMode,
  musicList,
  sosWarnOptions,
  robotStatus,
  robotRealtimeStatus,
  sex,
  nation,
  roomMateType,
  marital,
  plateColor,
  vehicleColor,
  cardType,
  peopleTitle,
  openType,
  vehicleBrands,
  vehicleClasses,
  deviceState,
  deviceType,
  eyeGlass,
  head,
  goods,
  upperTexture,
  lowerTexture,
  captureTime,
  getKeyValue,
  getKeyLable,
  upperColor,
  lowerColor,
  confidence,
  departmentType,
  storeType,
  brand,
  cloudVideo,
  platform,
  geoAddress,
  installMethod,
  nightVision,
  videoQuality,
  resolution,
  userGrade,
  cameraOrientation,
  bodyTags,
  alarmOperationType,
  actionModelType,
  actionFeaturnType,
  identifyType,
  appList
};
