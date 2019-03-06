import React from 'react';
import NoPage from '../NoPage';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withTab } from '../../utils/Decorator/WithTab';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

@withRouter
@inject('MenuStore', 'TabStore')
@withTab
export default class TabRoute extends React.Component {
  constructor(props) {
    super(props);
    const current = this.computedCurrentModule(props);
    this.state = {
      currentModule: current
    };
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.storeId === nextProps.TabStore.activeTab;
  }
  componentWillReceiveProps(nextProps) {
    const current = this.computedCurrentModule(nextProps);
    this.setState({ currentModule: current });
  }
  computedCurrentModule(props) {
    const { moduleLevel, defaultModule, location, MenuStore } = props;
    const pathSplit = location.pathname.split('/');
    const current = pathSplit[moduleLevel + 1];
    const childModule = MenuStore.getMenuForName(defaultModule);
    if (!current && childModule) {
      history.replace(`/${pathSplit[1]}/${childModule.url}`);
      return defaultModule;
    }
    return current;
  }
  render() {
    const {
      MenuStore,
      moduleLevel,
      defaultModule,
      location,
      ...props
    } = this.props;
    const { currentModule } = this.state;
    const menu = MenuStore.getMenuForName(currentModule);
    const Module = menu ? menu.component : NoPage;
    return <Module {...props} />;
  }
}
