import React from 'react';
import { Select, Radio, Popover, Button } from 'antd';
import RangePicker from '../../../../../components/RangePicker/index';
import moment from 'moment';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { observer } from 'mobx-react';
import './alarmHeaderFilter.scss';

const Option = Select.Option;
@BusinessProvider('LongLivedStore', 'FloatPersonStore')
@observer
class AlarmHeaderFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateBegin: undefined,
      dateEnd: undefined,
      showDate: false,
      SpopHoverType: false,
      popShow: false,
      minDate: moment(new Date()).valueOf() - 2592000000
    };
  }
  // 标签筛选
  handleTagSort = value => {
    const {
      LongLivedStore,
      onTypeChange,
      activeKey,
      FloatPersonStore
    } = this.props;
    if (value == '') {
      LongLivedStore.editSearchData({ page: 1, tagCodes: [] }, activeKey);
      FloatPersonStore.editSearchData({ page: 1, tagCodes: [] }, activeKey);
      onTypeChange();
      return;
    }
    LongLivedStore.editSearchData({ page: 1, tagCodes: [value] }, activeKey);
    FloatPersonStore.editSearchData({ page: 1, tagCodes: [value] }, activeKey);
    onTypeChange();
  };
  /**时间筛选 */
  chooseTime = (activeKey, e) => {
    let { onTypeChange, LongLivedStore, FloatPersonStore } = this.props;
    let value = e.target.value;
    if (value == 2) {
      this.props.handlePopShow(true);
      return;
    } else {
      this.props.handlePopShow(false);
      this.setState({
        dateBegin: null,
        dateEnd: null
      });
    }
    LongLivedStore.editSearchData(
      {
        startTime: undefined,
        endTime: undefined,
        page: 1,
        peroidType: value - 0
      },
      activeKey
    );
    FloatPersonStore.editSearchData(
      {
        startTime: undefined,
        endTime: undefined,
        page: 1,
        peroidType: value - 0
      },
      activeKey
    );
    onTypeChange();
  };
  timeChange = (type, value) => {
    let { LongLivedStore, activeKey, FloatPersonStore } = this.props;
    let { dateBegin } = this.state;
    let startTime = dateBegin;
    let endTime = null;
    if (type === 'startTime') {
      startTime = value;
      this.setState({ dateBegin: startTime });
    } else {
      endTime = value;
      this.setState({ dateEnd: endTime });
    }
    if (endTime === null) {
      endTime = moment(new Date()).valueOf();
    }
    LongLivedStore.editSearchData(
      { page: 1, peroidType: -1, endTime: endTime, startTime: startTime },
      activeKey
    );
    FloatPersonStore.editSearchData(
      { page: 1, peroidType: -1, endTime: endTime, startTime: startTime },
      activeKey
    );
  };
  popSubmit = () => {
    const { onTypeChange } = this.props;
    onTypeChange();
    this.setState({
      popShow: false
    });
  };
  popCancel = () => {
    this.setState({
      popShow: false
    });
  };
  popChange = () => {
    this.setState({
      popShow: true
    });
  };
  handleTypeChange = value => {
    let {
      activeKey,
      LongLivedStore,
      onTypeChange,
      FloatPersonStore
    } = this.props;
    LongLivedStore.editSearchData({ sortType: value, page: 1 }, activeKey);
    FloatPersonStore.editSearchData({ sortType: value, page: 1 }, activeKey);
    onTypeChange();
  };
  handleFocuSearch = value => {
    let {
      activeKey,
      LongLivedStore,
      FloatPersonStore,
      onTypeChange
    } = this.props;
    LongLivedStore.editSearchData({ focusType: value, page: 1 }, activeKey);
    FloatPersonStore.editSearchData({ focusType: value, page: 1 }, activeKey);
    onTypeChange();
  };
  render() {
    let { dateBegin, dateEnd, popShow, minDate } = this.state;
    let { activeKey, id, popOne, popTwo, type, showSelsect } = this.props;
    let SpopHoverType = activeKey == 1 ? popOne : popTwo;
    return (
      <div className="community-another-alarm_header_filter">
        <Select
          key={id}
          dropdownClassName="header_filter_select_time_downwrap"
          className="header_filter_time_select"
          style={{ width: 148 }}
          onChange={this.handleTagSort}
          defaultValue={''}
        >
          <Option value={''}>全部标签</Option>
          <Option value={'118602'}>空巢老人</Option>
          <Option value={'118701'}>昼伏夜出</Option>
          <Option value={'118604'}>快递</Option>
          <Option value={'118601'}>外卖</Option>
          <Option value={'118702'}>早出晚归</Option>
          <Option value={'118703'}>足不出户</Option>
          <Option value={'118603'}>工作人员</Option>
          <Option value={'0'}>其他</Option>
        </Select>
        {!showSelsect && (
          <Select
            key={id + 1}
            dropdownClassName="header_filter_select_type_downwrap"
            className="header_filter_type_select"
            style={{ width: 110 }}
            onChange={this.handleTypeChange}
            defaultValue={0}
          >
            <Option value={0}>抓拍次数排序</Option>
            {(activeKey == 1 || type == 1) && (
              <Option value={1}>最后抓拍时间排序</Option>
            )}
            {type != 1 && <Option value={2}>姓名排序</Option>}
          </Select>
        )}
        <Select
          key={id + 2}
          dropdownClassName="header_filter_select_type_downwrap"
          className="header_filter_type_select anotherwidth"
          style={{ width: '100px !important' }}
          onChange={this.handleFocuSearch}
          defaultValue={null}
        >
          <Option value={null}>全部</Option>
          <Option value={1}>已关注</Option>
          <Option value={0}>未关注</Option>
        </Select>
        {!showSelsect && (
          <Radio.Group
            className="header_filter_radio"
            defaultValue={0}
            buttonStyle="solid"
            onChange={this.chooseTime.bind(this, activeKey)}
          >
            <Radio value={0}>不限</Radio>
            <Radio value={1}>24小时</Radio>
            <Radio value={3}>3天</Radio>
            <Radio value={7}>一周</Radio>
            {SpopHoverType ? (
              <Popover
                overlayClassName={'radio_poppver'}
                defaultVisible={true}
                content={
                  <div>
                    <RangePicker
                      onChange={this.timeChange}
                      startTime={dateBegin}
                      endTime={dateEnd}
                      minDate={minDate}
                    />
                    <div className="pop_btn">
                      <Button onClick={this.popCancel}>取消</Button>
                      <Button onClick={this.popSubmit} type="primary">
                        确定
                      </Button>
                    </div>
                  </div>
                }
                trigger="hover"
                placement="bottom"
                visible={popShow}
              >
                <span onClick={this.popChange}>
                  <Radio value={2}>自定义</Radio>
                </span>
              </Popover>
            ) : (
              <span onClick={this.popChange}>
                <Radio value={2}>自定义</Radio>
              </span>
            )}
          </Radio.Group>
        )}
      </div>
    );
  }   
}

export default AlarmHeaderFilter;
