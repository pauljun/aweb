import React from 'react';
import IconFont from 'src/components/IconFont';
import { withRouter } from 'react-router-dom';
import { BusinessProvider } from 'src/utils/Decorator/BusinessProvider';
import DeviceIcon from 'src/components/DeviceIcon';
import { CameraType, DeviceState } from '../../../../../libs/DeviceLib';
import { Popover } from 'antd';
import '../index.scss';


const deviceType = CameraType.filter(v => v.value !== '-1');
const deviceData = DeviceState.filter(v => v.value !== '-1');

@withRouter
@BusinessProvider('TabStore')
export default class View extends React.Component {
	state = {
		type: deviceType.map(v => v.value),
    status: deviceData.map(v => v.value)
	};
	goSetting = () => {
    if(this.props.fullStatus){
      this.props.fullEvent(false)
    }
    const { TabStore, history } = this.props;
    let tabs = TabStore.tabList.filter(v => v.title === '自定义辖区面板')
    if(!tabs.length){
      TabStore.goPage({
        moduleName: 'JurisdictionOverview',
        childModuleName: 'PanelSetting',
        history,
        data: {
          ids: this.props.ids
        }
      })
    }else{
      TabStore.changeTab(tabs[0].id, history)
    }
	};
  changeMapMarker(changeType, code, flag) {
    const { clusterMarker } = this.props;
    const state = this.state;
    const index = state[changeType].indexOf(code);
    if (index > -1) {
      state[changeType].splice(index, 1);
    } else {
      state[changeType].push(code);
    }
    this.setState({ [changeType]: state[changeType] }, () => {
      clusterMarker.showCustomMarker(this.state.type, this.state.status);
    });
  }
	getPopupContent = () => {
    const { type, status } = this.state;
    return (
      <div className="type-popup-layout">
        <div className="type-part">
          <div className="type-name">设备种类</div>
          <div className="type-content">
            {deviceType.map(item => (
              <div
                className={`type-item ${
                  type.indexOf(item.value) > -1 ? 'active' : ''
                } `}
                key={item.value}
                onClick={() => this.changeMapMarker('type', item.value)}
              >
                <span className="icon">
                  <DeviceIcon
                    type={item.value}
                    theme="outlined"
                  />
                </span>
                <span className="lable-text">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="type-part">
          <div className="type-name">在离线状态：</div>
          <div className="type-content">
            {deviceData.map(item => (
              <div
                className={`type-item ${
                  status.indexOf(item.value) > -1 ? 'active' : ''
                } `}
                key={item.value}
                onClick={() => this.changeMapMarker('status', item.value)}
              >
                <span className="icon">
                  <IconFont
                    type={
                      item.value === '1'
                        ? 'icon-OnLine_Main'
                        : 'icon-OffLine_Main'
                    }
                    theme="outlined"
                  />
                </span>
                <span className="lable-text">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
	render() {
		const {fullStatus ,spacing,fullEvent} = this.props;
		return (
			<div className="tools-wrapper">
				<div className={`container ${fullStatus && 'full'}`}>
					<div className="item" onClick={this.goSetting}>
						<IconFont type="icon-DataPanel_Main" />
						面板
					</div>

					<div className="tools-resource" style={{opacity:0}}>
						<div className="item">
								<IconFont type="icon-Layer_Main" />
								设备
						</div>
					</div>
					<div className="item" onClick={() => this.props.resetMap()}>
						<IconFont type="icon-Reduction_Dark" />
						复位
					</div>
					<div className="item" onClick={() => fullEvent()}>
						<IconFont type={fullStatus ? 'icon-ExitFull_Main' : 'icon-Full_Main'} />
						{fullStatus ? '窗口' : '全屏'}
					</div>
					<style jsx='true'>{`
					.home-bg .ant-popover{
						top:${spacing >= 20 ? '37' : spacing >= 10 ? '37' : '37'}px!important;
						left:${spacing >= 20 ? '-158' : spacing >= 10 ? '-158' : '-158'}px!important;
					}
					`}</style>
				</div>
			</div>
		);
	}
}
