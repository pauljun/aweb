import React from 'react';
import { observer, inject } from 'mobx-react';
import { Modal } from 'antd';
import UploadComponent from '../../../components/Upload';
import UploadPicMessage from '../../../service/lyService.js';
import { searchFormat } from '../../../utils';

@inject('UserStore')
@observer
class ChangeHeadImgView extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    headImgUrl: '',
    formKey: Math.random()
  };
  changeheadImg = param => {
    this.setState({
      headImgUrl: param
    });
  };
  handleCancel() {
    let { headImgUrl } = this.state;
    if (headImgUrl) {
      const userObjId = searchFormat(headImgUrl.split('?')[1]).obj_id;
      UploadPicMessage.deleteFile(userObjId);
    }
    this.props.closeChangeHeadImgMark();
    setTimeout(() => {
      this.setState({
        formKey: Math.random(),
        headImgUrl: ''
      });
    }, 500);
  }
  handleSubmit(e) {
    e.preventDefault();
    let { UserStore } = this.props;
    let { headImgUrl } = this.state;
    if (!headImgUrl) {
      headImgUrl = UserStore.userInfo.userAvatar;
    } else {
      if (this.props.UserStore.userInfo.userAvatar) {
        const userObjId = searchFormat(
          this.props.UserStore.userInfo.userAvatar.split('?')[1]
        ).obj_id;
        UploadPicMessage.deleteFile(userObjId);
      }
    }
    let userInfo = { ...UserStore.userInfo, userAvatar: headImgUrl };
    UserStore.editUserLogp(userInfo).then(() => {
      UserStore.setUserInfo(userInfo);
      this.props.closeChangeHeadImgMark();
      setTimeout(() => {
        this.setState({
          formKey: Math.random(),
          headImgUrl: ''
        });
      }, 500);
    });
  }
  render() {
    return (
      <Modal
        title="修改头像"
        visible={this.props.changeHeadImgVisible}
        onOk={this.handleSubmit.bind(this)}
        onCancel={this.handleCancel.bind(this)}
        okText="确定"
        cancelText="取消"
        key={this.state.formKey}
      >
        <div className="edit-user-logo">
          <UploadComponent changeheadImg={this.changeheadImg.bind(this)} />
        </div>
      </Modal>
    );
  }
}

export default ChangeHeadImgView;
