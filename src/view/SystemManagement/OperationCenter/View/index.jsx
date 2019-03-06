import React from 'react';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import { Button, message } from 'antd';
import IconFont from 'src/components/IconFont';
import ViewItem from '../components/ViewItem';
import MapCenter from '../../components/MapZoomAndLevel';

@BusinessProvider('OperationCenterStore')
class view extends React.Component {
  baseUrl = `${window.location.origin}/login/`
  state = {
    data: {
      userInfo: {}
    }
  };
  componentWillMount() {
    const {
      OperationCenterStore,
      ocId
    } = this.props;
    OperationCenterStore.getDetail(ocId).then(data => {
      this.setState({ data });
    });
  }
  render() {
    const { data } = this.state;
    if (!data.systemName) {
      return null
    }
    let url = data.loginKeyUrl ? data.loginKeyUrl : ''
    return (
      <InfoView
        key="optCenterInfoView"
        data={data}
        url={this.baseUrl + url}
        {...this.props}
      />
    )
  }
}

/**复制url */
function copy() {
  var Url2 = document.getElementById("coLogoDefault");
  Url2.select();
  document.execCommand("Copy");
  message.success("复制成功!");
}

function Pointparse(point) {
  let arr = point.split(',');
  return [arr[0] * 1, arr[1] * 1]
}

function InfoView(props) {
  const { data, url, changeModel } = props;
  const zoomLevelCenter = {
    zoom: data.zoomLevelCenter,
    center: data.centerPoint ? Pointparse(data.centerPoint) : null
  }
  console.log(data.zoomLevelCenter)
  return (
    <React.Fragment>
      <div className="optCenter-wrapper">
        <div className="setting-operation-center-eidt">
          <div className='operation-center-nav'>
            <Button
              onClick={changeModel}
            >
              <IconFont type='icon-Edit_Main' />
              编辑
            </Button>
          </div>
          <h3>基本信息</h3>
          <div className="info-view-part" />
          <ViewItem label="运营中心名称" required>
            {data.centerName}
          </ViewItem>
          <ViewItem label="联系人姓名">{data.contactPerson}</ViewItem>
          <ViewItem label="联系人电话">{data.contactPhone}</ViewItem>
          <h3>登录页信息</h3>
          <ViewItem label="登录账号">{data.userInfo.loginName}</ViewItem>
          <ViewItem label="登录手机号">{data.userInfo.phoneNum}</ViewItem>
          <ViewItem label="地图初始状态">
            <div className='map-init-wrapper'>
              <MapCenter
                zoomLevelCenter={zoomLevelCenter}
              />
            </div>
          </ViewItem>
          <h3>登录页</h3>
          <ViewItem label="系统名称">{data.systemName}</ViewItem>
          <ViewItem label="系统logo">
            <div className='system-logo-view'>
              <img src={data.systemLogo} />
            </div>
          </ViewItem>
          <ViewItem label="合作单位logo">
            <div className='system-cologo-view'>
              <img className='co-logo-wrapper' src={data.coLogo} />
            </div>
          </ViewItem>
          <ViewItem label='运营中心URL'>
            <div className='login-view-look'>
              <input
                type='text'
                id='coLogoDefault'
                defaultValue={url}
              />
              <span>{url}</span>
              <Button
                onClick={copy}
                className='login-url-copy'
              >
                <IconFont type='icon-Version_Main' />
                复制链接
						  </Button>
            </div>
          </ViewItem>
        </div>
      </div>
    </React.Fragment>
  );
}

export default view;
