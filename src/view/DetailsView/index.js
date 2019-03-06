import React from 'react';
import TabRoute from '../../components/TabRoute';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from '../../utils/Decorator/BusinessProvider';
import './index.scss'

@withRouter
@BusinessProvider('TabStore')
@observer
export default class PersonnelControl extends React.Component {
  render() {
    return (
      <div className="detail_view">
        <TabRoute moduleLevel={2} defaultModule={'faceAlarm'} />
      </div>
    );
  }
}
