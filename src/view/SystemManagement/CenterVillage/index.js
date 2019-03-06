import React from 'react';
import TabRoute from '../../../components/TabRoute';
import './index.scss'

export default class CenterVillageView extends React.Component {
  render() {
    return (
        <TabRoute
          moduleLevel={3}
          defaultModule={'CenterVillageList'}
          {...this.props}
        />
    );
  }
}
