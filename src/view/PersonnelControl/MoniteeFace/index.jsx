import React from 'react';
import { observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import TabRoute from '../../../components/TabRoute';
import MenuTab from '../../../components/menuTab/index';
import { BusinessProvider } from '../../../utils/Decorator/BusinessProvider';
import './index.scss'
@withRouter
@BusinessProvider('MenuStore')
@observer
export default class MoniteeFace extends React.Component {
  render() {
    const authMenuList = this.props.MenuStore.getChildMenusForId("100001010069") || [{}];
    return (
      <div className="monitee-face monitee-container-outer">
        <div className="monitee-header">
          <div className="monitee-title">重点人员布控</div>
          <MenuTab 
            moduleName='PersonnelControl'
            parentModule='MoniteeFace'
            defaultModule={authMenuList[0].name}
            menuListNames={['faceAlarm', 'faceTasks', 'faceBlackLib']}
            key={Math.random()}
          />
        </div>
        <div className="monitee-content">
           {/* <TabRoute moduleLevel={3} defaultModule={'faceAlarm'} />  */}
           <TabRoute moduleLevel={3} defaultModule={authMenuList[0].name}/> 
        </div>
      </div>
    );
  }
}
