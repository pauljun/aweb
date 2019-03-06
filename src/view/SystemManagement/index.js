import React from 'react';

import TabRoute from '../../components/TabRoute';
import { inject, observer } from 'mobx-react';
import {withRouter} from 'react-router-dom'
import './index.scss';

@withRouter
@inject('MenuStore')
@observer
export default class SystemManagement extends React.Component {
  getMenuInfo() {
    const { MenuStore } = this.props;
    return MenuStore.getMenuForName(MenuStore.activeMenu);
  }
  render() {
    return (
      <div className="setting-wrapper">
        <TabRoute
          moduleLevel={2}
          defaultModule={'OperationCenter'}
          menuInfo={this.getMenuInfo()}
        />
      </div>
    );
  }
}
