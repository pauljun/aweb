import { observable, autorun, action } from 'mobx';
import { getCacheItem, setCacheItem } from '../../utils';
import UserService from '../../service/UserService';
import DeviceService from '../../service/DeviceService';
import createHistory from 'history/createBrowserHistory';
import cookie from 'js-cookie';

window.timeDifference = 0;

export default class UserStore {
  constructor() {
    autorun(() => {
      let userInfo = getCacheItem('userInfo', 'local') || {};
      let isLogin = getCacheItem('isLogin', 'session') || false;
      let theme = getCacheItem('theme', 'local') || 'default-theme';
      this.setTheme(theme);
      this.setUserInfo(userInfo);
      this.setLoginState(isLogin);
    });
  }
  @observable
  btnInfo = {}; // 按钮权限

  @observable
  isLogin = false;

  @observable
  userInfo = {};

  @observable
  theme = getCacheItem('theme', 'local') || 'default-theme';

  @observable
  lyToken = null;

  @observable
  userList = [];

  @observable
  centerInfo = {};

  @observable
  systemConfig = {};

  // 布控一体机导入文件成功路径
  @observable
  filePath = '';

  // 获取系统实现的误差
  @observable timeDifference = 0;
  /**
   * 更新路径
   * @param {string} filePath
   */
  @action
  updateFilePath(filePath) {
    this.filePath = filePath;
  }

  /**
   * 
   * 更新羚羊云token
   * @param {string} token
   */
  @action
  updataLyToken(token) {
    this.lyToken = token;
  }

  /**
   * 更新用户信息
   * @param {Object} userInfo
   */
  @action
  setUserInfo(userInfo) {
    this.userInfo = userInfo;
  }

  /**
   * 修改皮肤
   * @param {string} name
   */
  @action
  setTheme(name) {
    setCacheItem('theme', name, 'local');
    this.theme = name;
  }

  @action
  setUserList(list) {
    this.userList = list;
  }
  @action
  setCenterInfo(info) {
    this.centerInfo = info;
  }
  @action
  setSystemConfig(info) {
    this.systemConfig = info;
  }
  /**
   * 登陆接口
   * @param {Object} options
   */
  loginAction(options) {
    return UserService.Login(options);
  }

  /**
   * 查询用户信息
   */
  queryUserInfo() {
    return UserService.queryUserInfo().then(res => {
      setCacheItem('userInfo', res.result.userInfo, 'local');
      this.setUserInfo(res.result.userInfo);
      return res.result;
    });
  }

  /**
   * 查询羚羊云的token
   */
  queryLyToken() {
    return DeviceService.queryLyToken().then(res => {
      if (res.result) {
        this.updataLyToken(res.result.token);
      }
    });
  }

  /**
   * 修改登陆状态
   * @param {Boolean} flag
   */
  @action
  setLoginState(flag) {
    this.isLogin = flag;
    setCacheItem('isLogin', flag, 'session');
  }

  /**
   * 新增用户
   * @param {Object} options
   */
  addUser(options) {
    return UserService.addUser(options).then(async () => {
      await this.queryUserList();
    });
  }

  userLogout() {
    return UserService.Logout().then(() => {
      this.setLoginState(false);
    });
  }

  /**
   * 更新用户
   * @param {Object} options
   */
  updateUser(options) {
    return UserService.updateUser(options).then(async () => {
      await this.queryUserList();
    });
  }

  /**发送手机有验证码 */
  sendLoginIdentifyCode(phoneNum) {
    return UserService.sendCode(phoneNum);
  }

  /**修改用户头像 */
  editUserLogp(options) {
    return UserService.updateUserLogo(options);
  }

  /**
   * 删除用户
   * @param {Object} options
   */
  deleteUser(options) {
    return UserService.deleteUser(options).then(async () => {
      await this.queryUserList();
    });
  }

  getUserList(params) {
    return UserService.queryUserList(params);
  }

  /**
   * 修改密码
   * @param {Object} params
   */
  changePassword(params) {
    return UserService.changePassword(params);
  }

  /**
   * 获取系统服务器时间
   */
  getSystemTime() {
    return Promise.resolve(Date.now().valueOf() - this.timeDifference)
  }
  /**
   * 获取系统服务器时间
   */
  querySystemTime() {
    return UserService.getSystemTime();
  }

  queryCenterInfo(id) {
    return UserService.queryCenterInfo(id).then(res => {
      this.setCenterInfo(res.result);
    });
  }

  getUserZoomLevelCenter() {
    return UserService.getUserZoomLevelCenter().then(res => {
      document.title = res.result.systemName || '智慧云眼';
      this.setSystemConfig(res.result);
    });
  }
  countAlarmCountByUserIds(data) {
    return UserService.countAlarmCountByUserIds(data);
  }
  /**
   * 根据权限查询当前组织权限下的所有用户
   */
  queryUserByPrivilegeIdAndOrgIds(params) {
    return UserService.queryUserByPrivilegeIdAndOrgIds(params);
  }

  // 获取登录验证码
  getLoginCode(data) {
    return UserService.getLoginCode(data);
  }

  /**根据url关键字获取合作单位logl和系统logo */
  getOptByLoginKeyUrl(data) {
    return UserService.getOptByLoginKeyUrl(data);
  }

  @action
  logout() {
    this.setLoginState(false);
    cookie.remove('token');
    window.sessionStorage.clear();
    let loginType = cookie.get('loginType') || '';
    // window.GlobalStore.TabStore.tabList = [];
    if(loginType && loginType !== 'undefined') {
      window.location.replace(`/login/${loginType}`);
    } else {
      window.location.replace('/login');
    }
  }
  @action
  setSystemTimeDef(num) {
    if (this.timeDifference === 0 || num < this.timeDifference * 2) {
      window.timeDifference = this.timeDifference = num;
    }
  }

  systemDef() {
    let time = Date.now().valueOf();
    return this.querySystemTime().then(res => {
      let def = Date.now().valueOf() - time;
      return Date.now().valueOf() - res + def;
    });
  }
  computedSystemTimeDef() {
    let arr = [];
    for (let i = 0; i < 2; i++) {
      arr.push(this.systemDef());
    }
   
    return Promise.all(arr).then(res => {
      
      let num = res.reduce((c, n) => c + n);
      this.setSystemTimeDef(Math.round(num / 2));
    });
  }
}
