import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Input, Checkbox, message ,Spin} from 'antd';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import Socket from 'src/libs/Socket';
import * as _ from 'lodash';
import RouterList from '../../../../libs/common';
import { computTreeList } from 'src/utils';
import './addOrEdit.scss';

const FormItem = Form.Item;

@withRouter
@BusinessProvider('UserStore', 'RoleManagementStore', 'TabStore')
@observer
class AddOrEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      checkAlls: false,
      indeterminate: false,
      checkSingles: false,
      initData: '',
      menuTreeList: [],
      isDisabled: {}
    };
    this.menuList = _.cloneDeep(RouterList);
    this.menuList.forEach(y => (y.checked = false));
  }
  isAdd = true;
  isView = false;
  // menuTreeList=[]
  async componentWillMount() {
    let { location, RoleManagementStore, UserStore } = this.props;
    let pathname = location.pathname;
    pathname = pathname.split('/');
    let lastPath = pathname && pathname[pathname.length - 1];
    this.isView = lastPath === 'RoleView' ? true : false;
    this.isAdd = lastPath === 'RoleAdd' ? true : false;
    //详情就禁用各种输入框
    let isDisabled = this.isView ? { disabled: true } : {};
    let res = await RoleManagementStore.getMenuAndPrivilegeByOperationCenterId(
      UserStore.userInfo.optCenterId
    );
		let privs = res.result.module.concat(res.result.privileges);
		
    let list = [];
    for (let i = 0, l = this.menuList.length; i < l; i++) {
      let item = this.menuList[i];
      let menu = privs.find(
        x => Number(x.id) === item.id || x.privilegeCode === item.id
      );
      if (menu) {
				item.text = menu.menuName || menu.privilegeName;
				list.push(item)
      }
    }
    
    if(window.webConfig.wifiDevice == "0") {
      // 判断全局wifi显示设置
      const wifiLibIndex = list.findIndex(v => v.id == "100001010086");
      if(wifiLibIndex !== -1) {
        list.splice(wifiLibIndex, 1);
      }
      const wifiViewIndex = list.findIndex(v => v.id == "1030701");
      if(wifiViewIndex !== -1) {
        list.splice(wifiViewIndex, 1);
      }
      const wifiEditIndex = list.findIndex(v => v.id == "1030702");
      if(wifiEditIndex !== -1) {
        list.splice(wifiEditIndex, 1);
      }
    }

		this.menuList = list
    let menuTreeList = computTreeList(
      this.menuList,
      undefined,
      undefined,
      true
    );
    this.setState({ menuTreeList,isDisabled ,loading:this.isAdd?false:true});

    // 后台取出的选中id
    let checkitem = [];
    if (!this.isAdd) {
      let ids = location.search.split('=')[1];
      RoleManagementStore.getRoleDetail(ids).then(res => {
        checkitem =
          res.result && res.result.privileges.map(v => Number(v.privilegeCode));
        //回显的全选半选状态
        let c = checkitem.length;
        let m = this.menuList.filter(x => !x.module).map(v => v.id).length;
        console.log(c,m)
        //所有菜单树结构 
        this.setCheckedMenu(checkitem,menuTreeList);
        // 初始化privilegeIds
        RoleManagementStore.roleChange({ privilegeIds: _.uniq(checkitem).join(',') });
        this.setState({
          initData: res.result && res.result.roleInfo,
          checkAlls: c === m,
          indeterminate: c !== m,
          loading:false
        });
      });
    }
  }
  // 设置选中节点
  setCheckedMenu(checkitem,menuTreeList) {
     let menuList = _.cloneDeep(RouterList);
    // 获取用户的菜单树
    let myMenu = [];
    checkitem.map(v => {
        menuList.map(item => {
            if(v === item.id){
                myMenu.push(item)
                if(item.parentId){
                  let items = menuList.filter(x => x.id === item.parentId);
                  myMenu.push(items[0])
                  if(items[0].parentId){
                    let itemss = menuList.filter(y => y.id === items[0].parentId);
                  myMenu.push(itemss[0])
                  }
                }
            }
        })
    })
    // 过滤重复
    let arr = [];
    myMenu.map(v => {
        if(arr.indexOf(v) < 0){
            arr.push(v);
        }
    })
    let myMenuTree = computTreeList(arr,
      undefined,
      undefined,
      true);

    // 承接1/2树节点id
    let firstAndSec = []
    // 单独获取一二级id
    let result = this.getfirstAndSecMenuChecked(firstAndSec, myMenuTree, menuTreeList);
    console.log("一级和二级id" + result)
    this.menuList.map(v => {
        // 设置按钮即 3 级菜单选中
        // checkitem.includes(v.parentId && !v.module ? v.id :false) ? (v.checked = true) : (v.checked = false)
        checkitem.map(x => {
          if(x===v.id){
            v.checked = true
          }
        })
        // 设置1、2菜单选中
        result.map(item => {
            if(v.id === item){
                v.checked = true;
            }
        })
    })
  }
    // 递归获取1、2级菜单选中id
    getfirstAndSecMenuChecked(firstAndSec, myMenuTree, menuTreeList){
      myMenuTree.map(item => {
          let target = menuTreeList.filter(v => item.id === v.id)[0];
          if(Array.isArray(item.children) && item.children.length > 0 && target && Array.isArray(target.children) && target.children.length > 0){
              if(item.children.length === target.children.length){
                  if(firstAndSec.indexOf(item.id) < 0){
                      firstAndSec.push(item.id);
                  }
              } else{
                  // 判断二级菜单的父级
                  if(item.parentId){
                      if(firstAndSec.indexOf(item.parentId) >= 0){
                          firstAndSec.splice(firstAndSec.indexOf(item.parentId), 1);
                      }
                  }
              }
              
          } 
          if(Array.isArray(item.children) && item.children.length > 0 && target){
              this.getfirstAndSecMenuChecked(firstAndSec, item.children, target.children);
          }
      })
      return firstAndSec;
  }

  /**
   * checked递归
   */
  checksingles(v, checked) {
    let menuList = this.menuList;
    if (Array.isArray(v)) {
      v.map(v => {
        v.checked = checked;
        if (checked === true) {
          if (v.isSelect) {
            v.isSelect.map(m => {
              let item = menuList.filter(x => x.id === m);
              item.map(n => (n.checked = checked));
            });
          }
        } else {
          if (v.isCancel) {
            v.isCancel.map(m => {
              let item = menuList.filter(x => x.id === m);
              item.map(n => (n.checked = checked));
            });
          }
        }
        if (v.children) {
          this.checksingles(v.children, checked);
        }
      });
    } else {
      v.checked = checked;
      if (checked === true) {
        if (v.isSelect) {
          v.isSelect.map(m => {
            let item = menuList.filter(x => x.id === m);
            item.map(n => (n.checked = checked));
          });
        }
      } else {
        if (v.isCancel) {
          v.isCancel.map(m => {
            let item = menuList.filter(x => x.id === m);
            item.map(n => (n.checked = checked));
          });
        }
      }
      if (v.children) {
        this.checksingles(v.children, checked);
      }
    }
  }
  checkParents(menu, menuList) {
    let parentMenu = menuList.filter(v => menu.parentId === v.id)[0];
    if (parentMenu) {
      let arr = parentMenu.children.map(v => v.checked);
      if (arr.includes(true) && arr.includes(false)) {
        parentMenu.checked = false;
      } else {
        parentMenu.checked = arr.includes(true);
      }
      if (parentMenu.parentId) {
        this.checkParents(parentMenu, menuList);
      }
    }
    return menuList;
  }

  /**
   * 全选
   */
  checkAll = e => {
    let menuList = this.menuList;
    let { RoleManagementStore } = this.props;
    let { roleChange } = RoleManagementStore;
    const check = e.target.checked;
    menuList.map(v => (v.checked = check));
    this.setState({ checkAlls: check, indeterminate: false });
    this.forceUpdate();
    roleChange({
      privilegeIds: menuList
        .filter(x => !x.module && x.checked === true)
        .map(v => v.id)
        .join(',')
    });
  };

  /**
   * 单项/反选/半选
   */
  checkSingle(item) {
    let menuList = this.menuList;
    let { RoleManagementStore } = this.props;
    let { roleChange } = RoleManagementStore;
    const checked = !item.checked;

    let menu = menuList.find(v => v.id === item.id);
    this.checksingles(menu, checked);
    menuList = this.checkParents(menu, menuList);
    let data = [];
    menuList.filter(x => !x.module).map(v => {
      if (v.id && v.checked === true) {
        data.push(v.id);
        // if (v.parentId) {
        //   data.push(v.parentId);
        //   let menu = menuList.find(x => x.id === v.parentId);
        //   if (menu.parentId) {
        //     data.push(menu.parentId);
        //   }
        // }
      }
    });
    let arrs = menuList.map(v => v.checked === true);
    if (arrs.includes(false) && arrs.includes(true)) {
      this.setState({ checkAlls: false, indeterminate: true });
    } else {
      this.setState({ checkAlls: !arrs.includes(false), indeterminate: false });
    }

    this.forceUpdate();
    // 保存选中权限到后台
    roleChange({ privilegeIds: _.uniq(data).join(',') });
  }
  /**
   * 渲染checkbox
   */
  renderCheckedModule(treeData) {
    return treeData.map(item => (
      <React.Fragment key={item.id}>
        <span
          className={
            item.parentId ? (item.module ? 'firSon' : 'secSon') : 'father'
          }
        >
          <Checkbox
            {...this.state.isDisabled}
            onChange={this.checkSingle.bind(this, item)}
            checked={item.checked}
          >
            {item.text}
          </Checkbox>
          {Array.isArray(item.children) &&
            item.children.length > 0 &&
            this.renderCheckedModule(item.children)}
        </span>
      </React.Fragment>
    ));
  }
  // 保存操作
  handleSave = () => {
    let { form, UserStore, RoleManagementStore } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      let pidList = RoleManagementStore.RoleSettingInfo.privilegeIds;
      if (!pidList.length) {
        message.error('请为当前角色选择至少一项权限！');
        return;
      }
      this.setState({
        btnLoad: true
      });
      if (this.isAdd) {
        let roleInfo = {
          ...values,
          privilegeIds: pidList.toString(),
          centerId: UserStore.userInfo.optCenterId,
          organizationId: UserStore.userInfo.organizationId,
          roleType: 111903
        };
        RoleManagementStore.addRole(roleInfo)
          .then(() => {
            message.success('角色添加成功');
            this.setState({
              btnLoad: false
            });
            this.handleCancel();
          })
          .catch(() => {
            this.setState({
              btnLoad: false
            });
          });
      }
      if (!this.isAdd) {
        let roleInfo = {
          // ...oldRole,
          id: this.state.initData.id,
          ...values,
          organizationId: UserStore.userInfo.organizationId,
          centerId: UserStore.userInfo.optCenterId,
          roleType: this.state.initData.roleType,
          privilegeIds: pidList.toString()
        };
        RoleManagementStore.editRole(roleInfo)
          .then(() => {
            message.success('角色编辑成功');
            this.setState({
              btnLoad: false
            });
            this.handleCancel();
          })
          .catch(() => {
            this.setState({
              btnLoad: false
            });
          });
      }
    });
  };
  // 取消操作
  handleCancel = () => {
    this.setState({ initData: '' });
    Socket.emit('UPDATE_ROLE_LIST');
    this.props.TabStore.closeCurrentTab({
      history: this.props.history
    });
  };

  render() {
    let {
      key,
      checkAlls,
      initData,
      indeterminate,
      menuTreeList,
      isDisabled,
      loading
    } = this.state;
    let { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colon: false
    };
    const formItemLayout2 = {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      colon: false
    };
    return (
      <React.Fragment>
        <div className="noTreeTitle">
          {this.isAdd ? '新建角色' : this.isView ? '查看角色' : '编辑角色'}
        </div>
        <div className="roleEdit-contanier">
          <div className="roleEdit">
            <div className="titleLayer">
              <div className="titleText basetitle">基本信息</div>
            </div>
            <div className="editRoleContent">
              <div className="role-info">
                <div className="baseInfo">
                  <Form
                    onSubmit={this.handleSave.bind(this)}
                    autoComplete="off"
                    className="roleForm"
                    key={key}
                  >
                    <FormItem
                      className="roleNames"
                      label="角色名称："
                      {...formItemLayout}
                      autoComplete="off"
                    >
                      {getFieldDecorator('roleName', {
                        rules: [
                          { required: true, message: '角色名称必须填写' },
                          {
                            max: 20,
                            message: '最大长度为20'
                          }
                        ],
                        initialValue: this.isAdd ? '' : initData.roleName
                      })(
                        <Input placeholder="请填写角色名称" {...isDisabled} />
                      )}
                    </FormItem>
                    <FormItem
                      label="角色描述："
                      className="roleDescs"
                      {...formItemLayout2}
                    >
                      {getFieldDecorator('roleDesc', {
                        rules: [
                          {
                            required: false
                          },
                          {
                            max: 150,
                            message: '最大长度是150'
                          }
                        ],
                        initialValue: this.isAdd ? '' : initData.roleDesc
                      })(
                        <Input.TextArea
                          size={{ minRows: 4, maxRows: 8 }}
                          placeholder="请填写角色描述"
                          {...isDisabled}
                        />
                      )}
                    </FormItem>
                    <div className="titleLayer">
                      <div className="titleText">权限信息(必填项)</div>
                    </div>
                    <Spin spinning={loading} style={{position:"fixed",top:'40%',left:'50%'}}/>
                    <div className="pid-info">
                      <div className="check-all">
                        <FormItem>
                          <Checkbox
                            {...isDisabled}
                            indeterminate={indeterminate}
                            checked={checkAlls}
                            onClick={e => this.checkAll(e)}
                            style={{ paddingLeft: '20px', marginTop: '20px' }}
                          >
                            全选
                          </Checkbox>
                        </FormItem>
                        <div
                          className="checkbox-group"
                          style={{
                            height: 'calc(100% - 52px)',
                            overflow: 'auto'
                          }}
                        >
                          {this.renderCheckedModule(menuTreeList)}
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="setting-edit-btns role-btn">
            <Button
              className="save-btn ant-btn"
              type="primary"
              name="save-btn"
              onClick={this.handleCancel}
              style={{ display: this.isView ? 'block' : 'none' }}
            >
              {'返回'}
            </Button>
            <Button
              className="cancel-btn ant-btn"
              name="cancel-btn"
              onClick={this.handleCancel}
              style={{ display: this.isView ? 'none' : 'inline-block' }}
            >
              {'取消'}
            </Button>
            <Button
              className="save-btn ant-btn"
              type="primary"
              loading={this.state.btnLoad}
              name="save-btn"
              onClick={this.handleSave.bind(this)}
              style={{ display: this.isView ? 'none' : 'inline-block' }}
            >
              {'保存'}
            </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default Form.create()(AddOrEdit);
