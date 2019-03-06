import React from 'react';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

export default class OSDInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { form, info = {} } = this.props;
    form.setFieldsValue({
      osd: info.lyCameraInfo.osd
    });
  }
  render() {
    const { form, isView } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className="edit-info-layout base-info-layout osd-info-layout">
        <h3 className="part-title">OSD设置</h3>
        <Form layout="inline" className="base-info-content">
          <FormItem label="OSD名称">
            {getFieldDecorator('osd')(
              <Input placeholder="请输入OSD名称" disabled={isView} />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
