import React from 'react';
import ResourceTopView from './components/ResourceTopView';
import ResourceSearch from './components/ResourceSearch';
import { observer } from 'mobx-react';
import './style/index.scss';

@observer
export default class ResourceTreeView extends React.Component {
  render() {
    const { deviceList, collectionList, orgList } = this.props;
    const count = deviceList.length;
    const onlineCount = deviceList.filter(v => v.deviceData * 1 === 1).length;
    return (
      <div className="resource-tree-layout">
        <ResourceTopView count={count} onlineCount={onlineCount} />
        <ResourceSearch
          deviceList={deviceList}
          collectionList={collectionList}
          orgList={orgList}
        />
      </div>
    );
  }
}
