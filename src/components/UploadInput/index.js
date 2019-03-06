import React from 'react';
import { observer } from 'mobx-react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { Input, message,Spin } from 'antd';
import search from '../../assets/img/community/RealPopulation/Search_Light.svg';
import camsea from '../../assets/img/community/RealPopulation/PhotoSearch_Dark.svg'
import IconFont from 'src/components/IconFont';
import './index.scss';
@BusinessProvider('CommunityDetailStore', 'UserStore','LongLivedStore','FloatPersonStore')
@observer
class UploadInput extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }
  state = {
    imgUrl: '',
    capShow: false,
    val: '',
    feature: '',
    file: '',
    loading:false
  };

  onDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    let df = e.dataTransfer.items[0];
    var file = df.getAsFile();
    this.upDataImg(file);
  };

  upDataImg = file => {
    this.props.changeImg && this.props.changeImg(true);
    const formData = new FormData();
    let token = this.props.UserStore.lyToken;
    const lyupload = window.webConfig.uploadDomain;
    formData.append('file', file);
    fetch(
      `${lyupload}upload2?size=${file&&file.size}&access_token=${token}&expiretype=2`,
      {
        method: 'POST',
        body: formData
      }
    )
      .then(response => response.json())
      .then(result => {
        let imgUrl = `${lyupload}files?obj_id=${
          result.obj_id
        }&access_token=${token}`;
        //this.setState({ imgUrl });
        this.getImgFeature(imgUrl, 1);
        //this.props.handleYesImgUrl(imgUrl)
         this.setState({
          loading:false
        })
        if (this.props.isCover) {
          this.props.LongLivedStore.editImgUrl(imgUrl, this.props.Loadtype);
        } else {
          this.props.FloatPersonStore.editImgUrl(imgUrl, this.props.Loadtype);
        }
      }).catch(e => {
        message.warn('图片结构化失败，请刷新或等待一段时间后再上传')
        this.setState({
          loading:false
        })
      });
  };
  //提取图片特征
  getImgFeature = (imgUrl, type) => {
    //type为1是url上传为2是base64上传
    let options = {
      score: 0.6
    };
    //this.props.handleYesImgUrl(imgUrl)
    if (type === 2) {
      options.base64 = imgUrl;
    } else {
      options.url = imgUrl;
    }
    this.props.CommunityDetailStore.getFaceFeature(options).then(res => {
      if (res.imgsList.length > 0 && res.imgsList[0].face) {
        let feature = res.imgsList[0].face.feature;
        this.setState({
          feature: feature
        });
        let { val } = this.state.val;
        this.props.getFeature && this.props.getFeature(feature);
      } else {
        this.fileInput.current.input.value = '';
        message.warn('提取图片特征失败,请重新上传');
       // this.props.handleNoImgUrl(2);
       if(this.props.isCover)
      { this.props.LongLivedStore.deleteImgAndVal(this.props.Loadtype,2) }
      else {
        this.props.FloatPersonStore.deleteImgAndVal(this.props.Loadtype,2)
      }
        this.setState({
          //imgUrl: '',
          capShow: false
        });
        this.props.deleteImg && this.props.deleteImg(true);
      }
    });
    this.props.changeImg && this.props.changeImg(false);
  };

  fileInputChange = e => {
    this.setState({
      loading:true
    })
    let file = e.target.files[0];
    this.upDataImg(file);
  };
  onDragOver = e => {
    e.preventDefault();
  };

  onDragEnter = () => {};

  onDragLeave = () => {};

  onChange = e => {
    if(this.props.isCover)
    {this.props.LongLivedStore.editVal(e.target.value,this.props.Loadtype)}
    else {
      this.props.FloatPersonStore.editVal(e.target.value,this.props.Loadtype)
    }
    //this.props.handleVal(e.target.value)
    /* this.setState({
      val: e.target.value
    }); */
    //this.props.getInputValue(e.target.value);
  };
  deleteImg = () => {
    //this.props.handleNoImgUrl(1)
    if(this.props.isCover)
    {this.props.LongLivedStore.deleteImgAndVal(this.props.Loadtype,1)}
    else {
      this.props.FloatPersonStore.deleteImgAndVal(this.props.Loadtype,1)
    }
    this.setState({
      //imgUrl: '',
      feature: '',
      capShow: false,
      //val:''
    });
    this.fileInput.current.input.value = '';
    this.props.deleteImg && this.props.deleteImg();
  };
  edit = () => {
    this.setState({
      capShow: true
    });
  };
  captureCb = src => {
    //this.props.handleYesImgUrl(src);
    if(this.props.isCover)
    {this.props.LongLivedStore.editImgUrl(src,this.props.Loadtype)}
    else {
      this.props.FloatPersonStore.editImgUrl(src,this.props.Loadtype)
    }
    this.setState({
      //imgUrl: src,
      capShow: false
    });
    this.getImgFeature(src, 2);
  };
  search = () => {
    let { feature, val } = this.state;
    this.props.search && this.props.search(val, feature);
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
    let {Loadtype}=this.props;
    let {imgurl,val,imgurlA,valA}=this.props.isCover?this.props.LongLivedStore:this.props.FloatPersonStore;
    let RealImgurl=Loadtype==1?imgurl:imgurlA;
    let RealVal=Loadtype==1?val:valA;
    return (
      <div className="upload-input-view">
        <div className="upload-input-box">
          <Input
            onDrop={this.onDrop}
            onPressEnter={this.search}
            onDragLeave={this.onDragLeave}
            onDragOver={this.onDragOver}
            onChange={this.onChange}
            value={RealVal}
            style={RealImgurl ? { paddingLeft: '40px' } : {}}
            className="upload-input"
            placeholder="请输入关键字搜索"
          />
          <div className="delete-pic-input">
            {(RealVal || RealImgurl)&& (
              <IconFont
              onClick={this.deleteImg}
                type={'icon-Close_Main1'}
                theme="outlined"
                style={{ fontSize: '16px' }}
              />
            )}
          </div>
          <div className="camera-btn">
            <label htmlFor={Loadtype==1?"upDate":"diffupDate"}>
            <Input
                type="file"
                ref={this.fileInput}
                accept="image/*"
                id={Loadtype==1?"upDate":"diffupDate"}
                onChange={this.fileInputChange}
                style={{ visibility: 'hidden', position: 'fixed' }}
              />
              {!this.state.loading&&!RealImgurl&&<img src={camsea} />}
            </label>
          </div>
          <div className="search-btn" onClick={this.search}>
            <img src={search} alt="" />
          </div>
          {RealImgurl? (
            <div className="img-view">
              <div className="img-box">
                <img src={RealImgurl} alt="" />
              </div>
            </div>
          ):
          <React.Fragment>
         {this.state.loading&&<div className="img-view" style={{marginLeft:3,marginTop:2}}>
              <div className="img-box">
          <Spin size='small' spinning={this.state.loading}/>
          </div>
          </div>}
          </React.Fragment>
          }
        </div>
      </div>
    );
  }
}

export default UploadInput;