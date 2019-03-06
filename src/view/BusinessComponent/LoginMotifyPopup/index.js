import React from 'react';
import { Form, Input } from 'antd';
import ModalFooter from '../ModalFooter';
import { inject, observer } from 'mobx-react';
import { Base64 } from 'js-base64';
import './index.scss';

const FormItem = Form.Item;

@Form.create({})
@inject('UserStore')
@observer
export default class LoginMotifyPopup extends React.Component {
  async onSubmit() {
    const { UserStore, form, userId } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        console.error('表单错误', err);
        return;
      }
      const { oldPwd, pwd } = values;
      UserStore.changePassword({
        userId,
        oldPwd: Base64.encode(oldPwd),
        pwd: Base64.encode(pwd)
      }).then(() => {
        this.props.onCancel();
      });
    });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('pwd')) {
      callback('密码不一致!');
    } else {
      callback();
    }
  };
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value) {
      form.validateFields(['repwd'], { force: true });
    }
    callback();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { xs: { span: 5 } },
      wrapperCol: { xs: { span: 17 } }
    };
    return (
      <div className="user-popup-layout">
        <div className="user-popup-title">首次登陆</div>
        <Form>
          <div className="user-popup-body">
            <FormItem label="旧密码" {...formItemLayout}>
              {getFieldDecorator('oldPwd', {
                rules: [
                  {
                    required: true,
                    message: '请输入旧密码!'
                  }
                ]
              })(<Input type="password" placeholder="请输入旧密码" />)}
            </FormItem>
            <FormItem label="新密码" {...formItemLayout}>
              {getFieldDecorator('pwd', {
                rules: [
                  {
                    required: true,
                    message: '请输入新密码!'
                  },
                  {
                    validator: this.validateToNextPassword
                  }
                ]
              })(<Input type="password" placeholder="请输入新密码" />)}
            </FormItem>
            <FormItem label="确认新密码" {...formItemLayout}>
              {getFieldDecorator('repwd', {
                rules: [
                  {
                    required: true,
                    message: '请重复新密码!'
                  },
                  {
                    validator: this.compareToFirstPassword
                  }
                ]
              })(<Input type="password" placeholder="请重复新密码" />)}
            </FormItem>
          </div>

          <ModalFooter
            onCancel={() => this.props.onCancel()}
            onOk={this.onSubmit.bind(this)}
          />
        </Form>
      </div>
    );
  }
}
