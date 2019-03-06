import { Config } from '../Config';
const { api } = Config;
export default {
  userModule: {
    code: 104400,
    text: '用户管理',
  },
  enterUserModule: {
    text: '进入用户管理界面',
    code: 104499,
    parent: 104400,
    moduleName: 'UserView',
  },
  userLoginModel: {
    code: 103800,
    text: '登录',
  },
  USER_INFO: {
    value: `${api}user/queryUserPrivileges`,
    label: '用户信息'
  },
  USER_DETAIL: {
    value: `${api}user/queryUserInfo`,
    label: '用户详情',
    logInfo: [
      {
        code: 104401,
        parent: 104400,
        text: '查看用户信息',
      }
    ]
  },
  USER_LIST: {
    value: `${api}user/queryUserByOrgId`,
    label: '用户列表',
  },
  GET_Priv_USERS_LIST: {
    value: `${api}user/queryUserByPrivilegeIdAndOrgIds/`,
    label: ' 根据权限id查询当前组织下拥有某一权限的所有用户信息'
  },
  USER_ADD: {
    value: `${api}user/add0User`,
    label: '新增用户',
    logInfo: [{
      code: 104402,
      parent: 104400,
      text: '新增用户'
    }]
  },
  USER_UPDATE: {
    value: `${api}user/changeUser`,
    label: '编辑用户',
    logInfo: [{
      code: 104403,
      parent: 104400,
      text: '编辑用户'
    }]
  },
  USER_DEL: {
    value: `${api}user/delUser`,
    label: '删除用户',
    logInfo: [{
      code: 104404,
      parent: 104400,
      text: '移除用户'
    }]
  },
  USER_CHANGE_STATUS: {
    value: `${api}user/changeUserStatus`,
    label: '停用/启用用户',
    logInfo: [
      {
        code: 104405,
        parent: 104400,
        text: '停用/启用用户'
      }
    ]
  },
  USER_LOGIN_CODE: {
    value: `${api}user/loginNewForWeb`,
    label: '获取验证码',
    // logInfo: [
    //   {
    //     code: 103801,
    //     parent: 103800,
    //     text: '登录系统'
    //   }
    // ]
  },
  USER_LOGIN: {
    value: `${api}user/loginNew`,
    label: '用户登录',
    logInfo: [
      {
        code: 103801,
        parent: 103800,
        text: '登录系统'
      }
    ]
  },
  USER_LOGOUT: {
    value: `${api}user/logout`,
    label: '退出登录',
  },
  USER_CHANGE_PWD: {
    value: `${api}user/changePwd`,
    label: '修改密码'
  },
  USER_CHANGE_AVATAR: {
    value: `${api}user/changeUserImg`,
    label: '更改用户头像'
  },
  USER_SEND_CODE: {
    value: `${api}user/sendLoginIdentifyCode`,
    label: '发送手机验证码'
  },
  USER_ZOOM_LEVEL_CENTER: {
    value: `${api}user/getUserZoomLevelCenter`,
    label: '放大级别'
  },
  USER_SYSTEM_TIME: {
    value: `${api}user/getServerTimeStamp`,
    label: '系统时间'
  },
  USER_RESET_PWD: {
    value: `${api}user/resetPassword`,
    label: '密码重置'
  },
  CENTER_INFO: {
    value: `${api}optCenter/detail`,
    label: '运营中心信息'
  },
  USER_ALARM_NUM: {
    value: `${api}alarmStatistics/countAlarmCountByUserIds`,
    label: '查询用户报警数'
  }
};
