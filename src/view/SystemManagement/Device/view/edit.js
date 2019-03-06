import React from 'react';
import DeviceInfo from '../components/DeviceInfo';
import BaseInfo from '../components/BaseInfo';
import FunInfo from '../components/FunInfo';
import MotionFindInfo from '../components/MotionFindInfo';
import OSDInfo from '../components/OSDInfo';
import { withRouter } from 'react-router-dom';
import { Form, Button, message } from 'antd';
import { searchFormat } from '../../../../utils';
import { toJS } from 'mobx';
import { BusinessProvider } from '../../../../utils/Decorator/BusinessProvider';
import Loading from '../../../../components/Loading';
import NoData from '../../../../components/NoData';
import { observer } from 'mobx-react';
import Socket from '../../../../libs/Socket';
import { errorBoundary } from '../../../../utils/Decorator';

import '../style/edit.scss';

@errorBoundary
@withRouter
@BusinessProvider(
  'DeviceManagementStore',
  'DeviceEditStore',
  'DeviceStore',
  'TabStore'
)
@observer
@Form.create({
  onFieldsChange: (props, files) => {
    const { DeviceEditStore } = props;
    let data = {};
    Object.keys(files).map(key => {
      data[key] = files[key].value;
    });
    DeviceEditStore.mergeFormData(data);
  }
})
export default class DeviceEdit extends React.Component {
  constructor(props) {
    super(props);
    let isView = false;
    try {
      isView = !!props.location.state.pageState.isView;
    } catch (e) {}
    this.state = {
      isView,
      info: {},
      otherInfo: {},
      initData: false,
      noData: false
    };
  }
  componentWillMount() {
    const { DeviceStore, location, DeviceManagementStore } = this.props;
    let params = searchFormat(location.search);
    let cameraInfo = toJS(DeviceStore.queryCameraById(params.id));
    if (!cameraInfo) {
      this.setState({ noData: true, initData: true });
      return;
    }

    
    DeviceManagementStore.getCameraInfoByDeviceId(params.id)
      .then(res => {
        const id = cameraInfo.manufacturerDeviceId || cameraInfo.id;
        const name = cameraInfo.deviceName || cameraInfo.name;
        const deviceType = cameraInfo.deviceType;
        let ptzType;
        try {
          ptzType = cameraInfo.extJson.cameraInfo.type;
        } catch (e) {
          ptzType = null;
        }
        // DeviceStore.getDeviceStatus([id]).then(result => {
        //   if(result) {
        //     cameraInfo.cover = result.devices[0].cover_url;
        //   }
        //   this.setState({
        //     info: cameraInfo,
        //     otherInfo: res.result,
        //     initData: true,
        //     noData: false
        //   });
        // })
        DeviceStore.asyncGetCurrentVideoList(
          [id],
          [name],
          [deviceType],
          [ptzType]
        ).then(fileData => {
          cameraInfo.file = fileData[0].file;
          this.setState({
            info: cameraInfo,
            otherInfo: res.result,
            initData: true,
            noData: false
          });
        });
      })
      .catch(() => {
        this.setState({ noData: true, initData: true });
      });
  }
  subEditForm = () => {
    const { form, DeviceEditStore } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      DeviceEditStore.updateCameraInfo().then(res => {
        Socket.emit('deviceEdit');
        message.success('操作成功！');
      });
    });
  };
  cancelEdit = () => {
    const { TabStore, history } = this.props;
    TabStore.closeCurrentTab({ history });
  };
  render() {
    const { form } = this.props;
    const { info, otherInfo, initData, isView, noData } = this.state;
    if (!initData) {
      return <Loading />;
    }
    if (noData) {
      return <NoData />;
    }
    const deviceInfo = Object.assign(info, otherInfo);
    return (
      <div
        className={`device-edit-layout ${isView ? 'device-detail-layout' : ''}`}
      >
        <div className="noTreeTitle">{isView ? '查看设备' : '设备编辑'}</div>
        <div className="device-contianer">
          <div className="device-edit-scroller">
            <div className="device-edit-content">
              <DeviceInfo info={deviceInfo} />
              <BaseInfo form={form} info={deviceInfo} isView={isView} />
              {info.deviceType * 1 !== 100602 && (
                <React.Fragment>
                  <FunInfo form={form} info={deviceInfo} isView={isView} />{' '}
                  <MotionFindInfo
                    form={form}
                    info={deviceInfo}
                    isView={isView}
                  />
                </React.Fragment>
              )}
              <OSDInfo form={form} info={deviceInfo} isView={isView} />
            </div>
            {!isView && (
              <div className="setting-edit-btns">
                <Button onClick={this.cancelEdit}>取消</Button>
                <Button className="orange-btn" onClick={this.subEditForm}>
                  保存
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
