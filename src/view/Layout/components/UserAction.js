import React, { Component } from 'react';
import { Avatar, Modal } from 'antd';
import { inject } from 'mobx-react';
import IconSpan from '../../../components/IconSpan';
import UserDefault from '../../../assets/img/base/user-default.svg';
import ChangePwdMarkView from './changePwd';
import ChangeHeadImgView from './changeHeadImg';
import * as _ from 'lodash';
import '../style/user-popup.scss';

const confirm = Modal.confirm;

@inject('UserStore')
export default class UserAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeAvatarVisible: false,
      changePwdVisible: false
    };
  }

  // 上传图片弹窗显示与否
  changeAvatarVisible() {
    this.setState({ changeAvatarVisible: true });
  }

  handleSubmit(e) {
    e.preventDefault();
    let { UserStore } = this.props;
    let newData = Object.assign(_.cloneDeep(UserStore.userInfo), {
      userAvatar: this.state.imgUrl
    });
    UserStore.updateUser(newData).then(() => {
      UserStore.setUserInfo(newData);
      this.handleCancel();
    });
  }

  handleCancel() {
    this.setState({ changeAvatarVisible: false });
  }

  // 修改密码弹窗显示与否
  changePwdVisible() {
    this.setState({ changePwdVisible: true });
  }
  changePassword = () => {
    this.setState({ changePwdVisible: true });
  };

  changeAvatar = () => {};

  signOut = () => {
    const { UserStore } = this.props;
    confirm({
      title: '提示',
      content: '您确认要退出？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        UserStore.logout();
      }
    });
  };

  render() {
    const { userInfo } = this.props;
    const { changePwdVisible, changeAvatarVisible } = this.state;
    const { signOut, changeAvatar, changePassword } = this;
    const { userAvatar, realName } = userInfo;
    return (
      <div className="user-popover-content">
        <div className="user-info">
          <div className="user-info-left fl">
            <Avatar icon="user" src={userAvatar ? userAvatar : UserDefault} />
          </div>
          <div className="user-info-right fl">
            <span className="current-user fl" title={realName}>
              {realName}
            </span>
            <div>
              <IconSpan
                type="antd"
                mode="inline"
                className="fl"
                onClick={() =>
                  this.setState({ changeAvatarVisible: true })
                }
                icon="user"
                label="修改头像"
              />
              <IconSpan
                type="antd"
                mode="inline"
                className="fl"
                onClick={() => this.setState({ changePwdVisible: true })}
                icon="key"
                label="修改密码"
              />
            </div>
          </div>
        </div>
        <IconSpan
          type="antd"
          mode="inline"
          className="login-out"
          onClick={signOut}
          icon="poweroff"
          label="退出登录"
        />
        <ChangePwdMarkView
          changePwdVisible={changePwdVisible}
          closable={true}
          closeChangePwdMark={() => this.setState({ changePwdVisible: false })}
        />
        <ChangeHeadImgView
          changeHeadImgVisible={changeAvatarVisible}
          closeChangeHeadImgMark={() =>
            this.setState({ changeAvatarVisible: false })
          }
        />
      </div>
    );
  }
}
