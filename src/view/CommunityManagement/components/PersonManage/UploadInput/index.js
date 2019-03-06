import React from 'react';
import {observer} from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { Input, message } from 'antd';
import camsea from '../../../../../assets/img/community/RealPopulation/PhotoSearch_Dark.svg'
import search from '../../../../../assets/img/community/RealPopulation/Search_Light.svg';
import IconFont from 'src/components/IconFont';
import './index.scss';
@BusinessProvider(
  'CommunityDetailStore',
  'UserStore',
  'LongLivedStore',
  'FloatPersonStore'
)
@observer  
class UploadInputA extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }
  state = {
    imgUrl11: '',
    capShow: false,
    val: '',
    feature: '',
    file: ''
  };

  onDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    let df = e.dataTransfer.items[0];
    var file = df.getAsFile();
    this.upDataImgA(file);
  };

  upDataImgA = file => {
    this.props.changeImg && this.props.changeImg(true);
    const formData = new FormData();
    let token = this.props.UserStore.lyToken;
    const lyupload = window.webConfig.uploadDomain;
    formData.append('file', file);
    fetch(
      `${lyupload}upload2?size=${file &&
        file.size}&access_token=${token}&expiretype=0`,
      {
        method: 'POST',
        body: formData
      }
    )
      .then(response => response.json())
      .then(result => {
        let imgUrl1 = `${lyupload}files?obj_id=${
          result.obj_id
        }&access_token=${token}`;
        //this.props.handleYesImgUrl(imgUrl1)
        if (this.props.isCover) {
          this.props.LongLivedStore.editImgUrl(imgUrl1, this.props.Loadtype);
        } else {
          this.props.FloatPersonStore.editImgUrl(imgUrl1, this.props.Loadtype);
        }
        //this.setState({ imgUrl1 });
        this.getImgFeature(imgUrl1, 1);
      }).catch(e => {
        message.warn('图片结构化失败，请等待一段时间在重新上传')
      });
  };
  //提取图片特征
  getImgFeature = (imgUrl1, type) => {
    //type为1是url上传为2是base64上传
    let options = {
      score: 0.6
    };
    if (type === 2) {
      options.base64 = imgUrl1;
    } else {
      options.url = imgUrl1;
    }
    this.props.CommunityDetailStore.getFaceFeature(options).then(res => {
      if (res.imgsList.length > 0 && res.imgsList[0].face) {
        let feature = res.imgsList[0].face.feature;
        this.setState({
          feature: feature
        });
        let { val } = this.state.val;
        this.props.getFeatureB && this.props.getFeatureB(feature);
      } else {
        this.fileInput.current.input.value = '';
        message.warn('提取图片特征失败,请重新上传');
        //this.props.handleNoImgUrl(2);
        if (this.props.isCover) {
          this.props.LongLivedStore.deleteImgAndVal(this.props.Loadtype, 2);
        } else {
          this.props.FloatPersonStore.deleteImgAndVal(this.props.Loadtype, 2);
        }
        this.setState({
          //imgUrl1: '',
          capShow: false
        });
        this.props.deleteImg && this.props.deleteImg(true);
      }
    });
    this.props.changeImg && this.props.changeImg(false);
  };

  fileInputChangeA = e => {
    let file = e.target.files[0];
    this.upDataImgA(file);
  };
  onDragOver = e => {
    e.preventDefault();
  };

  onDragEnter = () => {};

  onDragLeave = () => {};

  onChange = e => {
    const { activeKey,Loadtype } = this.props;
    if (this.props.isCover) {
      this.props.LongLivedStore.editVal(e.target.value, Loadtype);
    } else {
      this.props.FloatPersonStore.editVal(e.target.value, Loadtype);
    }
    //this.props.handleVal(e.target.value)
    /*  this.setState({
      val: e.target.value
    }); */
    // this.props.getInputValueB(e.target.value)
  };
  deleteImg = () => {
    // this.props.handleNoImgUrl(1)
    if (this.props.isCover) {
      this.props.LongLivedStore.deleteImgAndVal(this.props.Loadtype, 1);
    } else {
      this.props.FloatPersonStore.deleteImgAndVal(this.props.Loadtype, 1);
    }
    this.setState({
      //imgUrl1: '',
      feature: '',
      capShow: false
    });
    this.fileInput.current.input.value = '';
    this.props.deleteImgB && this.props.deleteImgB();
  };
  edit = () => {
    this.setState({
      capShow: true
    });
  };
  captureCb = src => {
    //this.props.handleYesImgUrl(src)
    if (this.props.isCover) {
      this.props.LongLivedStore.editImgUrl(src, this.props.Loadtype);
    } else {
      this.props.FloatPersonStore.editImgUrl(src, this.props.Loadtype);
    }
    this.setState({
      //imgUrl1: src,
      capShow: false
    });
    this.getImgFeature(src, 2);
  };
  //调用父组件模糊搜索函数，然后渲染页面，明天来要注意
  search = () => {
    let { feature, val } = this.state;
    this.props.searchB && this.props.searchB(val, feature);
    this.setState({
      capShow: false
    });
  };
  close = () => {
    this.setState({
      capShow: false
    });
  };
  render() {
    let { capShow } = this.state;
    let { imgurlA, valA } = this.props.isCover
      ? this.props.LongLivedStore
      : this.props.FloatPersonStore;
    const { activeKey } = this.props;
    return (
      <div className="upload-input-view-people">
        <div className="upload-input-box">
          <Input
            onDrop={this.onDrop}
            onPressEnter={this.search}
            onDragLeave={this.onDragLeave}
            onDragOver={this.onDragOver}
            onChange={this.onChange}
            value={valA}
            style={imgurlA ? { paddingLeft: '40px' } : {}}
            className="upload-input"
            placeholder="请输入关键字搜索"
          />
          <div className="delete-pic-input">
            {(valA || imgurlA) && (
              <IconFont
                onClick={this.deleteImg}
                type={'icon-Close_Main1'}
                theme="outlined"
                style={{ fontSize: '16px' }}
              />
            )}
          </div>
          <div className="camera-btn">
            <label htmlFor="upDate1">
              <Input
                type="file"
                ref={this.fileInput}
                accept="image/*"
                id="upDate1"
                onChange={this.fileInputChangeA}
                style={{ visibility: 'hidden', position: 'fixed' }}
              />
              {!imgurlA && <img src={camsea} alt="" />}
            </label>
          </div>
          {/* <div className="line"></div> */}
          <div className="search-btn" onClick={this.search}>
            <img src={search} alt="" />
          </div>
          {imgurlA && (
            <div className="img-view-another">
              <div className="img-box">
                <img src={imgurlA} alt="" />
                {/*  <div className="edit-view" onClick={this.edit}>
                  <Icon type="edit" />
                </div> */}
              </div>
              {/* <div className="delete-btn">
                <Icon onClick={this.deleteImg} type="close" />
              </div> */}
            </div>
          )}
          {/* capShow && (
            <div className="capture-view-box">
              <div className="close-view">
                <Icon onClick={this.close} type="close-circle-o" />
              </div>
              <p>请框选图片中要识别的区域</p>
              <div className="capview">
                <CaptureViewPlus
                  options={{
                    capture: true,
                    init: true,
                    urlSrc: imgUrl1,
                    captureCb: this.captureCb
                  }}
                />
              </div>
            </div>
          ) */}
        </div>
      </div>
    );
  }
}

export default UploadInputA;
