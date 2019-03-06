import { httpRequest } from '../utils/HttpUtil';
import { USER, OPERATIONCENTER } from './RequestUrl';
import { message } from 'antd';

@httpRequest
class UserService {
  Login(options) {
    return this.$httpRequest({
      url: USER.USER_LOGIN.value,
      method: 'post',
      data: options
    });
  }
  Logout() {
    return this.$httpRequest({
      url: USER.USER_LOGOUT.value,
      method: 'post'
    });
  }
  queryUserInfo() {
    return this.$httpRequest({
      url: USER.USER_INFO.value
    });
  }
  queryUserDetail({id, name}) {
    const logInfo = {
      description: `查看用户【${name}】`,
      ...USER.USER_DETAIL.logInfo[0]
    }
    return this.$httpRequest({
      url: `${USER.USER_DETAIL.value}?userId=${id}`,
      method: 'get',
      logInfo
    });
  }
  queryUserList(options) {
    return this.$httpRequest({
      method: 'post',
      url: USER.USER_LIST.value,
      data: options,
    });
  }
  // 根据组织id、权限id查询当前组织下拥有某一权限的所有用户信息
  queryUserByPrivilegeIdAndOrgIds(options){
    return this.$httpRequest({
      method: 'post',
      url: USER.GET_Priv_USERS_LIST.value,
      data: options,
    }).then(res => {
      if (res && res.code === 200) {
        return res.result
      } else {
        message.error(res.message)
        return Promise.reject(res)
      }
    });
  }
  addUser(options) {
    let logInfo = {
      description: `新增用户【${options.loginName}】`, 
      ...USER.USER_ADD.logInfo[0]
    }
    return this.$httpRequest({
      method: 'post',
      url: USER.USER_ADD.value,
      data: options,
      logInfo,
    });
  }
  updateUser(options) {
    let logInfo = {
      description: `编辑用户【${options.loginName}】`, 
      ...USER.USER_UPDATE.logInfo[0]
    }
    return this.$httpRequest({
      method: 'post',
      url: USER.USER_UPDATE.value,
      data: options,
      logInfo,
    });
  }
  deleteUser(options) {
    let logInfo = {
      description: `移除用户【${options.loginName}】`, 
      ...USER.USER_DEL.logInfo[0]
    }
    return this.$httpRequest({
      type: 'query',
      method: 'get',
      url: USER.USER_DEL.value,
      data: {
        userId:options.id
      },
      logInfo,
    });
  }
  changePassword(params) {
    return this.$httpRequest({
      method: 'post',
      url: USER.USER_CHANGE_PWD.value,
      data: params
    });
  }
  resetPsw(params) {
    console.log(params,`${USER.USER_RESET_PWD.value}/${params}`)
    return this.$httpRequest({
      method: 'get',
      url:`${USER.USER_RESET_PWD.value}/${params}`,
      data: params
    });
  }

  // 获取验证码
  getLoginCode(data) {
    return this.$httpRequest({
      url: USER.USER_LOGIN_CODE.value,
      method: 'post',
      data
    });
  }
  //验证手机号码
  sendCode(phoneNum) {
    return this.$httpInstance({
      url: USER.USER_SEND_CODE.value,
      method: 'POST',
      data: { phoneNum: phoneNum }
    })
      .then(result => {
        result = result.data || {};
        if (result.code !== 200) {
          message.error(result.message);
          throw result;
        }
        return result;
      })
      .catch(e => {
        console.log(e, 106)
        throw '发送验证码失败';
      });
  }
  getSystemTime() {
    return this.$httpRequest({
      url: USER.USER_SYSTEM_TIME.value
    }).then(res => res.result);
  }
  /**更改用户头像 */
  updateUserLogo(data) {
    return this.$httpRequest({
      url: USER.USER_CHANGE_AVATAR.value,
      method: 'post',
      data
    })
  }
  changeUserStatus(id, status, loginName) {
    let logInfo = {
      description: `${status === 104405?'停用':'启用'}用户【${loginName}】`, 
      ...USER.USER_CHANGE_STATUS.logInfo[0]
    }
    return this.$httpRequest({
      url: USER.USER_CHANGE_STATUS.value,
      method: 'POST',
      data: {
        id,
        validState: status
      },
      logInfo,
    });
  }
  queryCenterInfo(id) {
    return this.$httpRequest({
      url: USER.CENTER_INFO.value,
      method: 'POST',
      data: {
        id
      }
    });
  }
  getUserZoomLevelCenter(){
    return this.$httpRequest({
      url:USER.USER_ZOOM_LEVEL_CENTER.value,
      method: 'GET',
    })
  }

  countAlarmCountByUserIds(data){
    return this.$httpRequest({
      url:USER.USER_ALARM_NUM.value,
      data:data,
      method: 'POST',
    })
  }

    /**根据url关键字获取合作单位logl和系统logo */
    getOptByLoginKeyUrl(data) {
      return this.$httpRequest({
        url:OPERATIONCENTER.BYLOGINKEYURL.value,
        data:data,
        method: 'POST',
      })
    }
}
export default new UserService();
