import React from 'react';
import { Modal } from 'antd';
import DetailIMM from '../../DetailsView/components/detailIMM';
import { BusinessProvider } from '../../../utils/Decorator/BusinessProvider';
import { goods, head, upperTexture, lowerTexture, upperColor, lowerColor } from 'src/libs/Dictionary';
import moment from 'moment';
import './index.scss';

@BusinessProvider('MoniteeAlarmsStore')
class MapDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      tags: {
        goodsw: '',
        headw: '',
        upperTexturew: '',
        lowerTexturew: '',
        upperColorw: '', 
        lowerColorw: ''
      }
    };
    this.init();
  }

  handleCancel = () => {
    this.props.onCancel && this.props.onCancel();
  }

  // imgIdType 1 人脸 2 人体
  init = () => {
    const { MoniteeAlarmsStore, data, imgType = 1 } = this.props;
    let option = {
      imgId: data.id,  
      imgIdType: imgType
    };
    MoniteeAlarmsStore.getCaptureDetailInfoById(option).then(res => {
      let data = {};
      if(imgType === 1) {
        try {
          data.id = res.faceStruts.id;
          data.address = res.faceStruts.address;
          data.cameraName = res.faceStruts.cameraName;
          data.cameraId = res.faceStruts.cameraId;
          data.faceTags = res.faceStruts.faceTags; // 人脸特征
          data.faceRect = res.faceStruts.faceRect;
          data.isFemale = res.faceStruts.isFemale;
          data.scenePath = res.faceStruts.scenePath;
          data.isMale = res.faceStruts.isMale;
          data.captureTime = res.faceStruts.captureTime;
          data.bodyTags = res.bodyStruts.bodyTags; // 人体特征
        } catch (e) {

        }
      } else {
        try {
          data.id = res.bodyStruts.id;
          data.address = res.bodyStruts.address;
          data.cameraId = res.bodyStruts.cameraId;
          data.cameraName = res.bodyStruts.cameraName;
          data.bodyTags = res.bodyStruts.bodyTags; // 人体特征
          data.faceRect = res.bodyStruts.bodyRect;
          data.isFemale = res.bodyStruts.isFemale;
          data.scenePath = res.bodyStruts.scenePath;
          data.isMale = res.bodyStruts.isMale;
          data.captureTime = res.bodyStruts.captureTime;
          data.faceTags = res.faceStruts.faceTags; // 人脸特征
        } catch (e) {

        }
      }
      this.setState({
        data
      }, () => {
        this.manyType();
      })
    })
  }

  manyType = ( ) => {
    let { data } = this.state;
    if(!data) {
      return
    }
    // imgType 1 人脸 2 人体
    try {
      let faceTags = [], bodyTags = [];
      if(data.faceTags) {
        faceTags = data.faceTags;
      } 
      if(data.bodyTags) {
        bodyTags = data.bodyTags;
      }
      let tags = faceTags.concat(bodyTags);
      let goodsw = this.typefilter(goods, tags);
      let headw = this.typefilter(head, tags);
      let upperTexturew = this.typefilter(upperTexture, tags);
      let lowerTexturew = this.typefilter(lowerTexture, tags);
      let upperColorw = this.typefilter(upperColor, tags);
      let lowerColorw = this.typefilter(lowerColor, tags);
      this.setState({
        tags: {
          goodsw,
          headw,
          upperTexturew,
          lowerTexturew,
          upperColorw, 
          lowerColorw
        }
      });
    } catch (e) {
      
    }

  }

  typefilter = (value, tags) => {
    return value.find(v => tags.find(item => item == v.value));
  }

  render() {
    let { visible, imgType, className='' } = this.props;
    let { data, tags } = this.state;
    let sex = '';
    if (Number(data.isMale) === 1) {
      sex = '男'
    } else if (Number(data.isFemale) === 1) {
      sex = '女'
    }
    return (
      <Modal
        visible={visible}
        onCancel={this.handleCancel}
        title="抓拍详情"
        footer={null}
        wrapClassName={`map_detail_modal ${className}`}
        centered
        width={1016}
      >
        <div className="map_detail_modal_header">
          <p className="header_p" title={data.address || '-'}><span className="header_span">抓拍地址：</span>{data.address || '-'}</p>
          <p className="header_p" title={tags.headw ? tags.headw.label : '-' }><span className="header_span">头部特征：</span>{tags.headw ? tags.headw.label : '-' }</p>
          <p className="header_p" title={tags.upperColorw ? tags.upperColorw.text : '-' }><span className="header_span">上衣颜色：</span>{tags.upperColorw ? tags.upperColorw.text : '-' }</p>
          <p className="header_p" title={tags.lowerColorw ? tags.lowerColorw.text : '-' }><span className="header_span">下衣颜色：</span>{tags.lowerColorw ? tags.lowerColorw.text : '-' }</p>
          <p className="header_p" title={1}><span className="header_span">抓拍时间：</span>{ data.captureTime ? moment( +data.captureTime).format('YYYY.MM.DD HH:mm:ss') : '-'}</p>
          <p className="header_p"><span className="header_span">随身物品：</span>{tags.goodsw ? tags.goodsw.label : '-' }</p>
          <p className="header_p"><span className="header_span">上衣纹理：</span>{tags.upperTexturew ? tags.upperTexturew.label : '-' }</p>
          <p className="header_p"><span className="header_span">下衣纹理：</span>{tags.lowerTexturew ? tags.lowerTexturew.label : '-' }</p>
          <p className="header_p"><span className="header_span">性别：</span>{sex || '-'}</p>
        </div>
        <div className="map_detail_modal_content">
        <DetailIMM
            data={data}
            type={imgType === 2 ? 'body' : 'face'}
            maptype={true}
            key={data.id}
					/>
        </div>
      </Modal>
    );
  }
}

export default MapDetailModal;
