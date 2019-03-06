import React from 'react';
import { observer, inject } from 'mobx-react';
import { Modal, Form, Input, message } from 'antd';
const FormItem = Form.Item;

@inject('UserStore')
@observer
class ChangePwdMarkView extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    confirmDirty: false,
    formKey: Math.random()
  };
  handleCancel() {
    this.props.closeChangePwdMark();
    setTimeout(() => {
      this.setState({
        formKey: Math.random()
      });
    }, 500);
  }
  handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  compareToFirstPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('pwd')) {
      callback('密码不一致!');
    } else {
      callback();
    }
  }
  validateToNextPassword(rule, value, callback) {
    const form = this.props.form;
    let reg = /^[a-zA-Z]\w{5,17}$/;
    if (!reg.test(value)) {
      callback('密码为6~18位以字母开头的字母,数字,_组合)');
    }
    if (value && this.state.confirmDirty && reg.test(value)) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleSubmit(e) {
    e.preventDefault();
    let { form, UserStore } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        UserStore.changePassword({
          oldPwd: values.oldPwd,
          pwd: values.pwd
        }).then(() => {
          message.success('密码修改成功!');
          setTimeout(() => UserStore.logout(), 100);
          this.handleCancel();
        });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <Modal
        className={this.props.closable ? '' : 'changePsw'}
        title={this.props.closable ? '修改密码' : '检测到您初次登录,请修改密码'}
        visible={this.props.changePwdVisible}
        maskClosable={this.props.maskClosable}
        closable={this.props.closable}
        onOk={this.handleSubmit.bind(this)}
        onCancel={this.handleCancel.bind(this)}
        okText="修改密码"
        cancelText="取消"
        key={this.state.formKey}
      >
        <Form>
          <FormItem {...formItemLayout} label="旧密码">
            {getFieldDecorator('oldPwd', {
              rules: [
                {
                  required: true,
                  message: '请输入旧密码!'
                }
              ]
            })(<Input type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="新密码">
            {getFieldDecorator('pwd', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码!(6~18位,字母,数字,_组合)'
                },
                {
                  validator: this.validateToNextPassword.bind(this)
                }
              ]
            })(<Input type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="重复新密码">
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请重复新密码!'
                },
                {
                  validator: this.compareToFirstPassword.bind(this)
                }
              ]
            })(
              <Input
                type="password"
                onBlur={this.handleConfirmBlur.bind(this)}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
export default Form.create()(ChangePwdMarkView);
