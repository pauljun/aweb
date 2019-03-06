import React from 'react';
import OrgTreeWithCount from './components/OrgTreeWithCount';
import DeviceList from './components/DeviceList';
import DragContent from './components/DragContent';
import './index.scss';

export default class OrgTreeWithDevice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slideOrg: true,
      slideDevice: true,
      selectOrg: null
    };
  }
  changeSlideOrg() {
    const { slideOrg } = this.state;
    this.setState({ slideOrg: !slideOrg });
  }
  changeSlideDevice() {
    const { slideDevice } = this.state;
    this.setState({ slideDevice: !slideDevice });
  }
  onSelectOrg(item) {
    const { selectOrg } = this.state;
    let id = null;
    if (selectOrg !== item[0]) {
      id = item[0];
    }
    this.setState({ selectOrg: id });
    this.props.changeOrg && this.props.changeOrg(id);
  }
  render() {
    const { slideOrg, slideDevice, selectOrg } = this.state;
    const {
      deviceList,
      orgList,
      className,
      isMapMode,
      showLoopSettingLayout,
      isLoop,
      loopOrgInfo,
      collectionList,
      keyword
    } = this.props;
    return (
      <div
        className={`org-tree-with-device-layer ${className ? className : ''}`}
      >
        <OrgTreeWithCount
          activeKey={[selectOrg]}
          defaultExpandAll={false}
          onSelect={this.onSelectOrg.bind(this)}
          changeSlideOrg={this.changeSlideOrg.bind(this)}
          showLoopSettingLayout={showLoopSettingLayout}
          slideOrg={slideOrg}
          orgList={orgList}
          isLoop={isLoop}
          isMapMode={isMapMode}
          loopOrgInfo={loopOrgInfo}
        />
        <DragContent
          className={`${!slideOrg ? 'no-darg-height' : ''} ${
            !slideDevice ? 'hide-darg-height' : ''
          }`}
          disabled={!slideOrg || !slideDevice}
        >
          <DeviceList
            keyword={keyword}
            collectionList={collectionList}
            changeSlideDevice={this.changeSlideDevice.bind(this)}
            slideDevice={slideDevice}
            deviceList={deviceList}
          />
        </DragContent>
      </div>
    );
  }
}
