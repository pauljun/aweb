import React from 'react';
import { Form, Input, Button } from 'antd';
import { inject } from 'mobx-react';
import FormUpload from '../../../components/Upload/FormUpload'
import './index.scss';

const FormItem = Form.Item;

@Form.create({})
@inject('UserStore')
export default class ChangeMechineName extends React.Component {
  componentDidMount() {
    const { form } = this.props;
    form.setFieldsValue({});
  }
  onSubmit() {
    const { UserStore, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        console.error('表单错误', err);
        return;
      }
      const { machineNewName } = values;
      const { machineInfo } = UserStore;
      UserStore.changeMachineName({
        id: machineInfo.id,
        machineNewName
      }).then(() => {});
    });
  }
  render() {
    const { UserStore, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { xs: { span: 5 } },
      wrapperCol: { xs: { span: 17 } }
    };
    return (
      <div className="user-popup-layout">
        <div className="user-popup-title">修改一体机设备名称</div>
        <Form>
          <div className="user-popup-body">
            <FormItem label="一体机串码" {...formItemLayout}>
              <span>{UserStore.machineInfo.sn}</span>
            </FormItem>
            <FormItem label="设备原名称" {...formItemLayout}>
              <span>{UserStore.machineInfo.name}</span>
            </FormItem>
            <FormItem label="设备名称" {...formItemLayout}>
              {getFieldDecorator('machineNewName', {
                rules: [
                  {
                    required: true,
                    message: '请输入设备名称!'
                  }
                ]
              })(<Input type="text" placeholder="请输入设备名称" />)}
            </FormItem>
            <FormItem label="设备名称" {...formItemLayout}>
              {getFieldDecorator('img', {
                rules: [
                  {
                    required: true,
                    message: '请输入设备名称!'
                  }
                ]
              })(<FormUpload />)}
            </FormItem>
          </div>

          <Button onClick={this.onSubmit.bind(this)}>submit</Button>
        </Form>
      </div>
    );
  }
}
