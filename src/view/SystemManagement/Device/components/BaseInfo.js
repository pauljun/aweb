import React from 'react';
import {
  geoAddress,
  installMethod,
  cameraOrientation
} from '../../../../libs/Dictionary';
import { Form, Select, Input } from 'antd';
import MapPointLabel from '../../../BusinessComponent/MapPointLabel/MapPointLabelView';

const Option = Select.Option;
const FormItem = Form.Item;

const AI = [{ value: '1', label: '是' }, { value: '0', label: '否' }];

export default class BaseInfo extends React.Component {
  constructor(props) {
    super(props);
    const { info = {} } = this.props;
    let otherInfo = {};
    if (info.cameraOrientation) {
      otherInfo.extJson = {
        extMap: {
          cameraOrientation: info.cameraOrientation
        }
      };
    }

    this.state = {
      otherInfo
    };
  }
  componentDidMount() {
    const { form, info = {} } = this.props;
    form.setFieldsValue({
      id: `${info.id}`,
      deviceName: `${info.deviceName}`,
      telephone: `${info.telephone || ''}`,
      installSite: info.installSite && `${info.installSite}`,
      installMethod: info.installMethod && `${info.installMethod}`,
      isIdleDeal: `${info.isIdleDeal}`,
      cameraOrientation: `${info.cameraOrientation || ''}`
    });
  }
  orientationerChange = value => {
    const { otherInfo } = this.state;
    const { form } = this.props;
    if (value) {
      form.setFieldsValue({ cameraOrientation: value });
      otherInfo.extJson = {
        extMap: {
          cameraOrientation: value
        }
      };
      this.setState({ otherInfo });
    }
  };

  render() {
    const { otherInfo } = this.state;
    const { form, info, isView } = this.props;
    const { getFieldDecorator } = form;
    const mapPointInfo = Object.assign(info, otherInfo);
    return (
      <div className="edit-info-layout base-info-layout">
        <h3 className="part-title">基本信息</h3>
        <Form layout="inline" className="base-info-content">
          <FormItem style={{ display: 'none' }}>
            {getFieldDecorator('id')(<Input type="hidden" />)}
          </FormItem>
          <FormItem label="设备名称">
            {getFieldDecorator('deviceName', {
              rules: [
                {
                  required: true,
                  message: '请输入设备名称!'
                }
              ]
            })(<Input placeholder="请输入设备名称" disabled={isView} />)}
          </FormItem>
          <FormItem label="联系电话">
            {getFieldDecorator('telephone', {
              rules: [
                {
                  pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/,
                  message: '请输入正确的联系电话'
                }
              ]
            })(<Input placeholder="请输入电话" disabled={isView} />)}
          </FormItem>
          <FormItem label="安装区域">
            {getFieldDecorator('installSite')(
              <Select placeholder="请选择安装区域" disabled={isView}>
                {geoAddress.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="AI闲时授权">
            {getFieldDecorator('isIdleDeal')(
              <Select placeholder="请选择AI闲时授权" disabled={isView}>
                {AI.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="安装方式">
            {getFieldDecorator('installMethod')(
              <Select placeholder="请选择安装方式" disabled={isView}>
                {installMethod.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="设置朝向">
            <Select
              placeholder="请设置朝向"
              defaultValue={
                info.cameraOrientation && `${info.cameraOrientation}`
              }
              onChange={this.orientationerChange}
              disabled={isView}
            >
              {cameraOrientation.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </FormItem>
          <FormItem style={{ height: 0, overflow: 'hidden' }}>
            {getFieldDecorator('cameraOrientation')(
              <Input disabled={isView} type="hidden" />
            )}
          </FormItem>
          {!isView && (
            <div className="other-layout-info">
              <MapPointLabel point={mapPointInfo} />
            </div>
          )}
        </Form>
      </div>
    );
  }
}
