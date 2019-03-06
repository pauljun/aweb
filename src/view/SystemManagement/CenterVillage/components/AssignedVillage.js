import React from 'react';
import ModalFooter from '../../../BusinessComponent/ModalFooter';
import { Modal, Transfer } from 'antd';

export default class AssignedVillage extends React.Component {
  constructor(props) {
    super(props);
    const { data = {} } = this.props;
    const { unallocated = [], assigned = [] } = data;
    this.state = {
      centerList: [].concat(unallocated, assigned),
      assigned: assigned.map(v => v.centerId),
      unallocated
    };
  }
  onChange = (targetKeys, direction, moveKeys) => {
    this.setState({ assigned: targetKeys });
  };
  subVillageChange = async () => {
    const { data } = this.props;
    const { assigned } = this.state;
    this.props.onSubmit(data, assigned);
  };
  render() {
    const { assigned, centerList } = this.state;
    const { visible, onCancel, data = {} } = this.props;
    const { villageName } = data;
    return (
      <Modal
        width={600}
        visible={visible}
        onCancel={onCancel}
        footer={false}
        title={`分配小区（${villageName}）`}
        className="assign-village-modal"
      >
        <div className="assign-village">
          <Transfer
            rowKey={item => item.centerId}
            dataSource={centerList}
            showSearch
            targetKeys={assigned}
            //onChange={this.handleChange}
            render={item => item.centerName}
            onChange={this.onChange}
          />
        </div>
        <ModalFooter onCancel={onCancel} onOk={this.subVillageChange} />
      </Modal>
    );
  }
}
