import React from 'react';
import { Tree } from 'antd';
import IconFont from '../../../components/IconFont';
import InputSearch from 'src/components/SearchInput/indexOnChange.jsx';
import { stopPropagation } from '../../../utils';
import './index.scss';
/**
 *  组织机构选择组件，加入搜索组织高亮功能
 */
const TreeNode = Tree.TreeNode;

class OrgTreeWithCount extends React.Component {
  state = {
    expandedKeys: [this.props.orgList[0] ? this.props.orgList[0].id : ''],
    searchValue: '',
    autoExpandParent: true,
  }
  // 输入组织机构名称处理
  onChange = (value) => {
    const expandedKeys = this.props.orgListOld.map((item) => {
      if (item.title.indexOf(value) > -1) {
        return this.getParentKey(item.id, this.props.orgList);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  getParentKey = (id, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.id === id)) {
          parentKey = node.id;
        } else if (this.getParentKey(id, node.children)) {
          parentKey = this.getParentKey(id, node.children);
        }
      }
    }
    return parentKey;
  }
  renderTreeNodes = list => {
    const { searchValue } = this.state;
    const { isShowDeviceNum=true, hasSolidier } = this.props
    return (
      list &&
      list.map(node => {
        const index = node.name.indexOf(searchValue);
        const beforeStr = node.name.substr(0, index);
        const afterStr = node.name.substr(index + searchValue.length);
        const title = index > -1 ? (
        <span title={node.name}>
          <span>
            {beforeStr}
            <span style={{ color: '#ff8800' }}>{searchValue}</span>
            {afterStr}
          </span>
          {isShowDeviceNum && <span className="device-count">
            <i className="online-count">{hasSolidier ? node.deviceCount.onlineCount : node.cameraCount.onlineCount}/</i>
            <i className="count">{hasSolidier ? node.deviceCount.count : node.cameraCount.count}</i>
          </span>}
        </span>
      ) : <span>
        {node.title}
        {isShowDeviceNum && <span className="device-count">
          <i className="online-count">{hasSolidier ? node.deviceCount.onlineCount : node.cameraCount.onlineCount}/</i>
          <i className="count">{hasSolidier ? node.deviceCount.count : node.cameraCount.count}</i>
        </span>}
      </span>;
        return <TreeNode
          title={title}
          key={node.id}
          dataRef={node}
          icon={
            <IconFont className="tree-icon" type="icon-TreeIcon_Group_Main" />
          }
        >
          {node.children && this.renderTreeNodes(node.children)}
        </TreeNode>
      })
    );
  };

  render() {
    const {
      className = '',
      onSelect,
      activeKey,
      orgList,
    } = this.props;
    const { expandedKeys, autoExpandParent } = this.state;
    return (
      <div className={`tlzj-org-tree ${className}`}>
        <div className="title-part">
          组织机构
          <InputSearch
            placeholder={'请输入组织名称'}
            onChange={this.onChange} 
            className="search"
          />
        </div>
        <Tree
          showIcon
          selectedKeys={activeKey}
          onSelect={onSelect}
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        >
          {this.renderTreeNodes(orgList)}
        </Tree>
      </div>
    );
  }
}

export default OrgTreeWithCount;
