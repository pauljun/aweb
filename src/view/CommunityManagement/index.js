import React from 'react';
// import Selectcom from './HouseFile/components/Selectcom/Selectcom.js'
// import HouseFileSearch from './HouseFile/view/index'
import TabRoute from '../../components/TabRoute'

export default class CommunityManagement extends React.Component {
  render() {
    return <TabRoute moduleLevel={2} defaultModule="commmuityEntry" />;
  }
}
