// 用户权限字典
// level: 权限级别
// key: 后台权限code码
// parentId：父级id
// text: 描述文本
// check： 选中状态
// value: 前端权限code码
export const userPrivilegeMap = [
  // 首页
  { level: 1, key: 1070000, parentId: null, text: '辖区总览', check: false, value: 'home' },
  { level: 2, key: 1070100, parentId: null, text: '态势总揽', check: false, value: 'home_dashboard' },
  { level: 4, key: 1070101, parentId: null, text: '查看态势总揽', check: false, value: 'home_dashboard_view' },
  { level: 2, key: 1070200, parentId: null, text: '辖区面板', check: false, value: 'home_section' },
  { level: 4, key: 1070201, parentId: null, text: '查看辖区面板', check: false, value: 'home_section_search' },
  // 视频监控
  { level: 1, key: 1010000, parentId: null, text: '视频监控', check: false, value: 'monitor' },
  { level: 2, key: 1010100, parentId: null, text: '视频查看', check: false, value: 'monitor_video_search' },
  { level: 3, key: 1010102, parentId: null, text: '历史录像查看', check: false, value: 'monitor_history_video_search' },
  { level: 3, key: 1010103, parentId: null, text: '历史录像下载', check: false, value: 'monitor_history_video_download' },
  { level: 3, key: 1010104, parentId: null, text: '云台控制', check: false, value: 'monitor_live_video_search' },
  { level: 3, key: 1010105, parentId: null, text: '监控截屏', check: false, value: 'monitor_live_video_search' },
  { level: 4, key: 1010101, parentId: null, text: '实时视频查看', check: false, value: 'monitor_live_video_search' },
  // 人员布控
  { level: 1, key: 1060000, parentId: null, text: '人员布控', check: false, value: 'monitees' },
  { level: 2, key: 1010100, parentId: null, text: '实时报警', check: false, value: 'monitees_alarm' },
  { level: 2, key: 1010100, parentId: null, text: '实时报警查看', check: false, value: 'monitees_alarm_view' },

  { level: 2, key: 1060100, text: '人脸布控', check: false, value: 'monitees_black_history' },
  { level: 1, key: 1060101, text: '历史报警查询', check: false, value: 'monitees_black_history_handle' },
  { level: 1, key: 1060102, text: '历史报警详情', check: false, value: 'monitees_black_history_handle' },
]

export const userPrivilegeMap1 = [
  {
    module: { level: 1, parentId: null, key: 1070000, text: '辖区总览', check: false, value: 'home' },
    children: [
      {
        level_1: [{ level: 1, parentId: null, key: 1070100, text: '态势总览', check: false, value: 'home_statistics' }],
        level_2: [{ level: 1, parentId: null, key: 1070101, text: '态势总揽查看', check: false, value: 'home_statistics_search' }],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1070100, text: '辖区面板', check: false, value: 'home_section' }],
        level_2: [{ level: 1, parentId: null, key: 1070101, text: '辖区面板查看', check: false, value: 'home_section_search' }],
      },
    ]
  },
  {
    module: { level: 1, parentId: null, key: 1010000, text: '视频监控', check: false, value: 'monitor' },
    children: [
      {
        level_1: [{ level: 1, parentId: null, key: 1010100, text: '视频查看', check: false, value:'monitor_video_search' },],
        level_2: [{ level: 1, parentId: null, key: 1010101, text: '实时视频查看', check: false, value: 'monitor_live_video_search' }],
        level_3: [
          {level: 1, parentId: null, key: 1010102, text: '历史录像查看', check: false, value: 'monitor_history_video_search'},
          {level: 1, parentId: null, key: 1010103, text: '历史录像下载', check: false, value: 'monitor_history_video_download'}
        ]
      },
    ]
  },
  {
    module: { level: 1, parentId: null, key: 1030000, text: '数据资源库', check: false, value: 'baselib' },
    children: [
      {
        level_1: [{ level: 1, parentId: null, key: 1030100, text: '人脸图库', check: false, value: 'baselib_face' }],
        level_2: [
          { level: 1, parentId: null, key: 1030101, text: '搜人脸（同时开启人脸以图搜图）', check: false, value: 'baselib_face_search' },
        ],
        level_3: [],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1030100, text: '人体图库', check: false, value: 'baselib_body' }],
        level_2: [
          { level: 1, parentId: null, key: 1030201, text: '搜人体（同时开启人体以图搜图）', check: false, value: 'baselib_body_search' },
        ],
        level_3: [],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1030100, text: '车辆库', check: false, value: 'baselib_vehicle' }],
        level_2: [
          { level: 1, parentId: null, key: 1030501, text: '搜车辆', check: false, value: 'baselib_vehicle_search' },
        ],
        level_3: [],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1030100, text: 'wifi搜索', check: false, value: 'baselib_wifi' }],
        level_2: [
          { level: 1, parentId: null, key: 1030501, text: '搜wifi', check: false, value: 'baselib_wifi_search' }
        ],
        level_3: [],
      },
    ]
  },
  {
    module: { level: 1, parentId: null, key: 1060000, text: '人员布控', check: false, value: 'monitees' },
    children: [
      {
        level_1: [{ level: 1, parentId: null, key: 1060100, text: '实时告警', check: false, value: 'monitees_alarm' }],
        level_2: [{ level: 1, parentId: null, key: 1060101, text: '告警查看及处理', check: false, value: 'monitees_alarm_handle' }],
        level_3: [],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1060100, text: '重点人员布控-历史告警', check: false, value: 'monitees_black_history' }],
        level_2: [{ level: 1, parentId: null, key: 1060101, text: '告警查看及处理', check: false, value: 'monitees_black_history_handle' }],
        level_3: [],
      }, 
      {
        level_1: [{ level: 1, parentId: null, key: 1060100, text: '重点人员布控-布控任务', check: false, value: 'monitees_black_tasks' }],
        level_2: [{ level: 1, parentId: null, key: 1060201, text: '查看布控任务', check: false, value: 'monitees_black_tasks_search' }],
        level_3: [{ level: 1, parentId: null, key: 1060102, text: '管理布控任务', check: false, value: 'monitees_black_tasks_handle' }]
      }, 
      {
        level_1: [{ level: 1, parentId: null, key: 1060100, text: '重点人员布控-重点人员库管理', check: false, value: 'monitees_black_library' }],
        level_2: [{ level: 1, parentId: null, key: 1060301, text: '查看布控库', check: false, value: 'monitees_black_library_search' }],
        level_3: [{ level: 1, parentId: null, key: 1060102, text: '管理布控库', check: false, value: 'monitees_black_library_handle' }]
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1060100, text: '外来人员布控-历史告警', check: false, value: 'monitees_strange_history' }],
        level_2: [{ level: 1, parentId: null, key: 1060101, text: '告警查看及处理', check: false, value: 'monitees_strange_history_handle' }],
        level_3: [],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1060100, text: '外来人员布控-布控任务', check: false, value: 'monitees_strange_tasks' }],
        level_2: [{ level: 1, parentId: null, key: 1060501, text: '查看布控任务', check: false, value: 'monitees_strange_tasks_search' }],
        level_3: [{ level: 1, parentId: null, key: 1060502, text: '管理布控任务', check: false, value: 'monitees_strange_tasks_handle' },]
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1060100, text: '外来人员布控-外来人员库管理', check: false, value: 'monitees_strange_library' }],
        level_2: [{ level: 1, parentId: null, key: 1060601, text: '查看布控库', check: false, value: 'monitees_strange_library_search' }],
        level_3: [{ level: 1, parentId: null, key: 1060502, text: '管理布控库', check: false, value: 'monitees_strange_library_handle' },]
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1060100, text: '一体机布控-历史告警', check: false, value: 'monitees_machine_history' }],
        level_2: [{ level: 1, parentId: null, key: 1060601, text: '告警查看及处理', check: false, value: 'monitees_machine_history_handle' }],
        level_3: [],

      },
      {
        level_1: [{ level: 1, parentId: null, key: 1060100, text: '一体机布控-布控任务', check: false, value: 'monitees_machine_task' }],
        level_2: [{ level: 1, parentId: null, key: 1060901, text: '查看布控任务', check: false, value: 'monitees_machine_tasks_search' }],
        level_3: [{ level: 1, parentId: null, key: 1060902, text: '管理布控任务', check: false, value: 'monitees_machine_tasks_handle' },]
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1060100, text: '一体机布控-一体机布控库管理', check: false, value: 'monitees_machine_library' }],
        level_2: [{ level: 1, parentId: null, key: 1061001, text: '查看布控库', check: false, value: 'monitees_machine_library_search' }],
        level_3: [{ level: 1, parentId: null, key: 1061002, text: '管理布控库', check: false, value: 'monitees_machine_library_handle' }]
      },
    ]
  },
  {
    module: { level: 1, parentId: null, key: 1080000, text: '事件布防', check: false, value: 'events' },
    children: [
      {
        level_1: [{ level: 1, parentId: null, key: 1060100, text: '实时告警', check: false, value: 'events_alarm' }],
        level_2: [{ level: 1, parentId: null, key: 1060101, text: '告警查看及处理', check: false, value: 'events_alarm_handle' }],
        level_3: [],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1060100, text: '魅影告警-历史告警', check: false, value: 'monitees_all_history' }],
        level_2: [{ level: 1, parentId: null, key: 1060101, text: '告警查看及处理', check: false, value: 'monitees_all_history_handle' }],
        level_3: [],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1060100, text: '魅影告警-布控任务', check: false, value: 'monitees_all_tasks' }],
        level_2: [{ level: 1, parentId: null, key: 1060801, text: '查看布控任务', check: false, value: 'monitees_all_tasks_search' }],
        level_3: [{ level: 1, parentId: null, key: 1060102, text: '管理布控任务', check: false, value: 'monitees_all_tasks_handle' }]
      },
    ]
  },
  {
    module: { level: 1, parentId: null, key: 1080000, text: '社区管理', check: false, value: 'communities' },
    children: [
      {
        level_1: [{ level: 1, parentId: null, key: 1080100, text: '社区人员', check: false, value: 'communities_people' }],
        level_2: [{ level: 1, parentId: null, key: 1080101, text: '社区人员查看', check: false, value: 'communities_people_search' }],
        level_3: [],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1080100, text: '房屋档案', check: false, value: 'communities_house' }],
        level_2: [{ level: 1, parentId: null, key: 1080101, text: '房屋档案查看', check: false, value: 'communities_house_search' }],
        level_3: [],
      }
    ]
  },
  {
    module: { level: 1, parentId: null, key: 1040000, text: '系统管理', check: false, value: 'settings' },
    children: [
      {
        level_1: [{ level: 1, parentId: null, key: 1040100, text: '组织管理', check: false, value: 'settings_orgmgr' }],
        level_2: [{ level: 1, parentId: null, key: 1040101, text: '查看组织信息', check: false, value: 'settings_orgmgr_search' }],
        level_3: [{ level: 1, parentId: null, key: 1040101, text: '组织管理', check: false, value: 'settings_orgmgr_handle' }],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1040200, text: '用户管理', check: false, value: 'settings_usermgr' }],
        level_2: [{ level: 1, parentId: null, key: 1040201, text: '查看用户信息', check: false, value: 'settings_usermgr_search' }],
        level_3: [{ level: 1, parentId: null, key: 1040101, text: '用户管理', check: false, value: 'settings_usermgr_handle' }],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1040300, text: '角色管理', check: false, value: 'settings_rolemgr' }],
        level_2: [{ level: 1, parentId: null, key: 1040301, text: '查看角色信息', check: false, value: 'settings_rolemgr_search' }],
        level_3: [{ level: 1, parentId: null, key: 1040101, text: '角色管理', check: false, value: 'settings_rolemgr_handle' }],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1040400, text: '设备管理', check: false, value: 'settings_devicemgr' }],
        level_2: [{ level: 1, parentId: null, key: 1040401, text: '查看设备信息', check: false, value: 'settings_devicemgr_search' }],
        level_3: [
          { level: 1, parentId: null, key: 1040402, text: '编辑设备信息', check: false, value: 'settings_devicemgr_edit' },//编辑摄像机  包括  标注摄像机点位
          { level: 1, parentId: null, key: 1040403, text: '分配设备', check: false, value: 'settings_devicemgr_distribute' },
          { level: 1, parentId: null, key: 1040404, text: '地图标注', check: false, value: 'settings_devicemgr_marker' }
        ],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1040500, text: '日志管理', check: false, value: 'settings_logs' }],
        level_2: [{ level: 1, parentId: null, key: 1040501, text: '日志查看及其导出', check: false, value: 'settings_logs_handle' }],
        level_3: [],
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1040600, text: '单兵管理', check: false, value: 'settings_solosmgr' }],
        level_2: [{ level: 1, parentId: null, key: 1040601, text: '单兵设备查看', check: false, value: 'settings_solosmgr_search' }],
        level_3: [{ level: 1, parentId: null, key: 1040602, text: '单兵设备管理', check: false, value: 'settings_solosmgr_handle' }],
      }
    ]
  },
  {
    module: { level: 1, parentId: null, key: 1090000, text: '人力情报', check: false, value: 'cyqz' },
    children: [
      {
        level_1: [{ level: 1, parentId: null, key: 1090100, text: '新闻列表', check: false, value: 'cyqz_information' }],
        level_2: [{ level: 1, parentId: null, key: 1090101, text: '新闻列表', check: false, value: 'cyqz_information' }],
        level_3: []
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1090200, text: '新闻发布', check: false, value: 'cyqz_info_publish' }],
        level_2: [{ level: 1, parentId: null, key: 1090201, text: '新闻发布', check: false, value: 'cyqz_info_publish' }],
        level_3: []
      },
      {
        level_1: [{ level: 1, parentId: null, key: 1090300, text: '线索列表', check: false, value: 'cyqz_clue' }],
        level_2: [{ level: 1, parentId: null, key: 1090301, text: '线索列表', check: false, value: 'cyqz_clue' }],
        level_3: [],
      }
    ]
  },
];

