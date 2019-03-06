import React from 'react';
import { Select, Radio, Popover, Button } from 'antd';
import RangePicker from '../../../../../components/RangePicker';
import { stopPropagation } from '../../../../../utils';
import moment from 'moment';

import './alarmHeaderFilter.scss';

const Option = Select.Option;

class AlarmHeaderFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateBegin: null,
      dateEnd: moment().valueOf(),
      maxDate: false,
      minDate: false,
      showDate: false,
      popHoverType: false,
      popShow: false,
      option: {},
      sitesValue: []
		};
		this.refTime = React.createRef();
  }

  // 时间筛选
  handleTimeSort = value => {
    this.props.onTypeChange({ sortType: parseInt(value, 10) });
  };

  // 类别筛选
  handleTypeChange = value => {
    if (value === 'null') {
      value = null;
    }
    this.props.onTypeChange({ page: 1, alarmOperationType: value });
  };

  //场所筛选
  handleHomeChange = value => {
    let arr = [
      102401,
      102402,
      102403,
      102404,
      102405,
      102406,
      102407,
      102408,
      102409
    ];
    if(value.indexOf(102400) > -1) {
      let data = [];
      this.props.onTypeChange({
        page: 1,
        installationSites: data,
        noInstallationSites: undefined
      });
      value = [102400];
    } else {
      if (value.indexOf(102409) > -1) {
        arr = arr.filter(v => value.indexOf(v) === -1);
        this.props.onTypeChange({
          page: 1,
          noInstallationSites: arr,
          installationSites: undefined
        });
      } else {
        this.props.onTypeChange({
          page: 1,
          installationSites: value,
          noInstallationSites: undefined
        });
      }
    }
    this.setState({
      sitesValue: value
    })
  };

  chooseTime = e => {
    let { onTypeChange } = this.props;
    let value = e.target.value;
    if (value == 'null') {
      value = null;
    }
    let option = {};
    if (value != 2) {
      if (value === null) {
        this.setState({
          showDate: false,
          dateBegin: undefined,
          dateEnd: moment().valueOf()
        });
      } else {
        this.setState({
          showDate: false,
          dateBegin: moment()
            .subtract(value || 0, 'days')
            .valueOf(),
          dateEnd: moment().valueOf()
        });
      }
      option.page = 1;
      option.timeType = value;
      onTypeChange(option);
      this.setState({
        popHoverType: false
      });
    } else {
      this.props.setStoreSeacrhData({ timeType: 2 });
      this.setState({
        popHoverType: true
      });
    }
  };

  timeChange = (type, value) => {
    let { searchData } = this.props;
    let { dateBegin } = this.state;
    let startTime = dateBegin,
      endTime = undefined,
      maxDate = undefined,
      minDate = undefined;
    if (type === 'startTime') {
      startTime = value;
      maxDate = value + 2592000000;
      this.setState({ dateBegin: startTime, maxDate });
    } else {
      endTime = value;
      minDate = value - 2592000000;
      this.setState({ dateEnd: endTime, minDate });
    }
    if (type === 'startTime' && endTime === undefined) {
      endTime = moment(new Date()).valueOf();
    }
    let option = searchData;
    option.endTime = endTime;
    option.startTime = startTime;
    this.setState({
      option
    });
  };

  popSubmit = () => {
    let { searchData } = this.props;
    let { dateBegin, dateEnd } = this.state;
    let option = searchData;
    option.endTime = dateEnd;
    option.startTime = dateBegin;
    this.props.onTypeChange(option);
    this.setState({
      popHoverType: false
    });
  };

  popCancel = () => {
    this.setState({
      popHoverType: false
    });
  };

  popClick = (e) => {
		stopPropagation(e);
    let { searchData } = this.props;
    if(searchData.timeType === 2) {
      this.setState({
        popHoverType: !this.state.popHoverType
      })
    }
  }

  render() {
    let {
      dateBegin,
      dateEnd,
      popHoverType,
      maxDate,
      minDate,
      sitesValue
    } = this.state;
    let { searchData, libType } = this.props;
    return (
      <div className="alarm_header_filter">
        <div className="time-piack-layout" ref={this.refTime}/>
        {libType !== 2 && libType !== 3 && (
          <Select
            dropdownClassName="header_filter_select_time_downwrap"
            className="header_filter_time_select"
            style={{ width: 134 }}
            value={searchData.sortType}
            onChange={this.handleTimeSort}
            defaultValue={1}
          >
            <Option value={1}>按时间排序</Option>
            <Option value={2}>按相似度排序</Option>
          </Select>
        )}
        {libType !== 4 && (
          <Select
            dropdownClassName="header_filter_select_type_downwrap"
            className="header_filter_type_select"
            style={{ width: 110 }}
            value={
              searchData.alarmOperationType === null
                ? 'null'
                : searchData.alarmOperationType == 1
                ? '1'
                : searchData.alarmOperationType == 2
                ? '2'
                : searchData.alarmOperationType == 3
                ? '3'
                : '4'
            }
            onChange={this.handleTypeChange}
            defaultValue={'null'}
          >
            <Option value={'null'}>
              全部状态
            </Option>
            <Option value="1">
              已处理
            </Option>
            <Option value="2">
              未处理
            </Option>
            <Option value="3">
              有效
            </Option>
            <Option value="4">
              无效
            </Option>
          </Select>
        )}
        <Select
          dropdownClassName="header_filter_select_type_downwrap"
          className="header_filter_home_select"
          style={{ width: 120 }}
          onChange={this.handleHomeChange}
          // defaultValue={null}
          value={sitesValue}
          placeholder="场所筛选"
          mode="multiple"
        >
          <Option value={102400}>全部场所</Option>
          <Option disabled={sitesValue.indexOf(102400) > -1} value={102401}>社区</Option>
          <Option disabled={sitesValue.indexOf(102400) > -1} value={102402}>网吧</Option>
          <Option disabled={sitesValue.indexOf(102400) > -1} value={102403}>酒店</Option>
          <Option disabled={sitesValue.indexOf(102400) > -1} value={102404}>餐厅</Option>
          <Option disabled={sitesValue.indexOf(102400) > -1} value={102405}>商场</Option>
          <Option disabled={sitesValue.indexOf(102400) > -1} value={102406}>重点区域</Option>
          <Option disabled={sitesValue.indexOf(102400) > -1} value={102407}>重点商铺</Option>
          <Option disabled={sitesValue.indexOf(102400) > -1} value={102408}>停车棚</Option>
          <Option disabled={sitesValue.indexOf(102400) > -1} value={102409}>其他</Option>
        </Select>
        <Radio.Group
          className="header_filter_radio"
          defaultValue={'null'}
          value={searchData.timeType === null ? 'null' : searchData.timeType}
          buttonStyle="solid"
          onChange={this.chooseTime}
        >
          <Radio value={'null'}>不限</Radio>
          <Radio value={1}>24小时</Radio>
          <Radio value={3}>3天</Radio>
          <Radio value={7}>7天</Radio>
          <Popover
            overlayClassName={'radio_poppver'}
						getPopupContainer={() => this.refTime.current }
            content={
              <div>
                <RangePicker
                  onChange={this.timeChange}
                  startTime={dateBegin}
                  endTime={dateEnd}
                  maxDate={libType !==3 ? false : true}
                  minDate={libType !==3 ? false : -30}
                  allowClear={false}
                  // maxDate={libType !==3 ? maxDate : true}
                  // minDate={libType !==3 ? minDate : -30}
                />
                <div className="pop_btn">
                  <Button onClick={this.popCancel}>取消</Button>
                  <Button onClick={this.popSubmit} type="primary">
                    确定
                  </Button>
                </div>
              </div>
            }
            placement="bottom"
            visible={popHoverType}
          >
            <span >
              <Radio onClick={this.popClick} value={2}>自定义</Radio>
            </span>
          </Popover>
        </Radio.Group>
      </div>
    );
  }
}

export default AlarmHeaderFilter;
