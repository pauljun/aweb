import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import ModalShow from 'src/components/ModalComponent'
import { observer } from 'mobx-react';
import { departmentType } from '../../../../libs/Dictionary/index';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
const FormItem = Form.Item;
const Option = Select.Option;
@BusinessProvider('OrgManagementStore', 'OrgStore')
@observer
class ModalView extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let { form, data } = this.props;
    data = data || {};
    let type = departmentType.find(v => v.value === data.type);
    form.setFieldsValue({
      organizationName: data.name || '',
      organizationType: type ? type.value : 1008000,
      organizationDesc: data.desc || ''
    });
  }
  onSubmit(type) {
    const { form, data ,OrgStore} = this.props;
    form.validateFields((err, values) => {
      if (err) {
        console.error('表单错误', err);
        return;
      }
      this.props.onSubmit(data, values, type).then(() => {
        this.handleCancel();
       OrgStore.getOrgList();

      });
    });
  }
  handleCancel = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.CancelModal();
  };
  render() {
    const { type, visible ,showOrgType=false} = this.props;
    let { getFieldDecorator } = this.props.form;
    let isDisabled = type == 'view' ? { disabled: true } : {};
    const btnShow = type == 'view' ? 'hindModalBtn':''
    return (
      <ModalShow
        title={
          type == 'edit' ? '编辑组织基本信息' : type == 'add' ? '新建直属组织' : '组织详情'
        }
        visible={visible}
        onOk={() => this.onSubmit(this.props.type)}
        onCancel={this.handleCancel}
        className={`add-edit-modal-org ${btnShow}`}
      >
        <Form layout="inline">
          <FormItem label="组织名称">
            {getFieldDecorator('organizationName', {
              rules: [
                {
                  required: true,
                  message: '组织名称必须填写且长度不能超过50个字符',
                  max: 50
                }
              ]
            })(<Input placeholder="请填写组织名称" {...isDisabled} />)}
          </FormItem>
          {showOrgType ? (
            <FormItem label="组织类型">
              {getFieldDecorator('organizationType', {
                rules: [{ required: true, message: '组织类型必须填写' }]
              })(
                <Select
                  className="ant-col-14"
                  placeholder="请选择组织类型"
                  disabled
                >
                  {departmentType.map((item, index) => {
                    return (
                      <Option key={index} value={item.value}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          ) : ''
          }
          <FormItem label="组织描述" className="org-desc-item">
            {getFieldDecorator('organizationDesc', {
              rules: [{ max: 150, message: '描述请控制在150个字符内' }]
            })(
              <Input.TextArea
                name="organizationDesc"
                {...isDisabled} /* placeholder={placeholderDesc} rows={4} {...isDisabled} */
              />
            )}
          </FormItem>
        </Form>
      </ModalShow>
    );
  }
}

export default Form.create()(ModalView);
