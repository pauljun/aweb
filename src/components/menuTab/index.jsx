import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Menu, Icon } from 'antd';
import IconFont from 'src/components/IconFont';
import { BusinessProvider } from '../../utils/Decorator/BusinessProvider'
import './index.scss'
/**
 * moduleName // 一级菜单名称
 * parentModule // 当前路由模块
 * defaultModule // 默认选中菜单项
 */
@withRouter
@BusinessProvider('TabStore', 'MenuStore')
@observer
export default class MuneTab extends Component {
  constructor(props) {
    super(props)
    const { parentModule, menuListNames, MenuStore, defaultModule, index = 4, iconType } = this.props
    const { children } = MenuStore.getMenuForName(parentModule);
    const list = children.filter(item => menuListNames.indexOf(item.name) > -1)
    let defaultName = null;
    let module = window.location.pathname.split('/')[index]
    if(list[0]){
      if (list.findIndex(v => v.name === defaultModule) > -1) {
        defaultName = module ? module : defaultModule;
      } else {
        defaultName = list[0].name;
      }
    }
    this.state = {
      list,
      currentMenu: defaultName,
    }

  }
  // 菜单点击事件
  handleClick = e => {
    const { history, TabStore, moduleName } = this.props;
    this.setState({ currentMenu: e.key });
    TabStore.goPage({
      moduleName,
      childModuleName: e.key,
      history,
      isUpdate: true
    });
  }
  render() {
    const { list, currentMenu, icon = false } = this.state
    if(list.length === 0){
      return null
    }
    return (
      <Menu
        onClick={this.handleClick}
        mode="horizontal"
        selectedKeys={[currentMenu]}
        className="menu-tab-style"
      >
        {Array.isArray(list) && list.map((item, index) => (
          <Menu.Item key={item.name}>
            {/* {icon && <Icon type={item.icon} />} */}
            {item.icon && <IconFont type={item.icon} theme="outlined" />}
            {item.title}
          </Menu.Item>
        ))}
      </Menu>
    )
  }
} 