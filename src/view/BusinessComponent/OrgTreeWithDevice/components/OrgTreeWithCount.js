import React from 'react';
import { Tree } from 'antd';
import IconFont from '../../../../components/IconFont';
import { stopPropagation } from '../../../../utils';
const TreeNode = Tree.TreeNode;

class OrgTreeWithCount extends React.Component {
  showLoopSettingLayout = (node, e) => {
    const { activeKey, showLoopSettingLayout, isLoop } = this.props;
    if (activeKey[0] === node.id || isLoop) {
      stopPropagation(e);
    }
    showLoopSettingLayout && showLoopSettingLayout(node);
  };
  renderTreeNodes = list => {
    const { isMapMode, loopOrgInfo = {} } = this.props;
    return (
      list &&
      list.map(node => (
        <TreeNode
          className={node.id === loopOrgInfo.id ? 'loop-org' : ''}
          title={
            <span title={node.name}>
              {node.name}
              <span className="device-count">
                <i className="online-count">{node.deviceCount.onlineCount}/</i>
                <i className="count">{node.deviceCount.count}</i>
                {!isMapMode && (
                  <span
                    className="video-lx"
                    title="视频轮巡"
                    onClick={e => this.showLoopSettingLayout(node, e)}
                  >
                    <IconFont type="icon-RoundPlay_Main" />
                  </span>
                )}
              </span>
            </span>
          }
          key={node.id}
          dataRef={node}
          icon={
            <IconFont className="tree-icon" type="icon-TreeIcon_Group_Main" />
          }
        >
          {node.children && this.renderTreeNodes(node.children)}
        </TreeNode>
      ))
    );
  };

  render() {
    const {
      className = '',
      onSelect,
      activeKey,
      orgList,
      slideOrg,
      changeSlideOrg,
      showSlideIcon = true,
      defaultExpandAll = true
    } = this.props;
    return (
      <div className={`org-tree-part ${className}`}>
        <div className="title-part" onClick={changeSlideOrg}>
          {showSlideIcon && (
            <IconFont type={slideOrg ? 'icon-Arrow_Small_Up_Main' : 'icon-Arrow_Small_Down_Mai'} />
          )}
          组织机构
        </div>
        <Tree
          className={!slideOrg ? 'hide-tree' : ''}
          showIcon
          defaultExpandAll={defaultExpandAll}
          selectedKeys={activeKey}
          defaultExpandedKeys={[orgList[0] ? orgList[0].id : '']}
          onSelect={onSelect}
        >
          {this.renderTreeNodes(orgList)}
        </Tree>
      </div>
    );
  }
}

export default OrgTreeWithCount;
