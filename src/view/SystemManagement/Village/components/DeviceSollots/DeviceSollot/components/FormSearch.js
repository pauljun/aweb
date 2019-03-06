import React from 'react';
import { DeviceType } from 'src/libs/DeviceLib';
import { Form, Input, Select, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const orderType = [
  { value: '-1', label: '默认' },
  { value: '1', label: '创建时间降序' },
  { value: '2', label: '更新时间降序' }
];

const distributionStateData = [
  { value: '1', label: '全部' },
  { value: '2', label: '未分配到本运营中心' },
  { value: '3', label: '未分配到任何运营中心' }
];

export class SearchFormLeft extends React.Component {
  componentDidMount() {
    const { form, data } = this.props;
    form.setFieldsValue({ ...data });
  }
  render() {
    const { deviceGroup, form, onOk, onCancel, onReset } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <FormItem label="分配状态">
          {getFieldDecorator('distributionState')(
            <Select placeholder="请选择分配状态">
              {distributionStateData.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="设备类型">
          {getFieldDecorator('deviceType')(
            <Select placeholder="请选择类型">
              {DeviceType.map(item => 
                item.label !== '单兵' ? 
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option> : null
              )}
            </Select>
          )}
        </FormItem>
        <FormItem label="排序类型">
          {getFieldDecorator('orderType')(
            <Select placeholder="请选择排序类型">
              {orderType.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="分组">
          {getFieldDecorator('lygroupId')(
            <Select placeholder="请选择分组">
              {deviceGroup.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="设备名称">
          {getFieldDecorator('deviceName')(
            <Input placeholder="请输入设备名称" />
          )}
        </FormItem>
        <FormItem label="SN">
          {getFieldDecorator('sn')(<Input placeholder="请输入SN码" />)}
        </FormItem>

        <div className="button-group-search">
          <Button onClick={onOk} className="orange-btn">
            查询
          </Button>
          <Button onClick={onReset}>重置</Button>
          <Button onClick={onCancel}>关闭</Button>
        </div>
      </Form>
    );
  }
}

export class SearchFormRight extends React.Component {
  componentDidMount() {
    const { form, data } = this.props;
    form.setFieldsValue({ ...data });
  }
  render() {
    const { deviceGroup, form, onOk, onCancel, onReset } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <FormItem label="设备名称">
          {getFieldDecorator('deviceName')(
            <Input placeholder="请输入设备名称" />
          )}
        </FormItem>
        <FormItem label="SN">
          {getFieldDecorator('sn')(<Input placeholder="请输入SN码" />)}
        </FormItem>
        <FormItem label="分组">
          {getFieldDecorator('lygroupId')(
            <Select placeholder="请选择分组">
              {deviceGroup.map(item => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <div className="button-group-search">
          <Button onClick={onOk} className="orange-btn">
            查询
          </Button>
          <Button onClick={onReset}>重置</Button>
          <Button onClick={onCancel}>关闭</Button>
        </div>
      </Form>
    );
  }
}
