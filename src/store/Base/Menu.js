import { observable, action, computed, autorun, toJS } from 'mobx';
import RouterList from '../../router';
import { setCacheItem, getCacheItem } from '../../utils';
import { cloneDeep } from 'lodash';
import RoleService from '../../service/RoleService';

export default class MenuStore {
  constructor() {
    autorun(() => {
      if (process.env.NODE_ENV !== 'production') {
        const authMenuList = getCacheItem('authMenuList') || [];
        const privileges = getCacheItem('privileges') || [];
        const centerMenuList = getCacheItem('centerMenuList') || [];
        this.setAuthMenuList(authMenuList, privileges);
        this.setCenterMenuList(centerMenuList);
      }
    });
  }

  @observable
  authMenuList = []; //当前用户模块权限列表

  @observable
  privileges = []; //当前用户操作权限列表

  @observable
  centerMenuList = [];

  @observable
  activeMenu = 'JurisdictionOverview'; //默认选中的路由名称

  @observable
  collapsed = true;

  @observable
  spinning = false; // 全局spinning

  @observable
  spinningTip = ''; // 全局spinning提示信息

  @action
  setSpinning(spinning = true, spinningTip = '') {
    this.spinning = spinning;
    this.spinningTip = spinningTip;
  }
  /**
   * 根据有权限的列表生成权限路由列表
   */
  @computed
  get authRouterList() {
    let authList = toJS(this.authMenuList);
    let privileges = toJS(this.privileges);
    let tempList = [];
    RouterList.forEach(router => {
      let arrMenu = authList.filter(v => v && v.id * 1 === router.id * 1);
      let arrBtn = privileges.filter(v => v && v.id * 1 === router.id * 1);
      if (arrMenu.length > 0 || arrBtn.length > 0 || router.isLocal) {
        // arrMenu.length > 0 && (router.title = arrMenu[0].menuName);
        // arrBtn.length > 0 && (router.title = arrBtn[0].privilegeName);
        tempList.push(router);
      }
    });
    if(window.webConfig.wifiDevice == "0") {
      // 判断全局wifi显示设置
      const wifiMenuIndex = tempList.findIndex(v => v.id == "100001010086");
      if(wifiMenuIndex !== -1) {
        tempList.splice(wifiMenuIndex, 1);
      }
    }
    return tempList;
  }

  getChildMenusForId(id) {
    const children = this.authRouterList.filter(v => v.parentId * 1 === id * 1);
    return children;
  }

  /**
   * 根据name获取路由对象和子路由
   * @param {string} name
   */
  getMenuForName(name) {
    let item = this.authRouterList.filter(v => v.name === name)[0];
    if (item) {
      let newItem = cloneDeep(toJS(item));
      newItem.children = this.getChildMenusForId(newItem.id);
      return newItem;
    } else {
      return item;
    }
  }

  /**
   * 根据name获取整个路由的字段
   * @param {string} name
   */
  getMenuNotAuthByName(name) {
    return RouterList.filter(item => item.name === name)[0]
  }

  /**
   * 获取当前ID的顶级菜单
   * @param {string} id
   */
  getTopLevelMenuForId(id) {
    let menu = this.getMenuForId(id);
    if (!menu) {
      return null;
    }
    if (menu.parentId) {
      return this.getParentMenuForId(menu.parentId);
    }
    return menu;
  }

  /**
   * 获取默认跳转的action
   * @param {string} id
   */
  getDefaultBottomLevelForId(id) {
    let menu = this.getMenuForId(id);
    if (!menu) {
      return null;
    }
    let childrens = this.getChildMenusForId(id);
    if (childrens.length === 0) {
      return menu;
    } else {
      let menuActions = childrens.filter(v => v.url && !!v.component);
      if (menuActions.length !== 0) {
        return this.getDefaultBottomLevelForId(menuActions[0].id);
      } else {
        return menu;
      }
    }
  }

  /**
   * 根据ID获取路由对象
   * @param {string} id
   * create by Huangjingjing
   */
  getMenuForId(id) {
    return this.authRouterList.filter(v => v.id === id)[0];
  }
  /**
   * 根据url地址获取路由对象
   * @param {string} url
   */
  getMenuForUrl(url) {
    return this.authRouterList.filter(v => v.url === url)[0];
  }

  /**
   * 获取按钮权限
   * @param {string} actionName
   */
  getAuthAction(actionName) {
    return this.authRouterList.filter(v => v.name === actionName)[0];
  }

  /**
   * 根据操作权限找到对应的模块
   */
  findModuleForOparate(actionName) {
    let action = this.getAuthAction(actionName);
    if (!action) {
      return action;
    }
    if (!action.isAction) {
      return action;
    }
    let parentItem = this.getMenuForId(action.parentId);
    if (!parentItem) {
      return action;
    }
    if (parentItem.isAction) {
      return this.findModuleForOparate(parentItem.name);
    } else {
      return parentItem;
    }
  }

  /**
   * 修改当前选中的路由
   * @param {string} name
   */
  @action
  setActiveMenu(name) {
    let module = this.getMenuForName(name);
    if (!!module) {
      this.activeMenu = name;
      setCacheItem('activeMenu', name, 'local');
    }
  }

  @action
  setMenuCollapsed(flag) {
    this.collapsed = !!flag;
  }

  /**
   * 计算当前路由几何的树结构,过滤操作权限
   */
  @computed
  get menuList() {
    let arr = [];
    for (let i = 0, l = this.authRouterList.length; i < l; i++) {
      let item = this.authRouterList[i];
      let menu = this.centerMenuList.find(v => v.id * 1 === item.id * 1);
      if ((menu || item.isLocal) && !item.isAction) {
        arr.push({
          id: item.id,
          parentId: item.parentId,
          icon: item.icon,
          name: item.name,
          url: item.url,
          storeName: item.storeName,
          title: menu ? menu.menuName : item.title
        });
      }
    }
    return arr;
  }

  /**
   * 设置权限列表
   * @param {Array} menuList
   */
  @action
  setAuthMenuList(menuList, privileges) {
    this.authMenuList = menuList;
    this.privileges = privileges;
    if (process.env.NODE_ENV !== 'production') {
      setCacheItem('authMenuList', menuList);
      setCacheItem('privileges', privileges);
    }
  }
  @action
  setCenterMenuList(list) {
    this.centerMenuList = list;
    if (process.env.NODE_ENV !== 'production') {
      setCacheItem('centerMenuList', list);
    }
  }

  getMenusByOperationCenterId(id) {
    return RoleService.getMenusByOperationCenterId(id).then(res => {
      this.setCenterMenuList(res.result);
    });
  }
}
