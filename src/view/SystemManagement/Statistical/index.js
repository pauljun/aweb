import React from 'react'
import TabRoute from '../../../components/TabRoute';
import { inject, observer } from 'mobx-react';
import './index.scss';


@inject('MenuStore')
@observer
export default class Statistical extends React.Component{
  getMenuInfo() {
    const { MenuStore } = this.props;
    return MenuStore.getMenuForName(MenuStore.activeMenu);
  }
  render(){
    return (
      <div className="setting-wrapper">
        <TabRoute
          moduleLevel={3}
          defaultModule={'StatisticView'}
          {...this.props}
          menuInfo={this.getMenuInfo()}
        />
      </div>
    )
  }
}