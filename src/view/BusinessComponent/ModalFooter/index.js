import React from 'react';
import { Button } from 'antd';
import { judgeType } from '../../../utils/index';
import './index.scss';

export default class ModalFooter extends React.Component {
  state = {
    loading: false
  };
  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }
  onSubmit = () => {
    this.setState({ loading: true });
    const onOk = this.props.onOk();
    if (judgeType(onOk, 'Promise')) {
      onOk.then(() => {
        this.setState({ loading: false });
      });
    } else {
      this.timer = setTimeout(() => {
        this.setState({ loading: false });
      }, 100);
    }
  };
  render() {
    const { className = '', onCancel, disabled } = this.props;
    return (
      <div className={`modal-footer ${className}`}>
        <Button onClick={() => onCancel()}>取消</Button>
        <Button
          onClick={this.onSubmit}
          htmlType="submit"
          type="primary"
          loading={this.state.loading}
          disabled={disabled}
        >
          确定
        </Button>
      </div>
    );
  }
}
