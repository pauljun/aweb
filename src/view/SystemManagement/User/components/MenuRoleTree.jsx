// import React from "react";
// import { observer, inject } from "mobx-react";
// import { userPrivilegeMap } from "../../../../store/project/common/common";
// import { Icon, Tree } from "antd";
// const TreeNode = Tree.TreeNode;
// @inject("roleModel")
// @observer
// export default class MenuRoleTree extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   componentWillMount() {
//     this.resetPrivilege(this.props.privilegeList, this.props.tempPrivilegeList);
//   }

//   state = {
//     userPrivilegeList: userPrivilegeMap
//   };

//   /**
//    * @desc 初始化勾选状态
//    * @param privilegeList
//    * @param tempPrivilegeList
//    */
//   resetPrivilege(privilegeList, tempPrivilegeList) {
//     let userPrivilegeList = this.state.userPrivilegeList;
//     userPrivilegeList.forEach(item => {
//       if (privilegeList.indexOf(item.module.key) > -1) {
//         item.module.state = 2;
//       } else if (tempPrivilegeList.indexOf(item.module.key) > -1) {
//         item.module.state = 1;
//       } else {
//         item.module.state = 0;
//       }
//       item.module.slide = false;
//       if (item.children && item.children.length > 0) {
//         item.children.forEach(item2 => {
//           //判断level_1
//           if (item2["level_1"] && item2["level_1"].length > 0) {
//             if (privilegeList.indexOf(item2["level_1"][0].key) > -1) {
//               item2["level_1"][0].state = 2;
//             } else if (
//               tempPrivilegeList.indexOf(item2["level_1"][0].key) > -1
//             ) {
//               item2["level_1"][0].state = 1;
//             } else {
//               item2["level_1"][0].state = 0;
//             }
//             item2["level_1"][0].slide = false;
//           }
//           //判断level_2
//           if (item2["level_2"] && item2["level_2"].length > 0) {
//             if (privilegeList.indexOf(item2["level_2"][0].key) > -1) {
//               item2["level_2"][0].state = 2;
//             } else if (
//               tempPrivilegeList.indexOf(item2["level_2"][0].key) > -1
//             ) {
//               item2["level_2"][0].state = 1;
//             } else {
//               item2["level_2"][0].state = 0;
//             }
//             item2["level_2"][0].slide = false;
//           }
//           //判断level_3
//           if (item2["level_3"] && item2["level_3"].length > 0) {
//             item2["level_3"].forEach(item3 => {
//               if (privilegeList.indexOf(item3.key) > -1) {
//                 item3.state = 2;
//               } else if (tempPrivilegeList.indexOf(item3.key) > -1) {
//                 item3.state = 1;
//               } else {
//                 item3.state = 0;
//               }
//             });
//           }
//         });
//       }
//     });
//     this.setState({ userPrivilegeList });
//     this.props.changeStateModuleRole(
//       this.computedModuleState(userPrivilegeList)
//     );
//   }


//   changeModelState(index) {
//     let userPrivilegeList = this.state.userPrivilegeList;
//     let moduleItem = userPrivilegeList[index];
//     moduleItem.module.state++;
//     if (moduleItem.module.state > 2) {
//       moduleItem.module.state = 0;
//     }
//     //设置下级所有状态
//     moduleItem.children.forEach((item, i) => {
//       item["level_1"][0] &&
//         (item["level_1"][0].state = moduleItem.module.state);
//       item["level_2"][0] &&
//         (item["level_2"][0].state = moduleItem.module.state);
//       item["level_3"].forEach(item3 => {
//         item3.state = moduleItem.module.state;
//       });
//     });
//     this.setState({ userPrivilegeList });
//     this.props.changeStateModuleRole(
//       this.computedModuleState(userPrivilegeList)
//     );
//   }

//   changeLevelOneState(mIndex, index) {
//     let userPrivilegeList = this.state.userPrivilegeList;
//     let moduleList = userPrivilegeList[mIndex];
//     let childItem = moduleList.children[index];
//     let tempStateArr = [];
//     childItem["level_1"][0] && childItem["level_1"][0].state++;
//     if (childItem["level_1"][0].state > 2) {
//       childItem["level_1"][0].state = 0;
//     }

//     //设置下级所有状态
//     childItem["level_2"][0] &&
//       (childItem["level_2"][0].state = childItem["level_1"][0].state);
//     childItem["level_3"].forEach(item3 => {
//       item3.state = childItem["level_1"][0].state;
//     });

//     //修改上级状态
//     moduleList.children.forEach(item => {
//       tempStateArr.push(item["level_1"][0].state);
//     });

//     moduleList.module.state = Math.max.apply(null, tempStateArr);
//     this.setState({ userPrivilegeList });
//     this.props.changeStateModuleRole(
//       this.computedModuleState(userPrivilegeList)
//     );
//   }

//   changeLevelTwoState(mIndex, index) {
//     let userPrivilegeList = this.state.userPrivilegeList;
//     let moduleList = userPrivilegeList[mIndex];
//     let tempStateArr = [];
//     let childItem = userPrivilegeList[mIndex].children[index];
//     childItem["level_2"][0] && childItem["level_2"][0].state++;
//     if (childItem["level_2"][0].state > 2) {
//       childItem["level_2"][0].state = 0;
//     }
//     //设置下级所有状态
//     childItem["level_3"].forEach(item3 => {
//       item3.state =
//         childItem["level_2"][0].state < item3.state
//           ? childItem["level_2"][0].state
//           : item3.state;
//     });

//     //修改上级状态
//     childItem["level_1"][0].state = childItem["level_2"][0].state;
//     moduleList.children.forEach(item => {
//       tempStateArr.push(item["level_1"][0].state);
//     });
//     moduleList.module.state = Math.max.apply(null, tempStateArr);
//     this.setState({ userPrivilegeList });
//     this.props.changeStateModuleRole(
//       this.computedModuleState(userPrivilegeList)
//     );
//   }

//   changeLevelThreeState(mIndex, index, index3) {
//     let userPrivilegeList = this.state.userPrivilegeList;
//     let moduleList = userPrivilegeList[mIndex];
//     let childItem = moduleList.children[index];
//     let tempStateArr = [];
//     childItem["level_3"][index3].state++;
//     if (childItem["level_3"][index3].state > 2) {
//       childItem["level_3"][index3].state = 0;
//     }
//     //修改上级状态
//     let leve3Temp = childItem["level_3"].map(v => v.state);
//     let stateLevel2 = Math.max.apply(null, leve3Temp);
//     childItem["level_2"][0].state =
//       childItem["level_2"][0].state > stateLevel2
//         ? childItem["level_2"][0].state
//         : stateLevel2;
//     childItem["level_1"][0].state = childItem["level_2"][0].state;
//     moduleList.children.forEach(item => {
//       tempStateArr.push(item["level_1"][0].state);
//     });
//     moduleList.module.state = Math.max.apply(null, tempStateArr);
//     this.setState({ userPrivilegeList });
//     this.props.changeStateModuleRole(
//       this.computedModuleState(userPrivilegeList)
//     );
//   }

//   computedModuleState(userPrivilegeList) {
//     let modules = {
//       moduleRole: [],
//       tempModuleRole: []
//     };
//     userPrivilegeList.map(x => {
//       x.module.state === 1 && modules.tempModuleRole.push(x.module.key);
//       x.module.state === 2 && modules.moduleRole.push(x.module.key);
//       x.children.map(y => {
//         const level1 = y.level_1[0];
//         const level2 = y.level_2[0];
//         const level3 = y.level_3;
//         level1.state === 1 && modules.tempModuleRole.push(level1.key);
//         level1.state === 2 && modules.moduleRole.push(level1.key);
//         level2.state === 1 && modules.tempModuleRole.push(level2.key);
//         level2.state === 2 && modules.moduleRole.push(level2.key);
//         level3.map(item3 => {
//           item3.state === 1 && modules.tempModuleRole.push(item3.key);
//           item3.state === 2 && modules.moduleRole.push(item3.key);
//         });
//       });
//     });
//     return modules;
//   }

//   renderModule(moduleList) {
//     return moduleList.map((item, index) => {
//       return (
//         <TreeNode
//           title={
//             <div>
//               <i
//                 onClick={this.changeModelState.bind(this, index)}
//                 className={`state state${item.module.state}`}
//               />
//               <span className="text">{item.module.text}</span>
//             </div>
//           }
//           key={item.module.key}
//         >
//           {this.renderLevelOne(item.children, index)}
//         </TreeNode>
//       );
//     });
//   }

//   renderLevelOne(levelModel, mIndex) {
//     return levelModel.map((item, index) => {
//       return (
//         <TreeNode
//           title={
//             <div>
//               <i
//                 onClick={this.changeLevelOneState.bind(this, mIndex, index)}
//                 className={`state state${item["level_1"][0].state}`}
//               />
//               <span className="text">{item["level_1"][0].text}</span>
//             </div>
//           }
//           key={item["level_1"][0].key}
//         >
//           {this.renderLevelTwo(item, index, mIndex)}
//         </TreeNode>
//       );
//     });
//   }

//   renderLevelTwo(item, index, mIndex) {
//     return (
//       <TreeNode
//         title={
//           <div>
//             <i
//               onClick={this.changeLevelTwoState.bind(this, mIndex, index)}
//               className={`state state${item["level_2"][0].state}`}
//             />
//             <span className="text">{item["level_2"][0].text}</span>
//           </div>
//         }
//         key={item["level_2"][0].key}
//       >
//         {this.renderLevelThree(item, index, mIndex)}
//       </TreeNode>
//     );
//   }

//   renderLevelThree(item, index, mIndex) {
//     return Array.isArray(item["level_3"]) && item["level_3"].length > 0
//       ? item["level_3"].map((item3, index3) => {
//           return (
//             <TreeNode
//               title={
//                 <div>
//                   <i
//                     onClick={this.changeLevelThreeState.bind(
//                       this,
//                       mIndex,
//                       index,
//                       index3
//                     )}
//                     className={`state state${item3.state}`}
//                   />
//                   <span className="text">{item3.text}</span>
//                 </div>
//               }
//               key={item3.key}
//             />
//           );
//         })
//       : null;
//   }

//   render() {
//     return (
//       <Tree className="roleTreeContent">
//         {this.renderModule(this.state.userPrivilegeList)}
//       </Tree>
//     );
//   }
// }
