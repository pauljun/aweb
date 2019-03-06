/* 
  组件：从组织树选择有权限的用户
  参数：
  className: 添加的类名
  defaultSelectList： 默认选中用户id集合（[string,string]）
  onChange: 选中列表改变事件
  andOr: 调用接口得用户权限  1(默认) 且 2 或
  privilegeName： 权限名称 默认空[]---不受权限限制
*/
import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { toJS } from 'mobx';
import * as _ from 'lodash';
import { computTreeList } from 'src/utils';
import InputSearch from 'src/components/SearchInput/indexOnChange.jsx';
import OrgSelectTreeComponent from '../SelectOrgTree/index.js'
import DeviceList from '../DeviceList/index'
import './index.scss';
@inject('OrgStore', 'UserStore', 'MenuStore')
export default class OrgSelectUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyWord: '', // 搜索关键字
      selectOrgId: null, // 选中组织的id
      selectUserList: [], // 已选设备集合
      keyRandom: Math.random() // 强制大列表刷新
    };
  }

  // 选中列表改变事件
  handleChange = (selectUserList, update = true) => {
    this.setState({
      selectUserList
    });
    // 根据详情取到对应的id
    let userId = [];
    selectUserList.forEach(item => {
      userId.push(item.id)
    })
    const { onChange } = this.props;
    update && onChange && onChange(userId);
  };

  // 清空已选设备
  clearSelect = () => {
    this.handleChange([]);
  };

  // 列表全选事件
  handleCheckAllChange = (checked, orgDeviceList) => {
    const { selectUserList } = this.state;
    let selectList = [];
    if (checked) {
      selectList = _.uniqBy([].concat(selectUserList, orgDeviceList), 'id');
    } else {
      selectList = _.differenceBy(selectUserList, orgDeviceList, 'id');
    }
    this.handleChange(selectList);
  };

  // 单个选中改变事件
  handleCheckItemChange = (checked, item) => {
    let { selectUserList } = this.state;
    if (checked) {
      selectUserList.push(item);
      // 数组求交集
      selectUserList = _.intersectionBy(
        JSON.parse(JSON.stringify(this.userList)),
        selectUserList,
        'id'
      );
      this.handleChange(selectUserList);
    } else {
      this.deleteDeviceItem(item);
    }
  };

  // 删除单个已选设备
  deleteDeviceItem = item => {
    let { selectUserList } = this.state;
    selectUserList = selectUserList.filter(v => v.id !== item.id);
    this.handleChange(selectUserList);
  };

  // 组织树选中事件
  handleSelectOrg = item => {
    const { selectOrgId, keyWord } = this.state;
    const newOrgId = item[0] ? item[0] : selectOrgId;
    if (newOrgId !== selectOrgId) {
      this.setState({
        selectOrgId: newOrgId,
        keyRandom: Math.random()
      });
    }
  };

  // 设备依据输入文本和组织id进行查询
  queryDevice = (keyWord, org) => {
    keyWord = _.trim(keyWord);
    let arr = this.userList || []; // 所有有权限用户集合
    if (!keyWord && !org) {
      return arr;
    }
    if (!!org) {
      let orgIds = window.GlobalStore.OrgStore.queryOrgIdsForParentOrgId(org);
      arr = arr.filter(item => orgIds.indexOf(item.organizationId) > -1 );
    }
    !!keyWord
      ? (arr = arr.filter(
          item => item.realName && item.realName.indexOf(keyWord) > -1
        ))
      : null;
    return arr;
  };

  componentWillMount() {
    // 请求接口，拿到有权限的用户列表
    const { andOr = 1, privilegeName = [], UserStore, MenuStore, OrgStore, defaultSelectUser=[]} = this.props;
    // 组织处理
    const orgList = OrgStore.orgArray;
    this.listOrg = computTreeList(_.cloneDeep(toJS(orgList))) || [{}];
    const selectOrgId = this.listOrg[0].id;
    this.setState({
      selectOrgId
    });
    // 权限处理
    let privilegeIds = []
    if(privilegeName.length > 0){
      for(let i = 0; i < privilegeName.length; i++){
        privilegeIds.push(+MenuStore.getMenuNotAuthByName(privilegeName[i]).id);
      }
    }
    // 请求接口，拿到有权限的用户列表
    UserStore.queryUserByPrivilegeIdAndOrgIds({
      privilegeIds,
      andOr
    }).then(res => {
      // res为有权限的所有用户-----根据单一数组id筛选对应的详情
      this.userList = res.userInfo || []
      this.forceUpdate();
      let userSelectDetail = res.userInfo.filter(item => {
        if(~defaultSelectUser.indexOf(item.id)){
          return true
        }
      })
      if (userSelectDetail && userSelectDetail.length) {
        this.handleChange(_.cloneDeep(userSelectDetail));
      }
    },(err) => {
      //console.log(err,'err')
    })
  }

  // 输入框文本改变
  changeKeyWord = (val) => {
    this.setState({
      keyWord: val,
      keyRandom: Math.random()
    })
  }

  render() {
    const {
      className = '',
      footer = true,
      disabled,
      defaultExpandAll,
    } = this.props;
    const { selectOrgId, selectUserList, keyWord, keyRandom } = this.state;
    let orgUserList = this.queryDevice(keyWord, selectOrgId) || [];
    return (
      <div className={`org-select-user-wrapper ${className}`}>
         <InputSearch
          className="device-search-wrapper"
          placeholder="请输入你要搜索的人员"
          onChange={this.changeKeyWord}
        />
        <OrgSelectTreeComponent 
          className="org-select-wrapper"
          activeKey={[selectOrgId]}
          onSelect={this.handleSelectOrg}
          showSlideIcon={false}
          slideOrg
          defaultExpandAll={defaultExpandAll}
          orgList={this.listOrg}
          isMapMode={true}
          orgListOld={this.props.OrgStore.orgArray}
          isShowDeviceNum={false}
        />
         <DeviceList
          className="org-device-wrapper"
          title='人员'
          deviceList={orgUserList}
          selectDeviceList={selectUserList}
          onCheckAllChange={(checked) => this.handleCheckAllChange(checked, orgUserList)}
          onCheckItemChange={this.handleCheckItemChange}
          isHightLevel={true}
          keyWord={keyWord}
          keyRandom={keyRandom}
          showUserIcon={true} // 显示用户图标
          showDeviceIcon={false} // 不显示摄像机图标
        />
         <DeviceList
          className="select-device-wrapper"
          deviceList={selectUserList}
          clearSelect={this.clearSelect}
          checkable={false}
          title={`已添加人员(${selectUserList.length}个)`}
          deleteDeviceItem={this.deleteDeviceItem}
          showUserIcon={true}
          showDeviceIcon={false}
        />  
      </div>
    );
  }
}
