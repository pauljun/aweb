import React from 'react';
import { withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Layout, Spin, notification } from 'antd';
import TabContainer from './components/TabContainer';
import { MenuList } from './components/MenuList';
import { errorBoundary } from '../../utils/Decorator';
import { computTreeList } from '../../utils';
import RootHead from './components/Header';
import MediaLibrary from '../MediaLibrary';
import Image from '../../components/Image';
import Logo from '../../assets/img/logo.png';
import Socket from '../../libs/Socket';
import './index.scss';

const { Content, Sider, Header } = Layout;

@errorBoundary
@withRouter
@inject('MenuStore', 'TabStore', 'UserStore')
@observer
export class LayoutView extends React.Component {
  constructor(props) {
    super(props);
    const { location, MenuStore } = this.props;

    //TODO 根据路径设置第一次选择状态
    let pathSplit = location.pathname.split('/');
    let key = pathSplit[pathSplit.length - 1]
      ? pathSplit[pathSplit.length - 1]
      : pathSplit[pathSplit.length - 2];
    let currentModule = MenuStore.findModuleForOparate(key);

    currentModule && MenuStore.setActiveMenu(currentModule.name);

    this.state = {
      mediaLibVisible: false // 视图库显隐状态
    };
    // 监听一体机导入布控库
    Socket.on('importLib', this.handelImportLib);
  }

  // 显示、隐藏视图库
  showMediaLibrary = (mediaLibVisible = true) => {
    this.setState({
      mediaLibVisible
    });
  };
  menuClick({ keyPath, key, domEvent }) {
    const { TabStore, MenuStore, history } = this.props;
    let moduleName,
      childModuleName,
      parentKey = keyPath[keyPath.length - 1];
    if (key !== parentKey) {
      moduleName = parentKey;
      childModuleName = key;
    } else {
      moduleName = key;
    }
    if (domEvent.ctrlKey || domEvent.metaKey) {
      TabStore.goPage({ moduleName, history, childModuleName });
    } else {
      MenuStore.activeMenu !== key &&
        TabStore.goPage({
          moduleName,
          history,
          childModuleName,
          isUpdate: true
        });
    }
  }
  unlisten = null;
  componentWillMount() {
    const { history, MenuStore } = this.props;
    this.unlisten = history.listen(location => {
      let pathSplit = location.pathname.split('/');
      let key = pathSplit[pathSplit.length - 1];
      let currentModule = MenuStore.findModuleForOparate(key);
      currentModule && MenuStore.setActiveMenu(currentModule.name);
    });

    this.computedRenderModule(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.computedRenderModule(nextProps);
  }
  componentWillUnmount() {
    Socket.off('importLib', this.handelImportLib);
    this.unlisten();
  }
  computedRenderModule(props) {
    const { history, match, location, TabStore, MenuStore } = props;
    const { tabIndex, module } = match.params;
    const pathSplit = location.pathname.replace(`${match.url}`, '').split('/');
    const [, childModule, operate] = pathSplit;
    const level1Module = MenuStore.getMenuForName(module);
    const level2Module = MenuStore.getMenuForName(childModule);
    const levelOperate = MenuStore.getMenuForName(operate);
    console.info(
      '根据URL拆解模块：\n',
      `match       -> ${match.url}\n`,
      `location    -> ${location.pathname}\n`,
      `module      -> ${module}\n`,
      `childModule -> ${operate ? operate : childModule ? childModule : '无'}\n`
    );
    if (history.action === 'POP') {
      TabStore.setPopStoreData({
        tabIndex,
        history,
        module: level1Module,
        childModule: levelOperate ? levelOperate : level2Module
      });
    }
  }
  timer = null;
  slideCollapsed() {
    const { MenuStore } = this.props;
    clearTimeout(this.timer);
    MenuStore.setMenuCollapsed(false);
  }
  closeCollapsed() {
    const { MenuStore } = this.props;

    this.timer = setTimeout(() => {
      if (!MenuStore.collapsed) {
        MenuStore.setMenuCollapsed(true);
      }
    }, 300);
  }
  // 处理监听到布控导入后的事件
  handelImportLib = uploadLibsOver => {
    let filePath = this.props.UserStore.filePath;
    if (filePath !== uploadLibsOver.filePath) {
      return;
    }
    Socket.emit('LIbIMPORTUPDATE');
    //判断是否插入数据库成功
    let isSuccess = uploadLibsOver.tips.includes('成功');
    notification.config({
      getContainer: () => document.querySelector('#root'),
      duration: 5
    });
    const content = uploadLibsOver && <div>{uploadLibsOver.tips}</div>;
    const btn = (
      <div>
        <span
          style={{ cursor: 'pointer' }}
          className="ok"
          onClick={() => this.goLibPage()}
        >
          进入一体机布控库管理界面
        </span>
      </div>
    );
    notification[isSuccess ? 'success' : 'error']({
      className: 'behavitor-item',
      placement: 'buttomRight',
      message: '布控库导入',
      description: content,
      btn,
      key: 'uploadLibs'
      // onClose: this.close.bind(this, item)
    });
  };
  // 跳转页面
  goLibPage = () => {
    const { TabStore, history } = this.props;
    TabStore.goPage({
      history,
      moduleName: 'PersonnelControl',
      childModuleName: 'AIOLibsView',
      isUpdate: true
    });
  };
  render() {
    const { mediaLibVisible } = this.state;
    const { MenuStore, UserStore } = this.props;
    const { collapsed } = MenuStore;
    //const collapsed = false
    const menuList = computTreeList(toJS(MenuStore.menuList));
    const { systemConfig } = UserStore;
    const currentMenu = MenuStore.activeMenu;
    return (
      <Spin
        size="large"
        className="layout-spin-content"
        wrapperClassName="layout-spin-wrapper"
        tip={MenuStore.spinningTip}
        spinning={MenuStore.spinning}
      >
        <Layout className={`content-container ${UserStore.theme}`}>
          <Sider
            className={`left-menu ${collapsed ? 'left-menu-collapsed' : ''}`}
            collapsible
            collapsed={collapsed}
            trigger={null}
          >
            <div
              className="menu-content-layout"
              onMouseEnter={this.slideCollapsed.bind(this)}
              onMouseMove={this.slideCollapsed.bind(this)}
              onMouseLeave={this.closeCollapsed.bind(this)}
            >
              <div className="scroller-layout-menu">
                <MenuList
                  menuMode={collapsed}
                  currentMenu={currentMenu}
                  menuList={menuList}
                  menuClick={this.menuClick.bind(this)}
                />
              </div>
            </div>
          </Sider>
          <Content className="content-wrapper">
            <Header className="container-header">
              <div className="logo">
                <span className="logo-img">
                  <Image src={systemConfig.systemLogo || Logo} defaultSrc={Logo} />
                </span>
                <span className="logo-name">{systemConfig.systemName}</span>
              </div>
              <div className="user-Action">
                <RootHead showMediaLibrary={this.showMediaLibrary} />
              </div>
            </Header>
            <TabContainer />
            <MediaLibrary
              hideMediaLib={() => this.showMediaLibrary(false)}
              isVisible={mediaLibVisible}
            />
          </Content>
        </Layout>
      </Spin>
    );
  }
}
