import React from 'react';
import moment from 'moment';
import WaterMark from 'src/components/WaterMarkView';
import { Popover, message, Drawer } from 'antd';
import IconFont from '../../../../../components/IconFont/index';
import { getKeyValue } from '../../../../../libs/Dictionary';
import focus from '../../../../../assets/img/community/RealPopulation/Follow_Yes_Main.svg';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import nofocus from '../../../../../assets/img/community/RealPopulation/Follow_No_Main.svg';

import './index.scss';

@BusinessProvider('UserStore')
export default class CommunityCard extends React.Component {
  state = {
    popshow: false
  };
  handlePageJump = id => {
    this.props.handlePageJump(id);
  };
  /**处理标签数据为可用参数 */
  handleTagList = (id, name, data, type, e) => {
    let { tagList } = this.props.data;
    let details = { id: id, name: name };
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
  handleFuVisible = type => {
    if (type) {
      return;
    }
    this.setState({
      popshow: true
    });
  };
  handleFuHidden = type => {
    if (type) {
      return;
    }
    this.setState({
      popshow: false
    });
  };
  render() {
    const {
      name,
      credentialNo,
      presentAddress,
      id,
      portraitPicUrl,
      gender,
      birthDate,
      recentAddress,
      appearTimesForThreeDays,
      recentTime,
      nation,
      picUrl,
      tagList,
      focusType
    } = this.props.data;
    let { type } = this.props;
    let imgUrl=portraitPicUrl?portraitPicUrl:(picUrl&&picUrl.length>0?picUrl[0]:null)
    /**中英文分号分隔标签处理 */
    let item = [],
      itemT = [];
    tagList &&
      tagList.map(v => {
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
    let tagListHandle = tagListAnother.filter(v => !!v).slice(0, 3);
    return (
      <div
        className={` card-design-community ${type == 1 ? 'diffheight' : ''}`}
        onClick={this.handlePageJump.bind(this, id)}
      >
        <div className="card-design-top">
          <div className="card-design-top-left">
            <p>{name}</p>
            <p>
              <span>性别：</span>
              {getKeyValue('sex', gender)}
            </p>
            <p>
              <span>民族：</span>
              {getKeyValue('nation', nation)}
            </p>
            <p>
              <span>出生日期：</span>
              {birthDate? moment(parseInt(birthDate, 10)).format('YYYY.MM.DD '): ''}
            </p>
            <p
              title={presentAddress && presentAddress.length > 20? presentAddress: ''}
            >
              <span>地址：</span>
              {presentAddress && presentAddress.length > 20
                ? presentAddress.substring(0, 20) + '...'
                : presentAddress}
            </p>
            <p>
              <span>身份证：</span>
              {credentialNo}
            </p>
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
                  id
                )
              }
            >
              <Popover
                overlayClassName={'attention_poppver'}
                placement="right"
                content={focusType ? '取消关注' : '添加关注'}
              >
                {focusType ? (
                  <img src={focus}/>
                ) : (
                  <img src={nofocus}/>
                )}
              </Popover>
            </div>
            <WaterMark src={imgUrl} type="face" />
          </div>
        </div>
        {type != 1 && (
          <React.Fragment>
            <div className="card-design-line" />
            <div className="card-design-bottom">
              <p>
                <span>最近出现时间：</span>
                {recentTime
                  ? moment(parseInt(recentTime, 10)).format(
                      'YYYY.MM.DD HH:mm:ss'
                    )
                  : ''}
              </p>
              <p
                title={
                  recentAddress && recentAddress.length > 15
                    ? recentAddress
                    : ''
                }
              >
                <span>最近出现地点：</span>
                {recentAddress
                  ? recentAddress && recentAddress.length > 15
                    ? recentAddress.substring(0, 15) + '...'
                    : recentAddress
                  : ''}
              </p>
              <p>
                <span>三天出现次数：</span>
                {appearTimesForThreeDays}
              </p>
            </div>
          </React.Fragment>
        )}
        <div className="card-design-line-anoter" />
        <div
          className="circle-half"
        >
          {tagListAnother.length > 0 && (
            <div className="pop-hover-detail">
              <div className="circle-detail">
                {tagListAnother.filter(v => !!v).map((v, i) => (
                  <div className="circle-half-community-diff" key={i}>
                    {v}
                  </div>
                ))}
              </div>
              <div
                className="bottom-click"
                onClick={this.handleTagList.bind(
                  this,
                  id,
                  name,
                  tagListHandle,
                  undefined
                )}
              >
                点击编辑标签
              </div>
            </div>
          )}
          {tagListHandle.map((v, i) => (
            <div
              className="circle-half-community"
              key={i}
              title={v && v.length > 4 ? v : ''}
            >
              {v ? (v.length > 4 ? v.substring(0, 4) + '...' : v) : '空'}
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
                id,
                name,
                tagListHandle,
                undefined
              )}
              title="编辑标签"
            >
              <span>标签:</span>
              <div className="real-tag">
                <IconFont type={'icon-Zoom__Light'} theme="outlined" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
