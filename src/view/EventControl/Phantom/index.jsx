import React from 'react';
import { observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import TabRoute from '../../../components/TabRoute';
import MenuTab from '../../../components/menuTab/index'
import { BusinessProvider } from '../../../utils/Decorator/BusinessProvider';
import './index.scss'
@withRouter
@BusinessProvider('MenuStore')
@observer
export default class MoniteeFace extends React.Component {
  render() {
    const authMenuList = this.props.MenuStore.getChildMenusForId("100001010072") || [{}];
    return (
      <div className="monitee_phantom monitee-container-outer">
        <div className="monitee-header">
          <div className="monitee-title">魅影布防</div>
          <MenuTab 
            moduleName='EventControl'
            parentModule='Phantom'
            defaultModule={authMenuList[0].name}
            menuListNames={['PhantomAlarms', 'PhantomTasks']}
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
