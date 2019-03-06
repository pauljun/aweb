import React from 'react';
import { Tree } from 'antd';
import IconFont from '../IconFont';
import './index.scss'
const TreeNode = Tree.TreeNode;

class TreeView extends React.Component {
  renderTreeNodes = (treeData, treeLabelKey, treeKey, icon) => {
    return treeData.map(node => (
      <TreeNode
        title={node[treeLabelKey]}
        key={node[treeKey]}
        dataRef={node}
        icon={<IconFont type={'icon-TreeIcon_Group_Main'} />}
      >
        {Array.isArray(node.children) &&
          this.renderTreeNodes(node.children, treeLabelKey, treeKey)}
      </TreeNode>
    ));
  };

  render() {
    const {
      className,
      treeData,
      treeLabelKey = 'name',
      treeKey = 'id',
      icon = 'icon-TreeIcon_Group_Main',
      showIcon = true,
      ...props
    } = this.props;
    return (
      <Tree className={`tree-view-component ${className?className:''}`} showIcon={showIcon} {...props}>
        {this.renderTreeNodes(treeData, treeLabelKey, treeKey, icon)}
      </Tree>
    );
  }
}

export default TreeView;
