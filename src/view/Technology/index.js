import React from 'react';
import TabRoute from '../../components/TabRoute';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { BusinessProvider } from '../../utils/Decorator/BusinessProvider';
import './style/index.scss';

@withRouter
@BusinessProvider('TechnologyStore', 'MenuStore', 'TabStore')
@observer
export default class Technology extends React.Component {
  constructor(props) {
    super(props);
    const { TechnologyStore, MenuStore,location } = this.props;
    console.log(location,'=========')
    TechnologyStore.setCurrentMenu(
      MenuStore.activeMenu === 'Technology'
        ? 'Test3level'
        : MenuStore.activeMenu
    );
  }
  handleClick = e => {
    const { history, TabStore } = this.props;
    this.setState({ current: e.key });
    TabStore.goPage({
      moduleName: 'Technology',
      childModuleName: e.key,
      history,
      isUpdate: true
    });
  };
  render() {
    const { MenuStore, TechnologyStore } = this.props;
    const { children } = MenuStore.getMenuForName('Technology');
    return (
      <div className="technology">
        <Menu
          onClick={this.handleClick}
          selectedKeys={[TechnologyStore.currentMenu]}
          mode="horizontal"
        >
          {Array.isArray(children) &&
            children.map(item => (
              <Menu.Item key={item.name}>
                <Icon type="appstore" />
                {item.title}
              </Menu.Item>
            ))}
        </Menu>
        <TabRoute moduleLevel={2} defaultModule={'Test3level'} />
      </div>
    );
  }
}
