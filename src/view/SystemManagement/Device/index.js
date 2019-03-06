import React from 'react';
import TabRoute from '../../../components/TabRoute';
export default class DeviceView extends React.Component {
  render() {
    return (
      <TabRoute
        moduleLevel={3}
        defaultModule={'DeviceView'}
        menuInfo={this.props.menuInfo}
      />
    );
  }
}
