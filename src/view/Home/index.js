import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { LayoutView } from '../Layout';
import Socket from '../../libs/Socket';
import CatchPromise from '../../utils/CatchPromise';
import GetOrgAndDevice from '../../utils/GetOrgAndDevice';
import cookie from 'js-cookie';
import Loading from '../../components/Loading';

import './index.scss';
import 'src/assets/iconfont/iconfont.css';

@withRouter
@inject('TabStore', 'UserStore', 'MenuStore', 'UserGroupStore')
export class HomeComponent extends Component {
  constructor(props) {
    super(props);
    let { UserStore, history } = props;
    window.ReactHistory = history;
    if (!UserStore.isLogin) {
      let loginType = cookie.get('loginType') || '';
      if(loginType && loginType !== 'undefined') {
        history.replace(`/login/${loginType}`);
      } else {
        history.replace('/login');
      }
    }
    this.state = {
      isInitData: false
    };
    this.timer = null;
    this.startComputedSystemTime();
  }
  startComputedSystemTime() {
    let { UserStore } = this.props;
    UserStore.computedSystemTimeDef();
    this.timer = setInterval(() => {
      UserStore.computedSystemTimeDef();
    }, 60 * 1000);
  }
  componentWillMount() {
    let { UserStore, MenuStore, UserGroupStore } = this.props;
    let { isLogin } = UserStore;
    isLogin &&
      UserStore.queryUserInfo().then(res => {
        UserGroupStore.get();
        UserStore.queryLyToken();
        Promise.all([
          GetOrgAndDevice(),
          CatchPromise(UserStore.queryCenterInfo(res.userInfo.optCenterId)),
          CatchPromise(UserStore.getUserZoomLevelCenter())
        ]).then(() => {
          this.setState({ isInitData: true });
        });
        MenuStore.setAuthMenuList(res.module, res.privileges);
        MenuStore.getMenusByOperationCenterId(res.userInfo.optCenterId).then(
          () => {
            this.goDefaultPage();
          }
        );
        Socket.connect();
      });
  }

  goDefaultPage() {
    const { MenuStore, TabStore, history, isRedirect } = this.props;
    if (!isRedirect) {
      return false;
    }
    const moduleName = MenuStore.activeMenu;
    const moduleInfo = MenuStore.getMenuForName(moduleName);
    if (moduleInfo) {
      const topLevelModule = MenuStore.getTopLevelMenuForId(
        moduleInfo.parentId
      );
      TabStore.goPage({
        moduleName: topLevelModule ? topLevelModule.name : moduleName,
        childModuleName: topLevelModule ? moduleName : null,
        history,
        action: 'replace',
        isUpdate: true
      });
      MenuStore.setActiveMenu(moduleName);
    } else {
      let module = MenuStore.getMenuForName(MenuStore.menuList[0].name);
      if (module) {
        console.log('跳转默认', module);
        const topLevelModule = MenuStore.getTopLevelMenuForId(module.parentId);
        const childModuleInfo = MenuStore.getDefaultBottomLevelForId(module.id);
        const childModule =
          childModuleInfo && childModuleInfo.component ? childModuleInfo : null;
        TabStore.goPage({
          moduleName: topLevelModule ? topLevelModule.name : module.name,
          childModuleName: childModule
            ? childModule.name
            : topLevelModule
            ? module.name
            : null,
          history,
          action: 'replace',
          isUpdate: true
        });
      }
    }
  }

  componentWillUnmount() {
    Socket.disconnect();
    clearInterval(this.timer);
    this.timer = null;
  }

  render() {
    const { UserStore, history } = this.props;
    let { isLogin } = UserStore;
    if (!isLogin) {
      let loginType = cookie.get('loginType') || '';
      if(loginType && loginType !== 'undefined') {
        history.replace(`/login/${loginType}`);
      } else {
        history.replace('/login');
      }
    }
    if (!this.state.isInitData) {
      return <Loading />;
    }
    return <LayoutView />;
  }
}
