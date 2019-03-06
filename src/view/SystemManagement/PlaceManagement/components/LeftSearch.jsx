import React from 'react';
import { Popover, Form } from 'antd';
import { SearchFormLeft } from './FormSearch';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';

@BusinessProvider('OperationCenterDeviceSollotStore')
@Form.create({
  onFieldsChange: (props, files) => {
    const { OperationCenterDeviceSollotStore } = props;
    let data = {};
    Object.keys(files).map(key => {
      data[key] = files[key].value;
    });
    OperationCenterDeviceSollotStore.mergeAllSearchData(data);
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
    OperationCenterDeviceSollotStore.initAllSearch();
    this.props.onSubmit();
    const data = OperationCenterDeviceSollotStore.allSearchData;
    form.setFieldsValue({ ...data });
  };
  render() {
    const {
      form,
      deviceGroup,
      OperationCenterDeviceSollotStore,
      type,
      total,
      showForm
    } = this.props;
    return (
      <div className="search">
        <div className="search-form-left-popup-layout" />
        <h3>
          所有设备
          {type === 0 && `(${total})`}
          {showForm && (
            <Popover
              visible={this.state.visible}
              getPopupContainer={() =>
                document
                  .querySelector('.ant-tabs-tabpane-active')
                  .querySelector('.search-form-left-popup-layout')
              }
              placement="leftTop"
              trigger="click"
              content={
                <SearchFormLeft
                  data={OperationCenterDeviceSollotStore.allSearchData}
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
          )}
        </h3>
        <div />
      </div>
    );
  }
}

export default view;
