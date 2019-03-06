import React from 'react';
import { Form, Select, Input, InputNumber } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

const push = [{ value: '1', label: '开启' }, { value: '0', label: '关闭' }];

export default class MotionFindInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { form, info = {} } = this.props;
    const { lyCameraInfo = {} } = info;
    form.setFieldsValue({
      interval: lyCameraInfo.interval,
      count: lyCameraInfo.count,
      push: `${lyCameraInfo.push}`
    });
  }
  render() {
    const { form, isView } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className="edit-info-layout motion-info-layout">
        <h3 className="part-title">移动侦测</h3>
        <Form layout="inline" className="base-info-content">
          <FormItem label="抓拍间隔（秒）">
            {getFieldDecorator('interval')(
              <InputNumber
                min={1}
                max={3600}
                placeholder="请输入抓拍间隔时间"
                disabled={isView}
              />
            )}
          </FormItem>
          <FormItem label="抓拍张数（张）">
            {getFieldDecorator('count')(
              <InputNumber
                min={1}
                max={5}
                placeholder="请输入抓拍间隔时间"
                disabled={isView}
              />
            )}
          </FormItem>
          <FormItem label="是否开启报警">
            {getFieldDecorator('push')(
              <Select placeholder="请设置是否开启报警" disabled={isView}>
                {push.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
