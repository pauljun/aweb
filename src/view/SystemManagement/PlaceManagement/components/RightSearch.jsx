import React from 'react';
import { Popover, Form } from 'antd';
import { SearchFormRight } from './FormSearch';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';

@BusinessProvider('OperationCenterDeviceSollotStore')
@Form.create({
  onFieldsChange: (props, files) => {
    const { OperationCenterDeviceSollotStore } = props;
    let data = {};
    Object.keys(files).map(key => {
      data[key] = files[key].value;
    });
    OperationCenterDeviceSollotStore.mergeSearchData(data);
  }
})
class view extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  onReset = () => {
    const { OperationCenterDeviceSollotStore, form } = this.props;
    OperationCenterDeviceSollotStore.initSearch();
    this.props.onSubmit();
    const data = OperationCenterDeviceSollotStore.searchData;
    form.setFieldsValue({ ...data });
  };
  render() {
    const { form, deviceGroup, OperationCenterDeviceSollotStore } = this.props;
    return (
      <div className="search">
        <div className="search-form-right-popup-layout" />
        <h3>
          运营中心设备(
          {this.props.total})
          <Popover
            visible={this.state.visible}
            getPopupContainer={() =>
              document
                .querySelector('.ant-tabs-tabpane-active')
                .querySelector('.search-form-right-popup-layout')
            }
            placement="leftTop"
            trigger="click"
            content={
              <SearchFormRight
                data={OperationCenterDeviceSollotStore.searchData}
                deviceGroup={deviceGroup}
                form={form}
                onReset={this.onReset}
                onOk={() => this.props.onSubmit()}
                onCancel={() => this.setState({ visible: false })}
              />
            }
          >
            <a onClick={() => this.setState({ visible: true })}>筛选</a>
          </Popover>
        </h3>
        <div />
      </div>
    );
  }
}

export default view;
