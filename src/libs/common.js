// 用户权限字典

export default [
  //系统工具

  { id: 100001010084, text: '系统工具', module: 1 },
  { id: 1100501, text: '智慧广播', parentId: 100001010084 },

  //辖区总览
  { id: 100001010049, text: '辖区总览', module: 1 },
  { id: 1070101, text: '态势总览查看', parentId: 100001010049 },
  //视频监控
  { id: 100001010018, text: '视频监控', module: 1 },
  {
    id: 1010101,
    text: '实时视频查看',
    parentId: 100001010018,
    isCancel: [1010103, 1010102]
  },
  {
    id: 1010102,
    text: '历史视频查看',
    parentId: 100001010018,
    isSelect: [1010101],
    isCancel: [1010103]
  },
  //人力情报
  // { id: 1090000, text: '人力情报',module:1},
  // { id: 1090101, text: '新闻列表',parentId:1090000},
  // { id: 1090201, text: '新闻发布',parentId:1090000},
  // { id: 1090301, text: '线索列表',parentId:1090000},
  //人员布控
  { id: 100001010046, text: '人员布控', module: 1 },
  { id: 100001010066, text: '实时告警', parentId: 100001010046, module: 2 },
  { id: 1061102, text: '告警查看及处理', parentId: 100001010066 },
  { id: 100001010069, text: '重点人员', parentId: 100001010046, module: 2 },
  { id: 1060103, text: '历史告警查看及处理', parentId: 100001010069 },
  {
    id: 1060201,
    text: '查看布控任务',
    parentId: 100001010069,
    isCancel: [1060206]
  },
  {
    id: 1060206,
    text: '管理布控任务',
    parentId: 100001010069,
    isSelect: [1060201, 1060301]
  },
  {
    id: 1060301,
    text: '查看布控库',
    parentId: 100001010069,
    isCancel: [1060206, 1060305]
  },
  {
    id: 1060305,
    text: '管理布控库',
    parentId: 100001010069,
    isSelect: [1060301]
  },
  { id: 100001010070, text: '外来人员', parentId: 100001010046, module: 2 },
  { id: 1060403, text: '历史告警查看及处理', parentId: 100001010070 },
  {
    id: 1060501,
    text: '查看布控任务',
    parentId: 100001010070,
    isCancel: [1060506]
  },
  {
    id: 1060506,
    text: '管理布控任务',
    parentId: 100001010070,
    isSelect: [1060501, 1060601]
  },
  {
    id: 1060601,
    text: '查看布控库',
    parentId: 100001010070,
    isCancel: [1060506, 1060605]
  },
  {
    id: 1060605,
    text: '管理布控库',
    parentId: 100001010070,
    isSelect: [1060601]
  },
  { id: 100001010071, text: '一体机布控', parentId: 100001010046, module: 2 },
  { id: 1061201, text: '历史告警', parentId: 100001010071 },
  {
    id: 1060901,
    text: '查看布控任务',
    parentId: 100001010071,
    isCancel: [1060902]
  },
  {
    id: 1060902,
    text: '管理布控任务',
    parentId: 100001010071,
    isSelect: [1060901, 1061001]
  },
  {
    id: 1061001,
    text: '查看布控库',
    parentId: 100001010071,
    isCancel: [1060902, 1061002]
  },
  {
    id: 1061002,
    text: '管理布控库',
    parentId: 100001010071,
    isSelect: [1061001]
  },
  //事件布防
  { id: 100001010005, text: '事件布防', module: 1 },
  { id: 100001010067, text: '实时告警', parentId: 100001010005, module: 2 },
  { id: 1100101, text: '告警查看及处理', parentId: 100001010067 },
  { id: 100001010072, text: '魅影告警', parentId: 100001010005, module: 2 },
  { id: 1100303, text: '历史告警查看及处理', parentId: 100001010072 },
  {
    id: 1100301,
    text: '查看布控任务',
    parentId: 100001010072,
    isCancel: [1100302]
  },
  {
    id: 1100302,
    text: '管理布控任务',
    parentId: 100001010072,
    isSelect: [1100301]
  },
  //图片下载
  { id: 100001010082, text: '图片下载', module: 1 },
  { id: 1100401, text: '图片下载', parentId: 100001010082 },
  { id: 1100402, text: '历史视频下载', parentId: 100001010082 },
  //数据资源库
  { id: 100001010016, text: '数据资源库', module: 1 },
  { id: 100001010020, text: '人脸图库', parentId: 100001010016, module: 2 },
  { id: 1030101, text: '搜人脸', parentId: 100001010020 },
  { id: 100001010021, text: '人体图库', parentId: 100001010016, module: 2 },
  { id: 1030201, text: '搜人体', parentId: 100001010021 },
  { id: 100001010054, text: '车辆图库', parentId: 100001010016, module: 2 },
  { id: 1030501, text: '搜车辆', parentId: 100001010054 },
  { id: 100001010002, text: '以图搜图', parentId: 100001010016, module: 2 },
  { id: 1030301, text: '搜图', parentId: 100001010002 },
  { id: 100001010086, text: 'wifi资源库', parentId: 100001010016, module: 2 },
  { id: 1030701, text: 'wifi数据查看', parentId: 100001010086,isCancel: [1030702] },
  { id: 1030702, text: 'wifi数据管理', parentId: 100001010086,isSelect: [1030701]},
  //社区管理
  { id: 100001010052, text: '社区管理', module: 1 },
  { id: 100001010073, text: '社区总览', module: 2, parentId: 100001010052 },
  { id: 1080201, text: '社区总览查看', parentId: 100001010073 },
  {
    id: 100001010074,
    text: '已登记人员管理',
    parentId: 100001010052,
    module: 2
  },
  {
    id: 1080301,
    text: '已登记人员详情',
    parentId: 100001010074,
    isCancel: [1080302]
  },
  {
    id: 1080302,
    text: '管理已登记人员',
    parentId: 100001010074,
    isSelect: [1080301]
  },
  {
    id: 100001010075,
    text: '未登记人员管理',
    parentId: 100001010052,
    module: 2
  },
  {
    id: 1080401,
    text: '未登记人员详情',
    parentId: 100001010075,
    isCancel: [1080402]
  },
  {
    id: 1080402,
    text: '管理未登记人员',
    parentId: 100001010075,
    isSelect: [1080401]
  },
  //系统管理
  { id: 100001010031, text: '系统管理', module: 1 },

  //组织
  { id: 100001010022, text: '组织管理', parentId: 100001010031, module: 2 },
  {
    id: 1040101,
    text: '查看组织信息',
    parentId: 100001010022,
    isCancel: [1040104]
  },
  {
    id: 1040104,
    text: '管理组织',
    parentId: 100001010022,
    isSelect: [1040101]
  },

  //用户
  { id: 100001010023, text: '用户管理', parentId: 100001010031, module: 2 },
  {
    id: 1040201,
    text: '查看用户信息',
    parentId: 100001010023,
    isCancel: [1040205]
  },
  {
    id: 1040205,
    text: '管理用户',
    parentId: 100001010023,
    isSelect: [1040201]
  },

  //角色
  { id: 100001010014, text: '角色管理', parentId: 100001010031, module: 2 },
  {
    id: 1040301,
    text: '查看角色信息',
    parentId: 100001010014,
    isCancel: [1040305]
  },
  {
    id: 1040305,
    text: '管理角色',
    parentId: 100001010014,
    isSelect: [1040301]
  },

  //单兵
  // { id: 100001010038, text: '单兵管理', parentId: 100001010031, module: 2 },
  // {
  // 	id: 1040601,
  // 	text: '查看单兵信息',
  // 	parentId: 100001010038,
  // 	isCancel: [ 1040605 ]
  // },
  // {
  // 	id: 1040605,
  // 	text: '单兵设备管理',
  // 	parentId: 100001010038,
  // 	isSelect: [ 1040601 ]
  // },

  //设备
  { id: 100001010024, text: '设备管理', parentId: 100001010031, module: 2 },
  {
    id: 1040401,
    text: '查看设备信息',
    parentId: 100001010024,
    isCancel: [1040402, 1040403, 1040404]
  },
  {
    id: 1040402,
    text: '编辑设备信息',
    parentId: 100001010024,
    isSelect: [1040401]
  },
  {
    id: 1040403,
    text: '分配设备',
    parentId: 100001010024,
    isSelect: [1040401]
  },
  {
    id: 1040404,
    text: '地图标注',
    parentId: 100001010024,
    isSelect: [1040401]
  },

  //日志
  { id: 100001010015, text: '日志管理', parentId: 100001010031, module: 2 },
  { id: 1040501, text: '日志查看及导出', parentId: 100001010015 },

  //(运营中心)
  { id: 100001010008, text: '小区管理', parentId: 100001010031, module: 2 },
  {
    id: 1040801,
    text: '小区查看',
    parentId: 100001010008,
    isCancel: [1040802]
  },
  {
    id: 1040802,
    text: '小区管理',
    parentId: 100001010008,
    isSelect: [1040801]
  },

  //app
  { id: 100001010081, text: 'APP权限管理', module: 1 },
  {
    id: 2010201,
    text: '实时视频',
    parentId: 100001010081,
    isCancel: [2010301, 2010401, 2010501, 2010601]
  },
  {
    id: 2010301,
    text: '以图搜图',
    parentId: 100001010081,
    isSelect: [2010201]
  },
  {
    id: 2010401,
    text: '人员追踪',
    parentId: 100001010081,
    isSelect: [2010201]
  },
  {
    id: 2010501,
    text: '人脸图库',
    parentId: 100001010081,
    isSelect: [2010201]
  },
  {
    id: 2010601,
    text: '人体图库',
    parentId: 100001010081,
    isSelect: [2010201]
  },
  {
    id: 2010801,
    text: '车辆图库',
    parentId: 100001010081
  },
  {
    id: 2010701,
    text: '智慧广播',
    parentId: 100001010081
  }
];
