import React from 'react';
import TabRoute from '../../../components/TabRoute';
import { inject, observer } from 'mobx-react';
import './index.scss';

@inject('MenuStore')
@observer
export default class PlaceManagement extends React.Component {
  getMenuInfo() {
    const { MenuStore } = this.props;
    return MenuStore.getMenuForName(MenuStore.activeMenu); 
  }
  render() {
    return (
      <div className="place-management">
        <TabRoute
          moduleLevel={3}
          defaultModule={'PlaceManagementView'}
          menuInfo={this.getMenuInfo()}
        />
      </div>
    );
  }
}