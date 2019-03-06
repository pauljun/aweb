import React from 'react';
import TabRoute from '../../../components/TabRoute';

export default class Test3level extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div>Test3level</div>
        <TabRoute moduleLevel={3} defaultModule="Test3levelChild" />
      </React.Fragment>
    );
  }
}
