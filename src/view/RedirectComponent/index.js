import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import cookie from 'js-cookie';
import { computTreeList } from '../../utils';

@withRouter
@inject('TabStore', 'UserStore', 'MenuStore')
@observer
class RedirectComponent extends React.Component {
  componentWillMount() {
    let {
      moduleName,
      MenuStore,
      UserStore,
      TabStore,
      history,
      action = 'replace'
    } = this.props;
    if (UserStore.isLogin) {
      let module = MenuStore.getMenuForName(moduleName);
      if (module) {
        TabStore.goPage({ moduleName, history, action, isUpdate: true });
        MenuStore.setActiveMenu(moduleName);
      } else {
        let menuList = MenuStore.menuList;
        let treeList = computTreeList(menuList);
        let module = treeList[0];
        if (module) {
          let childModule;
          if (Array.isArray(module.children) && module.children.length > 0) {
            childModule = module.children.find(v => !v.isAction);
          }
          TabStore.goPage({
            moduleName: module.name,
            childModuleName: childModule ? childModule.name : null,
            history,
            action,
            isUpdate: true
          });
        } else {
          history.replace('/a/JurisdictionOverview');
        }
      }
    } else {
      let loginType = cookie.get('loginType') || '';
      if(loginType && loginType !== 'undefined') {
        history.replace(`/login/${loginType}`);
      } else {
        history.replace('/login');
      }
    }
  }
  render() {
    return null;
  }
}

export default RedirectComponent;
