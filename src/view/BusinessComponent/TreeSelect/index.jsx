import React from "react";
import { TreeSelect } from "antd";
import { inject, observer } from "mobx-react";
const TreeNode = TreeSelect.TreeNode;

@inject("OrgStore")
@observer
export default class TreeSelectOrg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || [],
    };
  }
  defaultExpandedKeys=[]
  onChange = value => {
    this.setState({ value });
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  };
  componentWillReceiveProps(nextProps) {
    if ("value" in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }
  setTreeData(orgArray) {
    let orgIdMap = {};
    orgArray.map(item => {
      orgIdMap[item.id] = item;
    });
    let arr = [];
    orgArray.forEach(item => {
      if (!orgIdMap[item.parentId]) {
        arr.push(item);
      }
    });
    arr.map(item => {
      item.childrens = this.formatTreeData(orgArray, item.id);
    });
    return arr;
  }
  formatTreeData(list, pid) {
    let result = [],
      temp;
    for (let i in list) {
      if (list[i].parentId === pid) {
        result.push(list[i]);
        temp = this.formatTreeData(list, list[i].id);
        if (temp.length > 0) {
          list[i].childrens = temp;
        }
      }
    }
    return result;
  }
  renderTreeNode(treeData) {
    return treeData.map(item => {
      return (
        <TreeNode value={item.id} title={item.name} key={item.id}>
          {Array.isArray(item.childrens) && item.childrens.length > 0
            ? this.renderTreeNode(item.childrens)
            : null}
        </TreeNode>
      );
    });
  }
  render() {
    let { orgArray } = this.props.OrgStore;
    let treeData = this.setTreeData(orgArray);
    const searchBox = this.props.showSearch
    return (
      <TreeSelect
        showSearch = { searchBox || true}
        style={{ width: this.props.width || '100%' }}
        value={this.state.value}
        dropdownStyle={{
          maxHeight: this.props.maxHeight || 400,
          overflow: "auto"
        }}
        dropdownMatchSelectWidth={true}
        placeholder="请选组织机构"
        allowClear
        treeNodeFilterProp="title"
        multiple={this.props.multiple || false}
        treeDefaultExpandAll
        treeDefaultExpandedKeys={[treeData[0] ? treeData[0].key : '']}
        onChange={this.onChange}
        {...this.props}>
        {this.renderTreeNode(treeData)}
      </TreeSelect>
    );
  }
}
