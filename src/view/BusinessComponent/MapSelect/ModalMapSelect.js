import React from 'react';
import { Modal } from 'antd';
import MapSelect from './index';
import ModalFooter from '../ModalFooter';

export default class ModalMapSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }
  componentDidMount() {
    const { selectList = [] } = this.props;
    this.setState({ list: selectList });
  }
  changeSelectList = list => {
    this.setState({ list });
  };
  deleteDeviceItem = item => {
    const { list } = this.state;
    const index = list.findIndex(v => v.id === item.id);
    list.splice(index, 1);
    this.setState({ list });
  };
  onSubmit = async () => {
    const { list } = this.state;
    const { onOk, onCancel } = this.props;
    onOk && onOk(list);
    onCancel();
  };
  render() {
    const { list } = this.state;
    const { visible, onCancel, onOk, className, ...params } = this.props;
    return (
      <Modal
        width={920}
        visible={visible}
        footer={null}
        onCancel={onCancel}
        className={`modal-map-select ${className ? className : ''}`}
        {...params}
      >
        <MapSelect
          deleteDeviceItem={this.deleteDeviceItem}
          onSelect={this.changeSelectList}
          selectList={list}
        />
        <ModalFooter onCancel={onCancel} onOk={() => this.onSubmit(list)} />
      </Modal>
    );
  }
}
