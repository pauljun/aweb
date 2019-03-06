import React from 'react';
import moment from 'moment';
import { Popover } from 'antd';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import WaterMark from 'src/components/WaterMarkView';
import focus from '../../../../../../assets/img/community/RealPopulation/Follow_Yes_Main.svg';
import nofocus from '../../../../../../assets/img/community/RealPopulation/Follow_No_Main.svg';
import IconFont from '../../../../../../components/IconFont/index';

import './index.scss';
@BusinessProvider('UserStore')
export default class RegisButCard extends React.Component {
  handlePageJump = id => {
    this.props.handlePageJump(id);
  };
   /**处理标签数据为可用参数 */
   handleTagList = (id,data, type, e) => {
    let { tagList } = this.props.data;
    //this.props.getHandleTag(data);
    let details = { vid: id};
    if (tagList && tagList.length > 0) {
      let TopList = tagList
        .filter(v => v.tagType == 118600)
        .map(v => v.tagCode);
      let personValue =
        tagList.filter(v => v.tagType == 118600 && v.tagCode == 0)[0] &&
        tagList.filter(v => v.tagType == 118600 && v.tagCode == 0)[0].tagName;
      let bottomList = tagList
        .filter(v => v.tagType == 118700)
        .map(v => v.tagCode);
      let actionValue =
        tagList.filter(v => v.tagType == 118700 && v.tagCode == 0)[0] &&
        tagList.filter(v => v.tagType == 118700 && v.tagCode == 0)[0].tagName;
      this.props.handleTagModal(
        TopList,
        bottomList,
        personValue,
        actionValue,
        details,
        type,
        e
      );
      return;
    }
    this.props.handleTagModal([], [], '', '', details, type, e);
  };
  render() {
    const {
      recentTime,
      picUrl,
      recentAddress,
      appearNumForThreeDays,
      vid,
      tagList = [],
      focusType
    } = this.props.data || {};
    const index = tagList && tagList.findIndex(v => v.tagType == 118500);
    if (index > -1) {
      tagList && tagList.splice(index, 1);
    }
    let item = [],
      itemT = [];
    tagList &&
      tagList.map(v => {
        if (v.tagType == 118500) {
          return;
        }
        if (v.tagCode == 0 && v.tagName) {
          if (v.tagName.indexOf(';') > 0 || v.tagName.indexOf('；') > 0) {
            let arr = v.tagName.replace(/;/gi, '；').split('；');
            itemT = itemT.concat(arr);
          } else {
            itemT.push(v.tagName);
          }
        } else {
          item.push(v.tagName);
        }
      });
    let tagListAnother = itemT.concat(item).filter(v => v !== ''&&!!v) || [];
    const tagListHandle = tagListAnother.filter(v => !!v).slice(0, 3);
    return (
      <div
        className="card-design-community-another-unregistered"
        onClick={this.handlePageJump.bind(this, vid)}
      >
        <div className="card-design-top">
          <div className="card-design-top-left">
            <p>最近出现时间：</p>
            <p className="flow-value">
              {recentTime
                ? moment(parseInt(recentTime, 10)).format('YYYY.MM.DD HH:mm:ss')
                : ' '}
            </p>
            <p>最近出现地点：</p>
            <p
              className="flow-value"
              title={
                recentAddress && recentAddress.length > 10 ? recentAddress : ''
              }
            >
              {recentAddress
                ? recentAddress.length > 10
                  ? recentAddress.substring(0, 10) + '...'
                  : recentAddress
                : '  '}
            </p>
            <p>三天出现次数:</p>
            <p>{appearNumForThreeDays}</p>
            <p>虚拟身份号码：</p>
            <p className="flow-value">{vid ? vid : ''}</p>
          </div>
          <div className="card-design-top-right">
            <div
              className={`attention-handle ${
                focusType == 1 ? 'focusTrue' : ''
              }`}
              onClick={
                this.props.handleModalShow &&
                this.props.handleModalShow.bind(
                  this,
                  focusType == 1 ? true : false,
                  vid
                )
              }
            >
              <Popover
                overlayClassName={'attention_poppver'}
                placement="right"
                content={focusType ? '取消关注' : '添加关注'}
              >
                {focusType ? (
                  <img src={focus} alt="" />
                ) : (
                  <img src={nofocus} alt="" />
                )}
              </Popover>
            </div>
            <WaterMark key={vid} src={picUrl} type="face" />
          </div>
        </div>
        <div className="card-design-line" />
        <div className="circle-half">
        { tagListAnother.length>0&&<div className="tag-detail-draw">
            <div className="circle-detail">
              {tagListAnother.filter(v => !!v).map((v, i) => (
                <div className="circle-half-community-diff" key={i}>
                  {v}
                </div>
              ))}
            </div>
            <div
              className="bottom-click"
              onClick={
                tagListAnother.length != 0
                  ? this.handleTagList.bind(this, vid, tagListHandle, undefined)
                  : ''
              }
            >
              点击编辑标签
            </div>
          </div>}
          {tagListHandle &&
            tagListHandle.map((v, i) => (
              <div key={i} className="circle-half-community">
                {v && v.length > 4 ? v.substring(0, 4) + '...' : v}
              </div>
            ))}
          {tagListAnother.length > 3 && (
            <div className="circle-half-community-more" title="点击查看详情">
              ...
            </div>
          )}
            {tagListAnother.length == 0 && (
            <div
              className="add-tag"
              onClick={this.handleTagList.bind(
                this,
                vid,
                tagListHandle,
                undefined
              )}
              title="编辑标签"
            >
                <span>标签:</span>
              <div className="real-tag"><IconFont type={'icon-Zoom__Light'} theme="outlined" /></div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
