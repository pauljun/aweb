import { Config } from '../../Config';
export default {
  moniteeFaceTaskModule: {
    text: '重点人员布控任务',
    code: 105100,
  },
  enterMoniteeFaceTaskModule: {
    text: '进入重点人员布控布控任务管理界面',
    code: 105199,
    parent: 105100,
    moduleName: 'faceTasks',
  },
  moniteeOutsidersTaskModule: {
    text: '外来人员布控任务',
    code: 106100,
  },
  enterMoniteeOutsidersTaskModule: {
    text: '进入外来人员布控布控任务管理界面',
    code: 106199,
    parent: 106100,
    moduleName: 'outsidersTasks',
  },
  moniteeAIOTaskModule: {
    text: '专网套件布控任务',
    code: 106300,
  },
  enterMoniteeAIOTaskModule: {
    text: '进入专网套件布控布控任务管理界面',
    code: 106399,
    parent: 106300,
    moduleName: 'AIOTasks',
  },
  moniteePhantomTaskModule: {
    text: '魅影布防布控任务',
    code: 106600,
  },
  enterMoniteePhantomTaskModule: {
    text: '进入魅影布防布控任务管理界面',
    code: 106699,
    parent: 106600,
    moduleName: 'PhantomTasks',
  },
  getTaskList: {
    value: `${Config.api}alarm/getTaskList`,
    label: '列表查询',
  },
  setWhetherIgnoreAlarm: {
    value: `${Config.api}alarm/setWhetherIgnoreAlarm`,
    label: '设置忽略/取消忽略他人授权的布控任务报警'
  },
  startPause: {
    value: `${Config.api}alarm/changeTaskListType`,
    label: '设置布控任务开启或者暂停',
    logInfo: [
      {
        type: 'faceTask',
        text: '开始/暂停布控任务',
        code: 105106,
        parent: 105100,
      },
      {
        type: 'outsidersTask',
        text: '开始/暂停布控任务',
        code: 106101,
        parent: 106100,
      },
      {
        type: 'AIOTask',
        text: '开始/暂停布控任务',
        code: 106301,
        parent: 106300,
      },
      {
        type: 'phantomTask',
        text: '开始/暂停布控任务',
        code: 106601,
        parent: 106600,
      }
    ]
  },
  delete: {
    value: `${Config.api}alarm/deleteTaskList/`,
    label: '删除布控任务',
  },
  addTask: {
    value: `${Config.api}alarm/saveTaskList`,
    label: '新建布控任务',
    logInfo: [
      {
        type: 'faceTask',
        text: '新建布控任务',
        code: 105102,
        parent: 105100,
      },
      {
        type: 'outsidersTask',
        text: '新建布控任务',
        code: 106102,
        parent: 106100,
      },
      {
        type: 'AIOTask',
        text: '新建布控任务',
        code: 106302,
        parent: 106300,
      },
      {
        type: 'phantomTask',
        text: '新建布控任务',
        code: 106602,
        parent: 106600,
      }
    ]
  },
  editTask: {
    value: `${Config.api}alarm/saveTaskList`,
    label: '修改布控任务',
    logInfo: [
      {
        type: 'faceTask',
        text: '编辑布控任务基本信息',
        code: 105104,
        parent: 105100,
      },
      {
        type: 'outsidersTask',
        text: '编辑布控任务基本信息',
        code: 106103,
        parent: 106100,
      },
      {
        type: 'AIOTask',
        text: '编辑布控任务基本信息',
        code: 106303,
        parent: 106300,
      },
      {
        type: 'phantomTask',
        text: '编辑布控任务基本信息',
        code: 106603,
        parent: 106600,
      }
    ]
  },
  taskDetailUrl: {
    value: `${Config.api}alarm/selectTaskList/`,
    label: '获取布控任务详情'
  }
}