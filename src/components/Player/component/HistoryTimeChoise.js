import React from 'react';
import { DatePicker, Button, Icon, message, Modal } from 'antd';
import { stopPropagation } from '../../../utils';
import moment from 'moment';
import '../style/history-chiose-popup.scss';

const deviationTimetemp = 10 * 1000;

const defaultEndTimetemp = 60 * 60 * 1000;

const MAX_DOWNLOAD_GAP = 3;
const MAX_HISTORY_GAP = 7;

export default class HistoryTimeChoise extends React.Component {
  constructor(props) {
    super(props);
    const endTime = moment().subtract(10, 'seconds');
    const startTime = moment(endTime).subtract(1, 'hour');
    this.state = {
      startTime,
      endTime,
      disabled: false
    };
  }
  onStartChange = value => {
    const { endTime } = this.state;
    let disabled = false;
    if (value.valueOf() > endTime.valueOf()) {
      disabled = true;
    }
    this.setState({
      startTime: value,
      disabled
    });
  };
  onEndChange = value => {
    const { startTime } = this.state;
    let disabled = false;
    if (value.valueOf() < startTime.valueOf()) {
      disabled = true;
    }
    this.setState({
      endTime: value,
      disabled
    });
  };
  onSubmit(event) {
    stopPropagation(event);
    const { eventType } = this.props;
    const { startTime, endTime } = this.state;
    const stringStartTime = startTime.format('X');
    const stringEndTime = endTime.format('X');
    if (
      eventType === 'history' &&
      stringEndTime - stringStartTime > 3600 * 24 * MAX_HISTORY_GAP
    ) {
      return message.error(`历史视频查看不能超过${MAX_HISTORY_GAP}天`);
    }
    if (
      eventType === 'download' &&
      stringEndTime - stringStartTime > 3600 * 24 * MAX_DOWNLOAD_GAP
    ) {
      return message.error(`最大下载时间不能超过${MAX_DOWNLOAD_GAP}天`);
    }
    const { close, onSelectTime } = this.props;
    onSelectTime &&
      onSelectTime({
        isLiving: false,
        startTime: stringStartTime,
        endTime: stringEndTime
      });
    close();
  }
  componentWillMount() {
    const { timeRange } = this.props;
    if (timeRange) {
      this.setState({
        startTime: moment(timeRange.startTime),
        endTime: moment(timeRange.endTime)
      });
    }
  }
  render() {
    const { startTime, endTime, disabled } = this.state;
    const { close } = this.props;
    return (
      <Modal visible={true} footer={false} width={320} title={false} closable={false} className="play-choise-time">
        <div className="history-chiose-popup">
          <div className="title-part">
            选择时间段
            <span>
              <Icon type="close" onClick={() => close()} />
            </span>
          </div>
          <div className="content-part">
            <div className="item-part">
              <span className="item-lable">开始时间：</span>
              <DatePicker
                name="startPicker"
                ref="video-datepicker"
                style={{ width: '230px', marginRight: '10px' }}
                allowClear={false}
                showTime
                hideDisabledOptions={true}
                format="YYYY.MM.DD HH:mm:ss"
                value={startTime}
                onChange={this.onStartChange}
              />
            </div>
            <div className="item-part">
              <span className="item-lable">结束时间：</span>
              <DatePicker
                name="startPicker"
                ref="video-datepicker"
                style={{ width: '230px', marginRight: '10px' }}
                allowClear={false}
                showTime
                hideDisabledOptions={true}
                format="YYYY.MM.DD HH:mm:ss"
                value={endTime}
                onChange={this.onEndChange}
              />
            </div>
          </div>
          <div className="foot-part">
            <Button onClick={() => close()}>取消</Button>
            <Button
              type="primary"
              disabled={disabled}
              onClick={event => this.onSubmit(event)}
            >
              确定
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
