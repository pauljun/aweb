import React from 'react';
import ModalFooter from '../../../BusinessComponent/ModalFooter';
import OrgSelectUsers from '../../../BusinessComponent/OrgSelectUsers/index'
import { Modal, Transfer } from 'antd';

export default class AssignedVillage extends React.Component {
  constructor(props) {
    super(props);
    const { data = {} } = this.props;
    const { associateUser = [] } = data;
    let userIds = []
    associateUser.forEach(item => {
      userIds.push(item.userId)
    })
    this.state = {
      assigned: userIds
    };
  }
  setCheckedKeys = targetKeys => {
    this.setState({ assigned: targetKeys });
  };
  subVillageChange = async () => {
    const { data } = this.props;
    const { assigned } = this.state;
    this.props.onSubmit(data, assigned);
  };
  render() {
    const { assigned } = this.state;
    const { visible, onCancel, data = {}, privilegeName=[], andOr=1 } = this.props;
    const { villageName } = data;
    return (
      <Modal
        width={930}
        visible={visible}
        onCancel={onCancel}
        footer={false}
        title={`分配小区（${villageName}）`}
        className="assign-village-modal"
      >
        <div className="assign-village">
          <OrgSelectUsers 
            defaultSelectUser={assigned}
            onChange={this.setCheckedKeys}
            privilegeName={privilegeName}
            andOr={andOr}
          />
        </div>
        <ModalFooter onCancel={onCancel} onOk={this.subVillageChange} />
      </Modal>
    );
  }
}
