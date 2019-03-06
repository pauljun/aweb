import React from 'react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { toJS } from 'mobx';
import {Checkbox} from 'antd'
import { observer } from 'mobx-react';
import { Tree } from 'antd';
import IconFont from '../../../../components/IconFont'
import './index.scss';

const TreeNode = Tree.TreeNode;
@BusinessProvider('OrgStore')
@observer
class TreeComponent extends React.Component {
  state = {
    expandedKeys:[],
    treeKey: Math.random(),
    checkedValue:false
  }
  defaultExpandedKeys = []
  componentDidMount() {
    const { OrgStore, viewRef } = this.props;
    const orgList = OrgStore.orgAllList;
    this.setState({
      expandedKeys:[orgList[0].id]
    })
    viewRef && viewRef(this);
    if (OrgStore.orgAllList.length) {
      this.props.leafClk([OrgStore.orgAllList[0].id]);
    }
    this.props.OrgStore.orgList.map( v => {
      this.defaultExpandedKeys.push(v.id)
    })
  }
  onChange = (e) => {
    const { OrgStore} = this.props;
    const orgList = OrgStore.orgAllList;
    if (e.target.checked){
      this.setState({
        expandedKeys: this.defaultExpandedKeys,
        checkedValue:true
      })
    }else{
      this.setState({
        // expandedKeys:[orgList[0].id],
        expandedKeys:[],
        checkedValue:false
      })
    }
  }
  /* 展开收起节点操作 */
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
    });
  } 

  /**组织结构树渲染 */
  renderTreeNodes = list => {
    let type='icon-TreeIcon_Group_Main'
    return list.map(node => {
      if(node.parentId===0){
        type='icon-TreeIcon_index_Main'
      }
      if (node.children) {
        return (
          <TreeNode
            title={node.name}
            key={node.id}
            dataRef={node}
            icon={<IconFont type={type} />}
          >
            {this.renderTreeNodes(node.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          // title={node.name}
          title={node.name}
          key={node.id}
          dataRef={node}
          icon={<IconFont type={type} />}
        />
      );
    });
  };

  onSelect = (value) => {
    const { leafClk, allowClear=false} = this.props;
    if(allowClear){
      leafClk(value)
    } else {
      value.length && leafClk(value)
    }
  }
  render() {
    const orgList = this.props.OrgStore.orgAllList;
    const { activeKey, children } = this.props;
    const {expandedKeys,treeKey,checkedValue} = this.state;
    return (
      <div className="setting-tree-content">
        <Checkbox onChange={this.onChange} className="tree-checkall" checked={checkedValue}>展开全部</Checkbox>
        { children }
        <Tree
          className={`setting-org-tree`}
          showIcon
          key={treeKey}
          defaultExpandAll
          onSelect={this.onSelect}
          selectedKeys={toJS(activeKey)}
          onExpand={this.onExpand}
          // expandedKeys={expandedKeys.length === 0?[orgList[0].id]:expandedKeys}
          expandedKeys={expandedKeys}
        >
          {this.renderTreeNodes(orgList)}
        </Tree>
      </div>
    )
  }
}

export default TreeComponent;
