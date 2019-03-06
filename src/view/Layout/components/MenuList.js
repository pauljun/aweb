import React from 'react';
import { Menu, Icon } from 'antd';
import IconFont from '../../../components/IconFont';
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

export class MenuList extends React.Component {
  state = {
    openKeys: []
  };
  onOpenChange = openKeys => {
    this.setState({ openKeys });
  };
  render() {
    let { currentMenu, menuList, menuClick } = this.props;
    return (
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[currentMenu]}
        //openKeys={this.state.openKeys}
        // onOpenChange={this.onOpenChange}
        onClick={menuInfo => menuClick(menuInfo)}
        forceSubMenuRender={false}
      >
        {menuList.map(menu => {
          if (Array.isArray(menu.children) && menu.children.length > 0) {
            return (
              <SubMenu
                key={menu.name}
                title={
                  <span className="menu-item-content">
                    <span className="menu-item-layout">
                      <IconFont
                        type={menu.icon}
                        theme="outlined"
                        style={{ fontSize: 24, lineHeight: '20px' }}
                      />
                      <span>{menu.title}</span>
                    </span>
                  </span>
                }
              >
                {menu.children.map(subMunu => {
                  return (
                    <MenuItem key={subMunu.name}>
                      <span className="menu-item-content">
                        <span className="menu-item-layout">
                          <span>{subMunu.title}</span>
                        </span>
                      </span>
                    </MenuItem>
                  );
                })}
              </SubMenu>
            );
          } else {
            return (
              <MenuItem key={menu.name}>
                <span className="menu-item-content">
                  <span className="menu-item-layout">
                    <IconFont
                      type={menu.icon}
                      theme="outlined"
                      style={{ fontSize: 24, lineHeight: '20px' }}
                    />
                    <span>{menu.title}</span>
                  </span>
                </span>
              </MenuItem>
            );
          }
        })}
      </Menu>
    );
  }
}
