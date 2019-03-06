import React from 'react';
import { Modal, Input, Select, Checkbox } from 'antd';
import SreenChiose from '../SreenChiose';
import ModalFooter from '../../../BusinessComponent/ModalFooter';
import { ArrayFill } from '../../../../utils/Array';
import IconFont from '../../../../components/IconFont';
import { cloneDeep } from 'lodash';
import './index.scss';

export default class VideoLoopSetting extends React.Component {
  constructor(props) {
    super(props);
    const { currentScreen } = this.props;

    this.state = {
      currentScreen: currentScreen,
      interval: 10,
      unit: 1000,
      boxSetting: ArrayFill(currentScreen.num, { isLoop: true })
    };
  }
  selectSrceen = item => {
    let { boxSetting } = this.state;
    if (item.num !== boxSetting.length) {
      let arr = ArrayFill(item.num, { isLoop: true });
      boxSetting.map((item, index) => {
        arr[index] && (arr[index] = item);
      });
      this.setState({ currentScreen: item, boxSetting: arr });
    }
  };
  submitLoop = async () => {
    const { interval, currentScreen, unit, boxSetting } = this.state;
    const { startVideoLoop, loopListSize } = this.props;
    if (loopListSize < boxSetting.filter(v => v.isLoop).length) {
      let i = boxSetting.length;
      while (boxSetting.filter(v => v.isLoop).length > loopListSize) {
        boxSetting[i - 1].isLoop = false;
        i--;
      }
    } 
    startVideoLoop({
      loopInterval: interval * unit,
      loopScreen: currentScreen,
      loopVideoBox: cloneDeep(boxSetting)
    });
  };
  changeLoopBox = index => {
    let { boxSetting } = this.state;
    boxSetting[index].isLoop = !boxSetting[index].isLoop;
    this.setState({ boxSetting });
  };
  changeAllSelect = flag => {
    const { boxSetting } = this.state;
    boxSetting.forEach(item => {
      item.isLoop = !flag;
    });
    this.setState({ boxSetting });
  };
  render() {
    const { currentScreen, boxSetting, interval, unit } = this.state;
    const {
      showLoop,
      closeLoopSettingLayout,
      playerDatas,
      loopListSize
    } = this.props;
    const checkSize = boxSetting.filter(item => item.isLoop).length;
    return (
      <Modal
        className="video-loop-modal"
        width={772}
        footer={false}
        visible={showLoop}
        title={'轮巡设置'}
        onCancel={closeLoopSettingLayout}
      >
        <div className="video-loop-screen-popup-layout" />
        <div className="lx-set-content">
          <div className="form-part">
            <div className="form-item-part">
              <span className="label">时间间隔：</span>
              <Input
                type="number"
                onChange={e => this.setState({ interval: e.target.value })}
                value={interval}
              />
              <Select
                value={unit}
                onChange={val => this.setState({ unit: val })}
              >
                <Select.Option value={1000}>秒</Select.Option>
                <Select.Option value={60000}>分</Select.Option>
              </Select>

              <span className="label">窗口设置：</span>
              <SreenChiose
                currentScreen={currentScreen}
                selectSrceen={this.selectSrceen}
                getPopupContainer={() =>
                  document.querySelector('.video-loop-screen-popup-layout')
                }
              />
            </div>
            <span className="check-all-box">
              全部窗口可用：
              <Checkbox
                onChange={() =>
                  this.changeAllSelect(checkSize === boxSetting.length)
                }
                checked={checkSize === boxSetting.length}
                indeterminate={
                  checkSize !== 0 && checkSize !== boxSetting.length
                }
              />
            </span>
          </div>
          <div className="check-video-part">
            {boxSetting.map((item, index) => (
              <div
                className="video-item"
                key={index}
                style={{
                  width: currentScreen.size,
                  height: currentScreen.size
                }}
              >
                <Checkbox
                  checked={item.isLoop}
                  onChange={() => this.changeLoopBox(index)}
                >
                  <div className="video-content">
                    <div
                      className={`${playerDatas[index] &&
                        playerDatas[index].file &&
                        'has-video'}`}
                    >
                      {playerDatas[index] && playerDatas[index].file ? (
                        <React.Fragment>
                          <IconFont type="icon-_Video" />
                          <span>正在播放视频</span>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <IconFont type="icon-PlaySource" />
                          <span>空闲状态</span>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </Checkbox>
              </div>
            ))}
          </div>
          <ModalFooter
            onCancel={closeLoopSettingLayout}
            onOk={this.submitLoop}
            disabled={checkSize === 0 || loopListSize === 0}
          />
        </div>
      </Modal>
    );
  }
}
