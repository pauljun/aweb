import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import MenuTab from '../../../components/menuTab/index'
import TabRoute from '../../../components/TabRoute';
import { BusinessProvider } from '../../../utils/Decorator/BusinessProvider';
import './index.scss'
@withRouter
@BusinessProvider('MenuStore')
@observer
export default class MoniteeFace extends React.Component {
  render() {
    const authMenuList = this.props.MenuStore.getChildMenusForId("100001010070") || [{}];
    return (
      <div className="monitee-outsiders monitee-container-outer">
        <div className="monitee-header">
          <div className="monitee-title">外来人员布控</div>
          <MenuTab 
            moduleName='PersonnelControl'
            parentModule='MoniteeOutsiders'
            defaultModule={authMenuList[0].name}
            menuListNames={['outsidersAlarm', 'outsidersTasks', 'outsidersBlackLib']}
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
