import React from 'react';
import { Modal } from 'antd';
import MapPointLabel from './index';
import ModalFooter from '../ModalFooter';
import './index.scss';

export default class ModalMapPointLabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
      key: Math.random()
    };
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.visible) {
      this.setState({ info: null, key: Math.random() });
    }
  }
  onSubmit = async () => {
    const { onOk, onCancel } = this.props;
    onOk && onOk(this.state.info);
    onCancel();
  };
  onChangePoint = info => {
    this.setState({ info });
  };
  render() {
    const { info } = this.state;
    const { visible, onCancel, onOk, className, point, ...params } = this.props;
    return (
      <Modal
        width={920}
        visible={visible}
        footer={null}
        onCancel={onCancel}
        className={`modal-map-point-lable ${className ? className : ''}`}
        {...params}
      >
        <MapPointLabel
          key={this.state.key}
          onChangePoint={this.onChangePoint}
          point={point}
        />
        <ModalFooter
          onCancel={onCancel}
          onOk={() => this.onSubmit()}
          disabled={!info}
        />
      </Modal>
    );
  }
}
