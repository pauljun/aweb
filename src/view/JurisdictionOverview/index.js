import React from 'react'
import TabRoute from '../../components/TabRoute'
import {observer} from 'mobx-react'
import './style/index.scss'

@observer
export default class JurisdictionOverview extends React.Component {
  render() {
    return (
      <div className="JurisdictionOverview">
        <TabRoute moduleLevel={2} defaultModule={'Panel'} />
      </div>
    );
  }
}
