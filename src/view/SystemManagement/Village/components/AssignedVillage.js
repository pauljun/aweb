import React from 'react';
import ModalFooter from '../../../BusinessComponent/ModalFooter';
import PromissionManagement from '../../../PersonnelControl/Components/components/promission';
import { Modal, Transfer } from 'antd';

export default class AssignedVillage extends React.Component {
  constructor(props) {
    super(props);
    const { data = {} } = this.props;
    const { associateUser = [] } = data;
    const assigned = associateUser.map(v => `user-${v.userId}`);
    this.state = {
      assigned: assigned
    };
  }
  setCheckedKeys = targetKeys => {
    let list = targetKeys.filter(v => v.indexOf('user') > -1);
    this.setState({ assigned: list });
  };
  subVillageChange = async () => {
    const { data } = this.props;
    const { assigned } = this.state;
    this.props.onSubmit(data, assigned.map(v => v.replace('user-', '')));
  };
  render() {
    const { assigned } = this.state;
    const { visible, onCancel, data = {}, treeData, orgUserList } = this.props;
    const { villageName } = data;
    return (
      <Modal
        width={700}
        visible={visible}
        onCancel={onCancel}
        footer={false}
        title={`分配小区（${villageName}）`}
        className="assign-village-modal"
      >
        <div className="assign-village">
          <PromissionManagement
            formTreeData={treeData}
            orgUserList={orgUserList}
            userId={assigned}
            setCheckedKeys={this.setCheckedKeys}
          />
        </div>
        <ModalFooter onCancel={onCancel} onOk={this.subVillageChange} />
      </Modal>
    );
  }
}
