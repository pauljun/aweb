import React from 'react';
import { observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import TabRoute from '../../../components/TabRoute';
import MenuTab from '../../../components/menuTab/index'
import { BusinessProvider } from '../../../utils/Decorator/BusinessProvider';
@withRouter
@BusinessProvider('MenuStore')
@observer
export default class MoniteeFace extends React.Component {
  render() {
    const authMenuList = this.props.MenuStore.getChildMenusForId("100001010071") || [{}];
    return (
      <div className="monitee-aio monitee-container-outer">
        <div className="monitee-header">
          <div className="monitee-title">专网套件布控</div>
          <MenuTab
            moduleName='PersonnelControl'
            parentModule='MoniteeAIO'
            defaultModule={authMenuList[0].name}
            menuListNames={['AIOAlarms', 'AIOTasks', 'AIOLibs']}
            key={Math.random()}
          />
        </div>
        <div className="monitee-content">
          <TabRoute moduleLevel={3} defaultModule={authMenuList[0].name} />
        </div>
      </div>
    );
  }
}
