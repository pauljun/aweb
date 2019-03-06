import React from "react";
import { toJS } from "mobx";
import { observer, inject } from "mobx-react";
import { Icon, Tree } from "antd";
import * as _ from "lodash";
const TreeNode = Tree.TreeNode;

@inject("orgCameraModel")
@observer
export default class DeviceRoleTree extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    orgTreeList: {}
  };
  componentWillMount() {
    this.resetTreeData();
  }
  /**
   * @desc 获取组织机构树和增加视图需要的状态
   */
  resetTreeData() {
    const { orgCameraModel, role, tempRole } = this.props;
    let orgTreeList = {};
    let tempList = _.cloneDeep(orgCameraModel.orgArray);
    tempList.forEach(item => {
      item["state"] = 0;
      orgTreeList[item.id] = item;
      let state = 0;
      if (role.indexOf(item.id) > -1) {
        state = 2;
      }
      if (tempRole.indexOf(item.id) > -1) {
        state = 1;
      }
      orgTreeList[item.name + item.id] = {
        id: item.name + item.id,
        baseId: item.id,
        name: item.name + "(本部)",
        orgCode: item.orgCode,
        parentId: item.id,
        slide: true,
        state: state
      };
    });
    this.setState({
      orgTreeList
    });
  }

  /**
   * @desc 转换组织结构为子父级结构
   */
  formatTreeData(list, pid) {
    let result = [],
      temp;
    for (let i in list) {
      if (list[i].parentId === pid) {
        if (list[i].baseId) {
          result.unshift(list[i]);
        } else {
          result.push(list[i]);
        }

        temp = this.formatTreeData(list, list[i].id);
        if (temp.length > 0) {
          list[i].children = temp;
        }
      }
    }
    return result;
  }

  formatTreeDataStatus(arrList) {
    let tempFn = list => {
      list.forEach((item, index) => {
        if (Array.isArray(item.children) && item.children.length > 0) {
          let arr = item.children.map(v => v.state);
          if (arr.indexOf(0) === -1 && arr.indexOf(1) === -1) {
            item.state = 2;
          }
          if (arr.indexOf(0) === -1 && arr.indexOf(2) === -1) {
            item.state = 1;
          }
          item.children.forEach((item2, index2) => {
            if (Array.isArray(item2.children) && item2.children.length > 0) {
              tempFn(item2.children);
            }
          });
        }
      });
    };
    tempFn(arrList);
    return arrList;
  }

  changeState(item) {
    let { orgTreeList } = this.state;
    orgTreeList[item.id].state++;

    //TODO 修改当前节点的状态
    if (orgTreeList[item.id].state > 2) {
      orgTreeList[item.id].state = 0;
    }
    let keys = this.findOrgForParentOrgIDs(item.id);
    keys.map(key => {
      orgTreeList[key].state = orgTreeList[item.id].state;
    });
    let tempFn = item => {
      if (orgTreeList[item.parentId]) {
        let ids = this.findOrgForParentOrgIDs(item.parentId);

        //TODO 获取除开自身的所有本节点下的子节点的state集合
        let arr = ids
          .filter(id => id !== item.parentId)
          .map(id => orgTreeList[id].state);
        if (Array.isArray(arr) && arr.length > 0) {
          if (arr.indexOf(1) === -1 && arr.indexOf(0) === -1) {
            orgTreeList[item.parentId].state = 2;
          } else if (arr.indexOf(2) === -1 && arr.indexOf(0) === -1) {
            orgTreeList[item.parentId].state = 1;
          } else {
            orgTreeList[item.parentId].state = 0;
          }

          if (orgTreeList[orgTreeList[item.parentId].parentId]) {
            tempFn(orgTreeList[item.parentId]);
          }
        }
      }
    };
    tempFn(item);
    this.setState({ orgTreeList });
    this.props.changeStateDeviceRole(this.computedRoleData(orgTreeList));
  }

  computedRoleData(orgTreeList) {
    let { orgCameraModel } = this.props;
    let device = {
      deviceRole: [],
      tempDeviceRole: []
    };
    let orgIds = [],
      tempOrgIds = [];
    for (let k in orgTreeList) {
      if (orgTreeList[k].state === 1) {
        tempOrgIds.push(
          orgTreeList[k].baseId ? orgTreeList[k].baseId : orgTreeList[k].id
        );
      }
      if (orgTreeList[k].state === 2) {
        orgIds.push(
          orgTreeList[k].baseId ? orgTreeList[k].baseId : orgTreeList[k].id
        );
      }
    }
    device.deviceRole = orgCameraModel.getCameraListByOrgIds(orgIds);
    device.tempDeviceRole = orgCameraModel.getCameraListByOrgIds(tempOrgIds);
    return device;
  }

  /**
   * @desc 计算子区域下子区域的ID集合
   * @param {string} ID
   * @returns {Array<string>}
   * @create hjj
   * @time 2017-10-24 18:24:51
   */
  findOrgForParentOrgIDs(ID) {
    let allOrgList = this.compileOrgLevel(this.state.orgTreeList, ID, []);
    return allOrgList.map(item => item.id);
  }

  /**
   * @desc 获取当前和当前子级的对象集合
   * @param {Object} arr
   * @param {string} id
   * @param {Array<string>} newArr
   * @returns {Array<string>}
   */
  compileOrgLevel(arr, id, newArr) {
    for (let key in arr) {
      if (arr[key].id === id) {
        newArr.push(arr[key]);
      }
      if (arr[key].parentId === id) {
        this.compileOrgLevel(arr, arr[key].id, newArr);
      }
    }
    return newArr;
  }

  renderOrgTree(list) {
    if (Array.isArray(list) && list.length > 0) {
      return list.map((item, index) => {
        return (
          <TreeNode
            key={item.id}
            title={
              <div className="item">
                <i
                  onClick={this.changeState.bind(this, item)}
                  className={`state state${item.state}`}
                />
                <span className="text">{item.name}</span>
              </div>
            }
          >
            {item.children && this.renderOrgTree(item.children)}
          </TreeNode>
        );
      });
    }
    return null;
  }

  render() {
    let list = [];
    for (let k in this.state.orgTreeList) {
      list.push(this.state.orgTreeList[k]);
    }
    let tempOrgTreeList = this.formatTreeData(list, 0);
    let orgTreeList = this.formatTreeDataStatus(tempOrgTreeList);
    return (
      <Tree className="roleTreeContent">
        {this.renderOrgTree(orgTreeList)}
      </Tree>
    );
  }
}
