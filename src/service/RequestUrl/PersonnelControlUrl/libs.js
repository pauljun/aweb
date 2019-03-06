import { Config } from '../../Config';
export default {
  moniteeFaceLibModule: {
    text: '重点人员布控库',
    code: 105000,
  },
  enterMoniteeFaceLibModule: {
    text: '进入重点人员布控布控库管理界面',
    code: 1050000,
    parent: 105000,
    moduleName: 'faceBlackLibView',
  },
  moniteeOutsidersLibModule: {
    text: '外来人员布控库',
    code: 106000,
  },
  enterMoniteeOutsidersLibModule: {
    text: '进入外来人员布控合规人员库管理界面',
    code: 1060000,
    parent: 106000,
    moduleName: 'outsidersBlackLibView',
  },
  moniteeAIOLibModule: {
    text: '专网套件布控库',
    code: 106200,
  },
  enterMoniteeAIOLibModule: {
    text: '进入专网套件布控布控库管理界面',
    code: 1062000,
    parent: 106200,
    moduleName: 'AIOLibsView',
  },
  list: {
    value: `${Config.api}alarm/selectBlacklist`,
    label: '查询列表',
  },
  usersList: {
    value: `${Config.api}org/getOrgUserTree`,
    label: '获取用户信息'
  },
  libDetail: {
    value: `${Config.api}alarm/selectBlacklist/`,
    label: '获取布控库详情',
  },
  deleteLib: {
    value: `${Config.api}alarm/deleteBlackList/`,
    label: '删除布控库',
    logInfo: [
      {
        type: 1,
        text: '删除布控库',
        code: 105003,
        parent: 105000
      },
      {
        type: 2,
        text: '删除布控库',
        code: 106004,
        parent: 106000
      },
    ]
  },
  addLib: {
    value: `${Config.api}alarm/saveBlackList`,
    label: '添加布控库',
    logInfo: [
      {
        type: 1,
        text: '新增布控库',
        code: 105002,
        parent: 105000
      },
      {
        type: 2,
        text: '新增布控库',
        code: 106005,
        parent: 106000
      },
    ]
  },
  editLib: {
    value: `${Config.api}alarm/saveBlackList`,
    label: '修改布控库',
    logInfo: [
      {
        type: 1,
        text: '编辑布控库基本信息',
        code: 105004,
        parent: 105000
      },
      {
        type: 2,
        text: '编辑布控库基本信息',
        code: 106001,
        parent: 106000
      },
    ]
  },
  machineList: {
    value: `${Config.api}alarm/selectMachineBlackList`,
    label: '一体机布控库列表'
  },
  machines: {
    value: `${Config.api}alarm/selectMachinesByConditon`,
    label: '一体机列表'
  },
  machineDetail: {
    value: `${Config.api}alarm/queryMachineBlackList/`,
    label: '一体机布控库详情'
  },
  updateMachineLib: {
    value: `${Config.api}alarm/updateMachineMonitorLib`,
    label: '编辑一体机布控库信息',
    logInfo: [
      {
        text: '编辑专网套件布控库信息',
        code: 106202,
        parent: 106200
      }
    ]
  },
  saveMachineLibPath: {
    value: `${Config.api}alarm/saveMachineMonitorLibs`,
    label: '保存一体机布控库路径'
  },
  uploadMachineMonitorLibs: {
    value: `${Config.api}alarm/uploadMachineMonitorLibs`,
    label: '一体机布控库导入',
    logInfo: [
      {
        text: '导入专网套件布控库',
        code: 106201,
        parent: 106200
      }
    ]
  }
}