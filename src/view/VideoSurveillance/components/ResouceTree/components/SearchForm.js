import React from 'react';
import { Input, Select } from 'antd';
import IconFont from '../../../../../components/IconFont';
import { CameraAndSoldierType, DeviceState } from '../../../../../libs/DeviceLib';
const Option = Select.Option;

export default class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.form = {
      keyword: null,
      status: null,
      type: null
    };
  }
  timer = null;
  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }
  changeStatus = value => {
    this.form.status = value;
    this.props.changeForm && this.props.changeForm(this.form);
  };
  changeType = value => {
    this.form.type = value;
    this.props.changeForm && this.props.changeForm(this.form);
  };
  changeKeyword = event => {
    clearTimeout(this.timer);
    let value = event.target.value;
    this.form.keyword = value;
    this.forceUpdate();
    this.timer = setTimeout(() => {
      this.props.changeForm && this.props.changeForm(this.form);
    }, 500);
  };
  clearKeyword = () => {
    clearTimeout(this.timer);
    this.form.keyword = null;
    this.props.changeForm && this.props.changeForm(this.form);
    this.forceUpdate();
  };
  render() {
    const { keyword } = this.form;
    return (
      <div className="form-search">
        <div className="search-keyword">
          <Input
            prefix={
              <IconFont type="icon-Search_Light" style={{ color: '#999' }} />
            }
            suffix={
              keyword && (
                <IconFont
                  type="icon-YesorNo_No_Dark"
                  onClick={this.clearKeyword}
                  style={{ color: '#999', fontSize: 12, cursor: 'pointer' }}
                />
              )
            }
            placeholder="请输入要搜索的摄像机信息"
            value={keyword}
            onChange={this.changeKeyword}
          />
        </div>
        <div className="search-type">
          <Select
            getPopupContainer={() => document.querySelector('.search-type')}
            allowClear={true}
            placeholder={'全部状态'}
            onChange={this.changeStatus}
          >
            {DeviceState.map(item => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
          <Select
           getPopupContainer={() => document.querySelector('.search-type')}
            allowClear={true}
            placeholder={'全部类型'}
            onChange={this.changeType}
          >
            {CameraAndSoldierType.map(item => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    );
  }
}
