import { Config } from '../Config';
export default {
  logModule: {
    text: '日志管理',
    code: 104700,
  },
  enterLogModule: {
    text: '进入日志管理界面',
    code: 104799,
    parent: 104700,
    moduleName: 'PlatformLogger',
  },
  SEARCH: {
    value: `${Config.api}logServer/getPageLogs`,
    label: '日志查看',
  },
  SAVE: {
    value: `${Config.api}logServer/saveLog`,
    label: '日志存储'
  }
};
